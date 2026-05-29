import axios from 'axios';
import type { Note, CreateNoteInput, UpdateNoteInput } from '../types';

const API_URL = 'http://localhost:5000/api/notes';

export const getNotes = async (search?: string): Promise<Note[]> => {
  const response = await axios.get(API_URL, {
    params: { search },
  });
  return response.data;
};

export const getNoteById = async (id: string): Promise<Note> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createNote = async (note: CreateNoteInput): Promise<Note> => {
  const response = await axios.post(API_URL, note);
  return response.data;
};

export const updateNote = async (id: string, note: UpdateNoteInput): Promise<Note> => {
  const response = await axios.put(`${API_URL}/${id}`, note);
  return response.data;
};

export const deleteNote = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
