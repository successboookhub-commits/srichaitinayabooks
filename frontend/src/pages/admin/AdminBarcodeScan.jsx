import React, { useState } from 'react';
import { ScanBarcode, CheckCircle, AlertTriangle, ArrowRight, RefreshCw, UploadCloud, Truck } from 'lucide-react';
import api from '../../services/api';

export default function AdminBarcodeScan() {
  const [inputText, setInputText] = useState('');
  const [status, setStatus] = useState('Shipped');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleProcessScans = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) {
      setError('Please paste or scan barcode / order codes into the input box.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await api.post('/orders/scan-courier', {
        scans: inputText,
        status: status
      });
      setResult(res.data);
      setInputText('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process barcode scans.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <ScanBarcode className="w-7 h-7 text-emerald-600" />
          Warehouse Courier Barcode Scanner
        </h1>
        <p className="text-sm text-slate-500">
          Scan parcels or paste courier dispatch lists (TSV / CSV / Lines) to automatically update order dispatch states.
        </p>
      </div>

      {/* Main Scanner Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
        <form onSubmit={handleProcessScans} className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Target Status upon Scan
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Set status to:</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Shipped">Shipped / Dispatched</option>
                <option value="Packing">Packing</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Barcode Scanner Input / TSV Courier Sheet
            </label>
            <textarea
              rows={8}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Point your barcode scanner here or paste TSV / line by line:&#10;ORD-20260210-9821&#10;ORD-20260210-4412&#10;ORD-20260211-1004"
              className="w-full p-4 font-mono text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 placeholder-slate-400 leading-relaxed"
            />
            <p className="text-[11px] text-slate-400 mt-1.5">
              Supports single scan inputs, multi-line scans, or Excel/TSV pastes containing Order Codes.
            </p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setInputText('');
                setResult(null);
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <Truck className="w-4 h-4" /> Process & Update Orders
                </>
              )}
            </button>
          </div>
        </form>

        {/* Results Display */}
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200 animate-fade-in space-y-4">
            <h3 className="text-base font-bold text-slate-900">Scan Summary</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl">
                <p className="text-xs font-bold text-emerald-800 uppercase">Successfully Updated</p>
                <p className="text-3xl font-black text-emerald-700 mt-1">{result.updated?.length || 0}</p>
                <p className="text-[11px] text-emerald-600 mt-0.5">Parcels marked as {status}</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                <p className="text-xs font-bold text-slate-600 uppercase">Total Lines Read</p>
                <p className="text-3xl font-black text-slate-800 mt-1">{result.total_scanned || 0}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Scanned codes</p>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl">
                <p className="text-xs font-bold text-amber-800 uppercase">Not Found / Skipped</p>
                <p className="text-3xl font-black text-amber-700 mt-1">{result.not_found?.length || 0}</p>
                <p className="text-[11px] text-amber-600 mt-0.5">Unmatched order IDs</p>
              </div>
            </div>

            {/* List of updated */}
            {result.updated?.length > 0 && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Updated Orders:
                </p>
                <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                  {result.updated.map((code, idx) => (
                    <span
                      key={idx}
                      className="font-mono text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg"
                    >
                      {code}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* List of not found */}
            {result.not_found?.length > 0 && (
              <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200">
                <p className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-2">
                  Unmatched Barcodes:
                </p>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                  {result.not_found.map((code, idx) => (
                    <span
                      key={idx}
                      className="font-mono text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-lg"
                    >
                      {code}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

