import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import AdminOrderLabel from './AdminOrderLabel';

export default function AdminOrderLabelPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrdersForLabel = async () => {
      setLoading(true);
      setError('');
      try {
        if (id) {
          // Single order by ID or order code
          const res = await api.get(`/orders/${id}`);
          const orderData = res.data?.order || res.data || {};
          const itemsData = orderData.items || res.data?.items || [];
          setOrders([{ ...orderData, items: itemsData }]);
        } else {
          // Multiple orders by ?ids=1,2,3 or date range
          const ids = searchParams.get('ids');
          const dateFrom = searchParams.get('date_from');
          const dateTo = searchParams.get('date_to');

          const params = new URLSearchParams();
          if (ids) params.append('ids', ids);
          if (dateFrom) params.append('date_from', dateFrom);
          if (dateTo) params.append('date_to', dateTo);

          const res = await api.get(`/orders/labels?${params.toString()}`);
          if (res.data?.orders?.length) {
            setOrders(res.data.orders);
          } else {
            setError('No orders found to print labels.');
          }
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load order shipping label details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersForLabel();
  }, [id, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-slate-500 mt-2">Preparing 9cm × 14cm Shipping Label...</p>
      </div>
    );
  }

  if (error || orders.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-md w-full text-center space-y-3">
          <p className="font-bold text-rose-600 text-sm">{error || 'No order data available.'}</p>
          <button
            onClick={() => navigate('/admin/orders')}
            className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <AdminOrderLabel
      orders={orders}
      onClose={() => navigate('/admin/orders')}
    />
  );
}

