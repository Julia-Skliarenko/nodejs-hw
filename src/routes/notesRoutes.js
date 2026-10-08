import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from '../controllers/notesController.js';
import {
  getAllNotesSchema,
  noteIdSchema,
  createNoteSchema,
  updateNoteSchema,
} from '../validations/notesValidation.js';

const router = Router();

router.get('/', celebrate(getAllNotesSchema), getAllNotes);
router.get('/:noteId', celebrate(noteIdSchema), getNoteById);
router.post('/', celebrate(createNoteSchema), createNote);
router.patch('/:noteId', celebrate(updateNoteSchema), updateNote);
router.delete('/:noteId', celebrate(noteIdSchema), deleteNote);

export default router;
