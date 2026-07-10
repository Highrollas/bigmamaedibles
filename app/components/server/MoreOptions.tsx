import React from 'react'
import { ProductObj } from '@/Interface';
import Products from '@/models/Products';
import { FILTERED_CATEGORIES } from '@/constants';
import ProductListSlider from './ProductListSlider';


const MoreOptions = async ({ productObj }: { productObj: ProductObj }) => {


      if (!productObj) return null;

      const filteredCategories = productObj.categories!.filter(
            (cat: string) => !FILTERED_CATEGORIES.includes(cat)
      );

      const relatedProducts = await Products.aggregate([
            {
                  $match: {
                        status: "published",
                        categories: { $in: filteredCategories },
                        _id: { $nin: [productObj._id] },
                        stockQty: { $gt: 0 }
                  }
            },
            { $sample: { size: 5 } },
      ]);

      return (

            <div className="mt-[70px] mb-10 w-[100%] sm:w-[80%] mx-auto overflow-hidden">

                  <div className="text-center">
                        <h2 className='text-2xl'>More Options</h2>
                  </div>

                  <div className="mt-6 mx-auto overflow-hidden">
                        <ProductListSlider products={relatedProducts} />
                  </div>

            </div>

      )
}

export default MoreOptions


