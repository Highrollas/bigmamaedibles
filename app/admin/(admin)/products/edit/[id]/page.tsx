'use client'
import ProductManager from '@/app/components/client/admin/ProductManager'
import useAlertStore from '@/app/hooks/store/alert'
import useProductsStore from '@/app/hooks/store/product'
import APIClient from '@/app/services/apiClient'
import { EMPTY_PRODUCTOBJ } from '@/constants'
import { ProductObj, ReqResp } from '@/Interface'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useImmer } from 'use-immer'

interface Props {
      params: Promise<{ id: string }> | undefined;
}

const EditProductPage = ({ params }: Props) => {


      const [isUploading, setIsUploading] = useState(false);
      const { setModalMessage } = useAlertStore();
      const { saveProductEdit, products } = useProductsStore();

      const [productObj, setProductObj] = useImmer<ProductObj>(EMPTY_PRODUCTOBJ);


      useEffect(() => {

            (async () => {
                  const d = await params;
                  if (d?.id) {
                        const product = products.find((p) => p._id == d?.id);
                        if (product) setProductObj(product!);
                  }
            })();

      }, [params, products, setProductObj]);


      const handleProductEdit = async () => {

            setIsUploading(true);

            const resp = await new APIClient<ReqResp & { product: ProductObj }>('admin/products').put({ ...productObj });
            if (resp.status === "success") {
                  setModalMessage("Product Successfully Updated");
                  saveProductEdit(resp.product);
            } else {
                  setModalMessage(resp.message);
            }

            setIsUploading(false);
      }

      return (

            <div className='w-[98%] mx-auto mt-4'>

                  <div className='my-3 flex justify-between items-center'>
                        <strong className='text-white text-2xl ms-3'>Edit Product</strong>
                        <Link href="/admin/products" className='btn'>Back</Link>
                  </div>

                  <div className="bg-white rounded max-w-[95vw] sm:w-[100%] mx-auto pb-6 sm:pb-12">

                        <ProductManager productObj={productObj} setProductObj={setProductObj} />

                        <div className='w-full mx-auto text-center pb-12 mt-8'>
                              <button disabled={isUploading} className='btn w-[60%]'
                                    onClick={() => handleProductEdit()}>
                                    Save Changes
                                    {isUploading && <span className='loading loading-spinner'></span>}
                              </button>
                        </div>
                  </div>

            </div>

      )
}

export default EditProductPage

