import { openai } from "@ai-sdk/openai";
import { getVercelAITools } from "@coinbase/agentkit-vercel-ai-sdk";
import { prepareAgentkitAndWalletProvider } from "./prepare-agentkit";

/**
 * Agent Configuration Guide
 *
 * This file handles the core configuration of your AI agent's behavior and capabilities.
 *
 * Key Steps to Customize Your Agent:
 *
 * 1. Select your LLM:
 *    - Modify the `openai` instantiation to choose your preferred LLM
 *    - Configure model parameters like temperature and max tokens
 *
 * 2. Instantiate your Agent:
 *    - Pass the LLM, tools, and memory into `createReactAgent()`
 *    - Configure agent-specific parameters
 */

// The agent type definition
type Agent = {
  tools: ReturnType<typeof getVercelAITools>;
  system: string;
  model: ReturnType<typeof openai>;
  maxSteps?: number;
};

/**
 * Creates a new instance of the AI agent.
 *
 * @function createAgent
 * @returns {Promise<Agent>} The initialized AI agent.
 * @throws {Error} If the agent initialization fails.
 */
export async function createAgent(): Promise<Agent> {
  try {
    // Initialize LLM
    const model = openai("gpt-4o-mini");

    // Initialize AgentKit and WalletProvider
    const { agentkit, walletProvider } = await prepareAgentkitAndWalletProvider();

    // Configure network-specific messages
    const networkId = walletProvider.getNetwork().networkId;
    const canUseFaucet = networkId === "base-sepolia";
    const faucetMessage = canUseFaucet 
      ? `If you ever need funds, you can request them from the faucet.`
      : `If you need funds, you can provide your wallet details and request funds from the user.`;

    // Configure system message
    const system = `
      You are a helpful agent that can interact onchain using the Coinbase Developer Platform AgentKit. You are 
      empowered to interact onchain using your tools. ${faucetMessage}.
      Before executing your first action, get the wallet details to see what network 
      you're on. If there is a 5XX (internal) HTTP error code, ask the user to try again later. If someone 
      asks you to do something you can't do with your currently available tools, you must say so, and 
      encourage them to implement it themselves using the CDP SDK + Agentkit, recommend they go to 
      docs.cdp.coinbase.com for more information. Be concise and helpful with your responses. Refrain from 
      restating your tools' descriptions unless it is explicitly requested.
    `;

    // Initialize tools
    const tools = getVercelAITools(agentkit);

    // Create and return the agent
    return {
      tools,
      system,
      model,
      maxSteps: 10,
    };
  } catch (error) {
    console.error("Error initializing agent:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to initialize agent: ${error.message}`);
    }
    throw new Error("Failed to initialize agent");
  }
}
