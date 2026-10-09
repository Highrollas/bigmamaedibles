import { getAdminFromSession } from '@/app/Helper/server';
import AdminBalances from '@/app/components/client/admin/AdminBalances';
import { redirect } from 'next/navigation';

export default async function BalancesPage() {
      const admin = await getAdminFromSession();
      if (!admin) redirect('/admin/auth/login');
      if (admin.accessLevel !== 'AA') redirect('/admin/orders');
      return <AdminBalances />;
}
