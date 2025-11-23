export function parseLlmResponse(response: string): any {
  // Try direct JSON parse
  try {
    return JSON.parse(response);
  } catch {}

  // Check for common LLM JSON block
  const jsonBlockMatch = response.match(/```json\s*([\s\S]*?)\s*```/i);
  if (jsonBlockMatch && jsonBlockMatch[1]) {
    try {
      return JSON.parse(jsonBlockMatch[1]);
    } catch {}
  }

  throw new Error("Unable to parse LLM response as JSON.");
}
