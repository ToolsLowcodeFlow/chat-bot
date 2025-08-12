// app/api/mindstudio/route.js

export async function POST(req) {
  try {
    const { userInput } = await req.json();

    const response = await fetch(
      "https://v1.mindstudio-api.com/developer/v2/agents/run",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.MINDSTUDIO_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workerId: process.env.MINDSTUDIO_WORKER_ID,
          variables: { variable: userInput },
          workflow: process.env.MINDSTUDIO_WORKFLOW,
        }),
      }
    );

    const data = await response.json();

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error("MindStudio API error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
