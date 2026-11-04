import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Package,
  Calendar,
  MapPin,
  Download,
  CheckCircle2,
  Clock,
  Truck,
  ChevronRight,
  X,
  AlertCircle,
  Phone,
  ShieldCheck,
  Zap,
  FileText,
  HelpCircle,
  ArrowRight,
  Sparkles,
  BookOpen,
  MessageCircle
} from 'lucide-react';
import api, { getImageUrl, getInvoiceUrl } from '../services/api.js';

export default function OrderTracking() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [queryInput, setQueryInput] = useState(searchParams.get('phone') || searchParams.get('order_code') || '');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const initialQuery = searchParams.get('phone') || searchParams.get('order_code');
    if (initialQuery) {
      handleSearch(null, initialQuery);
    }
  }, []);

  const handleSearch = async (e, directQuery) => {
    if (e) e.preventDefault();
    const target = (directQuery !== undefined ? directQuery : queryInput).trim();
    if (!target) {
      setError('Please enter your 10-digit mobile number or Order ID (e.g. ORD2026...).');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/order-history/orders?query=${encodeURIComponent(target)}`);
      if (res.data.success) {
        setOrders(res.data.orders || []);
        setHasSearched(true);
      } else {
        setError(res.data.message || 'No orders found matching this query.');
        setOrders([]);
        setHasSearched(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch order history. Please try again.');
      setOrders([]);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Search
  const handleQuickDemo = (val) => {
    setQueryInput(val);
    handleSearch(null, val);
  };

  // Status visual mapping & step tracker
  const getStatusStep = (status) => {
    const s = String(status || '').toLowerCase();
    if (s === 'delivered') return 4;
    if (s === 'shipped') return 3;
    if (s === 'processing' || s === 'packing') return 2;
    return 1; // Ordered / Pending
  };

  const getStatusBadge = (status) => {
    const s = String(status || '').toLowerCase();
    switch (s) {
      case 'delivered':
        return (
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Delivered</span>
          </span>
        );
      case 'shipped':
        return (
          <span className="bg-blue-50 text-blue-800 border border-blue-300 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
            <Truck className="w-3.5 h-3.5 text-blue-600" />
            <span>In Transit / Shipped</span>
          </span>
        );
      case 'packing':
      case 'processing':
        return (
          <span className="bg-amber-50 text-amber-800 border border-amber-300 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>Packing / Processing</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="bg-rose-50 text-rose-800 border border-rose-300 text-xs font-black px-3 py-1 rounded-full">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-800 border border-slate-300 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-slate-600" />
            <span>Order Confirmed</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-16 font-sans">
      
      {/* ================= HERO HEADER STRIP ================= */}
      <div className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        
        {/* Glow ambient background rings */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-extrabold text-white shadow-md">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>Live Consignment & Dispatch Tracking</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Track Your Book Order & Delivery
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              Check real-time dispatch progress, courier consignment status, and download official GST tax invoices for your purchases.
            </p>
          </div>

          {/* ================= SEARCH MASTER CARD ================= */}
          <div className="pt-2 max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl p-2 sm:p-2.5 shadow-2xl border border-slate-200/90 flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-xs pointer-events-none">
                  🔍
                </span>
                <input
                  type="text"
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  placeholder="Enter 10-digit mobile number or Order Code (e.g. ORD2026...)"
                  className="w-full pl-9 pr-8 py-3 text-xs sm:text-sm bg-transparent rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none font-medium"
                />
                {queryInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setQueryInput('');
                      setError('');
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={(e) => handleSearch(e)}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-700 hover:to-rose-800 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-red-500/30 active:scale-95 transition-all cursor-pointer disabled:opacity-50 shrink-0"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Track Order</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Demo Search Chips */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
              <span className="text-[11px] font-semibold">Try sample order:</span>
              <button
                onClick={() => handleQuickDemo('7675092429')}
                className="px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-slate-200 text-[11px] font-mono transition-colors cursor-pointer"
              >
                📱 7675092429
              </button>
              <button
                onClick={() => handleQuickDemo('ORD202602001')}
                className="px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-slate-200 text-[11px] font-mono transition-colors cursor-pointer"
              >
                📦 ORD202602001
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-3 p-3 bg-rose-500/20 border border-rose-500/40 rounded-2xl text-rose-200 text-xs font-bold flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ================= MAIN CONTENT WRAPPER ================= */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 space-y-8">
        
        {/* ================= SCENARIO A: SEARCH RESULTS ================= */}
        {hasSearched ? (
          <div className="space-y-6">
            
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Search Results ({orders.length} {orders.length === 1 ? 'Order' : 'Orders'} Found)
                </h2>
                <p className="text-xs text-slate-500">
                  Showing order details for query <strong className="text-slate-800 font-mono font-bold">"{queryInput}"</strong>
                </p>
              </div>

              <button
                onClick={() => {
                  setHasSearched(false);
                  setQueryInput('');
                  setOrders([]);
                }}
                className="text-xs font-bold text-red-600 hover:text-red-700 cursor-pointer"
              >
                Clear Search
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200/90 shadow-2xs space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-red-50 text-red-500 flex items-center justify-center mx-auto shadow-inner">
                  <Package className="w-8 h-8" />
                </div>
                <div className="space-y-1.5 max-w-md mx-auto">
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    No Orders Found
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    We could not find any orders placed with <strong className="text-slate-800">"{queryInput}"</strong>.
                    Please check the mobile number or try your Order Code.
                  </p>
                </div>
                <div className="pt-2 flex flex-wrap justify-center gap-3">
                  <a
                    href="tel:09177110134"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-red-600" />
                    <span>Call Helpline (09177110134)</span>
                  </a>
                  <a
                    href="https://wa.me/919177110134?text=Hello%20Sri%20Chaitanya,%20I%20am%20unable%20to%20track%20my%20order"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp Support</span>
                  </a>
                </div>
              </div>
            ) : (
              orders.map((order) => {
                const currentStep = getStatusStep(order.order_status);
                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow overflow-hidden"
                  >
                    
                    {/* Top Order Strip */}
                    <div className="p-5 sm:p-6 bg-slate-900 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-red-400 font-extrabold">
                            Order Code
                          </span>
                          <span className="font-mono font-black text-white bg-white/10 px-2.5 py-0.5 rounded-lg text-sm border border-white/15">
                            {order.order_code}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            • {new Date(order.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 mt-1">
                          Ordered by <strong className="text-white">{order.customer_name}</strong> ({order.customer_phone})
                        </p>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        <div className="text-right">
                          <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Amount</p>
                          <p className="text-lg font-black text-white">₹{order.total_amount}</p>
                        </div>
                        {getStatusBadge(order.order_status)}
                      </div>
                    </div>

                    {/* Visual 4-Step Tracking Timeline */}
                    <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50">
                      <p className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-red-600" />
                        <span>Fulfillment & Delivery Progress</span>
                      </p>

                      <div className="relative">
                        {/* Connecting Background Line */}
                        <div className="absolute top-4 left-4 right-4 sm:left-6 sm:right-6 h-1 bg-slate-200 rounded-full pointer-events-none" />
                        
                        {/* Active Filled Line */}
                        <div
                          className="absolute top-4 left-4 sm:left-6 h-1 bg-gradient-to-r from-red-600 to-rose-600 rounded-full transition-all duration-500 pointer-events-none"
                          style={{
                            width: currentStep === 1 ? '15%' : currentStep === 2 ? '45%' : currentStep === 3 ? '75%' : '94%'
                          }}
                        />

                        {/* 4 Steps */}
                        <div className="relative z-10 grid grid-cols-4 text-center">
                          
                          {/* Step 1: Confirmed */}
                          <div className="space-y-1">
                            <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center font-bold text-xs shadow-xs transition-colors ${
                              currentStep >= 1 ? 'bg-red-600 text-white ring-4 ring-red-100' : 'bg-slate-200 text-slate-500'
                            }`}>
                              ✓
                            </div>
                            <p className="text-[11px] sm:text-xs font-black text-slate-900 leading-tight">Confirmed</p>
                            <p className="text-[9.5px] text-slate-400 hidden sm:block">Order Verified</p>
                          </div>

                          {/* Step 2: Packing */}
                          <div className="space-y-1">
                            <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center font-bold text-xs shadow-xs transition-colors ${
                              currentStep >= 2 ? 'bg-red-600 text-white ring-4 ring-red-100' : 'bg-slate-200 text-slate-500'
                            }`}>
                              {currentStep > 2 ? '✓' : '2'}
                            </div>
                            <p className="text-[11px] sm:text-xs font-black text-slate-900 leading-tight">Packed</p>
                            <p className="text-[9.5px] text-slate-400 hidden sm:block">Water-Proof Seal</p>
                          </div>

                          {/* Step 3: Shipped */}
                          <div className="space-y-1">
                            <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center font-bold text-xs shadow-xs transition-colors ${
                              currentStep >= 3 ? 'bg-red-600 text-white ring-4 ring-red-100' : 'bg-slate-200 text-slate-500'
                            }`}>
                              {currentStep > 3 ? '✓' : '3'}
                            </div>
                            <p className="text-[11px] sm:text-xs font-black text-slate-900 leading-tight">In Transit</p>
                            <p className="text-[9.5px] text-slate-400 hidden sm:block">Courier Dispatched</p>
                          </div>

                          {/* Step 4: Delivered */}
                          <div className="space-y-1">
                            <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center font-bold text-xs shadow-xs transition-colors ${
                              currentStep >= 4 ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' : 'bg-slate-200 text-slate-500'
                            }`}>
                              {currentStep >= 4 ? '✓' : '4'}
                            </div>
                            <p className="text-[11px] sm:text-xs font-black text-slate-900 leading-tight">Delivered</p>
                            <p className="text-[9.5px] text-slate-400 hidden sm:block">Doorstep Handover</p>
                          </div>

                        </div>
                      </div>
                    </div>

                    {/* Book Items Preview */}
                    <div className="p-5 sm:p-6 space-y-3">
                      <p className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                        Books In This Consignment ({order.total_items} Total)
                      </p>

                      <div className="divide-y divide-slate-100">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-12 h-14 bg-slate-100 rounded-lg overflow-hidden border border-slate-200/80 p-1 flex items-center justify-center shrink-0">
                                <img
                                  src={getImageUrl(item.image)}
                                  alt={item.name}
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    e.target.src = '/images/ebook_logo.png';
                                  }}
                                />
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                                  {item.book_title || item.name}
                                </h4>
                                <p className="text-xs text-slate-500 font-mono">
                                  Qty: {item.quantity} &times; ₹{item.price.toFixed(2)}
                                </p>
                              </div>
                            </div>

                            <span className="font-extrabold text-xs sm:text-sm text-slate-900 shrink-0">
                              ₹{(item.quantity * item.price).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Delivery Address Pill */}
                      <div className="mt-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start gap-2.5 text-xs text-slate-700">
                        <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-slate-900">
                            Shipping Destination: {order.customer_name} ({order.customer_phone})
                          </p>
                          <p className="text-slate-500">
                            {order.door_no ? `${order.door_no}, ` : ''}{order.address}{order.mandal ? `, ${order.mandal}` : ''}, {order.district}, {order.state} - {order.pincode}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-xs text-slate-500 font-medium">
                        Payment: <strong className="text-slate-800">{order.payment_method}</strong>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <a
                          href={getInvoiceUrl(order.order_code)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5 text-red-400" />
                          <span>Download Tax Invoice (PDF)</span>
                        </a>

                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                        >
                          <span>Full Breakdown</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })
            )}

          </div>
        ) : (
          /* ================= SCENARIO B: BEFORE SEARCH (DISCOVERY & TRUST PILLARS) ================= */
          <div className="space-y-8">
            
            {/* 3 Trust Guarantees */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-2.5">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  24-Hour Express Dispatch
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Orders placed before 2 PM are packaged with water-resistant bubble wrapping and dispatched the very same day across Telangana and AP.
                </p>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  Official GST Tax Invoices
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Instant digitally-signed Tax Invoices with itemized HSN book codes, publisher details, and barcode tracking ready to download in PDF.
                </p>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  100% Genuine Publisher Stock
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Every book is sourced directly from authenticated publishers (Telugu Academy, Vijeta, Deepika, B.S.R., etc.) with publisher warranty.
                </p>
              </div>

            </div>

            {/* How to Track 3-Step Guide */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-5">
              <div className="text-center space-y-1">
                <h3 className="font-black text-slate-900 text-base sm:text-lg">
                  How to Track Your Shipment
                </h3>
                <p className="text-xs text-slate-500">
                  Simple 3-step lookup to check your book delivery anywhere in India
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2 text-center">
                  <span className="w-8 h-8 rounded-full bg-red-600 text-white font-black text-xs inline-flex items-center justify-center">
                    1
                  </span>
                  <h4 className="font-bold text-xs text-slate-900">Enter Phone or Order ID</h4>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Type the 10-digit phone used at checkout or order code from SMS.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2 text-center">
                  <span className="w-8 h-8 rounded-full bg-red-600 text-white font-black text-xs inline-flex items-center justify-center">
                    2
                  </span>
                  <h4 className="font-bold text-xs text-slate-900">View Live Courier Stage</h4>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    See whether your books are packing, in transit, or out for delivery.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2 text-center">
                  <span className="w-8 h-8 rounded-full bg-red-600 text-white font-black text-xs inline-flex items-center justify-center">
                    3
                  </span>
                  <h4 className="font-bold text-xs text-slate-900">Download Tax Invoice</h4>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Download official receipt PDF for your competitive exam records.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Helpline Banner */}
            <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-3xl p-6 sm:p-7 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-black text-base sm:text-lg">Need Immediate Tracking Help?</h4>
                <p className="text-xs text-red-100">
                  Our dispatch center is active 7 days a week from 10:00 AM to 9:00 PM.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href="tel:09177110134"
                  className="px-4 py-2.5 rounded-xl bg-white text-slate-900 font-extrabold text-xs shadow-md hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-red-600" />
                  <span>Call 09177110134</span>
                </a>
                <a
                  href="https://wa.me/919177110134?text=Hello%20Sri%20Chaitanya%20Books,%20I%20need%20help%20tracking%20my%20order"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-colors flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-white" />
                  <span>WhatsApp Chat</span>
                </a>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ================= MODAL: FULL ORDER DETAILS BREAKDOWN ================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-slate-900 text-lg">Consignment Details</h3>
                <p className="text-xs font-mono text-red-600 font-bold">Code: #{selectedOrder.order_code}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Delivery Address */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs text-slate-700 space-y-1">
              <div className="font-extrabold text-slate-900 flex items-center gap-1.5 mb-1">
                <MapPin className="w-4 h-4 text-red-600" />
                <span>Shipping Address</span>
              </div>
              <p className="font-bold text-slate-800">{selectedOrder.customer_name} ({selectedOrder.customer_phone})</p>
              <p>{selectedOrder.door_no ? `${selectedOrder.door_no}, ` : ''}{selectedOrder.address}</p>
              <p>{selectedOrder.mandal ? `${selectedOrder.mandal}, ` : ''}{selectedOrder.district}, {selectedOrder.state} - {selectedOrder.pincode}</p>
            </div>

            {/* Items List */}
            <div className="space-y-2">
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Order Items</p>
              <div className="divide-y divide-slate-100 border-t border-b border-slate-100">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex justify-between items-center text-xs sm:text-sm">
                    <div>
                      <p className="font-bold text-slate-900">{item.book_title || item.name || 'Book'}</p>
                      <p className="text-xs text-slate-500 font-mono">Qty: {item.quantity} &times; ₹{item.price.toFixed(2)}</p>
                    </div>
                    <span className="font-extrabold text-slate-900">₹{(item.quantity * item.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Breakdown */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>₹{selectedOrder.subtotal || selectedOrder.total_amount}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Courier Shipping</span>
                <span>{Number(selectedOrder.shipping_fee) > 0 ? `₹${selectedOrder.shipping_fee}` : 'FREE'}</span>
              </div>
              <div className="flex justify-between font-black text-sm text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Paid</span>
                <span className="text-red-600">₹{selectedOrder.total_amount}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex gap-2">
              <a
                href={getInvoiceUrl(selectedOrder.order_code)}
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md shadow-red-500/20 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Invoice PDF</span>
              </a>
              <button
                onClick={() => setSelectedOrder(null)}
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
