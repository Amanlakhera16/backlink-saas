"use client";

import { useState } from "react";
import { api } from "../../lib/api";

export default function CampaignPage() {
  const [form, setForm] = useState({
    websiteUrl: "",
    niche: "",
    region: "",
    backlinkType: "",
    authorityThreshold: 30,
    maxOutreach: 5
  });

  const handleCreate = async () => {
    await api.post("/campaigns", form);
    alert("Campaign Created");
  };

  return (
    <div className="p-8 space-y-2">
      <h1 className="text-xl font-bold">Create Campaign</h1>

      {Object.keys(form).map((key) => (
        <input
          key={key}
          className="border p-2 w-full"
          placeholder={key}
          onChange={(e) =>
            setForm({ ...form, [key]: e.target.value })
          }
        />
      ))}

      <button
        className="bg-black text-white px-4 py-2"
        onClick={handleCreate}
      >
        Create
      </button>
    </div>
  );
}