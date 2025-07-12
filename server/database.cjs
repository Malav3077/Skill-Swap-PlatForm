const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'skillswap.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
db.serialize(() => {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT,
      google_id TEXT UNIQUE,
      name TEXT NOT NULL,
      photo TEXT,
      location TEXT,
      bio TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Skills table
  db.run(`
    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      skill_type TEXT NOT NULL CHECK(skill_type IN ('offered', 'wanted')),
      level TEXT CHECK(level IN ('beginner', 'intermediate', 'advanced')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // Availability table
  db.run(`
    CREATE TABLE IF NOT EXISTS availability (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      day_of_week INTEGER NOT NULL CHECK(day_of_week BETWEEN 0 AND 6),
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // Swap requests table
  db.run(`
    CREATE TABLE IF NOT EXISTS swap_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      requester_id INTEGER NOT NULL,
      provider_id INTEGER NOT NULL,
      offered_skill_id INTEGER NOT NULL,
      wanted_skill_id INTEGER NOT NULL,
      message TEXT,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'accepted', 'rejected', 'completed', 'cancelled')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (requester_id) REFERENCES users (id),
      FOREIGN KEY (provider_id) REFERENCES users (id),
      FOREIGN KEY (offered_skill_id) REFERENCES skills (id),
      FOREIGN KEY (wanted_skill_id) REFERENCES skills (id)
    )
  `);

  // Reviews table
  db.run(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      swap_request_id INTEGER NOT NULL,
      reviewer_id INTEGER NOT NULL,
      reviewee_id INTEGER NOT NULL,
      rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
      feedback TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (swap_request_id) REFERENCES swap_requests (id),
      FOREIGN KEY (reviewer_id) REFERENCES users (id),
      FOREIGN KEY (reviewee_id) REFERENCES users (id)
    )
  `);

  console.log('Database tables initialized successfully');
});

module.exports = db;