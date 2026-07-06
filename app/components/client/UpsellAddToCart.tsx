'use client'

import React, { useState } from 'react';
import FallbackImage from './FallbackImage';
import useCartStore from '@/app/hooks/store/cart';
import { generateRandomString } from '@/app/Helper';
import { ProductObj, ProductType } from '@/Interface';
import useAlertStore from '@/app/hooks/store/alert';
import { Check } from 'lucide-react';

interface Props {
      productObj: ProductObj;
      productType: ProductType
}

const UpsellAddToCart = ({ productObj, productType }: Props) => {
      const { add } = useCartStore();
      const { setMessage } = useAlertStore();
      const [added, setAdded] = useState(false);

      const addToCart = () => {
            add({
                  id: generateRandomString(),
                  productObj,
                  cartQty: 1,
                  productType
            });
            setMessage(`" ${productObj.name} " Has Been Added To Your Box`);
            setAdded(true);
            setTimeout(() => setAdded(false), 3000);
      };

      return (
            <div className=''>
                  <button onClick={addToCart} className='btn h-7! w-13! py-0! px-0! text-[12px]! flex items-center justify-center'>
                        {added ? <Check size={20} className="text-white" /> : 'Add'}
                  </button>
            </div>
      );
}

export default UpsellAddToCart

