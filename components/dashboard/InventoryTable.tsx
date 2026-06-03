"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { SearchBar } from "@/components/ui/SearchBar";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { TableSkeleton } from "@/components/ui/LoadingSkeleton";
import { deleteInventoryItem } from "@/firebase/inventory";
import type { InventoryItem } from "@/types/inventory";
import { formatDate } from "@/utils/format";
import { statusBadgeClass, statusLabel } from "@/utils/status";
import { CATEGORIES } from "@/lib/constants";

const PAGE_SIZE = 8;

type Props = {
  items: InventoryItem[];
  loading: boolean;
  userId: string;
  onEdit: (item: InventoryItem) => void;
  onAdd: () => void;
};

export function InventoryTable({ items, loading, userId, onEdit, onAdd }: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    return items.filter((i) => {
      const matchSearch =
        !search ||
        i.itemName.toLowerCase().includes(search.toLowerCase()) ||
        i.category.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "all" || i.category === category;
      return matchSearch && matchCat;
    });
  }, [items, search, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  async function handleDelete(id: string) {
    if (!confirm("Delete this item?")) return;
    try {
      await deleteInventoryItem(userId, id);
      toast.success("Item deleted");
    } catch {
      toast.error("Delete failed");
    }
  }

  return (
    <div className="glass overflow-hidden rounded-2xl">
      <div className="relative z-20 flex flex-col gap-4 border-b border-white/10 p-4 md:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Inventory</h2>
          <p className="text-sm text-zinc-500">{filtered.length} items</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBar
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(0);
            }}
            placeholder="Search inventory..."
            className="w-full sm:w-56"
          />
          <Select
            value={category}
            onChange={(v) => {
              setCategory(v);
              setPage(0);
            }}
            className="w-full sm:w-44"
            options={[
              { value: "all", label: "All categories" },
              ...CATEGORIES.map((c) => ({ value: c, label: c })),
            ]}
          />
          <Button variant="gradient" onClick={onAdd} className="whitespace-nowrap">
            + Add Item
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="p-4">
          <TableSkeleton />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-zinc-500">
                <th className="px-4 py-3 font-medium">Item</th>
                <th className="px-4 py-3 font-medium">Qty</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="sticky right-0 min-w-[100px] bg-[var(--color-bg-mid)] px-4 py-3 font-medium backdrop-blur-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paged.map((item) => (
                <tr
                  key={item.id}
                  className="group border-b border-white/5 transition hover:bg-white/[0.03]"
                >
                  <td className="px-4 py-3.5 font-medium text-white">{item.itemName}</td>
                  <td className="px-4 py-3.5 tabular-nums text-zinc-300">{item.quantity}</td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex rounded-lg border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-zinc-300">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusBadgeClass(String(item.status))}`}
                    >
                      {statusLabel(String(item.status))}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-zinc-500">{formatDate(item.createdAt)}</td>
                  <td className="sticky right-0 min-w-[100px] bg-[var(--color-bg-deep)] px-4 py-3.5 backdrop-blur-sm group-hover:bg-[var(--color-bg-soft)]">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        aria-label={`Edit ${item.itemName}`}
                        onClick={() => onEdit(item)}
                        className="rounded-lg border border-transparent p-2 text-zinc-400 transition hover:border-accent-cyan/30 hover:bg-accent-cyan/10 hover:text-accent-cyan"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Delete ${item.itemName}`}
                        onClick={() => handleDelete(item.id)}
                        className="rounded-lg border border-transparent p-2 text-zinc-400 transition hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!paged.length ? (
            <p className="p-12 text-center text-zinc-500">No inventory items found.</p>
          ) : null}
        </div>
      )}

      <div className="flex items-center justify-between border-t border-white/10 px-4 py-3 md:px-5">
        <Button
          variant="ghost"
          disabled={page === 0}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
        >
          Previous
        </Button>
        <span className="text-sm text-zinc-500">
          Page {page + 1} of {totalPages}
        </span>
        <Button
          variant="ghost"
          disabled={page >= totalPages - 1}
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
