import createError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res) => {
  const { page = 1, perPage = 10, tag, search } = req.query;

  const pageNumber = Number(page);
  const limitNumber = Number(perPage);
  const skip = (pageNumber - 1) * limitNumber;

  const filter = {};

  if (tag) {
    filter.tag = tag;
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search,$options: 'i' } },
      { content: { $regex: search,$options: 'i' } },
    ];
  }

  const totalNotes = await Note.countDocuments(filter);
  const totalPages = Math.ceil(totalNotes / limitNumber);

  const notes = await Note.find(filter)
    .skip(skip)
    .limit(limitNumber);

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
