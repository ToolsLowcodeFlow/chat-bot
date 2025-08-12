///////////////////////////////////////// this code is running perfect for mindstudio response///////////////////
// app/api/chat/mindstudio/route.js
import { NextResponse } from 'next/server';

// MindStudio API constants from environment variables
const MINDSTUDIO_API_KEY = process.env.MINDSTUDIO_API_KEY;
const MINDSTUDIO_WORKER_ID = process.env.MINDSTUDIO_WORKER_ID;
const MINDSTUDIO_WORKFLOW = process.env.MINDSTUDIO_WORKFLOW || "Main.flow";

export async function POST(request) {
  try {
    // Check if environment variables are set
    if (!MINDSTUDIO_API_KEY || !MINDSTUDIO_WORKER_ID) {
      console.error('Missing MindStudio environment variables');
      return NextResponse.json(
        { error: 'Server configuration error. Please contact support.' },
        { status: 500 }
      );
    }

    // Parse request body
    const { user_prompt } = await request.json();

    if (!user_prompt || typeof user_prompt !== 'string') {
      return NextResponse.json(
        { error: 'user_prompt is required and must be a string' },
        { status: 400 }
      );
    }

    console.log('Sending to MindStudio:', { 
      workerId: MINDSTUDIO_WORKER_ID,
      user_prompt,
      workflow: MINDSTUDIO_WORKFLOW 
    });

    // Make request to MindStudio API
    const response = await fetch(
      "https://v1.mindstudio-api.com/developer/v2/agents/run",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${MINDSTUDIO_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workerId: MINDSTUDIO_WORKER_ID,
          variables: {
            user_prompt: user_prompt
          },
          workflow: MINDSTUDIO_WORKFLOW,
        }),
      }
    );

    const responseText = await response.text();
    console.log('Raw MindStudio Response:', responseText);

    if (!response.ok) {
      console.error(`MindStudio API error: ${response.status} ${response.statusText}`);
      console.error('Response body:', responseText);
      return NextResponse.json(
        { error: `API request failed with status ${response.status}` },
        { status: response.status }
      );
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse MindStudio response:', parseError);
      return NextResponse.json(
        { error: 'Invalid response format from AI service' },
        { status: 500 }
      );
    }

    console.log('Parsed MindStudio Response:', data);

    // Handle different response formats based on your screenshots
    if (data?.result) {
      return NextResponse.json({
        success: true,
        result: data.result
      });
    } else if (data?.success && data?.data) {
      return NextResponse.json({
        success: true,
        result: data.data
      });
    } else if (data?.error) {
      console.error('MindStudio API error:', data.error);
      return NextResponse.json(
        { error: data.error },
        { status: 400 }
      );
    } else {
      // Fallback - return the entire response if structure is unexpected
      console.warn('Unexpected MindStudio response format:', data);
      const fallbackResult = data?.message || data?.response || JSON.stringify(data);
      return NextResponse.json({
        success: true,
        result: fallbackResult || "I received your message but couldn't process it properly. Please try again."
      });
    }

  } catch (error) {
    console.error('MindStudio API route error:', error);
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return NextResponse.json(
        { error: 'Unable to connect to MindStudio API. Please try again.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error while processing your request.' },
      { status: 500 }
    );
  }
}

// Handle preflight requests for CORS
export async function OPTIONS(request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
