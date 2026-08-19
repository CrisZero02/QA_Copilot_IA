"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type DashboardActivity = {
  id: string;
  type: "test-case" | "gherkin" | "defect" | "api-test";
  status: "success" | "danger" | "info";
  title: string;
  description: string;
  timestamp: string;
};

type DashboardMetrics = {
  testCases: number;
  defects: number;
  apiTests: number;
  gherkinScenarios: number;
  totalActivities: number;
};

type DashboardResponse = {
  success: boolean;
  metrics: DashboardMetrics;
  activities: DashboardActivity[];
};

const menuItems = [
  { icon: "⌂", label: "Dashboard" },
  { icon: "🧪", label: "Test Cases" },
  { icon: "🥒", label: "Gherkin / BDD" },
  { icon: "🐞", label: "Defects" },
  { icon: "↔", label: "API Testing" },
  { icon: "▣", label: "Test Management" },
  { icon: "▥", label: "QA Metrics" },
  { icon: "✦", label: "AI Assistant" },
];

function formatActivityTime(timestamp: string) {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const diff =
    Date.now() - date.getTime();

  const minutes = Math.floor(
    diff / 60000
  );

  if (minutes < 1) {
    return "Ahora";
  }

  if (minutes < 60) {
    return `Hace ${minutes} min`;
  }

  const hours = Math.floor(
    minutes / 60
  );

  if (hours < 24) {
    return `Hace ${hours} hora${
      hours === 1 ? "" : "s"
    }`;
  }

  const days = Math.floor(
    hours / 24
  );

  return `Hace ${days} día${
    days === 1 ? "" : "s"
  }`;
}

function getActivityIcon(
  type: DashboardActivity["type"]
) {
  switch (type) {
    case "test-case":
      return "✓";

    case "gherkin":
      return "🥒";

    case "defect":
      return "🐞";

    case "api-test":
      return "↔";

    default:
      return "✓";
  }
}

export default function Home() {
  const router = useRouter();

  const [activeItem, setActiveItem] =
    useState("Dashboard");

  const [metrics, setMetrics] =
    useState<DashboardMetrics>({
      testCases: 0,
      defects: 0,
      apiTests: 0,
      gherkinScenarios: 0,
      totalActivities: 0,
    });

  const [activities, setActivities] =
    useState<DashboardActivity[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    const loadDashboard =
      async () => {
        try {
          const response =
            await fetch(
              "/api/dashboard",
              {
                cache: "no-store",
              }
            );

          if (!response.ok) {
            throw new Error(
              "No fue posible cargar el Dashboard."
            );
          }

          const data =
            (await response.json()) as DashboardResponse;

          if (!data.success) {
            throw new Error(
              "La API del Dashboard devolvió un error."
            );
          }

          setMetrics(
            data.metrics
          );

          setActivities(
            data.activities
          );
        } catch (error) {
          console.error(
            "Dashboard Error:",
            error
          );
        } finally {
          setIsLoading(false);
        }
      };

    loadDashboard();
  }, []);

  const navigateTo = (
    label: string
  ) => {
    setActiveItem(label);

    if (label === "Dashboard") {
      router.push("/");
    }

    if (label === "Test Cases") {
      router.push("/test-cases");
    }

    if (label === "Gherkin / BDD") {
      router.push("/gherkin");
    }

    if (label === "Defects") {
      router.push("/defects");
    }

    if (label === "API Testing") {
      router.push("/api-testing");
    }
  };

  return (
    <div className="app-container">
      {/* SIDEBAR */}

      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            ✦
          </div>

          <div>
            <div className="brand-name">
              QA Copilot
            </div>

            <div className="brand-subtitle">
              INTELLIGENT QA PLATFORM
            </div>
          </div>
        </div>

        <nav className="navigation">
          <div className="nav-section-title">
            PLATAFORMA
          </div>

          {menuItems.map(
            (item) => (
              <button
                key={item.label}
                className={`nav-item ${
                  activeItem ===
                  item.label
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  navigateTo(
                    item.label
                  )
                }
              >
                <span className="nav-icon">
                  {item.icon}
                </span>

                <span>
                  {item.label}
                </span>
              </button>
            )
          )}
        </nav>

        <div className="sidebar-bottom">
          <button
            className={`nav-item ${
              activeItem ===
              "Settings"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveItem(
                "Settings"
              )
            }
          >
            <span className="nav-icon">
              ⚙
            </span>

            <span>
              Settings
            </span>
          </button>

          <div className="sidebar-user">
            <div className="avatar">
              CZ
            </div>

            <div className="user-info">
              <strong>
                QA Engineer
              </strong>

              <span>
                Administrator
              </span>
            </div>

            <span className="user-menu">
              •••
            </span>
          </div>
        </div>
      </aside>

      {/* MAIN */}

      <main className="main-content">
        {/* HEADER */}

        <header className="topbar">
          <div className="breadcrumb">
            <span>
              QA Copilot
            </span>

            <span>/</span>

            <strong>
              {activeItem}
            </strong>
          </div>

          <div className="topbar-actions">
            <button
              className="icon-button"
              title="Notifications"
            >
              🔔

              <span className="notification-dot" />
            </button>

            <div className="topbar-avatar">
              CZ
            </div>
          </div>
        </header>

        {/* CONTENT */}

        <div className="content">
          {/* WELCOME */}

          <section className="welcome-section">
            <div>
              <div className="eyebrow">
                <span className="status-dot" />

                AI-POWERED QUALITY ASSURANCE
              </div>

              <h1>
                Dashboard
              </h1>

              <p>
                Bienvenido a{" "}
                <strong>
                  QA Copilot IA
                </strong>
                . Tu plataforma inteligente
                para optimizar y acelerar el
                proceso de testing.
              </p>
            </div>

            <button
              className="primary-button"
              onClick={() =>
                router.push(
                  "/test-cases"
                )
              }
            >
              <span>✦</span>

              Generar con IA
            </button>
          </section>

          {/* METRICS */}

          <section className="metrics-grid">
            {/* TEST CASES */}

            <div className="metric-card">
              <div className="metric-header">
                <div className="metric-icon">
                  🧪
                </div>

                <span className="metric-change">
                  Real
                </span>
              </div>

              <div className="metric-value">
                {isLoading
                  ? "—"
                  : metrics.testCases}
              </div>

              <div className="metric-label">
                Test Cases
              </div>

              <div className="metric-description">
                Generados con IA
              </div>
            </div>

            {/* GHERKIN */}

            <div className="metric-card">
              <div className="metric-header">
                <div className="metric-icon">
                  🥒
                </div>

                <span className="metric-change">
                  Real
                </span>
              </div>

              <div className="metric-value">
                {isLoading
                  ? "—"
                  : metrics.gherkinScenarios}
              </div>

              <div className="metric-label">
                Gherkin
              </div>

              <div className="metric-description">
                Escenarios generados
              </div>
            </div>

            {/* DEFECTS */}

            <div className="metric-card">
              <div className="metric-header">
                <div className="metric-icon">
                  🐞
                </div>

                <span className="metric-change">
                  Real
                </span>
              </div>

              <div className="metric-value">
                {isLoading
                  ? "—"
                  : metrics.defects}
              </div>

              <div className="metric-label">
                Defects
              </div>

              <div className="metric-description">
                Analizados con IA
              </div>
            </div>

            {/* API */}

            <div className="metric-card">
              <div className="metric-header">
                <div className="metric-icon">
                  ↔
                </div>

                <span className="metric-change">
                  Real
                </span>
              </div>

              <div className="metric-value">
                {isLoading
                  ? "—"
                  : metrics.apiTests}
              </div>

              <div className="metric-label">
                API Tests
              </div>

              <div className="metric-description">
                Requests ejecutados
              </div>
            </div>
          </section>

          {/* MAIN GRID */}

          <section className="dashboard-grid">
            {/* ACTIVITY */}

            <div className="panel activity-panel">
              <div className="panel-header">
                <div>
                  <h2>
                    Actividad reciente
                  </h2>

                  <p>
                    Últimas acciones realizadas
                    en la plataforma
                  </p>
                </div>

                <button
                  className="text-button"
                  onClick={() =>
                    window.location.reload()
                  }
                >
                  Actualizar →
                </button>
              </div>

              <div className="activity-list">
                {isLoading ? (
                  <div className="activity-item">
                    <div className="activity-content">
                      <strong>
                        Cargando actividad...
                      </strong>
                    </div>
                  </div>
                ) : activities.length ===
                  0 ? (
                  <div className="activity-item">
                    <div className="activity-icon info">
                      ✦
                    </div>

                    <div className="activity-content">
                      <strong>
                        Sin actividad todavía
                      </strong>

                      <span>
                        Generá un Test Case,
                        analizá un defecto,
                        ejecutá un API test o
                        generá Gherkin para comenzar.
                      </span>
                    </div>
                  </div>
                ) : (
                  activities.map(
                    (activity) => (
                      <div
                        className="activity-item"
                        key={
                          activity.id
                        }
                      >
                        <div
                          className={`activity-icon ${activity.status}`}
                        >
                          {getActivityIcon(
                            activity.type
                          )}
                        </div>

                        <div className="activity-content">
                          <strong>
                            {
                              activity.title
                            }
                          </strong>

                          <span>
                            {
                              activity.description
                            }
                          </span>
                        </div>

                        <time>
                          {formatActivityTime(
                            activity.timestamp
                          )}
                        </time>
                      </div>
                    )
                  )
                )}
              </div>
            </div>

            {/* AI PANEL */}

            <div className="panel ai-panel">
              <div className="ai-glow" />

              <div className="ai-content">
                <div className="ai-icon">
                  ✦
                </div>

                <div className="ai-badge">
                  AI COPILOT
                </div>

                <h2>
                  ¿En qué podemos ayudarte?
                </h2>

                <p>
                  Generá casos de prueba,
                  analizá requisitos, creá
                  escenarios y acelerá tu
                  proceso de QA utilizando
                  inteligencia artificial.
                </p>

                <button
                  className="ai-button"
                  onClick={() =>
                    router.push(
                      "/test-cases"
                    )
                  }
                >
                  <span>✦</span>

                  Abrir AI Assistant
                </button>
              </div>
            </div>
          </section>

          {/* QUICK ACTIONS */}

          <section className="quick-section">
            <div className="section-heading">
              <h2>
                Acciones rápidas
              </h2>

              <p>
                Herramientas frecuentes de QA
              </p>
            </div>

            <div className="quick-grid">
              <button
                className="quick-card"
                onClick={() =>
                  router.push(
                    "/test-cases"
                  )
                }
              >
                <span className="quick-icon">
                  🧪
                </span>

                <span>
                  <strong>
                    Generar Test Cases
                  </strong>

                  <small>
                    Desde una User Story
                  </small>
                </span>

                <span className="arrow">
                  →
                </span>
              </button>

              <button
                className="quick-card"
                onClick={() =>
                  router.push(
                    "/defects"
                  )
                }
              >
                <span className="quick-icon">
                  🐞
                </span>

                <span>
                  <strong>
                    Analizar Defecto
                  </strong>

                  <small>
                    Detectar causa probable
                  </small>
                </span>

                <span className="arrow">
                  →
                </span>
              </button>

              <button
                className="quick-card"
                onClick={() =>
                  router.push(
                    "/api-testing"
                  )
                }
              >
                <span className="quick-icon">
                  ↔
                </span>

                <span>
                  <strong>
                    Probar API
                  </strong>

                  <small>
                    Crear escenario automáticamente
                  </small>
                </span>

                <span className="arrow">
                  →
                </span>
              </button>

              <button
                className="quick-card"
                onClick={() =>
                  setActiveItem(
                    "QA Metrics"
                  )
                }
              >
                <span className="quick-icon">
                  ▥
                </span>

                <span>
                  <strong>
                    Ver Métricas
                  </strong>

                  <small>
                    Analizar calidad del proyecto
                  </small>
                </span>

                <span className="arrow">
                  →
                </span>
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}