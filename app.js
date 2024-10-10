const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
port = process.env.PORT;

const cors = require("cors");
app.use(cors());
//  db connection
const dbConnection = require("./db/dbConfig.js");

// user routes middleware file
const userRoutes = require("./routes/userRoute.js");

// json middleware to extract json data
app.use(express.json());

// user routes middleware
app.use("/api/users", userRoutes);

// questions routes middleware
const questionsRoutes = require("./routes/questionRoutes.js");
const authMiddleware = require("./middleware/authMiddleware.js");
// questions routes middleware??
app.use("/api/questions", authMiddleware, questionsRoutes);

//answer route
const answerRoutes = require("./routes/answerRoutes.js");
app.use("/api/answer", authMiddleware, answerRoutes);

async function start() {
  try {
    await dbConnection.execute('select "test"');
    console.log("database connection established");
    app.listen(port);
    console.log("listening on port " + port);
  } catch (err) {
    console.log(err.message);
  }
}

start();
