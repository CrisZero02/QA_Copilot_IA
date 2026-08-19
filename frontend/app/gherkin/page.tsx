"use client";

import { useState } from "react";

type GherkinScenario = {
  feature: string;
  scenario: string;
  given: string[];
  when: string[];
  then: string[];
};

type GherkinResult = {
  scenarios: GherkinScenario[];
};

export default function GherkinPage() {
  const [testCasesInput, setTestCasesInput] = useState("");
  const [result, setResult] = useState<GherkinResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateGherkin = async () => {
    if (!testCasesInput.trim()) {
      return;
    }

    setIsGenerating(true);
    setCopied(false);

    try {
      const parsedTestCases = JSON.parse(testCasesInput);

      const response = await fetch("/api/gherkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          testCases: parsedTestCases,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Error generando Gherkin."
        );
      }

      setResult(data);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "No fue posible generar el Gherkin."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const buildGherkinText = () => {
    if (!result) {
      return "";
    }

    return result.scenarios
      .map((scenario) => {
        const lines = [
          `Feature: ${scenario.feature}`,
          "",
          `Scenario: ${scenario.scenario}`,
        ];

        scenario.given.forEach((step, index) => {
          lines.push(
            `${index === 0 ? "  Given" : "  And"} ${step}`
          );
        });

        scenario.when.forEach((step, index) => {
          lines.push(
            `${index === 0 ? "  When" : "  And"} ${step}`
          );
        });

        scenario.then.forEach((step, index) => {
          lines.push(
            `${index === 0 ? "  Then" : "  And"} ${step}`
          );
        });

        return lines.join("\n");
      })
      .join("\n\n");
  };

  const copyGherkin = async () => {
    const text = buildGherkinText();

    if (!text) {
      return;
    }

    await navigator.clipboard.writeText(text);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="qa-page">
      <div className="qa-page-header">
        <div>
          <div className="qa-eyebrow">
            <span className="status-dot" />
            BDD / GHERKIN GENERATOR
          </div>

          <h1>Generador Gherkin</h1>

          <p>
            Convertí tus Test Cases en escenarios
            BDD listos para automatización.
          </p>
        </div>

        <div className="ai-status">
          <span className="status-dot" />
          AI Ready
        </div>
      </div>

      <div className="generator-layout">
        <section className="generator-card">
          <div className="card-title">
            <div className="card-title-icon">
              ✦
            </div>

            <div>
              <h2>Test Cases</h2>

              <p>
                Pegá los Test Cases en formato JSON.
              </p>
            </div>
          </div>

          <label htmlFor="test-cases">
            Test Cases JSON
          </label>

          <textarea
            id="test-cases"
            value={testCasesInput}
            onChange={(event) =>
              setTestCasesInput(event.target.value)
            }
            placeholder={`Ejemplo:

[
  {
    "id": "TC-001",
    "title": "Login exitoso",
    "type": "Functional",
    "priority": "High",
    "preconditions": "Usuario registrado",
    "steps": [
      "Ingresar email válido",
      "Ingresar contraseña válida",
      "Presionar Ingresar"
    ],
    "expected": "El usuario accede al sistema"
  }
]`}
          />

          <div className="input-footer">
            <span>
              {testCasesInput.length} caracteres
            </span>

            <button
              className="generate-button"
              onClick={generateGherkin}
              disabled={
                isGenerating ||
                !testCasesInput.trim()
              }
            >
              {isGenerating ? (
                <>
                  <span className="spinner" />
                  Generando...
                </>
              ) : (
                <>✦ Generar Gherkin</>
              )}
            </button>
          </div>
        </section>

        <section className="generator-card configuration-card">
          <div className="card-title">
            <div className="card-title-icon secondary">
              ⚙
            </div>

            <div>
              <h2>BDD / Gherkin</h2>

              <p>
                Resultado estructurado para
                automatización.
              </p>
            </div>
          </div>

          <div className="config-group">
            <label>Formato</label>

            <select defaultValue="gherkin">
              <option value="gherkin">
                Gherkin / BDD
              </option>

              <option value="cucumber">
                Cucumber
              </option>

              <option value="generic">
                Generic BDD
              </option>
            </select>
          </div>

          <div className="config-group">
            <label>Idioma</label>

            <select defaultValue="es">
              <option value="es">
                Español
              </option>

              <option value="en">
                English
              </option>
            </select>
          </div>

          <div className="config-group">
            <label>Objetivo</label>

            <select defaultValue="automation">
              <option value="automation">
                Automatización
              </option>

              <option value="documentation">
                Documentación
              </option>

              <option value="both">
                Automatización + Documentación
              </option>
            </select>
          </div>
        </section>
      </div>

      {result && (
        <section className="results-section">
          <div className="results-header">
            <div>
              <div className="qa-eyebrow">
                GENERATED BDD
              </div>

              <h2>
                {result.scenarios.length} escenarios
                generados
              </h2>
            </div>

            <button
              className="secondary-button"
              onClick={copyGherkin}
            >
              {copied
                ? "✓ Copiado"
                : "⧉ Copiar Gherkin"}
            </button>
          </div>

          <div className="gherkin-results">
            {result.scenarios.map(
              (scenario, index) => (
                <article
                  className="test-case-card"
                  key={`${scenario.scenario}-${index}`}
                >
                  <div className="test-case-top">
                    <div className="test-case-id">
                      SCENARIO-{String(
                        index + 1
                      ).padStart(3, "0")}
                    </div>

                    <div className="test-case-tags">
                      <span className="tag type">
                        Gherkin
                      </span>

                      <span className="tag priority high">
                        BDD
                      </span>
                    </div>
                  </div>

                  <h3>
                    Feature: {scenario.feature}
                  </h3>

                  <div className="gherkin-code">
                    <div>
                      <span className="gherkin-keyword">
                        Scenario:
                      </span>{" "}
                      {scenario.scenario}
                    </div>

                    {scenario.given.map(
                      (step, stepIndex) => (
                        <div key={`given-${stepIndex}`}>
                          <span className="gherkin-keyword">
                            {stepIndex === 0
                              ? "Given"
                              : "And"}
                          </span>{" "}
                          {step}
                        </div>
                      )
                    )}

                    {scenario.when.map(
                      (step, stepIndex) => (
                        <div key={`when-${stepIndex}`}>
                          <span className="gherkin-keyword">
                            {stepIndex === 0
                              ? "When"
                              : "And"}
                          </span>{" "}
                          {step}
                        </div>
                      )
                    )}

                    {scenario.then.map(
                      (step, stepIndex) => (
                        <div key={`then-${stepIndex}`}>
                          <span className="gherkin-keyword">
                            {stepIndex === 0
                              ? "Then"
                              : "And"}
                          </span>{" "}
                          {step}
                        </div>
                      )
                    )}
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