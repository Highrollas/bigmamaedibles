'use client'

import React, { useEffect } from 'react'
import useSessionStore from '../hooks/auth/user'

const SessionProvider = () => {

      const initSession = useSessionStore(s => s.initSession);

      useEffect(() => {
            initSession();
      }, [initSession])

      return <></>
}

export default SessionProvider

