const { connect } = require("mongoose");

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
