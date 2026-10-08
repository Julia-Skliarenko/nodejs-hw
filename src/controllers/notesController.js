import createError from 'http-errors';
import {
  getAllNotes as getAllNotesService,
  getNoteById as getNoteByIdService,
  createNote as createNoteService,
  updateNote as updateNoteService,
  deleteNote as deleteNoteService,
} from '../services/notes.js';

export const getAllNotes = async (req, res) => {
  const notes = await getAllNotesService();
  res.status(200).json({
    status: 200,
    message: 'Successfully found notes!',
    data: notes,
  });
};

export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await getNoteByIdService(noteId);

  if (!note) {
    throw createError(404, 'Note not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found note with id ${noteId}!`,
    data: note,
  });
};

export const createNote = async (req, res) => {
  const note = await createNoteService(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a note!',
    data: note,
  });
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const result = await updateNoteService(noteId, req.body);

  if (!result) {
    throw createError(404, 'Note not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a note!',
    data: result.note,
  });
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await deleteNoteService(noteId);

  if (!note) {
    throw createError(404, 'Note not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully deleted a note!',
    data: note,
  });
};
