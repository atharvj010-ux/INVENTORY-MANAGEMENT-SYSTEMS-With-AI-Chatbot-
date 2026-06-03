"use client";

import { motion } from "framer-motion";
import { AnalyticsChart, DonutBreakdown } from "@/components/analytics/AnalyticsChart";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { useInventory } from "@/hooks/useInventory";
import {
  calcRevenueSimulation,
  calcStockMovement,
  categoryBreakdown,
} from "@/lib/analytics";
import { formatNumber } from "@/utils/format";

export default function AnalyticsPage() {
  const { user } = useAuthContext();
  const { items, loading } = useInventory(user?.uid);

  const movement = calcStockMovement(items);
  const revenue = calcRevenueSimulation(items);
  const categories = categoryBreakdown(items);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">
          Analytics <span className="text-gradient">Hub</span>
        </h1>
        <p className="mt-1 text-zinc-500">
          Inventory trends, category breakdown, and revenue simulation.
        </p>
      </motion.div>

      {!loading ? (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="glass p-5">
              <p className="text-sm text-zinc-500">Total Units</p>
              <p className="mt-1 text-2xl font-bold">{formatNumber(movement.total)}</p>
            </div>
            <div className="glass p-5">
              <p className="text-sm text-zinc-500">Simulated Revenue</p>
              <p className="mt-1 text-2xl font-bold text-gradient">
                ${formatNumber(revenue.totalRevenue)}
              </p>
            </div>
            <div className="glass p-5">
              <p className="text-sm text-zinc-500">Active SKUs</p>
              <p className="mt-1 text-2xl font-bold">{movement.counts.active}</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <AnalyticsChart
              title="Stock Movement (7d)"
              data={movement.series}
              color="#00F5FF"
            />
            <AnalyticsChart
              title="Revenue Simulation (7d)"
              data={revenue.weekly}
              color="#7C3AED"
            />
          </div>

          <DonutBreakdown
            title="Category Breakdown"
            items={categories.length ? categories : [{ name: "No data", value: 1 }]}
          />
        </>
      ) : (
        <p className="text-zinc-500">Loading analytics...</p>
      )}
    </div>
  );
}
