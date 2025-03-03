"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { TableDemo } from "./TableDemo";
import { useRouter } from "next/navigation";
import { FaTooth } from "react-icons/fa6";

export function SidebarDemo() {
  const router = useRouter();
  const links = [
    // ... other links remain unchanged
    {//-
      label: "Dashboard",//-
      href: "#",//-
      icon: (//-
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />//-
      ),//-
    },//-
    {//-
      label: "Profile",//-
      href: "#",//-
      icon: (//-
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />//-
      ),//-
    },
  ];
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/admin");
  };
  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 max-w-7xl mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-[60vh]" // for your use case, use `h-screen` instead of `h-[60vh]`
      )}
    >
      <Sidebar open={open} setOpen={setOpen} animate={false}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <>
              <Logo />
            </>
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div onClick={handleLogout} className="flex gap-2 items-center hover:gap-5 text-red-700 font-bold transition-all duration-500 cursor-pointer rounded-full ">
            <IconArrowLeft className="dark:text-neutral-200 h-5 w-5 flex-shrink-0" /> Sign Out
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard />
    </div>
  );
}
export const Logo = () => {
  return (
    <Link href="/" className="font-bold text-2xl flex font-mulish"><FaTooth className="text-green-500"/>Happy</Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-green-500 dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};

// Dummy dashboard component with content
const Dashboard = () => {
  return (
    <TableDemo />
  );
};
