"use client";

import { useState } from "react";

type MetricCard = {
  label: string;
  value: string;
  change: string;
  description: string;
  icon: string;
  trend: "positive" | "negative";
};

type ExecutionStatus = {
  label: string;
  value: number;
  percentage: number;
};

type DefectSeverity = {
  label: string;
  value: number;
  description: string;
};

const metricCards: MetricCard[] = [
  {
    label: "Test Coverage",
    value: "86%",
    change: "+4.2%",
    description: "vs. período anterior",
    icon: "◉",
    trend: "positive",
  },
  {
    label: "Pass Rate",
    value: "91.4%",
    change: "+3.8%",
    description: "vs. período anterior",
    icon: "✓",
    trend: "positive",
  },
  {
    label: "Defect Detection Rate",
    value: "23.7%",
    change: "+5.1%",
    description: "vs. período anterior",
    icon: "🐞",
    trend: "positive",
  },
  {
    label: "Automation Rate",
    value: "68%",
    change: "+7.4%",
    description: "vs. período anterior",
    icon: "⚙",
    trend: "positive",
  },
];

const executionStatuses: ExecutionStatus[] = [
  {
    label: "Passed",
    value: 914,
    percentage: 71,
  },
  {
    label: "Failed",
    value: 128,
    percentage: 10,
  },
  {
    label: "Blocked",
    value: 64,
    percentage: 5,
  },
  {
    label: "Not Executed",
    value: 180,
    percentage: 14,
  },
];

const defectSeverities: DefectSeverity[] = [
  {
    label: "Critical",
    value: 12,
    description: "Impacto crítico",
  },
  {
    label: "High",
    value: 48,
    description: "Alta prioridad",
  },
  {
    label: "Medium",
    value: 126,
    description: "Impacto moderado",
  },
  {
    label: "Low",
    value: 156,
    description: "Impacto bajo",
  },
];

const trendData = [
  {
    month: "Mar",
    coverage: 72,
    passRate: 82,
  },
  {
    month: "Abr",
    coverage: 75,
    passRate: 85,
  },
  {
    month: "May",
    coverage: 79,
    passRate: 87,
  },
  {
    month: "Jun",
    coverage: 81,
    passRate: 89,
  },
  {
    month: "Jul",
    coverage: 84,
    passRate: 90,
  },
  {
    month: "Ago",
    coverage: 86,
    passRate: 91,
  },
];

export default function QAMetricsPage() {
  const [period, setPeriod] = useState("Últimos 30 días");

  const totalExecutions = executionStatuses.reduce(
    (total, status) => total + status.value,
    0
  );

  const totalDefects = defectSeverities.reduce(
    (total, severity) => total + severity.value,
    0
  );

  return (
    <div className="qa-page">
      {/* HEADER */}

      <div className="qa-page-header">
        <div>
          <div className="qa-eyebrow">
            <span className="status-dot" />
            QA QUALITY ANALYTICS
          </div>

          <h1>QA Metrics</h1>

          <p>
            Analizá el estado de calidad del proyecto mediante
            métricas y tendencias de testing.
          </p>
        </div>

        <div className="ai-status">
          <span className="status-dot" />
          Analytics Ready
        </div>
      </div>

      {/* FILTERS */}

      <section className="generator-card metrics-filter-card">
        <div className="metrics-filter-header">
          <div>
            <div className="card-title">
              <div className="card-title-icon secondary">
                ◷
              </div>

              <div>
                <h2>Período de análisis</h2>

                <p>
                  Seleccioná el período utilizado para calcular
                  las métricas.
                </p>
              </div>
            </div>
          </div>

          <div className="metrics-filter-control">
            <label htmlFor="period">
              Período
            </label>

            <select
              id="period"
              value={period}
              onChange={(event) =>
                setPeriod(event.target.value)
              }
            >
              <option>
                Últimos 7 días
              </option>

              <option>
                Últimos 30 días
              </option>

              <option>
                Últimos 90 días
              </option>

              <option>
                Este año
              </option>
            </select>
          </div>
        </div>
      </section>

      {/* MAIN METRICS */}

      <section className="metrics-grid">
        {metricCards.map((metric) => (
          <div
            className="metric-card"
            key={metric.label}
          >
            <div className="metric-header">
              <div className="metric-icon">
                {metric.icon}
              </div>

              <span className="metric-change">
                {metric.change}
              </span>
            </div>

            <div className="metric-value">
              {metric.value}
            </div>

            <div className="metric-label">
              {metric.label}
            </div>

            <div className="metric-description">
              {metric.description}
            </div>
          </div>
        ))}
      </section>

      {/* OVERVIEW GRID */}

      <section className="dashboard-grid">
        {/* EXECUTION OVERVIEW */}

        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>Execution Overview</h2>

              <p>
                Estado de ejecución de los Test Cases
              </p>
            </div>

            <span className="tag type">
              {totalExecutions} ejecuciones
            </span>
          </div>

          <div className="metrics-list">
            {executionStatuses.map((status) => (
              <div
                className="metric-list-item"
                key={status.label}
              >
                <div className="metric-list-header">
                  <strong>
                    {status.label}
                  </strong>

                  <span>
                    {status.value}{" "}
                    ({status.percentage}%)
                  </span>
                </div>

                <div className="metric-progress">
                  <div
                    className={`metric-progress-bar ${status.label
                      .toLowerCase()
                      .replace(" ", "-")}`}
                    style={{
                      width: `${status.percentage}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DEFECT OVERVIEW */}

        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>Defect Overview</h2>

              <p>
                Distribución de defectos por severidad
              </p>
            </div>

            <span className="tag type">
              {totalDefects} defectos
            </span>
          </div>

          <div className="defect-metrics">
            {defectSeverities.map((severity) => (
              <div
                className="defect-metric"
                key={severity.label}
              >
                <div className="defect-metric-top">
                  <span
                    className={`severity-indicator ${severity.label.toLowerCase()}`}
                  />

                  <strong>
                    {severity.label}
                  </strong>
                </div>

                <div className="defect-metric-value">
                  {severity.value}
                </div>

                <span className="defect-metric-description">
                  {severity.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUALITY TREND */}

      <section className="panel metrics-trend-panel">
        <div className="panel-header">
          <div>
            <h2>Quality Trends</h2>

            <p>
              Evolución de cobertura y porcentaje de pruebas
              exitosas.
            </p>
          </div>

          <div className="trend-legend">
            <span>
              <i className="legend-dot coverage" />
              Coverage
            </span>

            <span>
              <i className="legend-dot pass-rate" />
              Pass Rate
            </span>
          </div>
        </div>

        <div className="trend-chart">
          <div className="chart-y-axis">
            <span>100%</span>
            <span>75%</span>
            <span>50%</span>
            <span>25%</span>
            <span>0%</span>
          </div>

          <div className="chart-area">
            <div className="chart-grid-lines">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>

            <div className="chart-bars">
              {trendData.map((data) => (
                <div
                  className="chart-column"
                  key={data.month}
                >
                  <div className="chart-values">
                    <span>
                      {data.coverage}%
                    </span>

                    <span>
                      {data.passRate}%
                    </span>
                  </div>

                  <div className="chart-bars-wrapper">
                    <div
                      className="chart-bar coverage-bar"
                      style={{
                        height: `${data.coverage}%`,
                      }}
                    />

                    <div
                      className="chart-bar pass-rate-bar"
                      style={{
                        height: `${data.passRate}%`,
                      }}
                    />
                  </div>

                  <span className="chart-label">
                    {data.month}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* QA HEALTH */}

      <section className="dashboard-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>QA Health</h2>

              <p>
                Indicadores generales del estado de calidad.
              </p>
            </div>

            <span className="tag type">
              {period}
            </span>
          </div>

          <div className="qa-health">
            <div className="health-score">
              <div className="health-score-circle">
                <strong>
                  88
                </strong>

                <span>
                  /100
                </span>
              </div>

              <div>
                <strong>
                  Good Quality
                </strong>

                <p>
                  El proyecto presenta un nivel saludable
                  de calidad general.
                </p>
              </div>
            </div>

            <div className="health-indicators">
              <div>
                <span>
                  Coverage
                </span>

                <strong>
                  86%
                </strong>
              </div>

              <div>
                <span>
                  Pass Rate
                </span>

                <strong>
                  91.4%
                </strong>
              </div>

              <div>
                <span>
                  Automation
                </span>

                <strong>
                  68%
                </strong>
              </div>
            </div>
          </div>
        </div>

        <div className="panel ai-panel">
          <div className="ai-glow" />

          <div className="ai-content">
            <div className="ai-icon">
              ✦
            </div>

            <div className="ai-badge">
              AI INSIGHTS
            </div>

            <h2>
              Análisis inteligente
            </h2>

            <p>
              La IA puede analizar estas métricas para
              detectar tendencias, riesgos de calidad y
              oportunidades de mejora.
            </p>

            <button
              className="ai-button"
              onClick={() => {
                alert(
                  "AI Insights estará disponible en el próximo módulo."
                );
              }}
            >
              <span>✦</span>
              Analizar con IA
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}