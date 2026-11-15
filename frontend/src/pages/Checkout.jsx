import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { useCartStore } from '../store/useCartStore.js';
import api from '../services/api.js';
import toTitleCase from '../utils/titleCase.js';

// Dynamically load Razorpay SDK if not already loaded
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, subtotal, shipping, total, clearCart, calculateLiveTotals } = useCartStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    door_no: '',
    address: '',
    mandal: '',
    district: '',
    state: 'Telangana',
    pincode: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Auto-fill saved address from localStorage so customer never has to retype
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sc_checkout_address');
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({ ...prev, ...parsed }));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // 2. Persist address changes to localStorage
  useEffect(() => {
    try {
      if (formData.phone || formData.address || formData.name) {
        localStorage.setItem('sc_checkout_address', JSON.stringify(formData));
      }
    } catch (e) {
      // ignore
    }
  }, [formData]);

  // 3. Helper to verify and confirm any paid session with Razorpay
  const verifyCapturedPayment = async (orderIdToVerify, pendingCart, pendingFormData, pendingTotal) => {
    try {
      const checkRes = await api.post('/checkout/check-status', {
        razorpay_order_id: orderIdToVerify,
        cart: pendingCart || cart,
        checkoutData: pendingFormData || formData,
      });

      if (checkRes.data?.paid && checkRes.data?.success) {
        localStorage.removeItem('sc_pending_checkout');
        clearCart();
        navigate(`/order-success/${checkRes.data.orderId}`, {
          state: {
            order: {
              order_code: checkRes.data.orderCode,
              customer_name: (pendingFormData || formData).name,
              customer_phone: (pendingFormData || formData).phone,
              total_amount: parseFloat(pendingTotal || total).toFixed(2),
              payment_status: 'Paid',
              payment_method: 'Online Razorpay',
            },
            orderCode: checkRes.data.orderCode,
            phone: (pendingFormData || formData).phone,
            name: (pendingFormData || formData).name,
          },
        });
        return true;
      }
    } catch (e) {
      console.warn('Silent payment status check error:', e);
    }
    return false;
  };

  // 4. Check for in-flight/pending payment when component mounts
  useEffect(() => {
    const rawPending = localStorage.getItem('sc_pending_checkout');
    if (!rawPending) return;
    try {
      const pending = JSON.parse(rawPending);
      if (pending?.order_id && Date.now() - (pending.created_at || 0) < 2 * 60 * 60 * 1000) {
        verifyCapturedPayment(pending.order_id, pending.cart, pending.formData, pending.total);
      } else {
        localStorage.removeItem('sc_pending_checkout');
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // 5. Check pending payment when user returns to this browser tab (from PhonePe/UPI app)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        const rawPending = localStorage.getItem('sc_pending_checkout');
        if (rawPending) {
          try {
            const pending = JSON.parse(rawPending);
            if (pending?.order_id) {
              verifyCapturedPayment(pending.order_id, pending.cart, pending.formData, pending.total);
            }
          } catch (e) {}
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [cart, formData, total]);

  useEffect(() => {
    if (!cart.length) {
      navigate('/shop');
    } else {
      calculateLiveTotals();
    }
  }, [cart.length]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMessage) setErrorMessage('');
  };

  // Strictly NUMBERS ONLY with max 10 digits
  const handlePhoneChange = (e) => {
    const numbersOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData((prev) => ({ ...prev, phone: numbersOnly }));
    if (errorMessage) setErrorMessage('');
  };

  // Strictly NUMBERS ONLY with max 6 digits
  const handlePincodeChange = (e) => {
    const numbersOnly = e.target.value.replace(/\D/g, '').slice(0, 6);
    setFormData((prev) => ({ ...prev, pincode: numbersOnly }));
    if (errorMessage) setErrorMessage('');
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // 1. Phone validation: Strictly 10 digits numbers only
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setErrorMessage('Mobile Number must be exactly 10 digits (Numbers only).');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setErrorMessage('Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.');
      return;
    }

    // 2. Pincode validation: Strictly 6 digits numbers only
    const cleanPincode = formData.pincode.replace(/\D/g, '');
    if (cleanPincode.length !== 6) {
      setErrorMessage('Pincode must be exactly 6 digits (Numbers only).');
      return;
    }

    // 3. Name validation
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setErrorMessage('Please enter your Full Name.');
      return;
    }

    // 4. Address validation
    if (!formData.door_no.trim()) {
      setErrorMessage('Please enter Flat / Door No.');
      return;
    }
    if (!formData.address.trim() || formData.address.trim().length < 3) {
      setErrorMessage('Please enter Street / Colony / Landmark.');
      return;
    }
    if (!formData.district.trim()) {
      setErrorMessage('Please enter District.');
      return;
    }
    if (!formData.state.trim()) {
      setErrorMessage('Please enter State.');
      return;
    }

    // 5. Email validation (if provided)
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setErrorMessage('Please enter a valid Email Address or leave it blank.');
      return;
    }

    setIsProcessing(true);

    // ONLINE RAZORPAY PAYMENT FLOW (Prepaid only)
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded || !window.Razorpay) {
      setErrorMessage('Payment gateway failed to load. Please check your internet connection and try again.');
      setIsProcessing(false);
      return;
    }

    try {
      // 1. Create Razorpay order on backend
      const orderRes = await api.post('/checkout/pay', {
        cart,
        checkoutData: { ...formData, phone: cleanPhone, pincode: cleanPincode },
      });

      if (!orderRes.data.success || !orderRes.data.order_id) {
        setErrorMessage(orderRes.data.message || 'Payment initiation failed. Please try again.');
        setIsProcessing(false);
        return;
      }

      const { order_id, amount, key } = orderRes.data;

      // 2. Persist in-flight checkout in localStorage so mobile app switching / back navigation is safe
      localStorage.setItem('sc_pending_checkout', JSON.stringify({
        order_id,
        cart,
        formData: { ...formData, phone: cleanPhone, pincode: cleanPincode },
        total,
        created_at: Date.now(),
      }));

      // 3. Open Razorpay Checkout modal
      const options = {
        key,
        amount,
        currency: 'INR',
        name: 'Sri Chaitanya Book Centre',
        description: `Order Payment for ${cart.length} item(s)`,
        image: window.location.origin + '/favicon.svg',
        order_id,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: cleanPhone,
        },
        theme: {
          color: '#d72c35',
        },
        handler: async function (response) {
          try {
            // 4. Verify signature on backend & create order
            const verifyRes = await api.post('/checkout/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              cart,
              checkoutData: { ...formData, phone: cleanPhone, pincode: cleanPincode },
            });

            if (verifyRes.data.success) {
              localStorage.removeItem('sc_pending_checkout');
              clearCart();
              navigate(`/order-success/${verifyRes.data.orderId}`, {
                state: {
                  order: {
                    order_code: verifyRes.data.orderCode,
                    customer_name: formData.name,
                    customer_phone: cleanPhone,
                    total_amount: parseFloat(total).toFixed(2),
                    payment_status: 'Paid',
                    payment_method: 'Online Razorpay',
                  },
                  orderCode: verifyRes.data.orderCode,
                  phone: cleanPhone,
                  name: formData.name,
                },
              });
            } else {
              setErrorMessage(verifyRes.data.message || 'Payment verification failed.');
              setIsProcessing(false);
            }
          } catch (err) {
            console.error('Payment verification error:', err);
            // Even if network or signature errored, immediately verify if Razorpay captured payment
            const recovered = await verifyCapturedPayment(response.razorpay_order_id, cart, { ...formData, phone: cleanPhone, pincode: cleanPincode }, total);
            if (!recovered) {
              setErrorMessage('Payment was processed. If money was debited, your order will auto-sync in 1 minute. Ref ID: ' + response.razorpay_payment_id);
              setIsProcessing(false);
            }
          }
        },
        modal: {
          ondismiss: async function () {
            // User closed/cancelled modal or returned from PhonePe back button:
            // Check immediately whether the payment was captured!
            const wasPaid = await verifyCapturedPayment(order_id, cart, { ...formData, phone: cleanPhone, pincode: cleanPincode }, total);
            if (!wasPaid) {
              setIsProcessing(false);
            }
          },
        },
      };

      const razor = new window.Razorpay(options);
      razor.on('payment.failed', async function (resp) {
        console.warn('Razorpay payment failed or cancelled:', resp.error);
        // Double-check with server before marking failed
        const wasPaid = await verifyCapturedPayment(order_id, cart, { ...formData, phone: cleanPhone, pincode: cleanPincode }, total);
        if (!wasPaid) {
          const reason = resp.error?.description || resp.error?.reason || 'Payment was unsuccessful or cancelled. Please try again.';
          setErrorMessage(reason);
          setIsProcessing(false);
        }
      });
      razor.open();

    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.message || 'Failed to initiate order. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8 pb-32 sm:pb-12">
      
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="text-xs font-bold text-gray-500 hover:text-gray-900 flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Store</span>
        </button>
        <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
          <Lock className="w-3.5 h-3.5" />
          <span>SSL Encrypted Checkout</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        
        {/* Address Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-5 sm:p-8 border border-gray-100 shadow-xs space-y-6">
            <h2 className="text-xl font-extrabold text-gray-900">Delivery Information</h2>

            {errorMessage && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handlePayment} id="checkout-form" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Student / Parent Name"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 sm:py-2.5 text-sm sm:text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-gray-700">Mobile Number (WhatsApp) *</label>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition-all ${
                      formData.phone.length === 10
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : formData.phone.length > 0
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'text-gray-400'
                    }`}>
                      {formData.phone.length === 10 ? '✓ 10 Digits (Valid)' : `${formData.phone.length}/10 digits`}
                    </span>
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    required
                    maxLength={10}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    onKeyDown={(e) => {
                      if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Tab') {
                        e.preventDefault();
                      }
                    }}
                    placeholder="10-digit mobile number"
                    className={`w-full bg-gray-50 border rounded-xl px-4 py-3 sm:py-2.5 text-sm sm:text-xs font-semibold focus:outline-none transition-all ${
                      formData.phone.length === 10
                        ? 'border-emerald-500 bg-emerald-50/20 text-gray-900 focus:border-emerald-600 focus:bg-white'
                        : formData.phone.length > 0
                        ? 'border-amber-400 focus:border-amber-500 focus:bg-white'
                        : 'border-gray-200 focus:border-blue-600 focus:bg-white'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Optional email for receipt"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 sm:py-2.5 text-sm sm:text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Flat / Door No *</label>
                  <input
                    type="text"
                    name="door_no"
                    required
                    value={formData.door_no}
                    onChange={handleChange}
                    placeholder="e.g. 4-12/A, Flat 201"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 sm:py-2.5 text-sm sm:text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Street / Colony / Landmark *</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Street, Landmark, Area name"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 sm:py-2.5 text-sm sm:text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Mandal / Town</label>
                  <input
                    type="text"
                    name="mandal"
                    value={formData.mandal}
                    onChange={handleChange}
                    placeholder="Mandal"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 sm:py-2.5 text-sm sm:text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">District *</label>
                  <input
                    type="text"
                    name="district"
                    required
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="District"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 sm:py-2.5 text-sm sm:text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">State *</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 sm:py-2.5 text-sm sm:text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-gray-700">Pincode *</label>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition-all ${
                      formData.pincode.length === 6
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : formData.pincode.length > 0
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'text-gray-400'
                    }`}>
                      {formData.pincode.length === 6 ? '✓ 6 Digits (Valid)' : `${formData.pincode.length}/6 digits`}
                    </span>
                  </div>
                  <input
                    type="text"
                    name="pincode"
                    required
                    maxLength={6}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={formData.pincode}
                    onChange={handlePincodeChange}
                    onKeyDown={(e) => {
                      if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Tab') {
                        e.preventDefault();
                      }
                    }}
                    placeholder="6 digits"
                    className={`w-full bg-gray-50 border rounded-xl px-4 py-3 sm:py-2.5 text-sm sm:text-xs font-semibold focus:outline-none transition-all ${
                      formData.pincode.length === 6
                        ? 'border-emerald-500 bg-emerald-50/20 text-gray-900 focus:border-emerald-600 focus:bg-white'
                        : formData.pincode.length > 0
                        ? 'border-amber-400 focus:border-amber-500 focus:bg-white'
                        : 'border-gray-200 focus:border-blue-600 focus:bg-white'
                    }`}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6">
            <h3 className="font-extrabold text-base text-gray-900">Order Summary ({cart.length} items)</h3>

            <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="py-3 first:pt-0 flex justify-between gap-3 text-xs">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 truncate">{toTitleCase(item.name)}</p>
                    <p className="text-gray-400 mt-0.5">Qty: {item.qty} × ₹{item.price.toFixed(2)}</p>
                  </div>
                  <span className="font-bold text-gray-900 shrink-0">
                    ₹{(item.qty * item.price).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-4 border-t border-gray-100 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">₹{parseFloat(subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Charge</span>
                <span className="font-bold text-gray-900">₹{parseFloat(shipping).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-gray-900 pt-3 border-t border-gray-200">
                <span>Total Payable</span>
                <span className="text-blue-600">₹{parseFloat(total).toFixed(2)}</span>
              </div>
            </div>

            {/* Secure Payment Mode */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50/70 via-slate-50 to-white border border-emerald-200/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Instant Online Payment (Prepaid Only)</span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-md">
                  Express Dispatch
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Pay securely via UPI (PhonePe, Google Pay, Paytm), Debit/Credit Cards & NetBanking with 256-Bit SSL encryption.
              </p>
            </div>

            <button
              type="submit"
              form="checkout-form"
              disabled={isProcessing}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 via-red-700 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-extrabold text-sm shadow-xl shadow-red-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-[0.98] cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Connecting to Secure Gateway...</span>
                </>
              ) : (
                <span>Pay ₹{parseFloat(total).toFixed(2)} via UPI / Cards / NetBanking</span>
              )}
            </button>

            <div className="text-center text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Supports UPI, Cards, NetBanking & Wallets</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

