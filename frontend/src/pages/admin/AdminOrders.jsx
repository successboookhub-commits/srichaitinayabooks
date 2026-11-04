import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckSquare,
  Square,
  AlertCircle,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  FileText,
  FileSpreadsheet,
  FileDown,
  Calendar,
  RotateCcw,
  X,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import api from '../../services/api';
import AdminOrderLabel from './AdminOrderLabel';

export default function AdminOrders() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [dateFrom, setDateFrom] = useState(searchParams.get('date_from') || '');
  const [dateTo, setDateTo] = useState(searchParams.get('date_to') || '');

  // Selection & Modals State
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState(null);
  const [labelsToPrint, setLabelsToPrint] = useState(null);
  const [bulkStatus, setBulkStatus] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Bulk By Date Range Modal State
  const [isDateRangeModalOpen, setIsDateRangeModalOpen] = useState(false);
  const [dateRangeStatus, setDateRangeStatus] = useState('Shipped');
  const [dateRangeSubmitting, setDateRangeSubmitting] = useState(false);

  // Excel Export State
  const [exporting, setExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv'); // 'csv' (universal) or 'xls' (styled XML)

  // Single-Click Download All Orders or Filtered Orders in Excel
  const handleExportExcel = async (exportAll = true, chosenFormat = exportFormat) => {
    try {
      setExporting(true);
      const params = new URLSearchParams();
      params.append('format', chosenFormat);

      if (!exportAll) {
        if (search && search.trim()) params.append('search', search.trim());
        if (statusFilter) params.append('status', statusFilter);
        if (dateFrom) params.append('date_from', dateFrom);
        if (dateTo) params.append('date_to', dateTo);
      }

      const res = await api.get(`/orders/export?${params.toString()}`, {
        responseType: 'blob',
      });

      const contentType = chosenFormat === 'xls' ? 'application/vnd.ms-excel' : 'text/csv;charset=utf-8;';
      const ext = chosenFormat === 'xls' ? 'xls' : 'csv';
      const nowStr = new Date().toISOString().split('T')[0];
      const tag = exportAll ? 'ALL_ORDERS' : (dateFrom ? `${dateFrom}_to_${dateTo || nowStr}` : 'FILTERED');
      const filename = `SriChaitanya_Orders_${tag}_${nowStr}.${ext}`;

      const blob = new Blob([res.data], { type: contentType });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      setMessage(`Excel sheet "${filename}" downloaded successfully!`);
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      console.error('Export failed', err);
      alert(err.response?.data?.message || 'Failed to download Excel sheet. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  // Fetch orders from API with all active filters
  const fetchOrders = async (page = 1) => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const scrollContainer = document.querySelector('[data-scroll-container="true"]');
    if (scrollContainer) scrollContainer.scrollTop = 0;
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', 20);
      if (search && search.trim()) params.append('search', search.trim());
      if (statusFilter) params.append('status', statusFilter);
      if (dateFrom) params.append('date_from', dateFrom);
      if (dateTo) params.append('date_to', dateTo);

      const res = await api.get(`/orders?${params.toString()}`);
      setOrders(res.data.orders || []);
      setPagination({
        total: res.data.total ?? res.data.pagination?.total ?? 0,
        page: res.data.page ?? res.data.pagination?.page ?? 1,
        totalPages: res.data.totalPages ?? res.data.pagination?.totalPages ?? 1,
      });
    } catch (err) {
      console.error('Failed to load orders', err);
      setError(err.response?.data?.message || 'Could not load orders from database.');
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch whenever filters change
  useEffect(() => {
    fetchOrders(1);
  }, [statusFilter, dateFrom, dateTo]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrders(1);
  };

  // Reset all filters in 1 click
  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('');
    setDateFrom('');
    setDateTo('');
    setSelectedIds([]);
  };

  // Quick Date Preset Chips Handler
  const handleQuickPreset = (preset) => {
    const today = new Date();
    const formatDate = (d) => d.toISOString().split('T')[0];

    if (preset === 'today') {
      const dStr = formatDate(today);
      setDateFrom(dStr);
      setDateTo(dStr);
    } else if (preset === 'yesterday') {
      const y = new Date();
      y.setDate(today.getDate() - 1);
      const dStr = formatDate(y);
      setDateFrom(dStr);
      setDateTo(dStr);
    } else if (preset === 'week') {
      const w = new Date();
      w.setDate(today.getDate() - 7);
      setDateFrom(formatDate(w));
      setDateTo(formatDate(today));
    } else if (preset === 'october') {
      setDateFrom('2026-10-01');
      setDateTo('2026-10-31');
    } else if (preset === 'november') {
      setDateFrom('2026-11-01');
      setDateTo('2026-11-30');
    } else if (preset === 'all') {
      setDateFrom('');
      setDateTo('');
    }
  };

  // Print Courier Labels for current Date Range
  const handlePrintDateRange = async () => {
    if (!dateFrom && !dateTo) {
      alert('Please select a From Date or To Date first to print date-range labels.');
      return;
    }
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (dateFrom) params.append('date_from', dateFrom);
      if (dateTo) params.append('date_to', dateTo);
      const res = await api.get(`/orders/labels?${params.toString()}`);
      if (res.data?.orders?.length) {
        setLabelsToPrint(res.data.orders);
      } else {
        alert('No orders found in this date range to print shipping labels.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to fetch shipping labels for date range');
    } finally {
      setLoading(false);
    }
  };

  // Single order status update
  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, order_status: newStatus } : o))
      );
      setMessage(`Order status updated to "${newStatus}"`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  // Bulk status update for selected orders
  const handleBulkStatusUpdate = async () => {
    if (!bulkStatus || selectedIds.length === 0) return;
    try {
      await api.post('/orders/bulk-status', {
        order_ids: selectedIds,
        status: bulkStatus
      });
      setMessage(`Successfully updated ${selectedIds.length} orders to "${bulkStatus}"`);
      setTimeout(() => setMessage(''), 3000);
      setSelectedIds([]);
      setBulkStatus('');
      fetchOrders(pagination.page);
    } catch (err) {
      alert(err.response?.data?.message || 'Bulk update failed');
    }
  };

  // Bulk status update by Date Range
  const handleBulkDateRangeSubmit = async (e) => {
    e.preventDefault();
    if (!dateFrom || !dateTo || !dateRangeStatus) {
      alert('Please select both From Date and To Date to apply status update.');
      return;
    }
    setDateRangeSubmitting(true);
    try {
      const res = await api.post('/orders/bulk-status-by-date', {
        date_from: dateFrom,
        date_to: dateTo,
        order_status: dateRangeStatus,
      });
      if (res.data.success) {
        setMessage(res.data.message || 'Orders in date range updated successfully.');
        setTimeout(() => setMessage(''), 4000);
        setIsDateRangeModalOpen(false);
        fetchOrders(1);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update orders by date range.');
    } finally {
      setDateRangeSubmitting(false);
    }
  };

  const handlePrintSingle = async (order) => {
    try {
      const res = await api.get(`/orders/${order.id}`);
      const data = res.data?.order ? { ...res.data.order, items: res.data.items || [] } : res.data;
      setLabelsToPrint([data]);
    } catch (err) {
      setLabelsToPrint([order]);
    }
  };

  const handlePrintBulk = async () => {
    if (selectedIds.length === 0) return;
    try {
      const selectedOrders = orders.filter((o) => selectedIds.includes(o.id));
      setLabelsToPrint(selectedOrders);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === orders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(orders.map((o) => o.id));
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const viewOrderDetails = async (orderId) => {
    try {
      const res = await api.get(`/orders/${orderId}`);
      const data = res.data?.order ? { ...res.data.order, items: res.data.items || [] } : res.data;
      setSelectedOrderForDetails(data);
    } catch (err) {
      alert('Failed to load full order details');
    }
  };

  const statuses = ['Ordered', 'Processing', 'Packing', 'Shipped', 'Delivered', 'Cancelled'];
  const hasActiveFilters = Boolean(search || statusFilter || dateFrom || dateTo);

  return (
    <div className="space-y-5 max-w-7xl mx-auto font-sans">
      
      {/* ================= TOP HEADER STRIP WITH 1-CLICK EXCEL EXPORT ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Orders Management
            </h1>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              Live DB
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Total <strong className="text-slate-900 font-bold">{pagination.total}</strong> orders recorded in database
          </p>
        </div>

        {/* Message notification */}
        {message && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold px-4 py-2.5 rounded-2xl flex items-center gap-3">
            <span>{error}</span>
            <button
              onClick={() => fetchOrders(pagination.page)}
              className="underline hover:text-rose-900 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* ================= 1-CLICK EXCEL DOWNLOAD ACTION BUTTONS ================= */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Format selector (.CSV vs .XLS) */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-[11px] font-bold text-slate-600">
            <button
              type="button"
              onClick={() => setExportFormat('csv')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                exportFormat === 'csv' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'hover:text-slate-900'
              }`}
              title="Universal CSV formatted specifically for Microsoft Excel"
            >
              .CSV
            </button>
            <button
              type="button"
              onClick={() => setExportFormat('xls')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                exportFormat === 'xls' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'hover:text-slate-900'
              }`}
              title="Microsoft Excel XML Spreadsheet (.xls) with custom styling"
            >
              .XLS
            </button>
          </div>

          {/* Primary Action: Download All Orders */}
          <button
            type="button"
            onClick={() => handleExportExcel(true)}
            disabled={exporting}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 hover:from-emerald-700 hover:to-teal-900 text-white font-bold text-xs shadow-md shadow-emerald-700/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            title="Download all 1,415 orders from the entire database into an Excel Sheet in 1 click"
          >
            <FileSpreadsheet className={`w-4 h-4 text-emerald-200 ${exporting ? 'animate-bounce' : ''}`} />
            <span>{exporting ? 'Generating Excel...' : 'Download All Orders (Excel)'}</span>
            <Download className="w-3.5 h-3.5 text-white/80" />
          </button>

          {/* Contextual Action: Download Filtered Orders (Visible if any filter is active) */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => handleExportExcel(false)}
              disabled={exporting}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-2xl bg-white border border-emerald-400 hover:bg-emerald-50 text-emerald-800 font-bold text-xs shadow-2xs active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              title="Download only orders matching your current search/date/status filter"
            >
              <FileDown className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export Filtered ({pagination.total})</span>
            </button>
          )}

        </div>
      </div>

      {/* ================= COMPREHENSIVE FILTER, DATE RANGE & SEARCH MASTER PANEL ================= */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
        
        {/* ROW 1: Search + Date Pickers + Status Dropdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
          
          {/* 1. Keyword Search (Cols 4) */}
          <div className="lg:col-span-4 space-y-1">
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Search Orders
            </label>
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Order ID, Customer, Phone, City..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-white transition-all font-medium text-slate-800"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    fetchOrders(1);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>
          </div>

          {/* 2. From Date Picker (Cols 2.5) */}
          <div className="lg:col-span-2 space-y-1">
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-red-500" />
              <span>From Date</span>
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-white transition-all font-medium text-slate-800 cursor-pointer"
            />
          </div>

          {/* 3. To Date Picker (Cols 2.5) */}
          <div className="lg:col-span-2 space-y-1">
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-red-500" />
              <span>To Date</span>
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-white transition-all font-medium text-slate-800 cursor-pointer"
            />
          </div>

          {/* 4. Status Filter Dropdown (Cols 2.5) */}
          <div className="lg:col-span-2 space-y-1">
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Filter className="w-3 h-3 text-red-500" />
              <span>Order Status</span>
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 cursor-pointer"
            >
              <option value="">All Statuses</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* 5. Filter & Reset Buttons (Cols 1.5) */}
          <div className="lg:col-span-2 flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleSearchSubmit}
              className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer text-center"
            >
              Filter
            </button>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 hover:border-red-200 text-xs font-bold transition-all cursor-pointer"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>

        {/* ROW 2: Quick Date Presets & Bulk by Date Range Button */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          
          {/* Quick Date Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider mr-1">
              Quick Dates:
            </span>
            <button
              type="button"
              onClick={() => handleQuickPreset('today')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors cursor-pointer"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('yesterday')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors cursor-pointer"
            >
              Yesterday
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('week')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors cursor-pointer"
            >
              Last 7 Days
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('october')}
              className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-bold text-[11px] transition-colors cursor-pointer border border-red-200/60"
            >
              October 2026
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('november')}
              className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] transition-colors cursor-pointer border border-emerald-200/60"
            >
              November 2026
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('all')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors cursor-pointer"
            >
              All Time
            </button>
          </div>

          {/* Date Range Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handlePrintDateRange}
              disabled={!dateFrom && !dateTo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white text-[11px] font-bold shadow-2xs transition-colors cursor-pointer shrink-0"
              title={dateFrom || dateTo ? "Print courier labels for this date range" : "Select date range first"}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Labels for Range</span>
            </button>

            <button
              type="button"
              onClick={() => handleExportExcel(false)}
              disabled={exporting || (!dateFrom && !dateTo && !statusFilter && !search)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 disabled:opacity-40 disabled:hover:bg-emerald-50 text-emerald-800 border border-emerald-300 text-[11px] font-bold shadow-2xs transition-colors cursor-pointer shrink-0"
              title="Download Excel sheet for selected date range"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export Range to Excel</span>
            </button>

            <button
              type="button"
              onClick={() => setIsDateRangeModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-[11px] font-bold shadow-2xs transition-colors cursor-pointer shrink-0"
            >
              <Layers className="w-3.5 h-3.5 text-red-400" />
              <span>Update Status by Date Range...</span>
            </button>
          </div>

        </div>

        {/* ROW 3: Active Filters Summary Chips */}
        {hasActiveFilters && (
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs animate-in fade-in">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Filters:</span>
            
            {search && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 font-bold text-[11px]">
                <span>Search: "{search}"</span>
                <button onClick={() => setSearch('')} className="hover:text-red-900 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {statusFilter && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200 font-bold text-[11px]">
                <span>Status: {statusFilter}</span>
                <button onClick={() => setStatusFilter('')} className="hover:text-red-600 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {dateFrom && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200 font-bold text-[11px]">
                <span>From: {dateFrom}</span>
                <button onClick={() => setDateFrom('')} className="hover:text-red-600 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {dateTo && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200 font-bold text-[11px]">
                <span>To: {dateTo}</span>
                <button onClick={() => setDateTo('')} className="hover:text-red-600 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={handleResetFilters}
              className="text-[11px] font-bold text-red-600 hover:underline ml-2 cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}

      </div>

      {/* ================= BULK ACTION BAR (Visible when orders checked) ================= */}
      {selectedIds.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-600 text-white font-bold text-xs px-2.5 py-1 rounded-lg">
              {selectedIds.length} Selected
            </span>
            <span className="text-xs font-semibold text-emerald-900">
              Apply bulk operations to selected orders:
            </span>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value)}
              className="text-xs bg-white border border-emerald-300 rounded-xl px-3 py-1.5 font-semibold text-slate-800 focus:outline-none"
            >
              <option value="">Choose new status...</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  Set to {s}
                </option>
              ))}
            </select>
            <button
              onClick={handleBulkStatusUpdate}
              disabled={!bulkStatus}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl disabled:opacity-50 transition-colors cursor-pointer"
            >
              Update Status
            </button>
            <button
              onClick={handlePrintBulk}
              className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Bulk Print Labels</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= ORDERS DIRECTORY TABLE ================= */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-extrabold border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4 w-10 text-center">
                  <button onClick={toggleSelectAll} className="text-slate-400 hover:text-red-600 cursor-pointer">
                    {selectedIds.length === orders.length && orders.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-red-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-3.5 px-4">Order Code</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Phone</th>
                <th className="py-3.5 px-4">City / Mandal</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center">
                    <div className="w-7 h-7 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs text-slate-400 font-semibold mt-2">Loading orders...</p>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-400 space-y-2">
                    <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="font-bold text-slate-700 text-sm">No orders found matching filters</p>
                    <p className="text-xs text-slate-400">Try adjusting the search query, date range, or status filter.</p>
                    {hasActiveFilters && (
                      <button
                        onClick={handleResetFilters}
                        className="px-4 py-1.5 rounded-xl bg-red-50 text-red-600 font-bold text-xs mt-2 hover:bg-red-100 cursor-pointer"
                      >
                        Reset All Filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                orders.map((o) => {
                  const isChecked = selectedIds.includes(o.id);
                  const isUpdating = updatingId === o.id;

                  return (
                    <tr
                      key={o.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isChecked ? 'bg-red-50/30' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => toggleSelect(o.id)}
                          className="text-slate-400 hover:text-red-600 cursor-pointer"
                        >
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-red-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Order Code */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {o.order_code}
                      </td>

                      {/* Customer Name */}
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {o.customer_name}
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {o.customer_phone}
                      </td>

                      {/* City / Mandal */}
                      <td className="py-3.5 px-4 text-slate-600">
                        {o.district ? (
                          <span>
                            {o.district}
                            {o.state ? `, ${o.state}` : ''}
                          </span>
                        ) : o.mandal ? (
                          o.mandal
                        ) : (
                          '-'
                        )}
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 font-black text-slate-900">
                        ₹{parseFloat(o.total || 0).toFixed(2)}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        {o.created_at
                          ? new Date(o.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '-'}
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-4">
                        <div className="relative inline-block">
                          <select
                            disabled={isUpdating}
                            value={o.order_status || 'Ordered'}
                            onChange={(e) => handleStatusChange(o.id, e.target.value)}
                            className={`text-xs font-bold rounded-lg px-2.5 py-1 border transition-colors cursor-pointer ${
                              (o.order_status || 'Ordered') === 'Delivered'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : (o.order_status || 'Ordered') === 'Shipped'
                                ? 'bg-blue-50 text-blue-800 border-blue-300'
                                : (o.order_status || 'Ordered') === 'Processing' || (o.order_status || 'Ordered') === 'Packing'
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : (o.order_status || 'Ordered') === 'Cancelled'
                                ? 'bg-rose-50 text-rose-800 border-rose-300'
                                : 'bg-slate-100 text-slate-800 border-slate-300'
                            }`}
                          >
                            {statuses.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => viewOrderDetails(o.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="View Full Order Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handlePrintSingle(o)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Print Courier Shipping Label"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <a
                            href={typeof api.getInvoiceUrl === 'function' ? api.getInvoiceUrl(o.order_code) : `#`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 transition-colors"
                            title="Download Tax Invoice PDF"
                          >
                            <FileText className="w-4 h-4" />
                          </a>
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
            <strong className="text-slate-900">{pagination.totalPages || 1}</strong> ({pagination.total} total orders)
          </div>
          <div className="flex items-center gap-1">
            <button
              disabled={pagination.page <= 1}
              onClick={() => fetchOrders(pagination.page - 1)}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => fetchOrders(pagination.page + 1)}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ================= MODAL 1: BULK UPDATE STATUS BY DATE RANGE ================= */}
      {isDateRangeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Bulk Status by Date Range</h3>
                  <p className="text-xs text-slate-400">Update all orders between dates in one operation</p>
                </div>
              </div>
              <button
                onClick={() => setIsDateRangeModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBulkDateRangeSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  required
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  required
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                  Set New Status To
                </label>
                <select
                  value={dateRangeStatus}
                  onChange={(e) => setDateRangeStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-xs"
                >
                  {statuses.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDateRangeModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={dateRangeSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 text-white font-bold shadow-md shadow-red-500/20 disabled:opacity-50"
                >
                  {dateRangeSubmitting ? 'Updating...' : 'Apply Status Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: LABEL PRINT MODAL ================= */}
      {labelsToPrint && (
        <AdminOrderLabel orders={labelsToPrint} onClose={() => setLabelsToPrint(null)} />
      )}

      {/* ================= MODAL 3: ORDER DETAILS MODAL ================= */}
      {selectedOrderForDetails && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">Order Information</h3>
                <p className="text-xs font-mono font-bold text-red-600">
                  #{selectedOrderForDetails.order_code}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrderForDetails(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
                <p className="font-bold text-slate-800">
                  Customer: {selectedOrderForDetails.customer_name} ({selectedOrderForDetails.customer_phone})
                </p>
                {selectedOrderForDetails.door_no && (
                  <p className="text-slate-600 font-semibold">Door / Flat No: {selectedOrderForDetails.door_no}</p>
                )}
                <p className="text-slate-600">Address: {selectedOrderForDetails.address}</p>
                <p className="text-slate-600">
                  {selectedOrderForDetails.mandal ? `Mandal: ${selectedOrderForDetails.mandal}, ` : ''}
                  District: {selectedOrderForDetails.district}, State: {selectedOrderForDetails.state} - {selectedOrderForDetails.pincode}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-2">
                  Items Purchased:
                </h4>
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                  {selectedOrderForDetails.items?.map((it, idx) => (
                    <div key={idx} className="p-3 flex justify-between items-center bg-slate-50/50">
                      <div>
                        <p className="font-bold text-slate-800">{it.book_title || it.name}</p>
                        <p className="text-[11px] text-slate-500 font-mono">
                          Qty: {it.quantity} &times; ₹{it.price}
                        </p>
                      </div>
                      <span className="font-bold text-slate-900">₹{(it.quantity * it.price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>₹{selectedOrderForDetails.subtotal || selectedOrderForDetails.total_amount}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping Fee</span>
                  <span>₹{selectedOrderForDetails.shipping || selectedOrderForDetails.shipping_fee || 0}</span>
                </div>
                <div className="flex justify-between font-black text-sm text-slate-900 pt-1.5 border-t border-slate-200">
                  <span>Total Amount</span>
                  <span className="text-red-600">₹{selectedOrderForDetails.total_amount}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-2 flex gap-2">
              <button
                onClick={() => {
                  handlePrintSingle(selectedOrderForDetails);
                  setSelectedOrderForDetails(null);
                }}
                className="flex-1 bg-slate-900 hover:bg-black text-white font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-red-400" />
                <span>Print Courier Label</span>
              </button>
              <button
                onClick={() => setSelectedOrderForDetails(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
