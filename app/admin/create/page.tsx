import type { Metadata } from "next";
import AuthShell from "@/components/admin/AuthShell";
import AdminForm from "@/components/admin/AdminForm";
import { ToastProvider } from "@/components/admin/Toaster";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getI18n()).dict.admin.titles.setup };
}

export default async function SetupPage() {
  const { dict } = await getI18n();
  return (
    <AuthShell title={dict.admin.setup.title} subtitle={dict.admin.setup.subtitle}>
      <ToastProvider>
        <AdminForm mode="setup" />
      </ToastProvider>
    </AuthShell>
  );
}
