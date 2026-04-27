import { useState } from "react";
import type { FormEvent } from "react";
import { X, Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CATEGORIES } from "../data/perks";

const SHEET_URL = "https://script.google.com/macros/s/AKfycby3GrkRIFEI5535Mq34RGqrq-jSM0T03g-Yi1XN3uQQ9Y8RvtzO0ZLj66FVLX-aWsxr/exec";
const ELIG = ["Any Student", "University Only", "GitHub Pack", "SheerID", "UNiDAYS", "Student Beans"];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormErrors {
  toolName?: string;
  category?: string;
  offer?: string;
  eligibility?: string;
  claimUrl?: string;
  email?: string;
}

export default function SubmitPerkModal({ isOpen, onClose, onSuccess }: Props) {
  const [toolName, setToolName] = useState("");
  const [category, setCategory] = useState("");
  const [offer, setOffer] = useState("");
  const [eligibility, setEligibility] = useState("");
  const [claimUrl, setClaimUrl] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!toolName.trim() || toolName.trim().length < 2) e.toolName = "Tool name must be at least 2 characters";
    if (!category) e.category = "Please select a category";
    if (!offer.trim() || offer.trim().length < 10) e.offer = "Please describe the offer (at least 10 characters)";
    if (!eligibility) e.eligibility = "Please select eligibility";
    if (!claimUrl.trim() || !claimUrl.trim().startsWith("https://")) e.claimUrl = "URL must start with https://";
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = "Please enter a valid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const resetForm = () => {
    setToolName(""); setCategory(""); setOffer("");
    setEligibility(""); setClaimUrl(""); setEmail("");
    setErrors({}); setStatus("idle");
  };

  const handleClose = () => {
    onClose();
    setTimeout(resetForm, 300);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    try {
      await fetch(SHEET_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "submission",
          toolName: toolName.trim(),
          category,
          offer: offer.trim(),
          eligibility,
          claimUrl: claimUrl.trim(),
          email: email.trim() || "",
        }),
      });
      handleClose();
      onSuccess();
    } catch {
      setStatus("error");
    }
  };

  const inputBase = "w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all";
  const inputStyle = (hasError: boolean) => ({
    background: "var(--bg-secondary)",
    borderColor: hasError ? "#f87171" : "var(--outline)",
    color: "var(--on-surface)",
  });

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

            <div className="mb-6">
              <h2 className="font-fraunces text-2xl font-black mb-1" style={{ color: "var(--on-surface)" }}>Submit a Perk</h2>
              <p className="text-sm" style={{ color: "var(--on-surface-variant)" }}>Know a student deal we're missing? Let us know.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tool Name */}
              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--on-surface-variant)" }}>Tool Name *</label>
                <input type="text" value={toolName} onChange={(e) => { setToolName(e.target.value); setErrors((p) => ({ ...p, toolName: undefined })); }}
                  placeholder="e.g. Notion, Figma..."
                  className={`${inputBase} ${errors.toolName ? "focus:ring-red-200" : "focus:ring-[#16A34A]/20"}`}
                  style={inputStyle(!!errors.toolName)} />
                {errors.toolName && <p className="text-[11px] text-red-500 mt-1 ml-1">{errors.toolName}</p>}
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--on-surface-variant)" }}>Category *</label>
                <select value={category} onChange={(e) => { setCategory(e.target.value); setErrors((p) => ({ ...p, category: undefined })); }}
                  className={`${inputBase} ${errors.category ? "focus:ring-red-200" : "focus:ring-[#16A34A]/20"}`}
                  style={inputStyle(!!errors.category)}>
                  <option value="">Select category...</option>
                  {CATEGORIES.filter(c => c !== "All").map(c => <option key={c} value={c.replace(/^[^\s]+\s/, "")}>{c}</option>)}
                </select>
                {errors.category && <p className="text-[11px] text-red-500 mt-1 ml-1">{errors.category}</p>}
              </div>

              {/* Offer */}
              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--on-surface-variant)" }}>What do students get? *</label>
                <textarea value={offer} onChange={(e) => { setOffer(e.target.value); setErrors((p) => ({ ...p, offer: undefined })); }}
                  rows={3} placeholder="e.g. Free Pro plan for 1 year, 50% off..."
                  className={`${inputBase} resize-none ${errors.offer ? "focus:ring-red-200" : "focus:ring-[#16A34A]/20"}`}
                  style={inputStyle(!!errors.offer)} />
                {errors.offer && <p className="text-[11px] text-red-500 mt-1 ml-1">{errors.offer}</p>}
              </div>

              {/* Eligibility */}
              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--on-surface-variant)" }}>Eligibility *</label>
                <select value={eligibility} onChange={(e) => { setEligibility(e.target.value); setErrors((p) => ({ ...p, eligibility: undefined })); }}
                  className={`${inputBase} ${errors.eligibility ? "focus:ring-red-200" : "focus:ring-[#16A34A]/20"}`}
                  style={inputStyle(!!errors.eligibility)}>
                  <option value="">Who can claim this?</option>
                  {ELIG.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
                {errors.eligibility && <p className="text-[11px] text-red-500 mt-1 ml-1">{errors.eligibility}</p>}
              </div>

              {/* Claim URL */}
              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--on-surface-variant)" }}>Claim URL *</label>
                <input type="text" value={claimUrl} onChange={(e) => { setClaimUrl(e.target.value); setErrors((p) => ({ ...p, claimUrl: undefined })); }}
                  placeholder="https://..."
                  className={`${inputBase} ${errors.claimUrl ? "focus:ring-red-200" : "focus:ring-[#16A34A]/20"}`}
                  style={inputStyle(!!errors.claimUrl)} />
                {errors.claimUrl && <p className="text-[11px] text-red-500 mt-1 ml-1">{errors.claimUrl}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--on-surface-variant)" }}>Your Email <span className="font-normal">(optional)</span></label>
                <input type="text" value={email} onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
                  placeholder="you@university.edu"
                  className={`${inputBase} ${errors.email ? "focus:ring-red-200" : "focus:ring-[#16A34A]/20"}`}
                  style={inputStyle(!!errors.email)} />
                {errors.email && <p className="text-[11px] text-red-500 mt-1 ml-1">{errors.email}</p>}
              </div>

              {/* Error message */}
              {status === "error" && (
                <p className="text-sm font-medium text-red-500 text-center">Something went wrong. Please try again.</p>
              )}

              {/* Submit */}
              <button type="submit" disabled={status === "loading"}
                className="w-full py-3 rounded-full bg-gradient-to-br from-[#004AC6] to-[#2563EB] text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-60 disabled:hover:scale-100">
                {status === "loading" ? (
                  <><Loader2 size={14} className="animate-spin" /> Submitting...</>
                ) : (
                  <><Send size={14} /> Submit Perk</>
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
