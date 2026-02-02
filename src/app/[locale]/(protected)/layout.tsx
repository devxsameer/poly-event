import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function ProtectedLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const locale = await params;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  return <>{children}</>;
}
