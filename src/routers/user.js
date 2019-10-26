const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");

const router = new express.Router();

router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

router.post("/users/logout", auth, async ({ user, token }, res) => {
  try {
    user.tokens = user.tokens.filter(t => t.token !== token);
    await user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/users/logoutAll", auth, async ({ user }, res) => {
  try {
    user.tokens = [];
    await user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.delete("/users/me", auth, async ({ user }, res) => {
  try {
    await user.remove();
    res.send(user);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
