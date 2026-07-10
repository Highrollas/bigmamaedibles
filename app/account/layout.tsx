'use client'

import useClearAlertsOnRouteChange from "../hooks/custom/useClearAlertsOnRouteChange";

export default function AccountLayout({ children }: { children: React.ReactNode }) {

      useClearAlertsOnRouteChange();

      return (
            <>
                  {children}

            </>
      );
}


