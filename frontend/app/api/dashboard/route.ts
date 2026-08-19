import { NextResponse } from "next/server";

import {
  getActivities,
} from "@/lib/activity-store";

export async function GET() {
  try {
    const activities = getActivities();

    const testCases = activities.filter(
      (activity) =>
        activity.type === "test-case"
    ).length;

    const defects = activities.filter(
      (activity) =>
        activity.type === "defect"
    ).length;

    const apiTests = activities.filter(
      (activity) =>
        activity.type === "api-test"
    ).length;

    const gherkinScenarios =
      activities.filter(
        (activity) =>
          activity.type === "gherkin"
      ).length;

    return NextResponse.json({
      success: true,

      metrics: {
        testCases,
        defects,
        apiTests,
        gherkinScenarios,
        totalActivities:
          activities.length,
      },

      activities:
        activities.slice(0, 10),
    });
  } catch (error) {
    console.error(
      "Dashboard API Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "No fue posible obtener las estadísticas del Dashboard.",
      },
      {
        status: 500,
      }
    );
  }
}