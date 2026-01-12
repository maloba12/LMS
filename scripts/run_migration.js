const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });

async function runMigration(migrationFile) {
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

    // Read the SQL file - accept file path from command line or use default
    const sqlPath = migrationFile ? path.resolve(migrationFile) : path.join(__dirname, '../sql/marketplace_migration.sql');
    console.log(`Reading migration file from: ${sqlPath}`);

    if (!fs.existsSync(sqlPath)) {
      throw new Error(`Migration file not found: ${sqlPath}`);
    }

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

// Get migration file from command line argument
const migrationFile = process.argv[2];
runMigration(migrationFile);
