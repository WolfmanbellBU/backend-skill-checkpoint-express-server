import { Router } from "express";
import connectionPool from "../utils/db.mjs";

const questionRouter = Router();

// POST /questions — Create a new question
questionRouter.post("/", async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: "Invalid request data." });
    }

    await connectionPool.query(
      `INSERT INTO questions (title, description, category)
       VALUES ($1, $2, $3)`,
      [title, description, category]
    );

    return res.status(201).json({ message: "Question created successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Unable to create question." });
  }
});

// GET /questions — Get all questions
questionRouter.get("/", async (req, res) => {
  try {
    const result = await connectionPool.query(
      `SELECT id, title, description, category
       FROM questions
       ORDER BY id ASC`
    );

    return res.status(200).json({ data: result.rows });
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch questions." });
  }
});

// GET /questions/search — Search by title or category
// Must be registered before /:questionId
questionRouter.get("/search", async (req, res) => {
  try {
    const { title, category } = req.query;

    if (!title && !category) {
      return res.status(400).json({ message: "Invalid search parameters." });
    }

    const conditions = [];
    const values = [];

    if (title) {
      values.push(`%${title}%`);
      conditions.push(`title ILIKE $${values.length}`);
    }

    if (category) {
      values.push(`%${category}%`);
      conditions.push(`category ILIKE $${values.length}`);
    }

    const result = await connectionPool.query(
      `SELECT id, title, description, category
       FROM questions
       WHERE ${conditions.join(" OR ")}
       ORDER BY id ASC`,
      values
    );

    return res.status(200).json({ data: result.rows });
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch a question." });
  }
});

// GET /questions/:questionId — Get a question by ID
questionRouter.get("/:questionId", async (req, res) => {
  try {
    const questionId = Number(req.params.questionId);

    if (!Number.isInteger(questionId)) {
      return res.status(404).json({ message: "Question not found." });
    }

    const result = await connectionPool.query(
      `SELECT id, title, description, category
       FROM questions
       WHERE id = $1`,
      [questionId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Question not found." });
    }

    return res.status(200).json({ data: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch questions." });
  }
});

// PUT /questions/:questionId — Update a question by ID
questionRouter.put("/:questionId", async (req, res) => {
  try {
    const questionId = Number(req.params.questionId);
    const { title, description, category } = req.body;

    if (!Number.isInteger(questionId)) {
      return res.status(404).json({ message: "Question not found." });
    }

    if (!title || !description || !category) {
      return res.status(400).json({ message: "Invalid request data." });
    }

    const existing = await connectionPool.query(
      `SELECT id FROM questions WHERE id = $1`,
      [questionId]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ message: "Question not found." });
    }

    await connectionPool.query(
      `UPDATE questions
       SET title = $1, description = $2, category = $3
       WHERE id = $4`,
      [title, description, category, questionId]
    );

    return res.status(200).json({ message: "Question updated successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch questions." });
  }
});

// DELETE /questions/:questionId — Delete a question by ID
questionRouter.delete("/:questionId", async (req, res) => {
  try {
    const questionId = Number(req.params.questionId);

    if (!Number.isInteger(questionId)) {
      return res.status(404).json({ message: "Question not found." });
    }

    const result = await connectionPool.query(
      `DELETE FROM questions WHERE id = $1 RETURNING id`,
      [questionId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Question not found." });
    }

    return res
      .status(200)
      .json({ message: "Question post has been deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Unable to delete question." });
  }
});

export default questionRouter;
