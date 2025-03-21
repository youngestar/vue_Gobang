const fs = require('fs')
const dbPath = './db/database.db'
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database(dbPath)

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS list (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT NOT NULL,
  over BOOLEAN NOT NULL,
  create_time DATETIME NOT NULL,
  resolves_time DATETIME NOT NULL
)`)
})

db.all("SELECT * FROM list", (err, rows) => {
  if (err) {
    throw err;
  }
  // console.log(rows)
})

module.exports = db;

