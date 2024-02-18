"use strict";

var express = require("express");
var router = express.Router();
var db = require("./db"); // Import the database connection

// Sample route to insert a user
router.post("/users", function (req, res) {
  var _req$body = req.body,
    username = _req$body.username,
    age = _req$body.age,
    hobbies = _req$body.hobbies;
  if (!username || !age) {
    return res.status(400).json({
      error: "Username and age are required"
    });
  }
  var id = uuidv4(); // Generate a new UUID for the user

  db.run("INSERT INTO users (id, username, age, hobbies) VALUES (?, ?, ?, ?)", [id, username, age, JSON.stringify(hobbies)], function (err) {
    if (err) {
      return res.status(500).json({
        error: "Internal Server Error"
      });
    }
    res.status(201).json({
      id: id,
      message: "User inserted!"
    });
  });
});

// Sample route to retrieve all users
router.get("/users", function (req, res) {
  db.all("SELECT * FROM users", function (err, rows) {
    if (err) {
      return res.status(500).json({
        error: "Internal Server Error"
      });
    }
    res.json(rows);
  });
});
var _require = require("uuid"),
  uuidv4 = _require.v4;
module.exports = router;