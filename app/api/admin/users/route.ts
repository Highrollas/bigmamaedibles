
import { adminFetchUsers, deleteUser, toggleUserStatus } from "@/controllers/User";
import { NextRequest } from "next/server";


export async function GET(req: NextRequest) {
      return await adminFetchUsers(req);
}

export async function DELETE(req: NextRequest) {
      return await deleteUser(req);
}

export async function PUT(req: NextRequest) {
      return await toggleUserStatus(req);
}


