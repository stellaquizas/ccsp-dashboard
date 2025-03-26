# CCSP Dashboard

A comprehensive dashboard for monitoring and analyzing cloud-based applications.

## Features

- Real-time application metrics and analytics
- User activity tracking
- Customizable date ranges for data visualization
- Interactive charts and data visualization
- Dark mode support
- Responsive design for all devices

## Technology Stack

- **Frontend**: Vue.js 3, Tailwind CSS, Chart.js
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Containerization**: Docker & Docker Compose

## Project Architecture

The project follows a three-tier architecture:

### 1. Frontend (Vue.js)

The frontend is a Vue.js 3 single-page application with TypeScript support, located in the `/frontend/ccsp-vue-dashboard` directory. Key components:

- **Vue Components**: Reusable UI components in `/src/components/`
- **Chart Components**: Chart.js integration in `/src/components/charts/`
- **Dashboard Views**: Main dashboard views in `/src/views/`
- **API Services**: API connection services in `/src/services/`

### 2. Backend (Node.js/Express)

The backend is a Node.js API server using Express, located in the `/backend` directory. It includes:

- **API Endpoints**: Express routes for fetching application and user metrics
- **Database Connection**: PostgreSQL client integration
- **Environment Configuration**: Using dotenv for config management

### 3. Database (PostgreSQL)

PostgreSQL database for storing application and user data:

- **Schema**: Located in `/backend/db/init/01-schema.sql`
- **Tables**: `applications` and `users` tables
- **Sample Data**: Includes seed data for testing

### Containerization

The entire application is containerized using Docker:

- **Docker Compose**: Orchestrates all services in `docker-compose.yml`
- **Backend Container**: Node.js backend in `backend/Dockerfile`
- **Frontend Container**: Vue.js frontend with Nginx in `frontend/ccsp-vue-dashboard/Dockerfile`
- **Database Container**: PostgreSQL database from the official image

## File Structure

```
ccsp-dashboard/
├── .env.example              # Environment variables example
├── .gitignore                # Git ignore file
├── docker-compose.yml        # Docker Compose configuration
├── README.md                 # Project documentation
│
├── backend/                  # Backend application
│   ├── Dockerfile            # Backend Docker configuration
│   ├── package.json          # Node.js dependencies
│   ├── server.js             # Express API server
│   ├── .env.example          # Backend environment variables example
│   └── db/
│       └── init/             # Database initialization scripts
│           └── 01-schema.sql # Database schema and seed data
│
└── frontend/
    └── ccsp-vue-dashboard/   # Frontend Vue.js application
        ├── Dockerfile        # Frontend Docker configuration
        ├── nginx.conf        # Nginx configuration for production
        ├── package.json      # Frontend dependencies
        ├── tailwind.config.js # Tailwind CSS configuration
        ├── postcss.config.js # PostCSS configuration
        ├── .env.example      # Frontend environment variables example
        └── src/              # Source code
            ├── App.vue       # Main Vue component
            ├── main.ts       # Application entry point
            ├── assets/       # Static assets and CSS
            ├── components/   # Reusable Vue components
            │   ├── charts/   # Chart components
            │   └── dashboard/# Dashboard components
            ├── services/     # API services
            └── views/        # Page views
```

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development only)
- NPM or Yarn (for local development only)

## Setup and Installation

### Using Docker (Recommended)

1. Clone this repository:

   ```bash
   git clone https://github.com/yourusername/ccsp-dashboard.git
   cd ccsp-dashboard
   ```

2. Create a `.env` file in the root directory with the following variables:

   ```
   DB_USER=postgres
   DB_PASSWORD=your_secure_password
   DB_NAME=ccsp_dashboard
   DB_PORT=5432
   BACKEND_PORT=3000
   FRONTEND_PORT=80
   ```

3. Start the application using Docker Compose:

   ```bash
   docker-compose up -d
   ```

4. Access the dashboard at http://localhost

### Local Development

#### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:

   ```
   PORT=3000
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=ccsp_dashboard
   DB_PASSWORD=your_secure_password
   DB_PORT=5432
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

Note: The backend API endpoints support granular mock data control through the frontend environment variables. This allows for selective use of mock data for different features.

#### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend/ccsp-vue-dashboard
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file with:

   ```
   VITE_API_URL=http://localhost:3000
   # Dashboard View Mock Data Configuration
   VITE_MOCK_USER_REGISTRATION=true      # 用戶注冊總數
   VITE_MOCK_APPLICATION_OVERVIEW=true    # 申請統計
   VITE_MOCK_APPLICATION_TRENDS=true      # 申請趨勢

   # Forms View Mock Data Configuration
   VITE_MOCK_FORM_CCABB=true             # 流產胎安放服務
   VITE_MOCK_FORM_CCACB=true             # 流產胎火化服務
   VITE_MOCK_FORM_CCBUB=true             # 安葬於公眾墳場
   VITE_MOCK_FORM_CCEXB=true             # 遷移或撿拾骨殖許可證
   VITE_MOCK_FORM_CCNIB=true             # 骨灰龕位申請
   VITE_MOCK_FORM_CCNIB_ADD=true         # 加放骨灰申請
   VITE_MOCK_FORM_CCNIB_REM=true         # 取回骨灰申請
   VITE_MOCK_FORM_CCSAB=true             # 海上撒灰
   VITE_MOCK_FORM_CCSCB=true             # 火化服務
   VITE_MOCK_FORM_CCTSB=true             # 骨灰暫存服務
   VITE_MOCK_FORM_CCURB=true             # 骨灰罐更換服務

   # Users View Mock Data Configuration
   VITE_MOCK_USER_ACTIVE=true            # 活躍用戶
   VITE_MOCK_USER_REGISTRATION_TREND=true # 注冊趨勢
   VITE_MOCK_USER_ACTIVITY_TREND=true    # 用戶活躍度趨勢
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Access the development server at http://localhost:5173

## Mock Data

The application includes a flexible mock data system that supports granular control over which data sources use mock data:

### Mock Data Controls

The system uses granular mock data controls organized by view:

#### Dashboard View Controls

1. User Registration Data (`VITE_MOCK_USER_REGISTRATION`):

   - Controls total user counts in "用戶注冊總數" section

2. Application Overview (`VITE_MOCK_APPLICATION_OVERVIEW`):

   - Controls application counts in "申請統計" section

3. Application Trends (`VITE_MOCK_APPLICATION_TRENDS`):
   - Controls application trend charts

#### Forms View Controls

4. `VITE_MOCK_FORM_CCABB` - 流產胎安放服務
5. `VITE_MOCK_FORM_CCACB` - 流產胎火化服務
6. `VITE_MOCK_FORM_CCBUB` - 安葬於公眾墳場
7. `VITE_MOCK_FORM_CCEXB` - 遷移或撿拾骨殖許可證
8. `VITE_MOCK_FORM_CCNIB` - 骨灰龕位申請
9. `VITE_MOCK_FORM_CCNIB_ADD` - 加放骨灰申請
10. `VITE_MOCK_FORM_CCNIB_REM` - 取回骨灰申請
11. `VITE_MOCK_FORM_CCSAB` - 海上撒灰
12. `VITE_MOCK_FORM_CCSCB` - 火化服務
13. `VITE_MOCK_FORM_CCTSB` - 骨灰暫存服務
14. `VITE_MOCK_FORM_CCURB` - 骨灰罐更換服務

#### Users View Controls

15. Active Users (`VITE_MOCK_USER_ACTIVE`):

    - Controls active user metrics in "活躍用戶" section

16. Registration Trends (`VITE_MOCK_USER_REGISTRATION_TREND`):

    - Controls user registration trend data

17. Activity Trends (`VITE_MOCK_USER_ACTIVITY_TREND`):
    - Controls user activity trend data

Each feature's data source can be controlled independently by setting the corresponding environment variable to `true` (use mock data) or `false` (use real data). This granular control allows developers to mix real and mock data during development and testing phases.

## UI Components and Styling Conventions

### Mock Data Indicators

The dashboard uses a standardized system for indicating mock data:

- Small dot indicators in the top-right corner of each section
- Gray dots indicate mock data, green dots indicate real data
- Hover tooltips showing "模擬數據" (mock data) or "真實數據" (real data)

### Layout and Styling

Common styling patterns used across views:

- Section containers: `bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm p-6`
- Grid layouts: Consistent 3-column grid for user statistics
- Chart containers: Standard padding and spacing with grid backgrounds
- Icons:
  - iAM SMART users: UserCircleIcon with blue theme
  - Phone users: DevicePhoneMobileIcon with green theme
  - Undertaker users: UsersIcon with purple theme

### Chart Components

Charts follow consistent styling:

- Toggle buttons for chart types (bar/line)
- Y-axis labels showing percentage or count
- Grid lines for better data visualization
- Interactive tooltips showing exact values
- Smooth transitions between chart types

## Application Types

The system supports the following application types:

- `CCABB` - 流產胎安放服務 (Aborted Fetus Placement Service)
- `CCACB` - 流產胎火化服務 (Aborted Fetus Cremation Service)
- `CCBUB` - 安葬於公眾墳場 (Public Cemetery Burial)
- `CCEXB` - 遷移或撿拾骨殖許可證 (Exhumation Permit)
- `CCNIB` - 骨灰龕位申請 (Niche Application)
- `CCNIB_ADD` - 加放骨灰申請 (Additional Ashes Placement)
- `CCNIB_REM` - 取回骨灰申請 (Ashes Removal)
- `CCSAB` - 海上撒灰 (Sea Ash Scattering)
- `CCSCB` - 火化服務 (Cremation Service)
- `CCTSB` - 骨灰暫存服務 (Temporary Storage Service)
- `CCURB` - 骨灰罐更換服務 (Urn Replacement Service)

Each application type has its own workflow and status progression, managed through the system.

## Application Statuses

The system uses the following common status codes:

- `DFT` - 已遞交 (Submitted)
- `AP_DFT` - 處理中 (Processing)
- `APP` - 已獲批准 (Approved)
- `RJ_DFT` - 申請被拒 (Rejected)
- `CAP` - 已取消申請 (Cancelled)
- `CIN` - 已完成 (Completed)
- `BOK` - 已付款 (Paid)
- `CNR` - 取消付款 (Payment Cancelled)
- `COT` - 已移除 (Removed)

Note: Different application types may have different subsets of these statuses based on their specific workflows.

## Data Flow

1. **User Interaction**: User interacts with the Vue.js frontend
2. **API Requests**: Frontend sends API requests to the Express backend
3. **Data Source Selection**: Backend uses either mock data or database based on configuration
4. **Response Processing**: Backend processes data from selected source
5. **Data Visualization**: Frontend renders data using Chart.js components

## API Endpoints

- `GET /api/applications/metrics` - Get application metrics
- `GET /api/applications/trends` - Get application submission trends
- `GET /api/users/metrics` - Get user activity metrics

## Database Schema

The application uses PostgreSQL with the following tables:

- `applications` - Stores application data
- `users` - Stores user information

## License

[MIT](LICENSE)
