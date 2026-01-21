const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkData() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    try {
        const [users] = await connection.query("SELECT COUNT(*) as count FROM directus_users");
        console.log('Users count:', users[0].count);
        
        const [collections] = await connection.query("SELECT collection FROM directus_collections");
        console.log('Collections:', collections);
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await connection.end();
    }
}

checkData();
