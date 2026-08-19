import { z } from "zod";

export const DefectAnalysisSchema = z.object({
  summary: z.string(),

  severity: z.enum([
    "Critical",
    "High",
    "Medium",
    "Low",
  ]),

  priority: z.enum([
    "Critical",
    "High",
    "Medium",
    "Low",
  ]),

  category: z.enum([
    "Functional",
    "UI",
    "Performance",
    "Security",
    "Integration",
    "Data",
    "Compatibility",
    "Configuration",
    "Other",
  ]),

  probableCause: z.string(),

  impact: z.string(),

  affectedArea: z.string(),

  reproductionConfidence: z.enum([
    "High",
    "Medium",
    "Low",
  ]),

  recommendedTests: z.array(
    z.string()
  ),

  automationCandidate: z.boolean(),

  recommendations: z.array(
    z.string()
  ),
});

export type DefectAnalysisResult =
  z.infer<typeof DefectAnalysisSchema>;