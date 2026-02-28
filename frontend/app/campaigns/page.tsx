"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function CampaignPage() {
  const [form, setForm] = useState({
    websiteUrl: "",
    niche: "",
    region: "",
    backlinkType: "",
    authorityThreshold: 30,
    maxOutreach: 5,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await api.post("/campaigns", form);
      alert("Campaign Created");
    } catch {
      setError("Failed to create campaign.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-2">
      <h1 className="text-xl font-bold">Create Campaign</h1>

      {(
        [
          { key: "websiteUrl", type: "text" },
          { key: "niche", type: "text" },
          { key: "region", type: "text" },
          { key: "backlinkType", type: "text" },
          { key: "authorityThreshold", type: "number" },
          { key: "maxOutreach", type: "number" },
        ] as const
      ).map(({ key, type }) => (
        <input
          key={key}
          className="border p-2 w-full"
          type={type}
          placeholder={key}
          value={String(form[key])}
          onChange={(e) =>
            setForm({
              ...form,
              [key]:
                key === "authorityThreshold" || key === "maxOutreach"
                  ? Number(e.target.value)
                  : e.target.value,
            })
          }
        />
      ))}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        className="bg-black text-white px-4 py-2"
        onClick={handleCreate}
        disabled={isLoading}
      >
        {isLoading ? "Creating..." : "Create"}
      </button>
    </div>
  );
}
