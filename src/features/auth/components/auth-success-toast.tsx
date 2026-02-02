"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

export function AuthSuccessToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const authSuccess = searchParams.get("auth_success");

    if (authSuccess === "1") {
      // Show welcome toast
      toast.success("Welcome back!", {
        description: "You have successfully signed in.",
        icon: <Sparkles className="h-4 w-4" />,
        position: "top-center",
      });

      // Remove the query parameter from URL without reload
      const params = new URLSearchParams(searchParams.toString());
      params.delete("auth_success");
      const newUrl = params.toString() ? `${pathname}?${params}` : pathname;
      router.replace(newUrl, { scroll: false });
    }
  }, [searchParams, router, pathname]);

  return null;
}
