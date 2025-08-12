// lib/mindstudio.js

export async function fetchMindStudioResponse(userInput) {
  try {
    const response = await fetch("/api/mindstudio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userInput }),
    });

    const data = await response.json();

    if (data?.success) {
      return data.result || "I'm not sure how to answer that.";
    } else {
      return "Sorry, I couldn't process that request.";
    }
  } catch (error) {
    console.error("MindStudio client error:", error);
    return "Oops! Something went wrong while contacting the AI.";
  }
}
