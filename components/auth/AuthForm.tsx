"use client";

import { Eye, EyeOff, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { signIn, signUp } from "@/firebase/auth";
import { FloatingBackground } from "@/components/ui/FloatingBackground";
import { FirebaseSetupBanner } from "@/components/providers/FirebaseSetupBanner";
import { isFirebaseConfigured } from "@/firebase/client";

type Mode = "login" | "signup";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (mode === "signup" && !name.trim()) e.name = "Name is required";
    if (!email.trim()) e.email = "Email is required";
    if (!password || password.length < 6) e.password = "Password must be 6+ characters";
    if (mode === "signup" && password !== confirm) e.confirm = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (mode === "signup") {
        await signUp(email, password, name);
        toast.success("Account created!");
      } else {
        await signIn(email, password);
        toast.success("Welcome back!");
      }
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Authentication failed";
      toast.error(msg.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center mesh-bg px-4">
      <FloatingBackground />
      <div className="relative z-10 w-full max-w-md">
        <div className="glass glow-border p-8">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-cyan to-accent-purple neon">
              <Zap className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold">
              {mode === "login" ? "Welcome back" : "Create account"}
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              {mode === "login"
                ? "Sign in to your AI inventory dashboard"
                : "Start managing inventory with AI intelligence"}
            </p>
          </div>

          <FirebaseSetupBanner />

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" ? (
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
              />
            ) : null}
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />
            <div className="relative">
              <Input
                label="Password"
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="absolute right-3 top-[38px] text-zinc-500 hover:text-white"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {mode === "signup" ? (
              <Input
                label="Confirm Password"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                error={errors.confirm}
              />
            ) : null}
            <Button
              type="submit"
              variant="gradient"
              className="w-full"
              loading={loading}
              disabled={!isFirebaseConfigured()}
            >
              {mode === "login" ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            {mode === "login" ? (
              <>
                No account?{" "}
                <Link href="/signup" className="text-accent-cyan hover:underline">
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Have an account?{" "}
                <Link href="/login" className="text-accent-cyan hover:underline">
                  Sign in
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
