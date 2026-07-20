import { handleOnrampWebhook } from "@/controllers/Transaction";
import { NextRequest } from "next/server";

interface Props {
      params: Promise<{ invoiceId: string }>;
}

export async function GET(req: NextRequest, { params }: Props) {
      const { invoiceId } = await params;
      return handleOnrampWebhook(req, invoiceId);
}
