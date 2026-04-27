import { useState, useMemo } from "react";
import { Calculator, Share2, Check } from "lucide-react";
import { PERKS } from "../data/perks";
import LogoImage from "./LogoImage";
import SavingsCard from "./SavingsCard";

export default function SavingsCalculator() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showCard, setShowCard] = useState(false);

  const perksWithValue = useMemo(
    () => PERKS.filter((p) => p.annualValue && p.annualValue > 0).sort((a, b) => (b.annualValue || 0) - (a.annualValue || 0)),
    []
  );

  const totalSavings = useMemo(
    () => perksWithValue.filter((p) => selected.has(p.id)).reduce((sum, p) => sum + (p.annualValue || 0), 0),
    [selected, perksWithValue]
  );

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selected.size === perksWithValue.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(perksWithValue.map((p) => p.id)));
    }
  };

  return (
    <>
      <section className="py-20 px-6" style={{ background: "var(--bg-secondary)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase bg-[#7CF994] text-[#002109] mb-6">
              <Calculator size={14} /> Savings Calculator
            </span>
            <h2 className="font-fraunces text-4xl md:text-5xl font-black mb-4" style={{ color: "var(--on-surface)" }}>
              Calculate Your Savings
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: "var(--on-surface-variant)" }}>
              Check the tools you use and see how much you're saving per year as a student.
            </p>
          </div>

          {/* Savings counter */}
          <div className="rounded-3xl p-8 mb-8 text-center border" style={{ background: "var(--surface)", borderColor: "var(--outline)" }}>
            <p className="text-sm font-bold mb-2" style={{ color: "var(--on-surface-variant)" }}>You're saving</p>
            <p className="font-fraunces text-6xl md:text-7xl font-black text-[#16A34A] mb-2 tabular-nums">
              ${totalSavings.toLocaleString()}
              <span className="text-2xl font-dm-sans font-normal" style={{ color: "var(--on-surface-variant)" }}>/year</span>
            </p>
            <p className="text-sm mb-6" style={{ color: "var(--on-surface-variant)" }}>
              {selected.size} of {perksWithValue.length} tools selected
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={selectAll}
                className="px-6 py-2.5 rounded-full text-sm font-bold border transition-all hover:scale-105"
                style={{ borderColor: "var(--outline)", color: "var(--on-surface)" }}
              >
                {selected.size === perksWithValue.length ? "Deselect All" : "Select All"}
              </button>
              {selected.size > 0 && (
                <button
                  onClick={() => setShowCard(true)}
                  className="px-6 py-2.5 rounded-full text-sm font-bold bg-[#7CF994] text-[#002109] transition-all hover:scale-105 flex items-center gap-2"
                >
                  <Share2 size={14} /> Share Your Savings
                </button>
              )}
            </div>
          </div>

          {/* Tool checkboxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {perksWithValue.map((perk) => (
              <button
                key={perk.id}
                onClick={() => toggle(perk.id)}
                className="flex items-center gap-3 p-4 rounded-2xl border transition-all text-left group"
                style={{
                  background: selected.has(perk.id) ? "rgba(124,249,148,0.1)" : "var(--surface)",
                  borderColor: selected.has(perk.id) ? "#16A34A" : "var(--outline)",
                }}
              >
                <div
                  className="w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all"
                  style={{
                    borderColor: selected.has(perk.id) ? "#16A34A" : "var(--outline-variant)",
                    background: selected.has(perk.id) ? "#16A34A" : "transparent",
                  }}
                >
                  {selected.has(perk.id) && <Check size={12} className="text-white" />}
                </div>
                <div className="w-8 h-8 rounded-lg p-1.5 shrink-0 overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
                  <LogoImage domain={perk.domain} name={perk.company} className="w-full h-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate" style={{ color: "var(--on-surface)" }}>{perk.title}</p>
                </div>
                <span className="text-sm font-black text-[#16A34A] shrink-0">${perk.annualValue}/yr</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Savings Card Modal */}
      <SavingsCard
        isOpen={showCard}
        onClose={() => setShowCard(false)}
        totalSavings={totalSavings}
        toolCount={selected.size}
        toolNames={perksWithValue.filter((p) => selected.has(p.id)).map((p) => p.company)}
      />
    </>
  );
}
