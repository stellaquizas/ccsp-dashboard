const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const dotenv = require("dotenv");
const mockData = require("./mockData");

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const useMockData = process.env.USE_MOCK_DATA === "true";

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection pool - only create if not using mock data
let pool;
if (!useMockData) {
  pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
  });

  // Test database connection
  pool.query("SELECT NOW()", (err, res) => {
    if (err) {
      console.error("Database connection error:", err.stack);
    } else {
      console.log("Database connected successfully:", res.rows[0]);
    }
  });
} else {
  console.log("Running in MOCK mode - no database connection required");
}

// API Routes

// Get application metrics
app.get("/api/applications/metrics", async (req, res) => {
  if (useMockData) {
    console.log("Returning mock application metrics data");
    return res.json(mockData.applications.metrics);
  }

  try {
    const totalCount = await pool.query("SELECT COUNT(*) FROM applications");

    const typeBreakdown = await pool.query(
      "SELECT type, COUNT(*) FROM applications GROUP BY type"
    );

    const statusBreakdown = await pool.query(
      "SELECT status, COUNT(*) FROM applications GROUP BY status"
    );

    const avgProcessingTime = await pool.query(
      "SELECT type, AVG(completion_date - submission_date) as avg_time FROM applications WHERE completion_date IS NOT NULL GROUP BY type"
    );

    const pendingApplications = await pool.query(
      `SELECT 
        COUNT(*) FILTER (WHERE NOW() - submission_date > INTERVAL '7 days') as over_7_days,
        COUNT(*) FILTER (WHERE NOW() - submission_date > INTERVAL '14 days') as over_14_days
       FROM applications 
       WHERE status IN ('Submitted', 'In Progress')`
    );

    res.json({
      totalCount: totalCount.rows[0].count,
      typeBreakdown: typeBreakdown.rows,
      statusBreakdown: statusBreakdown.rows,
      avgProcessingTime: avgProcessingTime.rows,
      pendingApplications: pendingApplications.rows[0],
    });
  } catch (error) {
    console.error("Error fetching application metrics:", error);
    res.status(500).json({ error: "Failed to fetch application metrics" });
  }
});

// Get application trends
app.get("/api/applications/trends", async (req, res) => {
  if (useMockData) {
    console.log("Returning mock application trends data");
    return res.json(mockData.applications.trends);
  }

  try {
    // Get date range from query params or default to last 30 days
    const { startDate, endDate } = req.query;
    const dateFilter =
      startDate && endDate
        ? `WHERE submission_date BETWEEN '${startDate}' AND '${endDate}'`
        : `WHERE submission_date > NOW() - INTERVAL '30 days'`;

    const trends = await pool.query(
      `SELECT 
        DATE(submission_date) as date, 
        COUNT(*) as count 
       FROM applications 
       ${dateFilter}
       GROUP BY DATE(submission_date)
       ORDER BY date`
    );

    res.json(trends.rows);
  } catch (error) {
    console.error("Error fetching application trends:", error);
    res.status(500).json({ error: "Failed to fetch application trends" });
  }
});

// Get forms
app.get("/api/applications/forms", async (req, res) => {
  if (useMockData) {
    console.log("Returning mock forms data");
    return res.json(mockData.applications.forms);
  }

  try {
    // Get all forms related to cemetery and crematorium services
    const forms = await pool.query(
      `SELECT 
        form_id,
        name,
        url,
        pdf_url,
        submission_count,
        online_count,
        paper_count
       FROM forms
       WHERE category = '墳場及火葬場服務'
       ORDER BY form_id`
    );

    res.json(forms.rows);
  } catch (error) {
    console.error("Error fetching forms:", error);
    res.status(500).json({ error: "Failed to fetch forms data" });
  }
});

// Get user activity metrics
app.get("/api/users/metrics", async (req, res) => {
  if (useMockData) {
    console.log("Returning mock user metrics data");
    return res.json(mockData.users.metrics);
  }

  try {
    // Daily Active Users (past 30 days)
    const dau = await pool.query(
      `SELECT 
        DATE(last_active) as date, 
        COUNT(DISTINCT id) as count 
       FROM users 
       WHERE last_active > NOW() - INTERVAL '30 days' 
       GROUP BY DATE(last_active)
       ORDER BY date`
    );

    // Monthly Active Users (since launch)
    const mau = await pool.query(
      `SELECT 
        TO_CHAR(last_active, 'YYYY-MM') as month, 
        COUNT(DISTINCT id) as count 
       FROM users 
       GROUP BY TO_CHAR(last_active, 'YYYY-MM')
       ORDER BY month`
    );

    // Total registered users
    const totalUsers = await pool.query("SELECT COUNT(*) FROM users");

    res.json({
      dau: dau.rows,
      mau: mau.rows,
      totalUsers: totalUsers.rows[0].count,
    });
  } catch (error) {
    console.error("Error fetching user metrics:", error);
    res.status(500).json({ error: "Failed to fetch user metrics" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  if (useMockData) {
    console.log("Using MOCK data mode - dashboard will display sample data");
  } else {
    console.log("Using real database connection");
  }
});
