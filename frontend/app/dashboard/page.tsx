"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";

export default function DashboardPage() {
  const { data } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const res = await api.get("/dashboard/stats");
      return res.data;
    }
  });

  if (!data) return <div>Loading...</div>;

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Analytics Dashboard</h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="border p-4">
          <h2>Total Campaigns</h2>
          <p className="text-2xl">{data.totalCampaigns}</p>
        </div>

        <div className="border p-4">
          <h2>Total Outreach</h2>
          <p className="text-2xl">{data.totalOutreach}</p>
        </div>

        <div className="border p-4">
          <h2>Backlinks Secured</h2>
          <p className="text-2xl">{data.backlinksSecured}</p>
        </div>

        <div className="border p-4">
          <h2>Response Rate</h2>
          <p className="text-2xl">{data.responseRate}%</p>
        </div>
      </div>
    </div>
  );
}