-- Mini SaaS Dashboard Demo - Database Schema
-- SQLite 3 Database Schema for build-time data generation
-- Date: November 24, 2025

-- Enable foreign keys
PRAGMA foreign_keys = ON;

-- Customer table
CREATE TABLE IF NOT EXISTS customers (
    customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL CHECK(length(trim(name)) > 0 AND length(name) <= 100),
    email TEXT NOT NULL UNIQUE CHECK(email LIKE '%@%.%'),
    company TEXT CHECK(company IS NULL OR (length(company) >= 1 AND length(company) <= 200)),
    created_at TEXT NOT NULL CHECK(created_at LIKE '____-__-__T__:__:__Z')
);

-- Subscription table
CREATE TABLE IF NOT EXISTS subscriptions (
    subscription_id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    plan_name TEXT NOT NULL CHECK(length(plan_name) >= 1 AND length(plan_name) <= 100),
    monthly_amount INTEGER NOT NULL CHECK(monthly_amount >= 0),
    status TEXT NOT NULL CHECK(status IN ('active', 'canceled')),
    start_date TEXT NOT NULL CHECK(start_date LIKE '____-__-__'),
    canceled_at TEXT CHECK(canceled_at IS NULL OR canceled_at LIKE '____-__-__T__:__:__Z'),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    CHECK(
        (status = 'active' AND canceled_at IS NULL) OR
        (status = 'canceled' AND canceled_at IS NOT NULL)
    )
);

-- Invoice table
CREATE TABLE IF NOT EXISTS invoices (
    invoice_id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    amount INTEGER NOT NULL CHECK(amount > 0),
    status TEXT NOT NULL CHECK(status IN ('paid', 'unpaid', 'overdue')),
    created_at TEXT NOT NULL CHECK(created_at LIKE '____-__-__T__:__:__Z'),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- Event table
CREATE TABLE IF NOT EXISTS events (
    event_id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL CHECK(length(event_type) >= 1 AND length(event_type) <= 50),
    message TEXT NOT NULL CHECK(length(message) >= 1 AND length(message) <= 500),
    created_at TEXT NOT NULL CHECK(created_at LIKE '____-__-__T__:__:__Z')
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON customers(created_at);

CREATE INDEX IF NOT EXISTS idx_subscriptions_customer_id ON subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status_customer ON subscriptions(status, customer_id);

CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at_desc ON invoices(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);

CREATE INDEX IF NOT EXISTS idx_events_created_at_desc ON events(created_at DESC);
