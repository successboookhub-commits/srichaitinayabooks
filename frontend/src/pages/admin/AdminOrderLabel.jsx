import React, { useState } from 'react';
import { Printer, X, CheckCircle2, FileText, ChevronDown } from 'lucide-react';
import toTitleCase from '../../utils/titleCase.js';

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
      className="w-full max-h-[32px] mx-auto block"
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
  const city = (order.city || '').trim();
  const district = (order.district || '').trim();
  const state = (order.state || 'Andhra Pradesh / Telangana').trim();

  let line1 = [door ? `D.No: ${door}` : '', addr].filter(Boolean).join(', ');
  if (line1) parts.push(line1);

  let line2 = [mandal, city && city !== mandal ? city : '', district].filter(Boolean).join(', ');
  if (line2) parts.push(line2);

  if (state) parts.push(state);

  return parts;
}

// Available Paper Sizes for Admin Selection
const PAPER_CONFIGS = {
  a4: {
    id: 'a4',
    name: 'A4 Sheet',
    dims: '210 × 297 mm',
    desc: 'Standard Office Paper (Full Dispatch Slip)',
    pageSizeCss: 'A4 portrait',
    marginCss: '10mm',
    widthMm: '160mm',
    minHeightMm: '240mm',
    maxHeightMm: null,
    isSheet: true,
  },
  '9x14': {
    id: '9x14',
    name: '9 × 14 cm Sticker',
    dims: '90 × 140 mm',
    desc: 'Courier & India Post Thermal Sticker',
    pageSizeCss: '90mm 140mm portrait',
    marginCss: '0mm',
    widthMm: '90mm',
    minHeightMm: '140mm',
    maxHeightMm: '140mm',
    isSheet: false,
  },
  '4x6': {
    id: '4x6',
    name: '4" × 6" Thermal',
    dims: '100 × 150 mm',
    desc: 'Standard Courier Thermal Roll',
    pageSizeCss: '100mm 150mm portrait',
    marginCss: '0mm',
    widthMm: '100mm',
    minHeightMm: '150mm',
    maxHeightMm: '150mm',
    isSheet: false,
  },
  a5: {
    id: 'a5',
    name: 'A5 Sheet',
    dims: '148 × 210 mm',
    desc: 'Half Sheet Dispatch Slip',
    pageSizeCss: 'A5 portrait',
    marginCss: '8mm',
    widthMm: '132mm',
    minHeightMm: '190mm',
    maxHeightMm: null,
    isSheet: true,
  },
  a3: {
    id: 'a3',
    name: 'A3 Sheet',
    dims: '297 × 420 mm',
    desc: 'Large Poster Sheet',
    pageSizeCss: 'A3 portrait',
    marginCss: '15mm',
    widthMm: '260mm',
    minHeightMm: '370mm',
    maxHeightMm: null,
    isSheet: true,
  },
};

export default function AdminOrderLabel({ orders, onClose }) {
  if (!orders || orders.length === 0) return null;

  // Default to A4 as explicitly requested by user
  const [paperSize, setPaperSize] = useState('a4');
  const selectedConfig = PAPER_CONFIGS[paperSize] || PAPER_CONFIGS.a4;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-start p-2 sm:p-4 overflow-y-auto">
      {/* Outer Card */}
      <div className="bg-white rounded-3xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl my-auto print:m-0 print:p-0 print:shadow-none print:w-full print:max-w-none print:rounded-none">

        {/* Top Control Bar - Hidden during printing */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 mb-4 border-b border-slate-200 print:hidden">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-black text-slate-900 text-sm sm:text-base">
                Shipping Label & Dispatch Print
              </span>
              <span className="text-[11px] bg-red-100 text-red-800 font-extrabold px-2 py-0.5 rounded-md border border-red-200">
                {selectedConfig.name} ({selectedConfig.dims})
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              {orders.length} {orders.length === 1 ? 'Label' : 'Labels'} • Seamless top-to-bottom layout (No middle gaps)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Paper Size Selector Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <label htmlFor="paper-size-select" className="text-[10px] font-bold text-slate-600 px-1 uppercase">
                Paper Size:
              </label>
              <select
                id="paper-size-select"
                value={paperSize}
                onChange={(e) => setPaperSize(e.target.value)}
                className="bg-white text-xs font-bold text-slate-800 py-1.5 px-3 rounded-lg border border-slate-300 shadow-2xs cursor-pointer focus:ring-2 focus:ring-red-500 focus:outline-none"
              >
                <option value="a4">A4 Sheet (210 × 297 mm) - Standard</option>
                <option value="9x14">9 × 14 cm Sticker (India Post / Courier)</option>
                <option value="4x6">4" × 6" Thermal (100 × 150 mm)</option>
                <option value="a5">A5 Sheet (148 × 210 mm) - Half Page</option>
                <option value="a3">A3 Sheet (297 × 420 mm) - Large</option>
              </select>
            </div>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-black py-2 px-4 rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-white" />
              <span>Print ({selectedConfig.name})</span>
            </button>

            {/* Close Preview */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors"
              title="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Paper Size Quick Pills */}
        <div className="flex items-center gap-1.5 mb-4 overflow-x-auto pb-1 text-[11px] font-bold print:hidden">
          <span className="text-slate-400 text-[10px] uppercase font-bold shrink-0">Quick Select:</span>
          {Object.values(PAPER_CONFIGS).map((cfg) => (
            <button
              key={cfg.id}
              type="button"
              onClick={() => setPaperSize(cfg.id)}
              className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer shrink-0 ${paperSize === cfg.id
                ? 'bg-red-600 text-white border-red-600 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
            >
              {cfg.name}
            </button>
          ))}
        </div>

        {/* ================= PRINT CSS INJECTION ================= */}
        <style dangerouslySetInnerHTML={{
          __html: `
          @page {
            size: ${selectedConfig.pageSizeCss};
            margin: ${selectedConfig.marginCss};
          }
          @media print {
            html, body {
              width: 100% !important;
              height: 100% !important;
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
              width: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
              display: flex !important;
              flex-direction: column !important;
              align-items: center !important;
            }
            .shipping-label-sticker {
              width: ${selectedConfig.widthMm} !important;
              ${selectedConfig.maxHeightMm ? `max-height: ${selectedConfig.maxHeightMm} !important;` : ''}
              min-height: ${selectedConfig.minHeightMm} !important;
              page-break-after: always !important;
              break-after: page !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              box-sizing: border-box !important;
              overflow: hidden !important;
              margin: 0 auto !important;
              padding: 2.5mm !important;
              background: #ffffff !important;
            }
          }
        ` }} />

        {/* Printable Area - Centered & Neatly Proportioned */}
        <div id="shipping-labels-printable-root" className="space-y-6 print:space-y-0 flex flex-col items-center w-full">
          {orders.map((order, idx) => {
            const items = order.items && order.items.length > 0 ? order.items : [];
            const addressLines = formatAddressLines(order);
            const totalQty = items.reduce((s, it) => s + (parseInt(it.qty || it.quantity || 1, 10)), 0);

            return (
              <div
                key={order.id || idx}
                className="shipping-label-sticker bg-white text-black border-2 border-black flex flex-col justify-start font-sans shadow-lg print:shadow-none box-border select-none overflow-hidden my-2 print:my-0"
                style={{
                  width: selectedConfig.widthMm,
                  minHeight: selectedConfig.minHeightMm,
                  maxHeight: selectedConfig.maxHeightMm || 'none',
                  padding: '2.5mm',
                  boxSizing: 'border-box',
                  fontFamily: 'Arial, Helvetica, sans-serif',
                }}
              >
                {/* INNER BORDER CONTAINER - Natural Top-to-Bottom Flow (No justify-between) */}
                <div className="w-full h-full border border-black flex flex-col justify-start leading-tight bg-white overflow-hidden">

                  {/* 1. BRAND & ROUTING HEADER */}
                  <div className="border-b border-black bg-black text-white px-3 py-1.5 flex items-center justify-between shrink-0">
                    <div>
                      <h1 className="text-xs sm:text-[13px] font-black tracking-wider uppercase leading-none">
                        SRI CHAITANYA BOOK CENTRE
                      </h1>
                      <p className="text-[8px] sm:text-[8.5px] font-medium text-slate-300 mt-0.5 tracking-wide">
                        ESTD. 1986 | DILSUKHNAGAR, HYDERABAD • COMPETITIVE EXAM BOOKS
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="bg-white text-black font-black text-[9px] sm:text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
                        {order.status === 'Paid' ? 'PREPAID' : 'SURFACE POST'}
                      </span>
                    </div>
                  </div>

                  {/* 2. BARCODE & ORDER ID STRIP */}
                  <div className="border-b border-black px-3 py-1.5 bg-white text-center shrink-0">
                    <BarcodeSvg text={order.order_code || `ORD${order.id}`} height={selectedConfig.isSheet ? 32 : 26} />
                    <div className="flex items-center justify-between mt-1 text-[9px] sm:text-[9.5px]">
                      <span className="font-mono font-black text-[10px] sm:text-[11px] tracking-wider text-black">
                        {order.order_code || `ORD${order.id}`}
                      </span>
                      <span className="text-slate-600 font-bold text-[8.5px] sm:text-[9px]">
                        Booking Date: {order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="font-bold uppercase text-[8px] sm:text-[8.5px] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-300">
                        SURFACE / SPEED POST
                      </span>
                    </div>
                  </div>

                  {/* 3. DELIVER TO / SHIP TO: CONTIGUOUS FLOW - NO BLANK GAPS */}
                  <div className="border-b border-black p-2.5 sm:p-3 bg-white flex flex-col justify-start shrink-0">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-200 mb-1">
                      <span className="text-[9px] sm:text-[9.5px] font-black uppercase tracking-widest text-slate-600">
                        DELIVER TO / SHIP TO:
                      </span>
                      <span className="text-[8px] sm:text-[8.5px] font-black text-slate-500 uppercase tracking-wider bg-slate-100 px-1.5 py-0.2 rounded">
                        CONSIGNEE
                      </span>
                    </div>

                    {/* Customer Name */}
                    <p className="text-[13.5px] sm:text-[15px] font-black uppercase text-black tracking-tight leading-snug">
                      {order.customer_name || order.customer?.name || 'Customer Name'}
                    </p>

                    {/* Contact Phone */}
                    <p className="text-[12px] sm:text-[13px] font-black text-black my-1 flex items-center gap-1.5">
                      <span className="bg-black text-white text-[8px] sm:text-[8.5px] px-1.5 py-0.5 rounded font-mono font-bold">TEL / MOB</span>
                      <span className="font-mono tracking-wider">{order.customer_phone || order.customer?.phone || '-'}</span>
                    </p>

                    {/* Full Address Lines */}
                    <div className="text-[10px] sm:text-[11.5px] font-semibold text-slate-900 leading-[1.35] space-y-0.5 my-0.5">
                      {addressLines.map((line, lIdx) => (
                        <p key={lIdx} className="capitalize">
                          {line}
                        </p>
                      ))}
                    </div>

                    {/* Destination PIN Box - Sits Directly Under Address Lines (No Middle Void) */}
                    <div className="mt-1.5 pt-1.5 border-t border-dashed border-slate-300 flex items-center justify-between">
                      <span className="text-[9px] sm:text-[10px] font-black uppercase text-slate-700 tracking-wider">
                        DESTINATION PINCODE:
                      </span>
                      <span className="bg-black text-white font-mono font-black text-[13.5px] sm:text-[15px] px-3.5 py-0.5 sm:py-1 rounded tracking-widest border border-black shadow-xs">
                        PIN: {order.pincode || '-'}
                      </span>
                    </div>
                  </div>

                  {/* 4. DISPATCH FROM / SENDER DETAILS */}
                  <div className="border-b border-black p-2 sm:p-2.5 bg-slate-50 text-[9px] sm:text-[9.5px] leading-tight shrink-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[8px] sm:text-[8.5px] font-black uppercase tracking-wider text-slate-600">
                        RETURN IF UNDELIVERED TO (BOOK STORE):
                      </span>
                      <span className="font-mono text-[8px] sm:text-[8.5px] font-bold text-slate-800 bg-slate-200 px-1.5 py-0.2 rounded">
                        Postal Reg ID: 1879696070
                      </span>
                    </div>
                    <p className="font-black text-[10.5px] sm:text-[11px] uppercase text-black">
                      SRI CHAITANYA BOOK CENTRE
                    </p>
                    <p className="text-slate-800 text-[8.5px] sm:text-[9px] font-medium leading-snug mt-0.5">
                      Konark Theatre Lane, opp. ICICI ATM, Dilsukhnagar, Hyderabad, Telangana - 500060
                    </p>
                    <p className="text-black text-[9px] sm:text-[9.5px] font-bold mt-1">
                      Helpline / WhatsApp: <span className="font-mono font-black text-[9.5px] sm:text-[10px]">09177110134</span>
                    </p>
                  </div>

                  {/* 5. ITEM CONTENTS MANIFEST */}
                  <div className="p-2 sm:p-2.5 bg-white text-[9px] sm:text-[9.5px] shrink-0 border-b border-black/20">
                    <div className="flex justify-between items-center text-[8px] sm:text-[8.5px] font-black uppercase tracking-wider text-slate-600 border-b border-slate-200 pb-0.5 mb-1">
                      <span>BOOK DESCRIPTION ({items.length || 1} TITLE{items.length > 1 ? 'S' : ''})</span>
                      <span className="font-mono font-bold">TOTAL QTY: {totalQty || 1}</span>
                    </div>

                    <div className="space-y-0.5 max-h-[22mm] overflow-hidden">
                      {items.length > 0 ? (
                        items.slice(0, 4).map((item, iIdx) => {
                          const title = toTitleCase(item.product_name || item.book_title || item.name || 'Competitive Book');
                          const qty = item.qty || item.quantity || 1;
                          return (
                            <div key={iIdx} className="flex justify-between items-start text-[8.5px] sm:text-[9px] leading-tight">
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
                        <div className="flex justify-between items-start text-[8.5px] sm:text-[9px]">
                          <span className="font-semibold text-black">Sri Chaitanya Competitive Examination Material</span>
                          <span className="font-mono font-bold text-black">x{totalQty || 1}</span>
                        </div>
                      )}
                      {items.length > 4 && (
                        <p className="text-[7.5px] sm:text-[8px] font-bold text-slate-500 italic">
                          +{items.length - 4} more titles included in this parcel
                        </p>
                      )}
                    </div>

                    <div className="mt-1 pt-1 border-t border-slate-200 flex justify-between items-center text-[7.5px] sm:text-[8px] font-bold text-slate-600 uppercase tracking-wider">
                      <span>Handle With Care • Printed Books</span>
                      <span className="font-black text-black text-[9px] sm:text-[9.5px]">Total Paid: ₹{parseFloat(order.total || 0).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* 6. BOTTOM ACKNOWLEDGMENT & POSTAL ROUTING AREA */}
                  {/* Any extra gap remains cleanly at the bottom, not in the middle */}
                  <div className="mt-auto p-2 sm:p-2.5 bg-white flex flex-col justify-end">
                    <div className="pt-2 border-t border-dashed border-slate-300 flex items-end justify-between text-[7.5px] sm:text-[8px] text-slate-500">
                      <div>
                        <span className="font-bold text-slate-700 block uppercase text-[7px] sm:text-[7.5px]">Receiver Signature / Delivery Note:</span>
                        <div className="w-36 sm:w-44 border-b border-dotted border-slate-400 mt-3 sm:mt-4"></div>
                      </div>
                      <div className="text-right">
                        <span className="block font-mono text-[7px] sm:text-[7.5px] text-slate-400">Sri Chaitanya Express Logistics</span>
                        <span className="block font-bold text-[7px] sm:text-[7.5px] text-slate-600 uppercase">Verified Dispatch</span>
                      </div>
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
