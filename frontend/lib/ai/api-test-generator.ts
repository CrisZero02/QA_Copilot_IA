import {
  AIProvider,
} from "./provider";

import {
  ApiTestGenerationSchema,
  ApiTestGenerationResult,
} from "./api-test-schema";

import {
  API_TEST_GENERATOR_SYSTEM_PROMPT,
} from "./prompts";

export async function generateApiTestScenarios(
  provider: AIProvider,
  apiDefinition: unknown
): Promise<ApiTestGenerationResult> {
  const response =
    await provider.generate([
      {
        role: "system",
        content:
          API_TEST_GENERATOR_SYSTEM_PROMPT,
      },

      {
        role: "user",
        content: `
Analyze the following API definition and generate
professional API test scenarios.

API Definition:

${JSON.stringify(
  apiDefinition,
  null,
  2
)}
`,
      },
    ]);

  let parsed: unknown;

  try {
    parsed = JSON.parse(
      response.content
    );
  } catch {
    throw new Error(
      "La IA devolvió un JSON inválido."
    );
  }

  const validation =
    ApiTestGenerationSchema.safeParse(
      parsed
    );

  if (!validation.success) {
    console.error(
      validation.error.flatten()
    );

    throw new Error(
      "Los escenarios API generados no cumplen con el esquema esperado."
    );
  }

  return validation.data;
}