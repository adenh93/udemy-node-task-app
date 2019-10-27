const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const User = require("../models/user");
const auth = require("../middleware/auth");

const router = new express.Router();
const upload = new multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    const fileTypes = "jpg|jpeg|png";
    if (!file.originalname.toLowerCase().match(`\.(${fileTypes})$`)) {
      return cb(new Error("File upload must be a jpg, jpeg or png image."));
    }
    cb(undefined, true);
  }
});

router.post("/users", async ({ body }, res) => {
  const user = new User(body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/login", async ({ body }, res) => {
  const { email, password } = body;

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

router.get("/users/me", auth, async ({ user }, res) => {
  res.send(user);
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

router.post(
  "/users/me/avatar",
  [auth, upload.single("avatar")],
  async ({ file, user }, res) => {
    const buffer = await sharp(file.buffer)
      .png()
      .resize(250, 250)
      .toBuffer();
    user.avatar = buffer;
    await user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete("/users/me/avatar", auth, async ({ user }, res) => {
  try {
    user.avatar = undefined;
    await user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/users/:id/avatar", async ({ params }, res) => {
  try {
    const user = await User.findById(params.id);

    if (!user || !user.avatar) {
      res.status(404).send();
    }

    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
