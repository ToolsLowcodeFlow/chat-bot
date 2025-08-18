// ///////////////////////////////////////// this code is running perfect for mindstudio response with main.flow mindstudio agent///////////////////
// // app/api/chat/mindstudio/route.js
// import { NextResponse } from 'next/server';

// // MindStudio API constants from environment variables
// const MINDSTUDIO_API_KEY = process.env.MINDSTUDIO_API_KEY;
// const MINDSTUDIO_WORKER_ID = process.env.MINDSTUDIO_WORKER_ID;
// const MINDSTUDIO_WORKFLOW = process.env.MINDSTUDIO_WORKFLOW || "Main.flow";

// export async function POST(request) {
//   try {
//     // Check if environment variables are set
//     if (!MINDSTUDIO_API_KEY || !MINDSTUDIO_WORKER_ID) {
//       console.error('Missing MindStudio environment variables');
//       return NextResponse.json(
//         { error: 'Server configuration error. Please contact support.' },
//         { status: 500 }
//       );
//     }

//     // Parse request body
//     const { user_prompt } = await request.json();

//     if (!user_prompt || typeof user_prompt !== 'string') {
//       return NextResponse.json(
//         { error: 'user_prompt is required and must be a string' },
//         { status: 400 }
//       );
//     }

//     console.log('Sending to MindStudio:', { 
//       workerId: MINDSTUDIO_WORKER_ID,
//       user_prompt,
//       workflow: MINDSTUDIO_WORKFLOW 
//     });

//     // Make request to MindStudio API
//     const response = await fetch(
//       "https://v1.mindstudio-api.com/developer/v2/agents/run",
//       {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${MINDSTUDIO_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           workerId: MINDSTUDIO_WORKER_ID,
//           variables: {
//             user_prompt: user_prompt
//           },
//           workflow: MINDSTUDIO_WORKFLOW,
//         }),
//       }
//     );

//     const responseText = await response.text();
//     console.log('Raw MindStudio Response:', responseText);

//     if (!response.ok) {
//       console.error(`MindStudio API error: ${response.status} ${response.statusText}`);
//       console.error('Response body:', responseText);
//       return NextResponse.json(
//         { error: `API request failed with status ${response.status}` },
//         { status: response.status }
//       );
//     }

//     let data;
//     try {
//       data = JSON.parse(responseText);
//     } catch (parseError) {
//       console.error('Failed to parse MindStudio response:', parseError);
//       return NextResponse.json(
//         { error: 'Invalid response format from AI service' },
//         { status: 500 }
//       );
//     }

//     console.log('Parsed MindStudio Response:', data);

//     // Handle different response formats based on your screenshots
//     if (data?.result) {
//       return NextResponse.json({
//         success: true,
//         result: data.result
//       });
//     } else if (data?.success && data?.data) {
//       return NextResponse.json({
//         success: true,
//         result: data.data
//       });
//     } else if (data?.error) {
//       console.error('MindStudio API error:', data.error);
//       return NextResponse.json(
//         { error: data.error },
//         { status: 400 }
//       );
//     } else {
//       // Fallback - return the entire response if structure is unexpected
//       console.warn('Unexpected MindStudio response format:', data);
//       const fallbackResult = data?.message || data?.response || JSON.stringify(data);
//       return NextResponse.json({
//         success: true,
//         result: fallbackResult || "I received your message but couldn't process it properly. Please try again."
//       });
//     }

//   } catch (error) {
//     console.error('MindStudio API route error:', error);
    
//     if (error.name === 'TypeError' && error.message.includes('fetch')) {
//       return NextResponse.json(
//         { error: 'Unable to connect to MindStudio API. Please try again.' },
//         { status: 503 }
//       );
//     }

//     return NextResponse.json(
//       { error: 'Internal server error while processing your request.' },
//       { status: 500 }
//     );
//   }
// }

// // Handle preflight requests for CORS
// export async function OPTIONS(request) {
//   return new Response(null, {
//     status: 200,
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods': 'POST, OPTIONS',
//       'Access-Control-Allow-Headers': 'Content-Type',
//     },
//   });
// }

// ///////////////////////////////////////// mindstudio response with General.flow///////////////////
// // app/api/chat/mindstudio/route.js
// import { NextResponse } from 'next/server';

// // MindStudio API constants from environment variables
// const MINDSTUDIO_API_KEY = process.env.MINDSTUDIO_API_KEY;
// const MINDSTUDIO_WORKER_ID = process.env.MINDSTUDIO_WORKER_ID;
// const MINDSTUDIO_WORKFLOW = process.env.MINDSTUDIO_WORKFLOW || "General.flow";

// export async function POST(request) {
//   try {
//     // Check if environment variables are set
//     if (!MINDSTUDIO_API_KEY || !MINDSTUDIO_WORKER_ID) {
//       console.error('Missing MindStudio environment variables');
//       return NextResponse.json(
//         { error: 'Server configuration error. Please contact support.' },
//         { status: 500 }
//       );
//     }

//     // Parse request body
//     const { user_prompt, history, session_id } = await request.json();

//     if (!user_prompt || typeof user_prompt !== 'string') {
//       return NextResponse.json(
//         { error: 'user_prompt is required and must be a string' },
//         { status: 400 }
//       );
//     }

//     // Prepare the variables for MindStudio
//     const variables = {
//       user_prompt: user_prompt,
//     };

//     // Add history if provided
//     if (history && typeof history === 'string' && history.trim() !== '') {
//       variables.history = history;
//     }

//     // Add session ID if provided
//     if (session_id) {
//       variables.session_id = session_id.toString();
//     }

//     console.log('Sending to MindStudio:', { 
//       workerId: MINDSTUDIO_WORKER_ID,
//       variables,
//       workflow: MINDSTUDIO_WORKFLOW 
//     });

//     // Make request to MindStudio API
//     const response = await fetch(
//       "https://v1.mindstudio-api.com/developer/v2/agents/run",
//       {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${MINDSTUDIO_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           workerId: MINDSTUDIO_WORKER_ID,
//           variables: variables,
//           workflow: MINDSTUDIO_WORKFLOW,
//         }),
//       }
//     );

//     const responseText = await response.text();
//     console.log('Raw MindStudio Response:', responseText);

//     if (!response.ok) {
//       console.error(`MindStudio API error: ${response.status} ${response.statusText}`);
//       console.error('Response body:', responseText);
//       return NextResponse.json(
//         { error: `API request failed with status ${response.status}` },
//         { status: response.status }
//       );
//     }

//     let data;
//     try {
//       data = JSON.parse(responseText);
//       console.log('Initial parsed data:', data);
      
//       // Check if data is a string that contains JSON (double-encoded JSON)
//       if (typeof data === 'string') {
//         try {
//           console.log('Attempting to parse data as nested JSON string');
//           data = JSON.parse(data);
//           console.log('Re-parsed data:', data);
//         } catch (nestedParseError) {
//           console.log('Data is not nested JSON, keeping as string');
//         }
//       }
      
//     } catch (parseError) {
//       console.error('Failed to parse MindStudio response:', parseError);
//       return NextResponse.json(
//         { error: 'Invalid response format from AI service' },
//         { status: 500 }
//       );
//     }

//     console.log('Parsed MindStudio Response:', data);

//     // Function to format car data into readable text
//     const formatCarData = (carData) => {
//       console.log('formatCarData called with:', carData, 'Type:', typeof carData);
      
//       if (typeof carData === 'object' && carData !== null) {
//         // If it has a reply field, prioritize that as it's the formatted response
//         if (carData.reply && carData.reply.trim() !== '') {
//           console.log('Found reply in formatCarData:', carData.reply);
//           return carData.reply.trim();
//         }
        
//         // Otherwise format the car data
//         let carText = '';
//         if (carData.name) carText += `Car: ${carData.name}\n`;
//         if (carData.price_gbp) {
//           // Format price with thousands separator
//           const formattedPrice = new Intl.NumberFormat('en-GB').format(carData.price_gbp);
//           carText += `Price: £${formattedPrice}\n`;
//         }
//         if (carData.id) carText += `ID: ${carData.id}\n`;
//         return carText.trim();
//       }
//       return String(carData);
//     };

//     // Handle MindStudio response structure
//     let resultText = '';
    
//     // PRIORITY 1: Check for MindStudio's actual response structure with nested result
//     if (data && data.success && data.result && typeof data.result === 'object') {
//       console.log('Found MindStudio success response with result');
//       const resultData = data.result;
      
//       // Check if result has Reply/Response structure
//       if (resultData.hasOwnProperty('Reply') && resultData.hasOwnProperty('Response')) {
//         console.log('Found Reply/Response structure in result');
//         console.log('Response data:', JSON.stringify(resultData.Response, null, 2));
        
//         // FIRST: Check if Response.reply exists and use it (this is what you want to display)
//         if (resultData.Response && typeof resultData.Response === 'object' && resultData.Response.reply && resultData.Response.reply.trim() !== '') {
//           console.log('Using Response.reply:', resultData.Response.reply);
//           return NextResponse.json({
//             success: true,
//             result: resultData.Response.reply.trim()
//           });
//         }
        
//         // SECOND: If Response.reply doesn't exist, format the Response object as car data
//         if (resultData.Response && typeof resultData.Response === 'object') {
//           console.log('Formatting Response object as car data');
//           resultText = formatCarData(resultData.Response);
//           return NextResponse.json({
//             success: true,
//             result: resultText
//           });
//         }
        
//         // LAST RESORT: Use Reply if Response is empty or invalid
//         if (resultData.Reply && typeof resultData.Reply === 'string' && resultData.Reply.trim() !== '') {
//           console.log('Using Reply field');
//           return NextResponse.json({
//             success: true,
//             result: resultData.Reply.trim()
//           });
//         }
//       }
      
//       // If result doesn't have Reply/Response structure, try to format it directly
//       resultText = formatCarData(resultData);
//       return NextResponse.json({
//         success: true,
//         result: resultText
//       });
//     }
    
//     // PRIORITY 2: Check for the old direct structure: { "Reply": "", "Response": {...} }
//     if (data && typeof data === 'object' && data.hasOwnProperty('Reply') && data.hasOwnProperty('Response')) {
//       console.log('Found direct Reply/Response structure (fallback)');
//       console.log('Full data:', JSON.stringify(data, null, 2));
      
//       // FIRST: Check if Response.reply exists and use it
//       if (data.Response && typeof data.Response === 'object' && data.Response.reply && data.Response.reply.trim() !== '') {
//         console.log('Using direct Response.reply:', data.Response.reply);
//         return NextResponse.json({
//           success: true,
//           result: data.Response.reply.trim()
//         });
//       }
      
//       // SECOND: If Response.reply doesn't exist, format the Response object as car data
//       if (data.Response && typeof data.Response === 'object') {
//         console.log('Formatting direct Response object as car data');
//         resultText = formatCarData(data.Response);
//         return NextResponse.json({
//           success: true,
//           result: resultText
//         });
//       }
      
//       // LAST RESORT: Use Reply if Response is empty or invalid
//       if (data.Reply && typeof data.Reply === 'string' && data.Reply.trim() !== '') {
//         console.log('Using direct Reply field');
//         return NextResponse.json({
//           success: true,
//           result: data.Reply.trim()
//         });
//       }
      
//       console.log('No valid response found, using fallback');
//       return NextResponse.json({
//         success: true,
//         result: "I received your message but couldn't process it properly. Please try again."
//       });
//     }
    
//     // PRIORITY 2: Check if the response is directly a car object
//     if (data && typeof data === 'object' && data !== null && (data.id || data.name || data.price_gbp || data.reply)) {
//       resultText = formatCarData(data);
//       return NextResponse.json({
//         success: true,
//         result: resultText
//       });
//     }
    
//     // PRIORITY 3: Handle nested result structure
//     if (data?.result) {
//       if (typeof data.result === 'object' && data.result !== null) {
//         if (data.result.reply) {
//           resultText = data.result.reply;
//         } else if (data.result.id || data.result.name || data.result.price_gbp) {
//           resultText = formatCarData(data.result);
//         } else {
//           // Try to extract any string value from the object
//           const values = Object.values(data.result);
//           resultText = values.find(val => typeof val === 'string') || JSON.stringify(data.result);
//         }
//       } else {
//         resultText = String(data.result);
//       }
      
//       return NextResponse.json({
//         success: true,
//         result: resultText
//       });
//     } 
    
//     // PRIORITY 4: Handle data field
//     else if (data?.success && data?.data) {
//       if (typeof data.data === 'object' && data.data !== null) {
//         if (data.data.reply) {
//           resultText = data.data.reply;
//         } else if (data.data.id || data.data.name || data.data.price_gbp) {
//           resultText = formatCarData(data.data);
//         } else {
//           const values = Object.values(data.data);
//           resultText = values.find(val => typeof val === 'string') || JSON.stringify(data.data);
//         }
//       } else {
//         resultText = String(data.data);
//       }
      
//       return NextResponse.json({
//         success: true,
//         result: resultText
//       });
//     } 
    
//     // PRIORITY 5: Handle error responses
//     else if (data?.error) {
//       console.error('MindStudio API error:', data.error);
//       return NextResponse.json(
//         { error: data.error },
//         { status: 400 }
//       );
//     } 
    
//     // PRIORITY 6: Fallback for any other response format
//     else {
//       console.warn('Unexpected MindStudio response format:', data);
      
//       if (typeof data === 'string') {
//         // Try to parse as JSON first
//         try {
//           const parsedData = JSON.parse(data);
//           if (parsedData && typeof parsedData === 'object' && (parsedData.id || parsedData.name || parsedData.price_gbp || parsedData.reply)) {
//             resultText = formatCarData(parsedData);
//           } else {
//             resultText = data;
//           }
//         } catch {
//           resultText = data;
//         }
//       } else {
//         resultText = "I received your message but couldn't process it properly. Please try again.";
//       }
      
//       return NextResponse.json({
//         success: true,
//         result: resultText
//       });
//     }

//   } catch (error) {
//     console.error('MindStudio API route error:', error);
    
//     if (error.name === 'TypeError' && error.message.includes('fetch')) {
//       return NextResponse.json(
//         { error: 'Unable to connect to MindStudio API. Please try again.' },
//         { status: 503 }
//       );
//     }

//     return NextResponse.json(
//       { error: 'Internal server error while processing your request.' },
//       { status: 500 }
//     );
//   }
// }

// // Handle preflight requests for CORS
// export async function OPTIONS(request) {
//   return new Response(null, {
//     status: 200,
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods': 'POST, OPTIONS',
//       'Access-Control-Allow-Headers': 'Content-Type',
//     },
//   });
// }
///////////////////////////////////////// General.flow with Menu ///////////////////////////////
// import { NextResponse } from 'next/server';

// // MindStudio API constants from environment variables
// const MINDSTUDIO_API_KEY = process.env.MINDSTUDIO_API_KEY;
// const MINDSTUDIO_WORKER_ID = process.env.MINDSTUDIO_WORKER_ID;
// const MINDSTUDIO_WORKFLOW = process.env.MINDSTUDIO_WORKFLOW || "General.flow";

// export async function POST(request) {
//   try {
//     // Check if environment variables are set
//     if (!MINDSTUDIO_API_KEY || !MINDSTUDIO_WORKER_ID) {
//       console.error('Missing MindStudio environment variables');
//       return NextResponse.json(
//         { error: 'Server configuration error. Please contact support.' },
//         { status: 500 }
//       );
//     }

//     // Parse request body
//     const { user_prompt, history, session_id } = await request.json();

//     if (!user_prompt || typeof user_prompt !== 'string') {
//       return NextResponse.json(
//         { error: 'user_prompt is required and must be a string' },
//         { status: 400 }
//       );
//     }

//     // Prepare the variables for MindStudio
//     const variables = {
//       user_prompt: user_prompt,
//     };

//     // Add history if provided
//     if (history && typeof history === 'string' && history.trim() !== '') {
//       variables.history = history;
//     }

//     // Add session ID if provided
//     if (session_id) {
//       variables.session_id = session_id.toString();
//     }

//     console.log('Sending to MindStudio:', { 
//       workerId: MINDSTUDIO_WORKER_ID,
//       variables,
//       workflow: MINDSTUDIO_WORKFLOW 
//     });

//     // Make request to MindStudio API
//     const response = await fetch(
//       "https://v1.mindstudio-api.com/developer/v2/agents/run",
//       {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${MINDSTUDIO_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           workerId: MINDSTUDIO_WORKER_ID,
//           variables: variables,
//           workflow: MINDSTUDIO_WORKFLOW,
//         }),
//       }
//     );

//     const responseText = await response.text();
//     console.log('Raw MindStudio Response:', responseText);

//     if (!response.ok) {
//       console.error(`MindStudio API error: ${response.status} ${response.statusText}`);
//       console.error('Response body:', responseText);
//       return NextResponse.json(
//         { error: `API request failed with status ${response.status}` },
//         { status: response.status }
//       );
//     }

//     let data;
//     try {
//       data = JSON.parse(responseText);
//       console.log('Initial parsed data:', data);
      
//       // Check if data is a string that contains JSON (double-encoded JSON)
//       if (typeof data === 'string') {
//         try {
//           console.log('Attempting to parse data as nested JSON string');
//           data = JSON.parse(data);
//           console.log('Re-parsed data:', data);
//         } catch (nestedParseError) {
//           console.log('Data is not nested JSON, keeping as string');
//         }
//       }
      
//     } catch (parseError) {
//       console.error('Failed to parse MindStudio response:', parseError);
//       return NextResponse.json(
//         { error: 'Invalid response format from AI service' },
//         { status: 500 }
//       );
//     }

//     console.log('Parsed MindStudio Response:', data);

//     // Function to format car data into readable text
//     const formatCarData = (carData) => {
//       console.log('formatCarData called with:', carData, 'Type:', typeof carData);
      
//       if (typeof carData === 'object' && carData !== null) {
//         // If it has a reply field, prioritize that as it's the formatted response
//         if (carData.reply && carData.reply.trim() !== '') {
//           console.log('Found reply in formatCarData:', carData.reply);
//           return carData.reply.trim();
//         }
        
//         // Otherwise format the car data
//         let carText = '';
//         if (carData.name) carText += `Car: ${carData.name}\n`;
//         if (carData.price_gbp) {
//           // Format price with thousands separator
//           const formattedPrice = new Intl.NumberFormat('en-GB').format(carData.price_gbp);
//           carText += `Price: £${formattedPrice}\n`;
//         }
//         if (carData.id) carText += `ID: ${carData.id}\n`;
//         return carText.trim();
//       }
//       return String(carData);
//     };

//     // Check if the response indicates finance interest and should show menu
//     const shouldShowFinanceMenu = (responseText) => {
//       const financeKeywords = [
//         'interested in',
//         'finance',
//         'got it',
//         'you\'re interested',
//         '£',
//         'price'
//       ];
      
//       const lowerResponse = responseText.toLowerCase();
//       return financeKeywords.some(keyword => lowerResponse.includes(keyword)) &&
//              (lowerResponse.includes('interested') || lowerResponse.includes('finance'));
//     };

//     // Handle MindStudio response structure
//     let resultText = '';
//     let showMenu = false;
    
//     // PRIORITY 1: Check for MindStudio's actual response structure with nested result
//     if (data && data.success && data.result && typeof data.result === 'object') {
//       console.log('Found MindStudio success response with result');
//       const resultData = data.result;
      
//       // Check if result has Reply/Response structure
//       if (resultData.hasOwnProperty('Reply') && resultData.hasOwnProperty('Response')) {
//         console.log('Found Reply/Response structure in result');
//         console.log('Response data:', JSON.stringify(resultData.Response, null, 2));
        
//         // FIRST: Check if Response.reply exists and use it (this is what you want to display)
//         if (resultData.Response && typeof resultData.Response === 'object' && resultData.Response.reply && resultData.Response.reply.trim() !== '') {
//           console.log('Using Response.reply:', resultData.Response.reply);
//           const responseText = resultData.Response.reply.trim();
//           showMenu = shouldShowFinanceMenu(responseText);
          
//           return NextResponse.json({
//             success: true,
//             result: responseText,
//             showMenu: showMenu
//           });
//         }
        
//         // SECOND: If Response.reply doesn't exist, format the Response object as car data
//         if (resultData.Response && typeof resultData.Response === 'object') {
//           console.log('Formatting Response object as car data');
//           resultText = formatCarData(resultData.Response);
//           showMenu = shouldShowFinanceMenu(resultText);
          
//           return NextResponse.json({
//             success: true,
//             result: resultText,
//             showMenu: showMenu
//           });
//         }
        
//         // LAST RESORT: Use Reply if Response is empty or invalid
//         if (resultData.Reply && typeof resultData.Reply === 'string' && resultData.Reply.trim() !== '') {
//           console.log('Using Reply field');
//           return NextResponse.json({
//             success: true,
//             result: resultData.Reply.trim()
//           });
//         }
//       }
      
//       // If result doesn't have Reply/Response structure, try to format it directly
//       resultText = formatCarData(resultData);
//       return NextResponse.json({
//         success: true,
//         result: resultText
//       });
//     }
    
//     // PRIORITY 2: Check for the old direct structure: { "Reply": "", "Response": {...} }
//     if (data && typeof data === 'object' && data.hasOwnProperty('Reply') && data.hasOwnProperty('Response')) {
//       console.log('Found direct Reply/Response structure (fallback)');
//       console.log('Full data:', JSON.stringify(data, null, 2));
      
//       // FIRST: Check if Response.reply exists and use it
//       if (data.Response && typeof data.Response === 'object' && data.Response.reply && data.Response.reply.trim() !== '') {
//         console.log('Using direct Response.reply:', data.Response.reply);
//         return NextResponse.json({
//           success: true,
//           result: data.Response.reply.trim()
//         });
//       }
      
//       // SECOND: If Response.reply doesn't exist, format the Response object as car data
//       if (data.Response && typeof data.Response === 'object') {
//         console.log('Formatting direct Response object as car data');
//         resultText = formatCarData(data.Response);
//         return NextResponse.json({
//           success: true,
//           result: resultText
//         });
//       }
      
//       // LAST RESORT: Use Reply if Response is empty or invalid
//       if (data.Reply && typeof data.Reply === 'string' && data.Reply.trim() !== '') {
//         console.log('Using direct Reply field');
//         return NextResponse.json({
//           success: true,
//           result: data.Reply.trim()
//         });
//       }
      
//       console.log('No valid response found, using fallback');
//       return NextResponse.json({
//         success: true,
//         result: "I received your message but couldn't process it properly. Please try again."
//       });
//     }
    
//     // PRIORITY 2: Check if the response is directly a car object
//     if (data && typeof data === 'object' && data !== null && (data.id || data.name || data.price_gbp || data.reply)) {
//       resultText = formatCarData(data);
//       return NextResponse.json({
//         success: true,
//         result: resultText
//       });
//     }
    
//     // PRIORITY 3: Handle nested result structure
//     if (data?.result) {
//       if (typeof data.result === 'object' && data.result !== null) {
//         if (data.result.reply) {
//           resultText = data.result.reply;
//         } else if (data.result.id || data.result.name || data.result.price_gbp) {
//           resultText = formatCarData(data.result);
//         } else {
//           // Try to extract any string value from the object
//           const values = Object.values(data.result);
//           resultText = values.find(val => typeof val === 'string') || JSON.stringify(data.result);
//         }
//       } else {
//         resultText = String(data.result);
//       }
      
//       return NextResponse.json({
//         success: true,
//         result: resultText
//       });
//     } 
    
//     // PRIORITY 4: Handle data field
//     else if (data?.success && data?.data) {
//       if (typeof data.data === 'object' && data.data !== null) {
//         if (data.data.reply) {
//           resultText = data.data.reply;
//         } else if (data.data.id || data.data.name || data.data.price_gbp) {
//           resultText = formatCarData(data.data);
//         } else {
//           const values = Object.values(data.data);
//           resultText = values.find(val => typeof val === 'string') || JSON.stringify(data.data);
//         }
//       } else {
//         resultText = String(data.data);
//       }
      
//       return NextResponse.json({
//         success: true,
//         result: resultText
//       });
//     } 
    
//     // PRIORITY 5: Handle error responses
//     else if (data?.error) {
//       console.error('MindStudio API error:', data.error);
//       return NextResponse.json(
//         { error: data.error },
//         { status: 400 }
//       );
//     } 
    
//     // PRIORITY 6: Fallback for any other response format
//     else {
//       console.warn('Unexpected MindStudio response format:', data);
      
//       if (typeof data === 'string') {
//         // Try to parse as JSON first
//         try {
//           const parsedData = JSON.parse(data);
//           if (parsedData && typeof parsedData === 'object' && (parsedData.id || parsedData.name || parsedData.price_gbp || parsedData.reply)) {
//             resultText = formatCarData(parsedData);
//           } else {
//             resultText = data;
//           }
//         } catch {
//           resultText = data;
//         }
//       } else {
//         resultText = "I received your message but couldn't process it properly. Please try again.";
//       }
      
//       return NextResponse.json({
//         success: true,
//         result: resultText
//       });
//     }

//   } catch (error) {
//     console.error('MindStudio API route error:', error);
    
//     if (error.name === 'TypeError' && error.message.includes('fetch')) {
//       return NextResponse.json(
//         { error: 'Unable to connect to MindStudio API. Please try again.' },
//         { status: 503 }
//       );
//     }

//     return NextResponse.json(
//       { error: 'Internal server error while processing your request.' },
//       { status: 500 }
//     );
//   }
// }

// // Handle preflight requests for CORS
// export async function OPTIONS(request) {
//   return new Response(null, {
//     status: 200,
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods': 'POST, OPTIONS',
//       'Access-Control-Allow-Headers': 'Content-Type',
//     },
//   });
// }
/////////////////////////////////general.flow and Details.flow with menu CTA//////////////////////
import { NextResponse } from 'next/server';

const MINDSTUDIO_API_KEY = process.env.MINDSTUDIO_API_KEY;
const MINDSTUDIO_WORKER_ID = process.env.MINDSTUDIO_WORKER_ID;
const MINDSTUDIO_WORKFLOW_GENERAL = process.env.MINDSTUDIO_WORKFLOW_GENERAL || "General.flow";
const MINDSTUDIO_WORKFLOW_DETAILS = process.env.MINDSTUDIO_WORKFLOW_DETAILS || "Details.flow";

const UUID_RX = /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i;

function pickWorkflow(input) {
  if (!input) return MINDSTUDIO_WORKFLOW_GENERAL;
  const key = String(input).toLowerCase().trim();
  if (key === 'details' || key === 'details.flow') return MINDSTUDIO_WORKFLOW_DETAILS;
  if (key === 'general' || key === 'general.flow') return MINDSTUDIO_WORKFLOW_GENERAL;
  return input;
}

function extractVehicleContext(any) {
  let vehicle_id = null;
  let vehicle_name = null;

  const scan = (v) => {
    if (!v) return;
    if (typeof v === 'string') {
      if (!vehicle_id) {
        const m = v.match(UUID_RX);
        if (m) vehicle_id = m[0];
      }
      if (!vehicle_name) {
        const firstLine = v.split('\n')[0] || v;
        const cleaned = firstLine.replace(/^got it\s*[-—]\s*you[’']?re interested in\s*/i, '').trim();
        const nameGuess = cleaned.split('—')[0].trim();
        if (nameGuess && nameGuess.length > 2 && nameGuess.length < 140) vehicle_name = nameGuess;
      }
    } else if (Array.isArray(v)) {
      v.forEach(scan);
    } else if (typeof v === 'object') {
      for (const [k, val] of Object.entries(v)) {
        if (!vehicle_id && /^(vehicle_)?id$|stock_id/i.test(k) && typeof val === 'string' && UUID_RX.test(val)) {
          vehicle_id = val;
        }
        if (!vehicle_name && /(full_name|name|title)/i.test(k) && typeof val === 'string' && val.trim()) {
          vehicle_name = val.trim();
        }
        scan(val);
      }
    }
  };

  scan(any);
  return { vehicle_id, vehicle_name };
}

export async function POST(request) {
  try {
    if (!MINDSTUDIO_API_KEY || !MINDSTUDIO_WORKER_ID) {
      console.error('Missing MindStudio environment variables');
      return NextResponse.json({ error: 'Server configuration error. Please contact support.' }, { status: 500 });
    }

    const body = await request.json();
    const { user_prompt, history, session_id, workflow, vehicle_id: vehicleIdFromClient } = body || {};

    if (!user_prompt || typeof user_prompt !== 'string') {
      return NextResponse.json({ error: 'user_prompt is required and must be a string' }, { status: 400 });
    }

    const selectedWorkflow = pickWorkflow(workflow);

    const variables = { user_prompt };
    if (history && typeof history === 'string' && history.trim() !== '') variables.history = history;
    if (session_id) variables.session_id = session_id.toString();
    if (selectedWorkflow === MINDSTUDIO_WORKFLOW_DETAILS && vehicleIdFromClient) {
      variables.vehicle_id = vehicleIdFromClient;
    }

    console.log('Sending to MindStudio:', { 
      workerId: MINDSTUDIO_WORKER_ID,
      variables,
      workflow: selectedWorkflow
    });

    const response = await fetch("https://v1.mindstudio-api.com/developer/v2/agents/run", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${MINDSTUDIO_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workerId: MINDSTUDIO_WORKER_ID,
        variables,
        workflow: selectedWorkflow,
      }),
    });

    const responseText = await response.text();
    console.log('Raw MindStudio Response:', responseText);

    if (!response.ok) {
      console.error(`MindStudio API error: ${response.status} ${response.statusText}`);
      console.error('Response body:', responseText);
      return NextResponse.json({ error: `API request failed with status ${response.status}` }, { status: response.status });
    }

    let data;
    try {
      data = JSON.parse(responseText);
      if (typeof data === 'string') {
        try { data = JSON.parse(data); } catch (_) {}
      }
    } catch (parseError) {
      console.error('Failed to parse MindStudio response:', parseError);
      return NextResponse.json({ error: 'Invalid response format from AI service' }, { status: 500 });
    }

    const formatCarData = (carData) => {
      if (typeof carData === 'object' && carData !== null) {
        if (carData.reply && carData.reply.trim() !== '') return carData.reply.trim();
        let carText = '';
        if (carData.name) carText += `Car: ${carData.name}\n`;
        if (carData.price_gbp) {
          const formattedPrice = new Intl.NumberFormat('en-GB').format(carData.price_gbp);
          carText += `Price: £${formattedPrice}\n`;
        }
        if (carData.id) carText += `ID: ${carData.id}\n`;
        return carText.trim();
      }
      return String(carData);
    };

    const shouldShowFinanceMenu = (text) => {
      const financeKeywords = ['interested in','finance','got it','you\'re interested','£','price'];
      const lower = (text || '').toLowerCase();
      return financeKeywords.some(k => lower.includes(k)) && (lower.includes('interested') || lower.includes('finance'));
    };

    const emit = (payload, rawForContext) => {
      const ctx = extractVehicleContext(rawForContext ?? payload);
      return NextResponse.json({ ...payload, vehicle_id: ctx.vehicle_id || null, vehicle_name: ctx.vehicle_name || null, workflow: selectedWorkflow });
    };

    let resultText = '';
    let showMenu = false;

    if (data && data.success && data.result && typeof data.result === 'object') {
      const resultData = data.result;
      if (resultData.hasOwnProperty('Reply') && resultData.hasOwnProperty('Response')) {
        if (resultData.Response && typeof resultData.Response === 'object' && resultData.Response.reply && resultData.Response.reply.trim() !== '') {
          const t = resultData.Response.reply.trim();
          showMenu = shouldShowFinanceMenu(t);
          return emit({ success: true, result: t, showMenu }, data);
        }
        if (resultData.Response && typeof resultData.Response === 'object') {
          resultText = formatCarData(resultData.Response);
          showMenu = shouldShowFinanceMenu(resultText);
          return emit({ success: true, result: resultText, showMenu }, data);
        }
        if (resultData.Reply && typeof resultData.Reply === 'string' && resultData.Reply.trim() !== '') {
          return emit({ success: true, result: resultData.Reply.trim() }, data);
        }
      }
      resultText = formatCarData(resultData);
      return emit({ success: true, result: resultText }, data);
    }

    if (data && typeof data === 'object' && data.hasOwnProperty('Reply') && data.hasOwnProperty('Response')) {
      if (data.Response && typeof data.Response === 'object' && data.Response.reply && data.Response.reply.trim() !== '') {
        return emit({ success: true, result: data.Response.reply.trim() }, data);
      }
      if (data.Response && typeof data.Response === 'object') {
        resultText = formatCarData(data.Response);
        return emit({ success: true, result: resultText }, data);
      }
      if (data.Reply && typeof data.Reply === 'string' && data.Reply.trim() !== '') {
        return emit({ success: true, result: data.Reply.trim() }, data);
      }
      return emit({ success: true, result: "I received your message but couldn't process it properly. Please try again." }, data);
    }

    if (data && typeof data === 'object' && (data.id || data.name || data.price_gbp || data.reply)) {
      resultText = formatCarData(data);
      return emit({ success: true, result: resultText }, data);
    }

    if (data?.result) {
      if (typeof data.result === 'object' && data.result !== null) {
        if (data.result.reply) resultText = data.result.reply;
        else if (data.result.id || data.result.name || data.result.price_gbp) resultText = formatCarData(data.result);
        else {
          const values = Object.values(data.result);
          resultText = values.find(v => typeof v === 'string') || JSON.stringify(data.result);
        }
      } else resultText = String(data.result);
      return emit({ success: true, result: resultText }, data);
    } else if (data?.success && data?.data) {
      if (typeof data.data === 'object' && data.data !== null) {
        if (data.data.reply) resultText = data.data.reply;
        else if (data.data.id || data.data.name || data.data.price_gbp) resultText = formatCarData(data.data);
        else {
          const values = Object.values(data.data);
          resultText = values.find(v => typeof v === 'string') || JSON.stringify(data.data);
        }
      } else resultText = String(data.data);
      return emit({ success: true, result: resultText }, data);
    } else if (data?.error) {
      return NextResponse.json({ error: data.error }, { status: 400 });
    } else {
      let fallback = "I received your message but couldn't process it properly. Please try again.";
      if (typeof data === 'string') {
        try {
          const parsed = JSON.parse(data);
          if (parsed && typeof parsed === 'object' && (parsed.id || parsed.name || parsed.price_gbp || parsed.reply)) {
            fallback = formatCarData(parsed);
          } else { fallback = data; }
        } catch { fallback = data; }
      }
      return emit({ success: true, result: fallback }, data);
    }
  } catch (error) {
    console.error('MindStudio API route error:', error);
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return NextResponse.json({ error: 'Unable to connect to MindStudio API. Please try again.' }, { status: 503 });
    }
    return NextResponse.json({ error: 'Internal server error while processing your request.' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
