// /app/api/test-credentials/route.js
export async function GET(req) {
  // Get credentials from environment variables
  const apiKey = process.env.AUTOTRADER_API_KEY;
  const apiSecret = process.env.AUTOTRADER_API_SECRET;

  // Check if credentials exist
  if (!apiKey || !apiSecret) {
    return Response.json({
      error: "AutoTrader API credentials not found in environment variables",
      missing: {
        AUTOTRADER_API_KEY: !apiKey,
        AUTOTRADER_API_SECRET: !apiSecret
      }
    }, { status: 500 });
  }

  const results = [];

  try {
    const response = await fetch("https://api-sandbox.autotrader.co.uk/authenticate", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `key=${apiKey}&secret=${apiSecret}`
    });

    const text = await response.text();
    
    results.push({
      key: apiKey,
      secret: apiSecret.substring(0, 10) + "...", // Partially hide secret for security
      status: response.status,
      success: response.ok,
      response: text,
      timestamp: new Date().toISOString()
    });

    // If authentication successful, also test the stock API
    if (response.ok) {
      try {
        const authData = JSON.parse(text);
        const accessToken = authData.access_token;

        if (accessToken) {
          const stockResponse = await fetch("https://api-sandbox.autotrader.co.uk/stock?advertiserId=66897&page=1&pageSize=1", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${accessToken}`,
              "Accept": "*/*",
              "Content-Type": "application/json",
            }
          });

          const stockText = await stockResponse.text();
          
          results.push({
            test: "Stock API Test",
            status: stockResponse.status,
            success: stockResponse.ok,
            response: stockText.substring(0, 500) + "...", // Truncate for readability
            timestamp: new Date().toISOString()
          });
        }
      } catch (stockError) {
        results.push({
          test: "Stock API Test",
          error: stockError.message,
          timestamp: new Date().toISOString()
        });
      }
    }

  } catch (err) {
    results.push({
      key: apiKey,
      secret: apiSecret.substring(0, 10) + "...",
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }

  return Response.json({ 
    results,
    environment: process.env.NODE_ENV || "development",
    credentialsFound: {
      AUTOTRADER_API_KEY: !!apiKey,
      AUTOTRADER_API_SECRET: !!apiSecret
    }
  });
}