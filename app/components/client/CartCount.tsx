'use client'

import useCartStore from '@/app/hooks/store/cart'
import React, { useEffect, useState } from 'react'

const CartCount = () => {
      const [mounted, setMounted] = useState(false);
      const cartItemCount = useCartStore(c => c.cartItemCount());

      useEffect(() => {
            setMounted(true);
      }, []);

      if (!mounted || cartItemCount === 0) return null;

      return (
            <div className='bg-[#e21893] text-white absolute right-[-13px] top-[-13px] h-4.5 w-4.5 rounded-[100%] flex items-center justify-center text-[70%]'>
                  {cartItemCount}
            </div>
      );
}

export default CartCount;

