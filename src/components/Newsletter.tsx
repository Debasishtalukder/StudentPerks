import { useState, useEffect, useRef } from "react";
import type { FormEvent } from "react";
import { Mail, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

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
        x: canvas.offsetWidth / 2,
        y: canvas.offsetHeight / 2,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12 - 4,
        size: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
      });
    }

    let frame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      let alive = false;
      for (const p of particles) {
        if (p.life <= 0) continue;
        alive = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15;
        p.life -= 0.015;
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
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

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubmitting(true);
    // Placeholder endpoint — swap with Mailchimp/ConvertKit embed URL
    // Example: await fetch("https://api.convertkit.com/v3/forms/YOUR_FORM_ID/subscribe", { method: "POST", ... })
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    setSubscribed(true);
  };

  return (
    <section className="py-24 px-6 relative overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
      <div className="max-w-2xl mx-auto text-center relative">
        <ConfettiBurst active={subscribed} />

        {subscribed ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-12 relative z-20"
          >
            <span className="text-6xl mb-6 block">🎉</span>
            <h2 className="font-fraunces text-3xl font-black mb-3" style={{ color: "var(--on-surface)" }}>
              You're in! Check your email
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
              <input
                type="email"
                placeholder="your@email.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-5 py-3.5 rounded-full border-[1.5px] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                style={{ background: "var(--surface)", borderColor: "var(--outline)", color: "var(--on-surface)" }}
              />
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3.5 rounded-full bg-gradient-to-br from-[#004AC6] to-[#2563EB] text-white font-bold text-sm shadow-lg shadow-blue-500/20 hover:scale-105 transition-transform flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {submitting ? "Subscribing..." : <><ArrowRight size={16} /> Subscribe Free</>}
              </button>
            </form>

            <p className="text-xs mt-4" style={{ color: "var(--on-surface-variant)" }}>
              No spam. Unsubscribe anytime. We respect your inbox.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
