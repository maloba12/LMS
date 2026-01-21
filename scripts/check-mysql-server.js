const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkServer() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    try {
        const [version] = await connection.query("SELECT VERSION()");
        console.log('MySQL Version:', version[0]['VERSION()']);
        
        const [collation] = await connection.query("SELECT @@collation_database");
        console.log('Database Collation:', collation[0]['@@collation_database']);
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await connection.end();
    }
}

checkServer();
