import { Almarai } from "next/font/google";
import "./globals.css";
import RouteProgress from "./components/client/RouteProgress";
import SessionProvider from "./providers/SessionProvider";
import AlertModal from "./components/client/AlertModal";
import { DEFAULT_METAOBJ } from "@/constants";
import Script from "next/script";
import { Viewport } from "next";
import { ErrorBoundary } from "@sentry/nextjs";
import { Analytics } from "@vercel/analytics/next"
// import InstallPWAUniversalModal from "./components/client/InstallPWAUniversalModal";

const font = Almarai({
      variable: "--font-almarai",
      weight: ["400", "700"],
      subsets: ["latin"]
});

export const metadata = {
      ...DEFAULT_METAOBJ
};


export function generateViewport(): Viewport {
      return {
            width: 'device-width',
            initialScale: 1,
            maximumScale: 1,
            userScalable: false,
      }
}

export default function RootLayout({
      children
}: Readonly<{ children: React.ReactNode }>) {
      return (

            <html lang="en" data-theme="light">

                  <head>

                        <link rel="icon" href="/favicon.ico" />
                        <link rel="apple-touch-icon" href="/favicon.ico" />

                        <link rel="apple-touch-icon" sizes="64x64" href="/assets/images/pwa/pwa-64x64.png" />
                        <link rel="apple-touch-icon" sizes="192x192" href="/assets/images/pwa/pwa-192x192.png" />
                        <link rel="apple-touch-icon" sizes="512x512" href="/assets/images/pwa/pwa-512x512.png" />

                        <link rel="icon" type="image/png" sizes="64x64" href="/assets/images/pwa/pwa-64x64.png" />
                        <link rel="icon" type="image/png" sizes="192x192" href="/assets/images/pwa/pwa-192x192.png" />
                        <link rel="icon" type="image/png" sizes="512x512" href="/assets/images/pwa/pwa-512x512.png" />

                        <link rel="manifest" href="/manifest.json" />

                  </head>

                  <body className={`${font.variable} antialiased`}>

                        <Analytics />
                        <SessionProvider />
                        <RouteProgress />
                        <AlertModal />

                        {/* <InstallPWAUniversalModal /> */}

                        <ErrorBoundary>
                              {children}
                        </ErrorBoundary>


                        <Script id="prevent-zoom" strategy="afterInteractive">
                              {`
                                    document.addEventListener("keydown", function(event) {
                                    if (event.ctrlKey && (
                                    event.keyCode === 107 || event.keyCode === 109 || 
                                    event.keyCode === 187 || event.keyCode === 189)) {
                                    event.preventDefault();
                                    }
                                    });

                                    document.addEventListener("wheel", function(event) {
                                    if (event.ctrlKey) {
                                    event.preventDefault();
                                    }
                                    }, { passive: false });

                                    document.addEventListener("DOMMouseScroll", function(event) {
                                    if (event.ctrlKey) {
                                    event.preventDefault();
                                    }
                                    }, { passive: false });

                                      // Block pinch-zoom gesture (for iOS Safari)
                                    document.addEventListener('gesturestart', function (e) {
                                          e.preventDefault();
                                    });
                                    document.addEventListener('gesturechange', function (e) {
                                          e.preventDefault();
                                    });
                                    document.addEventListener('gestureend', function (e) {
                                          e.preventDefault();
                                    });
                              `}
                        </Script>

                  </body>
            </html>
      );
}


