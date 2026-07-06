import { ProductObj } from "@/Interface";
import Product from "@/models/Products";

export const fetchProductsByCategory = async (category: string, limit = 12): Promise<ProductObj[]> => {

      return await Product.find({
            status: "published",
            categories: { $in: [category] },
            stockQty: { $gt: 0 }
      })
            .select('name price slug images productType variations')
            .sort({ createdAt: -1 })
            .lean<ProductObj[]>()
            .limit(limit);
}

export const fetchNewStock = async (): Promise<ProductObj[]> => {

      const categoryLimits: Record<string, number> = {
            "Exotic Grow": 2,
            "UK Grow": 3,
            "Hash": 2,
            "Pre Rolls": 2,
            "Pod": 2,
            "Kief": 1,
            "Battery": 1,
            "Edibles": 1,
            "Shake": 1
      };

      const results: ProductObj[] = [];

      for (const [category, limit] of Object.entries(categoryLimits)) {
            const products = await Product.find({
                  status: "published",
                  categories: { $in: [category], $nin: ["Bundles", "Cheeky Deals"] }, // exclude unwanted categories
                  stockQty: { $gt: 0 }
            })
                  .select("name price slug images productType variations stockQty")
                  .sort({ stockQty: -1 })
                  .limit(limit)
                  .lean<ProductObj[]>();

            if (products.length > 0) {
                  results.push(...products);
            }
      }

      return results;
};
