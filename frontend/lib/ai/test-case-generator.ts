import {
  AIProvider,
} from "./provider";

import {
  TestCaseGenerationSchema,
  TestCaseGenerationResult,
} from "./schemas";

import {
  TEST_CASE_GENERATOR_SYSTEM_PROMPT,
} from "./prompts";

export async function generateTestCases(
  provider: AIProvider,
  userStory: string,
  strategy: string,
  count: string
): Promise<TestCaseGenerationResult> {
  if (!userStory.trim()) {
    throw new Error(
      "La User Story es obligatoria."
    );
  }

  const response =
    await provider.generate([
      {
        role: "system",
        content:
          TEST_CASE_GENERATOR_SYSTEM_PROMPT,
      },

      {
        role: "user",
        content: `
Analyze the following User Story and generate
high-quality software test cases.

Testing strategy:
${strategy}

Requested number of test cases:
${count}

Generate the test cases according to
the requested testing strategy and quantity.

User Story:

${userStory}
`,
      },
    ]);

  let parsed: unknown;

  try {
    parsed = JSON.parse(response.content);
  } catch {
    throw new Error(
      "La IA devolvió una respuesta JSON inválida."
    );
  }

  const validation =
    TestCaseGenerationSchema.safeParse(parsed);

  if (!validation.success) {
    console.error(
      "Invalid AI response:",
      validation.error.flatten()
    );

    throw new Error(
      "La respuesta de IA no cumple con el esquema esperado."
    );
  }

  return validation.data;
}