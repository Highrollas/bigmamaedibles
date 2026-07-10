
import React from 'react'
import CartItemList from '@/app/components/client/CartItemList'
import ProceedToCheckout from '@/app/components/client/ProceedToCheckout'
import { generateMeta } from '@/app/Helper';
import Products from '@/models/Products';
import { ProductObj } from '@/Interface';

export const metadata = generateMeta({
      title: "Cart - Big Mamas Edibles"
});

const CartPage = async () => {


      const slugOrder = [
            "raw-rolling-papers",
            "elements-rolling-paper",
            "raw-tip-book",
            "elements-tip-book",
            "raw-pre-rolled-cones",
            "elements-pre-rolled-cones",
            "raw-pre-rolled-tips",
            "elements-pre-rolled-tips",
            "accessories/lighter",
            "accessories/black-grinder",
            "accessories/white-grinder"
      ];

      let accessories = await Products.find({
            status: "published",
            slug: { $in: slugOrder },
            stockQty: { $gt: 0 }
      })
            .select('name price slug images productType variations')
            .lean<ProductObj[]>();

      accessories = accessories.sort((a, b) => slugOrder.indexOf(a.slug) - slugOrder.indexOf(b.slug));

      return (
            <>
                  <div className="flex flex-wrap w-[90%] sm:w-[80%] mx-auto mb-5">

                        <div className="w-[100%] sm:w-[60%] mx-auto">

                              <CartItemList />

                              <div className='flex items-center flex-col w-full mt-5'>
                                    <ProceedToCheckout
                                          mixers={JSON.parse(JSON.stringify([]))}
                                          accessories={JSON.parse(JSON.stringify(accessories))} />
                              </div>
                        </div>

                  </div>
            </>
      )
}


export default CartPage


