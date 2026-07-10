'use client'

import useAlertStore from '@/app/hooks/store/alert'
import React from 'react'

const AlertMessage = () => {


      const { message } = useAlertStore();

      if (message === "") return

      return (
            <div id='alertMessage' className='text-center my-5 font-bold! text-[80%]'>
                  {message}
            </div>
      )
}

export default AlertMessage


