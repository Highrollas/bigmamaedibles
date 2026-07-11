import useOrdersStore from '@/app/hooks/store/order'
import React from 'react'

const OnHoldOrderCount = () => {

      const { orders } = useOrdersStore();
      const onHoldOrders = orders.filter(o => o.status == "on-hold");

      return <span className="badge badge-sm bg-[#e21893] text-white indicator-item p-1.5!">{onHoldOrders.length}</span>

}

export default OnHoldOrderCount


