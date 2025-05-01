const express = require("express");
const path = require("path");
const cors = require("cors");
const db = require("./db");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/projects", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT DISTINCT name_project FROM project");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/api/dates", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT DISTINCT DATE_FORMAT(date_project, '%Y-%m-%d') AS date_project FROM work_table"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching dates:", error);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/api/chiefs", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT DISTINCT chief FROM department");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching chiefs:", error);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/api/information-for-date", async (req, res) => {
  try {
    const { nameProject, date_project } = req.query;

    const [rows] = await db.execute(
      `SELECT w.FID_Worker, w.date_project, w.time_start, w.time_end, w.description
       FROM work_table w
       JOIN project p ON w.FID_Projects = p.ID_Projects
       WHERE p.name_project = ? AND w.date_project = ?`,
      [nameProject, date_project]
    );

    res.json(rows);
  } catch (error) {
    console.error("Error fetching information for date:", error);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/api/time-for-project", async (req, res) => {
  try {
    const { nameProject } = req.query;

    const [rows] = await db.execute(
      `SELECT p.name_project, SUM(DATEDIFF(w.time_end, w.time_start) + 1) AS total_days, p.manager
       FROM work_table w
       JOIN project p ON w.FID_Projects = p.ID_Projects
       WHERE p.name_project = ?
       GROUP BY p.name_project, p.manager`,
      [nameProject]
    );

    res.json(rows);
  } catch (error) {
    console.error("Error fetching time for project:", error);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/api/count-workers", async (req, res) => {
  try {
    const { chief } = req.query;

    const [rows] = await db.execute(
      `SELECT d.chief, COUNT(w.ID_WORKER) as worker_count
       FROM department d
       LEFT JOIN worker w ON d.ID_DEPARTMENT = w.FID_DEPARTMENT 
       WHERE d.chief = ?
       GROUP BY d.chief`,
      [chief]
    );

    res.json(rows);
  } catch (error) {
    console.error("Error counting workers:", error);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
