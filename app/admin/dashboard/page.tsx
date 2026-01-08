'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import OrderCard from '@/components/OrderCard';
import OrderStatus from '@/components/OrderStatus';

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

type StatusFilter = 'all' | 'new' | 'confirmed' | 'delivered' | 'canceled';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4); // Default for mobile
  const [totalOrders, setTotalOrders] = useState(0); // إجمالي الطلبات من Server
  const router = useRouter();

  // جلب الطلبات - استخدام useCallback لتثبيت المرجع
  const fetchOrders = useCallback(async () => {
    try {
      // استخدام Server-side Pagination
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
      const params = new URLSearchParams();
      
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      
      // Pagination: على الموبايل 4، على Desktop 20
      params.append('page', currentPage.toString());
      params.append('limit', itemsPerPage.toString());
      
      const res = await fetch(`/api/admin/orders?${params.toString()}`);

      if (res.status === 401) {
        // غير مسجل دخول
        router.push('/admin/login');
        return;
      }

      if (!res.ok) {
        throw new Error('فشل في جلب الطلبات');
      }

      const data = await res.json();
      setOrders(data.orders || []);
      setTotalOrders(data.pagination?.total || data.orders?.length || 0);
      setError('');
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء جلب الطلبات');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, router, currentPage, itemsPerPage]);

  // تحديث حالة الطلب
  const handleStatusChange = async (orderId: string, newStatus: 'new' | 'confirmed' | 'delivered' | 'canceled') => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error('فشل في تحديث حالة الطلب');
      }

      // تحديث الطلب في القائمة
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err: any) {
      console.error('Error updating status:', err);
      alert('حدث خطأ أثناء تحديث حالة الطلب');
      throw err;
    }
  };

  // تسجيل الخروج
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  // تحديد عدد الطلبات لكل صفحة بناءً على حجم الشاشة
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        // Mobile: 4 orders per page (Server-side pagination)
        setItemsPerPage(4);
      } else {
        // Desktop: 20 orders per page (Server-side pagination)
        setItemsPerPage(20);
      }
    };

    handleResize(); // Call once on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // إعادة تعيين الصفحة عند تغيير الفلتر
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  // جلب الطلبات عند تحميل الصفحة
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Polling: تحديث الطلبات كل 5 ثواني
  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrders();
    }, 5000); // كل 5 ثواني

    return () => clearInterval(interval);
  }, [fetchOrders]);

  // إحصائيات
  const stats = {
    total: orders.length,
    new: orders.filter((o) => o.status === 'new').length,
    confirmed: orders.filter((o) => o.status === 'confirmed').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
    canceled: orders.filter((o) => o.status === 'canceled').length,
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-TN', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 0,
    }).format(price / 1000);
  };

  const totalRevenue = orders
    .filter((o) => o.status === 'delivered')
    .reduce((sum, o) => sum + o.totalPrice, 0);

  // حساب Pagination - استخدام Server-side pagination
  const totalPages = Math.ceil(totalOrders / itemsPerPage) || 1;
  const currentOrders = orders; // الطلبات تأتي من Server بالفعل paginated

  // دوال Pagination
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 font-reem-kufi truncate">
                لوحة تحكم البائع
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 font-cairo">
                إدارة الطلبات
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <a
                href="/"
                className="text-xs sm:text-sm text-gray-600 hover:text-green-600 transition-colors font-cairo px-2 sm:px-0 py-1.5 sm:py-0 whitespace-nowrap"
              >
                الصفحة الرئيسية
              </a>
              <button
                onClick={handleLogout}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-xs sm:text-sm font-cairo whitespace-nowrap"
              >
                تسجيل خروج
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* إحصائيات */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4 mb-6 sm:mb-8">
          {/* إجمالي الطلبات */}
          <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600 font-cairo truncate">إجمالي الطلبات</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-0.5 sm:mt-1">{stats.total}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* طلبات جديدة */}
          <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600 font-cairo truncate">طلبات جديدة</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-600 mt-0.5 sm:mt-1">{stats.new}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* مؤكدة */}
          <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600 font-cairo truncate">مؤكدة</p>
                <p className="text-xl sm:text-2xl font-bold text-yellow-600 mt-0.5 sm:mt-1">{stats.confirmed}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* تم التسليم */}
          <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600 font-cairo truncate">تم التسليم</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600 mt-0.5 sm:mt-1">{stats.delivered}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* ملغى */}
          <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600 font-cairo truncate">ملغاة</p>
                <p className="text-xl sm:text-2xl font-bold text-red-600 mt-0.5 sm:mt-1">{stats.canceled}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* إجمالي المبيعات */}
        {totalRevenue > 0 && (
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 text-white">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm opacity-90 font-cairo">إجمالي المبيعات (تم التسليم)</p>
                <p className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2 truncate">{formatPrice(totalRevenue)}</p>
              </div>
              <div className="text-3xl sm:text-4xl flex-shrink-0">💰</div>
            </div>
          </div>
        )}

        {/* فلترة */}
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 mb-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* العنوان */}
            <div className="flex-shrink-0">
              <span className="text-xs sm:text-sm font-semibold text-gray-700 font-cairo block sm:inline">
                فلترة حسب الحالة:
              </span>
            </div>
            
            {/* الأزرار */}
            <div className="flex flex-wrap items-center gap-2 flex-1">
              {(['all', 'new', 'confirmed', 'delivered', 'canceled'] as StatusFilter[]).map((status) => {
                const statusLabels: Record<StatusFilter, string> = {
                  all: 'الكل',
                  new: 'جديد',
                  confirmed: 'مؤكد',
                  delivered: 'تم التسليم',
                  canceled: 'ملغى',
                };
                
                return (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm font-cairo whitespace-nowrap ${
                      statusFilter === status
                        ? status === 'all'
                          ? 'bg-gray-800 text-white'
                          : status === 'new'
                          ? 'bg-blue-600 text-white'
                          : status === 'confirmed'
                          ? 'bg-yellow-600 text-white'
                          : status === 'delivered'
                          ? 'bg-green-600 text-white'
                          : 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {statusLabels[status]}
                  </button>
                );
              })}
            </div>
            
            {/* زر التحديث */}
            <button
              onClick={fetchOrders}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-xs sm:text-sm font-cairo whitespace-nowrap flex items-center justify-center gap-1.5 sm:ml-auto w-full sm:w-auto"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>تحديث</span>
            </button>
          </div>
        </div>

        {/* قائمة الطلبات */}
        {loading ? (
          <div className="text-center py-8 sm:py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-green-600"></div>
            <p className="mt-4 text-sm sm:text-base text-gray-600 font-cairo">جاري تحميل الطلبات...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 sm:px-6 py-3 sm:py-4 rounded-lg font-cairo text-sm sm:text-base">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 sm:p-12 text-center border border-gray-200">
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">📦</div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 font-cairo">لا توجد طلبات</h3>
            <p className="text-sm sm:text-base text-gray-600 font-cairo">
              {statusFilter === 'all'
                ? 'لم يتم استلام أي طلبات بعد'
                : `لا توجد طلبات بحالة "${statusFilter === 'new' ? 'جديدة' : statusFilter === 'confirmed' ? 'مؤكدة' : statusFilter === 'delivered' ? 'تم التسليم' : 'ملغاة'}"`}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {currentOrders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>

            {/* Pagination - على الموبايل والـ Desktop */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                {/* زر السابق */}
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-cairo text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                {/* أرقام الصفحات */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // عرض صفحات محددة فقط لتوفير المساحة
                    const showPage =
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1);

                    if (!showPage && page === 2 && currentPage > 4) {
                      return <span key={page} className="px-2 text-gray-400">...</span>;
                    }
                    if (!showPage && page === totalPages - 1 && currentPage < totalPages - 3) {
                      return <span key={page} className="px-2 text-gray-400">...</span>;
                    }
                    if (!showPage) return null;

                    return (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-3 py-2 min-w-[2.5rem] rounded-lg text-sm font-cairo transition-colors ${
                          currentPage === page
                            ? 'bg-green-600 text-white'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                {/* زر التالي */}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-cairo text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            )}

            {/* معلومات Pagination */}
            {totalPages > 1 && (
              <div className="mt-3 text-center text-xs sm:text-sm text-gray-600 font-cairo">
                صفحة {currentPage} من {totalPages} • عرض {currentOrders.length} من {totalOrders} طلب
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
