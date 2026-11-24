import type { Metadata } from "next";
import AdminForm from "@/components/admin/AdminForm";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getI18n()).dict.admin.titles.team };
}

export default async function Page() {
  const { dict } = await getI18n();
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-spruce sm:text-4xl">{dict.admin.team.title}</h1>
      <p className="mt-2 max-w-xl text-spruce/70">{dict.admin.team.intro}</p>
      <div className="mt-8 max-w-md rounded-3xl bg-white p-6 shadow-soft sm:p-8">
        <AdminForm mode="team" />
      </div>
    </div>
  );
}
