import { Note } from '../models/note.js';

export const getAllNotesService = async (userId) => {
  return await Note.find({ userId });
};

export const getNoteByIdService = async (noteId, userId) => {
  return await Note.findOne({ _id: noteId, userId });
};

export const createNoteService = async (payload) => {
  return await Note.create(payload);
};

export const updateNoteService = async (noteId, userId, payload) => {
  return await Note.findOneAndUpdate({ _id: noteId, userId }, payload, {
    new: true,
  });
};

export const deleteNoteService = async (noteId, userId) => {
  return await Note.findOneAndDelete({ _id: noteId, userId });
};
