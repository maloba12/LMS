const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixCollation() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    try {
        console.log('Changing database default collation to utf8_unicode_ci...');
        await connection.query(`ALTER DATABASE \`${process.env.DB_NAME}\` CHARACTER SET utf8 COLLATE utf8_unicode_ci`);
        console.log('Successfully updated database collation.');
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await connection.end();
    }
}

fixCollation();
