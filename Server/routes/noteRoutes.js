const express = require('express');
const {
  getNotes,
  createNotes,
  updateNotes,
  deleteNotes,
} = require('../controllers/notesController');

const router = express.Router();

router.get('/', getNotes);
router.post('/', createNotes);
router.put('/:id', updateNotes);
router.patch('/:id', updateNotes);
router.delete('/:id', deleteNotes);

module.exports = router;