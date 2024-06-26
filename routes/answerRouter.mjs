import { Router } from "express";
import connectionPool from "../utils/db.mjs";

const answerRouter = Router({ mergeParams: true });

async function findQuestionById(questionId) {
  const result = await connectionPool.query(
    `SELECT id FROM questions WHERE id = $1`,
    [questionId]
  );
  return result.rows[0] || null;
}

// POST /questions/:questionId/answers — Create an answer
answerRouter.post("/", async (req, res) => {
  try {
    const questionId = Number(req.params.questionId);
    const { content } = req.body;

    if (!Number.isInteger(questionId)) {
      return res.status(404).json({ message: "Question not found." });
    }

    if (
      !content ||
      typeof content !== "string" ||
      content.trim() === "" ||
      content.length > 300
    ) {
      return res.status(400).json({ message: "Invalid request data." });
    }

    const question = await findQuestionById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    await connectionPool.query(
      `INSERT INTO answers (question_id, content)
       VALUES ($1, $2)`,
      [questionId, content]
    );

    return res.status(201).json({ message: "Answer created successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Unable to create answers." });
  }
});

// GET /questions/:questionId/answers — Get answers for a question
answerRouter.get("/", async (req, res) => {
  try {
    const questionId = Number(req.params.questionId);

    if (!Number.isInteger(questionId)) {
      return res.status(404).json({ message: "Question not found." });
    }

    const question = await findQuestionById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    const result = await connectionPool.query(
      `SELECT id, content
       FROM answers
       WHERE question_id = $1
       ORDER BY id ASC`,
      [questionId]
    );

    return res.status(200).json({ data: result.rows });
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch answers." });
  }
});

// DELETE /questions/:questionId/answers — Delete all answers for a question
answerRouter.delete("/", async (req, res) => {
  try {
    const questionId = Number(req.params.questionId);

    if (!Number.isInteger(questionId)) {
      return res.status(404).json({ message: "Question not found." });
    }

    const question = await findQuestionById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    await connectionPool.query(
      `DELETE FROM answers WHERE question_id = $1`,
      [questionId]
    );

    return res.status(200).json({
      message: "All answers for the question have been deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to delete answers." });
  }
});

export default answerRouter;
