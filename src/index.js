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
    .catch(error => res.status(400).send(error));
});

app.post("/tasks", (req, res) => {
  const task = new Task(req.body);

  task
    .save()
    .then(result => res.status(201).send(result))
    .catch(error => res.status(400).send(error));
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
