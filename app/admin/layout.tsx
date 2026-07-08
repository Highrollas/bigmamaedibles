'use client'

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import useAdminSessionStore from "../hooks/auth/admin";
import useClearAlertsOnRouteChange from "../hooks/custom/useClearAlertsOnRouteChange";
import useCategoriesStore from "../hooks/store/category";
import useProductsStore from "../hooks/store/product";
import AdminSessionProvider from "../providers/AdminSessionProvider";
import useOrdersStore from "../hooks/store/order";
import useCouponsStore from "../hooks/store/voucher";
import useUsersStore from "../hooks/store/user";
import usePostsStore from "../hooks/store/post";
import useStatsStore from "../hooks/store/stats";
import useBlogsStore from "../hooks/store/blog";

export default function AdminLayout({ children }: { children: React.ReactNode }) {


      useClearAlertsOnRouteChange();
      const { admin } = useAdminSessionStore();
      const pathname = usePathname();
      const router = useRouter();

      const adminRoutes = [
            { path: '/admin/dashboard', accessLevels: ['AA', 'A', 'B'] },
            { path: '/admin/dashboard-old', accessLevels: ['AA', 'A', 'B'] },
            { path: '/admin/dashboard2', accessLevels: ['AA', 'A', 'B'] },
            { path: '/admin/products', accessLevels: ['AA', 'A', 'B'] },
            { path: '/admin/categories', accessLevels: ['AA', 'A'] },
            { path: '/admin/orders', accessLevels: ['AA', 'A', 'B', 'D'] },
            { path: '/admin/posts', accessLevels: ['AA', 'A'] },
            { path: '/admin/blogs', accessLevels: ['AA', 'A', 'C'] },
            { path: '/admin/vouchers', accessLevels: ['AA', 'A'] },
            { path: '/admin/users', accessLevels: ['AA', 'A'] },
      ];

      const initProducts = useProductsStore(p => p.init);
      const initCategories = useCategoriesStore(c => c.init);
      const initOrders = useOrdersStore(c => c.init);
      const initVouchers = useCouponsStore(c => c.init);
      const initUsers = useUsersStore(c => c.init);
      const initPosts = usePostsStore(c => c.init);
      const initBlogs = useBlogsStore(c => c.init);
      const initStats = useStatsStore(c => c.init);

      useEffect(() => {

            if (!admin) return;

            // Route access control
            const allowedRoutes = adminRoutes.filter(r => r.accessLevels.includes(admin.accessLevel));
            const allowedPaths = allowedRoutes.map(r => r.path);
            // Only check for /admin/*
            if (pathname.startsWith('/admin')) {
                  // Find the base route (ignore subroutes)
                  const basePath = pathname.split('/').slice(0, 3).join('/');
                  if (!allowedPaths.includes(basePath)) {
                        // Redirect to first allowed route
                        if (allowedPaths.length > 0) {
                              router.replace(allowedPaths[0]);
                        }
                  }
            }

            // Data initialization by access level
            if (admin.accessLevel == "A" || admin.accessLevel == "AA") {
                  initProducts();
                  initCategories();
                  initVouchers();
                  initUsers();
                  initPosts();
                  initStats();
                  initOrders();
                  initBlogs();
            }
            if (admin.accessLevel == "B") {
                  initStats();
                  initOrders();
                  initProducts();
                  initCategories();
            }
            if (admin.accessLevel == "C") {
                  initBlogs();
            }
            if (admin.accessLevel == "D") {
                  initOrders();
            }
      }, [
            admin,
            pathname,
            router,
            initProducts,
            initCategories,
            initOrders,
            initVouchers,
            initUsers,
            initPosts,
            initStats,
            initBlogs
      ]);


      return (
            <>
                  <AdminSessionProvider />
                  <div className="bg-[#e21893] min-h-[100dvh] grid">
                        {children}
                  </div>
            </>
      );
}
