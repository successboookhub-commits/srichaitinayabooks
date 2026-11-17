import React, { useState } from 'react';
import { Printer, X } from 'lucide-react';
import toTitleCase from '../../utils/titleCase.js';

// Clean address formatting helper
function formatAddressLines(order) {
  const parts = [];
  const door = (order.door_no || '').trim();
  const addr = (order.address || '').trim();
  const mandal = (order.mandal || '').trim();
  const city = (order.city || '').trim();
  const district = (order.district || '').trim();

  let line1 = [door ? `D.No: ${door}` : '', addr].filter(Boolean).join(', ');
  if (line1) parts.push(line1);

  let line2 = [mandal, city && city !== mandal ? city : '', district].filter(Boolean).join(', ');
  if (line2) parts.push(line2);

  return parts;
}

// Available Paper Sizes for Admin Selection
const PAPER_CONFIGS = {
  a4: {
    id: 'a4',
    name: 'A4 Sheet',
    dims: '210 × 297 mm',
    desc: 'Standard Office Paper',
    pageSizeCss: 'A4 portrait',
    marginCss: '5mm',
    widthMm: '105mm', // ~4.1 inches wide, perfectly fills shipping label
  },
  '9x14': {
    id: '9x14',
    name: '9 × 14 cm Sticker',
    dims: '90 × 140 mm',
    desc: 'Courier & India Post Sticker',
    pageSizeCss: '90mm 140mm portrait',
    marginCss: '2mm',
    widthMm: '86mm',
  },
  '4x6': {
    id: '4x6',
    name: '4" × 6" Thermal',
    dims: '100 × 150 mm',
    desc: 'Standard Courier Thermal Roll',
    pageSizeCss: '100mm 150mm portrait',
    marginCss: '2mm',
    widthMm: '96mm',
  },
};

export default function AdminOrderLabel({ orders, onClose }) {
  if (!orders || orders.length === 0) return null;

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
              {orders.length} {orders.length === 1 ? 'Order' : 'Orders'} • 5 Books Max Per Page (Automatic Multi-Page Overflow)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Paper Size Selector Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <label htmlFor="paper-size-select" className="text-[10px] font-bold text-slate-600 px-1 uppercase">
                Paper:
              </label>
              <select
                id="paper-size-select"
                value={paperSize}
                onChange={(e) => setPaperSize(e.target.value)}
                className="bg-white text-xs font-bold text-slate-800 py-1.5 px-3 rounded-lg border border-slate-300 shadow-2xs cursor-pointer focus:ring-2 focus:ring-red-500 focus:outline-none"
              >
                <option value="a4">A4 Sheet (210 × 297 mm)</option>
                <option value="9x14">9 × 14 cm Sticker (India Post)</option>
                <option value="4x6">4" × 6" Thermal (100 × 150 mm)</option>
              </select>
            </div>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-black py-2 px-4 rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-white" />
              <span>Print Label</span>
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
              height: auto !important;
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
              display: block !important;
            }
            .shipping-label-sticker {
              width: 100% !important;
              max-width: ${selectedConfig.widthMm} !important;
              height: auto !important;
              page-break-after: always !important;
              break-after: page !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              box-sizing: border-box !important;
              margin: 0 auto 0 auto !important;
              padding: 0 !important;
              background: #ffffff !important;
            }
            .shipping-label-sticker:last-child {
              page-break-after: auto !important;
              break-after: auto !important;
            }
          }
        ` }} />

        {/* Printable Area */}
        <div id="shipping-labels-printable-root" className="space-y-6 print:space-y-0 flex flex-col items-center w-full">
          {orders.map((order, orderIdx) => {
            const rawItems = order.items && order.items.length > 0 ? order.items : [];
            const addressLines = formatAddressLines(order);
            const totalItemsCount = rawItems.length;

            // Exactly 5 books per page
            const chunks = [];
            if (rawItems.length === 0) {
              chunks.push([]);
            } else {
              for (let i = 0; i < rawItems.length; i += 5) {
                chunks.push(rawItems.slice(i, i + 5));
              }
            }
            const totalChunks = chunks.length;

            const orderCode = order.order_code || `ORD${order.id}`;
            let orderPayment = order.status || 'Paid';
            if (orderPayment.toLowerCase() === 'delivered' || orderPayment.toLowerCase() === 'processing') {
              orderPayment = 'Paid';
            }

            const customerName = order.customer_name || order.customer?.name || 'Customer';
            const customerPhone = order.customer_phone || order.customer?.phone || '-';
            const state = order.state || order.customer?.state || 'Telangana / Andhra Pradesh';
            const pincode = order.pincode || order.customer?.pincode || '';

            return chunks.map((chunkItems, chunkIdx) => {
              const pageNo = chunkIdx + 1;

              return (
                <div
                  key={`${order.id || orderIdx}-page-${pageNo}`}
                  className="shipping-label-sticker bg-white text-black border-[2.5px] border-black flex flex-col justify-start shadow-md print:shadow-none box-border select-none my-3 print:my-0"
                  style={{
                    width: '100%',
                    maxWidth: '4.1in',
                    boxSizing: 'border-box',
                    fontFamily: 'Arial, Helvetica, sans-serif',
                  }}
                >
                  {/* TOP HEADER: BRAND NAME & SHIPPING LABEL */}
                  <div className="border-b-[2px] border-black bg-white text-center py-2 px-3">
                    <h1 className="text-[16px] font-black uppercase tracking-wide text-black m-0 leading-tight">
                      SRI CHAITANYA BOOK CENTRE
                    </h1>
                    <div className="text-[14.5px] font-extrabold uppercase tracking-widest text-black mt-0.5">
                      SHIPPING LABEL
                      {totalChunks > 1 && (
                        <span className="text-[12px] font-bold text-slate-800 ml-1.5 tracking-normal">
                          (Page {pageNo} of {totalChunks})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* TO: CONSIGNEE */}
                  <div className="border-b-[1.5px] border-black p-3 bg-white">
                    <div className="text-[12px] font-black uppercase text-slate-800 tracking-wider mb-1">
                      TO:
                    </div>
                    <div className="text-[17px] font-black uppercase text-black leading-snug mb-1">
                      {customerName}
                    </div>
                    <div className="text-[15.5px] font-black text-black mb-1.5 flex items-center gap-1.5">
                      <span>📞</span>
                      <span className="font-mono tracking-wide">{customerPhone}</span>
                    </div>
                    <div className="text-[13.5px] font-semibold text-slate-900 leading-[1.45] space-y-0.5 capitalize mb-2">
                      {addressLines.map((line, lIdx) => (
                        <p key={lIdx} className="m-0">{line}</p>
                      ))}
                      <p className="m-0">{state} - {pincode}</p>
                    </div>
                    <div className="pt-1.5 border-t border-dashed border-slate-400 flex items-center justify-between">
                      <span className="text-[13.5px] font-black uppercase text-black">
                        PIN CODE:
                      </span>
                      <span className="font-mono font-black text-[20px] text-black tracking-widest">
                        {pincode || '------'}
                      </span>
                    </div>
                  </div>

                  {/* FROM: SENDER */}
                  <div className="border-b-[1.5px] border-black p-3 bg-white text-[12.5px] leading-snug">
                    <div className="text-[12px] font-black uppercase text-slate-800 tracking-wider mb-1">
                      FROM:
                    </div>
                    <div className="font-black text-[14.5px] uppercase text-black mb-0.5">
                      SRI CHAITANYA BOOK CENTRE
                    </div>
                    <div className="text-slate-800 text-[12.5px] font-medium leading-snug">
                      Konark Theatre Ln, opposite ICICI ATM,<br />
                      Gaddiannaram, Madhura Puri Colony,<br />
                      Dilsukhnagar, Hyderabad,<br />
                      Telangana - 500060
                    </div>
                    <div className="text-black text-[13.5px] font-bold mt-1.5 flex items-center gap-1.5">
                      <span>📞</span>
                      <span className="font-mono font-black">09177110134</span>
                    </div>
                  </div>

                  {/* ORDER ID & PAYMENT */}
                  <div className="border-b-[1.5px] border-black p-3 bg-white flex items-center justify-between text-[13.5px]">
                    <div>
                      <span className="font-bold text-slate-700">Order ID: </span>
                      <span className="font-mono font-black text-[15px] text-black tracking-wide">{orderCode}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-700">Payment: </span>
                      <span className="font-black text-[14px] uppercase text-black">{orderPayment}</span>
                    </div>
                  </div>

                  {/* ITEM DETAILS: EXACTLY UP TO 5 BOOKS PER PAGE */}
                  <div className="p-3 bg-white border-b-[1.5px] border-black">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[12px] font-black uppercase text-slate-800 tracking-wider">
                        ITEM DETAILS:
                      </span>
                      {totalItemsCount > 0 && (
                        <span className="text-[11px] font-extrabold text-slate-600">
                          (Books {(chunkIdx * 5) + 1} to {Math.min((chunkIdx * 5) + chunkItems.length, totalItemsCount)} of {totalItemsCount})
                        </span>
                      )}
                    </div>

                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="text-left border-b-[1.5px] border-black py-1 px-1 text-[11.5px] font-black uppercase text-black">
                            PRODUCT
                          </th>
                          <th className="text-center border-b-[1.5px] border-black py-1 px-1 text-[11.5px] font-black uppercase text-black w-[16%]">
                            QTY
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {chunkItems.length > 0 ? (
                          chunkItems.map((item, itemIdx) => {
                            const bookNo = (chunkIdx * 5) + itemIdx + 1;
                            const rawTitle = item.product_name || item.book_title || item.name || 'Competitive Book';
                            const cleanTitle = String(rawTitle).replace(/\.{2,}$/, '').trim();
                            const title = toTitleCase(cleanTitle);
                            const qty = parseInt(item.qty || item.quantity || 1, 10);

                            return (
                              <tr key={itemIdx} className="border-b border-dashed border-slate-300 last:border-b-0">
                                <td className="py-1.5 px-1 text-[12.5px] font-semibold text-black leading-snug">
                                  <span className="font-bold mr-1">{bookNo}.</span>
                                  {title}
                                </td>
                                <td className="py-1.5 px-1 text-center font-mono font-black text-[13.5px] text-black">
                                  {qty}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td className="py-1.5 px-1 text-[12.5px] font-semibold text-black leading-snug">
                              <span className="font-bold mr-1">1.</span>
                              Sri Chaitanya Examination Study Material
                            </td>
                            <td className="py-1.5 px-1 text-center font-mono font-black text-[13.5px] text-black">
                              1
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* FOOTER (NO BARCODE AS REQUESTED) */}
                  <div className="py-2 px-3 text-center text-[12.5px] font-bold text-black bg-white">
                    Thank you for your order 📦
                  </div>
                </div>
              );
            });
          })}
        </div>
      </div>
    </div>
  );
}
