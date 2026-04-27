import { X, Github, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PERKS } from "../data/perks";
import LogoImage from "./LogoImage";

interface StartHereModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TOP_PERKS = PERKS.filter((p) => p.featured).slice(0, 5);

const STEPS = [
  {
    num: 1,
    icon: <Github size={20} />,
    title: "Get your GitHub Student Pack",
    desc: "This is the master key — it unlocks 60%+ of tools on this site. Apply with your .edu email and get approved in minutes.",
    cta: "Apply Now",
    url: "https://education.github.com/pack",
    color: "#6E40C9",
  },
  {
    num: 2,
    icon: <ShieldCheck size={20} />,
    title: "Verify on UNiDAYS + Student Beans + SheerID",
    desc: "These three platforms power verification for most student discounts. Sign up for all three — it takes 2 minutes each.",
    cta: "Set Up Verification",
    url: "https://www.myunidays.com/",
    color: "#2563EB",
  },
  {
    num: 3,
    icon: <Sparkles size={20} />,
    title: "Claim these 5 high-value tools first",
    desc: "Start with the biggest savings. These tools alone save you $800+/year.",
    color: "#16A34A",
  },
  {
    num: 4,
    icon: <ArrowRight size={20} />,
    title: "Explore by category",
    desc: "Browse 150+ tools across AI, Dev Tools, Design, Cloud, Music, and more. Filter by your country to see what's available.",
    cta: "Explore All Perks",
    color: "#004AC6",
  },
];

export default function StartHereModal({ isOpen, onClose }: StartHereModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl p-8 shadow-2xl border no-scrollbar"
            style={{ background: "var(--surface)", borderColor: "var(--outline)" }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{ background: "var(--bg-secondary)", color: "var(--on-surface-variant)" }}
            >
              <X size={16} />
            </button>

            <div className="text-center mb-8">
              <span className="text-4xl mb-4 block">🚀</span>
              <h2 className="font-fraunces text-3xl font-black mb-2" style={{ color: "var(--on-surface)" }}>
                New to student perks?
              </h2>
              <p style={{ color: "var(--on-surface-variant)" }}>Follow these 4 steps to maximize your savings</p>
            </div>

            <div className="space-y-6">
              {STEPS.map((step) => (
                <div key={step.num} className="flex gap-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white font-black text-sm"
                    style={{ background: step.color }}
                  >
                    {step.num}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1" style={{ color: "var(--on-surface)" }}>{step.title}</h3>
                    <p className="text-sm mb-3" style={{ color: "var(--on-surface-variant)" }}>{step.desc}</p>

                    {step.num === 3 && (
                      <div className="space-y-2 mb-3">
                        {TOP_PERKS.map((perk) => (
                          <a
                            key={perk.id}
                            href={perk.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-xl border transition-all hover:scale-[1.01]"
                            style={{ background: "var(--bg-secondary)", borderColor: "var(--outline)" }}
                          >
                            <div className="w-8 h-8 rounded-lg p-1.5 overflow-hidden" style={{ background: "var(--surface)" }}>
                              <LogoImage domain={perk.domain} name={perk.company} className="w-full h-full" />
                            </div>
                            <span className="text-sm font-bold flex-1" style={{ color: "var(--on-surface)" }}>{perk.title}</span>
                            <span className="text-xs font-bold text-[#16A34A]">{perk.savings}</span>
                          </a>
                        ))}
                      </div>
                    )}

                    {step.cta && step.url && (
                      <a
                        href={step.num === 4 ? "#explore" : step.url}
                        target={step.num === 4 ? undefined : "_blank"}
                        rel={step.num === 4 ? undefined : "noopener noreferrer"}
                        onClick={step.num === 4 ? onClose : undefined}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold text-white transition-all hover:scale-105"
                        style={{ background: step.color }}
                      >
                        {step.cta} <ArrowRight size={14} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
