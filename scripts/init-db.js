const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config({ path: '.env.local' });

async function initDb() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  console.log('Connected to MySQL server...');

  try {
    // Create database
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
    console.log(`Database '${process.env.DB_NAME}' created or already exists.`);

    await connection.changeUser({ database: process.env.DB_NAME });

    // Users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('customer', 'admin') DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);
    console.log('Users table checked/created.');

    // Loan Applications table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS loan_applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        loan_amount DECIMAL(10,2) NOT NULL,
        loan_purpose TEXT NOT NULL,
        repayment_period_months INT NULL,
        declared_employment_status VARCHAR(50) NULL,
        declared_monthly_income DECIMAL(10,2) NULL,
        terms_accepted TINYINT(1) NULL,
        affordability_ratio DECIMAL(5,2) NULL,
        max_affordable_amount DECIMAL(10,2) NULL,
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        reviewed_at TIMESTAMP NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    console.log('Loan applications table checked/created.');

    // Documents table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        loan_id INT NULL,
        file_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(255) NOT NULL,
        file_type VARCHAR(50) NOT NULL,
        doc_type VARCHAR(30) NOT NULL DEFAULT 'cv',
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (loan_id) REFERENCES loan_applications(id) ON DELETE SET NULL
      );
    `);

    // Customer Profiles table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS customer_profiles (
        user_id INT PRIMARY KEY,
        phone_number VARCHAR(30) NULL,
        national_id VARCHAR(50) NULL,
        residential_address TEXT NULL,
        employment_status VARCHAR(50) NULL,
        monthly_income DECIMAL(10,2) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    // Admin Actions table (Audit log)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS admin_actions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        admin_id INT NOT NULL,
        loan_id INT NOT NULL,
        action ENUM('approved', 'rejected') NOT NULL,
        comment TEXT,
        action_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (loan_id) REFERENCES loan_applications(id) ON DELETE CASCADE
      );
    `);
    console.log('Admin actions table checked/created.');

    // Add indexes for performance and safety
    try {
      await connection.query(`CREATE INDEX idx_documents_user_type ON documents (user_id, doc_type);`);
    } catch (e) {} // ignore if already exists

    try {
      await connection.query(`CREATE INDEX idx_loan_user_status ON loan_applications (user_id, status);`);
    } catch (e) {} // ignore if already exists

    // Contact Messages table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Contact messages table checked/created.');

    // Create default admin if not exists
    const adminEmail = 'admin@lms.com';
    const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', [adminEmail]);
    if (rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await connection.query(`
        INSERT INTO users (full_name, email, password_hash, role)
        VALUES (?, ?, ?, 'admin')
      `, ['System Admin', adminEmail, hashedPassword]);
      console.log('Default admin account created: admin@lms.com / admin123');
    }

  } catch (error) {
    console.error('Database initialization failed:', error);
  } finally {
    await connection.end();
  }
}

initDb();
