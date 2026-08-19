import { NextResponse } from "next/server";

import {
  addActivity,
} from "@/lib/activity-store";

type ApiRunRequest = {
  method?: string;
  endpoint?: string;
  headers?: string;
  body?: string;
};

function parseHeaders(
  headersText: string
): Record<string, string> {
  const headers: Record<string, string> = {};

  if (!headersText.trim()) {
    return headers;
  }

  headersText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      const separatorIndex =
        line.indexOf(":");

      if (separatorIndex === -1) {
        return;
      }

      const key = line
        .slice(0, separatorIndex)
        .trim();

      const value = line
        .slice(separatorIndex + 1)
        .trim();

      if (key && value) {
        headers[key] = value;
      }
    });

  return headers;
}

export async function POST(
  request: Request
) {
  const startTime = Date.now();

  try {
    const body =
      (await request.json()) as ApiRunRequest;

    const method =
      body.method?.toUpperCase() || "GET";

    const endpoint =
      body.endpoint?.trim();

    if (!endpoint) {
      return NextResponse.json(
        {
          success: false,
          error:
            "El endpoint es obligatorio.",
        },
        {
          status: 400,
        }
      );
    }

    let targetUrl: URL;

    try {
      targetUrl = new URL(endpoint);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error:
            "El endpoint debe ser una URL válida. Ejemplo: https://api.example.com/users",
        },
        {
          status: 400,
        }
      );
    }

    const headers =
      parseHeaders(
        body.headers || ""
      );

    const requestInit: RequestInit = {
      method,
      headers,
    };

    if (
      !["GET", "HEAD", "DELETE"].includes(
        method
      ) &&
      body.body?.trim()
    ) {
      requestInit.body = body.body;
    }

    const response = await fetch(
      targetUrl.toString(),
      requestInit
    );

    const responseTime =
      Date.now() - startTime;

    const responseHeaders: Record<
      string,
      string
    > = {};

    response.headers.forEach(
      (value, key) => {
        responseHeaders[key] = value;
      }
    );

    const responseText =
      await response.text();

    let responseBody: unknown =
      responseText;

    try {
      responseBody =
        responseText
          ? JSON.parse(responseText)
          : null;
    } catch {
      responseBody = responseText;
    }

    /*
     * Registrar la ejecución real
     * del API Runner.
     */
    addActivity({
      type: "api-test",
      status: response.ok
        ? "success"
        : "danger",
      title: "API test ejecutado",
      description:
        `${method} ${targetUrl.pathname}${
          targetUrl.search
        } — HTTP ${response.status} — ${responseTime} ms`,
    });

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      responseTime,
      headers: responseHeaders,
      body: responseBody,
    });
  } catch (error) {
    const responseTime =
      Date.now() - startTime;

    console.error(
      "API Test Runner Error:",
      error
    );

    /*
     * Registrar también los errores
     * de ejecución del Runner.
     */
    addActivity({
      type: "api-test",
      status: "danger",
      title: "API test fallido",
      description:
        `Error ejecutando ${
          "API request"
        } — ${responseTime} ms`,
    });

    return NextResponse.json(
      {
        success: false,
        status: 0,
        statusText: "Request Error",
        responseTime,
        headers: {},
        body: null,
        error:
          error instanceof Error
            ? error.message
            : "No fue posible ejecutar el request.",
      },
      {
        status: 500,
      }
    );
  }
}