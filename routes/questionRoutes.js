const express = require("express");
const router = express.Router();
const {
  AllQuestions,
  askQuestion,
  SingleQuestion,
  editQuestion,
} = require("../controller/questionController");
const authMiddleware = require("../middleware/authMiddleware");

// **Get all questions Route**
router.get("/", AllQuestions);
router.get("/:question_id", SingleQuestion);

// edit question
router.patch("/:questionId", editQuestion);

// **Post a Question Route**
router.post("/", authMiddleware, askQuestion);

module.exports = router;
