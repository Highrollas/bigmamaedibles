import { ProductObj } from '@/Interface'
import FallbackImage from '../client/FallbackImage';
import Link from 'next/link';
import React from 'react'
import UpsellAddToCart from './UpsellAddToCart';
import AlertMessage from './AlertMessage';
import { CURRENCY_SYMBOL } from '@/constants';
import AutoScroller from './AutoScroller';


interface Props {
      mixers: ProductObj[];
      accessories: ProductObj[];
}

const UpsellProductList = ({ mixers, accessories }: Props) => {
      return (
            <div>
                  <div className="flex flex-col items-center text-[90%] mt-2" style={{ scrollbarWidth: 'none' }}>

                        {[...mixers, ...accessories].map((product, index) => (
                              <div key={index} className='flex w-full p-2 items-center justify-baseline border-b border-gray-300'>
                                    <FallbackImage
                                          width={1000}
                                          height={1000}
                                          className="h-[60px] w-[auto] object-cover mx-auto"
                                          src={product.images[0]}
                                          alt={product.name}
                                    />
                                    <div className="w-full text-center mt-2">
                                          <p className="sm:text-2xl whitespace-normal font-bold!" style={{ fontSize: '0.88em' }}>{product.name}</p>
                                          <p>{CURRENCY_SYMBOL}{product.price}</p>
                                    </div>
                                    <UpsellAddToCart productObj={JSON.parse(JSON.stringify(product))} productType='Single' />
                              </div>
                        ))}

                  </div>

            </div>
      )
}

export default UpsellProductList

