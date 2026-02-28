"use client";

import { useParams } from "next/navigation";
import { api } from "@/lib/api";

export default function CampaignDetail() {
  const { id } = useParams<{ id: string }>();

  const run = async (action: string) => {
    if (!id) return;
    try {
      await api.post(`/campaigns/${id}/${action}`);
      alert(`${action} completed`);
    } catch {
      alert(`${action} failed`);
    }
  };

  if (!id) return <div>Invalid campaign id.</div>;

  const baseURL = api.defaults.baseURL ?? "";

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-xl font-bold">Campaign Actions</h1>

      <button onClick={() => run("discover")} className="border p-2">
        Discover Prospects
      </button>

      <button onClick={() => run("score")} className="border p-2">
        Score Prospects
      </button>

      <button onClick={() => run("generate-outreach")} className="border p-2">
        Generate Outreach
      </button>

      <button
        onClick={() =>
          window.open(
            `${baseURL}/campaigns/${id}/export-report`
          )
        }
        className="border p-2"
      >
        Export Report
      </button>
    </div>
  );
}
