import {
  AIProvider,
} from "./provider";

import {
  ApiTestingGenerationSchema,
  ApiTestingGenerationResult,
} from "./api-schema";

import {
  API_TESTING_SYSTEM_PROMPT,
} from "./prompts";

export async function generateApiTesting(
  provider: AIProvider,
  apiRequest: unknown,
  strategy: string
): Promise<ApiTestingGenerationResult> {
  const response =
    await provider.generate([
      {
        role: "system",
        content:
          API_TESTING_SYSTEM_PROMPT,
      },

      {
        role: "user",
        content: `
Analyze the following API definition and generate
API testing scenarios.

Testing strategy:
${strategy}

API definition:

${JSON.stringify(
  apiRequest,
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
      "La IA devolvió un JSON de API Testing inválido."
    );
  }

  const validation =
    ApiTestingGenerationSchema.safeParse(
      parsed
    );

  if (!validation.success) {
    console.error(
      validation.error.flatten()
    );

    throw new Error(
      "Los escenarios de API generados no cumplen con el esquema esperado."
    );
  }

  return validation.data;
}