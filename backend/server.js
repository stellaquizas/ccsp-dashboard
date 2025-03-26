const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const dotenv = require("dotenv");
const mockDataService = require("./mockData");

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
let pool;
// Create pool if any endpoint needs real data
const needsRealData = 
  process.env.MOCK_USER_REGISTRATION === "false" ||
  process.env.MOCK_USER_ACTIVE === "false" ||
  process.env.MOCK_USER_REGISTRATION_TREND === "false" ||
  process.env.MOCK_USER_ACTIVITY_TREND === "false" ||
  process.env.MOCK_APPLICATION_OVERVIEW === "false" ||
  process.env.MOCK_APPLICATION_TRENDS === "false" ||
  process.env.MOCK_FORM_CCABB === "false" ||
  process.env.MOCK_FORM_CCACB === "false" ||
  process.env.MOCK_FORM_CCBUB === "false" ||
  process.env.MOCK_FORM_CCEXB === "false" ||
  process.env.MOCK_FORM_CCNIB === "false" ||
  process.env.MOCK_FORM_CCNIB_ADD === "false" ||
  process.env.MOCK_FORM_CCNIB_REM === "false" ||
  process.env.MOCK_FORM_CCSAB === "false" ||
  process.env.MOCK_FORM_CCSCB === "false" ||
  process.env.MOCK_FORM_CCTSB === "false" ||
  process.env.MOCK_FORM_CCURB === "false";

if (needsRealData) {
  console.log("Using real database connection for some endpoints");
  pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
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
  console.log("Using mock data - database connection skipped");
}

// API Routes

// Get application metrics (for dashboard overview)
app.get("/api/applications/metrics", async (req, res) => {
  const { mockOverview, mockTrends } = req.query;

  if (mockOverview === "true" || process.env.MOCK_APPLICATION_OVERVIEW === "true") {
    console.log("Returning mock application metrics data");
    const mockAppData = mockDataService.generateMockApplications();
    const mockStats = mockDataService.generateMockData();
    return res.json({
      overview: {
        totalApplications: mockStats.applicationStats.totalApplications,
        pendingApplications: mockStats.applicationStats.pendingApplications,
        completedApplications: mockStats.applicationStats.completedApplications,
        unprocessedApplications: mockStats.applicationStats.unprocessedApplications
      },
      typeBreakdown: mockDataService.applicationTypes.map(type => ({
        type: type.code,
        name: type.name,
        count: Math.floor(Math.random() * 100) + 1
      })),
      statusBreakdown: Object.entries(mockDataService.statusMapping).map(([code, info]) => ({
        code,
        name: info.text,
        count: Math.floor(Math.random() * 50) + 1
      })),
      avgProcessingTime: mockAppData.avgProcessingTime,
      maxProcessingTime: mockAppData.maxProcessingTime,
      pendingOverview: {
        over_7_days: Math.floor(Math.random() * 50),
        over_14_days: Math.floor(Math.random() * 30)
      },
      trends: mockStats.applicationTrends.map(trend => ({
        date: trend.date,
        total: trend.total,
        completed: trend.completed,
        pending: trend.pending
      }))
    });
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
  const { mock } = req.query;

  if (mock === "true" || process.env.MOCK_APPLICATION_TRENDS === "true") {
    console.log("Returning mock application trends data");
    const mockStats = mockDataService.generateMockData();
    return res.json(mockStats.applicationTrends.map(trend => ({
      date: trend.date,
      total: trend.total,
      completed: trend.completed,
      pending: trend.pending
    })));
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

// User statistics endpoint
app.get("/api/user-stats", async (req, res) => {
  const {
    mockRegistration,
    mockActive,
    mockRegistrationTrend,
    mockActivityTrend
  } = req.query;

  try {
    // Get total users
    const totalUsers = mockRegistration === "true" ? 
      mockDataService.generateTotalUsers() : 
      await pool.query(`
        SELECT 
          COUNT(CASE WHEN login_type = 'iamsmart' THEN 1 END) as iamsmart_users,
          COUNT(CASE WHEN login_type = 'phone' THEN 1 END) as phone_users,
          COUNT(CASE WHEN login_type = 'undertaker' THEN 1 END) as undertaker_users,
          COUNT(*) as total_users
        FROM ccsp.users;
      `);

    // Get user stats by type
    const activeUsers = mockActive === "true" ? 
      mockDataService.generateActiveUsers() : 
      await pool.query(`
        SELECT 
          COUNT(DISTINCT CASE WHEN u.login_type = 'iamsmart' THEN l.user_id END) as monthly_iamsmart_users,
          COUNT(DISTINCT CASE WHEN u.login_type = 'phone' THEN l.user_id END) as monthly_phone_users,
          COUNT(DISTINCT CASE WHEN u.login_type = 'undertaker' THEN l.user_id END) as monthly_undertaker_users,
          COUNT(DISTINCT l.user_id) as total_active_users
        FROM ccsp.users u
        JOIN ccsp.user_logins l ON u.id = l.user_id
        WHERE l.login_time >= NOW() - INTERVAL '30 days';
      `);

    const registrationTrend = mockRegistrationTrend === "true" ? 
      mockDataService.generateRegistrationTrend() :
      await pool.query(`
        SELECT 
          COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as registration_trend,
          COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '1 day') as daily_registrations
        FROM ccsp.users;
      `);

    const activityTrend = mockActivityTrend === "true" ?
      mockDataService.generateActivityTrend() :
      await pool.query(`
        SELECT 
          COUNT(DISTINCT user_id) FILTER (WHERE login_time >= NOW() - INTERVAL '30 days') as activity_trend,
          COUNT(DISTINCT user_id) FILTER (WHERE login_time >= NOW() - INTERVAL '1 day') as daily_active_users
        FROM ccsp.user_logins;
      `);

    // Combine all stats into a single response
    res.json({
      ...totalUsers.rows[0],
      ...activeUsers.rows[0],
      ...registrationTrend.rows[0],
      ...activityTrend.rows[0]
    });
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    res.status(500).json({ error: "Failed to fetch user statistics" });
  }
});

// Get forms
app.get("/api/forms", async (req, res) => {
  const { mock } = req.query;

  if (mock === "true") {
    console.log("Returning mock forms data");
    return res.json(mockDataService.applicationTypes.map(type => ({
      id: type.code,
      name: type.name,
      description: `申請${type.name}`,
      status: "active"
    })));
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

// Get applications
app.get("/api/applications", async (req, res) => {
  const { type, mock } = req.query;

  if (mock === "true" || (type && process.env[`MOCK_FORM_${type}`] === "true")) {
    console.log("Returning mock applications data");
    const mockAppData = mockDataService.generateMockApplications(type);
    return res.json(mockAppData);
  }

  try {
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

// Get application types
app.get("/api/applications/types", async (req, res) => {
  const { mock } = req.query;

  if (mock === "true") {
    console.log("Returning mock application types data");
    return res.json(mockDataService.applicationTypes);
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
  if (needsRealData) {
    console.log("Using real database connection for some endpoints");
  } else {
    console.log("Using mock data - database connection skipped");
  }
});
