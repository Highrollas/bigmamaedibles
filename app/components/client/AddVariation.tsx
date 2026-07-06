'use client';

import React, { useState } from 'react';
import { CategoryObj, ProductObj } from '@/Interface';
import { VARIATION_FILTERED_CATEGORIES } from '@/constants';

interface Props {
      setProductObj: (updater: (prev: ProductObj) => void) => void;
      categories: CategoryObj[]
}

const AddVariation = ({ setProductObj, categories: _categories }: Props) => {

      const categories = _categories.filter(c => !VARIATION_FILTERED_CATEGORIES.includes(c.name));

      const [label, setLabel] = useState('');
      const [category, setCategory] = useState('');
      const [price, setPrice] = useState<number | ''>('');
      const [selectCount, setSelectCount] = useState<number | ''>('');

      const handleAddVariation = () => {

            if (!label || !category) return;

            const newVariation = {
                  label,
                  category,
                  price: Number(price ?? 0),
                  selectFields: Array.from({ length: Number(selectCount ?? 1) }, () => ({
                        value: '',
                        productId: '',
                  })),
            };

            setProductObj((prev) => {
                  prev.variations = [...(prev.variations || []), newVariation];
            });

            // Reset inputs
            // setLabel('');
            // setCategory('');
            // setPrice('');
            // setSelectCount('');
      };

      return (
            <div className="border brand-border p-4 rounded w-full">
                  <h3 className="text-lg font-bold">Variation</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-2">

                        <div>
                              <label htmlFor="">Label</label>
                              <input
                                    type="text"
                                    placeholder="Label"
                                    className="input input-bordered w-full"
                                    value={label}
                                    onChange={(e) => setLabel(e.target.value)}
                              />
                        </div>

                        <div>
                              <label htmlFor="">Category</label>
                              <select
                                    className="select select-bordered w-full"
                                    value={category}
                                    onChange={(e) => {
                                          setCategory(e.target.value);
                                    }}
                              >
                                    <option value="">
                                          Select Category
                                    </option>
                                    {categories?.map((c, i) => (

                                          <option key={i} value={c.name}>
                                                {c.name}
                                          </option>
                                    ))}
                              </select>
                        </div>

                        <div>
                              <label htmlFor="">Price</label>
                              <input
                                    type="text"
                                    placeholder="Price"
                                    className="input input-bordered w-full"
                                    value={price}
                                    onChange={(e) => setPrice(Number(e.target.value))}
                              />
                        </div>

                        <div>
                              <label htmlFor="">Fields</label>
                              <input
                                    type="text"
                                    placeholder="No. of Select Fields"
                                    className="input input-bordered w-full"
                                    value={selectCount}
                                    onChange={(e) => setSelectCount(Number(e.target.value))}
                              />
                        </div>

                  </div>

                  <div className="mt-4">
                        <button
                              className="btn btn-sm"
                              onClick={handleAddVariation}
                        >
                              Add Variation
                        </button>
                  </div>
            </div>
      );
};

export default AddVariation;

