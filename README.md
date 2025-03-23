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
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Access the development server at http://localhost:5173

## Data Flow

1. **User Interaction**: User interacts with the Vue.js frontend
2. **API Requests**: Frontend sends API requests to the Express backend
3. **Database Queries**: Backend queries the PostgreSQL database
4. **Response Processing**: Backend processes database responses
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
