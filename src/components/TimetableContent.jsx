import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus } from 'lucide-react';

const TimetableContent = () => {
  const [entries, setEntries] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    lecture: '',
    description: ''
  });
  const [editingId, setEditingId] = useState(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('timetableEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Save to localStorage whenever entries change
  useEffect(() => {
    localStorage.setItem('timetableEntries', JSON.stringify(entries));
  }, [entries]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.lecture) {
      alert('Please fill in title and lecture name');
      return;
    }

    if (editingId) {
      // Update existing entry
      const updatedEntries = entries.map(entry =>
        entry.id === editingId
          ? { ...formData, id: editingId, createdAt: new Date().toISOString() }
          : entry
      );
      setEntries(updatedEntries);
      setEditingId(null);
    } else {
      // Add new entry
      const newEntry = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      setEntries([newEntry, ...entries]);
    }

    // Reset form
    setFormData({
      title: '',
      lecture: '',
      description: ''
    });
  };

  const handleEdit = (entry) => {
    setFormData({
      title: entry.title,
      lecture: entry.lecture,
      description: entry.description
    });
    setEditingId(entry.id);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setEntries(entries.filter(entry => entry.id !== id));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-3 sm:p-6">
      {/* Form Section */}
      <div className="bg-white/5 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">
          {editingId ? 'Edit Timetable Entry' : 'Add New Timetable Entry'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/80 mb-2 text-base">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Introduction to Programming"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-white/80 mb-2 text-base">Lecture Name *</label>
            <input
              type="text"
              name="lecture"
              value={formData.lecture}
              onChange={handleInputChange}
              placeholder="e.g., Dr. John Smith"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-white/80 mb-2 text-base">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Detailed description of the lecture content..."
              rows="3"
              className="input-field resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button type="submit" className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" />
              {editingId ? 'Update Entry' : 'Add Entry'}
            </button>
            
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ title: '', lecture: '', description: '' });
                }}
                className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all duration-200"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Table Section */}
      <div className="bg-white/5 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <h2 className="text-lg sm:text-xl font-semibold text-white">Timetable Entries</h2>
          <p className="text-white/60 text-base mt-1">
            Total: {entries.length} entry{entries.length !== 1 ? 's' : ''}
          </p>
        </div>

        {entries.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-white/60 text-base">No entries yet. Add your first timetable entry above!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-4 py-3 text-left text-white font-semibold text-base">Title</th>
                  <th className="px-4 py-3 text-left text-white font-semibold text-base">Lecture</th>
                  <th className="px-4 py-3 text-left text-white font-semibold text-base">Description</th>
                  <th className="px-4 py-3 text-left text-white font-semibold text-base">Created</th>
                  <th className="px-4 py-3 text-left text-white font-semibold text-base">Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-white text-base">{entry.title}</td>
                    <td className="px-4 py-3 text-white text-base">{entry.lecture}</td>
                    <td className="px-4 py-3 text-white/80 text-base max-w-xs truncate">
                      {entry.description || '-'}
                    </td>
                    <td className="px-4 py-3 text-white/60 text-base whitespace-nowrap">
                      {formatDate(entry.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(entry)}
                          className="p-1 rounded hover:bg-white/10 transition-colors"
                          aria-label="Edit"
                        >
                          <Edit2 className="w-4 h-4 text-accent" />
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="p-1 rounded hover:bg-white/10 transition-colors"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimetableContent;