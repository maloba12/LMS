const pool = require('./lib/db').default;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function debugLogin() {
    const email = 'admin@lms.com';
    const password = 'admin'; // Based on init-db.js

    try {
        console.log('Querying user...');
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            console.log('User not found');
            return;
        }

        const user = rows[0];
        console.log('Comparing password...');
        // Note: bcryptjs 3.x might have different exports, butSync/Async should be fine
        const isMatch = await bcrypt.compare(password, user.password_hash);
        console.log('Password match:', isMatch);

        if (isMatch) {
            console.log('Signing JWT...');
            const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1d' });
            console.log('JWT created:', token.substring(0, 10) + '...');
        }
    } catch (error) {
        console.error('DEBUG ERROR:', error);
    } finally {
        pool.end();
    }
}

debugLogin();
