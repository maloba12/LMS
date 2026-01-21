const pool = require('./lib/db').default;

async function testLoginQuery() {
    try {
        console.log('Testing user query...');
        const [rows] = await pool.query('SELECT * FROM users LIMIT 1');
        console.log('User query successful:', rows[0]?.email);
        process.exit(0);
    } catch (error) {
        console.error('User query failed:', error);
        process.exit(1);
    }
}

testLoginQuery();
