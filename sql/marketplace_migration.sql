-- Modify users table to support new roles
ALTER TABLE users MODIFY COLUMN role ENUM('customer', 'admin', 'vendor_admin', 'loan_officer') DEFAULT 'customer';

-- Create vendors table
CREATE TABLE IF NOT EXISTS vendors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL, -- Link to the vendor_admin user
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo_url VARCHAR(255),
    pacra_number VARCHAR(50),
    boz_license_number VARCHAR(50),
    address TEXT,
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20),
    website_url VARCHAR(255),
    category ENUM('commercial_bank', 'microfinance', 'digital_lender', 'sacco', 'cooperative') NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_vendor_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create loan_products table
CREATE TABLE IF NOT EXISTS loan_products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    vendor_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    loan_type ENUM('personal_loan', 'salary_advance', 'sme_loan', 'school_fees_loan', 'mortgage', 'asset_financing', 'other') NOT NULL,
    min_amount DECIMAL(15, 2) NOT NULL,
    max_amount DECIMAL(15, 2) NOT NULL,
    min_tenure_months INT NOT NULL,
    max_tenure_months INT NOT NULL,
    interest_rate DECIMAL(5, 2) NOT NULL,
    interest_type ENUM('flat', 'reducing_balance') NOT NULL,
    processing_fee_percent DECIMAL(5, 2) DEFAULT 0,
    min_income_requirement DECIMAL(15, 2),
    eligibility_criteria TEXT,
    currency VARCHAR(3) DEFAULT 'ZMW',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_product_vendor FOREIGN KEY (vendor_id) REFERENCES vendors(id)
);

-- Create vendor_reviews table
CREATE TABLE IF NOT EXISTS vendor_reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    vendor_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_verified BOOLEAN DEFAULT FALSE, -- True if user actually had a loan with this vendor
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_review_vendor FOREIGN KEY (vendor_id) REFERENCES vendors(id),
    CONSTRAINT fk_review_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Modify loan_applications table to link to vendors and products
-- We use ALTER here. If column exists it might fail depending on MySQL version strictness for duplicates, 
-- but IF NOT EXISTS is not standard for ADD COLUMN in older MySQL. 
-- Assuming modern MySQL or simple run:

-- Add columns if they don't exist (using a stored procedure approach is safer for idempotent scripts in raw SQL, 
-- but given limited toolset, we'll try direct ALTERs. If they fail because columns exist, we can ignore/handle).
ALTER TABLE loan_applications ADD COLUMN vendor_id INT;
ALTER TABLE loan_applications ADD COLUMN loan_product_id INT;

-- Add foreign keys
ALTER TABLE loan_applications ADD CONSTRAINT fk_app_vendor FOREIGN KEY (vendor_id) REFERENCES vendors(id);
ALTER TABLE loan_applications ADD CONSTRAINT fk_app_product FOREIGN KEY (loan_product_id) REFERENCES loan_products(id);
