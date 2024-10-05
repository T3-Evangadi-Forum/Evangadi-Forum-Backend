const express = require("express");
const router = express.Router();
const { AllQuestions,SingleQuestion } = require("../controller/questionController");
// all question router
router.get("/", AllQuestions);
// single question router 
router.get("/:question_id", SingleQuestion);
module.exports = router;
