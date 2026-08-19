"use client";

import { useState } from "react";

type RunResult = {
  success: boolean;
  status: number;
  statusText: string;
  responseTime: number;
  headers: Record<string, string>;
  body: unknown;
  error?: string;
};

const methodOptions = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
];

export default function RunnerPage() {
  const [method, setMethod] = useState("GET");
  const [endpoint, setEndpoint] = useState(
    "https://jsonplaceholder.typicode.com/users/1"
  );
  const [headers, setHeaders] = useState(
    "Accept: application/json"
  );
  const [requestBody, setRequestBody] = useState("");

  const [expectedStatus, setExpectedStatus] =
    useState("200");

  const [isRunning, setIsRunning] =
    useState(false);

  const [result, setResult] =
    useState<RunResult | null>(null);

  const [error, setError] =
    useState("");

  const runTest = async () => {
    if (!endpoint.trim()) {
      setError("El endpoint es obligatorio.");
      return;
    }

    setIsRunning(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        "/api/api-testing/run",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            method,
            endpoint,
            headers,
            body: requestBody,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok && !data) {
        throw new Error(
          "No fue posible ejecutar el request."
        );
      }

      setResult(data);

      if (!data.success && data.error) {
        setError(data.error);
      }
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Error ejecutando el request."
      );
    } finally {
      setIsRunning(false);
    }
  };

  const clearResult = () => {
    setResult(null);
    setError("");
  };

  const formatBody = (
    body: unknown
  ) => {
    if (body === null || body === undefined) {
      return "";
    }

    if (typeof body === "string") {
      return body;
    }

    try {
      return JSON.stringify(
        body,
        null,
        2
      );
    } catch {
      return String(body);
    }
  };

  const expectedStatusNumber =
    Number(expectedStatus);

  const statusMatches =
    result !== null &&
    result.status ===
      expectedStatusNumber;

  const testPassed =
    result !== null &&
    result.success &&
    statusMatches;

  const testFailed =
    result !== null &&
    !testPassed;

  return (
    <div className="qa-page">
      {/* HEADER */}

      <div className="qa-page-header">
        <div>
          <div className="qa-eyebrow">
            <span className="status-dot" />
            API TEST RUNNER
          </div>

          <h1>API Test Runner</h1>

          <p>
            Ejecutá requests reales contra APIs y
            validá automáticamente el resultado
            esperado.
          </p>
        </div>

        <div className="ai-status">
          <span className="status-dot" />
          Runner Ready
        </div>
      </div>

      {/* REQUEST */}

      <div className="generator-layout">
        <section className="generator-card">
          <div className="card-title">
            <div className="card-title-icon">
              ▶
            </div>

            <div>
              <h2>Request</h2>

              <p>
                Configurá el request que querés
                ejecutar.
              </p>
            </div>
          </div>

          <div className="api-request-row">
            <div className="config-group method-group">
              <label htmlFor="method">
                Método
              </label>

              <select
                id="method"
                value={method}
                onChange={(event) =>
                  setMethod(
                    event.target.value
                  )
                }
              >
                {methodOptions.map(
                  (option) => (
                    <option
                      value={option}
                      key={option}
                    >
                      {option}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="config-group endpoint-group">
              <label htmlFor="endpoint">
                Endpoint
              </label>

              <input
                id="endpoint"
                type="text"
                value={endpoint}
                onChange={(event) =>
                  setEndpoint(
                    event.target.value
                  )
                }
                placeholder="https://api.example.com/users"
              />
            </div>
          </div>

          <div className="config-group">
            <label htmlFor="runner-headers">
              Headers
            </label>

            <textarea
              id="runner-headers"
              value={headers}
              onChange={(event) =>
                setHeaders(
                  event.target.value
                )
              }
              placeholder={`Content-Type: application/json
Authorization: Bearer <token>`}
            />

            <small>
              Un header por línea.
            </small>
          </div>

          <div className="config-group">
            <label htmlFor="runner-body">
              Request Body
            </label>

            <textarea
              id="runner-body"
              value={requestBody}
              onChange={(event) =>
                setRequestBody(
                  event.target.value
                )
              }
              placeholder={`{
  "name": "QA Copilot",
  "email": "qa@test.com"
}`}
              disabled={
                method === "GET" ||
                method === "DELETE"
              }
            />
          </div>

          <div className="input-footer">
            <span>
              {endpoint.length} caracteres
            </span>

            <button
              className="generate-button"
              onClick={runTest}
              disabled={
                isRunning ||
                !endpoint.trim()
              }
            >
              {isRunning ? (
                <>
                  <span className="spinner" />
                  Ejecutando...
                </>
              ) : (
                <>
                  ▶ Ejecutar Test
                </>
              )}
            </button>
          </div>
        </section>

        {/* VALIDATION */}

        <section className="generator-card configuration-card">
          <div className="card-title">
            <div className="card-title-icon secondary">
              ✓
            </div>

            <div>
              <h2>Validación</h2>

              <p>
                Definí qué resultado debe producir
                el endpoint.
              </p>
            </div>
          </div>

          <div className="config-group">
            <label htmlFor="expected-status">
              HTTP Status esperado
            </label>

            <select
              id="expected-status"
              value={expectedStatus}
              onChange={(event) =>
                setExpectedStatus(
                  event.target.value
                )
              }
            >
              <option value="200">
                200 — OK
              </option>

              <option value="201">
                201 — Created
              </option>

              <option value="202">
                202 — Accepted
              </option>

              <option value="204">
                204 — No Content
              </option>

              <option value="400">
                400 — Bad Request
              </option>

              <option value="401">
                401 — Unauthorized
              </option>

              <option value="403">
                403 — Forbidden
              </option>

              <option value="404">
                404 — Not Found
              </option>

              <option value="409">
                409 — Conflict
              </option>

              <option value="500">
                500 — Server Error
              </option>
            </select>
          </div>

          <div className="api-info-box">
            <span>✦</span>

            <div>
              <strong>
                Validación automática
              </strong>

              <p>
                El Runner compara el HTTP Status
                recibido contra el status esperado
                y determina automáticamente si el
                test pasó o falló.
              </p>
            </div>
          </div>

          <div className="config-group">
            <label>
              Criterios de ejecución
            </label>

            <div className="api-check-list">
              <label className="api-check">
                <input
                  type="checkbox"
                  checked
                  readOnly
                />
                Request ejecutado
              </label>

              <label className="api-check">
                <input
                  type="checkbox"
                  checked
                  readOnly
                />
                HTTP Status validado
              </label>

              <label className="api-check">
                <input
                  type="checkbox"
                  checked
                  readOnly
                />
                Response capturada
              </label>

              <label className="api-check">
                <input
                  type="checkbox"
                  checked
                  readOnly
                />
                Tiempo de respuesta
              </label>
            </div>
          </div>
        </section>
      </div>

      {/* ERROR */}

      {error && (
        <section className="results-section">
          <div className="test-case-card">
            <div className="test-case-top">
              <div className="test-case-id">
                ERROR
              </div>

              <div className="test-case-tags">
                <span className="tag priority critical">
                  Execution Error
                </span>
              </div>
            </div>

            <h3>
              No fue posible completar la
              ejecución
            </h3>

            <div className="test-case-info">
              <div>
                <strong>
                  Detalle
                </strong>

                <p>{error}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* RESULT */}

      {result && (
        <section className="results-section">
          <div className="results-header">
            <div>
              <div className="qa-eyebrow">
                EXECUTION RESULT
              </div>

              <h2>
                Resultado de ejecución
              </h2>
            </div>

            <button
              className="secondary-button"
              onClick={clearResult}
            >
              Limpiar resultado
            </button>
          </div>

          {/* RESULT SUMMARY */}

          <article className="test-case-card">
            <div className="test-case-top">
              <div className="test-case-id">
                API-RUN-001
              </div>

              <div className="test-case-tags">
                <span
                  className={`tag priority ${
                    testPassed
                      ? "low"
                      : "critical"
                  }`}
                >
                  {testPassed
                    ? "✓ PASSED"
                    : "✕ FAILED"}
                </span>

                <span className="tag type">
                  HTTP {result.status}
                </span>

                <span className="tag type">
                  {result.responseTime} ms
                </span>
              </div>
            </div>

            <h3>
              {method} {endpoint}
            </h3>

            <div className="api-endpoint">
              <span className="api-method">
                {method}
              </span>

              <code>
                {endpoint}
              </code>
            </div>

            <div className="test-case-info">
              {/* STATUS */}

              <div>
                <strong>
                  HTTP Status recibido
                </strong>

                <p>
                  <span className="status-code">
                    {result.status}
                  </span>{" "}
                  {result.statusText}
                </p>
              </div>

              {/* EXPECTED */}

              <div>
                <strong>
                  HTTP Status esperado
                </strong>

                <p>
                  <span className="status-code">
                    {expectedStatusNumber}
                  </span>
                </p>
              </div>

              {/* VALIDATION */}

              <div>
                <strong>
                  Validación
                </strong>

                <p>
                  {statusMatches
                    ? "✓ El HTTP Status coincide con el resultado esperado."
                    : "✕ El HTTP Status recibido no coincide con el esperado."}
                </p>
              </div>

              {/* TIME */}

              <div>
                <strong>
                  Tiempo de respuesta
                </strong>

                <p>
                  {result.responseTime} ms
                </p>
              </div>
            </div>
          </article>

          {/* RESPONSE */}

          <article className="test-case-card">
            <div className="test-case-top">
              <div className="test-case-id">
                RESPONSE
              </div>

              <div className="test-case-tags">
                <span className="tag type">
                  Response Body
                </span>
              </div>
            </div>

            <h3>
              Response recibida
            </h3>

            <pre className="api-code">
              {formatBody(result.body) ||
                "Sin contenido en la respuesta."}
            </pre>
          </article>

          {/* RESPONSE HEADERS */}

          <article className="test-case-card">
            <div className="test-case-top">
              <div className="test-case-id">
                HEADERS
              </div>
            </div>

            <h3>
              Response Headers
            </h3>

            {Object.keys(
              result.headers
            ).length > 0 ? (
              <div className="test-case-info">
                <div>
                  <ul>
                    {Object.entries(
                      result.headers
                    ).map(
                      (
                        [key, value]
                      ) => (
                        <li key={key}>
                          <code>
                            {key}: {value}
                          </code>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            ) : (
              <p>
                La respuesta no contiene
                headers.
              </p>
            )}
          </article>

          {/* EVIDENCE */}

          <article className="test-case-card">
            <div className="test-case-top">
              <div className="test-case-id">
                EVIDENCE
              </div>

              <div className="test-case-tags">
                <span
                  className={`tag priority ${
                    testPassed
                      ? "low"
                      : "critical"
                  }`}
                >
                  {testPassed
                    ? "PASS"
                    : "FAIL"}
                </span>
              </div>
            </div>

            <h3>
              Evidencia de ejecución
            </h3>

            <div className="test-case-info">
              <div>
                <strong>
                  Request
                </strong>

                <p>
                  {method} {endpoint}
                </p>
              </div>

              <div>
                <strong>
                  Expected
                </strong>

                <p>
                  HTTP {expectedStatusNumber}
                </p>
              </div>

              <div>
                <strong>
                  Actual
                </strong>

                <p>
                  HTTP {result.status}
                </p>
              </div>

              <div>
                <strong>
                  Execution Time
                </strong>

                <p>
                  {result.responseTime} ms
                </p>
              </div>

              <div>
                <strong>
                  Final Result
                </strong>

                <p>
                  {testPassed
                    ? "✓ PASS — El request respondió correctamente y cumplió la validación."
                    : "✕ FAIL — El resultado no cumplió con la validación esperada."}
                </p>
              </div>
            </div>
          </article>
        </section>
      )}
    </div>
  );
}