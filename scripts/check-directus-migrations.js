const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkMigrations() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    try {
        const [rows] = await connection.query("SELECT * FROM directus_migrations ORDER BY timestamp DESC");
        console.log('Directus migrations:', rows);
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await connection.end();
    }
}

checkMigrations();
