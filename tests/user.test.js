require("dotenv").config({ path: ".env.test" });
const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = require("../src/app");
const User = require("../src/models/user");

const userOneId = mongoose.Types.ObjectId();

const userOne = {
  _id: userOneId,
  name: "User One",
  email: "user.one@test.com",
  password: "test123",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }
  ]
};

beforeEach(async () => {
  await User.deleteMany();
  await new User(userOne).save();
});

test("Should signup a new user", async () => {
  await request(app)
    .post("/users")
    .send({
      name: "Test",
      email: "test@test.com",
      password: "test123"
    })
    .expect(201);
});

test("Should login an existing user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password
    })
    .expect(200);
});

test("Should not authenticate user with invalid credentials", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: "invalidPassword"
    })
    .expect(400);
});

test("Should get profile for authenticated user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get profile if user is not authenticated", async () => {
  await request(app)
    .get("/users/me")
    .send()
    .expect(401);
});

test("Should delete account for authenticated user", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not delete account if not authenticated", async () => {
  await request(app)
    .delete("/users/me")
    .send()
    .expect(401);
});
