const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

async function checkVendors() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('Connected to DB.');

    const [allVendors] = await connection.query('SELECT id, name, status FROM vendors');
    console.log('--- All Vendors ---');
    console.table(allVendors);

    const [approvedVendors] = await connection.query("SELECT id, name FROM vendors WHERE status = 'approved'");
    console.log('--- Approved Vendors (Visible to Customers) ---');
    console.table(approvedVendors);

    await connection.end();
  } catch (err) {
    console.error(err);
  }
}

checkVendors();
