import { NextResponse } from "next/server";

import {
  OpenAIProvider,
} from "@/lib/ai/provider";

import {
  generateApiTestScenarios,
} from "@/lib/ai/api-test-generator";

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const apiDefinition =
      body.apiDefinition;

    if (!apiDefinition) {
      return NextResponse.json(
        {
          error:
            "Se requiere una definición de API.",
        },
        {
          status: 400,
        }
      );
    }

    const provider =
      new OpenAIProvider();

    const result =
      await generateApiTestScenarios(
        provider,
        apiDefinition
      );

    return NextResponse.json(
      result
    );
  } catch (error) {
    console.error(
      "Error generating API scenarios:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Error interno del servidor.",
      },
      {
        status: 500,
      }
    );
  }
}