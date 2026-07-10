'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'


export default function RouteProgress() {

      const pathname = usePathname();
      NProgress.configure({ showSpinner: false });

      useEffect(() => {

            NProgress.start()

            //Scroll to top
            window.scrollTo(0, 0);

            setTimeout(() => NProgress.done(), 300);

      }, [pathname])

      return null
}


