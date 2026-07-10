import { BillingObj } from '@/Interface'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface Props {
      billingObj: BillingObj,
      showChangeDefault?: boolean;
      showEdit?: boolean;
      showDelete?: boolean;
      showDefault?: boolean;
      onDelete?: () => void;
      onEdit?: () => void;
}

const DefaultAddress = ({ billingObj, showChangeDefault, showEdit, showDelete, showDefault, onDelete, onEdit }: Props) => {
      return (
            <div>
                  <div className="w-full mt-4">
                        <div className="float-label font-[550]! tracking-[1px]"> {billingObj.addressObj.nickname} </div>
                        <div className={'form-box-2 ' + (showDefault ? billingObj.default == true ? 'isdefaultBillingObj' : '' : '')}>
                              <div className="flex justify-between items-center py-2 w-full">
                                    <div className="text-start ps-3 text-[70%] leading-[18px]! font-[550]!">
                                          {billingObj.firstName + " " + billingObj.lastName}<br />
                                          {billingObj.addressObj.street} <br />
                                          {billingObj.addressObj.state != "" && <> {billingObj.addressObj.state} < br /> </>}
                                          {billingObj.addressObj.city} <br />
                                          {billingObj.addressObj.country}  <br />
                                          {billingObj.addressObj.postcode} <br />
                                          {billingObj.email} <br />
                                    </div>
                                    <div className="flex items-center">
                                          {showChangeDefault &&
                                                <Link href="/account/addresses/" className="mr-3">
                                                      <Image height={250} width={250} className='h-5 w-5' src="/assets/images/edit.png" alt="edit" />
                                                </Link>
                                          }

                                          {showEdit &&
                                                <div className="mr-3"
                                                      onClick={() => onEdit ? onEdit() : null}>
                                                      <Image height={250} width={250} className='h-5 w-5' src="/assets/images/edit.png" alt="edit" />
                                                </div>
                                          }

                                          {showDelete &&
                                                <div className="mr-3"
                                                      onClick={() => onDelete ? onDelete() : null}>
                                                      <Image height={250} width={250} className='h-5 w-5' src="/assets/images/delete.png" alt="edit" />
                                                </div>
                                          }
                                    </div>
                              </div>
                        </div>
                  </div>
            </div>
      )
}

export default DefaultAddress


