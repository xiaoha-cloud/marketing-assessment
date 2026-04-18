-- SQLite schema for task1-fullstack (campaigns, events, submissions).
-- Optional linkedin_leads table for raw CSV imports outside the core flow.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS campaigns (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    email_subject TEXT NOT NULL,
    cta_text TEXT NOT NULL,
    status TEXT NOT NULL,
    platform TEXT NOT NULL,
    budget_usd REAL NOT NULL,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY,
    campaign_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    event_date TEXT NOT NULL,
    location TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    description TEXT NOT NULL,
    FOREIGN KEY (campaign_id) REFERENCES campaigns (id)
);

CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    campaign_id INTEGER NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT NOT NULL,
    submitted_at TEXT NOT NULL,
    FOREIGN KEY (campaign_id) REFERENCES campaigns (id)
);

-- Optional: raw LinkedIn export (not part of core campaign flow unless joined in app logic)
CREATE TABLE IF NOT EXISTS linkedin_leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    raw_name TEXT,
    headline TEXT,
    company_name TEXT,
    location TEXT,
    profile_url TEXT,
    email TEXT,
    connection_count TEXT,
    scraped_at TEXT,
    imported_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_linkedin_leads_scraped_at ON linkedin_leads (scraped_at);
