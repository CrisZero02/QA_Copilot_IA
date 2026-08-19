"use client";

import { useState } from "react";

type TestCase = {
  id: string;
  title: string;
  type: string;
  priority: string;
  risk: string;
  preconditions: string;
  testData: string[];
  steps: string[];
  expected: string;
  automationCandidate: boolean;
};

type GherkinScenario = {
  name: string;
  given: string[];
  when: string[];
  then: string[];
};

type GherkinResult = {
  feature: string;
  description?: string;
  scenarios: GherkinScenario[];
};

export default function TestCasesPage() {
  const [userStory, setUserStory] = useState("");
  const [generatedCases, setGeneratedCases] = useState<TestCase[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const [strategy, setStrategy] = useState("Functional");
  const [caseCount, setCaseCount] = useState("10");

  const [gherkinResult, setGherkinResult] =
    useState<GherkinResult | null>(null);

  const [isGeneratingGherkin, setIsGeneratingGherkin] =
    useState(false);

  const generateTestCases = async () => {
    if (!userStory.trim()) {
      return;
    }

    setIsGenerating(true);
    setGherkinResult(null);

    try {
      const response = await fetch("/api/test-cases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userStory,
          strategy,
          count: caseCount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Error generando test cases"
        );
      }

      setGeneratedCases(data.testCases);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "No fue posible generar los Test Cases."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const generateGherkin = async () => {
    if (generatedCases.length === 0) {
      return;
    }

    setIsGeneratingGherkin(true);

    try {
      const response = await fetch("/api/gherkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          testCases: generatedCases,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Error generando Gherkin"
        );
      }

      setGherkinResult(data);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "No fue posible generar el Gherkin."
      );
    } finally {
      setIsGeneratingGherkin(false);
    }
  };

  const exportTestCases = () => {
    const json = JSON.stringify(
      generatedCases,
      null,
      2
    );

    const blob = new Blob([json], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "qa-test-cases.json";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const buildGherkinText = () => {
    if (!gherkinResult) {
      return "";
    }

    let output = `Feature: ${gherkinResult.feature}\n`;

    if (gherkinResult.description) {
      output += `  ${gherkinResult.description}\n`;
    }

    output += "\n";

    gherkinResult.scenarios.forEach(
      (scenario) => {
        output += `  Scenario: ${scenario.name}\n`;

        scenario.given?.forEach((step) => {
          output += `    Given ${step}\n`;
        });

        scenario.when?.forEach((step) => {
          output += `    When ${step}\n`;
        });

        scenario.then?.forEach((step) => {
          output += `    Then ${step}\n`;
        });

        output += "\n";
      }
    );

    return output;
  };

  const exportGherkin = () => {
    const gherkinText = buildGherkinText();

    if (!gherkinText) {
      return;
    }

    const blob = new Blob(
      [gherkinText],
      {
        type: "text/plain;charset=utf-8",
      }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "qa-feature.feature";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="qa-page">
      {/* HEADER */}

      <div className="qa-page-header">
        <div>
          <div className="qa-eyebrow">
            <span className="status-dot" />
            AI TEST CASE GENERATOR
          </div>

          <h1>Generador de Test Cases</h1>

          <p>
            Convertí User Stories y requisitos en
            escenarios de prueba utilizando
            inteligencia artificial.
          </p>
        </div>

        <div className="ai-status">
          <span className="status-dot" />
          AI Ready
        </div>
      </div>

      {/* GENERATOR */}

      <div className="generator-layout">
        {/* USER STORY */}

        <section className="generator-card">
          <div className="card-title">
            <div className="card-title-icon">
              ✦
            </div>

            <div>
              <h2>
                Requirement / User Story
              </h2>

              <p>
                Ingresá el requerimiento que
                querés analizar.
              </p>
            </div>
          </div>

          <label htmlFor="user-story">
            User Story
          </label>

          <textarea
            id="user-story"
            value={userStory}
            onChange={(event) =>
              setUserStory(event.target.value)
            }
            placeholder={`Ejemplo:

Como usuario registrado,
quiero iniciar sesión utilizando mi email y contraseña,
para poder acceder a mi cuenta.`}
          />

          <div className="input-footer">
            <span>
              {userStory.length} caracteres
            </span>

            <button
              className="generate-button"
              onClick={generateTestCases}
              disabled={
                isGenerating ||
                !userStory.trim()
              }
            >
              {isGenerating ? (
                <>
                  <span className="spinner" />
                  Analizando...
                </>
              ) : (
                <>
                  ✦ Generar Test Cases
                </>
              )}
            </button>
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
                Personalizá la generación.
              </p>
            </div>
          </div>

          <div className="config-group">
            <label>
              Estrategia de testing
            </label>

            <select
              value={strategy}
              onChange={(event) =>
                setStrategy(event.target.value)
              }
            >
              <option value="Smoke">
                Smoke Testing
              </option>

              <option value="Functional">
                Functional Testing
              </option>

              <option value="Regression">
                Regression Testing
              </option>

              <option value="Security">
                Security Testing
              </option>

              <option value="Full">
                Full QA Analysis
              </option>
            </select>
          </div>

          <div className="config-group">
            <label>
              Cantidad de Test Cases
            </label>

            <select
              value={caseCount}
              onChange={(event) =>
                setCaseCount(event.target.value)
              }
            >
              <option value="5">
                5 casos
              </option>

              <option value="10">
                10 casos
              </option>

              <option value="20">
                20 casos
              </option>

              <option value="exhaustive">
                Exhaustivo
              </option>
            </select>
          </div>

          <div className="config-group">
            <label>
              Nivel de detalle
            </label>

            <select defaultValue="detailed">
              <option value="basic">
                Básico
              </option>

              <option value="standard">
                Estándar
              </option>

              <option value="detailed">
                Detallado
              </option>
            </select>
          </div>

          <div className="config-group">
            <label>
              Framework
            </label>

            <select defaultValue="generic">
              <option value="generic">
                Generic QA
              </option>

              <option value="gherkin">
                Gherkin / BDD
              </option>

              <option value="xray">
                Jira Xray
              </option>

              <option value="zephyr">
                Zephyr
              </option>
            </select>
          </div>
        </section>
      </div>

      {/* RESULTS */}

      {generatedCases.length > 0 && (
        <section className="results-section">
          <div className="results-header">
            <div>
              <div className="qa-eyebrow">
                GENERATED RESULTS
              </div>

              <h2>
                {generatedCases.length} Test Cases
                generados
              </h2>
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <button
                className="secondary-button"
                onClick={exportTestCases}
              >
                ↓ Exportar JSON
              </button>

              <button
                className="generate-button"
                onClick={generateGherkin}
                disabled={isGeneratingGherkin}
              >
                {isGeneratingGherkin ? (
                  <>
                    <span className="spinner" />
                    Generando Gherkin...
                  </>
                ) : (
                  <>
                    🥒 Generar Gherkin
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="test-case-list">
            {generatedCases.map(
              (testCase) => (
                <article
                  className="test-case-card"
                  key={testCase.id}
                >
                  <div className="test-case-top">
                    <div className="test-case-id">
                      {testCase.id}
                    </div>

                    <div className="test-case-tags">
                      <span className="tag type">
                        {testCase.type}
                      </span>

                      <span
                        className={`tag priority ${testCase.priority.toLowerCase()}`}
                      >
                        Priority:{" "}
                        {testCase.priority}
                      </span>

                      <span
                        className={`tag priority ${testCase.risk.toLowerCase()}`}
                      >
                        Risk:{" "}
                        {testCase.risk}
                      </span>
                    </div>
                  </div>

                  <h3>
                    {testCase.title}
                  </h3>

                  <div className="test-case-info">
                    <div>
                      <strong>
                        Precondiciones
                      </strong>

                      <p>
                        {testCase.preconditions}
                      </p>
                    </div>

                    <div>
                      <strong>
                        Datos de prueba
                      </strong>

                      {testCase.testData &&
                      testCase.testData.length >
                        0 ? (
                        <ul>
                          {testCase.testData.map(
                            (
                              data,
                              index
                            ) => (
                              <li
                                key={index}
                              >
                                {data}
                              </li>
                            )
                          )}
                        </ul>
                      ) : (
                        <p>
                          No requiere datos
                          específicos.
                        </p>
                      )}
                    </div>

                    <div>
                      <strong>
                        Pasos
                      </strong>

                      <ol>
                        {testCase.steps.map(
                          (
                            step,
                            index
                          ) => (
                            <li
                              key={index}
                            >
                              {step}
                            </li>
                          )
                        )}
                      </ol>
                    </div>

                    <div>
                      <strong>
                        Resultado esperado
                      </strong>

                      <p>
                        {testCase.expected}
                      </p>
                    </div>

                    <div className="automation-status">
                      <strong>
                        Candidato a automatización
                      </strong>

                      <span
                        className={
                          testCase.automationCandidate
                            ? "automation-yes"
                            : "automation-no"
                        }
                      >
                        {testCase.automationCandidate
                          ? "✓ Sí"
                          : "✕ No"}
                      </span>
                    </div>
                  </div>
                </article>
              )
            )}
          </div>
        </section>
      )}

      {/* GHERKIN */}

      {gherkinResult && (
        <section className="results-section">
          <div className="results-header">
            <div>
              <div className="qa-eyebrow">
                BDD / GHERKIN
              </div>

              <h2>
                Escenarios Gherkin generados
              </h2>
            </div>

            <button
              className="secondary-button"
              onClick={exportGherkin}
            >
              ↓ Exportar .feature
            </button>
          </div>

          <div className="generator-card">
            <div className="card-title">
              <div className="card-title-icon">
                🥒
              </div>

              <div>
                <h2>
                  Feature:{" "}
                  {gherkinResult.feature}
                </h2>

                {gherkinResult.description && (
                  <p>
                    {gherkinResult.description}
                  </p>
                )}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "18px",
              }}
            >
              {gherkinResult.scenarios.map(
                (scenario, index) => (
                  <div
                    key={`${scenario.name}-${index}`}
                    className="test-case-card"
                  >
                    <div className="test-case-top">
                      <div className="test-case-id">
                        SC-{String(
                          index + 1
                        ).padStart(3, "0")}
                      </div>

                      <span className="tag type">
                        Scenario
                      </span>
                    </div>

                    <h3>
                      {scenario.name}
                    </h3>

                    <div className="test-case-info">
                      {scenario.given?.length >
                        0 && (
                        <div>
                          <strong>
                            Given
                          </strong>

                          <ul>
                            {scenario.given.map(
                              (
                                step,
                                stepIndex
                              ) => (
                                <li
                                  key={
                                    stepIndex
                                  }
                                >
                                  {step}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                      {scenario.when?.length >
                        0 && (
                        <div>
                          <strong>
                            When
                          </strong>

                          <ul>
                            {scenario.when.map(
                              (
                                step,
                                stepIndex
                              ) => (
                                <li
                                  key={
                                    stepIndex
                                  }
                                >
                                  {step}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                      {scenario.then?.length >
                        0 && (
                        <div>
                          <strong>
                            Then
                          </strong>

                          <ul>
                            {scenario.then.map(
                              (
                                step,
                                stepIndex
                              ) => (
                                <li
                                  key={
                                    stepIndex
                                  }
                                >
                                  {step}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* RAW GHERKIN */}

          <div className="generator-card">
            <div className="card-title">
              <div className="card-title-icon secondary">
                {"</>"}
              </div>

              <div>
                <h2>
                  Gherkin / BDD
                </h2>

                <p>
                  Archivo compatible con
                  herramientas BDD como
                  Cucumber.
                </p>
              </div>
            </div>

            <pre
              style={{
                margin: 0,
                padding: "24px",
                borderRadius: "12px",
                overflowX: "auto",
                whiteSpace: "pre-wrap",
                fontFamily:
                  "monospace",
                lineHeight: 1.7,
                background:
                  "rgba(0, 0, 0, 0.25)",
              }}
            >
              {buildGherkinText()}
            </pre>
          </div>
        </section>
      )}
    </div>
  );
}