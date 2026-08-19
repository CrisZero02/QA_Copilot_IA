import express from "express";
const router = express.Router();

router.post("/", (req, res) => {
  const { bug } = req.body;
  res.json({
    mensaje: "Análisis de bug completado",
    bug,
    causaProbable: "Validación de campo no implementada",
    sugerencia: "Agregar control de formato en backend",
  });
});

export default router;
