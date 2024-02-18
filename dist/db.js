"use strict";

var sqlite3 = require("sqlite3").verbose();

// Create a new SQLite database in memory
var db = new sqlite3.Database(":memory:");

// Create a table
db.serialize(function () {
  db.run("CREATE TABLE users (id TEXT PRIMARY KEY, username TEXT NOT NULL, age INTEGER NOT NULL, hobbies TEXT)");
  // You can add more initialization queries if needed
});
module.exports = db;