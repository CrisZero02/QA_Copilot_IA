import { z } from "zod";

export const ApiTestScenarioSchema = z.object({
  id: z.string(),
  title: z.string(),

  type: z.enum([
    "Positive",
    "Negative",
    "Boundary",
    "Security",
    "Validation",
  ]),

  priority: z.enum([
    "Critical",
    "High",
    "Medium",
    "Low",
  ]),

  objective: z.string(),

  preconditions: z.string(),

  steps: z.array(
    z.string()
  ),

  expected: z.string(),

  automationCandidate: z.boolean(),
});

export const ApiTestGenerationSchema =
  z.object({
    scenarios: z.array(
      ApiTestScenarioSchema
    ),
  });

export type ApiTestScenario =
  z.infer<
    typeof ApiTestScenarioSchema
  >;

export type ApiTestGenerationResult =
  z.infer<
    typeof ApiTestGenerationSchema
  >;