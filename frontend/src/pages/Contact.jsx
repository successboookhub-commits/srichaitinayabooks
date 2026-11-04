import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  CheckCircle,
  ExternalLink,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
  Compass
} from 'lucide-react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('Book Availability');
  const [activeFaq, setActiveFaq] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const queryTopics = [
    'Book Availability',
    'Order Delivery & Tracking',
    'Bulk / Institute Order',
    'Payment Query',
    'General Enquiry'
  ];

  const faqs = [
    {
      q: 'How do I place an order online?',
      a: 'Browse our books catalog, add study guides to your cart, and proceed to instant checkout with fast courier dispatch across AP & Telangana.'
    },
    {
      q: 'How fast do you dispatch book orders?',
      a: 'Orders confirmed before 2:00 PM are dispatched on the same day via Express courier with an SMS/WhatsApp tracking link.'
    },
    {
      q: 'Do you offer Cash on Delivery (COD)?',
      a: 'Yes, Cash on Delivery is available across most serviceable pin codes throughout Telangana and Andhra Pradesh.'
    },
    {
      q: 'Can I visit the bookstore in person?',
      a: 'Yes, our retail store in Dilsukhnagar, Hyderabad is open 7 days a week from 10:00 AM to 9:00 PM.'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen py-6 sm:py-8">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 space-y-8">
        
        {/* Breadcrumb & Clean Minimal Header (No Red Box) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 mb-3">
            <Link to="/" className="hover:text-red-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">Contact Us</span>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold border border-red-100">
                <Sparkles className="w-3.5 h-3.5" />
                Dedicated Customer Care
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                Get in Touch with Sri Chaitanya Book Centre
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
                Have questions regarding competitive exam books, syllabus materials, bulk orders, or your parcel delivery? Reach out to our expert team anytime.
              </p>
            </div>

            {/* Quick Status Pill */}
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-xl shrink-0">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <div>
                <p className="text-[11px] font-bold text-emerald-800 leading-none">Support Desk Online</p>
                <p className="text-[10px] text-emerald-600 mt-0.5">Average reply time &lt; 15 mins</p>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Quick Info Contact Channels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. Direct Phone Helpline */}
          <a
            href="tel:09177110134"
            className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-red-500 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700">Toll Free</span>
            </div>
            <div className="mt-4">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Helpline</h2>
              <p className="text-base font-extrabold text-slate-900 mt-0.5">09177110134</p>
              <p className="text-xs text-red-600 font-semibold mt-2 flex items-center gap-1 group-hover:underline">
                Tap to Call Directly &rarr;
              </p>
            </div>
          </a>

          {/* 2. Official WhatsApp Chat */}
          <a
            href="https://wa.me/919177110134?text=Hello%20Sri%20Chaitanya%20Books,%20I%20have%20an%20enquiry%20regarding%20books"
            target="_blank"
            rel="noreferrer"
            className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-emerald-500 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">Instant</span>
            </div>
            <div className="mt-4">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">WhatsApp Support</h2>
              <p className="text-base font-extrabold text-slate-900 mt-0.5">+91 91771 10134</p>
              <p className="text-xs text-emerald-600 font-semibold mt-2 flex items-center gap-1 group-hover:underline">
                Chat on WhatsApp &rarr;
              </p>
            </div>
          </a>

          {/* 3. Official Email Support */}
          <a
            href="mailto:srichaitanyabookcentre@gmail.com"
            className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-blue-500 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">Official</span>
            </div>
            <div className="mt-4">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Support</h2>
              <p className="text-xs font-extrabold text-slate-900 mt-1 truncate" title="srichaitanyabookcentre@gmail.com">
                srichaitanyabookcentre@gmail.com
              </p>
              <p className="text-xs text-blue-600 font-semibold mt-2 flex items-center gap-1 group-hover:underline">
                Send Email &rarr;
              </p>
            </div>
          </a>

          {/* 4. Bookstore Retail Store */}
          <a
            href="https://www.google.com/maps/search/?api=1&query=Konark+Theatre+Lane+Dilsukhnagar+Hyderabad"
            target="_blank"
            rel="noreferrer"
            className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-amber-500 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">Store</span>
            </div>
            <div className="mt-4">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Store Location</h2>
              <p className="text-xs font-extrabold text-slate-900 mt-1">Dilsukhnagar, Hyderabad</p>
              <p className="text-xs text-amber-600 font-semibold mt-2 flex items-center gap-1 group-hover:underline">
                Open in Maps &rarr;
              </p>
            </div>
          </a>

        </div>

        {/* Main Grid: Contact Form (Left) & Location / FAQ (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (7 cols): Sleek Modern Message Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
            <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Send Us a Direct Message</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Fill in your details and our team will get in touch with you promptly.
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Secure & Confidential</span>
              </div>
            </div>

            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle className="w-9 h-9" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">Message Received Successfully!</h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out to Sri Chaitanya Book Centre. Our team will review your query and reply back to you via Phone / WhatsApp shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                  }}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Topic Select Chips */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    What is this enquiry regarding?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {queryTopics.map((topic) => (
                      <button
                        type="button"
                        key={topic}
                        onClick={() => setSelectedTopic(topic)}
                        className={`text-xs font-medium px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                          selectedTopic === topic
                            ? 'bg-red-600 text-white border-red-600 shadow-xs font-bold'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Your Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Phone Number (WhatsApp) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Subject / Book Title
                  </label>
                  <input
                    type="text"
                    placeholder={`e.g. ${selectedTopic} - Enquiry`}
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Your Message / Query Details <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Please specify book names, author/publication, or your order tracking number..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-bold text-sm shadow-md shadow-red-500/20 hover:shadow-red-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message to Support</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column (5 cols): Store Location, Hours, & FAQ */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Store Location Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                    <Compass className="w-4 h-4" />
                  </div>
                  <h2 className="font-extrabold text-base text-slate-900">Visit Our Bookstore</h2>
                </div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Konark+Theatre+Lane+Dilsukhnagar+Hyderabad"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-red-600 font-bold flex items-center gap-1 hover:underline"
                >
                  <span>Directions</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Physical Address Details */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">Retail Outlet & Headquarters</h3>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Konark Theatre Lane, Opp. ICICI ATM, Gaddiannaram, Madhura Puri Colony, Dilsukhnagar, Hyderabad, Telangana – 500060.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">Store Hours</h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Monday to Sunday: <span className="font-semibold text-slate-900">10:00 AM – 9:00 PM</span>
                    </p>
                    <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
                      Open all 7 days including government holidays
                    </p>
                  </div>
                </div>
              </div>

              {/* Embedded Google Map */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 relative aspect-video w-full bg-slate-100">
                <iframe
                  title="Sri Chaitanya Book Centre Location"
                  src="https://maps.google.com/maps?q=Konark%20Theatre%20Lane%2C%20Dilsukhnagar%2C%20Hyderabad&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            </div>

            {/* Quick Support FAQs Accordion */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-4">
                <HelpCircle className="w-5 h-5 text-red-600" />
                <h2 className="font-extrabold text-base text-slate-900">Frequently Asked Questions</h2>
              </div>

              <div className="space-y-2.5">
                {faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="border border-slate-100 rounded-xl overflow-hidden transition-all bg-slate-50/50 hover:bg-slate-50"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-3.5 text-left flex items-center justify-between gap-3 cursor-pointer"
                    >
                      <span className="text-xs font-bold text-slate-800">{faq.q}</span>
                      {activeFaq === idx ? (
                        <ChevronUp className="w-4 h-4 text-red-600 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>
                    {activeFaq === idx && (
                      <div className="px-3.5 pb-3.5 text-xs text-slate-600 leading-relaxed border-t border-slate-100/80 pt-2.5">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
