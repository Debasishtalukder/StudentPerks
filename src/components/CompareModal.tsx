import { X, ExternalLink, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { PERKS } from "../data/perks";
import { buildTrackedUrl } from "../data/affiliates";
import LogoImage from "./LogoImage";

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  compareIds: string[];
}

const ROWS: { label: string; key: keyof typeof PERKS[0] | "value" }[] = [
  { label: "Category", key: "category" },
  { label: "What Students Get", key: "savings" },
  { label: "Annual Value", key: "value" },
  { label: "Eligibility", key: "eligibility" },
  { label: "Countries", key: "countries" },
];

export default function CompareModal({ isOpen, onClose, compareIds }: CompareModalProps) {
  const [copied, setCopied] = useState(false);
  const perks = compareIds.map((id) => PERKS.find((p) => p.id === id)).filter(Boolean);

  const shareComparison = async () => {
    const names = perks.map((p) => p!.company).join(" vs ");
    const url = `${window.location.origin}?compare=${compareIds.join(",")}`;
    await navigator.clipboard.writeText(`${names} — Student comparison on StudentPerks.fun\n${url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getValue = (perk: typeof PERKS[0], key: string): string => {
    if (key === "value") return perk.annualValue ? `$${perk.annualValue}/yr` : "—";
    if (key === "countries") {
      const c = perk.countries;
      return c.includes("GLOBAL") ? "Global" : c.join(", ");
    }
    return String((perk as unknown as Record<string, unknown>)[key] || "—");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl p-8 shadow-2xl border no-scrollbar"
            style={{ background: "var(--surface)", borderColor: "var(--outline)" }}>

            <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "var(--bg-secondary)", color: "var(--on-surface-variant)" }}><X size={16} /></button>

            <h2 className="font-fraunces text-2xl font-black mb-6" style={{ color: "var(--on-surface)" }}>Compare Tools</h2>

            {/* Header row with logos */}
            <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: `140px repeat(${perks.length}, 1fr)` }}>
              <div />
              {perks.map((perk) => perk && (
                <div key={perk.id} className="text-center">
                  <div className="w-14 h-14 mx-auto mb-2 rounded-xl p-2.5 overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
                    <LogoImage domain={perk.domain} name={perk.company} className="w-full h-full" />
                  </div>
                  <p className="font-bold text-sm" style={{ color: "var(--on-surface)" }}>{perk.title}</p>
                </div>
              ))}
            </div>

            {/* Comparison rows */}
            <div className="space-y-0">
              {ROWS.map((row, i) => (
                <div key={row.label} className="grid gap-4 py-3 border-b" style={{ gridTemplateColumns: `140px repeat(${perks.length}, 1fr)`, borderColor: "var(--outline)" }}>
                  <div className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--on-surface-variant)" }}>{row.label}</div>
                  {perks.map((perk) => perk && (
                    <div key={perk.id} className="text-sm font-medium" style={{ color: "var(--on-surface)" }}>
                      {getValue(perk, row.key)}
                    </div>
                  ))}
                </div>
              ))}

              {/* Claim URLs */}
              <div className="grid gap-4 py-3" style={{ gridTemplateColumns: `140px repeat(${perks.length}, 1fr)` }}>
                <div className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--on-surface-variant)" }}>Claim</div>
                {perks.map((perk) => perk && (
                  <div key={perk.id}>
                    <a href={buildTrackedUrl(perk.url, perk.id)} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-bold hover:opacity-70 transition-opacity" style={{ color: "var(--primary)" }}>
                      Get Offer <ExternalLink size={12} />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-3 mt-8">
              <button onClick={shareComparison}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold border hover:scale-105 transition-transform"
                style={{ borderColor: "var(--outline)", color: "var(--on-surface)" }}>
                {copied ? <><Check size={14} className="text-emerald-600" /> Copied!</> : <><Copy size={14} /> Share Comparison</>}
              </button>
              <button onClick={onClose}
                className="px-5 py-2.5 rounded-full text-sm font-bold hover:opacity-70 transition-opacity"
                style={{ color: "var(--on-surface-variant)" }}>
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
