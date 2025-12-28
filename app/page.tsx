"use client";

import { useMemo, type ReactElement } from "react";
import Image from "next/image";
import { books } from "@/data/books";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

/**
 * صفحة Demo / MVP لمكتبة إسلامية
 * صفحة واحدة بسيطة لعرض الكتب والطلب عبر واتساب
 */
export default function Home() {
  /**
   * دالة لفتح واتساب مع رسالة جاهزة
   * ملاحظة: يجب تغيير رقم الواتساب برقم الواتساب الخاص بك
   */
  const handleWhatsAppOrder = (bookTitle: string, author: string, price?: number) => {
    let message = `السلام عليكم ورحمة الله وبركاته\n\n`;
    message += `أريد طلب الكتاب التالي:\n`;
    message += `📖 ${bookTitle}\n`;
    message += `✍️ ${author}\n`;
    if (price) {
      const formattedPrice = formatPrice(price);
      message += `💰 ${formattedPrice}\n`;
    }
    message += `\nشكراً لكم`;
    const whatsappUrl = `https://wa.me/+21626010403?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  /**
   * NumberFormatter محفوظ في الذاكرة لتحسين الأداء
   */
  const priceFormatter = useMemo(
    () =>
      new Intl.NumberFormat("ar-TN", {
        style: "currency",
        currency: "TND",
        minimumFractionDigits: 0,
      }),
    []
  );

  /**
   * دالة لتنسيق السعر
   * تحويل السعر من مليم إلى دينار تونسي
   */
  const formatPrice = (price?: number) => {
    if (!price) return null;
    return priceFormatter.format(price / 1000);
  };

  /**
   * دالة لتنسيق عنوان الكتاب - جعل الرمز ﷺ أكبر
   */
  const formatBookTitle = (title: string) => {
    // استبدال الرمز ﷺ (U+FDFA) بـ span مع class لجعله أكبر
    const salawat = '\uFDFA'; // الرمز ﷺ
    
    // إذا لم يوجد الرمز، أرجع العنوان كـ JSX
    if (!title.includes(salawat)) {
      return <>{title}</>;
    }
    
    // تقسيم العنوان حسب الرمز
    const parts: (string | ReactElement)[] = [];
    const segments = title.split(salawat);
    
    segments.forEach((segment, index) => {
      // إضافة النص
      if (segment) {
        parts.push(segment);
      }
      // إضافة الرمز مع span (إلا إذا كان آخر segment)
      if (index < segments.length - 1) {
        parts.push(
          <span key={`salawat-${index}`} className="book-title-salawat">
            {salawat}
          </span>
        );
      }
    });
    
    return <>{parts}</>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-stone-50">
      {/* Header */}
      <header className="bg-gradient-to-b from-green-50 to-white/60 backdrop-blur-md sticky top-0 z-50 border-b border-green-100 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
            {/* Logo - Right side (start in RTL) - in the middle of first book */}
            <div className="flex justify-center lg:justify-center">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden ring-2 ring-gray-100 shadow-sm">
                <Image
                  src="/brand-img.jpg"
                  alt="شعار مكتبة بشر"
                  fill
                  className="object-cover"
                  priority
                  quality={75}
                  sizes="56px"
                />
              </div>
            </div>

            {/* Title - Center - spans 2 columns on lg (same width as 2 middle books) */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-2 flex justify-center items-center w-full">
              <h2 className="text-2xl sm:text-3xl md:text-4xl  text-gray-900 leading-tight font-reem-kufi whitespace-nowrap text-center transform scale-x-125 sm:scale-x-[1.5] md:scale-x-[1.8] origin-center">
                مكتبة بشر
              </h2>
            </div>

            {/* WhatsApp Icon - Left side (end in RTL) - in the middle of last book */}
            <div className="flex justify-center lg:justify-center">
              <a
                href={`https://wa.me/+21626010403?text=${encodeURIComponent("سلام عليكم")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 bg-green-500 hover:bg-green-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group"
                aria-label="اتصل بنا عبر واتساب"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* نص ترحيبي */}
      <section className="container mx-auto px-4 pt-8 pb-2">
        <div className="text-center space-y-2">
          <p className="text-2xl sm:text-3xl md:text-4xl text-gray-700 font-amiri">
            مرحباً بكم في مكتبة بشر
          </p>
          <p className="text-2xl sm:text-3xl md:text-4xl text-gray-700 font-amiri">
            اطلب كتابك المفضل عبر واتساب بسهولة
          </p>
        </div>
      </section>

      {/* قسم عرض الكتب */}
      <main className="container mx-auto px-4 pt-6 pb-12">
        {/* المجموعة الأولى */}
        <div className="mb-12">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            slidesPerGroup={1}
            navigation
            pagination={{ clickable: true }}
            initialSlide={3}
            breakpoints={{
              640: {
                slidesPerView: 2,
                slidesPerGroup: 1,
              },
              1024: {
                slidesPerView: 4,
                slidesPerGroup: 1,
              },
            }}
          >
            {books.slice(0, 11).map((book, index) => (
              <SwiperSlide key={book.id}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full">
                  {/* صورة الغلاف */}
                  <div className="w-full h-64 relative bg-gray-100 overflow-hidden">
                    <Image
                      src={book.image}
                      alt={`غلاف كتاب ${book.title} للمؤلف ${book.author}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      loading={index < 2 ? "eager" : "lazy"}
                      priority={index < 2}
                      quality={80}
                    />
                  </div>

                  {/* معلومات الكتاب */}
                  <div className="p-4 font-cairo">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 h-[3.5rem] overflow-hidden text-ellipsis line-clamp-2" title={book.title}>
                      {formatBookTitle(book.title)}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{book.author}</p>

                    {/* السعر */}
                    {book.price && (
                      <p className="text-lg font-bold text-green-700 mb-4">
                        {formatPrice(book.price)}
                      </p>
                    )}

                    {/* زر الطلب عبر واتساب */}
                    <button
                      onClick={() => handleWhatsAppOrder(book.title, book.author, book.price)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      aria-label={`طلب ${book.title} عبر واتساب`}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                      <span>اطلب عبر واتساب</span>
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* المجموعة الثانية */}
        <div className="mb-16">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            slidesPerGroup={1}
            navigation
            pagination={{ clickable: true }}
            initialSlide={3}
            breakpoints={{
              640: {
                slidesPerView: 2,
                slidesPerGroup: 1,
              },
              1024: {
                slidesPerView: 4,
                slidesPerGroup: 1,
              },
            }}
          >
            {books.slice(11, 21).map((book) => (
              <SwiperSlide key={book.id}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full">
                  {/* صورة الغلاف */}
                  <div className="w-full h-64 relative bg-gray-100 overflow-hidden">
                    <Image
                      src={book.image}
                      alt={`غلاف كتاب ${book.title} للمؤلف ${book.author}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      loading="lazy"
                      quality={80}
                    />
                  </div>

                  {/* معلومات الكتاب */}
                  <div className="p-4 font-cairo">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 h-[3.5rem] overflow-hidden text-ellipsis line-clamp-2" title={book.title}>
                      {formatBookTitle(book.title)}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{book.author}</p>

                    {/* السعر */}
                    {book.price && (
                      <p className="text-lg font-bold text-green-700 mb-4">
                        {formatPrice(book.price)}
                      </p>
                    )}

                    {/* زر الطلب عبر واتساب */}
                    <button
                      onClick={() => handleWhatsAppOrder(book.title, book.author, book.price)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      aria-label={`طلب ${book.title} عبر واتساب`}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                      <span>اطلب عبر واتساب</span>
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* قسم توضيحي - كيف تطلب كتابك */}
        <section className="bg-white rounded-lg shadow-md p-8 mb-6 font-cairo">
          <h2 className="text-2xl font-bold text-gray-800 mb-12 text-center">
            كيف تطلب كتابك؟
          </h2>
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
              {/* Card 1 */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-md p-6 border border-green-200 hover:shadow-lg transition-all w-full md:w-[250px] min-h-[200px] flex items-center">
                <div className="flex flex-col items-center text-center w-full">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg flex-shrink-0">
                    1
                  </div>
                  <p className="text-gray-800 font-semibold text-sm leading-relaxed">
                    اختر الكتاب الذي تريد شراءه
                  </p>
                </div>
              </div>

              {/* Arrow 1 */}
              <div className="hidden md:flex justify-center items-center flex-shrink-0">
                <svg className="w-10 h-10 text-green-600 scale-x-[-1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div className="md:hidden flex justify-center my-2">
                <svg className="w-8 h-8 text-green-600 rotate-[-90deg]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* Card 2 */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-md p-6 border border-green-200 hover:shadow-lg transition-all w-full md:w-[250px] min-h-[200px] flex items-center">
                <div className="flex flex-col items-center text-center w-full">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg flex-shrink-0">
                    2
                  </div>
                  <p className="text-gray-800 font-semibold text-sm leading-relaxed">
                    اضغط على زر "اطلب عبر واتساب"
                  </p>
                </div>
              </div>

              {/* Arrow 2 */}
              <div className="hidden md:flex justify-center items-center flex-shrink-0">
                <svg className="w-10 h-10 text-green-600 scale-x-[-1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div className="md:hidden flex justify-center my-2">
                <svg className="w-8 h-8 text-green-600 rotate-[-90deg]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* Card 3 */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-md p-6 border border-green-200 hover:shadow-lg transition-all w-full md:w-[250px] min-h-[200px] flex items-center">
                <div className="flex flex-col items-center text-center w-full">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg flex-shrink-0">
                    3
                  </div>
                  <p className="text-gray-800 font-semibold text-sm leading-relaxed">
                    سيتم فتح واتساب برسالة جاهزة باسم الكتاب
                  </p>
                </div>
              </div>

              {/* Arrow 3 */}
              <div className="hidden md:flex justify-center items-center flex-shrink-0">
                <svg className="w-10 h-10 text-green-600 scale-x-[-1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div className="md:hidden flex justify-center my-2">
                <svg className="w-8 h-8 text-green-600 rotate-[-90deg]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* Card 4 */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-md p-6 border border-green-200 hover:shadow-lg transition-all w-full md:w-[250px] min-h-[200px] flex items-center">
                <div className="flex flex-col items-center text-center w-full">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg flex-shrink-0">
                    4
                  </div>
                  <p className="text-gray-800 font-semibold text-sm leading-relaxed">
                    أرسل الرسالة، وستتواصل معك المكتبة عبر واتساب لتأكيد الطلب
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Floating WhatsApp Button - Big Icon in Right Corner */}
      <button
        onClick={() => {
          const message = "سلام عليكم";
          const whatsappUrl = `https://wa.me/+21626010403?text=${encodeURIComponent(message)}`;
          window.open(whatsappUrl, "_blank");
        }}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 sm:w-20 sm:h-20 bg-green-500 hover:bg-green-600 rounded-full shadow-2xl hover:shadow-green-500/50 transition-all duration-300 flex items-center justify-center group hover:scale-110"
        aria-label="اطلب الآن عبر واتساب"
      >
        <svg
          className="w-10 h-10 sm:w-12 sm:h-12 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </button>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 font-cairo">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <p className="text-sm mb-4">
              للاستفسار: اتصل بنا عبر واتساب
            </p>
            <div className="flex justify-center items-center gap-6">
              {/* Facebook Icon */}
              <a
                href="https://www.facebook.com/profile.php?id=100092725701351"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors"
                aria-label="صفحتنا على فيسبوك"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* Instagram Icon */}
              <a
                href="https://www.instagram.com/Books.besher"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-700 hover:bg-gradient-to-r hover:from-purple-500 hover:via-pink-500 hover:to-orange-500 rounded-full flex items-center justify-center transition-all"
                aria-label="صفحتنا على إنستغرام"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>
          <div className="text-center border-t border-gray-700 pt-6 mt-6">
            <p className="text-sm">
              © 2025 مكتبة بشر. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
