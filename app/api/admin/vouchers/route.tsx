import { adminFetchVouchers, createVoucher, deleteVoucher, updateVoucher } from '@/controllers/Voucher';
import { NextRequest } from 'next/server';


export async function GET(req: NextRequest) {
      return adminFetchVouchers(req);
}

export async function POST(req: NextRequest) {
      return await createVoucher(req);
}

export async function PUT(req: NextRequest) {
      return await updateVoucher(req);
}

export async function DELETE(req: NextRequest) {
      return await deleteVoucher(req);
}

