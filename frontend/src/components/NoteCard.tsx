import React from 'react';
import type { Note } from '../types';
import { Pin, Trash2 } from 'lucide-react';

interface NoteCardProps {
  note: Note;
  isActive: boolean;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, isActive, onClick, onDelete }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <div className={`note-card ${isActive ? 'active' : ''}`} onClick={onClick}>
      <button 
        className="icon-button delete-btn" 
        onClick={(e) => {
          e.stopPropagation();
          onDelete(e);
        }}
        title="Delete note"
      >
        <Trash2 size={14} />
      </button>
      <div className="note-card-header">
        <h3 className="note-card-title">{note.title || 'Untitled'}</h3>
        {note.isPinned && <Pin size={16} fill="var(--pinned-color)" color="var(--pinned-color)" />}
      </div>
      <p className="note-card-preview">{note.content || 'No content'}</p>
      <div className="note-card-footer">
        <span className="note-date">{formatDate(note.updatedAt)}</span>
        <div className="tag-pills">
          {note.tags.slice(0, 2).map((tag, index) => (
            <span key={index} className="tag-pill">{tag}</span>
          ))}
          {note.tags.length > 2 && <span className="tag-pill">+{note.tags.length - 2}</span>}
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
