import type { Metadata } from "next";
import AppointmentsView from "@/components/admin/AppointmentsView";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getI18n()).dict.admin.titles.appointments };
}
export default function Page() {
  return <AppointmentsView />;
}
