import express from "express";
const router = express.Router();

router.post("/", (req, res) => {
  const { historia } = req.body;
  res.json({
    mensaje: "Casos de prueba generados",
    casos: [
      { tipo: "positivo", descripcion: "Validar ingreso correcto de datos" },
      { tipo: "negativo", descripcion: "Rechazar datos inválidos" },
      { tipo: "límite", descripcion: "Probar valores extremos" },
    ],
  });
});

export default router;
