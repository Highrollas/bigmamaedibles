import { ProductObj } from "@/Interface";
import APIClient from "./apiClient";

const productsService = new APIClient<ProductObj>('/products');

export default productsService;
