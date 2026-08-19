import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db.js";
import storyRoutes from "./routes/stories.js";
import testRoutes from "./routes/tests.js";
import bugRoutes from "./routes/bugs.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/stories", storyRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/bugs", bugRoutes);

app.get("/", (req, res) => res.send("QA Copilot IA API funcionando 🚀"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
