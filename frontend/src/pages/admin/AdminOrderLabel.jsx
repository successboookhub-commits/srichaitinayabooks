import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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

// Available Paper Sizes for Admin Selection - Supports A4, Legal, A5, 4x6 Thermal, 9x14 cm, A3, Compact
const PAPER_CONFIGS = {
  a4: {
    id: 'a4',
    name: 'A4 Sheet',
    dims: '210 × 297 mm',
    desc: 'Standard Full Sheet Dispatch Slip',
    pageSizeCss: 'A4 portrait',
    marginCss: '6mm',
    heightMm: '284mm',
    widthMm: '194mm',
    previewMaxWidth: '194mm',
    isLarge: true,
  },
  legal: {
    id: 'legal',
    name: 'Legal Sheet',
    dims: '216 × 356 mm',
    desc: 'Official Legal Size (8.5" × 14")',
    pageSizeCss: 'legal portrait',
    marginCss: '6mm',
    heightMm: '343mm',
    widthMm: '202mm',
    previewMaxWidth: '202mm',
    isLarge: true,
  },
  a5: {
    id: 'a5',
    name: 'A5 Sheet',
    dims: '148 × 210 mm',
    desc: 'Half A4 Sheet Dispatch Slip',
    pageSizeCss: 'A5 portrait',
    marginCss: '5mm',
    heightMm: '199mm',
    widthMm: '138mm',
    previewMaxWidth: '138mm',
    isLarge: false,
  },
  '4x6': {
    id: '4x6',
    name: '4" × 6" Thermal',
    dims: '100 × 150 mm',
    desc: 'Standard Courier Thermal Roll',
    pageSizeCss: '100mm 150mm',
    marginCss: '2mm',
    heightMm: '145mm',
    widthMm: '96mm',
    previewMaxWidth: '96mm',
    isLarge: false,
  },
  '9x14': {
    id: '9x14',
    name: '9 × 14 cm Sticker',
    dims: '90 × 140 mm',
    desc: 'Courier & India Post Sticker',
    pageSizeCss: '90mm 140mm',
    marginCss: '2mm',
    heightMm: '135mm',
    widthMm: '86mm',
    previewMaxWidth: '86mm',
    isLarge: false,
  },
  compact: {
    id: 'compact',
    name: 'Compact 4.1"',
    dims: '105 × 148 mm',
    desc: 'Quarter Sheet / 4-per-A4 Label',
    pageSizeCss: 'A4 portrait',
    marginCss: '5mm',
    heightMm: '147mm',
    widthMm: '105mm',
    previewMaxWidth: '105mm',
    isLarge: false,
  },
  a3: {
    id: 'a3',
    name: 'A3 Sheet',
    dims: '297 × 420 mm',
    desc: 'Large Poster Sheet',
    pageSizeCss: 'A3 portrait',
    marginCss: '10mm',
    heightMm: '399mm',
    widthMm: '275mm',
    previewMaxWidth: '275mm',
    isLarge: true,
  },
};

export default function AdminOrderLabel({ orders, onClose }) {
  const [mounted, setMounted] = useState(false);
  const [paperSize, setPaperSize] = useState('a4');

  useEffect(() => {
    setMounted(true);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      setMounted(false);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!orders || orders.length === 0 || !mounted) return null;

  const selectedConfig = PAPER_CONFIGS[paperSize] || PAPER_CONFIGS.a4;
  const isLarge = selectedConfig.isLarge;

  // Bulletproof Multi-Page Printing via Isolated Hidden Iframe
  // Ensures Chrome never clips to 1 sheet and forces clean multi-sheet pagination
  const handlePrint = () => {
    const printableArea = document.getElementById('shipping-labels-printable-root');
    if (!printableArea) {
      window.print();
      return;
    }

    // Clean up any old print iframe
    const oldIframe = document.getElementById('isolated-shipping-print-iframe');
    if (oldIframe) {
      oldIframe.remove();
    }

    // Collect all stylesheets (production <link> tags + dev-mode <style> tags)
    const styleLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
      .map((el) => el.outerHTML)
      .join('\n');

    const iframe = document.createElement('iframe');
    iframe.id = 'isolated-shipping-print-iframe';
    iframe.style.position = 'fixed';
    iframe.style.left = '-10000px';
    iframe.style.top = '0';
    // Real size so the label can be measured before printing
    iframe.style.width = '1400px';
    iframe.style.height = '1000px';
    iframe.style.border = '0';
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Shipping Labels Print</title>
          ${styleLinks}
          <style>
            @page {
              size: ${selectedConfig.pageSizeCss};
              margin: ${selectedConfig.marginCss};
            }
            * {
              box-sizing: border-box !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              background: #ffffff !important;
              color: #000000 !important;
              font-family: Arial, Helvetica, sans-serif !important;
              width: 100% !important;
              height: auto !important;
              min-height: 0 !important;
              overflow: visible !important;
            }
            #shipping-labels-printable-root > * {
              margin: 0 !important;
            }
            /* Each sticker = exactly ONE physical sheet (fixed height, never splits) */
            .shipping-label-sticker {
              display: block !important;
              position: relative !important;
              width: ${selectedConfig.widthMm} !important;
              max-width: ${selectedConfig.widthMm} !important;
              height: ${selectedConfig.heightMm} !important;
              max-height: ${selectedConfig.heightMm} !important;
              overflow: hidden !important;
              margin: 0 auto !important;
              background: #ffffff !important;
              border: 2.5px solid #000000 !important;
              box-shadow: none !important;
              page-break-before: auto !important;
              page-break-after: always !important;
              break-after: page !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            .shipping-label-sticker:last-child {
              page-break-after: auto !important;
              break-after: auto !important;
            }
            .label-fit {
              display: flex !important;
              flex-direction: column !important;
              transform-origin: top left !important;
            }
            table {
              width: 100% !important;
              border-collapse: collapse !important;
            }
          </style>
        </head>
        <body>
          <div id="shipping-labels-printable-root">
            ${printableArea.innerHTML}
          </div>
        </body>
      </html>
    `);
    doc.close();

    // Shrink each sheet's content (if needed) so TO + FROM + all its books fit on ONE sheet.
    const fitLabelsToPage = () => {
      const stickers = doc.querySelectorAll('.shipping-label-sticker');
      stickers.forEach((sticker) => {
        const inner = sticker.querySelector('.label-fit');
        if (!inner) return;
        const availH = sticker.clientHeight; // inside border
        let scale = 1;
        for (let i = 0; i < 6; i++) {
          inner.style.width = `${100 / scale}%`;
          inner.style.minHeight = '0px';
          const neededH = inner.scrollHeight;
          const next = Math.min(1, (availH - 2) / neededH);
          if (Math.abs(next - scale) < 0.005) {
            scale = next;
            break;
          }
          scale = next;
        }
        inner.style.width = `${100 / scale}%`;
        inner.style.minHeight = `${availH / scale}px`; // fill the sheet so footer sits at bottom
        inner.style.transform = scale < 1 ? `scale(${scale})` : 'none';
      });
    };

    const waitForStyles = () => {
      const links = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'));
      const pending = links
        .filter((l) => !l.sheet)
        .map((l) => new Promise((res) => {
          l.addEventListener('load', res, { once: true });
          l.addEventListener('error', res, { once: true });
        }));
      const fontsReady = doc.fonts && doc.fonts.ready ? doc.fonts.ready : Promise.resolve();
      return Promise.race([
        Promise.all([...pending, fontsReady]),
        new Promise((res) => setTimeout(res, 2500)),
      ]);
    };

    waitForStyles().then(() => {
      setTimeout(() => {
        try {
          fitLabelsToPage();
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        } catch (err) {
          console.error('Iframe print error, falling back to window.print():', err);
          window.print();
        }
      }, 150);
    });
  };

  const modalContent = (
    <div id="shipping-labels-portal-root">
      {/* Screen Backdrop & Centered Modal */}
      <div
        className="print-modal-backdrop fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-start p-2 sm:p-4 overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose?.();
        }}
      >
        <div className="print-modal-card bg-white rounded-3xl max-w-5xl w-full p-4 sm:p-6 shadow-2xl my-auto">

          {/* Top Control Bar - Hidden during printing */}
          <div className="print-control-bar pb-3.5 mb-4 border-b border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
                  {orders.length} {orders.length === 1 ? 'Order' : 'Orders'} • Page 1: Shipping Label (TO/FROM) • Page 2+: Order Items Manifest (Only Books)
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
                    {Object.values(PAPER_CONFIGS).map((cfg) => (
                      <option key={cfg.id} value={cfg.id}>
                        {cfg.name} ({cfg.dims}) - {cfg.desc}
                      </option>
                    ))}
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
                  title="Close Preview (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Select Size Pills Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-thin">
              <span className="text-slate-500 text-[10px] uppercase font-bold shrink-0 mr-1">Quick Select:</span>
              {Object.values(PAPER_CONFIGS).map((cfg) => (
                <button
                  key={cfg.id}
                  type="button"
                  onClick={() => setPaperSize(cfg.id)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold transition-all cursor-pointer shrink-0 ${
                    paperSize === cfg.id
                      ? 'bg-red-600 text-white border-red-600 shadow-sm scale-102'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/80 hover:text-black'
                  }`}
                >
                  {cfg.name}
                </button>
              ))}
            </div>
          </div>

          {/* Printable Area */}
          <div id="shipping-labels-printable-root" className="space-y-6 block w-full">
            {orders.map((order, orderIdx) => {
              const rawItems = order.items && order.items.length > 0 ? order.items : [];
              const addressLines = formatAddressLines(order);
              const totalItemsCount = rawItems.length;

              // SMART PAGE SPLIT LOGIC:
              // Page 1 has TO & FROM address + exactly the first 5 books.
              // Page 2+ are CONTINUATION MANIFESTS with NO TO/FROM address, only the remaining books!
              const pages = [];
              if (rawItems.length <= 5) {
                pages.push({
                  isFirstPage: true,
                  items: rawItems,
                  startBookNo: 1,
                });
              } else {
                // Page 1: exactly first 5 books with TO/FROM
                pages.push({
                  isFirstPage: true,
                  items: rawItems.slice(0, 5),
                  startBookNo: 1,
                });
                // Subsequent pages: up to 10 books per continuation page, NO TO/FROM
                const remaining = rawItems.slice(5);
                const CHUNK_SIZE = 10;
                for (let i = 0; i < remaining.length; i += CHUNK_SIZE) {
                  pages.push({
                    isFirstPage: false,
                    items: remaining.slice(i, i + CHUNK_SIZE),
                    startBookNo: 6 + i,
                  });
                }
              }
              const totalPages = pages.length;

              const orderCode = order.order_code || `ORD${order.id}`;
              let orderPayment = order.status || 'Paid';
              if (orderPayment.toLowerCase() === 'delivered' || orderPayment.toLowerCase() === 'processing') {
                orderPayment = 'Paid';
              }

              const customerName = order.customer_name || order.customer?.name || 'Customer';
              const customerPhone = order.customer_phone || order.customer?.phone || '-';
              const state = order.state || order.customer?.state || 'Telangana / Andhra Pradesh';
              const pincode = order.pincode || order.customer?.pincode || '';

              return pages.map((page, pageIdx) => {
                const pageNo = pageIdx + 1;
                const isFirstPage = page.isFirstPage;
                const chunkItems = page.items;
                const startBookNo = page.startBookNo;
                const endBookNo = startBookNo + chunkItems.length - 1;

                return (
                  <div
                    key={`${order.id || orderIdx}-page-${pageNo}`}
                    className="shipping-label-sticker bg-white text-black border-[2.5px] border-black flex flex-col justify-start shadow-md print:shadow-none box-border select-none my-3 mx-auto"
                    style={{
                      width: '100%',
                      maxWidth: selectedConfig.previewMaxWidth,
                      boxSizing: 'border-box',
                      fontFamily: 'Arial, Helvetica, sans-serif',
                    }}
                  >
                    <div className="label-fit flex flex-col flex-1">
                    {/* TOP HEADER */}
                    <div className={`border-b-[2px] border-black bg-white text-center ${isLarge ? 'py-3 px-4' : 'py-2 px-3'}`}>
                      <h1 className={`${isLarge ? 'text-[20px] sm:text-[22px]' : 'text-[16px]'} font-black uppercase tracking-wide text-black m-0 leading-tight`}>
                        SRI CHAITANYA BOOK CENTRE
                      </h1>
                      <div className={`${isLarge ? 'text-[16px] sm:text-[17px]' : 'text-[14.5px]'} font-extrabold uppercase tracking-widest text-black mt-0.5`}>
                        {isFirstPage ? 'SHIPPING LABEL' : 'ORDER ITEMS MANIFEST (CONTINUED)'}
                        {totalPages > 1 && (
                          <span className="text-[12px] font-bold text-slate-800 ml-1.5 tracking-normal">
                            (Page {pageNo} of {totalPages})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* ONLY ON PAGE 1: TO & FROM ADDRESS SECTIONS (MATCHING SAMPLE SLIP) */}
                    {isFirstPage ? (
                      <>
                        {/* TO: CONSIGNEE - Exact format matching sample slip: address lines ending with state - pincode */}
                        <div className={`border-b-[1.5px] border-black bg-white ${isLarge ? 'p-4' : 'p-3'}`}>
                          <div className={`${isLarge ? 'text-[13px]' : 'text-[11.5px]'} font-black uppercase text-slate-700 tracking-wider mb-1`}>
                            TO:
                          </div>
                          <div className={`${isLarge ? 'text-[20px] sm:text-[22px]' : 'text-[16.5px]'} font-black uppercase text-black leading-snug mb-1`}>
                            {customerName}
                          </div>
                          <div className={`${isLarge ? 'text-[17px]' : 'text-[15px]'} font-black text-black mb-1.5 flex items-center gap-1.5`}>
                            <span>📞</span>
                            <span className="font-mono tracking-wide">{customerPhone}</span>
                          </div>
                          <div className={`${isLarge ? 'text-[15px] space-y-0.5' : 'text-[13px] space-y-0.5'} font-semibold text-black leading-snug capitalize`}>
                            {addressLines.map((line, lIdx) => (
                              <p key={lIdx} className="m-0">{line}</p>
                            ))}
                            <p className="m-0 font-bold">{state}{pincode ? ` - ${pincode}` : ''}</p>
                          </div>
                        </div>

                        {/* FROM: SENDER */}
                        <div className={`border-b-[1.5px] border-black bg-white leading-snug ${isLarge ? 'p-4 text-[14px]' : 'p-3 text-[12.5px]'}`}>
                          <div className={`${isLarge ? 'text-[13px]' : 'text-[11.5px]'} font-black uppercase text-slate-700 tracking-wider mb-1`}>
                            FROM:
                          </div>
                          <div className={`font-black ${isLarge ? 'text-[16.5px]' : 'text-[14.5px]'} uppercase text-black mb-0.5`}>
                            SRI CHAITANYA BOOK CENTRE
                          </div>
                          <div className={`text-black ${isLarge ? 'text-[14px] leading-normal' : 'text-[12.5px] leading-snug'} font-medium`}>
                            Konark Theatre Ln, opposite ICICI ATM,<br />
                            Gaddiannaram, Madhura Puri Colony,<br />
                            Dilsukhnagar, Hyderabad,<br />
                            Telangana - 500060
                          </div>
                          <div className={`text-black ${isLarge ? 'text-[15.5px]' : 'text-[13.5px]'} font-black mt-1.5 flex items-center gap-1.5`}>
                            <span>📞</span>
                            <span className="font-mono font-black">09177110134</span>
                          </div>
                        </div>

                        {/* ORDER ID & PAYMENT STRIP */}
                        <div className={`border-b-[1.5px] border-black bg-white flex items-center justify-between ${isLarge ? 'p-3 text-[15px]' : 'p-2.5 text-[13px]'}`}>
                          <div>
                            <span className="font-bold text-slate-700">Order ID: </span>
                            <span className={`font-mono font-black ${isLarge ? 'text-[17px]' : 'text-[15px]'} text-black tracking-wide`}>{orderCode}</span>
                          </div>
                          <div>
                            <span className="font-bold text-slate-700">Payment: </span>
                            <span className={`font-black ${isLarge ? 'text-[16px]' : 'text-[14px]'} uppercase text-black`}>{orderPayment}</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      /* PAGE 2+: COMPACT ORDER SUMMARY BAR (NO DUPLICATE TO/FROM ADDRESS) */
                      <div className={`border-b-[1.5px] border-black bg-slate-50 flex flex-wrap items-center justify-between gap-2 ${isLarge ? 'p-3.5 text-[15px]' : 'p-3 text-[13px]'}`}>
                        <div>
                          <span className="font-bold text-slate-600">Order ID: </span>
                          <span className="font-mono font-black text-black">{orderCode}</span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-600">Customer: </span>
                          <span className="font-black text-black uppercase">{customerName}</span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-600">Payment: </span>
                          <span className="font-black text-black uppercase">{orderPayment}</span>
                        </div>
                      </div>
                    )}

                    {/* ITEM DETAILS TABLE */}
                    <div className={`bg-white border-b-[1.5px] border-black flex-1 ${isLarge ? 'p-4' : 'p-3'}`}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className={`${isLarge ? 'text-[13px]' : 'text-[11.5px]'} font-black uppercase text-slate-800 tracking-wider`}>
                          {isFirstPage ? 'ITEM DETAILS:' : 'REMAINING ITEMS LIST:'}
                        </span>
                        {totalItemsCount > 0 && (
                          <span className={`${isLarge ? 'text-[12px]' : 'text-[10.5px]'} font-bold text-slate-600`}>
                            (Books {startBookNo} to {endBookNo} of {totalItemsCount})
                          </span>
                        )}
                      </div>

                      <table className="w-full border-collapse">
                        <thead>
                          <tr>
                            <th className={`text-left border-b-[1.5px] border-black py-1 px-1 ${isLarge ? 'text-[13px]' : 'text-[11.5px]'} font-black uppercase text-black`}>
                              PRODUCT
                            </th>
                            <th className={`text-center border-b-[1.5px] border-black py-1 px-1 ${isLarge ? 'text-[13px]' : 'text-[11.5px]'} font-black uppercase text-black w-[16%]`}>
                              QTY
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {chunkItems.length > 0 ? (
                            chunkItems.map((item, itemIdx) => {
                              const bookNo = startBookNo + itemIdx;
                              const rawTitle = item.product_name || item.book_title || item.name || 'Competitive Book';
                              const cleanTitle = String(rawTitle).replace(/\.{2,}$/, '').trim();
                              const title = toTitleCase(cleanTitle);
                              const qty = parseInt(item.qty || item.quantity || 1, 10);

                              return (
                                <tr key={itemIdx} className="border-b border-dashed border-slate-300 last:border-b-0">
                                  <td className={`py-1.5 px-1 ${isLarge ? 'text-[13.5px]' : 'text-[12px]'} font-semibold text-black leading-snug`}>
                                    <span className="font-bold mr-1">{bookNo}.</span>
                                    {title}
                                  </td>
                                  <td className={`py-1.5 px-1 text-center font-mono font-black ${isLarge ? 'text-[15px]' : 'text-[13px]'} text-black`}>
                                    {qty}
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td className={`py-1.5 px-1 ${isLarge ? 'text-[14px]' : 'text-[12.5px]'} font-semibold text-black leading-snug`}>
                                <span className="font-bold mr-1">1.</span>
                                Sri Chaitanya Examination Study Material
                              </td>
                              <td className={`py-1.5 px-1 text-center font-mono font-black ${isLarge ? 'text-[16px]' : 'text-[13.5px]'} text-black`}>
                                1
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>

                      {/* Note on Page 1 if more books exist on next page */}
                      {isFirstPage && totalPages > 1 && (
                        <div className="mt-2 text-right">
                          <span className="text-[11px] font-extrabold text-slate-700 italic">
                            ☞ (Remaining {totalItemsCount - 5} Books Continued on Page 2)
                          </span>
                        </div>
                      )}
                    </div>

                    {/* FOOTER (NO BARCODE AS REQUESTED) */}
                    <div className={`py-2 px-3 text-center ${isLarge ? 'text-[14px]' : 'text-[12.5px]'} font-bold text-black bg-white`}>
                      Thank you for your order 📦
                    </div>
                    </div>
                  </div>
                );
              });
            })}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
