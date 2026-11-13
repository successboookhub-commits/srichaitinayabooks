import React from 'react';
import { Printer, X } from 'lucide-react';

// Authentic 1D Code 39 Barcode SVG Component
function BarcodeSvg({ text, height = 34 }) {
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
    bars.push('w'); // quiet space between characters
  }

  const barWidth = 1.25;
  const wideMultiplier = 2.4;
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
      className="w-full max-h-[36px] mx-auto block"
      preserveAspectRatio="xMidYMid meet"
    >
      {rects}
    </svg>
  );
}

// Clean address deduplication helper
function formatAddressLines(order) {
  const parts = [];

  const door = (order.door_no || '').trim();
  const addr = (order.address || '').trim();
  const mandal = (order.mandal || '').trim();
  const district = (order.district || '').trim();
  const state = (order.state || 'Andhra Pradesh').trim();
  const pin = (order.pincode || '').trim();

  if (door) {
    parts.push(`D.No: ${door}`);
  }

  if (addr) {
    parts.push(addr);
  }

  // Deduplicate mandal if already present inside address
  if (mandal && !addr.toLowerCase().includes(mandal.toLowerCase())) {
    parts.push(mandal);
  }

  // Deduplicate district if already present
  if (district && !addr.toLowerCase().includes(district.toLowerCase()) && district.toLowerCase() !== mandal.toLowerCase()) {
    parts.push(district);
  }

  const region = [state, pin].filter(Boolean).join(' - ');
  if (region) {
    parts.push(region);
  }

  return parts;
}

export default function AdminOrderLabel({ orders, onClose }) {
  if (!orders || orders.length === 0) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Container */}
      <div className="bg-white rounded-3xl max-w-xl w-full p-4 sm:p-6 shadow-2xl my-auto print:m-0 print:p-0 print:shadow-none print:w-full print:max-w-none print:rounded-none">
        {/* Controls Bar - Hidden during printing */}
        <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-900 text-sm sm:text-base">
              Postal Shipping Label (9cm × 14cm)
            </span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-0.5 rounded-full">
              {orders.length} {orders.length === 1 ? 'Label' : 'Labels'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-black text-white font-extrabold py-2 px-4 rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>Print Labels</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================= PRINT CSS INJECTION ================= */}
        <style dangerouslySetInnerHTML={{ __html: `
          @page {
            size: 90mm 140mm;
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
              visibility: hidden;
            }
            #shipping-labels-printable-root, #shipping-labels-printable-root * {
              visibility: visible;
            }
            #shipping-labels-printable-root {
              position: absolute;
              left: 0;
              top: 0;
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
              border: 2px solid #000000 !important;
              box-sizing: border-box !important;
              overflow: hidden !important;
              margin: 0 !important;
              padding: 0 !important;
              background: #ffffff !important;
            }
          }
        ` }} />

        {/* Printable Labels Area */}
        <div id="shipping-labels-printable-root" className="space-y-6 print:space-y-0 flex flex-col items-center">
          {orders.map((order, idx) => {
            const items = order.items && order.items.length > 0 ? order.items : [];
            const addressLines = formatAddressLines(order);
            const totalQty = items.reduce((s, it) => s + (parseInt(it.qty || it.quantity || 1, 10)), 0);

            return (
              <div
                key={order.id || idx}
                className="shipping-label-sticker bg-white text-black w-[90mm] h-[140mm] min-h-[140mm] max-h-[140mm] border-2 border-black flex flex-col justify-between font-sans leading-tight shadow-md print:shadow-none overflow-hidden box-border select-none"
                style={{
                  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'
                }}
              >
                {/* 1. TOP HEADER */}
                <div className="border-b-2 border-black py-1 px-2 text-center bg-white">
                  <h1 className="text-[12px] font-black tracking-widest uppercase text-black">
                    SHIPPING LABEL
                  </h1>
                </div>

                {/* 2. TO: CUSTOMER DESTINATION */}
                <div className="border-b-2 border-black p-2 bg-white flex-1">
                  <span className="text-[9.5px] font-black uppercase text-slate-700 tracking-wider block mb-0.5">
                    TO:
                  </span>
                  <p className="text-[12px] font-black uppercase tracking-tight text-black line-clamp-1">
                    {order.customer_name || order.customer?.name || 'Customer'}
                  </p>
                  <p className="text-[11px] font-black text-black flex items-center gap-1 my-0.5">
                    <span>📞</span>
                    <span>{order.customer_phone || order.customer?.phone || '-'}</span>
                  </p>
                  <div className="text-[10px] font-medium leading-[1.3] text-black space-y-0.5 mt-0.5">
                    {addressLines.map((line, lIdx) => (
                      <p key={lIdx} className={lIdx === addressLines.length - 1 ? 'font-black text-[10.5px]' : ''}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>

                {/* 3. FROM: STORE DETAILS & PERMANENT POSTAL ID */}
                <div className="border-b-2 border-black p-2 bg-white">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[9.5px] font-black uppercase text-slate-700 tracking-wider">
                      FROM:
                    </span>
                    <span className="text-[10px] font-black bg-black text-white px-2 py-0.5 rounded tracking-wide">
                      Postal ID: 1879696070
                    </span>
                  </div>
                  <p className="text-[11.5px] font-black uppercase text-black leading-snug">
                    SRI CHAITANYA BOOK CENTRE
                  </p>
                  <p className="text-[9.5px] font-medium leading-[1.3] text-black mt-0.5">
                    Konark Theatre Ln, opp. ICICI ATM, Gaddiannaram, Madhura Puri Colony, Dilsukhnagar, Hyderabad, Telangana - 500060
                  </p>
                  <p className="text-[10.5px] font-black text-black mt-0.5 flex items-center gap-1">
                    <span>📞</span>
                    <span>09177110134</span>
                  </p>
                </div>

                {/* 4. ORDER ID & PAYMENT STRIP */}
                <div className="border-b-2 border-black px-2 py-1 flex items-center justify-between bg-slate-50 text-[10.5px]">
                  <div>
                    <span className="font-extrabold text-slate-600">Order ID: </span>
                    <span className="font-mono font-black text-black text-[11px]">
                      {order.order_code || `ORD${order.id}`}
                    </span>
                  </div>
                  <div>
                    <span className="font-extrabold text-slate-600">Payment: </span>
                    <span className="font-black uppercase text-black">
                      {order.status || 'Paid'}
                    </span>
                  </div>
                </div>

                {/* 5. ITEM DETAILS (ALL BOOKS & QUANTITIES) */}
                <div className="border-b-2 border-black p-2 bg-white">
                  <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-wider text-slate-700 border-b border-black/40 pb-0.5 mb-1">
                    <span>ITEM DETAILS ({items.length || 1} TITLE{items.length > 1 ? 'S' : ''})</span>
                    <span className="text-right">QTY</span>
                  </div>

                  <div className="space-y-1 max-h-[28mm] overflow-hidden">
                    {items.length > 0 ? (
                      items.slice(0, 6).map((item, iIdx) => {
                        const title = item.product_name || item.book_title || item.name || 'Competitive Book';
                        const qty = item.qty || item.quantity || 1;
                        return (
                          <div key={iIdx} className="flex justify-between items-start text-[9.5px] leading-tight">
                            <span className="font-bold text-black line-clamp-1 pr-2 flex-1">
                              {iIdx + 1}. {title}
                            </span>
                            <span className="font-black font-mono text-black shrink-0">
                              {qty}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <div className="flex justify-between items-start text-[9.5px]">
                        <span className="font-bold text-black">Sri Chaitanya Educational Books</span>
                        <span className="font-black font-mono text-black">{totalQty || 1}</span>
                      </div>
                    )}

                    {items.length > 6 && (
                      <p className="text-[8.5px] font-bold text-slate-600 italic">
                        +{items.length - 6} more book(s) in parcel
                      </p>
                    )}
                  </div>
                </div>

                {/* 6. BARCODE & FOOTER */}
                <div className="p-1.5 bg-white text-center">
                  <div className="px-2">
                    <BarcodeSvg text={order.order_code || `ORD${order.id}`} height={30} />
                  </div>
                  <p className="text-[10px] font-mono font-black text-black tracking-widest mt-0.5">
                    {order.order_code || `ORD${order.id}`}
                  </p>
                  <p className="text-[8.5px] font-bold text-slate-700 uppercase tracking-wider mt-0.5">
                    Thank you for your order
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
