import { NextResponse } from "next/server";

import {
  OpenAIProvider,
} from "@/lib/ai/provider";

import {
  analyzeDefect,
} from "@/lib/ai/defect-analyzer";

import {
  addActivity,
} from "@/lib/activity-store";

export async function POST(
  request: Request
) {
  try {
    const body = await request.json();

    const defect = body.defect;

    if (
      !defect ||
      typeof defect !== "object"
    ) {
      return NextResponse.json(
        {
          error:
            "Se requiere información del defecto.",
        },
        {
          status: 400,
        }
      );
    }

    const provider =
      new OpenAIProvider();

    const result =
      await analyzeDefect(
        provider,
        defect
      );

    /*
     * Registrar actividad únicamente
     * cuando el análisis fue exitoso.
     */
    const defectTitle =
      typeof defect.title === "string"
        ? defect.title.trim()
        : "";

    const defectDescription =
      typeof defect.description === "string"
        ? defect.description.trim()
        : "";

    addActivity({
      type: "defect",
      status: "danger",
      title: "Defecto analizado",
      description:
        defectTitle ||
        (defectDescription
          ? defectDescription.length > 80
            ? `${defectDescription.substring(
                0,
                80
              )}...`
            : defectDescription
          : "Análisis de defecto completado"),
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(
      "Error analyzing defect:",
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