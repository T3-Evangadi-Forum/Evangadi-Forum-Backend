const dbConnection = require("../db/dbConfig.js");
const { StatusCodes } = require("http-status-codes");

// ** POST QUESTION Handler
async function askQuestion(req, res) {
  const { title, content } = req.body;
  const user_id = req.user.userid;

  if (!title || !content) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Please provide all required fields",
    });
  }

  try {
    await dbConnection.query(
      "INSERT INTO questions (user_id, title, content) VALUES (?, ?, ?)",
      [user_id, title, content]
    );

    return res.status(StatusCodes.CREATED).json({
      message: "Question created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}

//** All question handler**
const AllQuestions = async (req, res) => {
  try {
    const selectAllQuestions =
      "SELECT questions.*, users.username, users.email FROM questions JOIN users ON questions.user_id = users.userid ORDER BY questions.question_id DESC;";
    const response = await dbConnection.query(selectAllQuestions);
    if (response[0].length === 0) {
      return res.status(404).json({
        error: "Not Found",
        message: "No questions found.",
      });
    }
    res.status(200).json(response[0]);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

const SingleQuestion = async (req, res) => {
  const { question_id } = req.params;
  const selectSingleQuestion = "SELECT * FROM questions WHERE question_id = ?";
  try {
    const [rows] = await dbConnection.query(selectSingleQuestion, [
      question_id,
    ]);
    if (rows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Not Found",
        message: "The requested question could not be found.",
      });
    }
    res.status(StatusCodes.OK).json(rows[0]);
  } catch (error) {
    console.log(error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "An unexpected error occurred.",
    });
  }
};

module.exports = { AllQuestions, SingleQuestion, askQuestion };
