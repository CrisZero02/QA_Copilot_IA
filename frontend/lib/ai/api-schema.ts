import { z } from "zod";

export const ApiScenarioSchema = z.object({
  id: z.string(),
  title: z.string(),
  method: z.enum([
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
  ]),
  endpoint: z.string(),
  type: z.enum([
    "Functional",
    "Negative",
    "Security",
    "Boundary",
    "Validation",
    "Integration",
  ]),
  priority: z.enum([
    "Critical",
    "High",
    "Medium",
    "Low",
  ]),
  headers: z.array(z.string()),
  parameters: z.array(z.string()),
  body: z.string(),
  expectedStatus: z.string(),
  expectedResponse: z.string(),
});

export const ApiTestingGenerationSchema = z.object({
  scenarios: z.array(ApiScenarioSchema).min(1),
});

export type ApiTestingGenerationResult = z.infer<
  typeof ApiTestingGenerationSchema
>;