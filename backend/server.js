const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const routes = require("./routes"); // Import routes

dotenv.config();
const app = express();
const port = process.env.PORT || 4000; // Set a default port if PORT is not defined in the environment

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello, this is the health check route!");
});

// Use routes from routes.js
app.use("/api", routes);

// Middleware for invalid route requests (should come after the routes)
app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start the server
const server = app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

module.exports = app;
