import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Package,
  Calendar,
  Search,
  Download,
  RotateCcw,
  BookOpen,
  ArrowUpRight,
  Percent,
  CheckCircle2,
  Clock,
  Sparkles,
  FileSpreadsheet,
  AlertCircle,
  Edit3,
  X,
  Save
} from 'lucide-react';
import api, { getImageUrl } from '../../services/api';

// Safe number formatters to guarantee zero crashes on undefined/null
const formatCurrency = (val) => {
  const num = parseFloat(val);
  if (isNaN(num)) return '0.00';
  return num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatNumber = (val) => {
  const num = parseInt(val, 10);
  if (isNaN(num)) return '0';
  return num.toLocaleString('en-IN');
};

export default function AdminProfits() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    total_revenue: 0,
    total_purchase_cost: 0,
    net_profit: 0,
    overall_margin: 0,
    total_units_sold: 0,
    unique_books_sold: 0,
  });
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);

  // Filters
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [activeTab, setActiveTab] = useState('books'); // 'books' | 'orders'
  const [exporting, setExporting] = useState(false);

  // Quick Inline Purchase Cost Editor Modal
  const [editingBookCost, setEditingBookCost] = useState(null); // { id, title, cost }
  const [editCostVal, setEditCostVal] = useState('');
  const [costSaving, setCostSaving] = useState(false);
  const [notice, setNotice] = useState('');

  // Fetch or calculate profit analytics
  const fetchProfits = async () => {
    setLoading(true);
    let successBackend = false;

    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (dateFrom) params.append('date_from', dateFrom);
      if (dateTo) params.append('date_to', dateTo);

      // Attempt to fetch from dedicated backend endpoint if available
      const res = await api.get(`/admin/profits?${params.toString()}`);
      if (
        res.data?.success &&
        res.data?.summary &&
        typeof res.data.summary.total_revenue !== 'undefined'
      ) {
        setSummary({
          total_revenue: parseFloat(res.data.summary.total_revenue) || 0,
          total_purchase_cost: parseFloat(res.data.summary.total_purchase_cost) || 0,
          net_profit: parseFloat(res.data.summary.net_profit) || 0,
          overall_margin: parseFloat(res.data.summary.overall_margin) || 0,
          total_units_sold: parseInt(res.data.summary.total_units_sold, 10) || 0,
          unique_books_sold: parseInt(res.data.summary.unique_books_sold, 10) || 0,
        });
        setBooks(res.data.books || []);
        setOrders(res.data.orders || []);
        successBackend = true;
      }
    } catch (err) {
      console.warn('Backend /admin/profits not responding with structured data, falling back to smart client aggregation:', err);
    }

    // Smart Client-Side Aggregation Fallback (works with live Hostinger API anytime)
    if (!successBackend) {
      try {
        // 1. Load local cost overrides from localStorage
        const localCosts = JSON.parse(localStorage.getItem('srichaitanya_purchase_amounts') || '{}');

        // 2. Fetch products catalog to get purchase prices & thumbnails
        let productMap = {};
        try {
          const pRes = await api.get('/products?limit=500');
          const pList = pRes.data?.products || [];
          pList.forEach((p) => {
            const cost =
              localCosts[p.id] !== undefined
                ? parseFloat(localCosts[p.id])
                : (parseFloat(p.purchase_amount) || parseFloat(p.purchase_price) || 0);

            productMap[p.id] = {
              id: p.id,
              title: p.title || p.name || `Book #${p.id}`,
              image: p.image || p.main_photo || '',
              selling_price: parseFloat(p.price || p.total_price || 0),
              purchase_amount: cost,
            };
          });
        } catch (e) {
          console.warn('Could not load products map for profits', e);
        }

        // 3. Fetch Orders (up to 100 recent orders)
        const oRes = await api.get('/orders?limit=100');
        const rawOrders = oRes.data?.orders || [];

        // Exclude cancelled / canceled / failed orders
        let filteredOrders = rawOrders.filter((o) => {
          const st = (o.order_status || o.status || '').toLowerCase();
          return st !== 'cancelled' && st !== 'canceled' && st !== 'failed';
        });

        // Apply Date Filters
        if (dateFrom) {
          const fromTime = new Date(`${dateFrom}T00:00:00`).getTime();
          filteredOrders = filteredOrders.filter((o) => {
            const t = new Date(o.created_at).getTime();
            return !isNaN(t) && t >= fromTime;
          });
        }
        if (dateTo) {
          const toTime = new Date(`${dateTo}T23:59:59`).getTime();
          filteredOrders = filteredOrders.filter((o) => {
            const t = new Date(o.created_at).getTime();
            return !isNaN(t) && t <= toTime;
          });
        }

        // Aggregate Book Sales & Order Profits
        const bookMap = {};
        const parsedOrders = [];

        let totalRev = 0;
        let totalCost = 0;
        let totalUnits = 0;

        filteredOrders.forEach((o) => {
          const items = Array.isArray(o.items) ? o.items : [];
          let orderCost = 0;
          let orderRev = 0;

          items.forEach((item) => {
            const pId = item.product_id;
            const pInfo = productMap[pId] || {};
            const title = item.product_name || pInfo.title || `Book #${pId}`;
            const image = item.product_image || pInfo.image || '';
            const qty = parseInt(item.qty || 1, 10);
            const unitSelling = parseFloat(item.price || pInfo.selling_price || 0);
            const unitCost =
              localCosts[pId] !== undefined
                ? parseFloat(localCosts[pId])
                : (parseFloat(pInfo.purchase_amount) || 0);

            const itemRev = unitSelling * qty;
            const itemCost = unitCost * qty;

            orderRev += itemRev;
            orderCost += itemCost;
            totalRev += itemRev;
            totalCost += itemCost;
            totalUnits += qty;

            if (!bookMap[pId]) {
              bookMap[pId] = {
                product_id: pId,
                title: title,
                image: image,
                purchase_amount: unitCost,
                total_selling: 0,
                units_sold: 0,
                orders_count: 0,
                total_purchase_cost: 0,
                total_revenue: 0,
                net_profit: 0,
                profit_margin: 0,
              };
            }

            bookMap[pId].units_sold += qty;
            bookMap[pId].total_revenue += itemRev;
            bookMap[pId].total_purchase_cost += itemCost;
            bookMap[pId].orders_count += 1;
            bookMap[pId].purchase_amount = unitCost;
          });

          const orderNetProfit = orderRev - orderCost;
          parsedOrders.push({
            id: o.id,
            order_code: o.order_code || `ORD-${o.id}`,
            customer_name: o.customer_name || 'Customer',
            customer_phone: o.customer_phone || '-',
            order_status: o.order_status || o.status || 'Ordered',
            created_at: o.created_at,
            items_count: items.reduce((s, it) => s + (parseInt(it.qty, 10) || 1), 0),
            order_purchase_cost: orderCost,
            total: o.total ? parseFloat(o.total) : orderRev,
            order_net_profit: orderNetProfit,
          });
        });

        // Compile Book List & Margin calculations
        let compiledBooks = Object.values(bookMap).map((b) => {
          const avgSelling = b.units_sold > 0 ? b.total_revenue / b.units_sold : 0;
          const unitProfit = avgSelling - b.purchase_amount;
          const netProfit = b.total_revenue - b.total_purchase_cost;
          const margin = b.total_revenue > 0 ? (netProfit / b.total_revenue) * 100 : 0;

          return {
            ...b,
            avg_selling_price: avgSelling,
            unit_profit: unitProfit,
            net_profit: netProfit,
            profit_margin: parseFloat(margin.toFixed(1)),
          };
        });

        // Apply title search
        if (search.trim()) {
          const q = search.trim().toLowerCase();
          compiledBooks = compiledBooks.filter((b) =>
            (b.title || '').toLowerCase().includes(q)
          );
        }

        // Sort books by highest net profit first
        compiledBooks.sort((a, b) => b.net_profit - a.net_profit);

        const netProfit = totalRev - totalCost;
        const overallMargin = totalRev > 0 ? (netProfit / totalRev) * 100 : 0;

        setSummary({
          total_revenue: totalRev,
          total_purchase_cost: totalCost,
          net_profit: netProfit,
          overall_margin: parseFloat(overallMargin.toFixed(1)),
          total_units_sold: totalUnits,
          unique_books_sold: compiledBooks.length,
        });

        setBooks(compiledBooks);
        setOrders(parsedOrders);
      } catch (clientErr) {
        console.error('Client-side aggregation error:', clientErr);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProfits();
  }, [dateFrom, dateTo]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProfits();
  };

  const handleQuickPreset = (preset) => {
    const today = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const toYMD = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    if (preset === 'today') {
      const d = toYMD(today);
      setDateFrom(d);
      setDateTo(d);
    } else if (preset === 'yesterday') {
      const y = new Date(today);
      y.setDate(y.getDate() - 1);
      const d = toYMD(y);
      setDateFrom(d);
      setDateTo(d);
    } else if (preset === 'week') {
      const w = new Date(today);
      w.setDate(w.getDate() - 7);
      setDateFrom(toYMD(w));
      setDateTo(toYMD(today));
    } else if (preset === 'month') {
      const m = new Date(today.getFullYear(), today.getMonth(), 1);
      setDateFrom(toYMD(m));
      setDateTo(toYMD(today));
    } else if (preset === 'all') {
      setDateFrom('');
      setDateTo('');
    }
  };

  // Open Quick Purchase Cost Editor
  const openEditCost = (book) => {
    setEditingBookCost(book);
    setEditCostVal(book.purchase_amount ? String(book.purchase_amount) : '');
  };

  // Save Quick Purchase Cost
  const handleSaveCost = async (e) => {
    e.preventDefault();
    if (!editingBookCost) return;

    const newCost = parseFloat(editCostVal) || 0;
    setCostSaving(true);
    try {
      // 1. Save to local storage cache for instant persistence
      const localCosts = JSON.parse(localStorage.getItem('srichaitanya_purchase_amounts') || '{}');
      localCosts[editingBookCost.product_id] = newCost;
      localStorage.setItem('srichaitanya_purchase_amounts', JSON.stringify(localCosts));

      // 2. Also try sending update to backend product API
      try {
        const formData = new FormData();
        formData.append('purchase_amount', String(newCost));
        formData.append('purchase_price', String(newCost));
        await api.put(`/products/${editingBookCost.product_id}`, formData);
      } catch (apiErr) {
        console.warn('Backend product cost update notice:', apiErr);
      }

      setNotice(`Updated purchase cost for "${editingBookCost.title}" to ₹${newCost.toFixed(2)}`);
      setTimeout(() => setNotice(''), 4000);
      setEditingBookCost(null);

      // Recalculate profits with new cost immediately
      fetchProfits();
    } catch (err) {
      console.error(err);
      alert('Failed to update cost price.');
    } finally {
      setCostSaving(false);
    }
  };

  // Export Profits to CSV
  const handleExportCSV = () => {
    setExporting(true);
    try {
      const rows = [
        ['Sri Chaitanya Books - Profit & Loss Statement'],
        ['Generated At', new Date().toLocaleString()],
        ['Date Range', `${dateFrom || 'All Time'} to ${dateTo || 'Present'}`],
        [],
        ['SUMMARY METRICS'],
        ['Total Revenue (₹)', summary?.total_revenue || 0],
        ['Total Purchase Cost (₹)', summary?.total_purchase_cost || 0],
        ['Net Profit (₹)', summary?.net_profit || 0],
        ['Overall Margin (%)', `${summary?.overall_margin || 0}%`],
        ['Total Units Sold', summary?.total_units_sold || 0],
        ['Unique Books Sold', summary?.unique_books_sold || 0],
        [],
        ['BOOK-WISE PROFIT BREAKDOWN'],
        ['Book ID', 'Book Title', 'Purchase Cost/Unit (₹)', 'Avg Selling Price/Unit (₹)', 'Profit/Unit (₹)', 'Units Sold', 'Total Cost (₹)', 'Total Revenue (₹)', 'Net Profit (₹)', 'Margin (%)']
      ];

      books.forEach((b) => {
        rows.push([
          b.product_id || '',
          `"${(b.title || '').replace(/"/g, '""')}"`,
          b.purchase_amount || 0,
          b.avg_selling_price || 0,
          b.unit_profit || 0,
          b.units_sold || 0,
          b.total_purchase_cost || 0,
          b.total_revenue || 0,
          b.net_profit || 0,
          `${b.profit_margin || 0}%`
        ]);
      });

      const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `SriChaitanya_Profits_${dateFrom || 'All'}_${dateTo || 'Present'}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      console.error(e);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* ================= PAGE HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Profits &amp; Margins Analytics
            </h1>
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              <span>Real-Time P&amp;L</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Automatic Net Profit Calculation: Selling Price minus Purchase Cost across completed sales.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchProfits}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-bold text-xs shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCSV}
            disabled={exporting || books.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV / Excel</span>
          </button>
        </div>
      </div>

      {/* Notice Banner */}
      {notice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* ================= TOP 4 KPI SUMMARY CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Profit Card (Featured Emerald) */}
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white p-5 rounded-3xl shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider font-extrabold text-emerald-100">
              Net Profit Made
            </span>
            <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black tracking-tight">
            ₹{formatCurrency(summary?.net_profit)}
          </div>
          <div className="flex items-center gap-1.5 pt-1 text-[11px] font-bold text-emerald-100">
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-white">
              {summary?.overall_margin || 0}% Profit Margin
            </span>
            <span>(Selling - Cost)</span>
          </div>
        </div>

        {/* Total Sales Revenue */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
              Total Sales Revenue
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            ₹{formatCurrency(summary?.total_revenue)}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Gross value of all books sold</p>
        </div>

        {/* Total Purchase Cost */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
              Total Purchase Cost
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            ₹{formatCurrency(summary?.total_purchase_cost)}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Cost spent buying books from outside</p>
        </div>

        {/* Units Sold */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
              Total Books Sold
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {formatNumber(summary?.total_units_sold)}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Across {formatNumber(summary?.unique_books_sold)} distinct title(s)
          </p>
        </div>
      </div>

      {/* ================= CONTROLS: DATES & SEARCH ================= */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
          {/* Search Box */}
          <div className="lg:col-span-5">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search book title in sales..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </form>
          </div>

          {/* Date Pickers */}
          <div className="lg:col-span-4 flex items-center gap-2">
            <div className="flex-1">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <span className="text-xs text-slate-400 font-bold">to</span>
            <div className="flex-1">
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Filter Action Buttons */}
          <div className="lg:col-span-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={fetchProfits}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              Filter Report
            </button>
            {(dateFrom || dateTo || search) && (
              <button
                type="button"
                onClick={() => {
                  setDateFrom('');
                  setDateTo('');
                  setSearch('');
                }}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Quick Date Range Presets */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider mr-1">
            Quick Periods:
          </span>
          <button
            type="button"
            onClick={() => handleQuickPreset('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              !dateFrom && !dateTo
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Time
          </button>
          <button
            type="button"
            onClick={() => handleQuickPreset('today')}
            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => handleQuickPreset('yesterday')}
            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
          >
            Yesterday
          </button>
          <button
            type="button"
            onClick={() => handleQuickPreset('week')}
            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
          >
            Last 7 Days
          </button>
          <button
            type="button"
            onClick={() => handleQuickPreset('month')}
            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
          >
            This Month
          </button>
        </div>
      </div>

      {/* ================= TABS: BOOK-WISE VS ORDER-WISE ================= */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveTab('books')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'books'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Book-Wise Profit Breakdown ({books.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Order-Wise Profit Audit ({orders.length})</span>
        </button>
      </div>

      {/* ================= TAB 1: BOOK-WISE PROFIT BREAKDOWN TABLE ================= */}
      {activeTab === 'books' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-extrabold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Book Details</th>
                  <th className="py-3.5 px-4 text-center">Units Sold</th>
                  <th className="py-3.5 px-4 text-right">Purchase Cost (₹)</th>
                  <th className="py-3.5 px-4 text-right">Selling Price (₹)</th>
                  <th className="py-3.5 px-4 text-right">Profit / Unit (₹)</th>
                  <th className="py-3.5 px-4 text-right">Total Cost (₹)</th>
                  <th className="py-3.5 px-4 text-right">Total Revenue (₹)</th>
                  <th className="py-3.5 px-4 text-right">Net Profit (₹)</th>
                  <th className="py-3.5 px-4 text-center">Margin</th>
                  <th className="py-3.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan="10" className="py-16 text-center">
                      <div className="w-7 h-7 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-xs text-slate-400 font-semibold mt-2">Computing profits &amp; sales data...</p>
                    </td>
                  </tr>
                ) : books.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="py-16 text-center text-slate-400 space-y-2">
                      <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="font-bold text-slate-700 text-sm">No sales recorded for this timeframe</p>
                      <p className="text-xs text-slate-400">Try choosing a wider date range or clearing filters.</p>
                    </td>
                  </tr>
                ) : (
                  books.map((b, idx) => {
                    const isPositive = (b.net_profit || 0) >= 0;
                    return (
                      <tr key={b.product_id || idx} className="hover:bg-slate-50/80 transition-colors">
                        {/* Book Details */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={getImageUrl(b.image)}
                              alt={b.title}
                              className="w-10 h-13 object-cover rounded-xl border border-slate-200 bg-slate-50 shrink-0 shadow-2xs"
                              onError={(e) => {
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150';
                              }}
                            />
                            <div className="min-w-0 max-w-xs">
                              <p className="font-bold text-slate-900 line-clamp-2 leading-snug">
                                {b.title}
                              </p>
                              <span className="text-[10px] text-slate-500 font-medium">
                                In {b.orders_count || 1} customer order(s)
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Units Sold */}
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center justify-center font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg text-xs">
                            {formatNumber(b.units_sold)}
                          </span>
                        </td>

                        {/* Purchase Cost / Unit */}
                        <td className="py-3.5 px-4 text-right">
                          <span className="font-bold text-blue-700 bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded text-xs">
                            ₹{formatCurrency(b.purchase_amount)}
                          </span>
                        </td>

                        {/* Selling Price / Unit */}
                        <td className="py-3.5 px-4 text-right">
                          <span className="font-bold text-slate-900 text-xs">
                            ₹{formatCurrency(b.avg_selling_price)}
                          </span>
                        </td>

                        {/* Profit per Unit */}
                        <td className="py-3.5 px-4 text-right">
                          <span className={`font-black text-xs ${isPositive ? 'text-emerald-700' : 'text-rose-600'}`}>
                            {isPositive ? '+' : ''}₹{formatCurrency(b.unit_profit)}
                          </span>
                        </td>

                        {/* Total Cost */}
                        <td className="py-3.5 px-4 text-right text-slate-600 font-semibold">
                          ₹{formatCurrency(b.total_purchase_cost)}
                        </td>

                        {/* Total Revenue */}
                        <td className="py-3.5 px-4 text-right text-slate-900 font-bold">
                          ₹{formatCurrency(b.total_revenue)}
                        </td>

                        {/* Net Profit (Highlighted) */}
                        <td className="py-3.5 px-4 text-right">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-black shadow-2xs ${
                            isPositive
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : 'bg-rose-100 text-rose-900 border border-rose-300'
                          }`}>
                            {isPositive ? '+' : ''}₹{formatCurrency(b.net_profit)}
                          </span>
                        </td>

                        {/* Margin % */}
                        <td className="py-3.5 px-4 text-center">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            (b.profit_margin || 0) >= 30
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : (b.profit_margin || 0) >= 10
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {b.profit_margin || 0}%
                          </span>
                        </td>

                        {/* Action: Quick Cost Edit */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => openEditCost(b)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition-all cursor-pointer"
                            title="Edit purchase cost for this book"
                          >
                            <Edit3 className="w-3 h-3 text-slate-500" />
                            <span>Cost</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 2: ORDER-WISE PROFIT AUDIT ================= */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-extrabold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Order Code &amp; Date</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Items</th>
                  <th className="py-3.5 px-4 text-right">Order Cost (₹)</th>
                  <th className="py-3.5 px-4 text-right">Order Total (₹)</th>
                  <th className="py-3.5 px-4 text-right">Net Profit (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-16 text-center text-slate-400">
                      No orders found in this period.
                    </td>
                  </tr>
                ) : (
                  orders.map((o) => {
                    const profit = parseFloat(o.order_net_profit || 0);
                    const isPositive = profit >= 0;
                    return (
                      <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-slate-900 block">
                            {o.order_code}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {o.created_at ? new Date(o.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '-'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-900">{o.customer_name || 'Customer'}</p>
                          <p className="text-[10px] text-slate-500">{o.customer_phone}</p>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800">
                            {o.order_status || 'Ordered'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="font-bold text-slate-700">
                            {o.items_count || 1} item(s)
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right text-slate-600 font-semibold">
                          ₹{formatCurrency(o.order_purchase_cost)}
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                          ₹{formatCurrency(o.total)}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-black ${
                            isPositive
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                              : 'bg-rose-100 text-rose-900 border border-rose-200'
                          }`}>
                            {isPositive ? '+' : ''}₹{formatCurrency(profit)}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= QUICK EDIT PURCHASE COST MODAL ================= */}
      {editingBookCost && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  ₹
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Update Purchase Cost</h3>
                  <p className="text-[11px] text-slate-500 font-medium line-clamp-1">{editingBookCost.title}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingBookCost(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCost} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  Your Purchase Cost (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={editCostVal}
                    onChange={(e) => setEditCostVal(e.target.value)}
                    placeholder="e.g. 350.00"
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1 font-medium">
                  This cost price will be subtracted from selling price to calculate your profit automatically.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingBookCost(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={costSaving}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{costSaving ? 'Saving...' : 'Save & Recalculate'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
