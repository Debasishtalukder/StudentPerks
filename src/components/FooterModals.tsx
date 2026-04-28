import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { X, Mail, Download, Loader2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const SHEET_URL = "https://script.google.com/macros/s/AKfycby3GrkRIFEI5535Mq34RGqrq-jSM0T03g-Yi1XN3uQQ9Y8RvtzO0ZLj66FVLX-aWsxr/exec";

function ModalShell({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: ReactNode }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-3xl p-8 shadow-2xl border no-scrollbar"
            style={{ background: "var(--surface)", borderColor: "var(--outline)" }}>
            <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "var(--bg-secondary)", color: "var(--on-surface-variant)" }}><X size={16} /></button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Advertise Modal ───
export function AdvertiseModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <ModalShell isOpen={isOpen} onClose={onClose}>
      <h2 className="font-fraunces text-2xl font-black mb-1" style={{ color: "var(--on-surface)" }}>Advertise on StudentPerks.fun</h2>
      <p className="text-sm mb-6" style={{ color: "var(--on-surface-variant)" }}>Reach thousands of students actively looking for tools and discounts.</p>

      <div className="flex gap-4 mb-6">
        {[
          { emoji: "🎓", label: "10,000+", sub: "monthly students" },
          { emoji: "🌍", label: "50+", sub: "countries" },
          { emoji: "💰", label: "$2,500+", sub: "avg savings tracked" },
        ].map((s) => (
          <div key={s.label} className="flex-1 text-center p-3 rounded-xl" style={{ background: "var(--bg-secondary)" }}>
            <span className="text-lg">{s.emoji}</span>
            <p className="text-sm font-black" style={{ color: "var(--on-surface)" }}>{s.label}</p>
            <p className="text-[10px]" style={{ color: "var(--on-surface-variant)" }}>{s.sub}</p>
          </div>
        ))}
      </div>

      <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--on-surface-variant)" }}>
        We offer featured placement for tools and services that genuinely help students. Our audience consists of college and university students interested in dev tools, design, AI, productivity, and more.
      </p>
      <p className="text-sm font-medium mb-4" style={{ color: "var(--on-surface-variant)" }}>To discuss advertising or featured placement, reach out to us directly:</p>

      <a href="mailto:contact@studentperks.fun"
        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-gradient-to-br from-[#004AC6] to-[#2563EB] text-white font-bold text-sm shadow-lg hover:scale-[1.02] transition-transform">
        <Mail size={16} /> contact@studentperks.fun
      </a>
      <p className="text-xs text-center mt-4" style={{ color: "var(--on-surface-variant)" }}>We only feature tools we believe in. No spam, no misleading offers.</p>
    </ModalShell>
  );
}

// ─── API Access Modal ───
export function ApiAccessModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setStatus("loading");
    try {
      await fetch(SHEET_URL, {
        method: "POST", mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "api_waitlist", email: email.trim() }),
      });
    } catch { /* no-cors */ }
    setStatus("done");
  };

  return (
    <ModalShell isOpen={isOpen} onClose={() => { onClose(); setTimeout(() => { setStatus("idle"); setEmail(""); }, 300); }}>
      <h2 className="font-fraunces text-2xl font-black mb-1" style={{ color: "var(--on-surface)" }}>StudentPerks API</h2>
      <div className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4" style={{ background: "var(--bg-secondary)", color: "var(--primary)" }}>🚧 Coming Soon</div>
      <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--on-surface-variant)" }}>
        We're building a public API for developers to access our curated student perks database. Join the waitlist to get early access.
      </p>
      {status === "done" ? (
        <div className="text-center py-4">
          <span className="text-3xl mb-2 block">🎉</span>
          <p className="font-bold" style={{ color: "var(--on-surface)" }}>You're on the list!</p>
          <p className="text-sm" style={{ color: "var(--on-surface-variant)" }}>We'll email you when the API is ready.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com"
            className="flex-1 px-4 py-2.5 rounded-full border text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
            style={{ background: "var(--bg-secondary)", borderColor: "var(--outline)", color: "var(--on-surface)" }} />
          <button type="submit" disabled={status === "loading"}
            className="px-6 py-2.5 rounded-full bg-gradient-to-br from-[#004AC6] to-[#2563EB] text-white font-bold text-sm shadow-lg hover:scale-105 transition-transform disabled:opacity-60 flex items-center gap-2 shrink-0">
            {status === "loading" ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} />} Join Waitlist
          </button>
        </form>
      )}
    </ModalShell>
  );
}

// ─── Brand Assets Modal ───
export function BrandAssetsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const downloadLogo = () => {
    const link = document.createElement("a");
    link.href = "/logo.png";
    link.download = "studentperks-logo.png";
    link.click();
  };

  return (
    <ModalShell isOpen={isOpen} onClose={onClose}>
      <h2 className="font-fraunces text-2xl font-black mb-6" style={{ color: "var(--on-surface)" }}>Brand Assets</h2>

      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 rounded-2xl p-4 border" style={{ background: "var(--bg-secondary)", borderColor: "var(--outline)" }}>
          <img src="/logo.png" alt="StudentPerks Logo" className="w-full h-full object-contain" />
        </div>
      </div>

      <div className="flex gap-3 mb-8">
        <button onClick={downloadLogo}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full border text-sm font-bold hover:scale-105 transition-transform"
          style={{ borderColor: "var(--outline)", color: "var(--on-surface)" }}>
          <Download size={14} /> Download PNG
        </button>
      </div>

      <h3 className="font-bold text-sm mb-3" style={{ color: "var(--on-surface)" }}>Color Palette</h3>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { name: "Primary Green", hex: "#1a7a4a", bg: "#1a7a4a" },
          { name: "Dark", hex: "#1a1a1a", bg: "#1a1a1a" },
          { name: "Background", hex: "#f5f5f0", bg: "#f5f5f0" },
        ].map((c) => (
          <div key={c.name} className="text-center">
            <div className="w-full h-12 rounded-xl mb-2 border" style={{ background: c.bg, borderColor: "var(--outline)" }} />
            <p className="text-xs font-bold" style={{ color: "var(--on-surface)" }}>{c.name}</p>
            <p className="text-[10px] font-mono" style={{ color: "var(--on-surface-variant)" }}>{c.hex}</p>
          </div>
        ))}
      </div>

      <h3 className="font-bold text-sm mb-2" style={{ color: "var(--on-surface)" }}>Font</h3>
      <p className="text-sm" style={{ color: "var(--on-surface-variant)" }}>Inter / DM Sans</p>
    </ModalShell>
  );
}
