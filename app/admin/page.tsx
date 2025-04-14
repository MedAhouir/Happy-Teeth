"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Rapper from "@/components/Rapper";
import Image from "next/image";
import Button from "@/components/Button";
import { FaTooth } from "react-icons/fa6";
import Link from "next/link";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Add loading state
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (res.status === 200) {
        localStorage.setItem("token", result.token);
        router.push("/admin/dashboard");
      } else {
        setError(result.message || "Login failed");
      }
    } catch (error) {
      console.log(error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <Rapper>
      <section className="h-screen flex items-center justify-around">
        <div className="flex flex-col items-center py-10 h-full justify-around">
          <Link href="/" className="font-bold text-3xl flex font-mulish">
            <FaTooth className="text-green-500" />Happy
          </Link>
          <form className="bg-white w-[400px] rounded-3xl p-8" onSubmit={handleLogin}>
            <h2 className="text-5xl font-bold font-mulish text-black">Sign In</h2>
            {error && <p className="text-red-500 text-center text-lg mt-3">{error}.</p>}
            <div className="flex flex-col pt-5 gap-5">
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full p-4 border-2 rounded-xl outline-none font-semibold transition ${
                    error ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>

              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full p-4 border-2 rounded-xl outline-none font-semibold transition ${
                    error ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>

              {/* Submit Button */}
              <div className="mt-6">
                <Button
                  isSending={loading}
                  text="Sign In"
                  className={`bg-black text-white w-full py-3 text-lg rounded-xl ${!loading ? "hover:bg-green-500 hover:text-black" : ""} transition`}
                />
              </div>
            </div>
          </form>
        </div>
        <Image src="/login.jpeg" alt="login" width={500} height={1000} />
      </section>
    </Rapper>
  );
};

export default LoginForm;
