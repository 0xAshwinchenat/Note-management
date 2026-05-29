import { useState, useEffect } from 'react';
import type { Note } from './types';
import { getNotes, createNote, deleteNote } from './services/api';
import NoteCard from './components/NoteCard';
import NoteEditor from './components/NoteEditor';
import ConfirmationModal from './components/ConfirmationModal';
import { Search, Plus, StickyNote } from 'lucide-react';
import { useDebounce } from './hooks/useDebounce';
import './styles/App.css';

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State for Sidebar Deletion
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [modalStep, setModalStep] = useState(1);

  const debouncedSearch = useDebounce(search, 500);

  const fetchNotes = async (searchTerm?: string) => {
    setLoading(true);
    try {
      const data = await getNotes(searchTerm);
      setNotes(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch notes. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes(debouncedSearch);
  }, [debouncedSearch]);

  const handleCreateNote = async () => {
    try {
      const newNote = await createNote({ title: 'Untitled Note', content: '' });
      setNotes([newNote, ...notes]);
      setSelectedNoteId(newNote._id);
    } catch (err) {
      alert('Failed to create note');
    }
  };

  const handleUpdateNoteInList = (updatedNote: Note) => {
    setNotes(prevNotes => {
      const filtered = prevNotes.filter(n => n._id !== updatedNote._id);
      const updatedList = [updatedNote, ...filtered];
      return updatedList.sort((a, b) => {
        if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
    });
  };

  const handleDeleteNoteFromList = (id: string) => {
    setNotes(notes.filter(n => n._id !== id));
    if (selectedNoteId === id) setSelectedNoteId(null);
  };

  const openDeleteModal = (id: string) => {
    setNoteToDelete(id);
    setModalStep(1);
    setIsModalOpen(true);
  };

  const handleConfirmSidebarDelete = async () => {
    if (!noteToDelete) return;

    if (modalStep === 1) {
      setModalStep(2);
    } else {
      try {
        await deleteNote(noteToDelete);
        handleDeleteNoteFromList(noteToDelete);
        setIsModalOpen(false);
        setNoteToDelete(null);
      } catch (err) {
        alert('Failed to delete note');
      }
    }
  };

  const selectedNote = notes.find(n => n._id === selectedNoteId);

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="brand">
            <h2>SkyNotes</h2>
            <button className="icon-button btn-primary" onClick={handleCreateNote}>
              <Plus size={20} />
              <span>New Note</span>
            </button>
          </div>
          <div className="search-container">
            <Search 
              size={18} 
              className="search-icon" 
            />
            <input
              className="search-input"
              placeholder="Search your notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="notes-list">
          {loading && notes.length === 0 ? (
            <div className="empty-state">Loading...</div>
          ) : notes.length === 0 ? (
            <div className="empty-state">No notes found</div>
          ) : (
            notes.map(note => (
              <NoteCard
                key={note._id}
                note={note}
                isActive={selectedNoteId === note._id}
                onClick={() => setSelectedNoteId(note._id)}
                onDelete={() => openDeleteModal(note._id)}
              />
            ))
          )}
        </div>
      </aside>

      <main style={{ flex: 1, display: 'flex' }}>
        {selectedNote ? (
          <NoteEditor
            note={selectedNote}
            onUpdate={handleUpdateNoteInList}
            onDelete={handleDeleteNoteFromList}
          />
        ) : (
          <div className="empty-state">
            <StickyNote size={64} strokeWidth={1} style={{ marginBottom: '1rem' }} />
            <h3>Select a note to view or edit</h3>
            <p>Or create a new one to get started</p>
          </div>
        )}
      </main>

      <ConfirmationModal
        isOpen={isModalOpen}
        step={modalStep}
        title="Delete Note"
        description="Are you sure you want to delete this note? This will move it to oblivion."
        confirmLabel="Yes, Delete It"
        onConfirm={handleConfirmSidebarDelete}
        onCancel={() => setIsModalOpen(false)}
      />

      {error && (
        <div style={{ 
          position: 'fixed', bottom: '20px', right: '20px', 
          backgroundColor: 'var(--error-color)', color: 'white', 
          padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          zIndex: 1000
        }}>
          {error}
        </div>
      )}
    </div>
  );
}

export default App;
