import createHttpError from 'http-errors';
import {
  getAllNotesService,
  getNoteByIdService,
  createNoteService,
  updateNoteService,
  deleteNoteService,
} from '../services/notes.js';

export const getAllNotes = async (req, res) => {
  const userId = req.user._id;
  const notes = await getAllNotesService(userId);
  res.status(200).json(notes);
};

export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const userId = req.user._id;

  const note = await getNoteByIdService(noteId, userId);

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

export const createNote = async (req, res) => {
  const userId = req.user._id;
  const note = await createNoteService({ ...req.body, userId });

  res.status(201).json(note);
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const userId = req.user._id;

  const note = await updateNoteService(noteId, userId, req.body);

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const userId = req.user._id;

  const note = await deleteNoteService(noteId, userId);

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(204).send();
};
