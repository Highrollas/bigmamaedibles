'use client'

import usePostsStore from '@/app/hooks/store/post'
import FilterComponent from './FilterComponent'
import useCategoriesStore from '@/app/hooks/store/category'
import { APP_URL } from '@/constants'
import Link from 'next/link'
import { Copy, Trash } from 'lucide-react'
import { PostObj, ReqResp } from '@/Interface'
import useAlertStore from '@/app/hooks/store/alert'
import APIClient from '@/app/services/apiClient'

const AdminPostList = () => {


      const { posts, filterQuery, setFilterQuery, fetchPosts, savePosts, loading } = usePostsStore();
      const { categories } = useCategoriesStore();
      const { setModalMessage } = useAlertStore();

      const deletePost = async (post: PostObj) => {
            const confirmDelete = await setModalMessage("Are You Sure You Want To Delete " + post.title + " ?", "dialog");
            if (confirmDelete) {

                  const resp = await new APIClient<ReqResp & { post: PostObj }>('admin/posts?id=' + post._id).delete();
                  if (resp.status === "success") {
                        setModalMessage("Post Successfully Deleted");
                        savePosts(posts.filter(p => p._id !== post._id));
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
                              onApply={fetchPosts}
                              categories={categories}
                        />

                        {loading &&
                              < div className='flex justify-center items-center h-[100px] w-full mx-auto'>
                                    <span className="loading loading-spinner w-5 h-5 brand-border"></span>
                              </div>
                        }

                        {(!loading && posts.length === 0) &&
                              <div className='text-center w-full my-12'>Posts Not Found For Selected Query</div>
                        }


                        {(!loading && posts.length > 0) &&

                              <table className="table" style={{ zoom: ".75" }}>

                                    <thead>
                                          <tr>
                                                <th>
                                                      <label>
                                                            <input type="checkbox" className="checkbox" />
                                                      </label>
                                                </th>
                                                <th>Title</th>
                                                <th>Action</th>
                                                <th>Status</th>
                                                <th>Type</th>
                                                <th>Views</th>

                                          </tr>
                                    </thead>

                                    <tbody>

                                          {posts.map((post, i) =>
                                                <tr key={i}>
                                                      <th>
                                                            <label>
                                                                  <input type="checkbox" className="checkbox" />
                                                            </label>
                                                      </th>
                                                      <td>
                                                            <div className="flex items-center gap-3">
                                                                  <div>
                                                                        <div className="font-bold">{post.title}</div>
                                                                        <Link prefetch={false} target='_blank' href={APP_URL + '/' + post.slug} className="text-sm opacity-50 underline">{APP_URL}/{post.slug}</Link>
                                                                  </div>
                                                            </div>
                                                      </td>
                                                      <th>
                                                            <Link href={'/admin/posts/edit/' + post._id} className="btn btn-ghost btn-xs">Edit</Link>
                                                            <Link href={'/admin/posts/add/' + post._id} className="btn btn-ghost btn-xs ms-2">
                                                                  <Copy />
                                                            </Link>
                                                            <button onClick={() => deletePost(post)} className="btn btn-ghost btn-xs ms-2">
                                                                  <Trash />
                                                            </button>
                                                      </th>
                                                      <td>{post.status}</td>
                                                      <td>{post.type}</td>
                                                      <td>{post.viewsCount ?? 0}</td>

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
                                                <th>Stock</th>
                                                <th>Price</th>
                                                <th>Categories</th>
                                                <th>Type</th>

                                          </tr>
                                    </tfoot>
                              </table>
                        }
                  </div>
            </div>
      )
}

export default AdminPostList

