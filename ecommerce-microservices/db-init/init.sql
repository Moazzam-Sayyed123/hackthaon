
CREATE SCHEMA IF NOT EXISTS seller AUTHORIZATION appuser;
CREATE SCHEMA IF NOT EXISTS buyer  AUTHORIZATION appuser;

-- Seller Service Tables
CREATE TABLE IF NOT EXISTS seller.products (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Buyer Service Tables
CREATE TABLE IF NOT EXISTS buyer.auto_order_rules (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    product_title VARCHAR(255),
    price_min DECIMAL(12, 2) NOT NULL,
    price_max DECIMAL(12, 2) NOT NULL,
    qty INTEGER NOT NULL DEFAULT 1,
    cap DECIMAL(12, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS buyer.price_history (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    product_title VARCHAR(255),
    old_price DECIMAL(12, 2),
    new_price DECIMAL(12, 2) NOT NULL,
    last_update_date_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Service Tables
CREATE TABLE IF NOT EXISTS buyer.user_wallets (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL UNIQUE,
    user_email VARCHAR(255),
    wallet_balance DECIMAL(12, 2) NOT NULL DEFAULT 5000.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_products_title ON seller.products(title);
CREATE INDEX IF NOT EXISTS idx_auto_order_rules_product_id ON buyer.auto_order_rules(product_id);
CREATE INDEX IF NOT EXISTS idx_auto_order_rules_status ON buyer.auto_order_rules(status);
CREATE INDEX IF NOT EXISTS idx_price_history_product_id ON buyer.price_history(product_id);
CREATE INDEX IF NOT EXISTS idx_price_history_last_update ON buyer.price_history(last_update_date_time);
CREATE INDEX IF NOT EXISTS idx_user_wallets_user_id ON buyer.user_wallets(user_id);
