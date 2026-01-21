const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkFields() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    try {
        console.log('Checking directus_fields structure:');
        const [desc] = await connection.query("DESCRIBE directus_fields");
        console.table(desc);
        
        console.log('Checking foreign keys for directus_fields:');
        const [fks] = await connection.query(`
            SELECT CONSTRAINT_NAME 
            FROM information_schema.KEY_COLUMN_USAGE 
            WHERE TABLE_NAME = 'directus_fields' 
            AND TABLE_SCHEMA = ?
        `, [process.env.DB_NAME]);
        console.log('Foreign keys:', fks.map(fk => fk.CONSTRAINT_NAME));
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await connection.end();
    }
}

checkFields();
