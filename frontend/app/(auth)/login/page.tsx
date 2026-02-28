"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.data?.accessToken) {
        document.cookie = `accessToken=${res.data.accessToken}; Path=/; SameSite=Lax`;
      }
      router.push("/dashboard");
    } catch {
      setError("Login failed. Check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="p-6 border rounded w-96">
        <h1 className="text-xl font-bold mb-4">Login</h1>
        <input
          className="border p-2 w-full mb-2"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border p-2 w-full mb-4"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          className="bg-black text-white w-full py-2"
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Login"}
        </button>
      </div>
    </div>
  );
}
