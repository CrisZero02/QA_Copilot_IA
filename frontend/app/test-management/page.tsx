"use client";

import { useState } from "react";

type TestSuite = {
  id: string;
  name: string;
  description: string;
  tests: number;
  passed: number;
  failed: number;
  blocked: number;
  notRun: number;
  lastRun: string;
  status: "Passed" | "Failed" | "Not Run";
};

type Execution = {
  id: string;
  suite: string;
  tester: string;
  date: string;
  total: number;
  passed: number;
  failed: number;
  blocked: number;
  status: "Completed" | "Failed" | "In Progress";
};

const initialSuites: TestSuite[] = [
  {
    id: "TS-001",
    name: "Regression Suite",
    description: "Suite completa de regresión funcional.",
    tests: 128,
    passed: 112,
    failed: 8,
    blocked: 3,
    notRun: 5,
    lastRun: "Hoy, 14:32",
    status: "Failed",
  },
  {
    id: "TS-002",
    name: "Smoke Suite",
    description: "Validaciones principales para verificar estabilidad.",
    tests: 32,
    passed: 32,
    failed: 0,
    blocked: 0,
    notRun: 0,
    lastRun: "Hoy, 12:15",
    status: "Passed",
  },
  {
    id: "TS-003",
    name: "API Regression",
    description: "Pruebas de regresión de servicios REST.",
    tests: 76,
    passed: 68,
    failed: 5,
    blocked: 1,
    notRun: 2,
    lastRun: "Ayer, 18:40",
    status: "Failed",
  },
  {
    id: "TS-004",
    name: "Login & Authentication",
    description: "Autenticación, sesiones y recuperación de acceso.",
    tests: 45,
    passed: 45,
    failed: 0,
    blocked: 0,
    notRun: 0,
    lastRun: "Ayer, 16:20",
    status: "Passed",
  },
  {
    id: "TS-005",
    name: "User Management",
    description: "Alta, modificación, consulta y baja de usuarios.",
    tests: 54,
    passed: 0,
    failed: 0,
    blocked: 0,
    notRun: 54,
    lastRun: "Nunca",
    status: "Not Run",
  },
];

const initialExecutions: Execution[] = [
  {
    id: "EXEC-024",
    suite: "Regression Suite",
    tester: "QA Engineer",
    date: "19/08/2026 14:32",
    total: 128,
    passed: 112,
    failed: 8,
    blocked: 3,
    status: "Failed",
  },
  {
    id: "EXEC-023",
    suite: "Smoke Suite",
    tester: "QA Engineer",
    date: "19/08/2026 12:15",
    total: 32,
    passed: 32,
    failed: 0,
    blocked: 0,
    status: "Completed",
  },
  {
    id: "EXEC-022",
    suite: "API Regression",
    tester: "QA Engineer",
    date: "18/08/2026 18:40",
    total: 76,
    passed: 68,
    failed: 5,
    blocked: 1,
    status: "Failed",
  },
  {
    id: "EXEC-021",
    suite: "Login & Authentication",
    tester: "QA Engineer",
    date: "18/08/2026 16:20",
    total: 45,
    passed: 45,
    failed: 0,
    blocked: 0,
    status: "Completed",
  },
];

export default function TestManagementPage() {
  const [activeTab, setActiveTab] = useState<
    "suites" | "executions"
  >("suites");

  const [suites] = useState<TestSuite[]>(
    initialSuites
  );

  const [executions] = useState<Execution[]>(
    initialExecutions
  );

  const totalTests = suites.reduce(
    (total, suite) => total + suite.tests,
    0
  );

  const totalPassed = suites.reduce(
    (total, suite) => total + suite.passed,
    0
  );

  const totalFailed = suites.reduce(
    (total, suite) => total + suite.failed,
    0
  );

  const totalBlocked = suites.reduce(
    (total, suite) => total + suite.blocked,
    0
  );

  const totalNotRun = suites.reduce(
    (total, suite) => total + suite.notRun,
    0
  );

  const executionPercentage =
    totalTests > 0
      ? Math.round(
          ((totalPassed +
            totalFailed +
            totalBlocked) /
            totalTests) *
            100
        )
      : 0;

  const passPercentage =
    totalTests > 0
      ? Math.round(
          (totalPassed / totalTests) * 100
        )
      : 0;

  const getStatusClass = (
    status: string
  ) => {
    switch (status) {
      case "Passed":
      case "Completed":
        return "tm-status success";

      case "Failed":
        return "tm-status danger";

      case "In Progress":
        return "tm-status warning";

      default:
        return "tm-status neutral";
    }
  };

  const handleRunSuite = (
    suiteName: string
  ) => {
    alert(
      `La ejecución de "${suiteName}" se conectará al Test Runner en el próximo paso.`
    );
  };

  return (
    <div className="qa-page">

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div className="qa-page-header">

        <div>

          <div className="qa-eyebrow">
            <span className="status-dot" />
            TEST MANAGEMENT
          </div>

          <h1>
            Test Management
          </h1>

          <p>
            Administrá suites, ejecuciones y resultados
            de las pruebas de QA desde un único lugar.
          </p>

        </div>

        <div className="ai-status">
          <span className="status-dot" />
          QA Ready
        </div>

      </div>

      {/* ================================================== */}
      {/* SUMMARY */}
      {/* ================================================== */}

      <section className="tm-summary-grid">

        <div className="tm-summary-card">

          <div className="tm-summary-icon">
            🧪
          </div>

          <div>

            <span>
              Total Tests
            </span>

            <strong>
              {totalTests}
            </strong>

            <small>
              Casos administrados
            </small>

          </div>

        </div>

        <div className="tm-summary-card">

          <div className="tm-summary-icon success">
            ✓
          </div>

          <div>

            <span>
              Passed
            </span>

            <strong>
              {totalPassed}
            </strong>

            <small>
              {passPercentage}% del total
            </small>

          </div>

        </div>

        <div className="tm-summary-card">

          <div className="tm-summary-icon danger">
            🐞
          </div>

          <div>

            <span>
              Failed
            </span>

            <strong>
              {totalFailed}
            </strong>

            <small>
              Requieren análisis
            </small>

          </div>

        </div>

        <div className="tm-summary-card">

          <div className="tm-summary-icon warning">
            ◷
          </div>

          <div>

            <span>
              Execution
            </span>

            <strong>
              {executionPercentage}%
            </strong>

            <small>
              Cobertura ejecutada
            </small>

          </div>

        </div>

      </section>

      {/* ================================================== */}
      {/* EXECUTION OVERVIEW */}
      {/* ================================================== */}

      <section className="tm-overview-card">

        <div className="tm-overview-header">

          <div>

            <div className="qa-eyebrow">
              EXECUTION OVERVIEW
            </div>

            <h2>
              Estado general de ejecución
            </h2>

          </div>

          <div className="tm-overview-percentage">
            {executionPercentage}%
          </div>

        </div>

        <div className="tm-progress">

          <div
            className="tm-progress-passed"
            style={{
              width: `${
                totalTests > 0
                  ? (totalPassed /
                      totalTests) *
                    100
                  : 0
              }%`,
            }}
          />

          <div
            className="tm-progress-failed"
            style={{
              width: `${
                totalTests > 0
                  ? (totalFailed /
                      totalTests) *
                    100
                  : 0
              }%`,
            }}
          />

          <div
            className="tm-progress-blocked"
            style={{
              width: `${
                totalTests > 0
                  ? (totalBlocked /
                      totalTests) *
                    100
                  : 0
              }%`,
            }}
          />

        </div>

        <div className="tm-progress-legend">

          <span>
            <i className="legend-dot passed" />
            Passed {totalPassed}
          </span>

          <span>
            <i className="legend-dot failed" />
            Failed {totalFailed}
          </span>

          <span>
            <i className="legend-dot blocked" />
            Blocked {totalBlocked}
          </span>

          <span>
            <i className="legend-dot not-run" />
            Not Run {totalNotRun}
          </span>

        </div>

      </section>

      {/* ================================================== */}
      {/* TABS */}
      {/* ================================================== */}

      <section className="tm-content-card">

        <div className="tm-tabs-header">

          <div>

            <h2>
              Test Management
            </h2>

            <p>
              Administrá suites y ejecuciones.
            </p>

          </div>

          <div className="tm-tabs">

            <button
              type="button"
              className={
                activeTab === "suites"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveTab("suites")
              }
            >
              Test Suites
            </button>

            <button
              type="button"
              className={
                activeTab === "executions"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveTab("executions")
              }
            >
              Executions
            </button>

          </div>

        </div>

        {/* ================================================== */}
        {/* SUITES */}
        {/* ================================================== */}

        {activeTab === "suites" && (

          <div className="tm-table-wrapper">

            <table className="tm-table">

              <thead>

                <tr>
                  <th>Suite</th>
                  <th>Tests</th>
                  <th>Results</th>
                  <th>Progress</th>
                  <th>Last Run</th>
                  <th>Status</th>
                  <th />
                </tr>

              </thead>

              <tbody>

                {suites.map((suite) => {

                  const executed =
                    suite.passed +
                    suite.failed +
                    suite.blocked;

                  const progress =
                    suite.tests > 0
                      ? Math.round(
                          (executed /
                            suite.tests) *
                            100
                        )
                      : 0;

                  return (
                    <tr key={suite.id}>

                      <td>

                        <div className="tm-suite-name">

                          <strong>
                            {suite.name}
                          </strong>

                          <span>
                            {suite.description}
                          </span>

                        </div>

                      </td>

                      <td>
                        <strong>
                          {suite.tests}
                        </strong>
                      </td>

                      <td>

                        <div className="tm-results">

                          <span className="passed">
                            ✓ {suite.passed}
                          </span>

                          <span className="failed">
                            ✕ {suite.failed}
                          </span>

                          <span className="blocked">
                            ■ {suite.blocked}
                          </span>

                        </div>

                      </td>

                      <td>

                        <div className="tm-row-progress">

                          <div className="tm-row-progress-bar">

                            <span
                              style={{
                                width: `${progress}%`,
                              }}
                            />

                          </div>

                          <small>
                            {progress}%
                          </small>

                        </div>

                      </td>

                      <td>
                        {suite.lastRun}
                      </td>

                      <td>

                        <span
                          className={getStatusClass(
                            suite.status
                          )}
                        >
                          {suite.status}
                        </span>

                      </td>

                      <td>

                        <button
                          type="button"
                          className="tm-run-button"
                          onClick={() =>
                            handleRunSuite(
                              suite.name
                            )
                          }
                        >
                          ▶ Ejecutar
                        </button>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

        )}

        {/* ================================================== */}
        {/* EXECUTIONS */}
        {/* ================================================== */}

        {activeTab === "executions" && (

          <div className="tm-table-wrapper">

            <table className="tm-table">

              <thead>

                <tr>
                  <th>Execution</th>
                  <th>Suite</th>
                  <th>Tester</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Results</th>
                  <th>Status</th>
                </tr>

              </thead>

              <tbody>

                {executions.map(
                  (execution) => (
                    <tr
                      key={execution.id}
                    >

                      <td>
                        <span className="tm-execution-id">
                          {execution.id}
                        </span>
                      </td>

                      <td>
                        <strong>
                          {execution.suite}
                        </strong>
                      </td>

                      <td>
                        {execution.tester}
                      </td>

                      <td>
                        {execution.date}
                      </td>

                      <td>
                        {execution.total}
                      </td>

                      <td>

                        <div className="tm-results">

                          <span className="passed">
                            ✓ {execution.passed}
                          </span>

                          <span className="failed">
                            ✕ {execution.failed}
                          </span>

                          <span className="blocked">
                            ■ {execution.blocked}
                          </span>

                        </div>

                      </td>

                      <td>

                        <span
                          className={getStatusClass(
                            execution.status
                          )}
                        >
                          {execution.status}
                        </span>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>

      {/* ================================================== */}
      {/* NEXT STEP */}
      {/* ================================================== */}

      <section className="tm-ai-card">

        <div className="tm-ai-icon">
          ✦
        </div>

        <div>

          <span className="tm-ai-badge">
            NEXT STEP
          </span>

          <h2>
            Conectá tus ejecuciones con QA Copilot AI
          </h2>

          <p>
            El próximo paso será conectar las suites
            con los Test Cases generados por IA y
            permitir ejecutar cada caso directamente
            desde Test Management.
          </p>

        </div>

        <button
          type="button"
          className="tm-ai-button"
          onClick={() =>
            alert(
              "Integración con Test Runner próximamente."
            )
          }
        >
          ✦ Integrar Runner
        </button>

      </section>

    </div>
  );
}