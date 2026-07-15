require("dotenv").config();
const express = require("express");
const cors = require("cors");
const recipeRoutes = require("./routes/recipeRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");

const app = express();

app.use(cors({
  origin: "https://bct-project-khaki.vercel.app",
}));
app.use(express.json());

app.use("/api", recipeRoutes);
app.use("/api", favoriteRoutes);

app.get("/", (req, res) => res.send("Meal Planner API running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));