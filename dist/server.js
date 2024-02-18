"use strict";

var express = require("express");
var bodyParser = require("body-parser");
var dotenv = require("dotenv");
var routes = require("./routes"); // Import routes

dotenv.config();
var app = express();
var port = process.env.PORT;
app.use(bodyParser.json());
app.get("/", function (req, res) {
  res.send("Hello, this is the health check route!");
});
// Use routes from routes.js
app.use("/api", routes);

// Middleware for invalid route requests (should come after the routes)
app.use(function (req, res, next) {
  res.status(404).json({
    error: "Not Found"
  });
});

// Error-handling middleware
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal Server Error"
  });
});

// Start the server
app.listen(port, function () {
  console.log("Server is running at http://localhost:".concat(port));
});