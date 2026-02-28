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

  const exportReport = async () => {
    if (!id) return;
    try {
      const res = await api.get(`/campaigns/${id}/export-report`, {
        responseType: "blob"
      });
      const blob = new Blob([res.data], { type: "text/markdown" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `campaign-${id}.md`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Export failed");
    }
  };

  if (!id) return <div>Invalid campaign id.</div>;

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

      <button onClick={exportReport} className="border p-2">
        Export Report
      </button>
    </div>
  );
}
