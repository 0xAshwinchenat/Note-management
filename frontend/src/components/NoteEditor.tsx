import React, { useState, useEffect, useCallback } from 'react';
import type { Note, UpdateNoteInput } from '../types';
import { updateNote, deleteNote } from '../services/api';
import { Pin, Trash2, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import ConfirmationModal from './ConfirmationModal';

interface NoteEditorProps {
  note: Note;
  onUpdate: (updatedNote: Note) => void;
  onDelete: (id: string) => void;
  onClose?: () => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, onUpdate, onDelete, onClose }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tags, setTags] = useState(note.tags.join(', '));
  const [isPinned, setIsPinned] = useState(note.isPinned);
  const [isSaving, setIsSaving] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1);

  // Debounced values for auto-save
  const debouncedTitle = useDebounce(title, 1000);
  const debouncedContent = useDebounce(content, 1000);
  const debouncedTags = useDebounce(tags, 1000);

  // Update local state when note changes (switching notes)
  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setTags(note.tags.join(', '));
    setIsPinned(note.isPinned);
    setModalStep(1);
    setIsModalOpen(false);
    setValidationError(null);
  }, [note._id]);

  const saveNote = useCallback(async (updates: UpdateNoteInput) => {
    if (!note._id) return;
    
    // Validation: Title must not be empty
    if (!updates.title && updates.title !== undefined) {
      setValidationError('Title cannot be empty');
      return;
    }

    setValidationError(null);
    setIsSaving(true);
    try {
      const updatedNote = await updateNote(note._id, updates);
      onUpdate(updatedNote);
    } catch (error) {
      console.error('Failed to auto-save:', error);
    } finally {
      setIsSaving(false);
    }
  }, [note._id, onUpdate]);

  // Auto-save effect
  useEffect(() => {
    const hasChanged = 
      debouncedTitle !== note.title || 
      debouncedContent !== note.content || 
      debouncedTags !== note.tags.join(', ');

    if (hasChanged) {
      if (debouncedTitle.trim() === '') {
        setValidationError('Title cannot be empty');
      } else {
        saveNote({
          title: debouncedTitle,
          content: debouncedContent,
          tags: debouncedTags.split(',').map(t => t.trim()).filter(t => t !== ''),
        });
      }
    }
  }, [debouncedTitle, debouncedContent, debouncedTags, saveNote, note.title, note.content, note.tags]);

  const handleTogglePin = async () => {
    const newPinnedStatus = !isPinned;
    setIsPinned(newPinnedStatus);
    await saveNote({ isPinned: newPinnedStatus });
  };

  const handleDeleteClick = () => {
    setModalStep(1);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (modalStep === 1) {
      setModalStep(2);
    } else {
      try {
        await deleteNote(note._id);
        onDelete(note._id);
        setIsModalOpen(false);
      } catch (error) {
        alert('Failed to delete note');
      }
    }
  };

  return (
    <>
      <div className="main-content">
        <div className="editor-header">
          <div className="editor-left">
            {onClose && (
              <button className="icon-button" onClick={onClose}>
                <ArrowLeft size={20} />
              </button>
            )}
            {isSaving && <Loader2 size={16} className="loading-spinner text-muted" />}
          </div>
          <div className="editor-actions">
            <button 
              className={`icon-button ${isPinned ? 'pinned' : ''}`} 
              onClick={handleTogglePin}
              title={isPinned ? 'Unpin note' : 'Pin note'}
            >
              <Pin size={20} fill={isPinned ? 'var(--pinned-color)' : 'none'} />
            </button>
            <button className="icon-button btn-danger" onClick={handleDeleteClick} title="Delete note">
              <Trash2 size={20} />
            </button>
          </div>
        </div>
        <div className="editor-body">
          {validationError && (
            <div className="validation-error">
              <AlertCircle size={16} />
              <span>{validationError}</span>
            </div>
          )}
          <input
            className={`title-input ${validationError ? 'error' : ''}`}
            placeholder="Note Title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (e.target.value.trim() !== '') setValidationError(null);
            }}
          />
          <div className="tags-container">
            <span style={{ fontSize: '1.2rem' }}>#</span>
            <input
              className="tags-input"
              placeholder="Add tags..."
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
          <textarea
            className="content-textarea"
            placeholder="Start writing..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        step={modalStep}
        title="Delete Note"
        description="Are you sure you want to delete this note? This will move it to oblivion."
        confirmLabel="Yes, Delete It"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default NoteEditor;
