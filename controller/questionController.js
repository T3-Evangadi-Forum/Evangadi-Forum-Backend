const dbConnection = require("../db/dbConfig.js");
const { StatusCodes } = require("http-status-codes");
const AllQuestions = async (req, res) => {
  try {
    const selectAllQuestions = "select * from questions";
    const response = await dbConnection.query(selectAllQuestions);
        if (response[0].length === 0) {
          return res.status(404).json({
            error: "Not Found",
            message: "No questions found.",
          });
        }

    res.status(200).json(response[0]);

    console.log(response[0]);
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

module.exports = { AllQuestions,SingleQuestion };
