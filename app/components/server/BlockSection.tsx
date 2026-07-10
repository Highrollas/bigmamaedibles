import FallbackImage from '../client/FallbackImage'
import React, { ReactNode } from 'react'

export interface BlockSectionProps {
      children: ReactNode,
      imageUrl: string;
      title: string
}


const BlockSection = ({ children, imageUrl, title }: BlockSectionProps) => {
      return (
            <div className="my-5">
                  <div className='bg-[#e21893] flex flex-wrap border-[3.5px] rounded-md border-[#e21893]'>
                        <div className="w-[100%] sm:w-[50%]">
                              <FallbackImage height={1000} width={1000} className='w-[101%]' src={imageUrl} alt={title} />
                        </div>
                        <div className="w-[100%] sm:w-[50%] flex justify-center flex-col text-center px-5 sm:px-12 text-[16px]! bg-white">
                              {children}
                        </div>
                  </div >
            </div>
      )
}

export default BlockSection


