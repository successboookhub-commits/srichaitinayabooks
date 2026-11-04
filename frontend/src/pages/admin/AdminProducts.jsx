import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Upload,
  CheckCircle2,
  AlertCircle,
  Feather,
  ChevronLeft,
  ChevronRight,
  Building2,
  Tag,
  DollarSign,
  Percent,
  Truck,
  Scale,
  Sparkles,
  Layers,
  Image as ImageIcon,
  Download,
  FileSpreadsheet,
  RotateCcw,
  Filter
} from 'lucide-react';
import api, { getImageUrl } from '../../services/api.js';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [publications, setPublications] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState('');
  const [selectedPublication, setSelectedPublication] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [stockStatusFilter, setStockStatusFilter] = useState('');
  const [isFeaturedFilter, setIsFeaturedFilter] = useState('');
  const [exporting, setExporting] = useState(false);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  // Complete 16-field Product Form State matching Database Table
  const [form, setForm] = useState({
    name: '',
    publication_id: '',
    category_ids: [],
    old_price: '',
    discount: '',
    total_price: '',
    quantity: 50,
    weight_type: 'weight', // 'weight' or 'weightless'
    weight: '0.50',
    shipping_charge: '35.00',
    description: '',
    is_featured: false,
    is_active: true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch Products with pagination & search
  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', 20);
      if (search && search.trim()) params.append('search', search.trim());
      if (selectedPublication) params.append('publication_id', selectedPublication);
      if (selectedCategory) params.append('category_id', selectedCategory);
      if (stockStatusFilter) params.append('stock_status', stockStatusFilter);
      if (isFeaturedFilter !== '') params.append('is_featured', isFeaturedFilter);

      let res;
      try {
        res = await api.get(`/products/admin/list?${params.toString()}`);
      } catch (e) {
        res = await api.get(`/products?${params.toString()}`);
      }

      const list = res.data.products || [];
      setProducts(list);
      setPagination({
        total: res.data.total ?? res.data.count ?? list.length,
        page: res.data.page ?? page,
        totalPages: res.data.totalPages ?? 1,
      });
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Categories for multi-select
  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.categories || res.data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // Fetch Publications for publisher dropdown
  const fetchPublications = async () => {
    try {
      const res = await api.get('/publications');
      setPublications(res.data.publications || []);
    } catch (err) {
      console.error('Error fetching publications:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchPublications();
  }, []);

  // Re-fetch on filter changes
  useEffect(() => {
    fetchProducts(1);
  }, [selectedPublication, selectedCategory, stockStatusFilter, isFeaturedFilter]);

  // Reset all filters in 1 click
  const handleResetFilters = () => {
    setSearch('');
    setSelectedPublication('');
    setSelectedCategory('');
    setStockStatusFilter('');
    setIsFeaturedFilter('');
  };

  // Check if any filter is active
  const hasActiveFilters = Boolean(
    search || selectedPublication || selectedCategory || stockStatusFilter || isFeaturedFilter !== ''
  );

  // Single Click Download Products Excel Sheet
  const handleExportProducts = async (exportAll = true) => {
    try {
      setExporting(true);
      const params = new URLSearchParams();
      if (!exportAll) {
        if (search && search.trim()) params.append('search', search.trim());
        if (selectedPublication) params.append('publication_id', selectedPublication);
        if (selectedCategory) params.append('category_id', selectedCategory);
        if (stockStatusFilter) params.append('stock_status', stockStatusFilter);
        if (isFeaturedFilter !== '') params.append('is_featured', isFeaturedFilter);
      }

      const res = await api.get(`/products/export?${params.toString()}`, {
        responseType: 'blob',
      });

      const nowStr = new Date().toISOString().split('T')[0];
      const tag = exportAll ? 'All_Catalog' : 'Filtered';
      const filename = `SriChaitanya_Book_Catalog_${tag}_${nowStr}.csv`;

      const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      setFeedback({ type: 'success', text: `Catalog Excel file "${filename}" downloaded successfully!` });
      setTimeout(() => setFeedback({ type: '', text: '' }), 4000);
    } catch (err) {
      console.error('Export products failed', err);
      alert(err.response?.data?.message || 'Failed to download Products Excel sheet.');
    } finally {
      setExporting(false);
    }
  };

  // Calculate Total Price automatically from MRP and Discount
  const handlePriceCalc = (mrpVal, discVal) => {
    const mrp = parseFloat(mrpVal) || 0;
    const disc = parseFloat(discVal) || 0;
    if (mrp > 0 && disc > 0) {
      const discounted = mrp - (mrp * disc) / 100;
      return discounted.toFixed(2);
    }
    return mrp > 0 ? mrp.toFixed(2) : '';
  };

  // Calculate Shipping Charge automatically from Weight and Weight Type
  const handleShippingCalc = (weightVal, weightTypeVal) => {
    if (weightTypeVal === 'weightless') {
      return '40.00';
    }
    const w = parseFloat(weightVal) || 0;
    return (w * 70).toFixed(2);
  };

  // Open Create Modal
  const openCreateModal = () => {
    setEditingProduct(null);
    setForm({
      name: '',
      publication_id: publications[0]?.id ? String(publications[0].id) : '',
      category_ids: categories[0]?.id ? [categories[0].id] : [],
      old_price: '',
      discount: '',
      total_price: '',
      quantity: 50,
      weight_type: 'weight',
      weight: '0.50',
      shipping_charge: '35.00',
      description: '',
      is_featured: false,
      is_active: true,
    });
    setImageFile(null);
    setImagePreview(null);
    setModalOpen(true);
  };

  // Open Edit Modal with pre-filled fields
  const openEditModal = (product) => {
    setEditingProduct(product);

    // Parse category IDs
    let catIds = [];
    if (Array.isArray(product.category_ids)) {
      catIds = product.category_ids.map(Number);
    } else if (typeof product.category_ids === 'string') {
      try {
        catIds = JSON.parse(product.category_ids).map(Number);
      } catch (e) {
        catIds = product.category_ids.split(/[\s,]+/).map(Number).filter(Boolean);
      }
    }
    if (product.category_id && !catIds.includes(Number(product.category_id))) {
      catIds.push(Number(product.category_id));
    }

    const isWeightless = Boolean(product.is_weightless);
    const weightVal = product.weight ? String(product.weight) : '0.50';

    setForm({
      name: product.name || product.title || '',
      publication_id: product.publication_id ? String(product.publication_id) : (publications[0]?.id ? String(publications[0].id) : ''),
      category_ids: catIds,
      old_price: product.old_price ? String(product.old_price) : '',
      discount: product.discount ? String(product.discount) : '',
      total_price: product.total_price ? String(product.total_price) : (product.price ? String(product.price) : ''),
      quantity: product.quantity !== undefined ? product.quantity : (product.stock || 50),
      weight_type: isWeightless ? 'weightless' : 'weight',
      weight: weightVal,
      shipping_charge: product.shipping_charge ? String(product.shipping_charge) : handleShippingCalc(weightVal, isWeightless ? 'weightless' : 'weight'),
      description: product.description || '',
      is_featured: Boolean(product.is_featured),
      is_active: product.is_active !== undefined ? Boolean(product.is_active) : true,
    });

    setImageFile(null);
    setImagePreview(product.main_photo ? getImageUrl(product.main_photo) : null);
    setModalOpen(true);
  };

  // Toggle category in multi-select array
  const toggleCategory = (catId) => {
    setForm((prev) => {
      const idNum = Number(catId);
      const exists = prev.category_ids.includes(idNum);
      const updated = exists
        ? prev.category_ids.filter((id) => id !== idNum)
        : [...prev.category_ids, idNum];
      return { ...prev, category_ids: updated };
    });
  };

  // Handle Form Save (Create or Update)
  const handleSave = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert('Please enter Book Name.');
      return;
    }
    if (!form.total_price || parseFloat(form.total_price) <= 0) {
      alert('Please enter a valid Selling Price.');
      return;
    }
    if (!form.publication_id) {
      alert('Please select a Publication.');
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name.trim());
      formData.append('title', form.name.trim());
      formData.append('publication_id', form.publication_id);
      formData.append('category_ids', JSON.stringify(form.category_ids));
      if (form.category_ids[0]) formData.append('category_id', form.category_ids[0]);
      
      formData.append('old_price', form.old_price || form.total_price);
      formData.append('discount', form.discount || '0');
      formData.append('total_price', form.total_price);
      formData.append('price', form.total_price);
      formData.append('quantity', form.quantity || 1);
      formData.append('stock', form.quantity || 1);

      formData.append('weight_type', form.weight_type);
      formData.append('is_weightless', form.weight_type === 'weightless' ? '1' : '0');
      formData.append('weight', form.weight_type === 'weightless' ? '0' : (form.weight || '0.50'));
      formData.append('shipping_charge', form.shipping_charge || '0');

      formData.append('description', form.description || '');
      formData.append('is_featured', form.is_featured ? '1' : '0');
      formData.append('is_active', form.is_active ? '1' : '0');

      if (imageFile) {
        formData.append('main_photo', imageFile);
        formData.append('image', imageFile);
      }

      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setFeedback({ type: 'success', text: `Book "${form.name}" updated successfully!` });
      } else {
        await api.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setFeedback({ type: 'success', text: `New book "${form.name}" created successfully!` });
      }

      setModalOpen(false);
      fetchProducts(pagination.page);
      setTimeout(() => setFeedback({ type: '', text: '' }), 4000);
    } catch (err) {
      console.error('Save product error:', err);
      alert(err.response?.data?.message || 'Failed to save book. Please verify all required fields.');
    } finally {
      setSaving(false);
    }
  };

  // Handle Delete Book
  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete book "${title}"?`)) return;
    try {
      await api.delete(`/products/${id}`);
      setFeedback({ type: 'success', text: `Book "${title}" has been deleted.` });
      setTimeout(() => setFeedback({ type: '', text: '' }), 3500);
      fetchProducts(pagination.page);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete book');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* ================= TOP HEADER STRIP ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Product Catalog
            </h1>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {pagination.total} Titles
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Manage Sri Chaitanya book titles, pricing, inventory stock, weights, and publishers
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          {/* Single-Click Full Catalog Download Excel Sheet Button */}
          <button
            onClick={() => handleExportProducts(true)}
            disabled={exporting}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-sm shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer disabled:opacity-60"
            title="Download Complete Catalog in Excel CSV format"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{exporting ? 'Exporting...' : 'Download Catalog (Excel)'}</span>
          </button>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-sm shadow-red-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Book</span>
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback.text && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{feedback.text}</span>
        </div>
      )}

      {/* ================= SEARCH & ADVANCED FILTERS PANEL ================= */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
        
        {/* Row 1: Search Input Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by book title, book ID (e.g. 439), publisher, or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchProducts(1)}
              className="w-full pl-9 pr-9 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-white transition-all font-medium text-slate-800"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setTimeout(() => fetchProducts(1), 0);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <button
              onClick={() => fetchProducts(1)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all active:scale-95 cursor-pointer shadow-xs"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-rose-200 transition-all cursor-pointer"
                title="Clear all filters & search"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Filter Selectors (Publications, Categories, Stock, Featured) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
          
          {/* Publication Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" /> All Publications
              </span>
              <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                {publications.length}
              </span>
            </label>
            <div className="relative">
              <select
                value={selectedPublication}
                onChange={(e) => setSelectedPublication(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-white transition-all cursor-pointer"
              >
                <option value="">All Publications ({publications.length} Publishers)</option>
                {publications.map((pub) => (
                  <option key={pub.id} value={pub.id}>
                    {pub.name} ({pub.product_count !== undefined ? pub.product_count : 0} books)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-slate-400" /> All Categories
              </span>
              <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                {categories.length}
              </span>
            </label>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-white transition-all cursor-pointer"
              >
                <option value="">All Categories ({categories.length} Categories)</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat.product_count !== undefined ? cat.product_count : 0} books)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Stock Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-slate-400" /> Stock Status
            </label>
            <select
              value={stockStatusFilter}
              onChange={(e) => setStockStatusFilter(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-white transition-all cursor-pointer"
            >
              <option value="">All Stock Status</option>
              <option value="in_stock">In Stock (&gt; 0)</option>
              <option value="out_of_stock">Out of Stock (0)</option>
            </select>
          </div>

          {/* Featured Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Featured Books
            </label>
            <select
              value={isFeaturedFilter}
              onChange={(e) => setIsFeaturedFilter(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-white transition-all cursor-pointer"
            >
              <option value="">All Books</option>
              <option value="1">Featured Only (★)</option>
              <option value="0">Standard Catalog Only</option>
            </select>
          </div>

        </div>

        {/* Row 3: Active Filter Summary Strip & Single-Click Export */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-600">
              Showing <span className="text-red-600 font-black">{pagination.total}</span> books
            </span>

            {/* Active Chips */}
            {search && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 font-semibold text-[11px] border border-slate-200">
                Search: "{search}"
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setTimeout(() => fetchProducts(1), 0);
                  }}
                  className="hover:text-red-600 cursor-pointer ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedPublication && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 text-red-700 font-semibold text-[11px] border border-red-200">
                Pub: {publications.find((p) => String(p.id) === String(selectedPublication))?.name || `#${selectedPublication}`}
                <button
                  type="button"
                  onClick={() => setSelectedPublication('')}
                  className="hover:text-red-900 cursor-pointer ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedCategory && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold text-[11px] border border-blue-200">
                Cat: {categories.find((c) => String(c.id) === String(selectedCategory))?.name || `#${selectedCategory}`}
                <button
                  type="button"
                  onClick={() => setSelectedCategory('')}
                  className="hover:text-blue-900 cursor-pointer ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {stockStatusFilter && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 font-semibold text-[11px] border border-amber-200">
                {stockStatusFilter === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                <button
                  type="button"
                  onClick={() => setStockStatusFilter('')}
                  className="hover:text-amber-900 cursor-pointer ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {isFeaturedFilter !== '' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 font-semibold text-[11px] border border-amber-200">
                {isFeaturedFilter === '1' ? 'Featured Only' : 'Standard Only'}
                <button
                  type="button"
                  onClick={() => setIsFeaturedFilter('')}
                  className="hover:text-amber-900 cursor-pointer ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          {/* Quick Export Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExportProducts(false)}
              disabled={exporting}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 transition-colors cursor-pointer disabled:opacity-50"
              title="Download currently filtered list to Excel/CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>{exporting ? 'Exporting...' : hasActiveFilters ? `Export Filtered (${pagination.total})` : 'Export Catalog'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* ================= PRODUCTS DIRECTORY TABLE ================= */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-extrabold border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Book Details</th>
                <th className="py-3.5 px-4">Publisher</th>
                <th className="py-3.5 px-4">Pricing</th>
                <th className="py-3.5 px-4">Inventory</th>
                <th className="py-3.5 px-4">Weight & Shipping</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center">
                    <div className="w-7 h-7 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs text-slate-400 font-semibold mt-2">Loading product catalog...</p>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center text-slate-400 space-y-2">
                    <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="font-bold text-slate-700 text-sm">No books found matching search</p>
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const title = p.name || p.title || 'Untitled Book';
                  const mrp = p.old_price ? parseFloat(p.old_price) : 0;
                  const price = p.total_price ? parseFloat(p.total_price) : (p.price ? parseFloat(p.price) : 0);
                  const discount = p.discount ? parseFloat(p.discount) : 0;
                  const stock = p.quantity !== undefined ? p.quantity : (p.stock || 0);
                  const img = getImageUrl(p.main_photo || p.image);

                  // Find publication name
                  const pub = publications.find((pb) => String(pb.id) === String(p.publication_id));

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Book Details */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={img}
                            alt={title}
                            className="w-11 h-14 object-cover rounded-xl border border-slate-200 bg-slate-50 shrink-0 shadow-2xs"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150';
                            }}
                          />
                          <div className="min-w-0 max-w-xs">
                            <p className="font-bold text-slate-900 line-clamp-2 leading-snug">{title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] bg-slate-100 text-slate-600 font-mono font-bold px-1.5 py-0.5 rounded">
                                #{p.id}
                              </span>
                              {p.is_featured ? (
                                <span className="inline-flex items-center gap-0.5 text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded font-bold">
                                  <Sparkles className="w-2.5 h-2.5" /> Featured
                                </span>
                              ) : null}
                            </div>

                            {/* Category Tags with 1-click filter */}
                            {p.category_ids && p.category_ids.length > 0 && (
                              <div className="flex flex-wrap items-center gap-1 mt-1.5">
                                {p.category_ids.slice(0, 2).map((cid) => {
                                  const cat = categories.find((c) => String(c.id) === String(cid));
                                  if (!cat) return null;
                                  return (
                                    <button
                                      key={cid}
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedCategory(String(cid));
                                      }}
                                      className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 border border-slate-200 transition-colors cursor-pointer"
                                      title={`Click to filter books by category: ${cat.name}`}
                                    >
                                      {cat.name}
                                    </button>
                                  );
                                })}
                                {p.category_ids.length > 2 && (
                                  <span className="text-[9px] font-bold text-slate-400">
                                    +{p.category_ids.length - 2}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Publisher with 1-click filter */}
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        {pub ? (
                          <button
                            type="button"
                            onClick={() => setSelectedPublication(String(pub.id))}
                            className="inline-flex items-center gap-1 text-slate-700 hover:text-red-600 font-bold group transition-colors cursor-pointer text-left"
                            title={`Click to filter books by ${pub.name}`}
                          >
                            <Building2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-500 shrink-0" />
                            <span className="truncate max-w-[140px] group-hover:underline">{pub.name}</span>
                          </button>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* Pricing */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <div className="font-black text-slate-900 text-sm">
                            ₹{price.toFixed(2)}
                          </div>
                          {mrp > price && (
                            <div className="flex items-center gap-1.5 text-[11px]">
                              <span className="text-slate-400 line-through">₹{mrp.toFixed(2)}</span>
                              {discount > 0 && (
                                <span className="text-emerald-600 font-bold">
                                  {discount}% off
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Stock */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`font-bold px-2.5 py-1 rounded-lg text-[11px] inline-block ${
                            stock > 20
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : stock > 0
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {stock > 0 ? `${stock} in stock` : 'Out of Stock'}
                        </span>
                      </td>

                      {/* Weight & Shipping */}
                      <td className="py-3.5 px-4 text-slate-600">
                        {p.is_weightless ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded-full">
                            <Feather className="w-3 h-3" /> Weight Less (₹{parseFloat(p.shipping_charge || 40).toFixed(0)})
                          </span>
                        ) : (
                          <div>
                            <span className="font-bold font-mono">{p.weight || '0.50'} KG</span>
                            <p className="text-[10px] text-slate-400 font-medium">
                              Ship: ₹{parseFloat(p.shipping_charge || 35).toFixed(2)}
                            </p>
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`font-bold text-[10px] uppercase px-2 py-0.5 rounded-full ${
                            p.is_active !== 0
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {p.is_active !== 0 ? 'Active' : 'Draft'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Book Details"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, title)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Book"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Page <strong className="text-slate-900">{pagination.page}</strong> of{' '}
            <strong className="text-slate-900">{pagination.totalPages}</strong> ({pagination.total} books)
          </div>
          <div className="flex items-center gap-1">
            <button
              disabled={pagination.page <= 1}
              onClick={() => fetchProducts(pagination.page - 1)}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => fetchProducts(pagination.page + 1)}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ================= COMPREHENSIVE 16-FIELD ADD / EDIT BOOK MODAL POPUP ================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto space-y-5 animate-in zoom-in-95 duration-200 font-sans">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                  {editingProduct ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg">
                    {editingProduct ? 'Edit Book Details' : 'Add New Book to Catalog'}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    {editingProduct ? `Book ID: #${editingProduct.id}` : 'Fill in complete publisher, pricing, weight & category details'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="space-y-5 text-xs">
              
              {/* SECTION 1: BASIC INFORMATION */}
              <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3.5">
                <h4 className="font-extrabold uppercase text-[11px] text-slate-500 tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-red-500" />
                  <span>1. Book Title & Publisher Details</span>
                </h4>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Book Title / Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-bold text-slate-900 text-xs"
                    placeholder="e.g. SP REDDY PUBLICATIONS AP HISTORY BIT BANK 2EDITION"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Publishing House / Brand <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={form.publication_id}
                      onChange={(e) => setForm({ ...form, publication_id: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-semibold text-slate-800 text-xs cursor-pointer"
                    >
                      <option value="">Select Publisher...</option>
                      {publications.map((pub) => (
                        <option key={pub.id} value={pub.id}>
                          {pub.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Inventory Stock Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={form.quantity}
                      onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-bold text-slate-900 text-xs"
                      placeholder="100"
                    />
                  </div>
                </div>

                {/* MULTI-SELECT CATEGORIES */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-slate-800">
                      Exam Categories <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      Click tags to select multiple categories
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 p-2.5 bg-white border border-slate-200 rounded-xl max-h-32 overflow-y-auto">
                    {categories.map((cat) => {
                      const isSelected = form.category_ids.includes(Number(cat.id));
                      return (
                        <button
                          type="button"
                          key={cat.id}
                          onClick={() => toggleCategory(cat.id)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-red-600 text-white shadow-2xs'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          {cat.name} {isSelected ? '✓' : ''}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* SECTION 2: PRICING & AUTO DISCOUNT CALCULATION */}
              <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3.5">
                <h4 className="font-extrabold uppercase text-[11px] text-slate-500 tracking-wider flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                  <span>2. Pricing & Discount Calculation</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      MRP / Original Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={form.old_price}
                      onChange={(e) => {
                        const val = e.target.value;
                        const autoPrice = handlePriceCalc(val, form.discount);
                        setForm({ ...form, old_price: val, total_price: autoPrice || val });
                      }}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-black text-slate-900 text-xs"
                      placeholder="799.00"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1 flex items-center justify-between">
                      <span>Discount (%)</span>
                      <span className="text-[10px] text-emerald-600 font-bold">Auto-Calculates</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={form.discount}
                      onChange={(e) => {
                        const val = e.target.value;
                        const autoPrice = handlePriceCalc(form.old_price, val);
                        setForm({ ...form, discount: val, total_price: autoPrice || form.old_price });
                      }}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-bold text-slate-900 text-xs"
                      placeholder="40"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Final Selling Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={form.total_price}
                      onChange={(e) => setForm({ ...form, total_price: e.target.value })}
                      className="w-full p-2.5 bg-emerald-50/60 border border-emerald-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-black text-emerald-900 text-xs"
                      placeholder="479.40"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: WEIGHT & SHIPPING CALCULATION */}
              <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3.5">
                <h4 className="font-extrabold uppercase text-[11px] text-slate-500 tracking-wider flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-blue-600" />
                  <span>3. Weight & Shipping Configuration</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Weight Type *</label>
                    <select
                      value={form.weight_type}
                      onChange={(e) => {
                        const wt = e.target.value;
                        const autoShip = handleShippingCalc(form.weight, wt);
                        setForm({ ...form, weight_type: wt, shipping_charge: autoShip });
                      }}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 text-xs cursor-pointer"
                    >
                      <option value="weight">By Weight (KG)</option>
                      <option value="weightless">Weight Less (Flat ₹40)</option>
                    </select>
                  </div>

                  {form.weight_type === 'weight' ? (
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Weight in KG *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={form.weight}
                        onChange={(e) => {
                          const w = e.target.value;
                          const autoShip = handleShippingCalc(w, 'weight');
                          setForm({ ...form, weight: w, shipping_charge: autoShip });
                        }}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 text-xs"
                        placeholder="1.20"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center text-xs text-slate-500 italic pt-6">
                      Exempted from weight postal slabs
                    </div>
                  )}

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Shipping Fee (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.shipping_charge}
                      onChange={(e) => setForm({ ...form, shipping_charge: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 text-xs"
                      placeholder="84.00"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: MEDIA & COVER PHOTO */}
              <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3.5">
                <h4 className="font-extrabold uppercase text-[11px] text-slate-500 tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-purple-600" />
                  <span>4. Cover Photo</span>
                </h4>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-16 h-20 object-cover rounded-xl border border-slate-300 shadow-2xs shrink-0"
                    />
                  )}
                  <div className="flex-1 w-full">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setImageFile(file);
                          setImagePreview(URL.createObjectURL(file));
                        }
                      }}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-600 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Recommended: JPG or PNG format, minimum 600x800px</p>
                  </div>
                </div>
              </div>

              {/* SECTION 5: DESCRIPTION & STORE VISIBILITY */}
              <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3.5">
                <h4 className="font-extrabold uppercase text-[11px] text-slate-500 tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>5. Description & Visibility</span>
                </h4>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Book Description / Syllabus Covered</label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-xs"
                    placeholder="Brief description about the book, edition, competitive exam relevance, author..."
                  />
                </div>

                <div className="flex flex-wrap items-center gap-5 pt-1">
                  <label className="inline-flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={form.is_featured}
                      onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                      className="rounded text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer"
                    />
                    <span>Show in Homepage Featured Books</span>
                  </label>

                  <label className="inline-flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                      className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                    />
                    <span>Publish Immediately (Active in Storefront)</span>
                  </label>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-bold rounded-xl text-xs shadow-md shadow-red-500/20 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {saving
                    ? 'Saving Book...'
                    : editingProduct
                    ? 'Update Book Details'
                    : 'Create Book & Publish'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
