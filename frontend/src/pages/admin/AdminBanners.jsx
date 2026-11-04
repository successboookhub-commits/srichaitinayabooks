import React, { useState, useEffect, useMemo } from 'react';
import {
  ImagePlus,
  Trash2,
  RefreshCw,
  Eye,
  Sparkles,
  Plus,
  Layers,
  ArrowUp,
  ArrowDown,
  Edit2,
  X,
  CheckCircle2,
  AlertCircle,
  Search,
  BookOpen,
  Check,
  RotateCcw,
  Tag,
  Building2,
  Sliders
} from 'lucide-react';
import api, { getImageUrl } from '../../services/api.js';

export default function AdminBanners() {
  const [activeTab, setActiveTab] = useState('sections'); // 'sections' | 'banners'

  // ================= HOME SECTIONS STATE =================
  const [sections, setSections] = useState([]);
  const [loadingSections, setLoadingSections] = useState(true);
  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [savingSection, setSavingSection] = useState(false);

  // Section Form state
  const [sectionForm, setSectionForm] = useState({
    title: '',
    subtitle: '',
    display_order: 1,
    is_active: true,
    product_ids: [],
  });

  // Book Selector state
  const [availableProducts, setAvailableProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [bookSearch, setBookSearch] = useState('');
  const [bookCategoryFilter, setBookCategoryFilter] = useState('');
  const [loadingProducts, setLoadingProducts] = useState(false);

  // ================= BANNERS STATE =================
  const [banners, setBanners] = useState([]);
  const [loadingBanners, setLoadingBanners] = useState(true);
  const [bannerSubmitting, setBannerSubmitting] = useState(false);
  const [bannerTitle, setBannerTitle] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Global message
  const [message, setMessage] = useState(null);

  // Showcase Settings state
  const [showcaseSettings, setShowcaseSettings] = useState({
    show_category_showcase: true,
    show_publication_showcase: true,
    category_showcase_limit: 8,
    publication_showcase_limit: 8,
  });
  const [updatingSettings, setUpdatingSettings] = useState(false);

  // ================= FETCH FUNCTIONS =================
  const fetchSections = async () => {
    try {
      setLoadingSections(true);
      const res = await api.get('/home-sections/admin');
      if (res.data.success) {
        setSections(res.data.sections || []);
        if (res.data.settings) {
          setShowcaseSettings(res.data.settings);
        }
      }
    } catch (err) {
      console.error('Fetch sections error:', err);
    } finally {
      setLoadingSections(false);
    }
  };

  const handleToggleSetting = async (key, currentValue) => {
    const newValue = !currentValue;
    const nextSettings = { ...showcaseSettings, [key]: newValue };
    setShowcaseSettings(nextSettings);
    try {
      setUpdatingSettings(true);
      await api.put('/home-sections/admin/settings', {
        [key]: newValue,
      });
      const label = key === 'show_category_showcase' ? 'Category-wise Showcase' : 'Publication-wise Showcase';
      setMessage({
        type: 'success',
        text: `${label} on Homepage is now ${newValue ? 'ENABLED (Showing all on Home)' : 'DISABLED (Hidden)'}!`,
      });
      setTimeout(() => setMessage(null), 3500);
    } catch (err) {
      console.error('Update setting error:', err);
      setShowcaseSettings(showcaseSettings);
      alert('Failed to update showcase setting.');
    } finally {
      setUpdatingSettings(false);
    }
  };

  const handleUpdateLimit = async (key, val) => {
    const num = parseInt(val) || 8;
    setShowcaseSettings((prev) => ({ ...prev, [key]: num }));
    try {
      await api.put('/home-sections/admin/settings', {
        [key]: num,
      });
    } catch (err) {
      console.error('Update limit error:', err);
    }
  };

  const fetchBanners = async () => {
    try {
      setLoadingBanners(true);
      const res = await api.get('/banners');
      if (res.data.success) {
        setBanners(res.data.banners || []);
      }
    } catch (err) {
      console.error('Fetch banners error:', err);
    } finally {
      setLoadingBanners(false);
    }
  };

  const fetchAllProducts = async () => {
    if (availableProducts.length > 0) return;
    try {
      setLoadingProducts(true);
      const [prodRes, catRes] = await Promise.all([
        api.get('/products?limit=600'),
        api.get('/categories'),
      ]);
      setAvailableProducts(prodRes.data.products || []);
      setCategories(catRes.data.categories || []);
    } catch (err) {
      console.error('Fetch available products error:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchSections();
    fetchBanners();
    fetchAllProducts();
  }, []);

  // ================= SECTION MODAL HANDLERS =================
  const openCreateSectionModal = () => {
    setEditingSection(null);
    setSectionForm({
      title: '',
      subtitle: '',
      display_order: sections.length + 1,
      is_active: true,
      product_ids: [],
    });
    setBookSearch('');
    setBookCategoryFilter('');
    setSectionModalOpen(true);
  };

  const openEditSectionModal = (sec) => {
    setEditingSection(sec);
    setSectionForm({
      title: sec.title || '',
      subtitle: sec.subtitle || '',
      display_order: sec.display_order ?? 1,
      is_active: Boolean(sec.is_active),
      product_ids: Array.isArray(sec.product_ids) ? sec.product_ids : [],
    });
    setBookSearch('');
    setBookCategoryFilter('');
    setSectionModalOpen(true);
  };

  // Toggle book in section's product_ids
  const toggleBookSelection = (productId) => {
    setSectionForm((prev) => {
      const idNum = Number(productId);
      const exists = prev.product_ids.includes(idNum);
      const nextIds = exists
        ? prev.product_ids.filter((id) => id !== idNum)
        : [...prev.product_ids, idNum];
      return { ...prev, product_ids: nextIds };
    });
  };

  // Move book within selected order
  const removeSelectedBook = (productId) => {
    setSectionForm((prev) => ({
      ...prev,
      product_ids: prev.product_ids.filter((id) => id !== Number(productId)),
    }));
  };

  // Save Home Section (Create or Update)
  const handleSaveSection = async (e) => {
    e.preventDefault();
    if (!sectionForm.title.trim()) {
      alert('Please enter a Section Title (e.g. "New Arrivals")');
      return;
    }

    setSavingSection(true);
    try {
      const payload = {
        title: sectionForm.title.trim(),
        subtitle: sectionForm.subtitle.trim(),
        display_order: Number(sectionForm.display_order) || 1,
        is_active: sectionForm.is_active ? 1 : 0,
        product_ids: sectionForm.product_ids,
      };

      if (editingSection) {
        await api.put(`/home-sections/admin/${editingSection.id}`, payload);
        setMessage({ type: 'success', text: `Section "${payload.title}" updated successfully!` });
      } else {
        await api.post('/home-sections/admin', payload);
        setMessage({ type: 'success', text: `New Section "${payload.title}" created successfully!` });
      }

      setSectionModalOpen(false);
      fetchSections();
      setTimeout(() => setMessage(null), 3500);
    } catch (err) {
      console.error('Save section error:', err);
      alert(err.response?.data?.message || 'Failed to save section.');
    } finally {
      setSavingSection(false);
    }
  };

  // Delete Home Section
  const handleDeleteSection = async (sec) => {
    if (!window.confirm(`Are you sure you want to delete section "${sec.title}" from the homepage?`)) return;
    try {
      await api.delete(`/home-sections/admin/${sec.id}`);
      setMessage({ type: 'success', text: `Section "${sec.title}" deleted.` });
      fetchSections();
      setTimeout(() => setMessage(null), 3500);
    } catch (err) {
      console.error('Delete section error:', err);
      alert('Failed to delete section.');
    }
  };

  // Reorder Sections Up or Down
  const handleMoveSection = async (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    // Recalculate display_orders (1, 2, 3...)
    const orders = newSections.map((sec, idx) => ({
      id: sec.id,
      display_order: idx + 1,
    }));

    setSections(
      newSections.map((s, idx) => ({
        ...s,
        display_order: idx + 1,
      }))
    );

    try {
      await api.post('/home-sections/admin/reorder', { orders });
      setMessage({ type: 'success', text: 'Section order updated on Homepage!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error('Reorder error:', err);
      fetchSections();
    }
  };

  // Filter books inside the book selector modal
  const filteredAvailableBooks = useMemo(() => {
    let list = availableProducts;
    if (bookCategoryFilter) {
      list = list.filter((p) => {
        if (Array.isArray(p.category_ids)) {
          return p.category_ids.some((cid) => String(cid) === String(bookCategoryFilter));
        }
        return false;
      });
    }
    if (bookSearch.trim()) {
      const q = bookSearch.toLowerCase().trim();
      list = list.filter((p) => {
        const matchTitle = (p.name || p.title || '').toLowerCase().includes(q);
        const matchId = String(p.id) === q || String(p.id).includes(q);
        const matchPub = (p.publication_name || '').toLowerCase().includes(q);
        return matchTitle || matchId || matchPub;
      });
    }
    return list;
  }, [availableProducts, bookSearch, bookCategoryFilter]);

  // Map of selected books objects for quick preview
  const selectedBooksObjects = useMemo(() => {
    const idSet = new Set(sectionForm.product_ids);
    const map = {};
    availableProducts.forEach((p) => {
      if (idSet.has(Number(p.id))) {
        map[p.id] = p;
      }
    });
    return sectionForm.product_ids.map((id) => map[id]).filter(Boolean);
  }, [sectionForm.product_ids, availableProducts]);

  // ================= BANNER HANDLERS =================
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddBanner = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      setMessage({ type: 'error', text: 'Please choose an image file for the banner.' });
      return;
    }

    setBannerSubmitting(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('title', bannerTitle.trim());
    formData.append('image', imageFile);

    try {
      const res = await api.post('/banners/admin', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setMessage({ type: 'success', text: 'Banner uploaded and published successfully!' });
        setBannerTitle('');
        setImageFile(null);
        setImagePreview(null);
        fetchBanners();
      } else {
        setMessage({ type: 'error', text: res.data.message || 'Failed to add banner.' });
      }
    } catch (err) {
      console.error('Add banner error:', err);
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Error uploading banner. Please check image format.',
      });
    } finally {
      setBannerSubmitting(false);
    }
  };

  const handleDeleteBanner = async (id) => {
    if (!window.confirm('Are you sure you want to delete this promotional banner?')) return;
    try {
      const res = await api.delete(`/banners/admin/${id}`);
      if (res.data.success) {
        setMessage({ type: 'success', text: 'Banner deleted successfully.' });
        fetchBanners();
      }
    } catch (err) {
      console.error('Delete banner error:', err);
      setMessage({ type: 'error', text: 'Failed to delete banner.' });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* ================= PAGE HEADER & TABS ================= */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Home Showcase & Banners
              </h1>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                Live Storefront
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Control dynamic book showcases, display positions (which section appears on top), and top promo slider banners.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                fetchSections();
                fetchBanners();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingSections || loadingBanners ? 'animate-spin text-red-600' : ''}`} />
              <span>Refresh</span>
            </button>

            {activeTab === 'sections' && (
              <button
                onClick={openCreateSectionModal}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-sm shadow-red-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Section</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
          <button
            onClick={() => setActiveTab('sections')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'sections'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Dynamic Book Sections</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                activeTab === 'sections' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {sections.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('banners')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'banners'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ImagePlus className="w-4 h-4" />
            <span>Top Slider Banners</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                activeTab === 'banners' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {banners.length}
            </span>
          </button>
        </div>
      </div>

      {/* Global Status Alert */}
      {message && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between animate-in fade-in ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-sm font-bold opacity-60 hover:opacity-100">
            ✕
          </button>
        </div>
      )}

      {/* ================= TAB 1: DYNAMIC HOME BOOK SECTIONS ================= */}
      {activeTab === 'sections' && (
        <div className="space-y-5">
          
          {/* ================= MASTER SHOWCASE TOGGLES ================= */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-red-600" />
                  <span>Homepage Auto-Showcase Toggles (Categories &amp; Publications)</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Turn on/off automatic sections for all Exam Categories and Leading Publishers directly on the Homepage!
                </p>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
                Live Storefront Control
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Toggle 1: Category-Wise Showcase */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  showcaseSettings.show_category_showcase
                    ? 'bg-gradient-to-br from-emerald-50/80 to-teal-50/50 border-emerald-200 shadow-xs'
                    : 'bg-slate-50 border-slate-200 opacity-80'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                        <Tag className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 text-sm">
                          Based on Categories Showcase
                        </h4>
                        <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                          40 Exam Categories with Books
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 font-medium pt-1">
                      Shows each category as a dedicated section on Home: Category Name as heading, and its books underneath!
                    </p>
                  </div>

                  {/* Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                    <input
                      type="checkbox"
                      checked={showcaseSettings.show_category_showcase}
                      onChange={() => handleToggleSetting('show_category_showcase', showcaseSettings.show_category_showcase)}
                      disabled={updatingSettings}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                <div className="mt-3 pt-3 border-t border-emerald-200/60 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-bold text-slate-500">
                    Status: <strong className={showcaseSettings.show_category_showcase ? 'text-emerald-700' : 'text-slate-500'}>
                      {showcaseSettings.show_category_showcase ? 'Active on Home (Showing)' : 'Hidden on Home'}
                    </strong>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 font-bold">Books / Row:</span>
                    <select
                      value={showcaseSettings.category_showcase_limit}
                      onChange={(e) => handleUpdateLimit('category_showcase_limit', e.target.value)}
                      className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 font-bold text-slate-800 cursor-pointer"
                    >
                      <option value="6">6 books</option>
                      <option value="8">8 books</option>
                      <option value="12">12 books</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Toggle 2: Publication-Wise Showcase */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  showcaseSettings.show_publication_showcase
                    ? 'bg-gradient-to-br from-blue-50/80 to-indigo-50/50 border-blue-200 shadow-xs'
                    : 'bg-slate-50 border-slate-200 opacity-80'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 text-sm">
                          Based on Publications Showcase
                        </h4>
                        <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-full">
                          91 Publishers with Books
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 font-medium pt-1">
                      Shows each publisher as a dedicated section on Home: Publisher Name as heading, and all its books underneath!
                    </p>
                  </div>

                  {/* Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                    <input
                      type="checkbox"
                      checked={showcaseSettings.show_publication_showcase}
                      onChange={() => handleToggleSetting('show_publication_showcase', showcaseSettings.show_publication_showcase)}
                      disabled={updatingSettings}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="mt-3 pt-3 border-t border-blue-200/60 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-bold text-slate-500">
                    Status: <strong className={showcaseSettings.show_publication_showcase ? 'text-blue-700' : 'text-slate-500'}>
                      {showcaseSettings.show_publication_showcase ? 'Active on Home (Showing)' : 'Hidden on Home'}
                    </strong>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 font-bold">Books / Row:</span>
                    <select
                      value={showcaseSettings.publication_showcase_limit}
                      onChange={(e) => handleUpdateLimit('publication_showcase_limit', e.target.value)}
                      className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 font-bold text-slate-800 cursor-pointer"
                    >
                      <option value="6">6 books</option>
                      <option value="8">8 books</option>
                      <option value="12">12 books</option>
                    </select>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="bg-amber-50/70 border border-amber-200/80 p-4 rounded-2xl text-xs text-amber-900 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Custom Homepage Sections Manager</p>
              <p className="text-amber-800/90 text-[11px] mt-0.5">
                Admin can give any custom name (e.g. <strong>New Arrivals</strong>, <strong>Featured Study Materials</strong>, <strong>Group 2 Specials</strong>), pick exactly which books appear inside, and decide which section appears on top using the <span className="font-bold">Move Up / Move Down</span> buttons or display order numbers!
              </p>
            </div>
          </div>

          {loadingSections ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/90">
              <div className="w-7 h-7 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-semibold mt-2">Loading home sections...</p>
            </div>
          ) : sections.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-slate-200/90 space-y-3">
              <Layers className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-sm">No Home Sections Created Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Create your first dynamic book section (like "New Arrivals") and select books to showcase on the homepage!
              </p>
              <button
                onClick={openCreateSectionModal}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Section Now</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {sections.map((sec, index) => {
                const bookCount = Array.isArray(sec.product_ids) ? sec.product_ids.length : 0;
                const isFirst = index === 0;
                const isLast = index === sections.length - 1;

                return (
                  <div
                    key={sec.id}
                    className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-slate-300 transition-all"
                  >
                    {/* Left: Position & Reorder Controls */}
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleMoveSection(index, 'up')}
                          disabled={isFirst}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 disabled:opacity-25 disabled:hover:bg-slate-100 disabled:hover:text-slate-600 transition-colors cursor-pointer"
                          title="Move Section Higher (Towards Top)"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded-md bg-slate-900 text-white">
                          #{sec.display_order ?? index + 1}
                        </span>
                        <button
                          onClick={() => handleMoveSection(index, 'down')}
                          disabled={isLast}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 disabled:opacity-25 disabled:hover:bg-slate-100 disabled:hover:text-slate-600 transition-colors cursor-pointer"
                          title="Move Section Lower"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Section Info */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-black text-slate-900 text-base">{sec.title}</h3>
                          {index === 0 && (
                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5 text-amber-600" /> Top Position
                            </span>
                          )}
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              sec.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {sec.is_active ? 'Active' : 'Hidden'}
                          </span>
                        </div>
                        {sec.subtitle && (
                          <p className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-1">
                            {sec.subtitle}
                          </p>
                        )}
                        <p className="text-[11px] font-bold text-slate-700 mt-1.5 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-red-600" />
                          <span>{bookCount} Books Included</span>
                        </p>

                        {/* Preview Thumbnails */}
                        {sec.previewProducts && sec.previewProducts.length > 0 && (
                          <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1 max-w-xl">
                            {sec.previewProducts.slice(0, 8).map((p) => (
                              <img
                                key={p.id}
                                src={getImageUrl(p.main_photo)}
                                alt={p.name}
                                title={`${p.name} (₹${p.total_price})`}
                                className="w-9 h-12 object-cover rounded-md border border-slate-200 bg-slate-50 shrink-0"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100';
                                }}
                              />
                            ))}
                            {sec.previewProducts.length > 8 && (
                              <div className="w-9 h-12 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500 shrink-0">
                                +{sec.previewProducts.length - 8}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      <button
                        onClick={() => openEditSectionModal(sec)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
                        title="Edit Section Details & Selected Books"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Section</span>
                      </button>

                      <button
                        onClick={() => handleDeleteSection(sec)}
                        className="p-2 rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
                        title="Delete Section"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: SLIDER BANNERS ================= */}
      {activeTab === 'banners' && (
        <div className="space-y-6">
          {/* Create Banner Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <ImagePlus className="w-5 h-5 text-red-600" />
              <h2 className="text-base font-bold text-slate-800">Upload New Promo Slider Banner</h2>
            </div>

            <form onSubmit={handleAddBanner} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Banner Title / Description (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sri Chaitanya 24/7 Helpline or Special Discount Offer"
                  value={bannerTitle}
                  onChange={(e) => setBannerTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 bg-slate-50 focus:bg-white transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Banner Image (Recommended aspect ratio 2.6:1, e.g. 1920x740) *
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer"
                  />
                  {imagePreview && (
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 w-36 h-16 bg-slate-50 shrink-0">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={bannerSubmitting}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-bold text-xs shadow-md shadow-red-500/20 disabled:opacity-50 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{bannerSubmitting ? 'Uploading Banner...' : 'Upload & Publish Banner'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Active Banners Grid */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-800">Published Banners ({banners.length})</h2>
              <span className="text-xs text-slate-400">Shown in rotation on the Homepage slider</span>
            </div>

            {loadingBanners ? (
              <div className="py-16 text-center text-slate-400 text-xs">Loading banners...</div>
            ) : banners.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-xs">
                No banners found. Upload your first promotional banner above!
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {banners.map((banner) => (
                  <div
                    key={banner.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-36 sm:w-48 h-16 sm:h-20 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                        <img
                          src={getImageUrl(banner.image)}
                          alt={banner.title || 'Banner'}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200';
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-slate-900 truncate">
                          {banner.title || 'Untitled Banner Slider'}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Uploaded on: {banner.created_at ? new Date(banner.created_at).toLocaleDateString() : 'N/A'}
                        </p>
                        <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                          Active on Homepage
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <a
                        href={getImageUrl(banner.image)}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="View Full Image"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleDeleteBanner(banner.id)}
                        className="p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Banner"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= CREATE / EDIT HOME SECTION MODAL ================= */}
      {sectionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto space-y-5 animate-in zoom-in-95 duration-200 font-sans">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                  {editingSection ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg">
                    {editingSection ? 'Edit Home Section' : 'Create New Dynamic Home Section'}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Configure section title, display priority position, and pick books from the catalog
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSectionModalOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSection} className="space-y-5 text-xs">
              
              {/* Row 1: Section Title & Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Section Title * (Shown as Heading on Homepage)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. New Arrivals, Best Sellers, Group 2 Special..."
                    value={sectionForm.title}
                    onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Subtitle / Tagline (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Freshly published editions for competitive exams..."
                    value={sectionForm.subtitle}
                    onChange={(e) => setSectionForm({ ...sectionForm, subtitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 font-medium text-slate-800"
                  />
                </div>
              </div>

              {/* Row 2: Priority Order & Active Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Display Position / Order (Top Priority) *
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={sectionForm.display_order}
                      onChange={(e) => setSectionForm({ ...sectionForm, display_order: e.target.value })}
                      className="w-24 px-3.5 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 font-black text-slate-900 text-sm"
                    />
                    <span className="text-[11px] text-slate-500 font-medium">
                      (Position <strong>1</strong> appears at the very top of the homepage)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-start gap-4 pt-1">
                  <div>
                    <label className="block font-bold text-slate-700 mb-0.5">
                      Show on Homepage
                    </label>
                    <p className="text-[11px] text-slate-400">
                      Enable or hide this section immediately
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sectionForm.is_active}
                      onChange={(e) => setSectionForm({ ...sectionForm, is_active: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </div>

              {/* ================= BOOK SELECTION SUITE ================= */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-red-600" />
                      <span>Select Books for this Section</span>
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Pick any books from the database. Click "+ Add to Section" or "✕" to adjust.
                    </p>
                  </div>
                  <span className="text-xs font-black px-2.5 py-1 rounded-full bg-red-100 text-red-800 border border-red-200">
                    {sectionForm.product_ids.length} Books Selected
                  </span>
                </div>

                {/* Selected Books Strip */}
                {selectedBooksObjects.length > 0 && (
                  <div className="bg-red-50/60 p-3 rounded-2xl border border-red-200/80 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-red-900">
                      <span>Currently Selected in Section ({selectedBooksObjects.length})</span>
                      <button
                        type="button"
                        onClick={() => setSectionForm({ ...sectionForm, product_ids: [] })}
                        className="text-red-600 hover:text-red-800 underline cursor-pointer"
                      >
                        Clear All
                      </button>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                      {selectedBooksObjects.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-xl border border-red-200 shadow-2xs shrink-0"
                        >
                          <img
                            src={getImageUrl(p.main_photo)}
                            alt={p.name}
                            className="w-7 h-9 object-cover rounded bg-slate-100"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100';
                            }}
                          />
                          <div className="max-w-[120px] min-w-0">
                            <p className="font-bold text-slate-900 text-[10px] truncate">{p.name || p.title}</p>
                            <p className="text-[9px] text-emerald-700 font-bold">₹{p.total_price || p.price}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSelectedBook(p.id)}
                            className="text-slate-400 hover:text-red-600 p-0.5 rounded cursor-pointer"
                            title="Remove from section"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Search & Category Filter for Book Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search books by title, ID, or publisher..."
                      value={bookSearch}
                      onChange={(e) => setBookSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
                    />
                  </div>

                  <select
                    value={bookCategoryFilter}
                    onChange={(e) => setBookCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 cursor-pointer font-semibold"
                  >
                    <option value="">All Categories ({categories.length})</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Available Books Scrollable List */}
                <div className="border border-slate-200 rounded-2xl max-h-72 overflow-y-auto divide-y divide-slate-100 bg-white">
                  {loadingProducts ? (
                    <div className="py-12 text-center text-slate-400 text-xs">Loading books catalog...</div>
                  ) : filteredAvailableBooks.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-xs">
                      No books found matching your search.
                    </div>
                  ) : (
                    filteredAvailableBooks.map((book) => {
                      const isSelected = sectionForm.product_ids.includes(Number(book.id));
                      const title = book.name || book.title || 'Untitled Book';

                      return (
                        <div
                          key={book.id}
                          className={`p-2.5 flex items-center justify-between gap-3 transition-colors ${
                            isSelected ? 'bg-red-50/40 hover:bg-red-50/70' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={getImageUrl(book.main_photo || book.image)}
                              alt={title}
                              className="w-9 h-12 object-cover rounded-lg border border-slate-200 bg-slate-50 shrink-0"
                              onError={(e) => {
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100';
                              }}
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 text-xs truncate max-w-md">{title}</p>
                              <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
                                <span className="font-mono bg-slate-100 px-1 rounded">#{book.id}</span>
                                {book.publication_name && (
                                  <span className="truncate max-w-[140px]">{book.publication_name}</span>
                                )}
                                <span className="font-bold text-emerald-700">₹{book.total_price || book.price}</span>
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleBookSelection(book.id)}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all shrink-0 cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                                : 'bg-slate-100 hover:bg-red-600 hover:text-white text-slate-700'
                            }`}
                          >
                            {isSelected ? '✓ Selected' : '+ Add'}
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSectionModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingSection}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-bold shadow-md shadow-red-500/20 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {savingSection ? 'Saving Section...' : editingSection ? 'Update Section' : 'Publish Section to Home'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
