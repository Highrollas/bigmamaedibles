
import { ProductObj } from '@/Interface';
import FallbackImage from '../client/FallbackImage';
import Link from 'next/link';
import { CURRENCY_SYMBOL } from '@/constants';
import AutoScroller from '../client/AutoScroller';
import OutOfStock from './OutOfStock';

interface ProductListProps {
      products: ProductObj[];
}

const ProductListSlider = ({ products }: ProductListProps) => {

      // eslint-disable-next-line react-hooks/purity
      const scrollClass = "auto-scroll-" + Math.floor(Math.random() * 10000) + 1;

      return (

            <>
                  <AutoScroller scrollClass={scrollClass} />

                  <div
                        style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}
                        className={"flex flex-nowrap items-start whitespace-nowrap text-[90%] mb-[15px] pb-2 overflow-x-scroll " + scrollClass}>

                        {[...products, ...products, ...products, ...products].map((product, index) => (
                              <Link prefetch title={product.name} className="product-card px-2 relative" key={index} href={"/product/" + product.slug}>
                                    <FallbackImage
                                          width={392}
                                          height={523}
                                          className="mx-auto max-h-[240px] sm:max-h-[303px] object-contain object-center rounded-[0.375rem]"
                                          src={product.images[0]}
                                          alt={product.name}
                                    />
                                    <div className="w-full text-center mt-2 font-bold! text-[#e21893]">
                                          <p className="sm:text-2xl " style={{ fontSize: '0.88em' }}>{product.name}</p>
                                          {
                                                product.productType == 'Bundles'
                                                      ? <p>{CURRENCY_SYMBOL}{product.variations![0].price} - {CURRENCY_SYMBOL}{product.variations![product.variations!.length - 1].price}</p>
                                                      : <p>{CURRENCY_SYMBOL}{product.price}</p>
                                          }
                                    </div>
                                    {product.stockQty < 1 &&
                                          <OutOfStock />
                                    }
                              </Link>
                        ))}

                  </div>
            </>

      );

};

export default ProductListSlider;


