"use client";

import { useMemo, useState, useEffect } from "react";
import { books as allBooks } from "@/data/books";
import { useToast } from "./ToastContainer";

type BookInput = {
  id: string;
  title: string;
  author: string;
  price?: number;
  image: string;
};

interface OrderFormProps {
  initialBookId?: string; // الكتاب المختار مسبقاً
  onSuccess?: () => void; // Callback عند نجاح الطلب
  showTitle?: boolean; // إظهار العنوان (افتراضي: true)
}

export default function OrderForm({ initialBookId, onSuccess, showTitle = true }: OrderFormProps) {
  const toast = useToast();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>(initialBookId ? [initialBookId] : []);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // إضافة الكتاب الأولي عند تغيير initialBookId
  useEffect(() => {
    if (initialBookId) {
      setSelectedIds((prev) => {
        if (!prev.includes(initialBookId)) {
          return [initialBookId];
        }
        return prev;
      });
    }
  }, [initialBookId]);

  const booksMap = useMemo(() => {
    const map = new Map<string, BookInput>();
    allBooks.forEach((b) => map.set(b.id, b));
    return map;
  }, []);

  // تصفية الكتب حسب البحث
  const filteredBooks = useMemo(() => {
    if (!searchQuery.trim()) {
      return allBooks;
    }
    const query = searchQuery.toLowerCase().trim();
    return allBooks.filter((book) => {
      const titleMatch = book.title.toLowerCase().includes(query);
      const authorMatch = book.author.toLowerCase().includes(query);
      return titleMatch || authorMatch;
    });
  }, [searchQuery]);

  const selectedBooks: BookInput[] = useMemo(
    () => selectedIds.map((id) => booksMap.get(id)!).filter(Boolean),
    [selectedIds, booksMap]
  );

  const totalPriceMilli = useMemo(() => {
    return selectedBooks.reduce((sum, b) => sum + (b.price || 0), 0);
  }, [selectedBooks]);

  const totalFormatted = useMemo(() => {
    if (!totalPriceMilli) return "0 د.ت";
    const fmt = new Intl.NumberFormat("ar-TN", {
      style: "currency",
      currency: "TND",
      minimumFractionDigits: 0,
    });
    return fmt.format(totalPriceMilli / 1000);
  }, [totalPriceMilli]);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const clearForm = () => {
    setCustomerName("");
    setCustomerPhone("");
    setCustomerAddress("");
    setNotes("");
    setSelectedIds([]);
    setSearchQuery("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      if (!customerName || !customerPhone || !customerAddress) {
        const errorMessage = "يرجى إدخال الاسم ورقم الهاتف والعنوان.";
        setErrorMsg(errorMessage);
        toast.showError(errorMessage);
        setSubmitting(false);
        return;
      }
      if (selectedBooks.length === 0) {
        const errorMessage = "يرجى اختيار كتاب واحد على الأقل.";
        setErrorMsg(errorMessage);
        toast.showError(errorMessage);
        setSubmitting(false);
        return;
      }

      const payload = {
        customerName,
        customerPhone,
        customerAddress,
        books: selectedBooks.map((b) => ({
          id: b.id,
          title: b.title,
          author: b.author,
          price: b.price,
          image: b.image,
        })),
        totalPrice: totalPriceMilli,
        notes,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        const errorMessage = data?.error || "حدث خطأ أثناء إرسال الطلب.";
        setErrorMsg(errorMessage);
        toast.showError(errorMessage);
      } else {
        const successMessage = data?.message || "تم إرسال طلبك بنجاح!";
        setSuccessMsg(successMessage);
        toast.showSuccess(successMessage);
        clearForm();
        // استدعاء onSuccess callback بعد 1.5 ثانية لإغلاق Modal
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 1500);
        }
      }
    } catch (err) {
      const errorMessage = "حدث خطأ غير متوقع. حاول مرة أخرى.";
      setErrorMsg(errorMessage);
      toast.showError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="font-cairo">
      {showTitle && (
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          اطلب عبر الموقع
        </h2>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-3">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              الاسم الكامل
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="مثال: أحمد محمد"
              className="w-full px-1.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              رقم الهاتف
            </label>
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="+216 50 123 456"
              className="w-full px-1.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              العنوان
            </label>
            <input
              type="text"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              placeholder="المدينة، الشارع، أقرب معلم"
              className="w-full px-1.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              ملاحظات (اختياري)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="أي ملاحظات إضافية للطلب"
              className="w-full px-1.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              اختر الكتب المطلوبة
            </label>
            
            {/* صندوق البحث */}
            <div className="mb-2 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث في الكتب..."
                className="w-full px-3 py-2 pr-9 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all font-cairo"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* عدد النتائج */}
            {searchQuery.trim() && (
              <div className="mb-2 text-xs text-gray-600 font-cairo">
                تم العثور على <span className="font-semibold text-green-700">{filteredBooks.length}</span> كتاب
              </div>
            )}

            {/* قائمة الكتب */}
            <div className="max-h-56 overflow-auto border border-gray-200 rounded-lg divide-y">
              {filteredBooks.length === 0 ? (
                <div className="p-6 text-center text-gray-500 font-cairo">
                  <svg
                    className="w-10 h-10 mx-auto mb-2 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <p className="text-sm font-medium">لا توجد نتائج</p>
                  <p className="text-xs mt-1">لم يتم العثور على أي كتاب يطابق البحث</p>
                </div>
              ) : (
                filteredBooks.map((b) => (
                <label
                  key={b.id}
                  className="flex items-start gap-2 p-2 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(b.id)}
                    onChange={() => toggleSelection(b.id)}
                    className="mt-0.5 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-1">
                      {b.title}
                    </div>
                    <div className="text-xs text-gray-600">{b.author}</div>
                    {b.price ? (
                      <div className="text-xs text-green-700 mt-0.5 font-semibold">
                        {new Intl.NumberFormat("ar-TN", {
                          style: "currency",
                          currency: "TND",
                          minimumFractionDigits: 0,
                        }).format(b.price / 1000)}
                      </div>
                    ) : null}
                  </div>
                </label>
                ))
              )}
            </div>
          </div>

          <div className="flex items-center justify-between bg-green-50 border border-green-100 rounded-lg px-3 py-2">
            <div className="text-xs sm:text-sm text-gray-700">
              المختارة:{" "}
              <span className="font-semibold">{selectedIds.length}</span> كتاب
            </div>
            <div className="text-sm sm:text-base font-bold text-green-700">
              المجموع: {totalFormatted}
            </div>
          </div>

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs sm:text-sm">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-3 py-2 rounded-lg text-xs sm:text-sm">
              {successMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 text-sm sm:text-base"
          >
            {submitting ? "جاري إرسال الطلب..." : "إرسال الطلب"}
          </button>
        </div>
      </form>
    </section>
  );
}

