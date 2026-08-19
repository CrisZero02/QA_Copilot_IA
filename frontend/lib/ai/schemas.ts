import { z } from "zod";

export const TestStrategySchema = z.enum([
  "Smoke",
  "Functional",
  "Regression",
  "Security",
  "Full",
]);

export const TestCaseCountSchema = z.enum([
  "5",
  "10",
  "20",
  "exhaustive",
]);

export const TestCaseSchema = z.object({
  id: z.string(),

  title: z.string(),

  type: z.enum([
    "Functional",
    "Negative",
    "Validation",
    "Boundary",
    "Security",
    "Integration",
    "UI",
  ]),

  priority: z.enum([
    "Critical",
    "High",
    "Medium",
    "Low",
  ]),

  risk: z.enum([
    "Critical",
    "High",
    "Medium",
    "Low",
  ]),

  preconditions: z.string(),

  testData: z.array(z.string()),

  steps: z.array(z.string()).min(1),

  expected: z.string(),

  automationCandidate: z.boolean(),
});

export const TestCaseGenerationSchema =
  z.object({
    testCases: z.array(TestCaseSchema).min(1),
  });

export const TestCaseGenerationRequestSchema =
  z.object({
    userStory: z.string().min(1),
    strategy: TestStrategySchema,
    count: TestCaseCountSchema,
  });

export type GeneratedTestCase =
  z.infer<typeof TestCaseSchema>;

export type TestCaseGenerationResult =
  z.infer<typeof TestCaseGenerationSchema>;