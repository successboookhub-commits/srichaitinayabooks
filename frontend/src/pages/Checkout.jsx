import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { useCartStore } from '../store/useCartStore.js';
import api from '../services/api.js';

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

  useEffect(() => {
    if (!cart.length) {
      navigate('/shop');
    } else {
      calculateLiveTotals();
    }
  }, [cart.length]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Phone validation
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!formData.name || !formData.address || !formData.pincode) {
      setErrorMessage('Please fill in all required shipping address fields.');
      return;
    }

    if (!window.Razorpay) {
      setErrorMessage('Razorpay SDK failed to load. Please check your internet connection and refresh.');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Create Razorpay order on backend
      const orderRes = await api.post('/checkout/pay', {
        cart,
        checkoutData: { ...formData, phone: cleanPhone },
      });

      if (!orderRes.data.success) {
        setErrorMessage(orderRes.data.message || 'Payment initiation failed.');
        setIsProcessing(false);
        return;
      }

      const { order_id, amount, key } = orderRes.data;

      // 2. Open Razorpay Checkout modal
      const options = {
        key,
        amount,
        currency: 'INR',
        name: 'Sri Chaitanya Book Centre',
        description: `Order Payment for ${cart.length} item(s)`,
        order_id,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: cleanPhone,
        },
        theme: {
          color: '#2563eb',
        },
        handler: async function (response) {
          try {
            // 3. Verify signature on backend & create order
            const verifyRes = await api.post('/checkout/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              clearCart();
              navigate(`/order-success/${verifyRes.data.orderId}`, {
                state: {
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
            console.error(err);
            setErrorMessage('Something went wrong confirming your order. Please contact support with Payment ID: ' + response.razorpay_payment_id);
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();

    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.message || 'Failed to initiate order. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
      
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="text-xs font-bold text-gray-500 hover:text-gray-900 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Store</span>
        </button>
        <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
          <Lock className="w-3.5 h-3.5" />
          <span>SSL Encrypted Checkout</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Address Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6">
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
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Number (WhatsApp) *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-600"
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
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-600"
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
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-600"
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
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-600"
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
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-600"
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
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-600"
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
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="6 digits"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-600"
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
                    <p className="font-bold text-gray-900 truncate">{item.name}</p>
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

            <button
              type="submit"
              form="checkout-form"
              disabled={isProcessing}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-[0.98]"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing Payment...</span>
                </>
              ) : (
                <span>Pay ₹{parseFloat(total).toFixed(2)} via Razorpay</span>
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

