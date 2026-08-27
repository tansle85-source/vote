import Database from 'better-sqlite3';
import path from 'path';

// Create or open the database file
// Auto-detect Hostinger's deployment folder and save the DB safely outside of it
let dbPath = process.env.DB_PATH || path.join(process.cwd(), 'voting.db');
if (process.cwd().includes('hbuilds/source/repository')) {
  // Save in the domain root folder (3 levels up from repository)
  dbPath = path.join(process.cwd(), '../../..', 'voting.db');
}
const db = new Database(dbPath, { verbose: console.log });

// Initialize database schema
db.pragma('journal_mode = WAL');

const initDB = () => {
  // Create papers table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS papers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      description TEXT
    )
  `).run();

  // Create criteria table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS criteria (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      max_score INTEGER NOT NULL
    )
  `).run();

  // Create admins table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `).run();

  // Create judges table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS judges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      organization TEXT,
      email TEXT,
      password TEXT NOT NULL
    )
  `).run();

  // Create marks table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS marks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      paper_id INTEGER NOT NULL,
      judge_id INTEGER NOT NULL,
      criteria_id INTEGER NOT NULL,
      score INTEGER NOT NULL,
      FOREIGN KEY (paper_id) REFERENCES papers (id),
      FOREIGN KEY (judge_id) REFERENCES judges (id),
      FOREIGN KEY (criteria_id) REFERENCES criteria (id),
      UNIQUE(paper_id, judge_id, criteria_id)
    )
  `).run();

  // Create comments table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      paper_id INTEGER NOT NULL,
      judge_id INTEGER NOT NULL,
      comment TEXT,
      FOREIGN KEY (paper_id) REFERENCES papers (id),
      FOREIGN KEY (judge_id) REFERENCES judges (id),
      UNIQUE(paper_id, judge_id)
    )
  `).run();

  // Seed admin if none exist
  const adminCount = db.prepare('SELECT COUNT(*) as count FROM admins').get();
  if (adminCount.count === 0) {
    db.prepare('INSERT INTO admins (username, password) VALUES (?, ?)').run('admin', 'admin123');
  }

  // Seed default judges if none exist
  const judgeCount = db.prepare('SELECT COUNT(*) as count FROM judges').get();
  if (judgeCount.count === 0) {
    const insertJudge = db.prepare('INSERT INTO judges (name, organization, email, password) VALUES (?, ?, ?, ?)');
    ['Judge 1', 'Judge 2', 'Judge 3', 'Judge 4'].forEach((name) => {
      insertJudge.run(name, 'Default Org', 'judge@example.com', 'password123');
    });
  }

  // Seed default criteria if none exist
  const criteriaCount = db.prepare('SELECT COUNT(*) as count FROM criteria').get();
  if (criteriaCount.count === 0) {
    const insertCriteria = db.prepare('INSERT INTO criteria (name, max_score) VALUES (?, ?)');
    insertCriteria.run('Smart + Methodology', 30);
    insertCriteria.run('Innovativeness', 30);
    insertCriteria.run('Business Impact', 20);
    insertCriteria.run('Technical Writing Skill', 10);
    insertCriteria.run('Oral Presentation Skills', 10);
  }
};

initDB();

export default db;
