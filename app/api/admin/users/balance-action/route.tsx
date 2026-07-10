
import { setUserBalance } from "@/controllers/User";
import { NextRequest } from "next/server";


export async function PUT(req: NextRequest) {
      return await setUserBalance(req);
}




