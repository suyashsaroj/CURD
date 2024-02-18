const express = require("express");
const router = express.Router();
const db = require("./db"); // Import the database connection

// Sample route to insert a user
router.post("/users", (req, res) => {
  const { username, age, hobbies } = req.body;

  if (!username || !age) {
    return res.status(400).json({ error: "Username and age are required" });
  }

  const id = uuidv4(); // Generate a new UUID for the user

  db.run(
    "INSERT INTO users (id, username, age, hobbies) VALUES (?, ?, ?, ?)",
    [id, username, age, JSON.stringify(hobbies)],
    (err) => {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.status(201).json({ id, message: "User inserted!" });
    }
  );
});

// Sample route to retrieve all users
router.get("/users", (req, res) => {
  db.all("SELECT * FROM users", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(rows);
  });
});

router.get("/users/:userId", (req, res) => {
  const { userId } = req.params;

  db.get("SELECT * FROM users WHERE id = ?", [userId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (row) {
      res.json(row);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });
});

// Sample route to update a specific user by ID
router.put("/users/:userId", (req, res) => {
  const { userId } = req.params;
  const { username, age, hobbies } = req.body;

  if (!username || !age) {
    return res.status(400).json({ error: "Username and age are required" });
  }

  db.run(
    "UPDATE users SET username = ?, age = ?, hobbies = ? WHERE id = ?",
    [username, age, JSON.stringify(hobbies), userId],
    (err) => {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json({ id: userId, message: "User updated!" });
    }
  );
});

// Sample route to delete a specific user by ID
router.delete("/users/:userId", (req, res) => {
  const { userId } = req.params;

  db.run("DELETE FROM users WHERE id = ?", [userId], (err) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json({ id: userId, message: "User deleted!" });
  });
});

const { v4: uuidv4 } = require("uuid");

module.exports = router;
