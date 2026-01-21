const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config({ path: '.env.local' });

async function seedMarketplace() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    try {
        console.log('Connected to DB. Seeding marketplace data...');

        // 1. Get or Create User for Vendors
        const [users] = await connection.query('SELECT id FROM users WHERE email = ?', ['vendor@test.com']);
        let userId;

        if (users.length === 0) {
            const hash = await bcrypt.hash('password', 10);
            const [res] = await connection.query(
                `INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, 'vendor_admin')`,
                ['Test Vendor', 'vendor@test.com', hash]
            );
            userId = res.insertId;
        } else {
            userId = users[0].id;
        }

        // 2. Insert Vendors
        const vendors = [
            { name: 'Zambia National Commercial Bank', status: 'approved', category: 'commercial_bank' },
            { name: 'Lusaka Microfinance', status: 'approved', category: 'microfinance' },
            { name: 'Copperbelt Credit Union', status: 'approved', category: 'sacco' },
            { name: 'Digital Pay Go', status: 'pending', category: 'digital_lender' }, // Pending for notification test
            { name: 'AgriLoans Ltd', status: 'pending', category: 'microfinance' }
        ];

        for (const v of vendors) {
            // Check if exists
            const [existing] = await connection.query('SELECT id FROM vendors WHERE name = ?', [v.name]);
            if (existing.length === 0) {
                await connection.query(
                    `INSERT INTO vendors (user_id, name, description, category, status, pacra_number, boz_license_number, address, contact_email)
                     VALUES (?, ?, 'A leading financial institution.', ?, ?, 'PACRA123', 'BOZ123', 'Lusaka, Zambia', 'info@test.com')`,
                    [userId, v.name, v.category, v.status]
                );
                console.log(`Inserted vendor: ${v.name}`);
            }
        }

        // 3. Insert Products
        const [approvedVendors] = await connection.query("SELECT id, name FROM vendors WHERE status = 'approved'");
        
        for (const vendor of approvedVendors) {
            const product = {
                name: `${vendor.name} Personal Loan`,
                description: 'Quick personal loan for your needs.',
                type: 'personal_loan',
                rate: 15.5
            };

            const [existingProd] = await connection.query('SELECT id FROM loan_products WHERE name = ?', [product.name]);
            if (existingProd.length === 0) {
                await connection.query(
                    `INSERT INTO loan_products (vendor_id, name, description, loan_type, min_amount, max_amount, min_tenure_months, max_tenure_months, interest_rate, interest_type, is_active)
                     VALUES (?, ?, ?, ?, 1000, 50000, 3, 24, ?, 'reducing_balance', TRUE)`,
                    [vendor.id, product.name, product.description, product.type, product.rate]
                );
                console.log(`Inserted product: ${product.name}`);
            }
        }

        console.log('Seeding completed.');

    } catch (err) {
        console.error('Seeding failed:', err);
    } finally {
        await connection.end();
    }
}

seedMarketplace();
