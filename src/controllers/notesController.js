import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res) => {
  const userId = req.user._id;
  const { page = 1, perPage = 10, tag, search } = req.query;

  const limit = Number(perPage);
  const skip = (Number(page) - 1) * limit;

  const filter = { userId };

  if (tag) {
    filter.tag = tag;
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ];
  }

  const [totalNotes, notes] = await Promise.all([
    Note.countDocuments(filter),
    Note.find(filter).skip(skip).limit(limit),
  ]);

  const totalPages = Math.ceil(totalNotes / limit);

  res.status(200).json({
    notes,
    page: Number(page),
    perPage: Number(perPage),
    totalNotes,
    totalPages,
  });
};

export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const userId = req.user._id;

  const note = await Note.findOne({ _id: noteId, userId });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

export const createNote = async (req, res) => {
  const userId = req.user._id;

  const note = await Note.create({
    ...req.body,
    userId,
  });

  res.status(201).json(note);
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const userId = req.user._id;

  const note = await Note.findOneAndUpdate(
    { _id: noteId, userId },
    req.body,
    { returnDocument: 'after' },
  );

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const userId = req.user._id;

  const note = await Note.findOneAndDelete({ _id: noteId, userId });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};
