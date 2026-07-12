
import AddToCartBtn from '@/app/components/client/AddToCartBtn';
import AlertMessage from '@/app/components/client/AlertMessage';
import ProductImageCarousel from '@/app/components/client/ProductImageCarousel';
import MoreOptions from '@/app/components/server/MoreOptions';
import Heading from '@/app/components/server/partials/Heading';
import BundleProductVariation from '@/app/components/server/BundleProductVariation';
import CheekyProductVariation from '@/app/components/server/CheekyProductVariation';
import { ProductObj } from '@/Interface';
import Products from '@/models/Products';
import { redirect } from 'next/navigation';
import HtmlParser from '@/app/components/server/HtmlParser';
import { generateProductMetadata } from '@/app/Helper/server';

interface Props {
      params: Promise<{ slug: string[] }> | undefined;
}

export async function generateMetadata({ params }: Props) {
      const _params = await params;
      const slug = _params?.slug ? _params!.slug.join("/") : "no-slug";
      return await generateProductMetadata({ params: { slug } })
}

const ProductDetailsPage = async ({ params }: Props) => {

      // const userSession = await getUserFromSession();

      // if (!userSession) {
      //       redirect('/account/login?authRequired=1');
      // }

      if (!params) return

      const _params = await params;

      if (!_params.slug) {
            redirect('/product-category/uk-grow');
      }

      const productObj: ProductObj | null = await Products.findOne({ slug: _params!.slug.join("/") })
            .lean<ProductObj>();

      if (!productObj) redirect('/not-found');

      await Products.updateOne({ _id: productObj._id }, { $inc: { viewsCount: 1 } });

      if (productObj.variations) {
            await Promise.all(
                  productObj.variations.map(async (v) => {
                        const products = await Products.find({
                              $and: [
                                    { categories: v.category },
                                    { categories: { $nin: ['Bundles', 'Cheeky Deals'] } },
                                    { stockQty: { $gte: 1 } }
                              ]
                        })
                              .select('_id stockQty name')
                              .lean<ProductObj[]>();

                        v.products = products;
                  })
            );
      }


      return (

            <>

                  <AlertMessage />

                  <div className="flex flex-wrap w-[90%] sm:w-[80%] mx-auto mb-5 justify-between">

                        <div className="w-[100%] sm:w-[48%]">

                              <ProductImageCarousel images={productObj.images} productName={productObj.name} />

                        </div>

                        <div className="w-[100%] sm:w-[50%] lg:w-[50%]">

                              <Heading>{productObj.name}</Heading>

                              {productObj.stockQty < 1 && productObj.productType === "Single" && <p className='text-red-600 text-center my-[30px] font-bold!'>Out Of Stock</p>}

                              <div className="text-center mt-5">
                                    <HtmlParser text={productObj.shortDescription || ""} />
                              </div>

                              {productObj.productType === "Bundles" &&
                                    <div className="my-[30px]">
                                          <BundleProductVariation productObj={JSON.parse(JSON.stringify(productObj))} />
                                    </div>
                              }

                              {productObj.productType === "CheekyDeals" &&
                                    <div className="my-[30px]">
                                          <CheekyProductVariation productObj={JSON.parse(JSON.stringify(productObj))} />
                                    </div>
                              }

                              <div>
                                    <HtmlParser text={productObj.description || ""} />
                              </div>

                              {
                                    (productObj.stockQty > 0 && productObj.productType === "Single") &&
                                    <div>
                                          <AddToCartBtn productObj={JSON.parse(JSON.stringify(productObj))} />
                                    </div>
                              }


                        </div>

                  </div>

                  <MoreOptions productObj={productObj} />
            </>
      )
}

export default ProductDetailsPage

