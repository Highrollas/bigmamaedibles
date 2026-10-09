import { handleOnrampWebhook } from '@/controllers/Transaction';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ invoiceId: string; webhookToken: string }> }) {
      const { invoiceId, webhookToken } = await params;
      return handleOnrampWebhook(request, invoiceId, webhookToken);
}
