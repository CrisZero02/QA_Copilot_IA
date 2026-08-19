import { NextResponse } from "next/server";

import {
  OpenAIProvider,
} from "@/lib/ai/provider";

import {
  generateApiTesting,
} from "@/lib/ai/api-testing-generator";

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const {
      endpoint,
      method,
      headers,
      parameters,
      requestBody,
      strategy,
    } = body;

    if (
      !endpoint ||
      typeof endpoint !== "string"
    ) {
      return NextResponse.json(
        {
          error:
            "Se requiere un endpoint.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !method ||
      typeof method !== "string"
    ) {
      return NextResponse.json(
        {
          error:
            "Se requiere un método HTTP.",
        },
        {
          status: 400,
        }
      );
    }

    const provider =
      new OpenAIProvider();

    const result =
      await generateApiTesting(
        provider,
        {
          method,
          endpoint,
          headers:
            headers || "",
          parameters:
            parameters || "",
          requestBody:
            requestBody || "",
        },
        strategy ||
          "Full API Analysis"
      );

    return NextResponse.json(
      result
    );
  } catch (error) {
    console.error(
      "Error generating API tests:",
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