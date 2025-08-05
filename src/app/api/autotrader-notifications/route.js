import crypto from 'crypto';
import { supabase } from "@/app/lib/supabaseClient";

export const config = {
  api: {
    bodyParser: false,
  },
};


async function getRawBody(req) {
  const reader = req.body.getReader();
  let result = new Uint8Array(0);
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const temp = new Uint8Array(result.length + value.length);
    temp.set(result);
    temp.set(value, result.length);
    result = temp;
  }
  return Buffer.from(result);
}

export async function PUT(req) {
  const rawBodyBuffer = await getRawBody(req);
  const rawBody = rawBodyBuffer.toString('utf8');

  const signature = req.headers.get('autotrader-signature');
  if (!signature) {
    return new Response(JSON.stringify({ error: 'Missing signature' }), { status: 400 });
  }

  const [tPart, v1Part] = signature.split(',');
  const timestamp = tPart.split('=')[1];
  const receivedHash = v1Part.split('=')[1];

  const secret = process.env.AUTOTRADER_WEBHOOK_SECRET;
  const value = `${timestamp}.${rawBody}`;
  const computedHash = crypto.createHmac('sha256', secret).update(value).digest('hex');

  if (computedHash !== receivedHash) {
    return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 403 });
  }

  const event = JSON.parse(rawBody);

  if (event.type === 'STOCK_UPDATE') {
    const data = event.data;
    const metadata = data.metadata || {};
    const vehicle = data.vehicle || {};

    const { error } = await supabase.from('stock').upsert({
      id: metadata.stockId,
      advertiser_id: data.advertiser?.advertiserId || null,
      registration: vehicle.registration || null,
      make: vehicle.make || null,
      model: vehicle.model || null,
      derivative: vehicle.derivative || null,
      lifecycle_state: metadata.lifecycleState || null,
      last_updated: metadata.lastUpdated || null,
      raw: data, // optional: stores full data
    });

    if (error) {
      console.error('Supabase error:', error);
      return new Response(JSON.stringify({ error: 'DB insert failed' }), { status: 500 });
    }
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
