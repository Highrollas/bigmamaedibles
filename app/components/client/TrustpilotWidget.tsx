
"use client";
import { useEffect } from "react";

const TrustpilotWidget = () => {

      useEffect(() => {
            const script = document.createElement("script");
            script.src = "//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js";
            script.async = true;
            document.body.appendChild(script);

            return () => {
                  document.body.removeChild(script);
            };
      }, []);

      return (
            <div
                  className="trustpilot-widget bg-[#e21893]"
                  data-locale="en-GB"
                  data-template-id="56278e9abfbbba0bdcd568bc"
                  data-businessunit-id="64852503bdcb3cc9a772228c"
                  data-style-height="40"
                  data-style-width="100%"
                  data-token="6e0de65b-9fb2-451b-8cad-649c75994263"
            >
                  <a
                        href="https://uk.trustpilot.com/review/bigmamasedibles.cc"
                        target="_blank"
                        rel="noopener"
                  >
                        Trustpilot
                  </a>
            </div>
      );
}

export default TrustpilotWidget


