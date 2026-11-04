import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  ShieldCheck,
  Truck,
  Headphones,
  Award,
  MapPin,
  Phone,
  Mail,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Clock,
  Star,
  Users,
  PackageCheck,
  Compass,
  HeartHandshake
} from 'lucide-react';

export default function About() {
  const [activeTab, setActiveTab] = useState('mission');

  const stats = [
    { label: 'Aspirants Empowered', value: '50,000+', icon: Users, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Competitive Exam Titles', value: '15,000+', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Original Stock Guarantee', value: '100%', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Districts Across TS & AP', value: '33+', icon: Truck, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const milestones = [
    {
      year: '2014',
      title: 'Humble Beginnings in Dilsukhnagar',
      desc: 'Founded in Konark Theatre Lane, Hyderabad as a dedicated hub for competitive aspirants seeking genuine academic and state exam books.',
    },
    {
      year: '2018',
      title: 'Direct Publisher & Faculty Alliances',
      desc: 'Partnered with renowned publication houses like Telugu Academy, Shine India, and Vijeta to provide first-hand authentic editions.',
    },
    {
      year: '2022',
      title: 'Digital Support & Express Dispatch',
      desc: 'Pioneered instant digital customer support and express parcel delivery reaching even remote mandals across Telangana and Andhra Pradesh.',
    },
    {
      year: '2026',
      title: 'Next-Gen E-Commerce Platform',
      desc: 'Launched our modern real-time portal featuring barcode tracking, instant stock visibility, and 24-hour dispatch assurance.',
    },
  ];

  const pillars = [
    {
      title: '100% Notification Compliant',
      desc: 'Every book is verified for the latest government notifications, revised syllabus, and updated schemes.',
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      title: 'Unbeatable Student Discounts',
      desc: 'We pass maximum publisher discounts directly to students so preparation remains affordable for all.',
      icon: Award,
      color: 'text-red-600 bg-red-50 border-red-100',
    },
    {
      title: 'Same-Day Express Dispatch',
      desc: 'Orders placed before 2:00 PM are packed and handed over to India Post / Express couriers on the same day.',
      icon: PackageCheck,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    },
    {
      title: 'Tamper-Proof Bubble Packaging',
      desc: 'Multi-layer waterproof wrapping ensures your precious study books reach your doorstep in showroom condition.',
      icon: ShieldCheck,
      color: 'text-purple-600 bg-purple-50 border-purple-100',
    },
    {
      title: 'All Competitive Exams Under One Roof',
      desc: 'From TGPSC, APPSC, SI/Constable, RRB to UPSC, DSC, TET and Banking — find standard textbooks & PYQ sets instantly.',
      icon: BookOpen,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
    {
      title: 'Human-First WhatsApp & Call Help',
      desc: 'Direct helpline (09177110134) manned by experienced staff who understand Telugu & English competitive syllabi.',
      icon: Headphones,
      color: 'text-rose-600 bg-rose-50 border-rose-100',
    },
  ];

  const testimonials = [
    {
      quote: 'Secured State Rank in TGPSC Group-4! Sri Chaitanya delivered all the Telugu Academy standard texts and previous question banks to Warangal within 24 hours.',
      author: 'K. Sai Krishna',
      rank: 'TGPSC Group-4 Ranker',
      location: 'Warangal',
    },
    {
      quote: 'The best bookstore for Police SI & Constable mains material. Authentic books, accurate syllabus, and safe packing delivered right to our village.',
      author: 'P. Venkatesh',
      rank: 'Police SI Aspirant',
      location: 'Guntur, AP',
    },
    {
      quote: 'Their WhatsApp service is incredible. Sent a photo of the book list at 11 AM, received courier tracking by 3 PM. Highly recommended for all serious aspirants.',
      author: 'M. Divya',
      rank: 'APPSC Group-2 Aspirant',
      location: 'Vijayawada',
    },
  ];

  return (
    <div className="w-full bg-slate-50 min-h-screen py-6 sm:py-8 space-y-12">
      
      {/* 1. Grand Hero Header Section with Ambient Glow & Right-side Image */}
      <section className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="relative rounded-3xl bg-white border border-slate-200/90 shadow-sm overflow-hidden p-6 sm:p-10 lg:p-12">
          {/* Subtle Ambient Radial Backdrops */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-100/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-100/30 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            {/* Left Column: Heading, Story & CTAs */}
            <div className="lg:col-span-7 space-y-4">
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                <Link to="/" className="hover:text-red-600 transition-colors">Home</Link>
                <span>/</span>
                <span className="text-slate-800 font-semibold">About Us</span>
              </nav>

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 text-red-700 text-xs font-extrabold border border-red-200/80 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-red-600" />
                <span>South India's Premier Competitive Bookstore</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Fueling the Dreams of Over <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">50,000+</span> Future Officers & Ranks.
              </h1>

              <p className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed font-normal max-w-2xl">
                From SI & Constable aspirants in remote villages to IAS, IPS, and Group-1 candidates across Hyderabad and Andhra Pradesh — <strong>Sri Chaitanya Book Centre</strong> has been the trusted sanctuary for authentic, notification-compliant study materials for more than a decade.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  to="/shop"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-red-500/25 transition-all flex items-center gap-2 group cursor-pointer"
                >
                  <span>Explore Exam Catalog</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <a
                  href="https://wa.me/919177110134?text=Hello%20Sri%20Chaitanya%20Books,%20I%20would%20like%20to%20enquire%20about%20exam%20books"
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 text-slate-800 hover:text-emerald-700 font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Chat with Academic Team</span>
                </a>
              </div>
            </div>

            {/* Right Column: Previous Featured Image Showcase */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="relative w-full max-w-md mx-auto group">
                {/* Ambient Halo Behind Image */}
                <div className="absolute -inset-3 bg-gradient-to-tr from-red-500/20 via-rose-500/15 to-amber-500/20 rounded-3xl blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Card Container with the Previous Image */}
                <div className="relative rounded-3xl bg-white border border-slate-200/90 p-4 sm:p-6 shadow-xl group-hover:shadow-2xl transition-all duration-300 flex items-center justify-center overflow-hidden">
                  <img
                    src="/images/sri_about.webp"
                    alt="Sri Chaitanya Book Centre"
                    className="w-full h-auto max-h-[320px] object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = '/images/ebook_logo.png';
                    }}
                  />

                  {/* Floating Micro Badge - Top Right */}
                  <div className="absolute top-3.5 right-3.5 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-xl px-2.5 py-1 shadow-md flex items-center gap-1.5 pointer-events-none">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-[10px] font-extrabold text-slate-800 uppercase tracking-tight">100% Genuine</span>
                  </div>

                  {/* Floating Micro Badge - Bottom Left */}
                  <div className="absolute bottom-3.5 left-3.5 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl px-3 py-1 shadow-lg flex items-center gap-2 text-white pointer-events-none">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-bold">Dilsukhnagar, HYD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Stats Ribbon */}
      <section className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-red-400 transition-all flex items-center gap-4 group"
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-xs`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
                    {s.value}
                  </p>
                  <p className="text-[11px] sm:text-xs font-semibold text-slate-500 mt-0.5">
                    {s.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. The Bento Story Showcase */}
      <section className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Hero Card (7 Cols) - Real Store Identity */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">
                <HeartHandshake className="w-4 h-4" />
                <span>Our Heritage & Dedication</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Rooted in Dilsukhnagar, Hyderabad. Reaching Every Corner of Telugu States.
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Situated at the bustling heart of competitive coaching in Konark Theatre Lane, Dilsukhnagar, Sri Chaitanya Book Centre began with one clear vision: <em>Every student deserves original, error-free syllabus books at the lowest possible cost</em>.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Whether you are preparing for TSPSC Group 1, 2, 4, APPSC Mains, Sub-Inspector (SI), Constable, Railways RRB, or Central SSC — our team handpicks every title in collaboration with premier authors and publishing institutions to eliminate pirated, obsolete prints.
              </p>
            </div>

            {/* Showcase Visual Pod with Floating Badges */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-8 shadow-inner flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 z-10">
                <div className="w-16 h-16 rounded-2xl bg-white p-2 shrink-0 shadow-lg border border-slate-100 flex items-center justify-center">
                  <img
                    src="/images/mini_logo.png"
                    alt="Sri Chaitanya Seal"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = '/images/sri_about.webp';
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">Sri Chaitanya Book Centre</h3>
                  <p className="text-xs text-slate-300 mt-0.5">Konark Theatre Lane, Dilsukhnagar, Hyderabad</p>
                  <p className="text-[11px] text-amber-400 font-semibold mt-1 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>4.9 / 5 Rating from 25,000+ Students</span>
                  </p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 rounded-xl text-center shrink-0">
                <span className="block text-xs uppercase tracking-wider text-red-300 font-bold">Store Status</span>
                <span className="text-sm font-extrabold text-white">Open 7 Days a Week</span>
                <span className="block text-[11px] text-emerald-300 font-medium mt-0.5">10:00 AM – 9:00 PM</span>
              </div>
            </div>
          </div>

          {/* Right Bento Column (5 Cols) - Mission & Trust Highlights */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Bento Card 1: Our Core Pledge */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-7 shadow-md flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-extrabold tracking-tight">Our Academic Pledge</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  "No aspirant should fail an exam simply because they couldn't afford or find the right book on time. We guarantee fair pricing, instant dispatch, and authentic publisher editions for every competitive dreamer."
                </p>
              </div>
              <div className="pt-4 border-t border-slate-700/80 flex items-center justify-between text-xs text-slate-400">
                <span>Management Commitment</span>
                <span className="font-bold text-white">Sri Chaitanya Team</span>
              </div>
            </div>

            {/* Bento Card 2: Official Publisher Direct Alliances */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">Direct Publisher Partnerships</h4>
                  <p className="text-[11px] text-slate-500">Zero middlemen, zero duplicate prints</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct authorized distributors for <strong>Telugu Academy, Shine India, Vijeta Competitions, Yes&Yes, AK Publications, Jagadish Sir, and Chary's Publications</strong>.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 4. Our Journey & Milestones (Interactive Roadmap) */}
      <section className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">
              A Decade of Trust
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Our Journey Over the Years
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              How a neighborhood bookstore grew into South India's premier online preparation destination.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className="relative bg-slate-50/70 hover:bg-white rounded-2xl border border-slate-200/80 p-6 transition-all duration-300 hover:shadow-lg hover:border-red-400 group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-red-600 tracking-tight">{m.year}</span>
                    <span className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 shadow-xs group-hover:bg-red-600 group-hover:text-white group-hover:border-red-600 transition-colors">
                      0{idx + 1}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-red-600 transition-colors">
                    {m.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. The 6 Pillars of Sri Chaitanya Excellence */}
      <section className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">
            Why We Are Different
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            The 6 Pillars of Sri Chaitanya Trust
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Every order is backed by stringent quality checks, prompt dispatches, and genuine care for your success.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:shadow-xl hover:border-red-400 hover:-translate-y-1 transition-all duration-300 space-y-4 group"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xs ${p.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-red-600 transition-colors">
                  {p.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Rankers & Aspirants Real Voices (Testimonials) */}
      <section className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mb-8 space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-red-400 bg-red-950/60 border border-red-800/60 px-3 py-1 rounded-full">
              Success Testimonials
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              What Achievers Say About Us
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Thousands of candidates in Telangana & Andhra Pradesh have secured dream government jobs with our study materials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-700 flex items-center justify-between text-xs">
                  <div>
                    <h3 className="font-extrabold text-white">{t.author}</h3>
                    <p className="text-[11px] text-red-400 font-semibold">{t.rank}</p>
                  </div>
                  <span className="text-[11px] text-slate-400">{t.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
