const request = require("supertest");
const server = require("../backend/server");

// Sample user data for testing
const sampleUserData = {
  username: "John Doe",
  age: 30,
  hobbies: ["Reading", "Coding"],
};

describe("User API Endpoints", () => {
  let userId;

  // Test case for creating a new user
  test("POST /api/users", async () => {
    const response = await request(server)
      .post("/api/users")
      .send(sampleUserData)
      .expect(201);

    userId = response.body.id;
  });

  // Test case for getting all users
  test("GET /api/users", async () => {
    await request(server).get("/api/users").expect(200);
  });

  // Test case for getting a specific user by ID
  test("GET /api/users/:userId", async () => {
    await request(server).get(`/api/users/${userId}`).expect(200);
  });

  // Test case for updating an existing user by ID
  test("PUT /api/users/:userId", async () => {
    await request(server)
      .put(`/api/users/${userId}`)
      .send({
        username: "Updated Name",
        age: 35,
        hobbies: ["Traveling", "Photography"],
      })
      .expect(200);
  });

  // Test case for deleting an existing user by ID
  test("DELETE /api/users/:userId", async () => {
    await request(server).delete(`/api/users/${userId}`).expect(200);
  });
});
test("health check endpoint returns status ok", async () => {
  const response = await request(server).get("/");
  expect(response.status).toBe(200);
  expect(response.text).toBe("Hello, this is the health check route!");
});

// Close the server after all tests
afterAll((done) => {
  server.close(() => {
    done();
  });
});
