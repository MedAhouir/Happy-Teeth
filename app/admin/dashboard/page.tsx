"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.push("/admin");
    }
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome to Admin Dashboard</h1>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          router.push("/admin");
        }}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default Home;
