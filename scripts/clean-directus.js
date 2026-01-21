const mysql = require('mysql2/promise');
require('dotenv').config();

async function cleanDirectus() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    try {
        const [rows] = await connection.query("SHOW TABLES LIKE 'directus_%'");
        const tables = rows.map(row => Object.values(row)[0]);
        console.log('Dropping tables:', tables);
        
        if (tables.length > 0) {
            await connection.query('SET FOREIGN_KEY_CHECKS = 0');
            for (const table of tables) {
                await connection.query(`DROP TABLE \`${table}\``);
            }
            await connection.query('SET FOREIGN_KEY_CHECKS = 1');
            console.log('Successfully dropped all directus_ tables.');
        } else {
            console.log('No directus_ tables found.');
        }
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await connection.end();
    }
}

cleanDirectus();
