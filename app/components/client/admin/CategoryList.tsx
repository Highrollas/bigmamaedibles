'use client'

import useCategoriesStore from '@/app/hooks/store/category'
import { APP_URL } from '@/constants'
import Link from 'next/link'
import { Trash } from 'lucide-react'
import { CategoryObj, ReqResp } from '@/Interface'
import useAlertStore from '@/app/hooks/store/alert'
import APIClient from '@/app/services/apiClient'
import HtmlParser from '../../server/HtmlParser'

const AdminCategoryList = () => {


      const { categories, saveCategories, loading } = useCategoriesStore();
      const { setModalMessage } = useAlertStore();

      const deleteCategory = async (category: CategoryObj) => {
            const confirmDelete = await setModalMessage("Are You Sure You Want To Delete " + category.name + " ?", "dialog");
            if (confirmDelete) {

                  const resp = await new APIClient<ReqResp & { category: CategoryObj }>('admin/categories?id=' + category._id).delete();
                  if (resp.status === "success") {
                        setModalMessage("Category Successfully Deleted");
                        saveCategories(categories.filter(p => p._id !== category._id));
                  } else {
                        setModalMessage(resp.message);
                  }
            }
      }

      return (
            <div>
                  <div className="overflow-x-auto bg-white rounded max-w-[95vw] sm:w-[100%] mx-auto mb-6 sm:mb-12">


                        {loading &&
                              < div className='flex justify-center items-center h-[100px] w-full mx-auto'>
                                    <span className="loading loading-spinner w-5 h-5 brand-border"></span>
                              </div>
                        }

                        {(!loading && categories.length === 0) &&
                              <div className='text-center w-full my-12'>Categories Not Found For Selected Query</div>
                        }


                        {(!loading && categories.length > 0) &&

                              <table className="table" style={{ zoom: ".75" }}>

                                    <thead>
                                          <tr>

                                                <th>
                                                      <label>
                                                            <input type="checkbox" className="checkbox" />
                                                      </label>
                                                </th>

                                                <th>Name</th>
                                                <th>Action</th>
                                                <th>Slug</th>
                                                <th>Products</th>
                                                <th>description</th>
                                                <th>Views</th>

                                          </tr>
                                    </thead>

                                    <tbody>

                                          {categories.map((category, i) =>
                                                <tr key={i}>
                                                      <th>
                                                            <label>
                                                                  <input type="checkbox" className="checkbox" />
                                                            </label>
                                                      </th>
                                                      <td>
                                                            <div className="flex items-center gap-3">
                                                                  <div>
                                                                        <div className="font-bold">{category.name}</div>
                                                                        <Link prefetch={false} target='_blank' href={APP_URL + '/product-category/' + category.slug} className="text-sm opacity-50 underline">{APP_URL}/product-category/{category.slug}</Link>
                                                                  </div>
                                                            </div>
                                                      </td>
                                                      <th>
                                                            <Link href={'/admin/categories/edit/' + category._id} className="btn btn-ghost btn-xs">Edit</Link>
                                                            <button onClick={() => deleteCategory(category)} className="btn btn-ghost btn-xs ms-2">
                                                                  <Trash />
                                                            </button>
                                                      </th>
                                                      <td>
                                                            {category.slug}
                                                      </td>
                                                      <td>
                                                            0
                                                      </td>
                                                      <td className='w-[20%]'>{<HtmlParser text={category.description} />}</td>
                                                      <td>{category.views}</td>
                                                </tr>
                                          )}

                                    </tbody>

                                    <tfoot>
                                          <tr>
                                                <th>
                                                      <label>
                                                            <input type="checkbox" className="checkbox" />
                                                      </label>
                                                </th>
                                                <th>Name</th>
                                                <th>Action</th>
                                                <th>Slug</th>
                                                <th>Products</th>
                                                <th>description</th>
                                                <th>Views</th>

                                          </tr>
                                    </tfoot>
                              </table>
                        }
                  </div>
            </div >
      )
}

export default AdminCategoryList

