'use client'

import useProductsStore from '@/app/hooks/store/product'
import Image from 'next/image'
import FilterComponent from './FilterComponent'
import useCategoriesStore from '@/app/hooks/store/category'
import { APP_URL, CURRENCY_SYMBOL } from '@/constants'
import Link from 'next/link'
import { Copy, Trash } from 'lucide-react'
import { ProductObj, ReqResp } from '@/Interface'
import useAlertStore from '@/app/hooks/store/alert'
import APIClient from '@/app/services/apiClient'
import useAdminSessionStore from '@/app/hooks/auth/admin'

const AdminProductList = () => {


      const { products, filterQuery, setFilterQuery, fetchProducts, saveProducts, loading } = useProductsStore();
      const { categories } = useCategoriesStore();
      const { setModalMessage } = useAlertStore();
      const admin = useAdminSessionStore(state => state.admin);

      const deleteProduct = async (product: ProductObj) => {
            const confirmDelete = await setModalMessage("Are You Sure You Want To Delete " + product.name + " ?", "dialog");
            if (confirmDelete) {

                  const resp = await new APIClient<ReqResp & { product: ProductObj }>('admin/products?id=' + product._id).delete();
                  if (resp.status === "success") {
                        setModalMessage("Product Successfully Deleted");
                        saveProducts(products.filter(p => p._id !== product._id));
                  } else {
                        setModalMessage(resp.message);
                  }
            }
      }

      return (
            <div>
                  <div className="overflow-x-auto bg-white rounded max-w-[95vw] sm:w-[100%] mx-auto mb-6 sm:mb-12">

                        {/* Filters */}

                        <FilterComponent
                              filterQuery={filterQuery}
                              setFilterQuery={setFilterQuery}
                              onApply={fetchProducts}
                              categories={categories}
                              showSearch={admin?.accessLevel === "A" || admin?.accessLevel === "AA"}
                        />

                        {loading &&
                              < div className='flex justify-center items-center h-[100px] w-full mx-auto'>
                                    <span className="loading loading-spinner w-5 h-5 brand-border"></span>
                              </div>
                        }

                        {(!loading && products.length === 0) &&
                              <div className='text-center w-full my-12'>Products Not Found For Selected Query</div>
                        }


                        {(!loading && products.length > 0) &&

                              <table className="table" style={{ zoom: ".75" }}>

                                    <thead>
                                          <tr>
                                                <th>
                                                      <label>
                                                            <input type="checkbox" className="checkbox" />
                                                      </label>
                                                </th>
                                                <th>Name</th>
                                                <th>Stock</th>
                                                {
                                                      (admin?.accessLevel === "A" || admin?.accessLevel === "AA") && <>
                                                            <th>Action</th>
                                                      </>
                                                }
                                                <th>Price</th>
                                                <th>Categories</th>
                                                <th>Type</th>
                                                <th>Views</th>
                                          </tr>
                                    </thead>

                                    <tbody>

                                          {products.map((product, i) =>
                                                <tr key={i}>
                                                      <th>
                                                            <label>
                                                                  <input type="checkbox" className="checkbox" />
                                                            </label>
                                                      </th>
                                                      <td>
                                                            <div className="flex items-center gap-3">
                                                                  <div className="avatar">
                                                                        <div className="mask mask-squircle h-12 w-12">
                                                                              <Image
                                                                                    src={product.images[0]}
                                                                                    alt={product.name} height={50} width={50} />
                                                                        </div>
                                                                  </div>
                                                                  <div>
                                                                        <div className="font-bold">{product.name}</div>
                                                                        <Link prefetch={false} target='_blank' href={APP_URL + '/product/' + product.slug} className="text-sm opacity-50 underline">{APP_URL}/products/{product.slug}</Link>
                                                                  </div>
                                                            </div>
                                                      </td>
                                                      {
                                                            (admin?.accessLevel === "A" || admin?.accessLevel === "AA") && <>
                                                                  <th>
                                                                        <Link href={'/admin/products/edit/' + product._id} className="btn btn-ghost btn-xs">Edit</Link>
                                                                        <Link href={'/admin/products/add/' + product._id} className="btn btn-ghost btn-xs ms-2">
                                                                              <Copy />
                                                                        </Link>
                                                                        <button onClick={() => deleteProduct(product)} className="btn btn-ghost btn-xs ms-2">
                                                                              <Trash />
                                                                        </button>
                                                                  </th>
                                                            </>
                                                      }
                                                      <td>
                                                            <strong>  {product.stockQty > 0 ? <span className='text-green-600'>In Stock</span> : <span className='text-red-600'>Out Of Stock</span>} ({product.stockQty}) </strong>
                                                      </td>
                                                      <td>{CURRENCY_SYMBOL}{product.price}</td>
                                                      <td>{product.categories?.join(',')}</td>
                                                      <td>{product.productType}</td>
                                                      <td>{product.viewsCount ?? 0}</td>

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
                                                <th>Stock</th>
                                                {
                                                      (admin?.accessLevel === "A" || admin?.accessLevel === "AA") && <>
                                                            <th>Action</th>
                                                      </>
                                                }
                                                <th>Price</th>
                                                <th>Categories</th>
                                                <th>Type</th>
                                                <th>Views</th>

                                          </tr>
                                    </tfoot>
                              </table>
                        }
                  </div>
            </div>
      )
}

export default AdminProductList


