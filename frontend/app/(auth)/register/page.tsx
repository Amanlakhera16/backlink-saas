"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    await api.post("/auth/register", { email, password });
    router.push("/login");
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="p-6 border rounded w-96 space-y-3">
        <h1 className="text-xl font-bold">Register</h1>
        <input
          className="border p-2 w-full"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="bg-black text-white w-full py-2"
          onClick={handleRegister}
        >
          Create Account
        </button>
      </div>
    </div>
  );
}