const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkTables() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    try {
        const [rows] = await connection.query("SHOW TABLES LIKE 'directus_%'");
        console.log('Directus tables:', rows.map(row => Object.values(row)[0]));
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await connection.end();
    }
}

checkTables();
