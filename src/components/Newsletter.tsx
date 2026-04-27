import { useState, useEffect, useRef } from "react";
import type { FormEvent } from "react";
import { Mail, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "motion/react";

const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbziN86bhLzEZV0YpIvdr7uaGUlAlGDb4UKmptE6Ungh87NriFchB70YrzlqpoE8_SMo/exec";

// Simple confetti burst using canvas
function ConfettiBurst({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!active || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    const colors = ["#7CF994", "#2563EB", "#F59E0B", "#EC4899", "#8B5CF6", "#06B6D4"];
    const particles: { x: number; y: number; vx: number; vy: number; size: number; color: string; life: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: canvas.offsetWidth / 2, y: canvas.offsetHeight / 2,
        vx: (Math.random() - 0.5) * 12, vy: (Math.random() - 0.5) * 12 - 4,
        size: Math.random() * 6 + 3, color: colors[Math.floor(Math.random() * colors.length)], life: 1,
      });
    }
    let frame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      let alive = false;
      for (const p of particles) {
        if (p.life <= 0) continue;
        alive = true;
        p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.life -= 0.015;
        ctx.globalAlpha = p.life; ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
      ctx.globalAlpha = 1;
      if (alive) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [active]);
  if (!active) return null;
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "already">("idle");
  const [validationError, setValidationError] = useState("");
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check if already subscribed
  useEffect(() => {
    if (localStorage.getItem("sp_subscribed") === "true") {
      setStatus("already");
    }
  }, []);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setValidationError("");

    // Validation
    if (!email.trim()) {
      setValidationError("Please enter your email");
      triggerShake();
      return;
    }
    if (!isValidEmail(email)) {
      setValidationError("Please enter a valid email");
      triggerShake();
      return;
    }

    setStatus("loading");

    try {
      await fetch(GOOGLE_SHEET_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      // no-cors means we can't read the response, but if fetch didn't throw, it sent
      localStorage.setItem("sp_subscribed", "true");
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  // Already subscribed state
  if (status === "already") {
    return (
      <section className="py-24 px-6 relative overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-5xl mb-4 block">🎉</span>
          <h2 className="font-fraunces text-2xl font-black mb-2" style={{ color: "var(--on-surface)" }}>
            You're already subscribed!
          </h2>
          <p className="text-sm" style={{ color: "var(--on-surface-variant)" }}>
            We'll keep sending you the best student perks every Monday.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-6 relative overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
      <div className="max-w-2xl mx-auto text-center relative">
        <ConfettiBurst active={status === "success"} />

        {status === "success" ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-12 relative z-20">
            <span className="text-6xl mb-6 block">🎉</span>
            <h2 className="font-fraunces text-3xl font-black mb-3" style={{ color: "var(--on-surface)" }}>
              You're in! Check your inbox soon.
            </h2>
            <p className="text-lg" style={{ color: "var(--on-surface-variant)" }}>
              We'll send you the best new student perks every Monday.
            </p>
          </motion.div>
        ) : (
          <>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: "var(--surface)" }}>
              <Mail size={24} style={{ color: "var(--primary)" }} />
            </div>

            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4" style={{ background: "var(--surface)", color: "var(--primary)" }}>
              5,000+ students subscribed
            </span>

            <h2 className="font-fraunces text-3xl md:text-4xl font-black mb-3" style={{ color: "var(--on-surface)" }}>
              Join 5,000+ students getting weekly perk alerts
            </h2>
            <p className="text-base mb-8 max-w-md mx-auto" style={{ color: "var(--on-surface-variant)" }}>
              New free tools, expiring offers, and hidden gems — every Monday.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="email"
                  placeholder="your@email.edu"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setValidationError(""); }}
                  disabled={status === "loading"}
                  className={`w-full px-5 py-3.5 rounded-full border-[1.5px] text-sm font-medium focus:outline-none focus:ring-2 transition-all ${
                    shake ? "animate-[shake_0.4s_ease]" : ""
                  } ${validationError ? "border-red-400 focus:ring-red-200" : "focus:ring-[#16A34A]/30 focus:border-[#16A34A]"}`}
                  style={{ background: "var(--surface)", borderColor: validationError ? "#f87171" : "var(--outline)", color: "var(--on-surface)" }}
                />
                {validationError && (
                  <p className="absolute -bottom-5 left-4 text-[11px] font-medium text-red-500">{validationError}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="px-8 py-3.5 rounded-full bg-gradient-to-br from-[#004AC6] to-[#2563EB] text-white font-bold text-sm shadow-lg shadow-blue-500/20 hover:scale-105 transition-transform flex items-center justify-center gap-2 disabled:opacity-60 disabled:hover:scale-100 shrink-0"
              >
                {status === "loading" ? (
                  <><Loader2 size={16} className="animate-spin" /> Subscribing...</>
                ) : (
                  <><ArrowRight size={16} /> Subscribe Free</>
                )}
              </button>
            </form>

            {status === "error" && (
              <p className="text-sm font-medium text-red-500 mt-4">Something went wrong. Try again.</p>
            )}

            <p className="text-xs mt-6" style={{ color: "var(--on-surface-variant)" }}>
              No spam. Unsubscribe anytime. We respect your inbox.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
