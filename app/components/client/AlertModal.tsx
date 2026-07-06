'use client'

import useAlertStore from '@/app/hooks/store/alert';
import React from 'react'

export const openAlert = () => {
      document.getElementById("my_modal_6_btn")?.click();
}

const AlertModal = () => {

      const { modalAlertMessage, modalType, setModalResp } = useAlertStore();

      return (

            <div style={{ zoom: '0.95' }}>
                  <label htmlFor="my_modal_6" id='my_modal_6_btn' className="hidden"></label>
                  <input type="checkbox" id="my_modal_6" className="modal-toggle" />
                  <div className="modal" role="dialog">
                        <div className="modal-box py-4">
                              <p className="font-[550]! text-[13px] text-center leading-[20px]!">{modalAlertMessage}</p>
                              <div className='flex justify-between'>

                                    <div className="modal-action my-0">
                                          {modalType === "dialog" &&
                                                <label onClick={() => setModalResp(false)} htmlFor="my_modal_6" className="btn bg-red-600! scale-80 text-white rounded-lg">Close</label>
                                          }
                                    </div>

                                    <div className="modal-action my-0">
                                          <label onClick={() => setModalResp(true)} htmlFor="my_modal_6" className="btn scale-80 text-white rounded-lg">Ok</label>
                                    </div>
                              </div>
                        </div>
                  </div>
            </div>
      )
}

export default AlertModal

