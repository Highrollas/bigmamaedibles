;

import { deletePost, fetchPosts, updatePost, uploadPost } from "@/controllers/Post";
import { NextRequest } from "next/server";


export async function GET(req: NextRequest) {
      return await fetchPosts(req, "post");
}

export async function POST(req: NextRequest) {
      return await uploadPost(req, "post");
}

export async function PUT(req: NextRequest) {
      return await updatePost(req);
}

export async function DELETE(req: NextRequest) {
      return await deletePost(req);
}

