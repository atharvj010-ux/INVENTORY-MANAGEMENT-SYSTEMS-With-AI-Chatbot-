"use client";

import { motion } from "framer-motion";
import { Bell, Lock, Moon, User } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { authErrorMessage, resetPassword } from "@/firebase/auth";

export default function SettingsPage() {
  const { user } = useAuthContext();
  const { darkMode, setDarkMode } = useTheme();
  const [name, setName] = useState(user?.displayName || "");
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [resetLoading, setResetLoading] = useState(false);

  function handleSave() {
    toast.success("Settings saved (demo)");
  }

  async function handleResetPassword() {
    const email = user?.email?.trim();
    if (!email) {
      toast.error("No email on this account. Use email/password sign-in to reset.");
      return;
    }
    setResetLoading(true);
    try {
      await resetPassword(email);
      toast.success(`Password reset email sent to ${email}. Check your inbox and spam folder.`);
    } catch (err) {
      toast.error(authErrorMessage(err));
    } finally {
      setResetLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">
          Settings <span className="text-gradient">& Security</span>
        </h1>
        <p className="mt-1 text-zinc-500">Manage your account and preferences.</p>
      </motion.div>

      <section className="glass p-6 space-y-4">
        <div className="flex items-center gap-2 text-accent-cyan">
          <User className="h-5 w-5" />
          <h2 className="font-semibold">User Profile</h2>
        </div>
        <Input label="Display Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Email" value={user?.email || ""} disabled />
        <Button variant="gradient" onClick={handleSave}>
          Save Profile
        </Button>
      </section>

      <section className="glass p-6 space-y-4">
        <div className="flex items-center gap-2 text-accent-purple">
          <Bell className="h-5 w-5" />
          <h2 className="font-semibold">Notifications</h2>
        </div>
        <label className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
          <span>Push notifications</span>
          <input
            type="checkbox"
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
            className="accent-accent-cyan"
          />
        </label>
        <label className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
          <span>Email alerts for low stock</span>
          <input
            type="checkbox"
            checked={emailAlerts}
            onChange={(e) => setEmailAlerts(e.target.checked)}
            className="accent-accent-cyan"
          />
        </label>
      </section>

      <section className="glass p-6 space-y-4">
        <div className="flex items-center gap-2 text-accent-pink">
          <Moon className="h-5 w-5" />
          <h2 className="font-semibold">Appearance</h2>
        </div>
        <label className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
          <span>Dark mode</span>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={(e) => {
              setDarkMode(e.target.checked);
              toast.success(e.target.checked ? "Dark mode enabled" : "Light mode enabled");
            }}
            className="accent-accent-cyan"
          />
        </label>
      </section>

      <section className="glass p-6 space-y-4">
        <div className="flex items-center gap-2 text-rose-300">
          <Lock className="h-5 w-5" />
          <h2 className="font-semibold">Security</h2>
        </div>
        <p className="text-sm text-zinc-500">
          Password changes are managed through Firebase Authentication.
        </p>
        <Button
          variant="ghost"
          onClick={handleResetPassword}
          loading={resetLoading}
          disabled={!user?.email}
        >
          Reset Password (Firebase)
        </Button>
      </section>
    </div>
  );
}
