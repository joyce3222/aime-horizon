"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InternalLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const res = await fetch("/api/internal/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      router.push("/internal/workspace");
    } else {
      setError(true);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-px bg-gold" />
            <span className="text-gold text-xs tracking-[0.2em] uppercase font-sans">Internal Access</span>
            <div className="w-8 h-px bg-gold" />
          </div>
          <h1 className="font-serif text-4xl text-cream font-light mb-2">AIME Horizon</h1>
          <p className="text-cream/50 text-sm font-sans tracking-wide">AI Digital Workforce</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full bg-navy-light border border-cream/10 text-cream placeholder-cream/30 px-5 py-4 font-sans text-sm rounded focus:outline-none focus:border-gold/60 transition-colors"
            autoFocus
            autoComplete="username"
          />
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-navy-light border border-cream/10 text-cream placeholder-cream/30 px-5 py-4 font-sans text-sm rounded focus:outline-none focus:border-gold/60 transition-colors"
              autoComplete="current-password"
            />
            {error && (
              <p className="text-red-400 text-xs mt-2 font-sans">Incorrect username or password.</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading || !username || !password}
            className="w-full bg-gold hover:bg-gold-dark disabled:opacity-40 text-navy font-sans text-sm tracking-widest uppercase py-4 rounded transition-colors"
          >
            {loading ? "Verifying..." : "Enter Workspace"}
          </button>
        </form>
      </div>
    </div>
  );
}
