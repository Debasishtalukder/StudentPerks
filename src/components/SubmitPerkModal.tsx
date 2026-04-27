import { useState } from "react";
import type { FormEvent } from "react";
import { X, Send, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CATEGORIES } from "../data/perks";

interface Props { isOpen: boolean; onClose: () => void; }
const ELIG = ["Any Student", "University Only", "GitHub Pack", "SheerID", "UNiDAYS", "Student Beans"];

export default function SubmitPerkModal({ isOpen, onClose }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmitted(true);
  };

  const handleClose = () => { onClose(); setTimeout(() => setSubmitted(false), 300); };
  const is = { background: "var(--bg-secondary)", borderColor: "var(--outline)", color: "var(--on-surface)" };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={handleClose}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-3xl p-8 shadow-2xl border no-scrollbar"
            style={{ background: "var(--surface)", borderColor: "var(--outline)" }}>
            <button onClick={handleClose} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "var(--bg-secondary)", color: "var(--on-surface-variant)" }}><X size={16} /></button>

            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle size={48} className="mx-auto mb-4 text-[#16A34A]" />
                <h2 className="font-fraunces text-2xl font-black mb-2" style={{ color: "var(--on-surface)" }}>Thanks! We'll review and add it soon 🎉</h2>
                <p className="text-sm" style={{ color: "var(--on-surface-variant)" }}>Your submission helps the student community grow.</p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="font-fraunces text-2xl font-black mb-1" style={{ color: "var(--on-surface)" }}>Submit a Perk</h2>
                  <p className="text-sm" style={{ color: "var(--on-surface-variant)" }}>Know a student deal we're missing? Let us know.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--on-surface-variant)" }}>Tool Name *</label>
                    <input type="text" required placeholder="e.g. Notion, Figma..." className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20" style={is} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--on-surface-variant)" }}>Category *</label>
                    <select required className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20" style={is}>
                      <option value="">Select category...</option>
                      {CATEGORIES.filter(c => c !== "All").map(c => <option key={c} value={c.replace(/^[^\s]+\s/, "")}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--on-surface-variant)" }}>What do students get? *</label>
                    <textarea required rows={3} placeholder="e.g. Free Pro plan for 1 year..." className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 resize-none" style={is} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--on-surface-variant)" }}>Eligibility *</label>
                    <select required className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20" style={is}>
                      <option value="">Who can claim this?</option>
                      {ELIG.map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--on-surface-variant)" }}>Claim URL *</label>
                    <input type="url" required placeholder="https://..." className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20" style={is} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--on-surface-variant)" }}>Your Email <span className="font-normal">(optional)</span></label>
                    <input type="email" placeholder="you@university.edu" className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20" style={is} />
                  </div>
                  <button type="submit" disabled={submitting}
                    className="w-full py-3 rounded-full bg-gradient-to-br from-[#004AC6] to-[#2563EB] text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-60">
                    <Send size={14} /> {submitting ? "Submitting..." : "Submit Perk"}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
