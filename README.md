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
