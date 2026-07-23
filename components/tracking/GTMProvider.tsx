"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

import { captureAttribution, trackPageView } from "@/lib/tracking";

/**
 * Google Tag Manager loader.
 *
 * Mounted only in the public layout — admin routes never load analytics,
 * per the performance and privacy requirements in the brief.
 */

/**
 * Consent Mode defaults + GTM loader in a single script.
 *
 * Kept in one `afterInteractive` block (rather than a separate
 * `beforeInteractive` script, which App Router only allows in the root
 * layout) so the consent-default push is guaranteed to execute on the line
 * before GTM loads. `wait_for_update` gives the cookie banner time to issue
 * its 'consent' update before any tag fires.
 */
function bootstrapScript(gtmId: string, enableConsentMode: boolean): string {
  const consent = enableConsentMode
    ? `gtag('consent','default',{ad_storage:'denied',analytics_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',functionality_storage:'denied',personalization_storage:'denied',security_storage:'granted',wait_for_update:500});`
    : "";

  const gtm = gtmId
    ? `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`
    : "";

  return `window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};${consent}${gtm}`;
}

function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Persist first-touch campaign attribution before the first event fires.
    captureAttribution();
    const query = searchParams.toString();
    trackPageView({ page_path: query ? `${pathname}?${query}` : pathname });
  }, [pathname, searchParams]);

  return null;
}

export function GTMProvider({ gtmId }: { gtmId?: string }) {
  const enableConsentMode = process.env.NEXT_PUBLIC_ENABLE_CONSENT_MODE !== "false";
  const id = gtmId || process.env.NEXT_PUBLIC_GTM_ID || "";

  return (
    <>
      {id || enableConsentMode ? (
        <Script id="gtm-bootstrap" strategy="afterInteractive">
          {bootstrapScript(id, enableConsentMode)}
        </Script>
      ) : null}
      {/* Suspense is required: useSearchParams opts the subtree into CSR bailout. */}
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
    </>
  );
}

export function GTMNoScript({ gtmId }: { gtmId?: string }) {
  const id = gtmId || process.env.NEXT_PUBLIC_GTM_ID || "";
  if (!id) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${id}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
