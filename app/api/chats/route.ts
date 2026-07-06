
import { fetchChats, sendMessage } from "@/controllers/Chat";
import { NextRequest } from "next/server";

export async function GET() {
      return await fetchChats();
}

export async function POST(req: NextRequest) {
      return await sendMessage(req);
}


