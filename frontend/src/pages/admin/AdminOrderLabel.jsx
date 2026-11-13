import React from 'react';
import { Printer, X, CheckCircle2 } from 'lucide-react';

// Authentic 1D Code 39 Barcode SVG Component
function BarcodeSvg({ text, height = 30 }) {
  const code39Map = {
    '0': 'bwbwbwBwB', '1': 'BwbwbwBwb', '2': 'bwBwbwBwb', '3': 'BwBwbwbwb',
    '4': 'bwbwBwBwb', '5': 'BwbwBwbwb', '6': 'bwBwBwbwb', '7': 'bwbwbwBwB',
    '8': 'BwbwbwBwb', '9': 'bwBwbwBwB', 'A': 'BwbwbwbwB', 'B': 'bwBwbwbwB',
    'C': 'BwBwbwbwb', 'D': 'bwbwBwbwB', 'E': 'BwbwBwbwb', 'F': 'bwBwBwbwb',
    'G': 'bwbwbwBwB', 'H': 'BwbwbwBwb', 'I': 'bwBwBwbwb', 'J': 'bwbwBwBwb',
    'K': 'Bwbwbwbwb', 'L': 'bwBwbwbwb', 'M': 'BwBwbwbwb', 'N': 'bwbwBwbwb',
    'O': 'BwbwBwbwb', 'P': 'bwBwBwbwb', 'Q': 'bwbwbwbwB', 'R': 'Bwbwbwbwb',
    'S': 'bwBwbwbwb', 'T': 'bwbwBwbwb', 'U': 'Bwbwbwbwb', 'V': 'bwBwbwbwb',
    'W': 'BwBwbwbwb', 'X': 'bwbwBwbwb', 'Y': 'BwbwBwbwb', 'Z': 'bwBwBwbwb',
    '-': 'bwbwBwbwB', '.': 'BwbwBwbwb', ' ': 'bwBwBwbwb', '*': 'bwbwBwBwb',
    '/': 'bwbwbwBwb', '+': 'bwbwbwbwb', '%': 'bwbwbwbwb', '$': 'bwbwbwbwb'
  };

  const cleanText = String(text || 'ORD').toUpperCase().replace(/[^0-9A-Z-. ]/g, '');
  const raw = `*${cleanText}*`;
  const bars = [];
  for (let char of raw) {
    const pattern = code39Map[char] || code39Map['*'];
    for (let p of pattern) {
      bars.push(p);
    }
    bars.push('w');
  }

  const barWidth = 1.15;
  const wideMultiplier = 2.2;
  let currentX = 6;
  const rects = [];

  bars.forEach((b, idx) => {
    const isBlack = b.toLowerCase() === 'b';
    const isWide = b === 'B' || b === 'W';
    const w = isWide ? barWidth * wideMultiplier : barWidth;
    if (isBlack) {
      rects.push(
        <rect
          key={idx}
          x={currentX}
          y={0}
          width={w}
          height={height}
          fill="#000000"
        />
      );
    }
    currentX += w;
  });

  return (
    <svg
      viewBox={`0 0 ${currentX + 6} ${height}`}
      className="w-full max-h-[28px] mx-auto block"
      preserveAspectRatio="xMidYMid meet"
    >
      {rects}
    </svg>
  );
}

// Clean address deduplication & formatting helper
function formatAddressLines(order) {
  const parts = [];
  const door = (order.door_no || '').trim();
  const addr = (order.address || '').trim();
  const mandal = (order.mandal || '').trim();
  const district = (order.district || '').trim();
  const state = (order.state || 'Andhra Pradesh / Telangana').trim();

  let line1 = [door ? `D.No: ${door}` : '', addr].filter(Boolean).join(', ');
  if (line1) parts.push(line1);

  let line2 = [mandal, district].filter(Boolean).join(', ');
  if (line2) parts.push(line2);

  if (state) parts.push(state);

  return parts;
}

export default function AdminOrderLabel({ orders, onClose }) {
  if (!orders || orders.length === 0) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Outer Card */}
      <div className="bg-white rounded-3xl max-w-xl w-full p-4 sm:p-6 shadow-2xl my-auto print:m-0 print:p-0 print:shadow-none print:w-full print:max-w-none print:rounded-none">
        
        {/* Top Control Bar - Hidden during printing */}
        <div className="flex justify-between items-center pb-3.5 mb-4 border-b border-slate-200 print:hidden">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-black text-slate-900 text-sm sm:text-base">
                Postal Shipping Label
              </span>
              <span className="text-[11px] bg-red-100 text-red-800 font-extrabold px-2 py-0.5 rounded-md border border-red-200">
                9 cm (W) × 14 cm (L)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Standard Courier & India Post Sticker Size ({orders.length} {orders.length === 1 ? 'Label' : 'Labels'})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-black py-2 px-4 rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-white" />
              <span>Print Label</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors"
              title="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================= PRINT CSS INJECTION ================= */}
        <style dangerouslySetInnerHTML={{ __html: `
          @page {
            size: 90mm 140mm portrait;
            margin: 0mm;
          }
          @media print {
            html, body {
              width: 90mm !important;
              height: 140mm !important;
              margin: 0 !important;
              padding: 0 !important;
              background: #ffffff !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body * {
              visibility: hidden !important;
            }
            #shipping-labels-printable-root, #shipping-labels-printable-root * {
              visibility: visible !important;
            }
            #shipping-labels-printable-root {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 90mm !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            .shipping-label-sticker {
              width: 90mm !important;
              height: 140mm !important;
              min-height: 140mm !important;
              max-height: 140mm !important;
              page-break-after: always !important;
              break-after: page !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              box-sizing: border-box !important;
              overflow: hidden !important;
              margin: 0 !important;
              padding: 2.5mm !important;
              background: #ffffff !important;
            }
          }
        ` }} />

        {/* Printable Area */}
        <div id="shipping-labels-printable-root" className="space-y-6 print:space-y-0 flex flex-col items-center">
          {orders.map((order, idx) => {
            const items = order.items && order.items.length > 0 ? order.items : [];
            const addressLines = formatAddressLines(order);
            const totalQty = items.reduce((s, it) => s + (parseInt(it.qty || it.quantity || 1, 10)), 0);

            return (
              <div
                key={order.id || idx}
                className="shipping-label-sticker bg-white text-black border-2 border-black flex flex-col justify-between font-sans shadow-lg print:shadow-none box-border select-none overflow-hidden"
                style={{
                  width: '90mm',
                  height: '140mm',
                  minHeight: '140mm',
                  maxHeight: '140mm',
                  padding: '2.5mm',
                  boxSizing: 'border-box',
                  fontFamily: 'Arial, Helvetica, sans-serif',
                }}
              >
                {/* INNER BORDER CONTAINER */}
                <div className="w-full h-full border border-black flex flex-col justify-between text-[10px] leading-tight overflow-hidden bg-white">
                  
                  {/* 1. BRAND & ROUTING HEADER */}
                  <div className="border-b border-black bg-black text-white px-2 py-1 flex items-center justify-between">
                    <div>
                      <h1 className="text-[11.5px] font-black tracking-wider uppercase leading-none">
                        SRI CHAITANYA BOOK CENTRE
                      </h1>
                      <p className="text-[8px] font-medium text-slate-300 mt-0.5 tracking-wide">
                        ESTD. 1986 | DILSUKHNAGAR, HYDERABAD
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="bg-white text-black font-black text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider">
                        {order.status === 'Paid' ? 'PREPAID' : 'EXP. POST'}
                      </span>
                    </div>
                  </div>

                  {/* 2. BARCODE & ORDER ID STRIP */}
                  <div className="border-b border-black px-2 py-1 bg-white text-center">
                    <BarcodeSvg text={order.order_code || `ORD${order.id}`} height={26} />
                    <div className="flex items-center justify-between mt-0.5 text-[9px]">
                      <span className="font-mono font-black text-[10px] tracking-wider text-black">
                        {order.order_code || `ORD${order.id}`}
                      </span>
                      <span className="text-slate-600 font-bold text-[8.5px]">
                        Date: {order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="font-bold uppercase text-[8px] bg-slate-100 px-1 py-0.2 rounded border border-slate-300">
                        SURFACE / POST
                      </span>
                    </div>
                  </div>

                  {/* 3. DELIVER TO (THE MOST PROMINENT & CRITICAL COURIER SECTION) */}
                  <div className="border-b border-black p-2 bg-white flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 border-b border-slate-300">
                          DELIVER TO / SHIP TO:
                        </span>
                        <span className="text-[8px] font-bold text-slate-500 uppercase">
                          CONSIGNEE
                        </span>
                      </div>

                      {/* Customer Name */}
                      <p className="text-[13px] font-black uppercase text-black tracking-tight leading-snug">
                        {order.customer_name || order.customer?.name || 'Customer Name'}
                      </p>

                      {/* Contact Phone (Large & Bold) */}
                      <p className="text-[12px] font-black text-black my-1 flex items-center gap-1.5">
                        <span className="bg-black text-white text-[8.5px] px-1 py-0.2 rounded font-mono">TEL</span>
                        <span className="font-mono tracking-wider">{order.customer_phone || order.customer?.phone || '-'}</span>
                      </p>

                      {/* Full Address */}
                      <div className="text-[10px] font-semibold text-slate-900 leading-[1.35] space-y-0.5 mt-1">
                        {addressLines.map((line, lIdx) => (
                          <p key={lIdx} className="capitalize">
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>

                    {/* Prominent High-Contrast PINCODE Highlight Box */}
                    <div className="mt-1 pt-1 border-t border-dashed border-slate-300 flex items-center justify-between">
                      <span className="text-[9px] font-extrabold uppercase text-slate-600">
                        DESTINATION PIN:
                      </span>
                      <span className="bg-black text-white font-mono font-black text-[13px] px-3 py-0.5 rounded tracking-widest border border-black shadow-xs">
                        PIN: {order.pincode || '-'}
                      </span>
                    </div>
                  </div>

                  {/* 4. DISPATCH FROM / SENDER DETAILS */}
                  <div className="border-b border-black p-1.5 bg-slate-50 text-[9px] leading-tight">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[8px] font-black uppercase tracking-wider text-slate-600">
                        RETURN IF UNDELIVERED TO:
                      </span>
                      <span className="font-mono text-[8.5px] font-bold text-slate-800 bg-slate-200 px-1 py-0.2 rounded">
                        Postal ID: 1879696070
                      </span>
                    </div>
                    <p className="font-black text-[10px] uppercase text-black">
                      SRI CHAITANYA BOOK CENTRE
                    </p>
                    <p className="text-slate-800 text-[8.5px] font-medium leading-snug mt-0.5">
                      Konark Theatre Lane, opp. ICICI ATM, Dilsukhnagar, Hyderabad, Telangana - 500060
                    </p>
                    <p className="text-black text-[9px] font-bold mt-0.5">
                      Helpline / WhatsApp: <span className="font-mono font-black">09177110134</span>
                    </p>
                  </div>

                  {/* 5. ITEM CONTENTS MANIFEST */}
                  <div className="p-1.5 bg-white text-[9px]">
                    <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-wider text-slate-600 border-b border-black/30 pb-0.5 mb-1">
                      <span>BOOK DESCRIPTION ({items.length || 1} TITLE{items.length > 1 ? 'S' : ''})</span>
                      <span className="font-mono">QTY: {totalQty || 1}</span>
                    </div>

                    <div className="space-y-0.5 max-h-[16mm] overflow-hidden">
                      {items.length > 0 ? (
                        items.slice(0, 3).map((item, iIdx) => {
                          const title = item.product_name || item.book_title || item.name || 'Competitive Book';
                          const qty = item.qty || item.quantity || 1;
                          return (
                            <div key={iIdx} className="flex justify-between items-start text-[8.5px] leading-tight">
                              <span className="font-semibold text-black truncate pr-2 flex-1">
                                {iIdx + 1}. {title}
                              </span>
                              <span className="font-mono font-bold text-black shrink-0">
                                x{qty}
                              </span>
                            </div>
                          );
                        })
                      ) : (
                        <div className="flex justify-between items-start text-[8.5px]">
                          <span className="font-semibold text-black">Sri Chaitanya Competitive Study Material</span>
                          <span className="font-mono font-bold text-black">x{totalQty || 1}</span>
                        </div>
                      )}
                      {items.length > 3 && (
                        <p className="text-[7.5px] font-bold text-slate-500 italic">
                          +{items.length - 3} more items in this parcel
                        </p>
                      )}
                    </div>

                    <div className="mt-1 pt-0.5 border-t border-slate-200 flex justify-between items-center text-[7.5px] font-bold text-slate-500 uppercase tracking-wider">
                      <span>Handle With Care • Printed Books</span>
                      <span className="font-black text-black">Total Paid: ₹{parseFloat(order.total || 0).toFixed(2)}</span>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
