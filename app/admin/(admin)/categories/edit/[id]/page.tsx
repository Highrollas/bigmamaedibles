'use client'

import CategoryManager from '@/app/components/client/admin/CategoryManager';
import useAlertStore from '@/app/hooks/store/alert';
import useCategoriesStore from '@/app/hooks/store/category';
import APIClient from '@/app/services/apiClient';
import { EMPTY_CATEGORYOBJ } from '@/constants';
import { CategoryObj, ReqResp } from '@/Interface';
import { Link } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useImmer } from 'use-immer';

interface Props {
      params: Promise<{ id: string }> | undefined;
}

const AdminEditCategoryPage = ({ params }: Props) => {


      const [isUploading, setIsUploading] = useState(false);
      const { setModalMessage } = useAlertStore();
      const { saveCategoryEdit, categories } = useCategoriesStore();

      const [categoryObj, setCategoryObj] = useImmer<CategoryObj>(EMPTY_CATEGORYOBJ);

      useEffect(() => {

            (async () => {
                  const d = await params;
                  if (d?.id && categories.length > 0) {
                        const category = categories.find((c) => c._id == d?.id);
                        if (category) {
                              if (!category.metadata) {
                                    category.metadata = {
                                          title: "",
                                          description: "",
                                          ogTitle: "",
                                          keywords: ""
                                    };
                              }
                              setCategoryObj(category!);
                        }
                  }
            })();

      }, [params, categories, setCategoryObj]);

      const handleCategoryEdit = async () => {

            setIsUploading(true);

            const resp = await new APIClient<ReqResp & { category: CategoryObj }>('admin/categories').put({ ...categoryObj });
            if (resp.status === "success") {
                  setModalMessage("Category Successfully Updated");
                  saveCategoryEdit(resp.category);
            } else {
                  setModalMessage(resp.message);
            }

            setIsUploading(false);
      }

      return (

            <div className='w-[98%] mx-auto mt-4'>

                  <div className='my-3 flex justify-between items-center'>
                        <strong className='text-white text-2xl ms-3'>Edit Category</strong>
                        <Link href="/admin/categories" className='btn'>Back</Link>
                  </div>

                  <div className="bg-white rounded max-w-[95vw] sm:w-[100%] mx-auto mb-6 sm:mb-12">

                        <CategoryManager categoryObj={categoryObj} setCategoryObj={setCategoryObj} />

                        <div className='w-full mx-auto text-center pb-12 mt-8'>
                              <button disabled={isUploading} className='btn w-[60%]'
                                    onClick={() => handleCategoryEdit()}>
                                    Save Changes
                                    {isUploading && <span className='loading loading-spinner'></span>}
                              </button>
                        </div>
                  </div>

            </div>

      )
}

export default AdminEditCategoryPage
