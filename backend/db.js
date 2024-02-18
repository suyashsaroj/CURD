const sqlite3 = require("sqlite3").verbose();

// Create a new SQLite database in memory
const db = new sqlite3.Database(":memory:");

// Create a table
db.serialize(() => {
  db.run(
    "CREATE TABLE users (id TEXT PRIMARY KEY, username TEXT NOT NULL, age INTEGER NOT NULL, hobbies TEXT)"
  );
  // You can add more initialization queries if needed
});

module.exports = db;
