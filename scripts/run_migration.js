const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });

async function runMigration() {
  let connection;
  try {
    console.log('Connecting to database...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      multipleStatements: true, // Required for running multiple queries in one call
    });

    console.log('Connected.');
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, '../sql/marketplace_migration.sql');
    console.log(`Reading migration file from: ${sqlPath}`);
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Execute the SQL
    console.log('Executing migration...');
    await connection.query(sql);
    console.log('Migration completed successfully!');

  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Connection closed.');
    }
  }
}

runMigration();
