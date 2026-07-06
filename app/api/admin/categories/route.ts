;

import { deleteCategory, fetchCategories, updateCategory, uploadCategory } from "@/controllers/Category";
import { NextRequest } from "next/server";


export async function GET() {
      return await fetchCategories();
}

export async function POST(req: NextRequest) {
      return await uploadCategory(req);
}

export async function PUT(req: NextRequest) {
      return await updateCategory(req);
}

export async function DELETE(req: NextRequest) {
      return await deleteCategory(req);
}
