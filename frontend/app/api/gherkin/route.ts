import { NextResponse } from "next/server";

import {
  OpenAIProvider,
} from "@/lib/ai/provider";

import {
  generateGherkin,
} from "@/lib/ai/gherkin-generator";

import {
  addActivity,
} from "@/lib/activity-store";

export async function POST(
  request: Request
) {
  try {
    const body = await request.json();

    const testCases =
      body.testCases;

    if (
      !testCases ||
      !Array.isArray(testCases) ||
      testCases.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Se requieren Test Cases.",
        },
        {
          status: 400,
        }
      );
    }

    const provider =
      new OpenAIProvider();

    const result =
      await generateGherkin(
        provider,
        testCases
      );

    /*
     * Registrar actividad únicamente
     * cuando la generación fue exitosa.
     */
    addActivity({
      type: "gherkin",
      status: "success",
      title: "Escenarios Gherkin generados",
      description:
        `${testCases.length} Test Case${
          testCases.length === 1
            ? ""
            : "s"
        } convertido${
          testCases.length === 1
            ? ""
            : "s"
        } a Gherkin / BDD`,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(
      "Error generating Gherkin:",
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