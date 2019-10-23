const express = require("express");
const User = require("./models/user");
const Task = require("./models/task");
require("./db/mongoose");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post("/users", (req, res) => {
  const user = new User(req.body);

  user
    .save()
    .then(result => res.status(201).send(result))
    .catch(err => res.status(400).send(err));
});

app.get("/users", (req, res) => {
  User.find({})
    .then(users => res.send(users))
    .catch(err => res.status(500).send());
});

app.get("/users/:id", (req, res) => {
  User.findById(req.params.id)
    .then(user => {
      if (!user) {
        return res.status(404).send();
      }
      res.send(user);
    })
    .catch(err => res.status(500).send());
});

app.post("/tasks", (req, res) => {
  const task = new Task(req.body);

  task
    .save()
    .then(result => res.status(201).send(result))
    .catch(err => res.status(400).send(err));
});

app.get("/tasks", (req, res) => {
  Task.find({})
    .then(tasks => res.send(tasks))
    .catch(err => res.status(500).send());
});

app.get("/tasks/:id", (req, res) => {
  Task.findById(req.params.id)
    .then(task => {
      if (!task) {
        return res.status(404).send();
      }
      res.send(task);
    })
    .catch(err => res.status(500).send());
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
