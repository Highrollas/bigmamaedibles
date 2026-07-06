
'use client';

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import useAlertStore from "../store/alert";

const useClearAlertsOnRouteChange = () => {
      const pathname = usePathname();
      const setMessage = useAlertStore((s) => s.setMessage);
      const setMessage2 = useAlertStore((s) => s.setMessage2);
      const setModalMessage = useAlertStore((s) => s.setModalMessage);

      useEffect(() => {

            setMessage("");
            setMessage2("");
            setModalMessage("");

      }, [pathname, setMessage, setMessage2, setModalMessage]);
};

export default useClearAlertsOnRouteChange;

