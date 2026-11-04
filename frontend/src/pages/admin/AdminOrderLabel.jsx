import React from 'react';
import { Printer, X } from 'lucide-react';

export default function AdminOrderLabel({ orders, onClose }) {
  if (!orders || orders.length === 0) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl my-auto print:m-0 print:p-0 print:shadow-none print:w-full print:max-w-none">
        {/* Controls - Hidden during print */}
        <div className="flex justify-between items-center pb-4 mb-6 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Print Shipping Labels</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              {orders.length} {orders.length === 1 ? 'Label' : 'Labels'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-xl text-sm shadow transition-all"
            >
              <Printer className="w-4 h-4" /> Print Labels
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="space-y-6 print:space-y-0">
          {orders.map((order, idx) => (
            <div
              key={order.id || idx}
              className="border-2 border-slate-900 rounded-xl p-5 bg-white text-slate-900 print:border-2 print:border-black print:p-6 print:break-after-page print:rounded-none"
              style={{ fontFamily: 'sans-serif' }}
            >
              {/* Header */}
              <div className="border-b-2 border-slate-900 pb-3 mb-3 flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-black uppercase tracking-tight">Sri Chaitanya Book Publications</h2>
                  <p className="text-xs text-slate-700">Door No: 12-34/1, Main Road, Vijayawada, Andhra Pradesh - 520002</p>
                  <p className="text-xs text-slate-700 font-bold">Helpline: +91 9876543210 &bull; support@srichaitanyabooks.com</p>
                </div>
                <div className="text-right">
                  <span className="text-xs uppercase font-extrabold tracking-wider bg-slate-900 text-white px-2.5 py-1 rounded">
                    PREPAID (PAID)
                  </span>
                  <p className="text-[11px] font-mono font-bold mt-1.5">{order.order_code}</p>
                </div>
              </div>

              {/* Shipping Address (Bug-fixed with door_no) */}
              <div className="border-b-2 border-slate-900 pb-3 mb-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-wider font-extrabold text-slate-500 mb-0.5">SHIP TO / DELIVER TO:</p>
                  <p className="text-base font-black text-slate-900">{order.customer_name || order.customer?.name}</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">
                    Phone: {order.customer_phone || order.customer?.phone}
                  </p>
                  <div className="text-xs text-slate-800 leading-relaxed mt-1">
                    {order.door_no ? <p className="font-bold">Door / Flat No: {order.door_no}</p> : null}
                    <p>{order.address}</p>
                    {order.mandal ? <p>Mandal / Area: {order.mandal}</p> : null}
                    <p className="font-bold text-slate-900">
                      {order.district}, {order.state} - {order.pincode}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-300 p-3 rounded-lg text-xs flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-600">Order Date:</span>
                      <span className="font-bold">{new Date(order.created_at).toLocaleDateString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-600">Payment Mode:</span>
                      <span className="font-bold uppercase">{order.payment_method || 'Online'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-600">Total Weight:</span>
                      <span className="font-bold">{order.total_weight || 0}g</span>
                    </div>
                    <div className="flex justify-between py-1 text-sm font-black text-slate-900">
                      <span>Total Amount:</span>
                      <span>₹{order.total_amount}</span>
                    </div>
                  </div>

                  {/* Visual Barcode */}
                  <div className="mt-3 pt-2 text-center border-t border-slate-200">
                    <div className="font-mono tracking-widest text-lg font-black bg-slate-100 py-1 border border-slate-300">
                      *{order.order_code}*
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">{order.order_code}</p>
                  </div>
                </div>
              </div>

              {/* Items in Parcel */}
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">PARCEL CONTENTS:</p>
                <div className="text-xs divide-y divide-slate-200">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((it, i) => (
                      <div key={i} className="py-1 flex justify-between text-slate-700">
                        <span>{it.book_title || it.name || 'Book'}</span>
                        <span className="font-bold font-mono">Qty: {it.quantity}</span>
                      </div>
                    ))
                  ) : (
                    <div className="py-1 text-slate-600">Book Publications Parcel &bull; {order.total_items || 1} item(s)</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

