"use client";

import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { CATEGORIES, STATUS_OPTIONS } from "@/lib/constants";
import { addInventoryItem, updateInventoryItem } from "@/firebase/inventory";
import type { InventoryItem } from "@/types/inventory";
import { statusFromQuantity, statusLabel } from "@/utils/status";

type Props = {
  open: boolean;
  onClose: () => void;
  userId: string;
  editItem?: InventoryItem | null;
};

export function AddItemModal({ open, onClose, userId, editItem }: Props) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("0");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [status, setStatus] = useState("in_stock");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    setName(editItem?.itemName || "");
    setQuantity(editItem?.quantity?.toString() || "0");
    setCategory(editItem?.category || CATEGORIES[0]);
    setStatus(
      editItem?.status?.toString().replace(/\s+/g, "_").toLowerCase() || "in_stock"
    );
    setErrors({});
  }, [open, editItem]);

  function adjustQuantity(delta: number) {
    setQuantity(String(Math.max(0, Number(quantity || 0) + delta)));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Item name is required";
    const q = Number(quantity);
    if (isNaN(q) || q < 0) e.quantity = "Valid quantity required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) {
      toast.error("Please fix the highlighted fields");
      return;
    }
    setLoading(true);
    const qty = Number(quantity);
    const autoStatus = statusFromQuantity(qty);
    const payload = {
      itemName: name.trim(),
      quantity: qty,
      category,
      status: status || autoStatus,
    };
    try {
      if (editItem) {
        await updateInventoryItem(userId, editItem.id, payload);
        toast.success("Item updated");
      } else {
        await addInventoryItem(userId, payload);
        toast.success("Item added");
      }
      onClose();
    } catch {
      toast.error("Failed to save item");
    } finally {
      setLoading(false);
    }
  }

  const suggestedStatus = statusLabel(statusFromQuantity(Number(quantity) || 0));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editItem ? "Edit Item" : "Add Inventory Item"}
      footer={
        <div className="flex gap-3">
          <Button type="button" variant="ghost" fullWidth onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" form="add-inventory-form" variant="gradient" fullWidth loading={loading}>
            {editItem ? "Save Changes" : "Add Item"}
          </Button>
        </div>
      }
    >
      <form id="add-inventory-form" onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Item Name"
          placeholder="e.g. Wireless Mouse"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          autoFocus
        />

        <div className="space-y-1.5">
          <label htmlFor="quantity-stepper" className="text-sm font-medium text-zinc-300">
            Quantity
          </label>
          <div
            id="quantity-stepper"
            className={`flex items-center overflow-hidden rounded-xl border bg-white/5 ${
              errors.quantity ? "border-rose-500/50" : "border-white/10"
            }`}
          >
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => adjustQuantity(-1)}
              className="flex h-11 w-11 shrink-0 items-center justify-center text-zinc-400 transition hover:bg-white/10 hover:text-white"
            >
              <Minus className="h-4 w-4" />
            </button>
            <input
              type="number"
              min={0}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="h-11 w-full bg-transparent text-center text-sm text-white outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => adjustQuantity(1)}
              className="flex h-11 w-11 shrink-0 items-center justify-center text-zinc-400 transition hover:bg-white/10 hover:text-white"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          {errors.quantity ? (
            <p className="text-xs text-rose-400">{errors.quantity}</p>
          ) : (
            <p className="text-xs text-zinc-500">
              Suggested status for this quantity: {suggestedStatus}
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Category"
            value={category}
            onChange={setCategory}
            options={CATEGORIES.map((c) => ({ value: c, label: c }))}
          />
          <Select
            label="Status"
            value={status}
            onChange={setStatus}
            options={STATUS_OPTIONS.map((s) => ({ value: s.value, label: s.label }))}
          />
        </div>
      </form>
    </Modal>
  );
}
