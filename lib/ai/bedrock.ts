import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION ?? "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
});

type GenerateOptions = 
  | string 
  | { user: string; maxTokens?: number; system?: string };

export async function generateWithBedrock(options: GenerateOptions): Promise<string> {
  const userPrompt = typeof options === "string" ? options : options.user;
  const maxTokens = typeof options === "string" ? 2048 : (options.maxTokens ?? 2048);
  const systemPrompt = typeof options === "string" ? undefined : options.system;

  try {
    const body: any = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: maxTokens,
      messages: [{ role: "user", content: userPrompt }],
    };
    
    if (systemPrompt) {
      body.system = systemPrompt;
    }

    const command = new InvokeModelCommand({
      modelId: process.env.BEDROCK_MODEL_ID ?? "anthropic.claude-sonnet-4-5-20250929-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(body),
    });

    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    return responseBody.content?.[0]?.text ?? "";
  } catch (error) {
    console.error("[Bedrock error]", error);
    throw new Error("AI request failed. Please try again.");
  }
}

// Alias for project actions.ts compatibility
export async function invokeBedrock(prompt: string, maxTokens = 2048): Promise<string> {
  return generateWithBedrock({ user: prompt, maxTokens });
}

// Export for provider.ts compatibility
export const BedrockAIProvider = {
  generate: generateWithBedrock,
};