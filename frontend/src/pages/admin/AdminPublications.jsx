import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  Search,
  X,
  CheckCircle2,
  AlertCircle,
  Building2,
  Layers
} from 'lucide-react';
import api from '../../services/api.js';

export default function AdminPublications() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  // Modal State for Add & Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPublication, setEditingPublication] = useState(null);
  const [name, setName] = useState('');
  const [message, setMessage] = useState(null);

  const fetchPublications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/publications');
      if (res.data.success) {
        setPublications(res.data.publications || []);
      }
    } catch (err) {
      console.error('Fetch publications error:', err);
      setMessage({ type: 'error', text: 'Failed to load publications from server.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  // Filtered publications by search query
  const filteredPublications = useMemo(() => {
    if (!search.trim()) return publications;
    const term = search.toLowerCase().trim();
    return publications.filter(
      (p) =>
        (p.name && p.name.toLowerCase().includes(term)) ||
        String(p.id).includes(term)
    );
  }, [publications, search]);

  // Open Create Modal Popup
  const openCreateModal = () => {
    setEditingPublication(null);
    setName('');
    setMessage(null);
    setModalOpen(true);
  };

  // Open Edit Modal Popup
  const openEditModal = (pub) => {
    setEditingPublication(pub);
    setName(pub.name || '');
    setMessage(null);
    setModalOpen(true);
  };

  // Handle Save (Create or Update) via Modal
  const handleSave = async (e) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) return;

    setSaving(true);
    try {
      if (editingPublication) {
        const res = await api.put(`/publications/${editingPublication.id}`, { name: cleanName });
        if (res.data.success) {
          setMessage({ type: 'success', text: `Updated publication "${cleanName}" successfully!` });
        }
      } else {
        const res = await api.post('/publications', { name: cleanName });
        if (res.data.success) {
          setMessage({ type: 'success', text: `Created publication "${cleanName}" successfully!` });
        }
      }
      setModalOpen(false);
      setName('');
      setEditingPublication(null);
      fetchPublications();
      setTimeout(() => setMessage(null), 3500);
    } catch (err) {
      console.error('Save publication error:', err);
      alert(err.response?.data?.message || 'Failed to save publication.');
    } finally {
      setSaving(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id, pubName) => {
    if (!window.confirm(`Are you sure you want to delete publication "${pubName}"?`)) return;

    try {
      const res = await api.delete(`/publications/${id}`);
      if (res.data.success) {
        setMessage({ type: 'success', text: `Publication "${pubName}" has been deleted.` });
        fetchPublications();
        setTimeout(() => setMessage(null), 3500);
      }
    } catch (err) {
      console.error('Delete publication error:', err);
      alert(err.response?.data?.message || 'Failed to delete publication.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* ================= TOP HEADER STRIP ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Publishing Houses
            </h1>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {publications.length} Publishers
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Manage book publishers, study material brands, and editorial houses
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={fetchPublications}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-sm shadow-red-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Publication</span>
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {message && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between shadow-2xs animate-in fade-in ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
          <button
            onClick={() => setMessage(null)}
            className="text-slate-400 hover:text-slate-600 cursor-pointer font-bold px-2 py-0.5"
          >
            ×
          </button>
        </div>
      )}

      {/* ================= SEARCH & STATS FILTER BAR ================= */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by publication name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-white transition-all font-medium text-slate-800"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="text-xs text-slate-500 font-semibold self-start sm:self-auto">
          Showing <strong className="text-slate-900">{filteredPublications.length}</strong> of {publications.length} publications
        </div>
      </div>

      {/* ================= PUBLICATIONS DIRECTORY GRID ================= */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-semibold">Loading publication directory...</p>
        </div>
      ) : filteredPublications.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center space-y-2">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="font-bold text-slate-700 text-sm">No publications found</p>
          <p className="text-xs text-slate-400">
            {search ? 'Try clearing your search query.' : 'Click "Add Publication" to create your first publishing house.'}
          </p>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="mt-2 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPublications.map((pub) => (
            <div
              key={pub.id}
              className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs shrink-0 group-hover:scale-105 transition-transform">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono font-bold">
                    #{pub.id}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm mt-3 line-clamp-2 leading-snug">
                  {pub.name}
                </h3>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg flex items-center gap-1 border border-emerald-200/50">
                  <Layers className="w-3 h-3" />
                  {pub.product_count !== undefined ? `${pub.product_count} Titles` : 'Active'}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(pub)}
                    className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    title="Edit Publication"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(pub.id, pub.name)}
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Publication"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= CLEAN MODAL POPUP FOR ADD & EDIT ================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                  {editingPublication ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">
                    {editingPublication ? 'Edit Publication' : 'Add New Publication'}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {editingPublication
                      ? `Updating publication #${editingPublication.id}`
                      : 'Register a new publisher for books'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-extrabold uppercase text-[11px] tracking-wider text-slate-700 mb-1.5">
                  Publication Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-bold text-slate-800 text-sm transition-all"
                  placeholder="e.g. Telugu Academy, Vijetha Competitions, Winners Publications"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !name.trim()}
                  className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-bold rounded-xl text-xs shadow-md shadow-red-500/20 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {saving
                    ? 'Saving...'
                    : editingPublication
                    ? 'Update Publication'
                    : 'Create Publication'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
