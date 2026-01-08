'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { books } from '@/data/books';

interface BookDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookId: string | null;
  onOrderClick: (bookId: string) => void;
}

export default function BookDetailsModal({ isOpen, onClose, bookId, onOrderClick }: BookDetailsModalProps) {
  // إغلاق Modal عند الضغط على Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !bookId) return null;

  const book = books.find((b) => b.id === bookId);
  if (!book) return null;

  const formatPrice = (price?: number) => {
    if (!price) return null;
    return new Intl.NumberFormat('ar-TN', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 0,
    }).format(price / 1000);
  };

  // وصف افتراضي للكتاب (يمكن استبداله بوصف حقيقي من البيانات)
  const bookDescription = book.description || `كتاب ${book.title} للمؤلف ${book.author} هو من الكتب الإسلامية المميزة التي تقدم محتوى قيماً ومفيداً للقارئ. يغطي هذا الكتاب مواضيع مهمة في الفكر الإسلامي ويقدم رؤى عميقة ومفيدة.`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal Content */}
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200 bg-gradient-to-r from-green-50 to-white">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 font-reem-kufi">
            تفاصيل الكتاب
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="إغلاق"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* صورة الكتاب */}
            <div className="relative w-full h-80 sm:h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden">
              <Image
                src={book.image}
                alt={`غلاف كتاب ${book.title}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={90}
              />
            </div>

            {/* معلومات الكتاب */}
            <div className="flex flex-col justify-between font-cairo">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                  {book.title}
                </h3>
                <p className="text-lg text-gray-600 mb-4 font-medium">
                  {book.author}
                </p>

                {/* السعر */}
                {book.price && (
                  <div className="mb-6">
                    <p className="text-3xl sm:text-4xl font-bold text-green-600">
                      {formatPrice(book.price)}
                    </p>
                  </div>
                )}

                {/* الوصف */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">الوصف:</h4>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {bookDescription}
                  </p>
                </div>
              </div>

              {/* زر الطلب */}
              <button
                onClick={() => {
                  onClose();
                  onOrderClick(bookId);
                }}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-green-500/30 flex items-center justify-center gap-2"
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
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <span>اطلب الآن</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
