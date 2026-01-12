-- Subscription system migration for Loan Management System

-- Create subscription plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price_monthly DECIMAL(10, 2) NOT NULL,
    price_yearly DECIMAL(10, 2) NOT NULL,
    features JSON, -- Store features as JSON array
    max_products INT DEFAULT 10, -- Maximum loan products allowed
    max_users INT DEFAULT 5, -- Maximum users per vendor
    priority_support BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create company subscriptions table
CREATE TABLE IF NOT EXISTS company_subscriptions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    vendor_id INT NOT NULL,
    plan_id INT NOT NULL,
    subscription_type ENUM('monthly', 'yearly') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('active', 'expired', 'cancelled', 'pending_payment') DEFAULT 'active',
    payment_reference VARCHAR(255),
    amount_paid DECIMAL(10, 2),
    auto_renew BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_subscription_vendor FOREIGN KEY (vendor_id) REFERENCES vendors(id),
    CONSTRAINT fk_subscription_plan FOREIGN KEY (plan_id) REFERENCES subscription_plans(id)
);

-- Add subscription fields to vendors table if not exists
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS subscription_id INT;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS subscription_status ENUM('active', 'expired', 'none') DEFAULT 'none';
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS subscription_end_date DATE;

-- Add foreign key for subscription
ALTER TABLE vendors ADD CONSTRAINT fk_vendor_subscription FOREIGN KEY (subscription_id) REFERENCES company_subscriptions(id);

-- Insert default subscription plans
INSERT INTO subscription_plans (name, description, price_monthly, price_yearly, features, max_products, max_users, priority_support) VALUES
('Basic', 'Perfect for small microfinance institutions', 150.00, 1500.00, '["Basic loan product listings", "Customer reviews", "Basic analytics", "Email support"]', 5, 3, FALSE),
('Professional', 'Ideal for growing financial institutions', 350.00, 3500.00, '["Unlimited loan products", "Advanced analytics", "Priority customer support", "Custom branding", "API access"]', 50, 10, TRUE),
('Enterprise', 'For large banks and cooperatives', 750.00, 7500.00, '["Everything in Professional", "Dedicated account manager", "Custom integrations", "White-label options", "Advanced reporting"]', 999, 50, TRUE);

-- Update existing vendors to have 'none' subscription status
UPDATE vendors SET subscription_status = 'none' WHERE subscription_status IS NULL;
