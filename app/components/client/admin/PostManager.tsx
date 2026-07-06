import { BlogObj, PostObj, contentStatus } from '@/Interface'
import TextEditor from './TextEditor';
import { generatePostKeywords, htmlToText } from '@/app/Helper';

interface Props {
      postObj: PostObj | BlogObj,
      setPostObj: (updater: (post: PostObj | BlogObj) => void) => void;
      type: "Post" | "Blog";
}

const PostManager = ({ postObj, setPostObj, type }: Props) => {

      return (
            <div className='p-5'>

                  <div className='flex flex-wrap gap-3 justify-start'>

                        <div className='w-[30%] mt-4'>
                              <label htmlFor="">{type} Title</label>
                              <input placeholder='Title' type="text" className='input w-full'
                                    value={postObj.title}
                                    onChange={(e) => {
                                          setPostObj(d => { d.title = e.target.value });
                                          setPostObj(d => { d.slug = e.target.value.trim().toLowerCase().split(" ").join("-") });
                                          setPostObj(d => { d.metadata!.title = e.target.value });
                                          setPostObj(d => { d.metadata!.keywords = generatePostKeywords(e.target.value) });
                                    }} />
                        </div>

                        <div className='w-[30%] mt-4'>
                              <label htmlFor="">Status</label>
                              <select className="select w-full"
                                    value={postObj.status}
                                    onChange={(e) => setPostObj(d => { d.status = (e.target.value as contentStatus) })}>
                                    <option>published</option>
                                    <option>draft</option>
                              </select>
                        </div>

                        <div className='w-[30%] mt-4'>
                              <label htmlFor="">Slug</label>
                              <input placeholder='Slug' type="text" className='input w-full'
                                    value={postObj.slug}
                                    onChange={(e) => setPostObj(d => { d.slug = e.target.value })} />
                        </div>

                        <div className="w-full mt-4">

                              <div className="flex items-end w-full">
                                    <div className='w-[50%]'>
                                          <label htmlFor="">{type} Description</label>
                                    </div>
                              </div>

                              <TextEditor
                                    value={postObj.content!}
                                    onChange={(val) => {
                                          setPostObj(d => { d.content = val })
                                          setPostObj(d => { d.metadata!.description = htmlToText(val).substring(0, 50) + '...' })
                                    }}
                              />

                        </div>

                        <div className='w-[30%] mt-4'>
                              <label htmlFor="">Page Title (Google, Twiiter)</label>
                              <input placeholder='Google Title' type="text" className='input w-full'
                                    value={postObj.metadata?.title}
                                    onChange={(e) => setPostObj(d => { d.metadata!.title = e.target.value })} />
                        </div>

                        <div className='w-[30%] mt-4'>
                              <label htmlFor="">Page Description</label>
                              <input placeholder='Page Description' type="text" className='input w-full'
                                    value={postObj.metadata?.description}
                                    onChange={(e) => setPostObj(d => { d.metadata!.description = e.target.value })} />
                        </div>

                        <div className='w-[30%] mt-4'>
                              <label htmlFor="">Keywords</label>
                              <input placeholder='Keywords' type="text" className='input w-full'
                                    value={postObj.metadata?.keywords}
                                    onChange={(e) => setPostObj(d => { d.metadata!.keywords = e.target.value })} />
                        </div>

                        <div className='w-[30%] mt-4'>
                              <label htmlFor="">Cover Image</label>
                              <input placeholder='Cover Image Url' type="text" className='input w-full'
                                    value={postObj.coverImage}
                                    onChange={(e) => setPostObj(d => { d.coverImage = e.target.value })} />
                        </div>

                        <div className='w-[30%] mt-4'>
                              <label htmlFor="">Views Count</label>
                              <input placeholder='Views' type="text" className='input w-full'
                                    value={postObj.viewsCount}
                                    onChange={(e) => setPostObj(d => { d.viewsCount = Number(e.target.value) })} />
                        </div>


                  </div>

            </div>
      )
}

export default PostManager

