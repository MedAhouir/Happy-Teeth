import type { Metadata } from "next";
import Overview from "@/components/admin/Overview";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getI18n()).dict.admin.titles.overview };
}
export default function Page() {
  return <Overview />;
}
