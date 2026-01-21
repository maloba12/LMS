const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

async function checkSchema() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('Connected to DB.');

    // Check if company_subscriptions table exists
    const [tables] = await connection.query("SHOW TABLES LIKE 'company_subscriptions'");
    if (tables.length === 0) {
        console.error("ERROR: Table 'company_subscriptions' does NOT exist!");
    } else {
        console.log("Table 'company_subscriptions' exists.");
        const [columns] = await connection.query("SHOW COLUMNS FROM company_subscriptions");
        console.log("Columns:", columns.map(c => c.Field).join(', '));
    }

    // Check if subscription_plans table exists
    const [tablesPlans] = await connection.query("SHOW TABLES LIKE 'subscription_plans'");
    if (tablesPlans.length === 0) {
        console.error("ERROR: Table 'subscription_plans' does NOT exist!");
    } else {
        console.log("Table 'subscription_plans' exists.");
        const [columns] = await connection.query("SHOW COLUMNS FROM subscription_plans");
        console.log("Subscription Plans Columns:", columns.map(c => c.Field).join(', '));
    }
    
    // Check if products table allows null vendor_id? No, schema says NOT NULL.
    // Check loan_applications table schema for vendor_id
    const [appColumns] = await connection.query("SHOW COLUMNS FROM loan_applications LIKE 'vendor_id'");
    console.log("LoanApplication vendor_id column:", appColumns);

    await connection.end();
  } catch (err) {
    console.error(err);
  }
}

checkSchema();
