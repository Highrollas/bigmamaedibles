
import { ProductObj } from '@/Interface';
import FallbackImage from '../client/FallbackImage';
import Link from 'next/link';
import React from 'react';
import { CURRENCY_SYMBOL } from '@/constants';
import OutOfStock from './OutOfStock';
import Products from '@/models/Products';


interface ProductListProps {
      products: ProductObj[];
}


const ProductList = async ({ products }: ProductListProps) => {
      // For bundles, fetch variation products to determine out-of-stock status
      const productsWithBundleStock = await Promise.all(products.map(async (product) => {
            if (product.productType === 'Bundles' && product.variations && product.variations.length > 0) {
                  // For each variation, fetch available products
                  const variationsWithProducts = await Promise.all(product.variations.map(async (variation) => {
                        const availableProducts = await Products.find({
                              $and: [
                                    { categories: variation.category },
                                    { categories: { $nin: ['Bundles', 'Cheeky Deals'] } },
                                    { stockQty: { $gte: 1 } }
                              ]
                        })
                              .select('_id stockQty name')
                              .lean<ProductObj[]>();
                        return { ...variation, products: availableProducts };
                  }));
                  // Mark as out of stock if all variations have no available products
                  const isBundleOutOfStock = variationsWithProducts.every(v => !v.products || v.products.length === 0);
                  return { ...product, _isBundleOutOfStock: isBundleOutOfStock };
            }
            return product;
      }));

      // Sort products: in-stock first, out-of-stock last
      const sortedProducts = [...productsWithBundleStock].sort((a, b) => {
            const aOutOfStock = (a.stockQty < 1) || (a._isBundleOutOfStock || false);
            const bOutOfStock = (b.stockQty < 1) || (b._isBundleOutOfStock || false);
            return aOutOfStock === bOutOfStock ? 0 : aOutOfStock ? 1 : -1;
      });

      return (
            <div>
                  <div className="flex flex-wrap">
                        {sortedProducts.map((product, index) => {
                              const isBundleOutOfStock = product._isBundleOutOfStock || false;
                              const showOutOfStock = (product.stockQty < 1) || isBundleOutOfStock;
                              return (
                                    <Link prefetch title={product.name} className="product-card relative" key={index} href={"/product/" + product.slug}>
                                          <div className='w-[90%] mx-auto'>
                                                <FallbackImage
                                                      width={392}
                                                      height={523}
                                                      className="mx-auto max-h-[240px] sm:max-h-[303px] object-contain object-center rounded-[0.375rem]"
                                                      src={product.images[0]}
                                                      alt={product.name}
                                                />
                                                <div className="w-full text-center mt-2">
                                                      <p className="sm:text-2xl " style={{ fontSize: '0.88em' }}>{product.name}</p>
                                                      {
                                                            product.productType == 'Bundles'
                                                                  ? <p>{CURRENCY_SYMBOL}{product.variations![0].price} - {CURRENCY_SYMBOL}{product.variations![product.variations!.length - 1].price}</p>
                                                                  : <p>{CURRENCY_SYMBOL}{product.price}</p>
                                                      }
                                                </div>
                                          </div>
                                          {showOutOfStock &&
                                                <OutOfStock />
                                          }
                                    </Link>
                              );
                        })}
                  </div>
            </div>
      );
};

export default ProductList;

