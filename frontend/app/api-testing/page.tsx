"use client";

import { useState } from "react";

type ApiScenario = {
  id: string;
  title: string;
  method: string;
  endpoint: string;
  type: string;
  priority: string;
  headers: string[];
  parameters: string[];
  body: string;
  expectedStatus: string;
  expectedResponse: string;
};

type ApiRunResult = {
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

const strategyOptions = [
  "Functional",
  "Negative",
  "Security",
  "Boundary",
  "Full API Analysis",
];

export default function ApiTestingPage() {
  const [endpoint, setEndpoint] = useState("");
  const [method, setMethod] = useState("POST");
  const [requestBody, setRequestBody] =
    useState("");
  const [headers, setHeaders] =
    useState("");
  const [strategy, setStrategy] =
    useState("Full API Analysis");

  const [isGenerating, setIsGenerating] =
    useState(false);

  const [isRunning, setIsRunning] =
    useState(false);

  const [
    generatedScenarios,
    setGeneratedScenarios,
  ] = useState<ApiScenario[]>([]);

  const [runResult, setRunResult] =
    useState<ApiRunResult | null>(null);

  const generateScenarios = async () => {
    if (!endpoint.trim()) {
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch(
        "/api/api-testing",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            endpoint,
            method,
            headers,
            requestBody,
            strategy,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Error generando escenarios de API."
        );
      }

      setGeneratedScenarios(
        data.scenarios || []
      );
    } catch (error) {
      console.error(
        "Error generating API scenarios:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "No fue posible generar los escenarios de API."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const runApiRequest = async () => {
    if (!endpoint.trim()) {
      return;
    }

    setIsRunning(true);
    setRunResult(null);

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

      setRunResult(data);
    } catch (error) {
      console.error(
        "API execution error:",
        error
      );

      setRunResult({
        success: false,
        status: 0,
        statusText: "Request Error",
        responseTime: 0,
        headers: {},
        body: null,
        error:
          error instanceof Error
            ? error.message
            : "No fue posible ejecutar el request.",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const exportJson = () => {
    const json = JSON.stringify(
      generatedScenarios,
      null,
      2
    );

    const blob = new Blob(
      [json],
      {
        type: "application/json",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download =
      "qa-api-scenarios.json";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const formatJson = (
    value: unknown
  ) => {
    if (value === null) {
      return "null";
    }

    if (typeof value === "string") {
      return value;
    }

    try {
      return JSON.stringify(
        value,
        null,
        2
      );
    } catch {
      return String(value);
    }
  };

  return (
    <div className="qa-page">
      {/* HEADER */}

      <div className="qa-page-header">
        <div>
          <div className="qa-eyebrow">
            <span className="status-dot" />
            AI API TESTING
          </div>

          <h1>API Testing</h1>

          <p>
            Analizá endpoints, generá
            escenarios y ejecutá requests
            reales contra tus APIs.
          </p>
        </div>

        <div className="ai-status">
          <span className="status-dot" />
          AI Ready
        </div>
      </div>

      {/* CONFIGURATION */}

      <div className="generator-layout">
        {/* API REQUEST */}

        <section className="generator-card">
          <div className="card-title">
            <div className="card-title-icon">
              ↔
            </div>

            <div>
              <h2>API Request</h2>

              <p>
                Configurá el endpoint que
                querés analizar o ejecutar.
              </p>
            </div>
          </div>

          {/* METHOD + ENDPOINT */}

          <div className="api-request-row">
            <div className="config-group method-group">
              <label htmlFor="method">
                Método
              </label>

              <select
                id="method"
                value={method}
                onChange={(event) => {
                  setMethod(
                    event.target.value
                  );
                  setRunResult(null);
                }}
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
                onChange={(event) => {
                  setEndpoint(
                    event.target.value
                  );
                  setRunResult(null);
                }}
                placeholder="https://api.example.com/users"
              />
            </div>
          </div>

          {/* HEADERS */}

          <div className="config-group">
            <label htmlFor="headers">
              Headers
            </label>

            <textarea
              id="headers"
              value={headers}
              onChange={(event) => {
                setHeaders(
                  event.target.value
                );
                setRunResult(null);
              }}
              placeholder={`Content-Type: application/json
Authorization: Bearer <token>`}
            />

            <small>
              Un header por línea.
            </small>
          </div>

          {/* REQUEST BODY */}

          <div className="config-group">
            <label htmlFor="request-body">
              Request Body
            </label>

            <textarea
              id="request-body"
              value={requestBody}
              onChange={(event) => {
                setRequestBody(
                  event.target.value
                );
                setRunResult(null);
              }}
              placeholder={`{
  "email": "usuario@test.com",
  "password": "Password123"
}`}
              disabled={
                method === "GET" ||
                method === "DELETE"
              }
            />
          </div>

          {/* ACTIONS */}

          <div className="input-footer">
            <span>
              {endpoint.length} caracteres
            </span>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                justifyContent:
                  "flex-end",
              }}
            >
              <button
                className="secondary-button"
                onClick={runApiRequest}
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
                    ▶ Ejecutar API
                  </>
                )}
              </button>

              <button
                className="generate-button"
                onClick={
                  generateScenarios
                }
                disabled={
                  isGenerating ||
                  !endpoint.trim()
                }
              >
                {isGenerating ? (
                  <>
                    <span className="spinner" />
                    Analizando API...
                  </>
                ) : (
                  <>
                    ✦ Generar escenarios
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* CONFIGURATION */}

        <section className="generator-card configuration-card">
          <div className="card-title">
            <div className="card-title-icon secondary">
              ⚙
            </div>

            <div>
              <h2>Configuración</h2>

              <p>
                Personalizá el análisis de la
                API.
              </p>
            </div>
          </div>

          {/* STRATEGY */}

          <div className="config-group">
            <label htmlFor="strategy">
              Estrategia de testing
            </label>

            <select
              id="strategy"
              value={strategy}
              onChange={(event) =>
                setStrategy(
                  event.target.value
                )
              }
            >
              {strategyOptions.map(
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

          {/* COVERAGE */}

          <div className="config-group">
            <label>
              Cobertura
            </label>

            <div className="api-check-list">
              <label className="api-check">
                <input
                  type="checkbox"
                  defaultChecked
                />
                Happy Path
              </label>

              <label className="api-check">
                <input
                  type="checkbox"
                  defaultChecked
                />
                Negative Cases
              </label>

              <label className="api-check">
                <input
                  type="checkbox"
                  defaultChecked
                />
                Status Codes
              </label>

              <label className="api-check">
                <input
                  type="checkbox"
                  defaultChecked
                />
                Security
              </label>

              <label className="api-check">
                <input
                  type="checkbox"
                  defaultChecked
                />
                Validation
              </label>

              <label className="api-check">
                <input
                  type="checkbox"
                  defaultChecked
                />
                Boundary Values
              </label>
            </div>
          </div>

          <div className="api-info-box">
            <span>✦</span>

            <div>
              <strong>
                AI Analysis
              </strong>

              <p>
                La IA analizará el método
                HTTP, endpoint, headers,
                parámetros y body para
                identificar escenarios
                relevantes.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* API RUN RESULT */}

      {runResult && (
        <section className="results-section">
          <div className="results-header">
            <div>
              <div className="qa-eyebrow">
                API EXECUTION
              </div>

              <h2>
                Resultado del request
              </h2>
            </div>

            <div
              className={
                runResult.success
                  ? "automation-yes"
                  : "automation-no"
              }
            >
              {runResult.success
                ? "✓ PASS"
                : "✕ FAIL"}
            </div>
          </div>

          <article className="test-case-card">
            <div className="test-case-top">
              <div className="test-case-id">
                {method}
              </div>

              <div className="test-case-tags">
                <span className="tag type">
                  HTTP {runResult.status}
                </span>

                <span className="tag type">
                  {runResult.statusText ||
                    "Unknown"}
                </span>

                <span className="tag type">
                  {runResult.responseTime} ms
                </span>
              </div>
            </div>

            <h3>
              {endpoint}
            </h3>

            {runResult.error && (
              <div className="api-info-box">
                <span>⚠</span>

                <div>
                  <strong>
                    Error de ejecución
                  </strong>

                  <p>
                    {runResult.error}
                  </p>
                </div>
              </div>
            )}

            {!runResult.error && (
              <div className="test-case-info">
                {/* STATUS */}

                <div>
                  <strong>
                    HTTP Status
                  </strong>

                  <p>
                    <span className="status-code">
                      {runResult.status}
                    </span>{" "}
                    {runResult.statusText}
                  </p>
                </div>

                {/* RESPONSE TIME */}

                <div>
                  <strong>
                    Response Time
                  </strong>

                  <p>
                    {runResult.responseTime} ms
                  </p>
                </div>

                {/* RESPONSE HEADERS */}

                <div>
                  <strong>
                    Response Headers
                  </strong>

                  {Object.keys(
                    runResult.headers
                  ).length > 0 ? (
                    <ul>
                      {Object.entries(
                        runResult.headers
                      ).map(
                        ([key, value]) => (
                          <li key={key}>
                            <code>
                              {key}: {value}
                            </code>
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p>
                      Sin headers.
                    </p>
                  )}
                </div>

                {/* RESPONSE BODY */}

                <div>
                  <strong>
                    Response Body
                  </strong>

                  <pre className="api-code">
                    {formatJson(
                      runResult.body
                    )}
                  </pre>
                </div>
              </div>
            )}
          </article>
        </section>
      )}

      {/* GENERATED SCENARIOS */}

      {generatedScenarios.length > 0 && (
        <section className="results-section">
          <div className="results-header">
            <div>
              <div className="qa-eyebrow">
                GENERATED API TESTS
              </div>

              <h2>
                {
                  generatedScenarios.length
                }{" "}
                escenarios generados
              </h2>
            </div>

            <button
              className="secondary-button"
              onClick={exportJson}
            >
              ↓ Exportar JSON
            </button>
          </div>

          <div className="test-case-list">
            {generatedScenarios.map(
              (scenario) => (
                <article
                  className="test-case-card"
                  key={scenario.id}
                >
                  <div className="test-case-top">
                    <div className="test-case-id">
                      {scenario.id}
                    </div>

                    <div className="test-case-tags">
                      <span className="tag type">
                        {scenario.method}
                      </span>

                      <span className="tag type">
                        {scenario.type}
                      </span>

                      <span
                        className={`tag priority ${scenario.priority.toLowerCase()}`}
                      >
                        Priority:{" "}
                        {scenario.priority}
                      </span>
                    </div>
                  </div>

                  <h3>
                    {scenario.title}
                  </h3>

                  <div className="api-endpoint">
                    <span className="api-method">
                      {scenario.method}
                    </span>

                    <code>
                      {scenario.endpoint}
                    </code>
                  </div>

                  <div className="test-case-info">
                    <div>
                      <strong>
                        Headers
                      </strong>

                      {scenario.headers &&
                      scenario.headers
                        .length > 0 ? (
                        <ul>
                          {scenario.headers.map(
                            (
                              header,
                              index
                            ) => (
                              <li
                                key={
                                  index
                                }
                              >
                                <code>
                                  {
                                    header
                                  }
                                </code>
                              </li>
                            )
                          )}
                        </ul>
                      ) : (
                        <p>
                          Sin headers
                          específicos.
                        </p>
                      )}
                    </div>

                    <div>
                      <strong>
                        Parámetros
                      </strong>

                      {scenario.parameters &&
                      scenario.parameters
                        .length > 0 ? (
                        <ul>
                          {scenario.parameters.map(
                            (
                              parameter,
                              index
                            ) => (
                              <li
                                key={
                                  index
                                }
                              >
                                {
                                  parameter
                                }
                              </li>
                            )
                          )}
                        </ul>
                      ) : (
                        <p>
                          Sin parámetros
                          específicos.
                        </p>
                      )}
                    </div>

                    <div>
                      <strong>
                        Request Body
                      </strong>

                      {scenario.body ? (
                        <pre className="api-code">
                          {
                            scenario.body
                          }
                        </pre>
                      ) : (
                        <p>
                          Este request no
                          requiere body.
                        </p>
                      )}
                    </div>

                    <div>
                      <strong>
                        HTTP Status esperado
                      </strong>

                      <p>
                        <span className="status-code">
                          {
                            scenario.expectedStatus
                          }
                        </span>
                      </p>
                    </div>

                    <div>
                      <strong>
                        Resultado esperado
                      </strong>

                      <p>
                        {
                          scenario.expectedResponse
                        }
                      </p>
                    </div>
                  </div>
                </article>
              )
            )}
          </div>
        </section>
      )}
    </div>
  );
}