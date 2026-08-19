import OpenAI from "openai";

export type ApiScenario = {
  id: string;
  title: string;
  type: string;
  priority: string;
  method: string;
  endpoint: string;
  description: string;
  expected: string;
};

export type ApiAnalysis = {
  summary: string;
  scenarios: ApiScenario[];
};

export async function generateApiAnalysis(
  method: string,
  endpoint: string,
  headers: string,
  body: string
): Promise<ApiAnalysis> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY no está configurada."
    );
  }

  const client = new OpenAI({
    apiKey,
  });

  const model =
    process.env.OPENAI_MODEL || "gpt-5.6-luna";

  const response = await client.responses.create({
    model,

    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text: `
Sos un QA Senior especializado en API Testing.

Analizá el endpoint proporcionado y generá escenarios profesionales de pruebas.

Debés considerar:

- Happy Path
- Validaciones
- Datos inválidos
- Campos obligatorios
- Boundary values
- Errores HTTP
- Autenticación y autorización cuando corresponda
- Seguridad básica
- Idempotencia cuando corresponda
- Métodos HTTP
- Request body
- Headers

Cada escenario debe indicar:
- ID
- título
- tipo
- prioridad
- método
- endpoint
- descripción
- resultado esperado

Tipos permitidos:
Functional
Negative
Validation
Boundary
Security

Prioridades permitidas:
Critical
High
Medium
Low

Generá entre 5 y 10 escenarios relevantes.

No inventes información específica del backend que no pueda inferirse del request.
            `,
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `
METHOD:
${method}

ENDPOINT:
${endpoint}

HEADERS:
${headers || "No especificados"}

REQUEST BODY:
${body || "No especificado"}
            `,
          },
        ],
      },
    ],

    text: {
      format: {
        type: "json_schema",
        name: "api_test_generation",
        strict: true,

        schema: {
          type: "object",
          additionalProperties: false,

          properties: {
            summary: {
              type: "string",
            },

            scenarios: {
              type: "array",
              minItems: 1,

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

                  method: {
                    type: "string",
                  },

                  endpoint: {
                    type: "string",
                  },

                  description: {
                    type: "string",
                  },

                  expected: {
                    type: "string",
                  },
                },

                required: [
                  "id",
                  "title",
                  "type",
                  "priority",
                  "method",
                  "endpoint",
                  "description",
                  "expected",
                ],
              },
            },
          },

          required: [
            "summary",
            "scenarios",
          ],
        },
      },
    },
  });

  if (!response.output_text) {
    throw new Error(
      "La IA no devolvió escenarios de API."
    );
  }

  return JSON.parse(
    response.output_text
  );
}