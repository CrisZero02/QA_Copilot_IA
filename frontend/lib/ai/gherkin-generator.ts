import {
  AIProvider,
} from "./provider";

import {
  GherkinGenerationSchema,
  GherkinGenerationResult,
} from "./gherkin-schema";

import {
  GHERKIN_GENERATOR_SYSTEM_PROMPT,
} from "./prompts";

export async function generateGherkin(
  provider: AIProvider,
  testCases: unknown
): Promise<GherkinGenerationResult> {
  const response =
    await provider.generate([
      {
        role: "system",
        content:
          GHERKIN_GENERATOR_SYSTEM_PROMPT,
      },

      {
        role: "user",
        content: `
Convert the following test cases into
Gherkin / BDD scenarios.

Test Cases:

${JSON.stringify(testCases, null, 2)}
`,
      },
    ]);

  let parsed: unknown;

  try {
    parsed = JSON.parse(response.content);
  } catch {
    throw new Error(
      "La IA devolvió un Gherkin inválido."
    );
  }

  const validation =
    GherkinGenerationSchema.safeParse(parsed);

  if (!validation.success) {
    console.error(
      validation.error.flatten()
    );

    throw new Error(
      "El Gherkin generado no cumple con el esquema esperado."
    );
  }

  return validation.data;
}