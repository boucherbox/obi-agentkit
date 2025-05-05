import { AgentRequest, AgentResponse } from "@/app/types/api";
import { NextResponse } from "next/server";
import { createAgent } from "./create-agent";
import { Message, generateId, generateText } from "ai";

/**
 * Handles incoming POST requests to interact with the AgentKit-powered AI agent.
 * This function processes user messages and streams responses from the agent.
 *
 * @function POST
 * @param {Request & { json: () => Promise<AgentRequest> }} req - The incoming request object containing the user message.
 * @returns {Promise<NextResponse<AgentResponse>>} JSON response containing the AI-generated reply or an error message.
 *
 * @description Sends a single message to the agent and returns the agents' final response.
 *
 * @example
 * const response = await fetch("/api/agent", {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify({ userMessage: input }),
 * });
 */
export async function POST(
  req: Request & { json: () => Promise<AgentRequest> },
): Promise<NextResponse<AgentResponse>> {
  try {
    // 1. Extract user message from the request body
    const { userMessage } = await req.json();
    if (!userMessage) {
      return NextResponse.json(
        { error: "No message provided" },
        { status: 400 }
      );
    }

    // 2. Get the agent
    const agent = await createAgent();

    // 3. Create a new messages array for this request
    const messages: Message[] = [
      { id: generateId(), role: "user", content: userMessage }
    ];

    // 4. Generate the agent's response
    const { text } = await generateText({
      ...agent,
      messages,
    });

    // 5. Return the response
    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("Error processing request:", error);
    
    // Return more specific error messages based on the error type
    if (error instanceof Error) {
      if (error.message.includes("private key")) {
        return NextResponse.json(
          { error: "Invalid private key configuration. Please check your environment variables." },
          { status: 500 }
        );
      }
      if (error.message.includes("network")) {
        return NextResponse.json(
          { error: "Network configuration error. Please check your NETWORK_ID environment variable." },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { error: "Failed to process message. Please try again later." },
      { status: 500 }
    );
  }
}
