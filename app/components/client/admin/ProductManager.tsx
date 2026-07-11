import useCategoriesStore from '@/app/hooks/store/category';
import { CURRENCY_SYMBOL, DESC_TEMPLATES, productTypes } from '@/constants'
import { ProductObj, contentStatus, ProductType } from '@/Interface'
import AddVariation from '../AddVariation';
import { ChevronDown, Trash2 } from 'lucide-react';
import TextEditor from './TextEditor';
import ProductImages from './ProductImages';
import { generateKeywords, htmlToText } from '@/app/Helper';


interface Props {
      productObj: ProductObj,
      setProductObj: (updater: (product: ProductObj) => void) => void;
}

const ProductManager = ({ productObj, setProductObj }: Props) => {

      const productCategories = useCategoriesStore(c => c.categories);


      const handleDeleteVariation = (indexToDelete: number) => {
            setProductObj((d) => {
                  d.variations = d.variations?.filter((_, i) => i !== indexToDelete);
            });
      };

      const getSlug = (name = productObj.name, categories = productObj.categories) => {

            return (categories!.length > 0 ? categories![0]?.trim().toLowerCase().split(" ").join("-") + "/" : "")
                  + name.trim().toLowerCase().split(" ").join("-");
      }

      return (
            <div className='p-5'>

                  <div className='flex flex-wrap gap-3 justify-start'>
                        <div className='w-[48%] sm:w-[30%] mt-4'>
                              <label htmlFor="">Product Name</label>
                              <input placeholder='Product Name' type="text" className='input w-full'
                                    value={productObj.name}
                                    onChange={(e) => {
                                          setProductObj(d => { d.name = e.target.value });
                                          setProductObj(d => { d.slug = getSlug(e.target.value) });
                                          setProductObj(d => { d.metadata!.title = e.target.value });
                                          setProductObj(d => { d.metadata!.keywords = generateKeywords(e.target.value) });
                                    }} />
                        </div>
                        <div className='w-[48%] sm:w-[30%] mt-4'>
                              <label htmlFor="">Product Price</label>
                              <input placeholder={CURRENCY_SYMBOL + '10'} type="text" className='input w-full'
                                    value={productObj.price}
                                    onChange={(e) => setProductObj(d => {
                                          d.price = e.target.value == "" ? e.target.value as unknown as number : parseFloat(e.target.value)
                                    })} />
                        </div>
                        <div className='w-[48%] sm:w-[30%] mt-4'>
                              <label htmlFor="">Product Type</label>
                              <select className="select w-full"
                                    value={productObj.productType}
                                    onChange={(e) => setProductObj(d => { d.productType = (e.target.value as ProductType) })}>
                                    {productTypes.map(p => <option key={p}>{p}</option>)}
                              </select>
                        </div>

                        <div className='w-[48%] sm:w-[30%] mt-4'>
                              <label htmlFor="">Slug (product url)</label>
                              <input placeholder='slug' type="text" className='input w-full'
                                    value={productObj.slug}
                                    onChange={(e) => setProductObj(d => { d.slug = e.target.value })} />
                        </div>

                        <div className="w-[48%] sm:w-[30%] mt-4">
                              <label className="">Categories</label>
                              <div className="dropdown w-full">

                                    <label tabIndex={0} className="input text-black w-full overflow-x-scroll">
                                          {productObj.categories!.length > 0
                                                ? productObj.categories?.map(c => <span key={c}>{c},</span>)
                                                : 'Select categories'}
                                          <ChevronDown className='w-4 h-4 ml-2 absolute right-2' />
                                    </label>

                                    <ul
                                          tabIndex={0}
                                          className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-[100%] max-h-70 overflow-y-auto"
                                    >
                                          {productCategories.map((c) => (
                                                <li key={c._id}>
                                                      <label className="flex items-center gap-2">
                                                            <input
                                                                  type="checkbox"
                                                                  className="checkbox checkbox-sm"
                                                                  checked={productObj.categories?.includes(c.name)}
                                                                  onChange={(e) => {
                                                                        const selected = productObj.categories || [];
                                                                        const updated = e.target.checked
                                                                              ? [...selected, c.name]
                                                                              : selected.filter((id) => id !== c.name);
                                                                        setProductObj(d => { d.categories = updated });
                                                                        setProductObj(d => { d.slug = getSlug(undefined, updated) });
                                                                  }}
                                                            />
                                                            {c.name}
                                                      </label>
                                                </li>
                                          ))}
                                    </ul>
                              </div>
                        </div>

                        <div className='w-[48%] sm:w-[30%] mt-4'>
                              <label htmlFor="">Stock Qty</label>
                              <input placeholder='stock quantity' type="text" className='input w-full'
                                    value={productObj.stockQty}
                                    onChange={(e) => setProductObj(d => {
                                          d.stockQty = e.target.value == "" ? e.target.value as unknown as number : parseFloat(e.target.value)
                                    })} />
                        </div>

                        <div className='w-[48%] sm:w-[30%] mt-4'>
                              <label htmlFor="">Cost Price</label>
                              <input placeholder='Purchase/cost price' type="number" className='input w-full'
                                    value={productObj.costPrice}
                                    onChange={(e) => setProductObj(d => { d.costPrice = e.target.value })} />
                        </div>


                        <div className='w-[48%] sm:w-[30%] mt-4 flex'>
                              <ProductImages setProductObj={setProductObj} productObj={productObj} />
                        </div>

                        {
                              (productObj.productType === "Bundles" || productObj.productType === "CheekyDeals") &&

                              <div className="w-full mt-6 flex flex-col md:flex-row gap-6">

                                    <div className="w-[100%]">
                                          <AddVariation categories={productCategories} setProductObj={setProductObj} />
                                    </div>

                                    <div className="w-full flex flex-wrap gap-4 overflow-auto">
                                          {productObj.variations?.map((variation, i) => (
                                                <div
                                                      key={i}
                                                      className="border border-gray-200 shadow-sm rounded-md p-4 w-[30%] sm:w-[20%] relative bg-white hover:shadow-md transition-all"
                                                >
                                                      {/* Delete Button */}
                                                      <div
                                                            className="absolute top-0 right-0 p-2 bg-[#e21893] text-white rounded cursor-pointer"
                                                            onClick={() => handleDeleteVariation(i)}
                                                            title="Delete"
                                                      >
                                                            <Trash2 size={16} />
                                                      </div>

                                                      {/* Variation Info */}
                                                      <div className="text-center">
                                                            <div className="font-semibold text-sm">{variation.label}</div>
                                                            <div className="text-xs text-gray-500 mt-2">{variation.category}</div>
                                                            <div className="text-sm font-medium mt-2">{CURRENCY_SYMBOL}{variation.price}</div>
                                                      </div>

                                                      {/* Select Fields */}
                                                      <ul className="mt-3 space-y-1 text-xs text-center">
                                                            {variation.selectFields.map((_, idx) => (
                                                                  <li key={idx}>
                                                                        {variation.category} {idx + 1}
                                                                  </li>
                                                            ))}
                                                      </ul>
                                                </div>
                                          ))}
                                    </div>

                              </div>

                        }





                        <div className="w-full mt-4">

                              <div className="flex items-end w-full">
                                    <div className='w-[50%]'>
                                          <label htmlFor="">Product Description</label>
                                    </div>
                                    <div className='w-[50%] flex justify-end'>
                                          <select className='select'
                                                defaultValue={''}
                                                onChange={(e) => setProductObj(d => { d.description = DESC_TEMPLATES.find(t => t.name == e.target.value)?.content })}>
                                                <option value={''} disabled>Select Template</option>
                                                {DESC_TEMPLATES.map((t) => <option key={t.name}>{t.name}</option>)}
                                          </select>
                                    </div>
                              </div>

                              <TextEditor
                                    value={productObj.description!}
                                    onChange={(val) => {
                                          setProductObj(d => { d.description = val })
                                          setProductObj(d => { d.metadata!.description = htmlToText(val) })
                                    }}
                              />

                        </div>

                        <div className='w-full mt-4'>
                              <hr className='opacity-10' />
                        </div>


                        <div className='w-full mt-4'>

                              <label htmlFor="">Product Short Description</label>
                              <TextEditor
                                    value={productObj.shortDescription!}
                                    onChange={(val) => setProductObj(d => { d.shortDescription = val })}
                              />

                        </div>



                        <div className='w-[48%] sm:w-[30%] mt-4'>
                              <label htmlFor="">Page Title (Google, Twiiter)</label>
                              <input placeholder='Google Title' type="text" className='input w-full'
                                    value={productObj.metadata?.title}
                                    onChange={(e) => setProductObj(d => { d.metadata!.title = e.target.value })} />
                        </div>

                        <div className='w-[48%] sm:w-[30%] mt-4'>
                              <label htmlFor="">Page Description</label>
                              <input placeholder='Page Description' type="text" className='input w-full'
                                    value={productObj.metadata?.description}
                                    onChange={(e) => setProductObj(d => { d.metadata!.description = e.target.value })} />
                        </div>

                        <div className='w-[48%] sm:w-[30%] mt-4'>
                              <label htmlFor="">Keywords</label>
                              <input placeholder='Keywords' type="text" className='input w-full'
                                    value={productObj.metadata?.keywords}
                                    onChange={(e) => setProductObj(d => { d.metadata!.keywords = e.target.value })} />
                        </div>

                        <div className='w-[48%] sm:w-[30%] mt-4'>
                              <label htmlFor="">Views Count</label>
                              <input placeholder='Views' type="text" className='input w-full'
                                    value={productObj.viewsCount}
                                    onChange={(e) => setProductObj(d => { d.viewsCount = Number(e.target.value) })} />
                        </div>

                        <div className='w-[48%] sm:w-[30%] mt-4'>
                              <label htmlFor="">Status</label>
                              <select className="select w-full"
                                    value={productObj.status}
                                    onChange={(e) => setProductObj(d => { d.status = (e.target.value as contentStatus) })}>
                                    <option>published</option>
                                    <option>draft</option>
                              </select>
                        </div>

                  </div>

            </div>
      )
}

export default ProductManager


