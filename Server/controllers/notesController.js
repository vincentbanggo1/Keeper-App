const db = require('../config/db');

const isValidId = (id) => /^[1-9]\d*$/.test(id);

const getNotes = async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM notes ORDER BY id DESC');
    return res.status(200).json(result.rows);
  } catch (error) {
    return next(error);
  }
};

const createNotes = async (req, res, next) => {
  try {
    const { title, content = '' } = req.body || {};

    if (typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }
    if (typeof content !== 'string') {
      return res.status(400).json({ message: 'Content must be a string' });
    }

    const result = await db.query(
      `INSERT INTO notes (title, content)
       VALUES ($1, $2)
       RETURNING *`,
      [title.trim(), content.trim()],
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return next(error);
  }
};

const updateNotes = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body || {};

    if (!isValidId(id)) {
      return res.status(400).json({ message: 'A valid note id is required' });
    }
    if (title !== undefined && typeof title !== 'string') {
      return res.status(400).json({ message: 'Title must be a string' });
    }
    if (content !== undefined && typeof content !== 'string') {
      return res.status(400).json({ message: 'Content must be a string' });
    }
    if (title !== undefined && !title.trim()) {
      return res.status(400).json({ message: 'Title cannot be empty' });
    }

    const existing = await db.query('SELECT * FROM notes WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const note = existing.rows[0];
    const result = await db.query(
      `UPDATE notes
       SET title = $1, content = $2
       WHERE id = $3
       RETURNING *`,
      [
        title === undefined ? note.title : title.trim(),
        content === undefined ? note.content : content.trim(),
        id,
      ],
    );

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    return next(error);
  }
};

const deleteNotes = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ message: 'A valid note id is required' });
    }

    const result = await db.query('DELETE FROM notes WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Note not found' });
    }
    return res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getNotes,
  createNotes,
  updateNotes,
  deleteNotes,
};