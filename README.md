# Loan Management System (LMS)

A comprehensive web-based loan management system built with Next.js, MySQL, and TypeScript. This system enables customers to apply for loans, upload required documents, and track their loan status, while administrators can review applications, manage users, and generate reports.

## Features

### Customer Features
- **User Authentication**: Secure login and session management
- **Profile Management**: Complete personal and financial profile
- **Document Upload**: Upload CV and National ID documents
- **Loan Application**: Apply for loans with eligibility pre-checks
- **Loan Status Tracking**: View application status and loan details
- **Dashboard**: Overview of profile completeness and loan status

### Admin Features
- **User Management**: View and manage customer accounts
- **Loan Review**: Approve or reject loan applications with comments
- **Document Management**: Review uploaded customer documents
- **System Reports**: Analytics and loan statistics
- **Dashboard**: Overview of system metrics and recent activity

### Business Logic
- **Loan Eligibility Rules**: 
  - Profile completeness verification
  - Required document validation
  - Employment status checks
  - Affordability calculations (50% of monthly income × repayment period)
- **Loan Limits**: Configurable minimum (K500) and maximum (K50,000) loan amounts
- **Status Management**: Pending → Approved/Rejected workflow
- **Transaction Safety**: Database transactions prevent race conditions

## Technology Stack

### Frontend
- **Next.js 15.5.9**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Modern icon library

### Backend
- **Next.js API Routes**: Server-side API endpoints
- **MySQL**: Relational database
- **mysql2**: MySQL driver with prepared statements
- **JWT**: JSON Web Tokens for authentication
- **bcrypt**: Password hashing

### Development Tools
- **Node.js**: JavaScript runtime
- **npm**: Package manager
- **TypeScript Compiler**: Type checking
- **ESLint**: Code linting

## Installation

### Prerequisites
- Node.js 18+ installed
- MySQL server running
- npm or yarn package manager

### Database Setup
1. Start your MySQL server
2. Create a new database:
   ```sql
   CREATE DATABASE loan_management_system;
   ```
3. Run the database initialization script:
   ```bash
   node scripts/init-db.js
   ```

### Environment Configuration
1. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```
2. Configure your database credentials in `.env.local`:
   ```env
   DB_HOST=127.0.0.1
   DB_USER=lms_user
   DB_PASSWORD=lms_password
   DB_NAME=loan_management_system
   JWT_SECRET=your-secret-key-here
   ```

### Project Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open http://localhost:3000 in your browser

## Default Credentials

### Admin Account
- **Email**: admin@lms.com
- **Password**: admin123

### Test Customer Account
- **Email**: mpundu@gmail.com
- **Password**: (set during registration or by admin)

## Project Structure

```text
LMS/
├─ app/                      # Next.js app router pages & layouts
│  ├─ auth/                  # Login & registration pages
│  ├─ dashboard/
│  │  ├─ admin/              # Admin dashboard pages
│  │  └─ customer/           # Customer dashboard pages
│  ├─ api/                   # API routes (Next.js serverless functions)
│  │  ├─ auth/               # Login, logout, register
│  │  ├─ loans/              # Loan apply, eligibility, my-loan
│  │  ├─ documents/          # Document listing & uploads
│  │  ├─ admin/              # Admin-facing APIs (loans, users)
│  │  └─ customer/           # Customer dashboard aggregate API
│  ├─ about/                 # About page
│  ├─ contact/               # Contact page
│  └─ help/                  # Help / information page
├─ components/               # Shared React components (sidebars, navbar, etc.)
├─ lib/                      # Database & auth utilities
├─ assets/                   # Images and static assets (ERD, screenshots, etc.)
├─ sql/                      # SQL schema and seed files
├─ scripts/                  # Helper scripts (e.g. init-db.js)
├─ uploads/                  # Uploaded CVs and IDs (git-ignored remotely)
├─ public/ (optional)        # Public static assets
├─ tailwind.config.ts        # Tailwind CSS configuration
├─ postcss.config.js         # PostCSS configuration
├─ tsconfig.json             # TypeScript configuration
├─ package.json              # npm scripts and dependencies
└─ README.md                 # Project documentation
```

## Key Pages & Routes

### Customer

- `/auth/login` – Login page for both customer and admin users.
- `/auth/register` – Customer registration.
- `/dashboard/customer` – Customer dashboard overview (profile, docs, loan summary).
- `/dashboard/customer/apply-loan` – Loan application form with eligibility checks.
- `/dashboard/customer/my-loan` – Detailed view of latest loan (status, amounts, dates).
- `/dashboard/customer/profile` – Customer profile and settings.
- `/dashboard/customer/upload-cv` – Upload CV document.
- `/dashboard/customer/upload-id` – Upload National ID document.

### Admin

- `/dashboard/admin` – Admin dashboard with stats and recent activity.
- `/dashboard/admin/loans` – Review, approve, or reject loan applications.
- `/dashboard/admin/users` – Manage customer users.
- `/dashboard/admin/documents` – View customer documents.
- `/dashboard/admin/reports` – System reports and loan statistics.

### Selected API Routes

- `POST /api/auth/login` – Authenticate user and create session cookie.
- `POST /api/auth/logout` – Destroy session and redirect to `/auth/login`.
- `POST /api/auth/register` – Register new customer.
- `POST /api/loans/apply` – Submit new loan application.
- `GET  /api/loans/eligibility` – Check if customer is eligible to apply.
- `GET  /api/loans/my-loan` – Get current customer loans.
- `GET  /api/admin/loans` – Admin list of loan applications.
- `PATCH /api/admin/loans/[id]` – Approve or reject a loan.
- `GET  /api/customer/dashboard` – Aggregated customer dashboard data.
- `GET  /api/documents` – List customer documents.
- `POST /api/documents/upload` – Upload CV.
- `POST /api/documents/upload-id` – Upload National ID.

## Running & Development

### Start the Dev Server

```bash
npm install
npm run dev
# App runs at http://localhost:3000
```

### Database Initialization

You can initialize the schema and seed data with:

```bash
node scripts/init-db.js
```

This script will:

- Create required tables (users, customer_profiles, documents, loan_applications, etc.)
- Insert a default admin account and optional sample data

Always inspect `scripts/init-db.js` before running it against any non-local database.

### Environment Variables

- Local values are stored in `.env.local` (not committed).
- Ensure the variables match the ones documented in the **Installation** section.

## Security & Production Notes

- Do **not** commit `.env.local`, uploaded ID/CV files, or any secrets.
- Use a strong `JWT_SECRET` and rotate it if compromised.
- Limit upload size and validate file types for CV and ID uploads.
- Serve the app over HTTPS in production.
- Harden MySQL:
  - Use a dedicated DB user with least-privilege access.
  - Avoid exposing MySQL directly to the public internet.
- Regularly audit admin accounts and user roles.

For production builds:

```bash
npm run build
npm start
```

## Contributing

1. Fork the repository.
2. Create a feature branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Commit your changes:

   ```bash
   git commit -m "Add some feature"
   ```

4. Push the branch and open a Pull Request.

Please ensure before opening a PR:

- TypeScript builds successfully (`npm run lint` / `npm run build` if configured).
- Pages load without runtime errors.
- No secrets or sensitive data are added to version control.

## License

This project is currently used for personal/learning purposes.

If you plan to open-source it, add an explicit `LICENSE` file (for example, MIT) and update this section accordingly.
