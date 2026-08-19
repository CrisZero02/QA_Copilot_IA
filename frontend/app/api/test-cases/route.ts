import { NextResponse } from "next/server";

import {
  OpenAIProvider,
} from "@/lib/ai/provider";

import {
  generateTestCases,
} from "@/lib/ai/test-case-generator";

import {
  addActivity,
} from "@/lib/activity-store";

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const userStory =
      body.userStory?.trim();

    const strategy =
      body.strategy ||
      "Functional";

    const count =
      body.count || "10";

    if (!userStory) {
      return NextResponse.json(
        {
          error:
            "La User Story es obligatoria.",
        },
        {
          status: 400,
        }
      );
    }

    const provider =
      new OpenAIProvider();

    const result =
      await generateTestCases(
        provider,
        userStory,
        strategy,
        count
      );

    /*
     * Registrar actividad real
     * en el Dashboard.
     */
    const generatedCount =
      Array.isArray(result?.testCases)
        ? result.testCases.length
        : Number(count) || 0;

    addActivity({
      type: "test-case",
      status: "success",
      title:
        "Test Cases generados",
      description:
        `${generatedCount} Test Cases generados — ${userStory.slice(
          0,
          80
        )}${userStory.length > 80 ? "..." : ""}`,
    });

    return NextResponse.json(
      result
    );
  } catch (error) {
    console.error(
      "Error generating test cases:",
      error
    );

    /*
     * Registrar también el fallo.
     */
    addActivity({
      type: "test-case",
      status: "danger",
      title:
        "Generación de Test Cases fallida",
      description:
        "No fue posible generar los Test Cases con IA.",
    });

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