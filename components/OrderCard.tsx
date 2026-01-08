'use client';

import { useState } from 'react';
import OrderStatus from './OrderStatus';

interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  image?: string;
}

interface Order {
  _id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  books: Book[];
  totalPrice: number;
  status: 'new' | 'confirmed' | 'delivered' | 'canceled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, newStatus: 'new' | 'confirmed' | 'delivered' | 'canceled') => Promise<void>;
}

export default function OrderCard({ order, onStatusChange }: OrderCardProps) {
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(order.status);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-TN', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 0,
    }).format(price / 1000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-TN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleStatusChange = async (newStatus: 'new' | 'confirmed' | 'delivered' | 'canceled') => {
    if (newStatus === currentStatus) return;

    // تأكيد الإلغاء
    if (newStatus === 'canceled') {
      const confirmed = window.confirm('هل أنت متأكد من إلغاء هذا الطلب؟');
      if (!confirmed) return;
    }

    setLoading(true);
    try {
      await onStatusChange(order._id, newStatus);
      setCurrentStatus(newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusButtons = () => {
    const buttons = [];
    
    // إذا كان الطلب ملغى، لا تظهر أي أزرار
    if (currentStatus === 'canceled') {
      return buttons;
    }
    
    if (currentStatus === 'new') {
      buttons.push(
        <button
          key="confirmed"
          onClick={() => handleStatusChange('confirmed')}
          disabled={loading}
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-cairo text-sm"
        >
          {loading ? 'جاري...' : 'تأكيد الطلب'}
        </button>
      );
      buttons.push(
        <button
          key="canceled"
          onClick={() => handleStatusChange('canceled')}
          disabled={loading}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-cairo text-sm"
        >
          {loading ? 'جاري...' : 'إلغاء الطلب'}
        </button>
      );
    }
    
    if (currentStatus === 'confirmed') {
      buttons.push(
        <button
          key="delivered"
          onClick={() => handleStatusChange('delivered')}
          disabled={loading}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-cairo text-sm"
        >
          {loading ? 'جاري...' : 'تم التسليم'}
        </button>
      );
      buttons.push(
        <button
          key="canceled"
          onClick={() => handleStatusChange('canceled')}
          disabled={loading}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-cairo text-sm"
        >
          {loading ? 'جاري...' : 'إلغاء الطلب'}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow font-cairo">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-gray-900">طلب #{order._id.slice(-6)}</h3>
            <OrderStatus status={currentStatus} />
          </div>
          <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-2xl font-bold text-green-700">{formatPrice(order.totalPrice)}</p>
        </div>
      </div>

      {/* Customer Info */}
      <div className="border-t border-gray-200 pt-4 mb-4 space-y-2">
        <div>
          <span className="text-sm font-semibold text-gray-700">العميل: </span>
          <span className="text-gray-900">{order.customerName}</span>
        </div>
        <div>
          <span className="text-sm font-semibold text-gray-700">الهاتف: </span>
          <a
            href={`tel:${order.customerPhone}`}
            className="text-green-600 hover:text-green-700 hover:underline"
          >
            {order.customerPhone}
          </a>
        </div>
        <div>
          <span className="text-sm font-semibold text-gray-700">العنوان: </span>
          <span className="text-gray-900">{order.customerAddress}</span>
        </div>
      </div>

      {/* Books */}
      <div className="border-t border-gray-200 pt-4 mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">الكتب المطلوبة:</h4>
        <ul className="space-y-2">
          {order.books.map((book, index) => (
            <li key={index} className="flex items-start justify-between text-sm">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{book.title}</p>
                <p className="text-gray-600 text-xs">{book.author}</p>
              </div>
              <span className="text-green-700 font-semibold ml-4">
                {formatPrice(book.price)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="border-t border-gray-200 pt-4 mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-1">ملاحظات:</h4>
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{order.notes}</p>
        </div>
      )}

      {/* Action Buttons */}
      {getStatusButtons().length > 0 && (
        <div className="border-t border-gray-200 pt-4 flex gap-2">
          {getStatusButtons()}
        </div>
      )}
    </div>
  );
}
