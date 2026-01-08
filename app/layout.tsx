import type { Metadata } from "next";
import { Reem_Kufi, Amiri, Cairo } from "next/font/google";
import "./globals.css";
import FacebookPixel from "@/components/FacebookPixel";
import { ToastProvider } from "@/components/ToastContainer";

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
  title: "مكتبة النور - شراء الكتب الإسلامية أونلاين",
  description: "مكتبة إسلامية أونلاين - اطلب كتابك المفضل عبر واتساب بسهولة. مجموعة متنوعة من الكتب الإسلامية والفقهية والتفسير",
  keywords: ["مكتبة إسلامية", "كتب إسلامية", "كتب دينية", "كتب فقهية", "تفسير القرآن", "السيرة النبوية", "شراء كتب أونلاين", "تونس"],
  authors: [{ name: "مكتبة النور" }],
  openGraph: {
    title: "مكتبة النور - شراء الكتب الإسلامية أونلاين",
    description: "مكتبة إسلامية أونلاين - اطلب كتابك المفضل عبر واتساب بسهولة",
    type: "website",
    locale: "ar_TN",
  },
  twitter: {
    card: "summary_large_image",
    title: "مكتبة النور - شراء الكتب الإسلامية أونلاين",
    description: "مكتبة إسلامية أونلاين - اطلب كتابك المفضل عبر واتساب بسهولة",
  },
};

// Structured Data for SEO - يتم إضافتها في layout لتجنب hydration mismatch
const structuredData = {
  "@context": "https://schema.org",
  "@type": "BookStore",
  name: "مكتبة النور",
  description: "مكتبة إسلامية أونلاين - اطلب كتابك المفضل عبر واتساب بسهولة",
  telephone: "+905011375220",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressCountry: "TN",
    addressLocality: "تونس"
  },
  sameAs: [
    "https://www.facebook.com/profile.php?id=100092725701351",
    "https://www.instagram.com/Books.besher"
  ],
  potentialAction: {
    "@type": "CommunicateAction",
    target: "https://wa.me/+905011375220",
    "http://schema.org/instrument": "WhatsApp"
  }
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
        {/* Structured Data for SEO - في layout (Server Component) لتجنب hydration mismatch */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <ToastProvider>
          <FacebookPixel />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
