'use client'

import AdminSidebar from "@/app/components/server/partials/AdminSidebar";
import useAdminSessionStore from "@/app/hooks/auth/admin";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function AuthenticatedUserLayout({ children }: { children: React.ReactNode }) {

      const { admin, loading } = useAdminSessionStore();

      useEffect(() => {

            if (!loading && !admin) redirect('/account/login');

      }, [admin, loading]);

      return (
            <>
                  <div className="w-full flex">
                        <div className="hidden sm:block w-[20%]">
                              <AdminSidebar />
                        </div>
                        <div className="w-[100%] sm:w-[80%]">
                              {children}
                        </div>
                  </div>

            </>
      );
}

