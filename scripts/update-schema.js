const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

async function updateSchema() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  console.log('Connected to MySQL server...');

  try {
    // 1. loan_applications columns
    const loanColumnsToAdd = [
      { name: 'repayment_period_months', type: 'INT NULL' },
      { name: 'declared_employment_status', type: 'VARCHAR(50) NULL' },
      { name: 'declared_monthly_income', type: 'DECIMAL(10,2) NULL' },
      { name: 'terms_accepted', type: 'TINYINT(1) NULL' },
      { name: 'affordability_ratio', type: 'DECIMAL(5,2) NULL' },
      { name: 'max_affordable_amount', type: 'DECIMAL(10,2) NULL' }
    ];

    console.log('--- Checking loan_applications ---');
    for (const col of loanColumnsToAdd) {
      try {
        await connection.query(`
          ALTER TABLE loan_applications
          ADD COLUMN ${col.name} ${col.type};
        `);
        console.log(`Added column '${col.name}' to loan_applications.`);
      } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
          console.log(`Column '${col.name}' already exists in loan_applications.`);
        } else {
          console.error(`Failed to add column '${col.name}':`, error.message);
        }
      }
    }

    // 2. documents columns
    const docColumnsToAdd = [
      { name: 'doc_type', type: "VARCHAR(30) NOT NULL DEFAULT 'cv'" }
    ];

    console.log('--- Checking documents ---');
    for (const col of docColumnsToAdd) {
      try {
        await connection.query(`
          ALTER TABLE documents
          ADD COLUMN ${col.name} ${col.type};
        `);
        console.log(`Added column '${col.name}' to documents.`);
      } catch (error) {
         if (error.code === 'ER_DUP_FIELDNAME') {
          console.log(`Column '${col.name}' already exists in documents.`);
        } else {
          console.error(`Failed to add column '${col.name}':`, error.message);
        }
      }
    }

    console.log('Schema update completed.');

  } catch (error) {
    console.error('Schema update failed:', error);
  } finally {
    await connection.end();
  }
}

updateSchema();
