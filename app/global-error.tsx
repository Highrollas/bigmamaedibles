"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {

      useEffect(() => {
            // Report error to Sentry
            Sentry.captureException(error);

            // Reload the page immediately
            if (typeof window !== "undefined") {
                  // Optional: delay a tiny bit so Sentry can send
                  setTimeout(() => {
                        if (process.env.NODE_ENV === 'production') {
                              window.location.reload();
                        }
                  }, 500);
            }
      }, [error]);

      // Render nothing (avoids white screen error page)
      return null;
}


