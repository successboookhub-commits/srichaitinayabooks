import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { CheckCircle2, Download, Package, ArrowRight, Home } from 'lucide-react';
import api from '../services/api';

export default function OrderSuccess() {
  const location = useLocation();
  const order = location.state?.order;

  useEffect(() => {
    // Fire celebratory confetti!
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#047857', '#10B981', '#F59E0B']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#047857', '#10B981', '#3B82F6']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  const handleDownloadInvoice = () => {
    if (!order?.order_code) return;
    const invoiceUrl = api.getInvoiceUrl(order.order_code);
    window.open(invoiceUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-center animate-fade-in">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-8 ring-emerald-50">
          <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
        </div>

        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Order Confirmed!</h1>
        <p className="text-slate-600 mb-6">
          Thank you for ordering with Sri Chaitanya Book Publications. Your order details and invoice have been sent to your WhatsApp.
        </p>

        {order ? (
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 mb-8 text-left space-y-3">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">Order ID</span>
              <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                {order.order_code}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Customer Name:</span>
              <span className="font-semibold text-slate-800">{order.customer?.name || order.customer_name}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-slate-500">WhatsApp / Phone:</span>
              <span className="font-semibold text-slate-800">{order.customer?.phone || order.customer_phone}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Payment Status:</span>
              <span className={`font-semibold capitalize ${order.payment_status === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                {order.payment_status || 'Pending'} ({order.payment_method?.toUpperCase() || 'ONLINE'})
              </span>
            </div>

            <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
              <span>Total Paid:</span>
              <span className="text-emerald-700">₹{order.total_amount}</span>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm p-4 rounded-xl mb-6">
            Order placed successfully! Check your phone messages or WhatsApp for real-time tracking details.
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {order?.order_code && (
            <button
              onClick={handleDownloadInvoice}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-5 rounded-xl shadow-md transition-all"
            >
              <Download className="w-4 h-4" /> Download Tax Invoice (PDF)
            </button>
          )}

          <Link
            to="/tracking"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 px-5 rounded-xl shadow-md transition-all"
          >
            <Package className="w-4 h-4" /> Track My Orders
          </Link>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            <Home className="w-4 h-4 mr-1.5" /> Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

