"use client";

import { Database } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { seedSampleInventory } from "@/firebase/inventory";
import { generateSampleItemsWithDates } from "@/lib/sample-items";

type Props = { userId: string };

export function SeedSampleButton({ userId }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleSeed() {
    if (!confirm("Add 30 random sample items to your inventory?")) return;
    setLoading(true);
    try {
      const items = generateSampleItemsWithDates(30);
      const count = await seedSampleInventory(userId, items);
      toast.success(`Added ${count} sample items!`);
    } catch {
      toast.error("Failed to seed items. Check Firestore rules and auth.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="ghost" onClick={handleSeed} loading={loading} className="gap-2">
      <Database className="h-4 w-4" />
      Add 30 sample items
    </Button>
  );
}
