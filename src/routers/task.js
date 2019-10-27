const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/tasks", auth, async ({ user, body }, res) => {
  const task = new Task({ ...body, owner: user._id });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(err);
  }
});

//GET /tasks?completed=true
//GET /tasks?limit=5&skip=5
//GET /tasks?sortBy=createdAt:desc
router.get("/tasks", auth, async ({ user, query }, res) => {
  const { completed, limit, skip, sortBy } = query;
  const match = {};
  const sort = {};

  if (completed) {
    match.completed = completed === "true";
  }

  if (sortBy) {
    const parts = sortBy.split(":");
    sort[parts[0]] = parts[1];
  }

  try {
    await user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(limit),
          skip: parseInt(skip),
          sort
        }
      })
      .execPopulate();
    res.send(user.tasks);
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/tasks/:id", auth, async ({ user, params }, res) => {
  try {
    const task = await Task.findOne({ _id: params.id, owner: user._id });

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch("/tasks/:id", auth, async ({ user, params, body }, res) => {
  const updates = Object.keys(body);
  const allowedUpdates = ["description", "completed"];
  const isValidUpdate = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidUpdate) {
    return res.status(400).send({ error: "Invalid updates" });
  }

  try {
    const task = await Task.findOne({ _id: params.id, owner: user._id });

    if (!task) {
      return res.status(404).send();
    }

    updates.forEach(update => (task[update] = body[update]));
    await task.save();
    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/tasks/:id", auth, async ({ user, params }, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: params.id,
      owner: user._id
    });

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
