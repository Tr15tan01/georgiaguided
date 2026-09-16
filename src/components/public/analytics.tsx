import Script from "next/script";

export function Analytics({ gaId, plausibleDomain }: { gaId?: string; plausibleDomain?: string }) {
  const id = gaId || process.env.NEXT_PUBLIC_GA_ID;
  const safeId = id && /^G-[A-Z0-9]+$/i.test(id) ? id : null;
  return (
    <>
      {safeId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${safeId}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${safeId}',{anonymize_ip:true});`}
          </Script>
        </>
      )}
      {plausibleDomain && /^[a-z0-9.-]+$/i.test(plausibleDomain) && (
        <Script defer data-domain={plausibleDomain} src="https://plausible.io/js/script.js" strategy="afterInteractive" />
      )}
    </>
  );
}
