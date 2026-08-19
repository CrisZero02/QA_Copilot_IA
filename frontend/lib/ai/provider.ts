import OpenAI from "openai";

export type AIMessage = {
  role: "system" | "user";
  content: string;
};

export type AIProviderResponse = {
  content: string;
};

export interface AIProvider {
  generate(
    messages: AIMessage[]
  ): Promise<AIProviderResponse>;
}

export class OpenAIProvider implements AIProvider {
  private client: OpenAI;
  private model: string;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error(
        "OPENAI_API_KEY no está configurada."
      );
    }

    this.client = new OpenAI({
      apiKey,
    });

    this.model =
      process.env.OPENAI_MODEL || "gpt-5.6-luna";
  }

  async generate(
    messages: AIMessage[]
  ): Promise<AIProviderResponse> {
    const response =
      await this.client.responses.create({
        model: this.model,

        input: messages.map((message) => ({
          role: message.role,
          content: [
            {
              type: "input_text",
              text: message.content,
            },
          ],
        })),

        text: {
          format: {
            type: "json_schema",
            name: "qa_copilot_response",
            strict: true,

            schema: {
              type: "object",
              additionalProperties: false,

              properties: {
                testCases: {
                  type: "array",
                  items: {
                    type: "object",
                    additionalProperties: false,

                    properties: {
                      id: {
                        type: "string",
                      },

                      title: {
                        type: "string",
                      },

                      type: {
                        type: "string",
                        enum: [
                          "Functional",
                          "Negative",
                          "Validation",
                          "Boundary",
                          "Security",
                          "Integration",
                          "UI",
                        ],
                      },

                      priority: {
                        type: "string",
                        enum: [
                          "Critical",
                          "High",
                          "Medium",
                          "Low",
                        ],
                      },

                      risk: {
                        type: "string",
                        enum: [
                          "Critical",
                          "High",
                          "Medium",
                          "Low",
                        ],
                      },

                      preconditions: {
                        type: "string",
                      },

                      testData: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                      },

                      steps: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                      },

                      expected: {
                        type: "string",
                      },

                      automationCandidate: {
                        type: "boolean",
                      },
                    },

                    required: [
                      "id",
                      "title",
                      "type",
                      "priority",
                      "risk",
                      "preconditions",
                      "testData",
                      "steps",
                      "expected",
                      "automationCandidate",
                    ],
                  },
                },

                severity: {
                  type: "string",
                  enum: [
                    "Critical",
                    "High",
                    "Medium",
                    "Low",
                  ],
                },

                priority: {
                  type: "string",
                  enum: [
                    "Critical",
                    "High",
                    "Medium",
                    "Low",
                  ],
                },

                category: {
                  type: "string",
                  enum: [
                    "Functional",
                    "UI",
                    "Integration",
                    "Performance",
                    "Security",
                    "Data",
                    "Other",
                  ],
                },

                summary: {
                  type: "string",
                },

                probableCause: {
                  type: "string",
                },

                technicalAnalysis: {
                  type: "string",
                },

                impact: {
                  type: "string",
                },

                recommendations: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },

                automationCandidate: {
                  type: "boolean",
                },
              },

              required: [
                "testCases",
                "severity",
                "priority",
                "category",
                "summary",
                "probableCause",
                "technicalAnalysis",
                "impact",
                "recommendations",
                "automationCandidate",
              ],
            },
          },
        },
      });

    return {
      content: response.output_text,
    };
  }
}