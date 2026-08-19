import express from "express";
const router = express.Router();

router.post("/", (req, res) => {
  const { historia } = req.body;
  res.json({
    mensaje: "Historia recibida",
    historia,
    ambigüedades: ["Campo 'usuario' no definido", "Falta criterio de aceptación"],
  });
});

export default router;
