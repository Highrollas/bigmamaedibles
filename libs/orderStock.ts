import type { CartItem } from '@/Interface';

export function getStockRequirements(items: CartItem[]) {
      const required = new Map<string, number>();
      const add = (id: string, qty: number) => {
            if (!id || !Number.isSafeInteger(qty) || qty <= 0) throw new Error('Invalid Order Stock Requirement');
            required.set(String(id), (required.get(String(id)) || 0) + qty);
      };
      for (const item of items) {
            if (item.productType === 'Bundles' && item.bundleVariation?.selectFields?.length) {
                  for (const field of item.bundleVariation.selectFields) add(field.productId, item.cartQty);
            } else if (item.productType === 'CheekyDeals' && item.cheekyVariation?.length) {
                  for (const variation of item.cheekyVariation) {
                        for (const field of variation.selectFields) add(field.productId, item.cartQty);
                  }
            } else {
                  add(item.productObj._id, item.cartQty);
            }
      }
      return required;
}
