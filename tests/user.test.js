require("dotenv").config({ path: ".env.test" });
const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");

const userOne = {
  name: "User One",
  email: "user.one@test.com",
  password: "test123"
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
