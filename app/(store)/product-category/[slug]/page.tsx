import ProductList from '@/app/components/server/ProductList';
import parse from 'html-react-parser';
import { CategoryObj, ProductObj } from '@/Interface';
import Category from '@/models/Category';
import Products from '@/models/Products';
import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { generateCategoryMetadata } from '@/app/Helper/server';

interface Props {
      params: Promise<{ slug: string }>;
      searchParams?: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props) {
      const _params = await params;
      return await generateCategoryMetadata({ params: _params! });
}

const ProductCategoryPage = async ({ params, searchParams }: Props) => {

      if (!params) return null;

      const { slug } = await params;

      let page: string | undefined = "1";

      if (searchParams) {
            page = (await searchParams).page;
      }

      const categoryObj = await Category.findOne({ slug }).lean<CategoryObj>();

      if (!categoryObj) redirect('/not-found');

      const currentPage = parseInt(page || '1', 10) || 1;
      const perPage = 30;
      const skip = (currentPage - 1) * perPage;

      // Get total count for pagination
      const totalCount = await Products.countDocuments({ categories: categoryObj.name, status: "published" });

      const products = await Products.find({ categories: categoryObj.name, status: "published" })
            .sort(slug === "accessories" ? { stockQty: -1, csort: -1 } : { csort: -1, stockQty: -1, updatedAt: -1 })
            .skip(skip)
            .limit(perPage)
            .lean<ProductObj[]>();

      const totalPages = Math.ceil(totalCount / perPage);

      return (
            <div>
                  <div className='mt-12 mb-5 text-center'>
                        <h1 className='text-3xl sm:text-4xl font-bold text-[#e21893]'>{categoryObj.name}</h1>
                  </div>

                  <div className="w-[90%] text-center mt-8 mb-6 mx-auto">
                        <div className='text-[#e21893] font-bold!'>{parse(categoryObj.description || "")}</div>
                  </div>

                  {/* {(slug === "shake" || slug == "trim") &&
                        <div className='flex justify-center gap-3 my-5'>
                              <Link href="/product-category/shake" className={(slug === "shake" ? "bg-[#e21893] text-white" : "bg-white text-black") + " ic-img py-[15px] px-[20px] rounded-[0.375rem]"}>Shake</Link>
                              <Link href="/product-category/trim" className={(slug === "trim" ? "bg-[#e21893] text-white" : "bg-white text-black") + " ic-img py-[15px] px-[20px] rounded-[0.375rem]"}>Trim</Link>
                        </div>
                  } */}

                  <div className="mb-12 mt-6 w-[100%] sm:w-[80%] mx-auto">
                        <ProductList products={products} />
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                        <div className='w-full flex justify-center'>
                              <div className="bg-[#e21893] flex justify-center mb-12 border-[3px] gap-[2.5px] border-[#e21893] rounded-[6px] w-fit">
                                    {[...Array(totalPages)].map((_, i) => {
                                          const pageNum = i + 1;
                                          return (
                                                <Link
                                                      key={pageNum}
                                                      href={`/product-category/${slug}?page=${pageNum}`}
                                                      className={`px-3 py-2 font-bold! flex justify-center items-center w-[40px] ${pageNum === currentPage ? 'bg-[#e21893] text-white' : 'bg-white text-black'} ${pageNum == 1 ? 'rounded-s-[4px]' : pageNum == totalPages ? 'rounded-e-[4px]' : ''}`}
                                                >
                                                      {pageNum}
                                                </Link>
                                          );
                                    })}
                              </div>
                        </div>
                  )}

            </div>
      );
}

export default ProductCategoryPage;


