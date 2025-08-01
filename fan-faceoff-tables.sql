
-- Fan Faceoff Database Tables
-- Run these in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS user_pulls (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  pulls_used INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(email, date)
);

CREATE TABLE IF NOT EXISTS user_picks (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  sport VARCHAR(10) NOT NULL,
  challenge VARCHAR(100) NOT NULL,
  selected_player VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Optional: Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_pulls_email_date ON user_pulls(email, date);
CREATE INDEX IF NOT EXISTS idx_user_picks_created_at ON user_picks(created_at DESC);
