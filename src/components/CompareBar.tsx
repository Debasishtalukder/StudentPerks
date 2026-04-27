import { X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PERKS } from "../data/perks";
import LogoImage from "./LogoImage";

interface CompareBarProps {
  compareIds: string[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onCompare: () => void;
}

export default function CompareBar({ compareIds, onRemove, onClear, onCompare }: CompareBarProps) {
  if (compareIds.length === 0) return null;
  const perks = compareIds.map((id) => PERKS.find((p) => p.id === id)).filter(Boolean);
  const remaining = 3 - compareIds.length;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-[80] px-4 pb-4"
      >
        <div className="max-w-2xl mx-auto rounded-2xl px-5 py-4 shadow-2xl border backdrop-blur-xl flex items-center gap-4"
          style={{ background: "var(--surface)", borderColor: "var(--outline)" }}>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {perks.map((perk) => perk && (
              <div key={perk.id} className="flex items-center gap-2 px-3 py-1.5 rounded-full border shrink-0"
                style={{ background: "var(--bg-secondary)", borderColor: "var(--outline)" }}>
                <div className="w-5 h-5 rounded overflow-hidden"><LogoImage domain={perk.domain} name={perk.company} className="w-full h-full" /></div>
                <span className="text-xs font-bold truncate max-w-[80px]" style={{ color: "var(--on-surface)" }}>{perk.company}</span>
                <button onClick={() => onRemove(perk.id)} className="hover:opacity-70"><X size={12} style={{ color: "var(--on-surface-variant)" }} /></button>
              </div>
            ))}
            <span className="text-xs font-medium shrink-0" style={{ color: "var(--on-surface-variant)" }}>
              {remaining > 0 ? `Add ${remaining} more` : "Ready!"}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={onClear} className="text-xs font-bold px-3 py-2 rounded-full hover:opacity-70 transition-opacity"
              style={{ color: "var(--on-surface-variant)" }}>Clear</button>
            {compareIds.length >= 2 && (
              <button onClick={onCompare}
                className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#2563EB] text-white text-xs font-bold shadow-lg hover:scale-105 transition-transform">
                Compare <ArrowRight size={12} />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
