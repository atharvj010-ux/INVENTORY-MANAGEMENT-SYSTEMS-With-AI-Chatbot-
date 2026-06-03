"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { AddItemModal } from "@/components/dashboard/AddItemModal";
import { InventoryTable } from "@/components/dashboard/InventoryTable";
import { SeedSampleButton } from "@/components/dashboard/SeedSampleButton";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { useInventory } from "@/hooks/useInventory";
import { seedSampleInventory } from "@/firebase/inventory";
import { generateSampleItemsWithDates } from "@/lib/sample-items";
import type { InventoryItem } from "@/types/inventory";

export default function InventoryPage() {
  const { user } = useAuthContext();
  const { items, loading, error } = useInventory(user?.uid);
  const autoSeeded = useRef(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);

  function handleEdit(item: InventoryItem) {
    setEditItem(item);
    setModalOpen(true);
  }

  function handleAdd() {
    setEditItem(null);
    setModalOpen(true);
  }

  function handleClose() {
    setModalOpen(false);
    setEditItem(null);
  }

  useEffect(() => {
    if (!user || loading || items.length > 0 || autoSeeded.current) return;
    autoSeeded.current = true;
    const key = `nexus-auto-seed-${user.uid}`;
    if (typeof window !== "undefined" && sessionStorage.getItem(key)) return;

    (async () => {
      try {
        const sample = generateSampleItemsWithDates(30);
        await seedSampleInventory(user.uid, sample);
        sessionStorage.setItem(key, "1");
        toast.success("Loaded 30 sample items into your account");
      } catch {
        autoSeeded.current = false;
      }
    })();
  }, [user, loading, items.length]);

  if (!user) return null;

  return (
    <div className="space-y-6">
      {error ? (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          Firestore error: {error}. Check Firebase rules allow authenticated reads on{" "}
          <code className="text-rose-100">users/{"{uid}"}/inventory</code>.
        </div>
      ) : null}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Inventory <span className="text-gradient">Management</span>
          </h1>
          <p className="mt-1 text-zinc-500">Search, filter, and manage your catalog.</p>
        </div>
        <SeedSampleButton userId={user.uid} />
      </div>

      <InventoryTable
        items={items}
        loading={loading}
        userId={user.uid}
        onEdit={handleEdit}
        onAdd={handleAdd}
      />

      <AddItemModal
        open={modalOpen}
        onClose={handleClose}
        userId={user.uid}
        editItem={editItem}
      />

      {!loading && items.length === 0 && !error ? (
        <div className="glass rounded-xl p-6 text-center text-sm text-zinc-400">
          <p>
            Signed in as <span className="text-white">{user.email}</span>
          </p>
          <p className="mt-2">
            No items yet for this account. Click <strong>Add 30 sample items</strong> above,
            or sign in with the demo account that already has data.
          </p>
        </div>
      ) : null}
    </div>
  );
}
