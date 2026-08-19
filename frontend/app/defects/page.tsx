"use client";

import { useState } from "react";

type DefectAnalysis = {
  summary: string;
  severity: string;
  priority: string;
  category: string;
  probableCause: string;
  impact: string;
  affectedArea: string;
  reproductionConfidence: string;
  recommendedTests: string[];
  automationCandidate: boolean;
  recommendations: string[];
};

export default function DefectsPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState("");
  const [actualResult, setActualResult] = useState("");
  const [expectedResult, setExpectedResult] = useState("");
  const [environment, setEnvironment] = useState("");

  const [analysis, setAnalysis] =
    useState<DefectAnalysis | null>(null);

  const [isAnalyzing, setIsAnalyzing] =
    useState(false);

  const analyzeDefect = async () => {
    if (
      !title.trim() ||
      !description.trim()
    ) {
      alert(
        "Ingresá al menos el título y la descripción del defecto."
      );

      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const response = await fetch(
        "/api/defects",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            defect: {
              title,
              description,
              steps,
              actualResult,
              expectedResult,
              environment,
            },
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Error analizando el defecto."
        );
      }

      setAnalysis(data);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "No fue posible analizar el defecto."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearForm = () => {
    setTitle("");
    setDescription("");
    setSteps("");
    setActualResult("");
    setExpectedResult("");
    setEnvironment("");
    setAnalysis(null);
  };

  const exportAnalysis = () => {
    if (!analysis) {
      return;
    }

    const exportData = {
      defect: {
        title,
        description,
        steps,
        actualResult,
        expectedResult,
        environment,
      },
      analysis,
    };

    const json = JSON.stringify(
      exportData,
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
      "qa-defect-analysis.json";

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
            AI DEFECT ANALYZER
          </div>

          <h1>
            Analizador de Defectos
          </h1>

          <p>
            Analizá defectos de software,
            determiná su impacto y obtené
            recomendaciones utilizando
            inteligencia artificial.
          </p>
        </div>

        <div className="ai-status">
          <span className="status-dot" />
          AI Ready
        </div>
      </div>

      {/* INPUT */}

      <div className="generator-layout">
        <section className="generator-card">
          <div className="card-title">
            <div className="card-title-icon">
              🐞
            </div>

            <div>
              <h2>
                Información del defecto
              </h2>

              <p>
                Ingresá la información
                disponible del defecto.
              </p>
            </div>
          </div>

          <div className="defect-form">
            {/* TITLE */}

            <div className="form-group">
              <label htmlFor="defect-title">
                Título del defecto
              </label>

              <input
                id="defect-title"
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value
                  )
                }
                placeholder="Ej: Error al iniciar sesión con contraseña incorrecta"
              />
            </div>

            {/* DESCRIPTION */}

            <div className="form-group">
              <label htmlFor="defect-description">
                Descripción
              </label>

              <textarea
                id="defect-description"
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                placeholder="Describí qué ocurre, cuándo ocurre y bajo qué condiciones."
              />
            </div>

            {/* STEPS */}

            <div className="form-group">
              <label htmlFor="defect-steps">
                Pasos para reproducir
              </label>

              <textarea
                id="defect-steps"
                value={steps}
                onChange={(event) =>
                  setSteps(
                    event.target.value
                  )
                }
                placeholder={`1. Ingresar al login
2. Ingresar usuario válido
3. Ingresar contraseña incorrecta
4. Presionar "Ingresar"`}
              />
            </div>

            {/* RESULTS */}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="actual-result">
                  Resultado actual
                </label>

                <textarea
                  id="actual-result"
                  value={actualResult}
                  onChange={(event) =>
                    setActualResult(
                      event.target.value
                    )
                  }
                  placeholder="¿Qué ocurrió realmente?"
                />
              </div>

              <div className="form-group">
                <label htmlFor="expected-result">
                  Resultado esperado
                </label>

                <textarea
                  id="expected-result"
                  value={expectedResult}
                  onChange={(event) =>
                    setExpectedResult(
                      event.target.value
                    )
                  }
                  placeholder="¿Qué debería haber ocurrido?"
                />
              </div>
            </div>

            {/* ENVIRONMENT */}

            <div className="form-group">
              <label htmlFor="environment">
                Ambiente
              </label>

              <input
                id="environment"
                type="text"
                value={environment}
                onChange={(event) =>
                  setEnvironment(
                    event.target.value
                  )
                }
                placeholder="Ej: QA / Chrome 151 / Windows 11"
              />
            </div>
          </div>

          {/* ACTIONS */}

          <div className="input-footer">
            <button
              className="secondary-button"
              onClick={clearForm}
              disabled={isAnalyzing}
            >
              Limpiar
            </button>

            <button
              className="generate-button"
              onClick={analyzeDefect}
              disabled={
                isAnalyzing ||
                !title.trim() ||
                !description.trim()
              }
            >
              {isAnalyzing ? (
                <>
                  <span className="spinner" />
                  Analizando defecto...
                </>
              ) : (
                <>
                  🐞 Analizar Defecto
                </>
              )}
            </button>
          </div>
        </section>

        {/* ANALYSIS SUMMARY */}

        <section className="generator-card configuration-card">
          <div className="card-title">
            <div className="card-title-icon secondary">
              ✦
            </div>

            <div>
              <h2>
                Análisis IA
              </h2>

              <p>
                Evaluación automática del
                defecto.
              </p>
            </div>
          </div>

          {!analysis && !isAnalyzing && (
            <div className="empty-analysis">
              <div className="empty-analysis-icon">
                🐞
              </div>

              <h3>
                Esperando un defecto
              </h3>

              <p>
                Completá la información del
                defecto y ejecutá el análisis
                con IA.
              </p>
            </div>
          )}

          {isAnalyzing && (
            <div className="empty-analysis">
              <div className="analysis-spinner">
                ✦
              </div>

              <h3>
                Analizando defecto...
              </h3>

              <p>
                La IA está evaluando
                severidad, prioridad,
                impacto y riesgos.
              </p>
            </div>
          )}

          {analysis && (
            <div className="analysis-summary">
              <div className="analysis-score-grid">
                <div className="analysis-score">
                  <span>
                    Severidad
                  </span>

                  <strong
                    className={`severity-${analysis.severity.toLowerCase()}`}
                  >
                    {analysis.severity}
                  </strong>
                </div>

                <div className="analysis-score">
                  <span>
                    Prioridad
                  </span>

                  <strong>
                    {analysis.priority}
                  </strong>
                </div>

                <div className="analysis-score">
                  <span>
                    Categoría
                  </span>

                  <strong>
                    {analysis.category}
                  </strong>
                </div>

                <div className="analysis-score">
                  <span>
                    Reproducción
                  </span>

                  <strong>
                    {
                      analysis.reproductionConfidence
                    }
                  </strong>
                </div>
              </div>

              <div className="analysis-block">
                <strong>
                  Resumen
                </strong>

                <p>
                  {analysis.summary}
                </p>
              </div>

              <div className="analysis-block">
                <strong>
                  Área afectada
                </strong>

                <p>
                  {analysis.affectedArea}
                </p>
              </div>

              <div className="analysis-block">
                <strong>
                  Causa probable
                </strong>

                <p>
                  {analysis.probableCause}
                </p>
              </div>

              <div className="analysis-block">
                <strong>
                  Impacto
                </strong>

                <p>
                  {analysis.impact}
                </p>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* FULL RESULTS */}

      {analysis && (
        <section className="results-section">
          <div className="results-header">
            <div>
              <div className="qa-eyebrow">
                AI DEFECT ANALYSIS
              </div>

              <h2>
                Resultado del análisis
              </h2>
            </div>

            <button
              className="secondary-button"
              onClick={exportAnalysis}
            >
              ↓ Exportar JSON
            </button>
          </div>

          <div className="defect-results-grid">
            {/* RECOMMENDED TESTS */}

            <article className="test-case-card">
              <div className="result-card-header">
                <div className="result-card-icon">
                  🧪
                </div>

                <div>
                  <h3>
                    Tests recomendados
                  </h3>

                  <p>
                    Pruebas sugeridas por la IA
                  </p>
                </div>
              </div>

              <ol className="recommendation-list">
                {analysis.recommendedTests.map(
                  (test, index) => (
                    <li key={index}>
                      {test}
                    </li>
                  )
                )}
              </ol>
            </article>

            {/* RECOMMENDATIONS */}

            <article className="test-case-card">
              <div className="result-card-header">
                <div className="result-card-icon">
                  💡
                </div>

                <div>
                  <h3>
                    Recomendaciones QA
                  </h3>

                  <p>
                    Acciones sugeridas
                  </p>
                </div>
              </div>

              <ul className="recommendation-list">
                {analysis.recommendations.map(
                  (
                    recommendation,
                    index
                  ) => (
                    <li key={index}>
                      {recommendation}
                    </li>
                  )
                )}
              </ul>
            </article>

            {/* AUTOMATION */}

            <article className="test-case-card automation-card">
              <div className="result-card-header">
                <div className="result-card-icon">
                  🤖
                </div>

                <div>
                  <h3>
                    Automatización
                  </h3>

                  <p>
                    Candidato a automatización
                  </p>
                </div>
              </div>

              <div
                className={
                  analysis.automationCandidate
                    ? "automation-yes"
                    : "automation-no"
                }
              >
                {analysis.automationCandidate
                  ? "✓ Sí, es candidato"
                  : "✕ No es candidato"}
              </div>

              <p>
                {analysis.automationCandidate
                  ? "El escenario es estable, repetible y objetivamente verificable."
                  : "El escenario puede requerir validación manual, exploratoria o subjetiva."}
              </p>
            </article>
          </div>
        </section>
      )}
    </div>
  );
}