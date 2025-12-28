/**
 * بيانات الكتب الثابتة للمكتبة الإسلامية
 * يمكن تحديث هذه البيانات حسب الحاجة
 */
export interface Book {
  id: string;
  title: string;
  author: string;
  price?: number; // السعر بالمليم (مثال: 45900 = 45.9 دينار)
  image: string; // مسار صورة الكتاب
}

/**
 * قائمة الكتب المعروضة (21 كتاب)
 */
export const books: Book[] = [
  {
    id: "1",
    title: "قصة نضال",
    author: "محمد العربي القروي",
    price: 45900,
    image: "/images/book_img(1).jpg",
  },
  {
    id: "2",
    title: "فقه الأسماءالحسنى",
    author: "أحمد بن عمر بن إبراهيم",
    price: 32500,
    image: "/images/book_img2.jpg",
  },
  {
    id: "3",
    title: "رسالة يوسف",
    author: "إبراهيم محمد",
    price: 65500,
    image: "/images/book_img(3).jpg",
  },
  {
    id: "4",
    title: "تسعة عشر ",
    author: "أيمن العتوم",
    price: 75000,
    image: "/images/book_img(4).jpg",
  },
  {
    id: "5",
    title: "والذين معه",
    author: "أدهم شرقاوي",
    price: 28000,
    image: "/images/book_img(5).jpg",
  },
  {
    id: "6",
    title: "رسائل من التابعين",
    author: "أدهم شرقاوي",
    price: 42000,
    image: "/images/book_im(6).jpg",
  },
  {
    id: "7",
    title: "نحن نقص عليك ",
    author: "أدهم شرقاوي",
    price: 38000,
    image: "/images/book_img(7).jpg",
  },
  {
    id: "8",
    title: "منهجية السير إلى الله",
    author: "د.كباح أبو هنود",
    price: 55000,
    image: "/images/book_img(8).jpg",
  },
  {
    id: "9",
    title: "منفي أنا و أنت موطني",
    author: "أميرة عليان تبلو",
    price: 48000,
    image: "/images/book_img(9).jpg",
  },
  {
    id: "10",
    title: "لن تستطيع معي صبرا",
    author: "كريم الشاذلي",
    price: 35000,
    image: "/images/book_img(10).jpg",
  },
  {
    id: "11",
    title: "ربيع الأندلس",
    author: "د.محمود ماهر",
    price: 68000,
    image: "/images/book_img(11).jpg",
  },
  {
    id: "12",
    title: "بالله حسن الظن",
    author: "أ.د.إياد قنيبي",
    price: 72000,
    image: "/images/book_img(12).jpg",
  },
  {
    id: "13",
    title: "لله نمضي",
    author: "محمود حسنات",
    price: 70000,
    image: "/images/book_img(13).jpg",
  },
  {
    id: "14",
    title: "أنت أيضا صحابية",
    author: "أدهم شرقاوي",
    price: 45000,
    image: "/images/book_img(14)jpg.jpg",
  },
  {
    id: "15",
    title: "مع النبي ﷺ",
    author: "أدهم شرقاوي",
    price: 43000,
    image: "/images/book_img(15).jpg",
  },
  {
    id: "16",
    title: "إن ربي لطيف",
    author: "عبد الرحمان مسعد",
    price: 41000,
    image: "/images/book_img(16).jpg",
  },
  {
    id: "17",
    title: "مداواة النفووس و  تهذيب الأخلاق",
    author: "د.محمد مطر سالم بن عابد الكعبي",
    price: 52000,
    image: "/images/book_img(17).jpg",
  },
  {
    id: "18",
    title: "العبرات",
    author: "د.مصطفى لطفي المنفلوطي ",
    price: 68000,
    image: "/images/book_img(18).jpg",
  },
  {
    id: "19",
    title: "بريد السماء",
    author: "محمود حسنات",
    price: 55000,
    image: "/images/book_img(19).jpg",
  },
  {
    id: "20",
    title: "كاريزما محمد ﷺ ",
    author: "صالح مجمل",
    price: 48000,
    image: "/images/book_img(20).jpg",
  },
  {
    id: "21",
    title: "التفكير في القرآن الكريم",
    author: "د.مها أبو الفيلات",
    price: 62000,
    image: "/images/book_img(21).jpg",
  },
];

