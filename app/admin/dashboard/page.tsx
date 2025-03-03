"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { TableDemo } from "@/components/TableDemo";
import { SidebarDemo } from "@/components/SidebarDemo";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.push("/admin");
    }
  },);

  return (
    <section className="h-screen flex flex-col ">
      <SidebarDemo />
    </section>
  );
};

export default Home;
