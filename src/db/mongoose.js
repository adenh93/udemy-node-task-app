const { connect, model } = require("mongoose");
const { isEmail } = require("validator");

const PORT = process.env.PORT || 27017;

const connectionString = `mongodb://127.0.0.1:${PORT}/task-manager-api`;

connect(
  connectionString,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  }
).then(() => console.log(`Connected to MongoDB instance on port ${PORT}`));

const User = model("User", {
  name: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!isEmail(value)) {
        throw new Error("Email must be a properly formatted email address");
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("Password must not contain 'password'");
      }
      if (value.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }
    }
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("Age must be a positive number");
      }
    }
  }
});

const Task = model("Task", {
  description: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  }
});
