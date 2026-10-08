import createError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res) => {
  const { page = 1, perPage = 10, tag, search } = req.query;

  const pageNumber = Number(page);
  const limitNumber = Number(perPage);
  const skip = (pageNumber - 1) * limitNumber;

  const notesQuery = Note.find();
  const countQuery = Note.find();

  if (tag) {
    notesQuery.where('tag').equals(tag);
    countQuery.where('tag').equals(tag);
  }

  if (search) {
    const searchFilter = [
      { title: { $regex: search,$options: 'i' } },
      { content: { $regex: search,$options: 'i' } },
    ];
    notesQuery.where({ $or: searchFilter });
    countQuery.where({ $or: searchFilter });
  }

  const [totalNotes, notes] = await Promise.all([
    countQuery.countDocuments(),
    notesQuery.skip(skip).limit(limitNumber),
  ]);

  const totalPages = Math.ceil(totalNotes / limitNumber);

  res.status(200).json({
    status: 200,
    message: 'Successfully found notes!',
    data: {
      page: pageNumber,
      perPage: limitNumber,
      totalNotes,
      totalPages,
      notes,
    },
  });
};

export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);

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
  const note = await Note.create(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a note!',
    data: note,
  });
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const updatedNote = await Note.findByIdAndUpdate(noteId, req.body, {
    returnDocument: 'after',
  });

  if (!updatedNote) {
    throw createError(404, 'Note not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a note!',
    data: updatedNote,
  });
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findByIdAndDelete(noteId);

  if (!note) {
    throw createError(404, 'Note not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully deleted a note!',
    data: note,
  });
};
