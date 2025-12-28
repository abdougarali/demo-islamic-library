import type { Metadata } from "next";
import { Reem_Kufi, Amiri, Cairo } from "next/font/google";
import "./globals.css";

const reemKufi = Reem_Kufi({
  weight: ["400", "700"],
  subsets: ["arabic", "latin"],
  variable: "--font-reem-kufi",
  display: "swap", // تحسين أداء تحميل الخط
});

const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic", "latin"],
  variable: "--font-amiri",
  display: "swap",
});

const cairo = Cairo({
  weight: ["400", "600", "700"],
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "مكتبة بشر - شراء الكتب الإسلامية أونلاين",
  description: "مكتبة إسلامية أونلاين - اطلب كتابك المفضل عبر واتساب بسهولة. مجموعة متنوعة من الكتب الإسلامية والفقهية والتفسير",
  keywords: ["مكتبة إسلامية", "كتب إسلامية", "كتب دينية", "كتب فقهية", "تفسير القرآن", "السيرة النبوية", "شراء كتب أونلاين", "تونس"],
  authors: [{ name: "مكتبة بشر" }],
  openGraph: {
    title: "مكتبة بشر - شراء الكتب الإسلامية أونلاين",
    description: "مكتبة إسلامية أونلاين - اطلب كتابك المفضل عبر واتساب بسهولة",
    type: "website",
    locale: "ar_TN",
  },
  twitter: {
    card: "summary_large_image",
    title: "مكتبة بشر - شراء الكتب الإسلامية أونلاين",
    description: "مكتبة إسلامية أونلاين - اطلب كتابك المفضل عبر واتساب بسهولة",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${reemKufi.variable} ${amiri.variable} ${cairo.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
