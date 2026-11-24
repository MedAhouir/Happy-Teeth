import type { Metadata } from "next";
import AuthShell from "@/components/admin/AuthShell";
import LoginForm from "@/components/admin/LoginForm";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getI18n()).dict.admin.titles.signIn };
}

export default async function AdminLogin() {
  const { dict } = await getI18n();
  return (
    <AuthShell title={dict.admin.login.title} subtitle={dict.admin.login.subtitle}>
      <LoginForm />
    </AuthShell>
  );
}
