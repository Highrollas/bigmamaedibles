'use client'
import { generateCategoryKeywords, htmlToText } from '@/app/Helper';
import { CategoryObj } from '@/Interface';
import React from 'react'
import TextEditor from './TextEditor';

interface Props {
      categoryObj: CategoryObj,
      setCategoryObj: (updater: (category: CategoryObj) => void) => void;
}

const CategoryManager = ({ categoryObj, setCategoryObj }: Props) => {

      return (
            <div className='p-5'>
                  <div className='flex flex-wrap gap-3 justify-start'>
                        <div className='w-[30%] mt-4'>
                              <label htmlFor="">Category Name</label>
                              <input placeholder='Category Name' type="text" className='input w-full'
                                    value={categoryObj.name}
                                    onChange={(e) => {
                                          setCategoryObj(d => { d.name = e.target.value });
                                          setCategoryObj(d => { d.slug = e.target.value.trim().toLowerCase().split(" ").join("-") });
                                          setCategoryObj(d => { d.metadata!.title = e.target.value });
                                          setCategoryObj(d => { d.metadata!.keywords = generateCategoryKeywords(e.target.value) });
                                    }} />
                        </div>
                        <div className='w-[30%] mt-4'>
                              <label htmlFor="">Slug</label>
                              <input type='text' className='input w-full'
                                    value={categoryObj.slug}
                                    onChange={(e) => setCategoryObj(d => { d.slug = e.target.value })} />
                        </div>

                        <div className='w-[30%] mt-4'>
                              <label htmlFor="">Views</label>
                              <input placeholder='views' type="number" className='input w-full'
                                    value={categoryObj.views ?? 0}
                                    onChange={(e) => setCategoryObj(d => { d.views = parseInt(e.target.value) })} />
                        </div>


                        <div className='w-full mt-4'>

                              <label htmlFor="">Category Description</label>
                              <TextEditor
                                    value={categoryObj.description ?? ""}
                                    onChange={(val) => {
                                          setCategoryObj(d => { d.description = val })
                                          setCategoryObj(d => { d.metadata.description = htmlToText(val) })
                                    }}
                              />

                        </div>


                        <div className='w-[30%] mt-4'>
                              <label htmlFor="">Page Title (Google, Twiiter)</label>
                              <input placeholder='Google Title' type="text" className='input w-full'
                                    value={categoryObj.metadata?.title ?? ""}
                                    onChange={(e) => setCategoryObj(d => { d.metadata!.title = e.target.value })} />
                        </div>

                        <div className='w-[30%] mt-4'>
                              <label htmlFor="">Page Description</label>
                              <input placeholder='Page Description' type="text" className='input w-full'
                                    value={categoryObj.metadata?.description ?? ""}
                                    onChange={(e) => setCategoryObj(d => { d.metadata!.description = e.target.value })} />
                        </div>

                        <div className='w-[30%] mt-4'>
                              <label htmlFor="">Keywords</label>
                              <input placeholder='Keywords' type="text" className='input w-full'
                                    value={categoryObj.metadata?.keywords ?? ""}
                                    onChange={(e) => setCategoryObj(d => { d.metadata!.keywords = e.target.value })} />
                        </div>

                  </div>
            </div>
      )
}

export default CategoryManager

