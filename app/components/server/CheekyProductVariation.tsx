'use client'

import { ProductObj, VariationObj } from '@/Interface'
import AddToCartBtn from '../client/AddToCartBtn';
import { useImmer } from 'use-immer';
import { useState } from 'react';
import { CURRENCY_SYMBOL } from '@/constants';


interface Props {
      productObj: ProductObj
}

const CheekyProductVariation = ({ productObj }: Props) => {

      const [variations, setVariations] = useImmer<VariationObj[] | null>(productObj.variations || []);
      const [showPrice, setShowPrice] = useState<boolean>(false);

      const handleSelectChange = (i: number, i2: number, pId: string) => {

            setVariations(d => {

                  if (d) {
                        d[i].selectFields[i2].productId = pId;
                        d[i].selectFields[i2].value = d[i].products!.find(p => p._id === pId)?.name || "";

                        const emptyVariationExist = d.some(v => v.selectFields.some(f => f.value === ""));
                        setShowPrice(emptyVariationExist ? false : true);
                  }
            });

      }

      return (

            <div>

                  {
                        productObj.productType === "CheekyDeals" &&
                        <div className='mt-[40px]'>
                              {
                                    variations?.map((v, i) =>
                                          <div key={i}>

                                                {
                                                      v.selectFields.map((f, i2) =>
                                                            <div className="flex my-3 items-center" key={i2}>
                                                                  <div className="w-[25%] text-[80%] font-bold! text-start">
                                                                        {v.label} {i2 > 0 && i2 + 1}
                                                                  </div>
                                                                  <div className="w-[75%]">
                                                                        <select onChange={(e) => handleSelectChange(i, i2, e.target.value)} value={f.productId} className="select w-full">
                                                                              <option value="" disabled>Choose A Product</option>
                                                                              {
                                                                                    v.products!.map((p, i) =>
                                                                                          <option value={p._id} key={i}>{p.name}</option>
                                                                                    )
                                                                              }
                                                                        </select>
                                                                  </div>
                                                            </div>
                                                      )
                                                }
                                          </div>
                                    )
                              }

                        </div>

                  }


                  {showPrice && <div className='text-center text-2xl mt-[40px]'>{CURRENCY_SYMBOL}{productObj.price}</div>}

                  <div className="mt-[40px]">
                        <AddToCartBtn disabled={showPrice ? false : true}
                              productObj={productObj} cheekyVariation={variations!} />
                  </div>

            </div >


      )
}

export default CheekyProductVariation


