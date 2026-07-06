;

import { deleteProduct, fetchProducts, updateProduct, uploadProduct } from "@/controllers/Product";
import { NextRequest } from "next/server";


export async function GET(req: NextRequest) {
      return await fetchProducts(req);
}

export async function POST(req: NextRequest) {
      return await uploadProduct(req);
}

export async function PUT(req: NextRequest) {
      return await updateProduct(req);
}

export async function DELETE(req: NextRequest) {
      return await deleteProduct(req);
}

