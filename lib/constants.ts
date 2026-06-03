export const CATEGORIES = [
  "Electronics",
  "Accessories",
  "Audio",
  "Storage",
  "Office",
  "Apparel",
  "Food",
  "Other",
] as const;

export const STATUS_OPTIONS = [
  { value: "in_stock", label: "In Stock" },
  { value: "low_stock", label: "Low Stock" },
  { value: "out_of_stock", label: "Out of Stock" },
] as const;

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/dashboard/inventory", label: "Inventory", icon: "Package" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "BarChart3" },
  { href: "/dashboard/ai-insights", label: "AI Insights", icon: "Sparkles" },
  { href: "/dashboard/settings", label: "Settings", icon: "Settings" },
] as const;
