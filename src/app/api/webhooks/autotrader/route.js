// // app/api/webhooks/chat/route.js
// import { NextResponse } from 'next/server';
// import { supabase } from '@/app/lib/supabaseClient';

// export async function POST(request) {
//   try {
//     // Parse the incoming webhook payload
//     const body = await request.json();
    
//     // Log the webhook payload for debugging
//     console.log('Webhook received:', JSON.stringify(body, null, 2));
    
//     // Get headers for verification (optional)
//     const signature = request.headers.get('x-webhook-signature');
//     const source = request.headers.get('x-webhook-source') || 'unknown';
    
//     // Validate required fields
//     if (!body.session_id || !body.message || !body.sender) {
//       return NextResponse.json(
//         { error: 'Missing required fields: session_id, message, sender' },
//         { status: 400 }
//       );
//     }
    
//     // Process different webhook events
//     switch (body.event_type) {
//       case 'message.received':
//         await handleMessageReceived(body);
//         break;
//       case 'session.created':
//         await handleSessionCreated(body);
//         break;
//       case 'session.ended':
//         await handleSessionEnded(body);
//         break;
//       default:
//         console.log('Unknown event type:', body.event_type);
//     }
    
//     // Log webhook to database for audit trail
//     await logWebhookEvent(body, signature, source);
    
//     return NextResponse.json({ 
//       success: true, 
//       message: 'Webhook processed successfully',
//       timestamp: new Date().toISOString()
//     });
    
//   } catch (error) {
//     console.error('Webhook processing error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error', details: error.message },
//       { status: 500 }
//     );
//   }
// }

// async function handleMessageReceived(data) {
//   try {
//     // Save the message to database
//     const { error } = await supabase
//       .from('chat_messages')
//       .insert([{
//         session_id: parseInt(data.session_id),
//         sender: data.sender,
//         message: data.message,
//         metadata: data.metadata || null,
//         created_at: new Date().toISOString()
//       }]);
    
//     if (error) {
//       console.error('Error saving message from webhook:', error);
//       throw error;
//     }
    
//     console.log('Message saved from webhook successfully');
    
//     // Additional processing if needed
//     if (data.sender === 'user') {
//       // Trigger bot response or other automated actions
//       await triggerBotResponse(data.session_id, data.message);
//     }
    
//   } catch (error) {
//     console.error('Error handling message received:', error);
//     throw error;
//   }
// }

// async function handleSessionCreated(data) {
//   try {
//     // Verify session exists or create it
//     const { data: existingSession, error: selectError } = await supabase
//       .from('chat_sessions')
//       .select('session_id')
//       .eq('session_id', parseInt(data.session_id))
//       .single();
    
//     if (selectError && selectError.code === 'PGRST116') {
//       // Session doesn't exist, create it
//       const { error: insertError } = await supabase
//         .from('chat_sessions')
//         .insert([{ session_id: parseInt(data.session_id) }]);
      
//       if (insertError) {
//         console.error('Error creating session from webhook:', insertError);
//         throw insertError;
//       }
//     }
    
//     console.log('Session processed from webhook successfully');
    
//   } catch (error) {
//     console.error('Error handling session created:', error);
//     throw error;
//   }
// }

// async function handleSessionEnded(data) {
//   try {
//     // Update session end time or status
//     const { error } = await supabase
//       .from('chat_sessions')
//       .update({ 
//         ended_at: new Date().toISOString(),
//         status: 'ended'
//       })
//       .eq('session_id', parseInt(data.session_id));
    
//     if (error) {
//       console.error('Error ending session from webhook:', error);
//       throw error;
//     }
    
//     console.log('Session ended from webhook successfully');
    
//   } catch (error) {
//     console.error('Error handling session ended:', error);
//     throw error;
//   }
// }

// async function triggerBotResponse(sessionId, userMessage) {
//   try {
//     // Simple bot response logic (you can enhance this)
//     const botResponse = generateBotResponse(userMessage);
    
//     // Save bot response
//     const { error } = await supabase
//       .from('chat_messages')
//       .insert([{
//         session_id: parseInt(sessionId),
//         sender: 'bot',
//         message: botResponse,
//         created_at: new Date().toISOString()
//       }]);
    
//     if (error) {
//       console.error('Error saving bot response:', error);
//       throw error;
//     }
    
//     console.log('Bot response triggered successfully');
    
//   } catch (error) {
//     console.error('Error triggering bot response:', error);
//   }
// }

// function generateBotResponse(userMessage) {
//   const responses = [
//     "Thanks for your message! How can I help you further?",
//     "I understand. Let me assist you with that.",
//     "That's interesting! Tell me more.",
//     "I'm here to help. What would you like to know?"
//   ];
  
//   return responses[Math.floor(Math.random() * responses.length)];
// }

// async function logWebhookEvent(payload, signature, source) {
//   try {
//     // You might want to create a webhook_logs table for this
//     console.log('Webhook logged:', {
//       payload,
//       signature,
//       source,
//       timestamp: new Date().toISOString()
//     });
    
//     // Uncomment if you create a webhook_logs table
    
//     const { error } = await supabase
//       .from('webhook_logs')
//       .insert([{
//         payload: JSON.stringify(payload),
//         signature,
//         source,
//         created_at: new Date().toISOString()
//       }]);
    
//     if (error) console.error('Error logging webhook:', error);
    
    
//   } catch (error) {
//     console.error('Error logging webhook event:', error);
//   }
// }

// // Handle GET request for webhook verification (optional)
// export async function GET(request) {
//   const { searchParams } = new URL(request.url);
//   const challenge = searchParams.get('challenge');
  
//   if (challenge) {
//     // Return challenge for webhook verification
//     return NextResponse.json({ challenge });
//   }
  
//   return NextResponse.json({ 
//     message: 'Chat webhook endpoint is active',
//     timestamp: new Date().toISOString()
//   });
// }