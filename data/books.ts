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
    title: "الخلاصة الفقهية على مذهب السادة المالكية",
    author: "محمد العربي القروي",
    price: 45900,
    image: "/images/book_img(1).jpg",
  },
  {
    id: "2",
    title: "السيرة النبوية أضواء من الهدي النبوي",
    author: "أحمد بن عمر بن إبراهيم",
    price: 32500,
    image: "/images/book_img2.jpg",
  },
  {
    id: "3",
    title: "فقه العبادات",
    author: "د. عبد الله المطيري",
    price: 65500,
    image: "/images/book_img(3).jpg",
  },
  {
    id: "4",
    title: "تفسير القرآن الكريم",
    author: "ابن كثير",
    price: 75000,
    image: "/images/book_img(4).jpg",
  },
  {
    id: "5",
    title: "المنهاج في تزكية النفوس",
    author: "أحمد بن عطاء الله السكندري",
    price: 28000,
    image: "/images/book_img(5).jpg",
  },
  {
    id: "6",
    title: "أصول العقيدة الإسلامية",
    author: "د. عمر الأشقر",
    price: 42000,
    image: "/images/book_im(6).jpg",
  },
  {
    id: "7",
    title: "الرحيق المختوم في السيرة النبوية",
    author: "صفي الرحمن المباركفوري",
    price: 38000,
    image: "/images/book_img(7).jpg",
  },
  {
    id: "8",
    title: "أحكام القرآن",
    author: "ابن العربي",
    price: 55000,
    image: "/images/book_img(8).jpg",
  },
  {
    id: "9",
    title: "جامع العلوم والحكم",
    author: "ابن رجب الحنبلي",
    price: 48000,
    image: "/images/book_img(9).jpg",
  },
  {
    id: "10",
    title: "رياض الصالحين",
    author: "النووي",
    price: 35000,
    image: "/images/book_img(10).jpg",
  },
  {
    id: "11",
    title: "البداية والنهاية",
    author: "ابن كثير",
    price: 68000,
    image: "/images/book_img(11).jpg",
  },
  {
    id: "12",
    title: "صحيح البخاري",
    author: "الإمام البخاري",
    price: 72000,
    image: "/images/book_img(12).jpg",
  },
  {
    id: "13",
    title: "صحيح مسلم",
    author: "الإمام مسلم",
    price: 70000,
    image: "/images/book_img(13).jpg",
  },
  {
    id: "14",
    title: "سنن الترمذي",
    author: "الترمذي",
    price: 45000,
    image: "/images/book_img(14)jpg.jpg",
  },
  {
    id: "15",
    title: "سنن النسائي",
    author: "النسائي",
    price: 43000,
    image: "/images/book_img(15).jpg",
  },
  {
    id: "16",
    title: "سنن أبي داود",
    author: "أبو داود",
    price: 41000,
    image: "/images/book_img(9).jpg",
  },
  {
    id: "17",
    title: "الجامع الصحيح",
    author: "الترمذي",
    price: 52000,
    image: "/images/book_img(17).jpg",
  },
  {
    id: "18",
    title: "المسند",
    author: "أحمد بن حنبل",
    price: 68000,
    image: "/images/book_img(18).jpg",
  },
  {
    id: "19",
    title: "الموطأ",
    author: "الإمام مالك",
    price: 55000,
    image: "/images/book_img(19).jpg",
  },
  {
    id: "20",
    title: "سنن الدارمي",
    author: "الدارمي",
    price: 48000,
    image: "/images/book_img(20).jpg",
  },
  {
    id: "21",
    title: "صحيح ابن خزيمة",
    author: "ابن خزيمة",
    price: 62000,
    image: "/images/book_img(21).jpg",
  },
];

