'use client'

import React, { useEffect } from 'react'
import useAdminSessionStore from '../hooks/auth/admin'

const AdminSessionProvider = () => {

      const initSession = useAdminSessionStore(s => s.initAdminSession);

      useEffect(() => {
            initSession();
      }, [initSession])

      return <></>
}

export default AdminSessionProvider

