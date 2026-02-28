"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      await api.post("/billing/upgrade");
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
