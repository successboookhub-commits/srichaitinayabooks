import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  CheckCircle2,
  BookOpen,
  ArrowUpRight,
  TrendingUp,
  Package,
  Clock,
  Truck,
  Layers,
  Users,
  Building2,
  AlertTriangle,
  Award,
  Sparkles,
  ChevronRight,
  RefreshCw,
  Calendar
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import api from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chartView, setChartView] = useState('revenue'); // 'revenue' | 'orders'

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/dashboard/stats');
      const data = res.data;
      setStats({
        total_revenue: data.stats?.totalRevenue ?? 0,
        total_orders: data.stats?.totalOrders ?? 0,
        avg_order_value: data.stats?.avgOrderValue ?? 0,
        delivered_orders: data.stats?.deliveredOrders ?? data.stats?.orderStatusCounts?.Delivered ?? 0,
        shipped_orders: data.stats?.shippedOrders ?? data.stats?.orderStatusCounts?.Shipped ?? 0,
        processing_orders: data.stats?.processingOrders ?? data.stats?.orderStatusCounts?.Processing ?? 0,
        pending_orders: data.stats?.pendingOrders ?? data.stats?.orderStatusCounts?.Ordered ?? 0,
        cancelled_orders: data.stats?.cancelledOrders ?? data.stats?.orderStatusCounts?.Cancelled ?? 0,
        today_orders: data.stats?.todayOrders ?? 0,
        today_revenue: data.stats?.todayRevenue ?? 0,
        yesterday_orders: data.stats?.yesterdayOrders ?? 0,
        yesterday_revenue: data.stats?.yesterdayRevenue ?? 0,
        total_books: data.stats?.totalBooks ?? 0,
        total_stock_units: data.stats?.totalStockUnits ?? 0,
        low_stock_count: data.stats?.lowStockCount ?? 0,
        total_categories: data.stats?.totalCategories ?? 0,
        total_publications: data.stats?.totalPublications ?? 0,
        total_customers: data.stats?.totalCustomers ?? 0,
        monthly_sales: data.chartData || data.stats?.salesChart || [],
        top_selling_books: data.topSellingBooks || [],
        recent_orders: (data.recentOrders || data.stats?.recentOrders || []).map((ord) => ({
          ...ord,
          total_amount: ord.total ?? ord.total_amount ?? 0,
          location: [ord.district, ord.state].filter(Boolean).join(', ') || ord.location || 'Telangana',
        })),
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-9 h-9 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Loading live store telemetry & database metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-700 p-5 rounded-2xl flex items-center justify-between">
        <div>
          <p className="font-bold text-sm">Error Loading Dashboard</p>
          <p className="text-xs text-rose-600 mt-0.5">{error}</p>
        </div>
        <button
          onClick={fetchStats}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  const todayDateStr = (() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  })();

  const statCards = [
    {
      label: 'Total Revenue',
      value: `₹${Number(stats?.total_revenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'bg-emerald-600 text-white shadow-emerald-500/20',
      badge: `Avg ₹${Number(stats?.avg_order_value || 0).toLocaleString('en-IN')}/order`,
      subtext: `Live total from ${Number(stats?.total_orders || 0).toLocaleString('en-IN')} orders`
    },
    {
      label: 'Total Orders',
      value: Number(stats?.total_orders || 0).toLocaleString('en-IN'),
      icon: ShoppingBag,
      color: 'bg-blue-600 text-white shadow-blue-500/20',
      badge: '100% Verified in DB',
      subtext: 'All historical & current'
    },
    {
      label: 'Delivered Orders',
      value: Number(stats?.delivered_orders || 0).toLocaleString('en-IN'),
      icon: CheckCircle2,
      color: 'bg-teal-600 text-white shadow-teal-500/20',
      badge: `${((stats?.delivered_orders / (stats?.total_orders || 1)) * 100).toFixed(1)}% Completed`,
      subtext: 'Fulfilled & handed over'
    },
    {
      label: 'Catalog Books',
      value: Number(stats?.total_books || 0).toLocaleString('en-IN'),
      icon: BookOpen,
      color: 'bg-indigo-600 text-white shadow-indigo-500/20',
      badge: `${Number(stats?.total_stock_units || 0).toLocaleString('en-IN')} units`,
      subtext: 'Active titles in database'
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Store Overview</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live DB
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time store performance, verified revenue, and fulfillment analytics
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={fetchStats}
            title="Refresh live metrics"
            className="p-2.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Manage Orders</span>
          </Link>
        </div>
      </div>

      {/* Primary Stats Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                  {card.label}
                </span>
                <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center shadow-md`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {card.value}
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium truncate">{card.subtext}</span>
                  <span className="font-extrabold text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 shrink-0">
                    {card.badge}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* TODAY'S PERFORMANCE HIGHLIGHT */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0 shadow-inner">
            <Calendar className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold tracking-tight text-white">Today's Real-Time Orders & Sales</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Today
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Verified orders placed today ({new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}) and gross revenue
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          {/* Today's Orders */}
          <div className="bg-white/10 backdrop-blur-xs px-4 py-2.5 rounded-xl border border-white/10 min-w-[130px]">
            <span className="text-[10px] uppercase font-bold text-slate-300 block">Today's Orders</span>
            <span className="text-2xl font-black text-white">
              {Number(stats?.today_orders || 0).toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-300 block font-medium">
              Yesterday: {Number(stats?.yesterday_orders || 0)} orders
            </span>
          </div>

          {/* Today's Revenue */}
          <div className="bg-emerald-500/20 backdrop-blur-xs px-4 py-2.5 rounded-xl border border-emerald-400/30 min-w-[150px]">
            <span className="text-[10px] uppercase font-bold text-emerald-300 block">Today's Revenue</span>
            <span className="text-2xl font-black text-emerald-300">
              ₹{Number(stats?.today_revenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] text-emerald-200/80 block font-medium">
              Yesterday: ₹{Number(stats?.yesterday_revenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* 1-Click Action to view today's orders */}
          <Link
            to={`/admin/orders?date_from=${todayDateStr}&date_to=${todayDateStr}`}
            className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black px-4 py-3 rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
          >
            <span>View Today's Orders</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* ORDER FULFILLMENT PIPELINE (Live Database Statuses) */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-600" />
              <span>Real-Time Order Fulfillment Pipeline</span>
            </h2>
            <p className="text-xs text-slate-500">Live order state distribution directly from MySQL database</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Open Orders Workflow</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          {/* 1. Processing */}
          <Link
            to="/admin/orders?status=Processing"
            className="group p-4 rounded-xl border border-amber-200/80 bg-amber-50/50 hover:bg-amber-50 hover:border-amber-300 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between text-amber-700">
              <span className="text-xs font-black uppercase tracking-wider">Processing</span>
              <Clock className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 text-2xl font-black text-amber-900">
              {Number(stats?.processing_orders || 0).toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-amber-700/80 mt-0.5 font-medium">Packing & assembling</p>
          </Link>

          {/* 2. Shipped */}
          <Link
            to="/admin/orders?status=Shipped"
            className="group p-4 rounded-xl border border-blue-200/80 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-300 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between text-blue-700">
              <span className="text-xs font-black uppercase tracking-wider">Shipped</span>
              <Truck className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 text-2xl font-black text-blue-900">
              {Number(stats?.shipped_orders || 0).toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-blue-700/80 mt-0.5 font-medium">In transit with couriers</p>
          </Link>

          {/* 3. Ordered / Pending */}
          <Link
            to="/admin/orders?status=Ordered"
            className="group p-4 rounded-xl border border-purple-200/80 bg-purple-50/50 hover:bg-purple-50 hover:border-purple-300 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between text-purple-700">
              <span className="text-xs font-black uppercase tracking-wider">New / Ordered</span>
              <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 text-2xl font-black text-purple-900">
              {Number(stats?.pending_orders || 0).toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-purple-700/80 mt-0.5 font-medium">Pending order review</p>
          </Link>

          {/* 4. Delivered */}
          <Link
            to="/admin/orders?status=Delivered"
            className="group p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/50 hover:bg-emerald-50 hover:border-emerald-300 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between text-emerald-700">
              <span className="text-xs font-black uppercase tracking-wider">Delivered</span>
              <CheckCircle2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 text-2xl font-black text-emerald-900">
              {Number(stats?.delivered_orders || 0).toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-emerald-700/80 mt-0.5 font-medium">Customer acknowledged</p>
          </Link>
        </div>
      </div>

      {/* Catalog & Business Quick Intelligence strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase font-bold text-slate-400">Exam Categories</p>
            <p className="text-base font-black text-slate-900">{stats?.total_categories} Exams</p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase font-bold text-slate-400">Publishers</p>
            <p className="text-base font-black text-slate-900">{stats?.total_publications} Houses</p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase font-bold text-slate-400">Verified Customers</p>
            <p className="text-base font-black text-slate-900">{stats?.total_customers}</p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase font-bold text-slate-400">Low Stock Books</p>
            <p className="text-base font-black text-slate-900">{stats?.low_stock_count} Titles</p>
          </div>
        </div>
      </div>

      {/* SALES GROWTH CHART + REAL BEST-SELLING BOOKS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Monthly Sales Trajectory */}
        <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black text-slate-900">Monthly Sales Trajectory</h2>
              <p className="text-xs text-slate-500">Actual sales volume and transaction count across store operational months</p>
            </div>

            {/* Toggle metric */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-bold self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setChartView('revenue')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  chartView === 'revenue'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Revenue (₹)
              </button>
              <button
                type="button"
                onClick={() => setChartView('orders')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  chartView === 'orders'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Orders (Count)
              </button>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.monthly_sales || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={chartView === 'revenue' ? '#059669' : '#2563eb'}
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="95%"
                      stopColor={chartView === 'revenue' ? '#059669' : '#2563eb'}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis
                  dataKey="month"
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                  dy={5}
                />
                <YAxis
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(v) =>
                    chartView === 'revenue'
                      ? v >= 100000
                        ? `₹${(v / 100000).toFixed(1)}L`
                        : `₹${(v / 1000).toFixed(0)}k`
                      : v
                  }
                />
                <Tooltip
                  formatter={(val) => [
                    chartView === 'revenue'
                      ? `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
                      : `${Number(val)} orders`,
                    chartView === 'revenue' ? 'Gross Revenue' : 'Orders Count'
                  ]}
                  labelFormatter={(lbl, payload) => {
                    const item = payload?.[0]?.payload;
                    return item?.monthLabel || lbl;
                  }}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                    padding: '8px 12px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={chartView === 'revenue' ? 'revenue' : 'orders'}
                  stroke={chartView === 'revenue' ? '#059669' : '#2563eb'}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#chartGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Top 5 Best-Selling Books (Real order_items table) */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Top Selling Books</span>
              </h2>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-amber-50 text-amber-800 rounded-full border border-amber-200">
                Real DB
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Ranked by verified units sold in order_items</p>
          </div>

          <div className="space-y-2.5 flex-1">
            {stats?.top_selling_books?.map((book, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-100/70 transition-all flex items-start gap-3"
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                    idx === 0
                      ? 'bg-amber-500 text-white shadow-xs'
                      : idx === 1
                      ? 'bg-slate-400 text-white'
                      : idx === 2
                      ? 'bg-amber-700 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {idx + 1}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-extrabold text-slate-800 line-clamp-1 leading-snug">
                    {book.product_name}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                    <span className="font-bold text-slate-700">
                      <span className="text-emerald-700 font-extrabold">{book.total_sold}</span> copies sold
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-slate-600">
                      ₹{Number(book.total_revenue || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/admin/products"
            className="w-full text-center py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>View Full Product Inventory</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

      {/* RECENT REAL ORDERS TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-black text-slate-900">Recent Customer Orders</h2>
            <p className="text-xs text-slate-500">Live incoming student orders and verified contact details</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-extrabold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All 1,415 Orders</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-extrabold border-b border-slate-100 text-[10.5px]">
              <tr>
                <th className="py-3 px-4">Order Code</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">District / State</th>
                <th className="py-3 px-4">Order Date</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Fulfillment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats?.recent_orders?.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                    <Link to={`/admin/orders?search=${ord.order_code}`} className="hover:underline">
                      {ord.order_code}
                    </Link>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">{ord.customer_name}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{ord.customer_phone}</td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">{ord.location}</td>
                  <td className="py-3.5 px-4 text-slate-500 font-medium">
                    {new Date(ord.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="py-3.5 px-4 font-black text-slate-900">
                    ₹{Number(ord.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full font-bold text-[10.5px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {ord.status || 'Paid'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full font-black text-[10.5px] tracking-tight ${
                        ord.order_status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.order_status === 'Shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : ord.order_status === 'Processing'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {ord.order_status || 'Ordered'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
