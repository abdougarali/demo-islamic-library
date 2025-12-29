"use client";

import { useEffect } from "react";
import Script from "next/script";

interface FacebookPixelProps {
  pixelId?: string;
}

/**
 * Facebook Pixel Component
 * لتتبع الزوار والأحداث في الصفحة
 * 
 * كيفية الحصول على Pixel ID:
 * 1. اذهب إلى Facebook Events Manager: https://business.facebook.com/events_manager
 * 2. أنشئ Pixel جديد أو اختر Pixel موجود
 * 3. انسخ Pixel ID (مثل: 123456789012345)
 * 4. أضف Pixel ID في ملف .env.local كالتالي:
 *    NEXT_PUBLIC_FACEBOOK_PIXEL_ID=123456789012345
 */
export default function FacebookPixel({ pixelId }: FacebookPixelProps) {
  // استخدام Pixel ID من Environment Variable إذا لم يتم تمريره
  const fbPixelId = pixelId || process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

  useEffect(() => {
    if (!fbPixelId) {
      console.warn("Facebook Pixel ID غير موجود. أضف NEXT_PUBLIC_FACEBOOK_PIXEL_ID في .env.local");
      return;
    }

    // Initialize Facebook Pixel
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("init", fbPixelId);
      (window as any).fbq("track", "PageView");
    }
  }, [fbPixelId]);

  if (!fbPixelId) {
    return null; // لا تعرض أي شيء إذا لم يكن هناك Pixel ID
  }

  return (
    <>
      <Script
        id="facebook-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${fbPixelId}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${fbPixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}

/**
 * Helper function to track custom events
 * يمكن استخدامها في أي مكان في الكود لتتبع الأحداث
 * 
 * أمثلة:
 * - trackEvent('ViewContent', { content_name: 'Book Title' })
 * - trackEvent('InitiateCheckout', { value: 45.9, currency: 'TND' })
 * - trackEvent('Contact')
 */
export function trackFacebookEvent(
  eventName: string,
  eventData?: Record<string, any>
) {
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", eventName, eventData);
  }
}


