import { Note } from '../models/note.js';

export const getAllNotes = async () => {
  return await Note.find();
};

export const getNoteById = async (noteId) => {
  return await Note.findById(noteId);
};

export const createNote = async (payload) => {
  return await Note.create(payload);
};

export const updateNote = async (noteId, payload, options = {}) => {
  const rawResult = await Note.findOneAndUpdate(
    { _id: noteId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    note: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.updatedExisting === false),
  };
};

export const deleteNote = async (noteId) => {
  return await Note.findOneAndDelete({ _id: noteId });
};
