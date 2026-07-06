'use client'
import ProductManager from '@/app/components/client/admin/ProductManager'
import useAlertStore from '@/app/hooks/store/alert'
import useProductsStore from '@/app/hooks/store/product'
import APIClient from '@/app/services/apiClient'
import { EMPTY_PRODUCTOBJ } from '@/constants'
import { ReqResp, ProductObj } from '@/Interface'
import Link from 'next/link'
import React, { useState } from 'react'
import { useImmer } from 'use-immer'

const AddProductPage = () => {


      const [isUploading, setIsUploading] = useState(false);
      const { setModalMessage } = useAlertStore();
      const { pushProduct } = useProductsStore();

      const [productObj, setProductObj] = useImmer<ProductObj>(EMPTY_PRODUCTOBJ);

      const handleProductUpload = async () => {

            setIsUploading(true);
            const resp = await new APIClient<ReqResp & { product: ProductObj }>('admin/products').post({ ...productObj });
            if (resp.status === "success") {
                  setModalMessage("Product Successfully Uploaded");
                  pushProduct(resp.product);
                  setProductObj(EMPTY_PRODUCTOBJ);
            } else {
                  setModalMessage(resp.message);
            }

            setIsUploading(false);
      }

      return (

            <div className='w-[98%] mx-auto mt-4'>

                  <div className='my-3 flex justify-between items-center'>
                        <strong className='text-white text-2xl ms-3'>Add Product</strong>
                        <Link href="/admin/products" className='btn'>Back</Link>
                  </div>

                  <div className="bg-white rounded max-w-[95vw] sm:w-[100%] mx-auto mb-6 sm:mb-12">

                        <ProductManager productObj={productObj} setProductObj={setProductObj} />

                        <div className='w-full mx-auto text-center pb-12 mt-8'>
                              <button disabled={isUploading} className='btn w-[60%]'
                                    onClick={() => handleProductUpload()}>
                                    Add Product
                                    {isUploading && <span className='loading loading-spinner'></span>}
                              </button>
                        </div>
                  </div>

            </div>

      )
}

export default AddProductPage

