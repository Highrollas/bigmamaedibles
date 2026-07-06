import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
      dest: "public", // where service worker & manifest will be generated
      register: true,
      skipWaiting: true,
      disable: process.env.NODE_ENV === "development", // disable PWA in dev
});

const nextConfig: NextConfig = {
      images: {
            remotePatterns: [
                  {
                        hostname: "bigmamasedibles.cc",
                        protocol: "https",
                  },
                  {
                        hostname: "cdn.bigmamasedibles.cc",
                        protocol: "https",
                  },
                  {
                        hostname: "res.cloudinary.com",
                        protocol: "https",
                  },
            ],
      }
};

// Wrap with PWA first, then with Sentry
export default withSentryConfig(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      withPWA(nextConfig as unknown as any),
      {
            org: "Big Mamas Edibles",
            project: "javascript-nextjs",
            silent: !process.env.CI,
            widenClientFileUpload: true,
            tunnelRoute: "/monitoring",
            disableLogger: true,
            automaticVercelMonitors: true,
      }
);
