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
  title: "مكتبة بشر",
  description: "حل بسيط لبيع الكتب أونلاين",
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
