import { useState } from "react";
import axios from "axios";

function App() {
  const [historia, setHistoria] = useState("");
  const [resultados, setResultados] = useState(null);

  const analizarHistoria = async () => {
    const res = await axios.post("http://localhost:5000/api/stories", { historia });
    setResultados(res.data);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>QA Copilot IA 🧠</h1>
      <textarea
        rows="5"
        cols="50"
        placeholder="Ingresa una historia de usuario..."
        value={historia}
        onChange={(e) => setHistoria(e.target.value)}
      />
      <br />
      <button onClick={analizarHistoria}>Analizar</button>
      {resultados && (
        <div style={{ marginTop: "1rem" }}>
          <h3>Ambigüedades detectadas:</h3>
          <ul>
            {resultados.ambigüedades.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
