import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION ?? "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
});

export async function generateWithBedrock(prompt: string, maxTokens = 2048): Promise<string> {
  try {
    const command = new InvokeModelCommand({
      modelId: process.env.BEDROCK_MODEL_ID ?? "anthropic.claude-sonnet-4-5-20250929-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: maxTokens,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const response = await client.send(command);
    const body = JSON.parse(new TextDecoder().decode(response.body));
    return body.content?.[0]?.text ?? "";
  } catch (error) {
    console.error("[Bedrock error]", error);
    throw new Error("AI request failed. Please try again.");
  }
}

export async function invokeBedrock(prompt: string, maxTokens = 2048): Promise<string> {
  return generateWithBedrock(prompt, maxTokens);
}