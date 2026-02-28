"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpgrade = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await api.post("/billing/checkout", { planId: "pro" });
      const url = res.data?.url as string | undefined;
      if (!url) throw new Error("No checkout URL returned");
      window.location.href = url;
    } catch {
      setError("Failed to start checkout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-8 space-y-6">
      <h1 className="text-3xl font-bold">Pricing</h1>
      <p className="text-zinc-600">
        Choose the plan that fits your outreach volume.
      </p>

      <div className="border p-6 rounded space-y-4">
        <h2 className="text-xl font-semibold">Pro</h2>
        <p>$49/mo, unlimited campaigns, priority scoring.</p>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          className="bg-black text-white px-4 py-2"
          onClick={handleUpgrade}
          disabled={isLoading}
        >
          {isLoading ? "Upgrading..." : "Upgrade Plan"}
        </button>
      </div>
    </div>
  );
}
