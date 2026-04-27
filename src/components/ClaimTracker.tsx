import { motion, AnimatePresence } from "motion/react";
import { Trophy } from "lucide-react";
import { PERKS } from "../data/perks";

interface ClaimTrackerProps {
  claimedIds: Set<string>;
}

const MILESTONES = [5, 10, 25, 50];

export default function ClaimTracker({ claimedIds }: ClaimTrackerProps) {
  const total = PERKS.length;
  const claimed = claimedIds.size;
  const pct = Math.round((claimed / total) * 100);

  if (claimed === 0) return null;

  const nextMilestone = MILESTONES.find((m) => m > claimed) || total;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-[90] px-4 pb-4"
      >
        <div
          className="max-w-xl mx-auto rounded-2xl px-5 py-4 shadow-2xl border backdrop-blur-xl flex items-center gap-4"
          style={{ background: "var(--surface)", borderColor: "var(--outline)" }}
        >
          <div className="w-10 h-10 rounded-full bg-[#7CF994] flex items-center justify-center shrink-0">
            <Trophy size={18} className="text-[#002109]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-sm font-bold" style={{ color: "var(--on-surface)" }}>
                {claimed}/{total} perks claimed
              </p>
              <span className="text-xs font-bold" style={{ color: "var(--on-surface-variant)" }}>
                {pct}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#16A34A] to-[#7CF994]"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <p className="text-[11px] mt-1" style={{ color: "var(--on-surface-variant)" }}>
              {nextMilestone - claimed} more to reach {nextMilestone} — keep going!
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
