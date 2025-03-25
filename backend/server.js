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
    // Get total applications count from all application tables
    const totalCountQuery = `
      SELECT 
        (SELECT COUNT(*) FROM ccsp.ccabb_appl) +
        (SELECT COUNT(*) FROM ccsp.ccacb_appl) +
        (SELECT COUNT(*) FROM ccsp.ccbub_appl) +
        (SELECT COUNT(*) FROM ccsp.ccexb_appl) +
        (SELECT COUNT(*) FROM ccsp.ccnib_application) +
        (SELECT COUNT(*) FROM ccsp.ccnib_add_application) +
        (SELECT COUNT(*) FROM ccsp.ccnib_removals) +
        (SELECT COUNT(*) FROM ccsp.ccsab_appl) +
        (SELECT COUNT(*) FROM ccsp.ccscb_appl) +
        (SELECT COUNT(*) FROM ccsp.cctsb_appl) +
        (SELECT COUNT(*) FROM ccsp.ccurb_appl) as total_count
    `;
    const totalCount = await pool.query(totalCountQuery);

    // Get type breakdown
    const typeBreakdownQuery = `
      SELECT 'CCABB' as type, COUNT(*) as count FROM ccsp.ccabb_appl
      UNION ALL
      SELECT 'CCACB' as type, COUNT(*) as count FROM ccsp.ccacb_appl
      UNION ALL
      SELECT 'CCBUB' as type, COUNT(*) as count FROM ccsp.ccbub_appl
      UNION ALL
      SELECT 'CCEXB' as type, COUNT(*) as count FROM ccsp.ccexb_appl
      UNION ALL
      SELECT 'CCNIB' as type, COUNT(*) as count FROM ccsp.ccnib_application
      UNION ALL
      SELECT 'CCNIB_ADD' as type, COUNT(*) as count FROM ccsp.ccnib_add_application
      UNION ALL
      SELECT 'CCNIB_REM' as type, COUNT(*) as count FROM ccsp.ccnib_removals
      UNION ALL
      SELECT 'CCSAB' as type, COUNT(*) as count FROM ccsp.ccsab_appl
      UNION ALL
      SELECT 'CCSCB' as type, COUNT(*) as count FROM ccsp.ccscb_appl
      UNION ALL
      SELECT 'CCTSB' as type, COUNT(*) as count FROM ccsp.cctsb_appl
      UNION ALL
      SELECT 'CCURB' as type, COUNT(*) as count FROM ccsp.ccurb_appl
    `;
    const typeBreakdown = await pool.query(typeBreakdownQuery);

    // Get status breakdown
    const statusBreakdownQuery = `
      SELECT last_event_code as status, COUNT(*) as count FROM (
        SELECT last_event_code FROM ccsp.ccabb_appl
        UNION ALL
        SELECT last_event_code FROM ccsp.ccacb_appl
        UNION ALL
        SELECT last_event_code FROM ccsp.ccbub_appl
        UNION ALL
        SELECT last_event_code FROM ccsp.ccexb_appl
        UNION ALL
        SELECT last_event_code FROM ccsp.ccnib_application
        UNION ALL
        SELECT last_event_code FROM ccsp.ccnib_add_application
        UNION ALL
        SELECT last_event_code FROM ccsp.ccnib_removals
        UNION ALL
        SELECT last_event_code FROM ccsp.ccsab_appl
        UNION ALL
        SELECT last_event_code FROM ccsp.ccscb_appl
        UNION ALL
        SELECT last_event_code FROM ccsp.cctsb_appl
        UNION ALL
        SELECT last_event_code FROM ccsp.ccurb_appl
      ) as all_statuses
      GROUP BY last_event_code
      ORDER BY last_event_code
    `;
    const statusBreakdown = await pool.query(statusBreakdownQuery);

    // Get average processing time - for completed applications only
    // For simplicity, use a fixed calculation for now
    const avgProcessingTimeQuery = `
      SELECT 
        AVG(EXTRACT(DAY FROM (date_modified - application_date))) as avg_time
      FROM (
        SELECT application_date, date_modified FROM ccsp.ccabb_appl WHERE last_event_code = 'COM'
        UNION ALL
        SELECT application_date, date_modified FROM ccsp.ccacb_appl WHERE last_event_code = 'COM'
        UNION ALL
        SELECT application_date, date_modified FROM ccsp.ccbub_appl WHERE last_event_code = 'COM'
        UNION ALL
        SELECT application_date, date_modified FROM ccsp.ccexb_appl WHERE last_event_code = 'COM'
        UNION ALL
        SELECT application_date, date_modified FROM ccsp.ccnib_application WHERE last_event_code = 'COM'
        UNION ALL
        SELECT application_date, date_modified FROM ccsp.ccnib_add_application WHERE last_event_code = 'COM'
        UNION ALL
        SELECT application_date, date_modified FROM ccsp.ccnib_removals WHERE last_event_code = 'COM'
        UNION ALL
        SELECT application_date, date_modified FROM ccsp.ccsab_appl WHERE last_event_code = 'COM'
        UNION ALL
        SELECT application_date, date_modified FROM ccsp.ccscb_appl WHERE last_event_code = 'COM'
        UNION ALL
        SELECT application_date, date_modified FROM ccsp.cctsb_appl WHERE last_event_code = 'COM'
        UNION ALL
        SELECT application_date, date_modified FROM ccsp.ccurb_appl WHERE last_event_code = 'COM'
      ) as completed_apps
    `;
    const avgProcessingTime = await pool.query(avgProcessingTimeQuery);

    // Get pending applications counts
    const pendingApplicationsQuery = `
      SELECT 
        COUNT(*) FILTER (WHERE NOW() - application_date > INTERVAL '7 days') as over_7_days,
        COUNT(*) FILTER (WHERE NOW() - application_date > INTERVAL '14 days') as over_14_days
      FROM (
        SELECT application_date FROM ccsp.ccabb_appl WHERE last_event_code IN ('PEN', 'PRO')
        UNION ALL
        SELECT application_date FROM ccsp.ccacb_appl WHERE last_event_code IN ('PEN', 'PRO')
        UNION ALL
        SELECT application_date FROM ccsp.ccbub_appl WHERE last_event_code IN ('PEN', 'PRO')
        UNION ALL
        SELECT application_date FROM ccsp.ccexb_appl WHERE last_event_code IN ('PEN', 'PRO')
        UNION ALL
        SELECT application_date FROM ccsp.ccnib_application WHERE last_event_code IN ('PEN', 'PRO')
        UNION ALL
        SELECT application_date FROM ccsp.ccnib_add_application WHERE last_event_code IN ('PEN', 'PRO')
        UNION ALL
        SELECT application_date FROM ccsp.ccnib_removals WHERE last_event_code IN ('PEN', 'PRO')
        UNION ALL
        SELECT application_date FROM ccsp.ccsab_appl WHERE last_event_code IN ('PEN', 'PRO')
        UNION ALL
        SELECT application_date FROM ccsp.ccscb_appl WHERE last_event_code IN ('PEN', 'PRO')
        UNION ALL
        SELECT application_date FROM ccsp.cctsb_appl WHERE last_event_code IN ('PEN', 'PRO')
        UNION ALL
        SELECT application_date FROM ccsp.ccurb_appl WHERE last_event_code IN ('PEN', 'PRO')
      ) as pending_apps
    `;
    const pendingApplications = await pool.query(pendingApplicationsQuery);

    res.json({
      totalCount: totalCount.rows[0].total_count,
      typeBreakdown: typeBreakdown.rows,
      statusBreakdown: statusBreakdown.rows.map((row) => ({
        code: row.status,
        count: parseInt(row.count),
      })),
      avgProcessingTime: Math.round(avgProcessingTime.rows[0].avg_time || 0),
      maxProcessingTime: Math.round(
        avgProcessingTime.rows[0].avg_time * 2.5 || 0
      ), // Estimate max time
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
        ? `WHERE application_date BETWEEN '${startDate}' AND '${endDate}'`
        : `WHERE application_date > NOW() - INTERVAL '30 days'`;

    const trendsQuery = `
      SELECT 
        DATE(application_date) as date, 
        COUNT(*) as count,
        COUNT(*) FILTER (WHERE last_event_code = 'COM') as completed,
        COUNT(*) FILTER (WHERE last_event_code IN ('PEN', 'PRO')) as pending,
        COUNT(*) FILTER (WHERE last_event_code = 'DFT') as unprocessed
      FROM (
        SELECT application_date, last_event_code FROM ccsp.ccabb_appl ${dateFilter.replace(
          "WHERE",
          "AND"
        )}
        UNION ALL
        SELECT application_date, last_event_code FROM ccsp.ccacb_appl ${dateFilter.replace(
          "WHERE",
          "AND"
        )}
        UNION ALL
        SELECT application_date, last_event_code FROM ccsp.ccbub_appl ${dateFilter.replace(
          "WHERE",
          "AND"
        )}
        UNION ALL
        SELECT application_date, last_event_code FROM ccsp.ccexb_appl ${dateFilter.replace(
          "WHERE",
          "AND"
        )}
        UNION ALL
        SELECT application_date, last_event_code FROM ccsp.ccnib_application ${dateFilter.replace(
          "WHERE",
          "AND"
        )}
        UNION ALL
        SELECT application_date, last_event_code FROM ccsp.ccnib_add_application ${dateFilter.replace(
          "WHERE",
          "AND"
        )}
        UNION ALL
        SELECT application_date, last_event_code FROM ccsp.ccnib_removals ${dateFilter.replace(
          "WHERE",
          "AND"
        )}
        UNION ALL
        SELECT application_date, last_event_code FROM ccsp.ccsab_appl ${dateFilter.replace(
          "WHERE",
          "AND"
        )}
        UNION ALL
        SELECT application_date, last_event_code FROM ccsp.ccscb_appl ${dateFilter.replace(
          "WHERE",
          "AND"
        )}
        UNION ALL
        SELECT application_date, last_event_code FROM ccsp.cctsb_appl ${dateFilter.replace(
          "WHERE",
          "AND"
        )}
        UNION ALL
        SELECT application_date, last_event_code FROM ccsp.ccurb_appl ${dateFilter.replace(
          "WHERE",
          "AND"
        )}
      ) as all_applications
      GROUP BY DATE(application_date)
      ORDER BY date
    `;

    const trends = await pool.query(trendsQuery);

    res.json(
      trends.rows.map((row) => ({
        date: row.date,
        total: parseInt(row.count),
        completed: parseInt(row.completed),
        pending: parseInt(row.pending),
        unprocessed: parseInt(row.unprocessed),
      }))
    );
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
    // Collect unique users from application tables
    const userCountQuery = `
      SELECT
        COUNT(DISTINCT user_id) FILTER (WHERE reg_type = 'IAM') as iamSmartUsers,
        COUNT(DISTINCT user_id) FILTER (WHERE reg_type = 'PHO') as phoneUsers,
        COUNT(DISTINCT user_id) FILTER (WHERE reg_type = 'UND') as undertakerUsers
      FROM (
        SELECT user_id, reg_type FROM ccsp.ccabb_appl
        UNION
        SELECT user_id, reg_type FROM ccsp.ccacb_appl
        UNION
        SELECT user_id, reg_type FROM ccsp.ccbub_appl
        UNION
        SELECT user_id, reg_type FROM ccsp.ccexb_appl
        UNION
        SELECT user_id, reg_type FROM ccsp.ccnib_application
        UNION
        SELECT user_id, reg_type FROM ccsp.ccnib_add_application
        UNION
        SELECT user_id, reg_type FROM ccsp.ccnib_removals
        UNION
        SELECT user_id, reg_type FROM ccsp.ccsab_appl
        UNION
        SELECT user_id, reg_type FROM ccsp.ccscb_appl
        UNION
        SELECT user_id, reg_type FROM ccsp.cctsb_appl
        UNION
        SELECT user_id, reg_type FROM ccsp.ccurb_appl
      ) as all_users
    `;

    const userCount = await pool.query(userCountQuery);

    // Monthly user counts (last 30 days)
    const monthlyUserCountQuery = `
      SELECT
        COUNT(DISTINCT user_id) FILTER (WHERE reg_type = 'IAM') as iamSmartUsers,
        COUNT(DISTINCT user_id) FILTER (WHERE reg_type = 'PHO') as phoneUsers,
        COUNT(DISTINCT user_id) FILTER (WHERE reg_type = 'UND') as undertakerUsers
      FROM (
        SELECT user_id, reg_type FROM ccsp.ccabb_appl WHERE application_date > NOW() - INTERVAL '30 days'
        UNION
        SELECT user_id, reg_type FROM ccsp.ccacb_appl WHERE application_date > NOW() - INTERVAL '30 days'
        UNION
        SELECT user_id, reg_type FROM ccsp.ccbub_appl WHERE application_date > NOW() - INTERVAL '30 days'
        UNION
        SELECT user_id, reg_type FROM ccsp.ccexb_appl WHERE application_date > NOW() - INTERVAL '30 days'
        UNION
        SELECT user_id, reg_type FROM ccsp.ccnib_application WHERE application_date > NOW() - INTERVAL '30 days'
        UNION
        SELECT user_id, reg_type FROM ccsp.ccnib_add_application WHERE application_date > NOW() - INTERVAL '30 days'
        UNION
        SELECT user_id, reg_type FROM ccsp.ccnib_removals WHERE application_date > NOW() - INTERVAL '30 days'
        UNION
        SELECT user_id, reg_type FROM ccsp.ccsab_appl WHERE application_date > NOW() - INTERVAL '30 days'
        UNION
        SELECT user_id, reg_type FROM ccsp.ccscb_appl WHERE application_date > NOW() - INTERVAL '30 days'
        UNION
        SELECT user_id, reg_type FROM ccsp.cctsb_appl WHERE application_date > NOW() - INTERVAL '30 days'
        UNION
        SELECT user_id, reg_type FROM ccsp.ccurb_appl WHERE application_date > NOW() - INTERVAL '30 days'
      ) as monthly_users
    `;

    const monthlyUserCount = await pool.query(monthlyUserCountQuery);

    // Daily active users (for the past 30 days)
    const dailyActiveUsersQuery = `
      SELECT
        DATE(application_date) as date,
        COUNT(DISTINCT user_id) as count
      FROM (
        SELECT user_id, application_date FROM ccsp.ccabb_appl WHERE application_date > NOW() - INTERVAL '30 days'
        UNION ALL
        SELECT user_id, application_date FROM ccsp.ccacb_appl WHERE application_date > NOW() - INTERVAL '30 days'
        UNION ALL
        SELECT user_id, application_date FROM ccsp.ccbub_appl WHERE application_date > NOW() - INTERVAL '30 days'
        UNION ALL
        SELECT user_id, application_date FROM ccsp.ccexb_appl WHERE application_date > NOW() - INTERVAL '30 days'
        UNION ALL
        SELECT user_id, application_date FROM ccsp.ccnib_application WHERE application_date > NOW() - INTERVAL '30 days'
        UNION ALL
        SELECT user_id, application_date FROM ccsp.ccnib_add_application WHERE application_date > NOW() - INTERVAL '30 days'
        UNION ALL
        SELECT user_id, application_date FROM ccsp.ccnib_removals WHERE application_date > NOW() - INTERVAL '30 days'
        UNION ALL
        SELECT user_id, application_date FROM ccsp.ccsab_appl WHERE application_date > NOW() - INTERVAL '30 days'
        UNION ALL
        SELECT user_id, application_date FROM ccsp.ccscb_appl WHERE application_date > NOW() - INTERVAL '30 days'
        UNION ALL
        SELECT user_id, application_date FROM ccsp.cctsb_appl WHERE application_date > NOW() - INTERVAL '30 days'
        UNION ALL
        SELECT user_id, application_date FROM ccsp.ccurb_appl WHERE application_date > NOW() - INTERVAL '30 days'
      ) as active_users
      GROUP BY DATE(application_date)
      ORDER BY date
    `;

    const dailyActiveUsers = await pool.query(dailyActiveUsersQuery);

    // Monthly active users (by month since system launch)
    const monthlyActiveUsersQuery = `
      SELECT
        TO_CHAR(application_date, 'YYYY-MM') as month,
        COUNT(DISTINCT user_id) as count
      FROM (
        SELECT user_id, application_date FROM ccsp.ccabb_appl
        UNION ALL
        SELECT user_id, application_date FROM ccsp.ccacb_appl
        UNION ALL
        SELECT user_id, application_date FROM ccsp.ccbub_appl
        UNION ALL
        SELECT user_id, application_date FROM ccsp.ccexb_appl
        UNION ALL
        SELECT user_id, application_date FROM ccsp.ccnib_application
        UNION ALL
        SELECT user_id, application_date FROM ccsp.ccnib_add_application
        UNION ALL
        SELECT user_id, application_date FROM ccsp.ccnib_removals
        UNION ALL
        SELECT user_id, application_date FROM ccsp.ccsab_appl
        UNION ALL
        SELECT user_id, application_date FROM ccsp.ccscb_appl
        UNION ALL
        SELECT user_id, application_date FROM ccsp.cctsb_appl
        UNION ALL
        SELECT user_id, application_date FROM ccsp.ccurb_appl
      ) as all_time_users
      GROUP BY TO_CHAR(application_date, 'YYYY-MM')
      ORDER BY month
    `;

    const monthlyActiveUsers = await pool.query(monthlyActiveUsersQuery);

    // Registration trends over time - daily new registrations
    const registrationTrendsQuery = `
      SELECT
        TO_CHAR(date_created, 'YYYY-MM-DD') as date,
        COUNT(DISTINCT user_id) as count
      FROM (
        SELECT DISTINCT user_id, MIN(date_created) as date_created
        FROM (
          SELECT user_id, date_created FROM ccsp.ccabb_appl
          UNION ALL
          SELECT user_id, date_created FROM ccsp.ccacb_appl
          UNION ALL
          SELECT user_id, date_created FROM ccsp.ccbub_appl
          UNION ALL
          SELECT user_id, date_created FROM ccsp.ccexb_appl
          UNION ALL
          SELECT user_id, date_created FROM ccsp.ccnib_application
          UNION ALL
          SELECT user_id, date_created FROM ccsp.ccnib_add_application
          UNION ALL
          SELECT user_id, date_created FROM ccsp.ccnib_removals
          UNION ALL
          SELECT user_id, date_created FROM ccsp.ccsab_appl
          UNION ALL
          SELECT user_id, date_created FROM ccsp.ccscb_appl
          UNION ALL
          SELECT user_id, date_created FROM ccsp.cctsb_appl
          UNION ALL
          SELECT user_id, date_created FROM ccsp.ccurb_appl
        ) as user_created_dates
        GROUP BY user_id
      ) as first_user_appearance
      GROUP BY TO_CHAR(date_created, 'YYYY-MM-DD')
      ORDER BY date
    `;

    const registrationTrends = await pool.query(registrationTrendsQuery);

    // Activity breakdown by form type
    const activityByTypeQuery = `
      SELECT 
        CASE 
          WHEN origin_table LIKE '%ccabb%' THEN '流產胎安放服務'
          WHEN origin_table LIKE '%ccacb%' THEN '其他流產物處理服務'
          WHEN origin_table LIKE '%ccbub%' THEN '墳場埋葬服務'
          WHEN origin_table LIKE '%ccexb%' THEN '骨殖遷移服務'
          WHEN origin_table LIKE '%ccnib%' AND origin_table NOT LIKE '%add%' AND origin_table NOT LIKE '%rem%' THEN '骨灰龕位申請'
          WHEN origin_table LIKE '%ccnib_add%' THEN '加放骨灰申請'
          WHEN origin_table LIKE '%ccnib_rem%' THEN '取回骨灰申請'
          WHEN origin_table LIKE '%ccsab%' THEN '海上撒灰服務'
          WHEN origin_table LIKE '%ccscb%' THEN '火化服務'
          WHEN origin_table LIKE '%cctsb%' THEN '骨灰暫存服務'
          WHEN origin_table LIKE '%ccurb%' THEN '骨灰罐更換服務'
          ELSE '其他服務'
        END as type,
        COUNT(*) as count
      FROM (
        SELECT 'ccabb' as origin_table FROM ccsp.ccabb_appl
        UNION ALL
        SELECT 'ccacb' as origin_table FROM ccsp.ccacb_appl
        UNION ALL
        SELECT 'ccbub' as origin_table FROM ccsp.ccbub_appl
        UNION ALL
        SELECT 'ccexb' as origin_table FROM ccsp.ccexb_appl
        UNION ALL
        SELECT 'ccnib' as origin_table FROM ccsp.ccnib_application
        UNION ALL
        SELECT 'ccnib_add' as origin_table FROM ccsp.ccnib_add_application
        UNION ALL
        SELECT 'ccnib_rem' as origin_table FROM ccsp.ccnib_removals
        UNION ALL
        SELECT 'ccsab' as origin_table FROM ccsp.ccsab_appl
        UNION ALL
        SELECT 'ccscb' as origin_table FROM ccsp.ccscb_appl
        UNION ALL
        SELECT 'cctsb' as origin_table FROM ccsp.cctsb_appl
        UNION ALL
        SELECT 'ccurb' as origin_table FROM ccsp.ccurb_appl
      ) as application_types
      GROUP BY type
      ORDER BY count DESC
    `;

    const activityByType = await pool.query(activityByTypeQuery);

    // Daily active users by type
    const dailyUsersByTypeQuery = `
      SELECT
        reg_type,
        COUNT(DISTINCT user_id) as count
      FROM (
        SELECT user_id, reg_type FROM ccsp.ccabb_appl WHERE application_date > NOW() - INTERVAL '1 day'
        UNION
        SELECT user_id, reg_type FROM ccsp.ccacb_appl WHERE application_date > NOW() - INTERVAL '1 day'
        UNION
        SELECT user_id, reg_type FROM ccsp.ccbub_appl WHERE application_date > NOW() - INTERVAL '1 day'
        UNION
        SELECT user_id, reg_type FROM ccsp.ccexb_appl WHERE application_date > NOW() - INTERVAL '1 day'
        UNION
        SELECT user_id, reg_type FROM ccsp.ccnib_application WHERE application_date > NOW() - INTERVAL '1 day'
        UNION
        SELECT user_id, reg_type FROM ccsp.ccnib_add_application WHERE application_date > NOW() - INTERVAL '1 day'
        UNION
        SELECT user_id, reg_type FROM ccsp.ccnib_removals WHERE application_date > NOW() - INTERVAL '1 day'
        UNION
        SELECT user_id, reg_type FROM ccsp.ccsab_appl WHERE application_date > NOW() - INTERVAL '1 day'
        UNION
        SELECT user_id, reg_type FROM ccsp.ccscb_appl WHERE application_date > NOW() - INTERVAL '1 day'
        UNION
        SELECT user_id, reg_type FROM ccsp.cctsb_appl WHERE application_date > NOW() - INTERVAL '1 day'
        UNION
        SELECT user_id, reg_type FROM ccsp.ccurb_appl WHERE application_date > NOW() - INTERVAL '1 day'
      ) as daily_users
      GROUP BY reg_type
    `;

    const dailyUsersByType = await pool.query(dailyUsersByTypeQuery);

    // Map daily active users by type
    const dailyUsers = {
      dailyIamSmartUsers: 0,
      dailyPhoneUsers: 0,
      dailyUndertakerUsers: 0,
    };
    dailyUsersByType.rows.forEach((row) => {
      if (row.reg_type === "IAM")
        dailyUsers.dailyIamSmartUsers = parseInt(row.count);
      if (row.reg_type === "PHO")
        dailyUsers.dailyPhoneUsers = parseInt(row.count);
      if (row.reg_type === "UND")
        dailyUsers.dailyUndertakerUsers = parseInt(row.count);
    });

    res.json({
      iamSmartUsers: parseInt(userCount.rows[0].iamsmartusers || 0),
      phoneUsers: parseInt(userCount.rows[0].phoneusers || 0),
      undertakerUsers: parseInt(userCount.rows[0].undertakerusers || 0),
      monthlyIamSmartUsers: parseInt(
        monthlyUserCount.rows[0].iamsmartusers || 0
      ),
      monthlyPhoneUsers: parseInt(monthlyUserCount.rows[0].phoneusers || 0),
      monthlyUndertakerUsers: parseInt(
        monthlyUserCount.rows[0].undertakerusers || 0
      ),
      ...dailyUsers,
      dailyActiveUsers: dailyActiveUsers.rows.map((row) => ({
        date: row.date,
        count: parseInt(row.count),
      })),
      monthlyActiveUsers: monthlyActiveUsers.rows.map((row) => ({
        date: row.month + "-01", // Add a day to make it a valid date
        count: parseInt(row.count),
      })),
      registrationTrends: registrationTrends.rows.map((row) => ({
        date: row.date,
        count: parseInt(row.count),
      })),
      activityByType: activityByType.rows.map((row) => ({
        type: row.type,
        count: parseInt(row.count),
      })),
    });
  } catch (error) {
    console.error("Error fetching user metrics:", error);

    try {
      // Fallback to simpler queries if the complex ones fail
      const totalUsers = await pool.query(`
        SELECT COUNT(DISTINCT user_sid) as count
        FROM ccsp.ccsp_users
      `);

      res.json({
        totalUsers: parseInt(totalUsers.rows[0].count || 0),
      });
    } catch (innerError) {
      console.error("Error in fallback query:", innerError);
      res.status(500).json({ error: "Failed to fetch user metrics" });
    }
  }
});

// Get applications
app.get("/api/applications", async (req, res) => {
  if (useMockData) {
    console.log("Returning mock applications data");
    return res.json(mockData.applications.list);
  }

  try {
    const { type } = req.query;

    // Define type filter
    let typeFilter = "";
    if (type) {
      if (type === "CCABB") {
        typeFilter = "WHERE application_table = 'ccsp.ccabb_appl'";
      } else if (type === "CCACB") {
        typeFilter = "WHERE application_table = 'ccsp.ccacb_appl'";
      } else if (type === "CCBUB") {
        typeFilter = "WHERE application_table = 'ccsp.ccbub_appl'";
      } else if (type === "CCEXB") {
        typeFilter = "WHERE application_table = 'ccsp.ccexb_appl'";
      } else if (type === "CCNIB") {
        typeFilter = "WHERE application_table = 'ccsp.ccnib_application'";
      } else if (type === "CCNIB_ADD") {
        typeFilter = "WHERE application_table = 'ccsp.ccnib_add_application'";
      } else if (type === "CCNIB_REM") {
        typeFilter = "WHERE application_table = 'ccsp.ccnib_removals'";
      } else if (type === "CCSAB") {
        typeFilter = "WHERE application_table = 'ccsp.ccsab_appl'";
      } else if (type === "CCSCB") {
        typeFilter = "WHERE application_table = 'ccsp.ccscb_appl'";
      } else if (type === "CCTSB") {
        typeFilter = "WHERE application_table = 'ccsp.cctsb_appl'";
      } else if (type === "CCURB") {
        typeFilter = "WHERE application_table = 'ccsp.ccurb_appl'";
      }
    }

    // Get applications with unified schema
    const applicationsQuery = `
      SELECT 
        ccsp_application_sid as id,
        application_table as type_table,
        CASE 
          WHEN application_table = 'ccsp.ccabb_appl' THEN '流產胎安放服務'
          WHEN application_table = 'ccsp.ccacb_appl' THEN '其他流產物處理服務'
          WHEN application_table = 'ccsp.ccbub_appl' THEN '墳場埋葬服務'
          WHEN application_table = 'ccsp.ccexb_appl' THEN '骨殖遷移服務'
          WHEN application_table = 'ccsp.ccnib_application' THEN '骨灰龕位申請'
          WHEN application_table = 'ccsp.ccnib_add_application' THEN '加放骨灰申請'
          WHEN application_table = 'ccsp.ccnib_removals' THEN '取回骨灰申請'
          WHEN application_table = 'ccsp.ccsab_appl' THEN '海上撒灰服務'
          WHEN application_table = 'ccsp.ccscb_appl' THEN '火化服務'
          WHEN application_table = 'ccsp.cctsb_appl' THEN '骨灰暫存服務'
          WHEN application_table = 'ccsp.ccurb_appl' THEN '骨灰罐更換服務'
          ELSE '其他服務'
        END as type,
        last_event_code as status,
        CASE 
          WHEN last_event_code = 'DFT' THEN '未處理'
          WHEN last_event_code = 'PEN' THEN '處理中'
          WHEN last_event_code = 'PRO' THEN '處理中'
          WHEN last_event_code = 'COM' THEN '已完成'
          WHEN last_event_code = 'REJ' THEN '申請被拒'
          WHEN last_event_code = 'CAN' THEN '已取消申請'
          ELSE last_event_code
        END as status_text,
        application_date as submission_date,
        date_modified as modified_date,
        EXTRACT(DAY FROM (date_modified - application_date)) as processing_time
      FROM (
        SELECT ccsp_application_sid, 'ccsp.ccabb_appl' as application_table, last_event_code, application_date, date_modified FROM ccsp.ccabb_appl
        UNION ALL
        SELECT ccsp_application_sid, 'ccsp.ccacb_appl' as application_table, last_event_code, application_date, date_modified FROM ccsp.ccacb_appl
        UNION ALL
        SELECT ccsp_application_sid, 'ccsp.ccbub_appl' as application_table, last_event_code, application_date, date_modified FROM ccsp.ccbub_appl
        UNION ALL
        SELECT ccsp_application_sid, 'ccsp.ccexb_appl' as application_table, last_event_code, application_date, date_modified FROM ccsp.ccexb_appl
        UNION ALL
        SELECT ccsp_application_sid, 'ccsp.ccnib_application' as application_table, last_event_code, application_date, date_modified FROM ccsp.ccnib_application
        UNION ALL
        SELECT ccsp_application_sid, 'ccsp.ccnib_add_application' as application_table, last_event_code, application_date, date_modified FROM ccsp.ccnib_add_application
        UNION ALL
        SELECT ccsp_application_sid, 'ccsp.ccnib_removals' as application_table, last_event_code, application_date, date_modified FROM ccsp.ccnib_removals
        UNION ALL
        SELECT ccsp_application_sid, 'ccsp.ccsab_appl' as application_table, last_event_code, application_date, date_modified FROM ccsp.ccsab_appl
        UNION ALL
        SELECT ccsp_application_sid, 'ccsp.ccscb_appl' as application_table, last_event_code, application_date, date_modified FROM ccsp.ccscb_appl
        UNION ALL
        SELECT ccsp_application_sid, 'ccsp.cctsb_appl' as application_table, last_event_code, application_date, date_modified FROM ccsp.cctsb_appl
        UNION ALL
        SELECT ccsp_application_sid, 'ccsp.ccurb_appl' as application_table, last_event_code, application_date, date_modified FROM ccsp.ccurb_appl
      ) as all_applications
      ${typeFilter}
      ORDER BY application_date DESC
      LIMIT 100
    `;

    const applications = await pool.query(applicationsQuery);

    // Get status breakdown
    const statusBreakdownQuery = `
      SELECT 
        last_event_code as code,
        CASE 
          WHEN last_event_code = 'DFT' THEN '未處理'
          WHEN last_event_code = 'PEN' THEN '處理中'
          WHEN last_event_code = 'PRO' THEN '處理中'
          WHEN last_event_code = 'COM' THEN '已完成'
          WHEN last_event_code = 'REJ' THEN '申請被拒'
          WHEN last_event_code = 'CAN' THEN '已取消申請'
          ELSE last_event_code
        END as name,
        COUNT(*) as count
      FROM (
        SELECT last_event_code FROM ccsp.ccabb_appl ${
          typeFilter
            ? typeFilter.replace(
                "WHERE application_table",
                "WHERE 'ccsp.ccabb_appl'"
              )
            : ""
        }
        UNION ALL
        SELECT last_event_code FROM ccsp.ccacb_appl ${
          typeFilter
            ? typeFilter.replace(
                "WHERE application_table",
                "WHERE 'ccsp.ccacb_appl'"
              )
            : ""
        }
        UNION ALL
        SELECT last_event_code FROM ccsp.ccbub_appl ${
          typeFilter
            ? typeFilter.replace(
                "WHERE application_table",
                "WHERE 'ccsp.ccbub_appl'"
              )
            : ""
        }
        UNION ALL
        SELECT last_event_code FROM ccsp.ccexb_appl ${
          typeFilter
            ? typeFilter.replace(
                "WHERE application_table",
                "WHERE 'ccsp.ccexb_appl'"
              )
            : ""
        }
        UNION ALL
        SELECT last_event_code FROM ccsp.ccnib_application ${
          typeFilter
            ? typeFilter.replace(
                "WHERE application_table",
                "WHERE 'ccsp.ccnib_application'"
              )
            : ""
        }
        UNION ALL
        SELECT last_event_code FROM ccsp.ccnib_add_application ${
          typeFilter
            ? typeFilter.replace(
                "WHERE application_table",
                "WHERE 'ccsp.ccnib_add_application'"
              )
            : ""
        }
        UNION ALL
        SELECT last_event_code FROM ccsp.ccnib_removals ${
          typeFilter
            ? typeFilter.replace(
                "WHERE application_table",
                "WHERE 'ccsp.ccnib_removals'"
              )
            : ""
        }
        UNION ALL
        SELECT last_event_code FROM ccsp.ccsab_appl ${
          typeFilter
            ? typeFilter.replace(
                "WHERE application_table",
                "WHERE 'ccsp.ccsab_appl'"
              )
            : ""
        }
        UNION ALL
        SELECT last_event_code FROM ccsp.ccscb_appl ${
          typeFilter
            ? typeFilter.replace(
                "WHERE application_table",
                "WHERE 'ccsp.ccscb_appl'"
              )
            : ""
        }
        UNION ALL
        SELECT last_event_code FROM ccsp.cctsb_appl ${
          typeFilter
            ? typeFilter.replace(
                "WHERE application_table",
                "WHERE 'ccsp.cctsb_appl'"
              )
            : ""
        }
        UNION ALL
        SELECT last_event_code FROM ccsp.ccurb_appl ${
          typeFilter
            ? typeFilter.replace(
                "WHERE application_table",
                "WHERE 'ccsp.ccurb_appl'"
              )
            : ""
        }
      ) as all_statuses
      GROUP BY last_event_code
    `;

    const statusBreakdown = await pool.query(statusBreakdownQuery);

    // Calculate average and max processing time
    const processingTimeQuery = `
      SELECT 
        AVG(EXTRACT(DAY FROM (date_modified - application_date))) as avg_time,
        MAX(EXTRACT(DAY FROM (date_modified - application_date))) as max_time
      FROM (
        SELECT application_date, date_modified FROM ccsp.ccabb_appl WHERE last_event_code = 'COM' ${
          typeFilter
            ? typeFilter.replace(
                "WHERE application_table",
                "AND 'ccsp.ccabb_appl'"
              )
            : ""
        }
        UNION ALL
        SELECT application_date, date_modified FROM ccsp.ccacb_appl WHERE last_event_code = 'COM' ${
          typeFilter
            ? typeFilter.replace(
                "WHERE application_table",
                "AND 'ccsp.ccacb_appl'"
              )
            : ""
        }
        UNION ALL
        SELECT application_date, date_modified FROM ccsp.ccbub_appl WHERE last_event_code = 'COM' ${
          typeFilter
            ? typeFilter.replace(
                "WHERE application_table",
                "AND 'ccsp.ccbub_appl'"
              )
            : ""
        }
        UNION ALL
        SELECT application_date, date_modified FROM ccsp.ccexb_appl WHERE last_event_code = 'COM' ${
          typeFilter
            ? typeFilter.replace(
                "WHERE application_table",
                "AND 'ccsp.ccexb_appl'"
              )
            : ""
        }
        UNION ALL
        SELECT application_date, date_modified FROM ccsp.ccnib_application WHERE last_event_code = 'COM' ${
          typeFilter
            ? typeFilter.replace(
                "WHERE application_table",
                "AND 'ccsp.ccnib_application'"
              )
            : ""
        }
        UNION ALL
        SELECT application_date, date_modified FROM ccsp.ccnib_add_application WHERE last_event_code = 'COM' ${
          typeFilter
            ? typeFilter.replace(
                "WHERE application_table",
                "AND 'ccsp.ccnib_add_application'"
              )
            : ""
        }
        UNION ALL
        SELECT application_date, date_modified FROM ccsp.ccnib_removals WHERE last_event_code = 'COM' ${
          typeFilter
            ? typeFilter.replace(
                "WHERE application_table",
                "AND 'ccsp.ccnib_removals'"
              )
            : ""
        }
        UNION ALL
        SELECT application_date, date_modified FROM ccsp.ccsab_appl WHERE last_event_code = 'COM' ${
          typeFilter
            ? typeFilter.replace(
                "WHERE application_table",
                "AND 'ccsp.ccsab_appl'"
              )
            : ""
        }
        UNION ALL
        SELECT application_date, date_modified FROM ccsp.ccscb_appl WHERE last_event_code = 'COM' ${
          typeFilter
            ? typeFilter.replace(
                "WHERE application_table",
                "AND 'ccsp.ccscb_appl'"
              )
            : ""
        }
        UNION ALL
        SELECT application_date, date_modified FROM ccsp.cctsb_appl WHERE last_event_code = 'COM' ${
          typeFilter
            ? typeFilter.replace(
                "WHERE application_table",
                "AND 'ccsp.cctsb_appl'"
              )
            : ""
        }
        UNION ALL
        SELECT application_date, date_modified FROM ccsp.ccurb_appl WHERE last_event_code = 'COM' ${
          typeFilter
            ? typeFilter.replace(
                "WHERE application_table",
                "AND 'ccsp.ccurb_appl'"
              )
            : ""
        }
      ) as completed_apps
    `;

    const processingTime = await pool.query(processingTimeQuery);

    // Get application trends for the selected type or all
    const trendsQuery = `
      SELECT 
        DATE(application_date) as date, 
        COUNT(*) as count
      FROM (
        SELECT application_date FROM ccsp.ccabb_appl ${
          typeFilter
            ? typeFilter.replace(
                "WHERE application_table",
                "WHERE 'ccsp.ccabb_appl'"
              )
            : ""
        }
        UNION ALL
        SELECT application_date FROM ccsp.ccacb_appl ${
          typeFilter
            ? typeFilter.replace(
                "WHERE application_table",
                "WHERE 'ccsp.ccacb_appl'"
              )
            : ""
        }
        UNION ALL
        SELECT application_date FROM ccsp.ccbub_appl ${
          typeFilter
            ? typeFilter.replace(
                "WHERE application_table",
                "WHERE 'ccsp.ccbub_appl'"
              )
            : ""
        }
        UNION ALL
        SELECT application_date FROM ccsp.ccexb_appl ${
          typeFilter
            ? typeFilter.replace(
                "WHERE application_table",
                "WHERE 'ccsp.ccexb_appl'"
              )
            : ""
        }
        UNION ALL
        SELECT application_date FROM ccsp.ccnib_application ${
          typeFilter
            ? typeFilter.replace(
                "WHERE application_table",
                "WHERE 'ccsp.ccnib_application'"
              )
            : ""
        }
        UNION ALL
        SELECT application_date FROM ccsp.ccnib_add_application ${
          typeFilter
            ? typeFilter.replace(
                "WHERE application_table",
                "WHERE 'ccsp.ccnib_add_application'"
              )
            : ""
        }
        UNION ALL
        SELECT application_date FROM ccsp.ccnib_removals ${
          typeFilter
            ? typeFilter.replace(
                "WHERE application_table",
                "WHERE 'ccsp.ccnib_removals'"
              )
            : ""
        }
        UNION ALL
        SELECT application_date FROM ccsp.ccsab_appl ${
          typeFilter
            ? typeFilter.replace(
                "WHERE application_table",
                "WHERE 'ccsp.ccsab_appl'"
              )
            : ""
        }
        UNION ALL
        SELECT application_date FROM ccsp.ccscb_appl ${
          typeFilter
            ? typeFilter.replace(
                "WHERE application_table",
                "WHERE 'ccsp.ccscb_appl'"
              )
            : ""
        }
        UNION ALL
        SELECT application_date FROM ccsp.cctsb_appl ${
          typeFilter
            ? typeFilter.replace(
                "WHERE application_table",
                "WHERE 'ccsp.cctsb_appl'"
              )
            : ""
        }
        UNION ALL
        SELECT application_date FROM ccsp.ccurb_appl ${
          typeFilter
            ? typeFilter.replace(
                "WHERE application_table",
                "WHERE 'ccsp.ccurb_appl'"
              )
            : ""
        }
      ) as filtered_apps
      WHERE application_date > NOW() - INTERVAL '90 days'
      GROUP BY DATE(application_date)
      ORDER BY date
    `;

    const trends = await pool.query(trendsQuery);

    res.json({
      applications: applications.rows.map((app) => ({
        id: app.id,
        type: app.type,
        status: app.status,
        submissionDate: app.submission_date,
        processingTime: Math.round(app.processing_time || 0),
      })),
      statusBreakdown: statusBreakdown.rows.map((status) => ({
        name: status.name,
        count: parseInt(status.count),
      })),
      avgProcessingTime: Math.round(processingTime.rows[0].avg_time || 0),
      maxProcessingTime: Math.round(processingTime.rows[0].max_time || 0),
      trends: trends.rows.map((trend) => ({
        date: trend.date,
        count: parseInt(trend.count),
      })),
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

// Add this endpoint to get application types
app.get("/api/applications/types", async (req, res) => {
  if (useMockData) {
    console.log("Returning mock application types data");
    return res.json(mockData.applications.types);
  }

  try {
    // Return the list of application types
    const applicationTypes = [
      { code: "CCABB", name: "流產胎安放服務" },
      { code: "CCACB", name: "其他流產物處理服務" },
      { code: "CCBUB", name: "墳場埋葬服務" },
      { code: "CCEXB", name: "骨殖遷移服務" },
      { code: "CCNIB", name: "骨灰龕位申請" },
      { code: "CCNIB_ADD", name: "加放骨灰申請" },
      { code: "CCNIB_REM", name: "取回骨灰申請" },
      { code: "CCSAB", name: "海上撒灰服務" },
      { code: "CCSCB", name: "火化服務" },
      { code: "CCTSB", name: "骨灰暫存服務" },
      { code: "CCURB", name: "骨灰罐更換服務" },
    ];

    res.json(applicationTypes);
  } catch (error) {
    console.error("Error fetching application types:", error);
    res.status(500).json({ error: "Failed to fetch application types" });
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
