import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  PackageCheck,
  Truck,
  Zap,
  Clock,
  ArrowUpRight,
  Heart,
  ChevronRight
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-b from-slate-950 via-[#070b14] to-black text-slate-300 pt-6 pb-20 md:pb-6 mt-4 sm:mt-6 lg:mt-8 border-t border-slate-800/80 overflow-hidden">
      {/* Top Subtle Red Glow Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-90" />
      
      {/* Background Ambient Glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-32 bg-red-600/10 blur-3xl pointer-events-none rounded-full" />

      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        
        {/* ================= COMPACT TRUST RIBBON (Clean, uncropped badges) ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 pb-6 border-b border-slate-800/70">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-red-500/30 transition-all group">
            <div className="w-8 h-8 rounded-lg bg-red-600/15 border border-red-500/20 flex items-center justify-center text-red-500 shrink-0 group-hover:scale-110 transition-transform">
              <Truck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h5 className="text-white font-bold text-xs leading-snug">Fast Express Shipping</h5>
              <p className="text-[11px] text-slate-400 leading-snug mt-0.5">Across Telangana & AP (24H Dispatch)</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/30 transition-all group">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/15 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-110 transition-transform">
              <PackageCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h5 className="text-white font-bold text-xs leading-snug">Moisture-Proof Packing</h5>
              <p className="text-[11px] text-slate-400 leading-snug mt-0.5">Safe & Secure Courier Delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-amber-500/30 transition-all group">
            <div className="w-8 h-8 rounded-lg bg-amber-600/15 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-110 transition-transform">
              <Zap className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h5 className="text-white font-bold text-xs leading-snug">Instant Order Tracking</h5>
              <p className="text-[11px] text-slate-400 leading-snug mt-0.5">Live SMS & Consignment Updates</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-sky-500/30 transition-all group">
            <div className="w-8 h-8 rounded-lg bg-sky-600/15 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0 group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h5 className="text-white font-bold text-xs leading-snug">Orders & Enquiries</h5>
              <a href="tel:09177110134" className="text-[11px] text-slate-400 hover:text-white transition-colors leading-snug block mt-0.5">
                09177110134 (Store Time: 10 AM - 6 PM)
              </a>
            </div>
          </div>
        </div>

        {/* ================= MAIN COMPACT COLUMNS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8 py-6">
          
          {/* Brand & Socials (Col span 4) */}
          <div className="lg:col-span-4 space-y-3">
            <div>
              <Link
                to="/"
                className="inline-flex items-center bg-white hover:bg-slate-50 px-3.5 py-1.5 rounded-xl shadow-xs hover:shadow-md transition-all group w-fit"
                title="Sri Chaitanya Book Centre"
              >
                <img
                  src="/images/ebook_logo.png"
                  alt="Sri Chaitanya Book Centre"
                  className="h-8 sm:h-9 w-auto object-contain group-hover:scale-102 transition-transform duration-200"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.nextElementSibling) {
                      e.currentTarget.nextElementSibling.style.display = 'flex';
                    }
                  }}
                />
                {/* Fallback Brand Badge if image fails */}
                <div style={{ display: 'none' }} className="items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-red-600 to-rose-700 flex items-center justify-center text-white font-black text-xs shadow-md shadow-red-500/20">
                    SC
                  </div>
                  <div>
                    <span className="font-black text-sm tracking-tight text-slate-900 block leading-tight">
                      SRI CHAITANYA <span className="text-red-600">BOOK CENTRE</span>
                    </span>
                  </div>
                </div>
              </Link>
              <p className="text-[9px] tracking-widest text-slate-400 font-extrabold uppercase mt-1 pl-1">
                Dilsukhnagar • Hyderabad
              </p>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Your premier bookstore for competitive examination guides, APPSC & TGPSC Groups, Police, Railways, SSC, and official syllabus editions.
            </p>

            {/* Official Original Brand Color Social Media Icons */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Connect With Us
              </p>
              <div className="flex items-center gap-2.5">
                {/* WhatsApp */}
                <a
                  href="https://wa.me/919177110134"
                  target="_blank"
                  rel="noreferrer"
                  title="WhatsApp"
                  className="w-9 h-9 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center transition-all hover:scale-110 shadow-md shadow-[#25D366]/25 cursor-pointer"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.074-1.921-.462-1.644-.683-2.697-2.355-2.778-2.464-.082-.109-.661-.88-.661-1.68 0-.799.414-1.192.56-1.353.148-.162.324-.202.433-.202.109 0 .216.002.31.007.1.005.234-.038.366.279.135.324.461 1.127.502 1.209.041.082.068.179.014.288-.054.108-.082.176-.162.27-.082.095-.172.211-.246.284-.082.081-.168.169-.072.333.095.165.424.7.912 1.134.629.56 1.161.733 1.326.815.164.081.26.072.357-.04.097-.113.414-.482.524-.648.11-.165.22-.138.368-.083.149.055.946.446 1.109.528.163.082.272.122.312.19.04.068.04.394-.104.799z"/>
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.528 3.659 1.442 5.168L2.054 22l4.98-1.309A9.956 9.956 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.053c-1.614 0-3.137-.47-4.428-1.282l-.317-.199-2.955.776.789-2.881-.218-.348A8.04 8.04 0 013.947 12C3.947 7.558 7.558 3.947 12 3.947c4.442 0 8.053 3.611 8.053 8.053 0 4.442-3.611 8.053-8.053 8.053z"/>
                  </svg>
                </a>

                {/* Telegram */}
                <a
                  href="https://t.me/srichaitanyabooks"
                  target="_blank"
                  rel="noreferrer"
                  title="Telegram"
                  className="w-9 h-9 rounded-xl bg-[#24A1DE] hover:bg-[#1d8bc0] text-white flex items-center justify-center transition-all hover:scale-110 shadow-md shadow-[#24A1DE]/25 cursor-pointer"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .34z"/>
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com/@srichaitanyabooks"
                  target="_blank"
                  rel="noreferrer"
                  title="YouTube"
                  className="w-9 h-9 rounded-xl bg-[#FF0000] hover:bg-[#d60000] text-white flex items-center justify-center transition-all hover:scale-110 shadow-md shadow-[#FF0000]/25 cursor-pointer"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com/srichaitanyabooks"
                  target="_blank"
                  rel="noreferrer"
                  title="Instagram"
                  className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-90 text-white flex items-center justify-center transition-all hover:scale-110 shadow-md shadow-[#dc2743]/25 cursor-pointer"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href="https://facebook.com/srichaitanyabooks"
                  target="_blank"
                  rel="noreferrer"
                  title="Facebook"
                  className="w-9 h-9 rounded-xl bg-[#1877F2] hover:bg-[#1465cf] text-white flex items-center justify-center transition-all hover:scale-110 shadow-md shadow-[#1877F2]/25 cursor-pointer"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links (Col span 2) */}
          <div className="lg:col-span-2">
            <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Explore Store
            </h5>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <Link to="/" className="hover:text-red-400 transition-colors flex items-center gap-1 group">
                  <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-red-500 transition-colors" />
                  <span>Home Page</span>
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-red-400 transition-colors flex items-center gap-1 group">
                  <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-red-500 transition-colors" />
                  <span>All Books & Materials</span>
                </Link>
              </li>
              <li>
                <Link to="/publications" className="hover:text-red-400 transition-colors flex items-center gap-1 group">
                  <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-red-500 transition-colors" />
                  <span>Top Publications</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-red-400 transition-colors flex items-center gap-1 group">
                  <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-red-500 transition-colors" />
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-red-400 transition-colors flex items-center gap-1 group">
                  <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-red-500 transition-colors" />
                  <span>Contact Support</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Exam Categories (Col span 3) */}
          <div className="lg:col-span-3">
            <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Exam Categories
            </h5>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <Link to="/shop?category_id=10" className="hover:text-red-400 transition-colors flex items-center gap-1 group">
                  <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-red-500 transition-colors" />
                  <span>TGPSC & APPSC Group 1, 2, 4</span>
                </Link>
              </li>
              <li>
                <Link to="/shop?category_id=9" className="hover:text-red-400 transition-colors flex items-center gap-1 group">
                  <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-red-500 transition-colors" />
                  <span>Police SI & Constables</span>
                </Link>
              </li>
              <li>
                <Link to="/shop?category_id=16" className="hover:text-red-400 transition-colors flex items-center gap-1 group">
                  <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-red-500 transition-colors" />
                  <span>RRB Railways (NTPC, Group D, ALP)</span>
                </Link>
              </li>
              <li>
                <Link to="/shop?category_id=15" className="hover:text-red-400 transition-colors flex items-center gap-1 group">
                  <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-red-500 transition-colors" />
                  <span>SSC CGL, CHSL, MTS & GD</span>
                </Link>
              </li>
              <li>
                <Link to="/shop?category_id=2" className="hover:text-red-400 transition-colors flex items-center gap-1 group">
                  <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-red-500 transition-colors" />
                  <span>UPSC Civil Services</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Store Location & Staff (Col span 3) */}
          <div className="lg:col-span-3 space-y-2.5">
            <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Store & Orders
            </h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                <span className="leading-snug">Konark Theatre Ln, opp. ICICI ATM, Dilsukhnagar, Hyd - 500060</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="leading-snug text-slate-300 font-semibold">Store Time: 10:00 AM – 6:00 PM</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a href="tel:09177110134" className="hover:text-white font-bold text-white transition-colors">
                  09177110134 (Call or Message)
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <a href="mailto:srichaitanyabookcentre@gmail.com" className="hover:text-white transition-colors truncate">
                  srichaitanyabookcentre@gmail.com
                </a>
              </li>
            </ul>

            <div className="pt-2 flex items-center gap-2 text-xs">
              <Link
                to="/order-history"
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-[11px] font-semibold transition-all inline-flex items-center gap-1"
              >
                <span>Track Order</span>
                <ArrowUpRight className="w-3 h-3 text-red-400" />
              </Link>
              <Link
                to="/admin/login"
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 border border-white/5 text-[11px] font-semibold transition-all"
              >
                Staff Portal
              </Link>
            </div>
          </div>
        </div>

        {/* ================= COMPACT BOTTOM BAR ================= */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © {currentYear} <span className="text-slate-300 font-bold">Sri Chaitanya Book Centre</span>. All rights reserved.
          </div>

          {/* Sleek Trust & Payment Badges */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-400">UPI</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-400">GPay</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-400">PhonePe</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-400">RuPay</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-400">Visa / MC</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-emerald-400">NetBanking</span>
          </div>

          <div className="text-slate-400 flex items-center gap-1">
            <span>Made with</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
            <span>for Competitive Aspirants</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
