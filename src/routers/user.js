const express = require("express");
const multer = require("multer");
const User = require("../models/user");
const auth = require("../middleware/auth");

const router = new express.Router();
const upload = new multer({
  dest: "avatars"
});

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

router.patch("/users/me", auth, async ({ user, body }, res) => {
  const updates = Object.keys(body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates" });
  }

  try {
    updates.forEach(update => (user[update] = body[update]));
    await user.save();
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
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

router.post("/users/me/avatar", [auth, upload.single("avatar")], (req, res) => {
  res.send();
});

module.exports = router;
