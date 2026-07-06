'use client'

import { ProductObj, VariationObj } from '@/Interface'
import AddToCartBtn from '../client/AddToCartBtn';
import { useImmer } from 'use-immer';
import { useState } from 'react';
import { CURRENCY_SYMBOL } from '@/constants';


interface Props {
      productObj: ProductObj
}

const BundleProductVariation = ({ productObj }: Props) => {

      const [selectedVariation, setSelectedVariation] = useImmer<VariationObj | null>(null);
      const [price, setPrice] = useState<number | null>(null);


      const setVariation = (v: VariationObj) => {
            setSelectedVariation(v);
            updateVariationPrice(v)
      }

      const handleSelectChange = (i: number, pId: string) => {

            setSelectedVariation(d => {
                  d!.selectFields[i].productId = pId;
                  d!.selectFields[i].value = d!.products!.find(p => p._id === pId)?.name || "";

                  updateVariationPrice(d as VariationObj);
            });

      }

      const updateVariationPrice = (v: VariationObj) => {
            const emptyVariationExist = v!.selectFields.some(f => f.value === "");
            setPrice(emptyVariationExist ? null : selectedVariation!.price);
      }

      const getProductUsageMap = () => {
            const usageMap: Record<string, number> = {};

            selectedVariation?.selectFields.forEach(f => {
                  if (f.productId) {
                        usageMap[f.productId] = (usageMap[f.productId] || 0) + 1;
                  }
            });

            return usageMap;
      };


      const variations = productObj.variations || [];

      return (

            <div>

                  <div>
                        {!selectedVariation && <p className='text-center text-red-600'>Please Select One Of The Options Below</p>}

                        <div className='flex flex-wrap my-5 rounded-2xl cursor-pointer'>
                              {
                                    variations.map((v, i) =>
                                          <div key={i} onClick={() => setVariation(v)}
                                                className={selectedVariation?.label === v.label ? 'gramBox active' : 'gramBox'}
                                          >
                                                {v.label}
                                          </div>
                                    )
                              }
                        </div>

                  </div>

                  <div className='mt-[40px]'>
                        {selectedVariation &&
                              selectedVariation.selectFields.map((f, i) => {
                                    const usageMap = getProductUsageMap();

                                    return (
                                          <div key={i} className="flex my-3 items-center">
                                                <div className="w-[25%] text-[80%] font-bold! text-start">
                                                      Option {i + 1}
                                                </div>

                                                <div className="w-[75%]">
                                                      <select
                                                            onChange={(e) => handleSelectChange(i, e.target.value)}
                                                            value={f.productId}
                                                            className="select w-full"
                                                      >
                                                            <option value="" disabled>Choose A Product</option>
                                                            {selectedVariation.products!.map((p, index) => {
                                                                  const timesUsed = usageMap[p._id] || 0;

                                                                  // Always include the currently selected product in the list
                                                                  const isCurrent = f.productId === p._id;

                                                                  if (timesUsed >= p.stockQty && !isCurrent) return null;

                                                                  return (
                                                                        <option value={p._id} key={index}>
                                                                              {p.name}
                                                                        </option>
                                                                  );
                                                            })}
                                                      </select>
                                                </div>
                                          </div>
                                    );
                              })}


                  </div>



                  {price && <div className='text-center text-2xl mt-[40px]'>{CURRENCY_SYMBOL}{price}</div>}

                  <div className="mt-[40px]">
                        <AddToCartBtn disabled={price ? false : true}
                              productObj={productObj} bundleVariation={selectedVariation!} />
                  </div>

            </div >


      )
}

export default BundleProductVariation

