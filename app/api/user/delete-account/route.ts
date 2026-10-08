import { deleteOwnAccount } from '@/controllers/User';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
      return deleteOwnAccount(request);
}
