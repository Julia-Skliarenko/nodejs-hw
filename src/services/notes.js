import { Note } from '../models/note.js';

export const getAllNotesService = async ({
  userId,
  page = 1,
  perPage = 10,
  tag,
  search,
}) => {
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

  const [notesCount, notes] = await Promise.all([
    Note.countDocuments(filter),
    Note.find(filter).skip(skip).limit(limit),
  ]);

  const totalPages = Math.ceil(notesCount / limit);

  return {
    notes,
    page: Number(page),
    perPage: Number(perPage),
    totalNotes: notesCount,
    totalPages,
  };
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
