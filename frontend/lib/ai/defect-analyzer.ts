import {
  AIProvider,
} from "./provider";

import {
  DefectAnalysisSchema,
  DefectAnalysisResult,
} from "./defect-schema";

import {
  DEFECT_ANALYZER_SYSTEM_PROMPT,
} from "./prompts";

export async function analyzeDefect(
  provider: AIProvider,
  defect: unknown
): Promise<DefectAnalysisResult> {
  const response =
    await provider.generate([
      {
        role: "system",
        content:
          DEFECT_ANALYZER_SYSTEM_PROMPT,
      },

      {
        role: "user",
        content: `
Analyze the following software defect.

Provide a professional QA analysis.

Defect:

${JSON.stringify(defect, null, 2)}
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
      "La IA devolvió un análisis de defecto inválido."
    );
  }

  const validation =
    DefectAnalysisSchema.safeParse(
      parsed
    );

  if (!validation.success) {
    console.error(
      validation.error.flatten()
    );

    throw new Error(
      "El análisis del defecto no cumple con el esquema esperado."
    );
  }

  return validation.data;
}