import React from 'react'

const OutOfStock = () => {

      const emojis = ["😭", "🥹", "😞", "🥹"];

      return (
            <div className="absolute inset-0 flex items-center justify-center">
                  <div className="brand-panel w-[90%] text-white text-center py-2 px-4 mb-[50px] rounded-[10px] font-bold! text-[85%]">
                        Out Of Stock {emojis[Math.floor(Math.random() * emojis.length)]}
                  </div>
            </div>
      )
}

export default OutOfStock

