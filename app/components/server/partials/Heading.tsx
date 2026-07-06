import React from 'react'


interface TitleProp {
      children: React.ReactNode;
}

const Heading = ({ children }: TitleProp) => {
      return (
            <div className='my-5 text-center'>
                  <h1 className='text-2xl sm:text-3xl font-bold'>{children}</h1>
            </div>
      )
}

export default Heading

