const dbconnection = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");

// gete answer function
async function getanswer(req, res) {
  const question_id = req.params.question_id;
  try {
    const [answers] = await dbconnection.query(
      "SELECT answer_id, user_name, content FROM answers WHERE question_id = ?",
      [question_id]
    );

    if (answers.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "No answers found for this question" });
    }

    res.status(StatusCodes.OK).json({ question_id, answers });
  } catch (err) {
    console.log(err.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal server error" });
  }
}
// post answer
const postAnswer = async (req, res) => {
  const { answer, questionId } = req.body;

  const username = req.user.username;

  if (!answer) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Bad request", message: "Please provide answer" });
  }
  try {
    await dbconnection.query(
      "INSERT INTO answers (content, user_name, question_id) VALUES (?, ?, ?)",
      [answer, username, questionId]
    );

    return res
      .status(StatusCodes.CREATED)
      .json({ message: "Answer posted successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal server error",
      message: "Unexpected error occurred",
    });
  }
};

// edit answer by id
const editAnswer = async (req, res) => {
  const answerId = req.params.answerId;
  const { answer } = req.body;
  const username = req.user.username;

  if (!answer) {
    return res.status(400).json({ message: "Answer is required" });
  }

  try {
    const [existingAnswer] = await dbconnection.query(
      `SELECT user_name FROM answers WHERE answer_id = ?`,
      [answerId]
    );

    if (existingAnswer.length === 0) {
      return res
        .status(404)
        .json({ message: `No answer found with id: ${answerId}` });
    }

    const usernameDB = existingAnswer[0].user_name;

    if (usernameDB !== username) {
      return res
        .status(403)
        .json({ message: "You are not authorized to edit this answer" });
    }

    const [result] = await dbconnection.query(
      `UPDATE answers SET content = ? WHERE answer_id = ?`,
      [answer, answerId]
    );

    return res.status(200).json({ message: "Answer updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// delete answer by id
const deleteAnswer = async (req, res) => {
  const answerId = req.params.answerId;
  const username = req.user.username;

  try {
    const [existingAnswer] = await dbconnection.query(
      `SELECT user_name FROM answers WHERE answer_id = ?`,
      [answerId]
    );

    if (existingAnswer.length === 0) {
      return res
        .status(404)
        .json({ message: `No answer found with id: '${answerId}'` });
    }

    const usernameDB = existingAnswer[0].user_name;

    if (usernameDB !== username) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this answer." });
    }

    const [result] = await dbconnection.query(
      `DELETE FROM answers WHERE answer_id = ?`,
      [answerId]
    );

    return res.status(200).json({ message: "Answer deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getUserAnswers = async (req, res) => {
  const username = req.user.username;
  // console.log(username);
  const allAnswer = "SELECT * FROM answers WHERE user_name = ?";
  try {
    const connection = await dbconnection.getConnection();
    const [result] = await connection.query(allAnswer, [username]);
    connection.release();

    if (result.length === 0) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "No answers found" });
    } else {
      res.status(StatusCodes.OK).json({ answers: result });
    }
  } catch (err) {
    //console.error(err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

module.exports = {
  postAnswer,
  editAnswer,
  deleteAnswer,
  getanswer,
  getUserAnswers,
};
