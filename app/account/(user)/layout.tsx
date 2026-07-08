'use client'

import useSessionStore from "@/app/hooks/auth/user";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function AuthenticatedUserLayout({ children }: { children: React.ReactNode }) {

      const { user, loading } = useSessionStore();

      useEffect(() => {

            if (!loading && !user) redirect('/account/login');

      }, [user, loading])

      return (
            <>
                  <div className="w-full sm:w-[85%] lg:w-[55%] mx-auto">
                        {children}
                  </div>

            </>
      );
}
