import { z } from "zod";

export const GherkinScenarioSchema = z.object({
  id: z.string(),
  title: z.string(),
  given: z.array(z.string()).min(1),
  when: z.array(z.string()).min(1),
  then: z.array(z.string()).min(1),
});

export const GherkinGenerationSchema = z.object({
  feature: z.string(),
  description: z.string(),
  scenarios: z.array(
    GherkinScenarioSchema
  ).min(1),
});

export type GherkinScenario =
  z.infer<typeof GherkinScenarioSchema>;

export type GherkinGenerationResult =
  z.infer<typeof GherkinGenerationSchema>;