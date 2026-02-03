import LoginForm from "@/components/auth/login-form";
import { getDictionary } from "@/features/i18n/get-dictionary";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return <LoginForm locale={locale} dict={dict} />;
}
