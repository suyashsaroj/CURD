const express = require("express");
const bodyParser = require("body-parser");
const cluster = require("cluster");
const routes = require("./backend/routes"); // Import routes

const workers = []; // Array to store worker instances and their ports
const numWorkers = require("os").cpus().length;

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  res.status(500).send({
    error: {
      message: err.message || "Internal server error",
      code: err.code || "SERVER_ERROR",
    },
  });
};

const app = express();

app.use(bodyParser.json());

// Global error handling
app.use(errorHandler);

// ... other route definitions from routes.js
app.use("/api", routes);

// ... middleware for invalid routes and errors

if (cluster.isMaster) {
  for (let i = 0; i < numWorkers; i++) {
    const worker = cluster.fork();
    const port = 3000 + i; // Start ports from 3000

    // Store worker and port information
    workers.push({ worker, port });

    worker.on("message", (msg) => {
      // Handle messages from workers (e.g., health checks)
      if (msg.type === "healthCheck") {
        console.log(
          `Worker ${worker.process.pid} is healthy on port ${msg.port}`
        );
      }
    });
  }

  // Round-robin load balancing implementation within master process
  let nextWorkerIndex = 0; // Counter for round-robin selection

  cluster.on("message", (worker, msg) => {
    if (msg.type === "request") {
      const { request, response } = msg;
      const worker = workers[nextWorkerIndex]; // Select next worker
      nextWorkerIndex = (nextWorkerIndex + 1) % workers.length; // Update counter

      worker.send({ type: "forwardRequest", request, response });
    }
  });

  cluster.on("exit", (worker, code, signal) => {
    console.error(
      `Worker ${worker.process.pid} died with code ${code} and signal ${signal}`
    );
    const index = workers.findIndex((w) => w.worker === worker);
    if (index !== -1) {
      workers.splice(index, 1);
    }
  });
} else {
  const port = 3000 + cluster.worker.id; // Use id for uniqueness

  app.listen(port, () => {
    console.log(`Worker ${process.pid} listening on port ${port}`);
    process.send({ type: "healthCheck", port }); // Inform master about readiness
  });

  process.on("message", (msg) => {
    if (msg.type === "forwardRequest") {
      const { request, response } = msg;
      request.url = ""; // Modify request URL if needed (e.g., remove prefix)
      app(request, response); // Handle request using Express app
    }
  });
}

module.exports = app;
