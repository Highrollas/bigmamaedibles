'use client'
import { generateRandomString, scrollIntoViewById } from '@/app/Helper'
import useAlertStore from '@/app/hooks/store/alert'
import useCartStore from '@/app/hooks/store/cart'
import { ProductObj, VariationObj } from '@/Interface'
import React from 'react'


interface Props {
      productObj: ProductObj;
      disabled?: boolean;
      cheekyVariation?: VariationObj[];
      bundleVariation?: VariationObj;
      selectedVariation?: VariationObj | null,
}

const AddToCartBtn = ({ productObj, disabled, bundleVariation, cheekyVariation }: Props) => {

      const { add } = useCartStore();
      const { setMessage } = useAlertStore();

      const _bundleVariation = { ...bundleVariation } as VariationObj;
      const _cheekyVariation = (cheekyVariation || []).map(cv => ({ ...cv }));

      const _productObj = { ...productObj } as ProductObj;

      if (_bundleVariation) {
            delete _bundleVariation.products;
      }

      _cheekyVariation?.forEach(cv => {
            delete cv.products
      })

      if (_productObj) {
            delete _productObj.variations;
            delete _productObj.categories;
            delete _productObj.updatedAt;
            delete _productObj.createdAt;
            delete _productObj.description;
            delete _productObj.shortDescription
      }

      const addToCart = () => {
            add({
                  id: generateRandomString(),
                  productObj: _productObj,
                  cartQty: 1,
                  bundleVariation: _bundleVariation,
                  cheekyVariation: _cheekyVariation,
                  productType: productObj.productType
            });
            setMessage(`"${productObj.name}" Has Been Added To Your Box`);

            scrollIntoViewById("header");
      }

      return (
            <div>
                  <button disabled={disabled} onClick={addToCart} className="btn w-full">Add To Box</button>
            </div>
      )
}

export default AddToCartBtn

