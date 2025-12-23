// app/components/Gtag.js (or in your layout)
'use client';

import Script from 'next/script';

export default function Gtag() {
  return (
    <>
      {/* Load GA script */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-ET549FTTHC"
      />

      {/* Initialize GA */}
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ET549FTTHC', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
