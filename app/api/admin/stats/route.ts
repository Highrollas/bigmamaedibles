import { getAdminDashboardStats } from "@/controllers/Stats";
import { NextRequest } from "next/server";



export async function GET(req: NextRequest) {
      return await getAdminDashboardStats(req);
}
