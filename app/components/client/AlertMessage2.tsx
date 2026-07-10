'use client'

import useAlertStore from '@/app/hooks/store/alert'
import React from 'react'

const AlertMessage2 = () => {

      const { message2, status } = useAlertStore();

      if (message2 === "") return

      return (
            <div id='alertMessage2' className={`w-full p-3 leading-[15px]! mx-auto rounded text-center my-5 font-black! text-[13px] ${status === 'error' ? 'bg-[#f8d7da] text-[#58151c]' : 'bg-[#d1e7dd] text-[#0a3622]'} `}>
                  {message2 === "loading" ? <span className="loading loading-spinner w-5 h-5 border-white"></span> : message2}
            </div>
      )
}

export default AlertMessage2


