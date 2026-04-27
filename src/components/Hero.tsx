import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";
import LogoImage from "./LogoImage";

// ─── Animated counter ───
function AnimatedCounter({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 2000;
          const start = performance.now();
          const step = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, hasAnimated]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

// ─── Floating icon grid ───
const LEFT_ICONS = [
  { domain: "jetbrains.com", name: "JetBrains", x: "8%", y: "15%", delay: 0 },
  { domain: "figma.com", name: "Figma", x: "3%", y: "35%", delay: 0.3 },
  { domain: "notion.so", name: "Notion", x: "12%", y: "52%", delay: 0.6 },
  { domain: "spotify.com", name: "Spotify", x: "5%", y: "70%", delay: 0.9 },
  { domain: "apple.com", name: "Apple", x: "15%", y: "85%", delay: 1.2 },
  { domain: "amazon.com", name: "Amazon", x: "18%", y: "25%", delay: 0.15 },
  { domain: "adobe.com", name: "Adobe", x: "20%", y: "45%", delay: 0.45 },
  { domain: "github.com", name: "GitHub", x: "22%", y: "65%", delay: 0.75 },
  { domain: "google.com", name: "Google", x: "10%", y: "92%", delay: 1.05 },
  { domain: "openai.com", name: "OpenAI", x: "24%", y: "10%", delay: 1.35 },
];

const RIGHT_ICONS = [
  { domain: "cursor.com", name: "Cursor", x: "78%", y: "12%", delay: 0.1 },
  { domain: "canva.com", name: "Canva", x: "85%", y: "30%", delay: 0.4 },
  { domain: "slack.com", name: "Slack", x: "76%", y: "48%", delay: 0.7 },
  { domain: "aws.amazon.com", name: "AWS", x: "88%", y: "55%", delay: 1.0 },
  { domain: "azure.microsoft.com", name: "Azure", x: "80%", y: "72%", delay: 1.3 },
  { domain: "vercel.com", name: "Vercel", x: "74%", y: "88%", delay: 0.2 },
  { domain: "mongodb.com", name: "MongoDB", x: "90%", y: "18%", delay: 0.5 },
  { domain: "linear.app", name: "Linear", x: "82%", y: "42%", delay: 0.8 },
  { domain: "loom.com", name: "Loom", x: "92%", y: "75%", delay: 1.1 },
  { domain: "discord.com", name: "Discord", x: "76%", y: "95%", delay: 1.4 },
];

function FloatingIcon({ domain, name, x, y, delay }: { domain: string; name: string; x: string; y: string; delay: number; key?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 + delay * 0.3, duration: 0.5, ease: "easeOut" }}
      className="absolute hidden lg:flex"
      style={{ left: x, top: y }}
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3 + delay, repeat: Infinity, ease: "easeInOut" }}
        className="w-12 h-12 rounded-xl flex items-center justify-center p-2.5 border opacity-40 hover:opacity-80 transition-opacity duration-300 cursor-pointer"
        style={{ background: "var(--surface)", borderColor: "var(--outline)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
        title={name}
      >
        <LogoImage domain={domain} name={name} className="w-full h-full" />
      </motion.div>
    </motion.div>
  );
}

// ─── Live student counter ───
function LiveCounter() {
  const [count, setCount] = useState(2847);
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => c + Math.floor(Math.random() * 3) + 1);
    }, 4000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="flex items-center justify-center gap-2 mb-6"
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
      </span>
      <span className="text-sm font-medium" style={{ color: "var(--on-surface-variant)" }}>
        <motion.span
          key={count}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="inline-block font-bold tabular-nums"
          style={{ color: "var(--on-surface)" }}
        >
          {count.toLocaleString()}
        </motion.span>
        {" "}students saving money right now
      </span>
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section className="relative pt-36 pb-20 px-6 overflow-hidden min-h-[85vh] flex flex-col items-center justify-center">
      {/* Subtle dot grid background */}
      <div className="absolute inset-0 dot-grid -z-10 opacity-40" />

      {/* Subtle radial glow in center */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(37,99,235,0.03) 0%, transparent 70%)",
        }}
      />

      {/* Floating icons — left side */}
      {LEFT_ICONS.map((icon) => (
        <FloatingIcon key={icon.domain} {...icon} />
      ))}

      {/* Floating icons — right side */}
      {RIGHT_ICONS.map((icon) => (
        <FloatingIcon key={icon.domain} {...icon} />
      ))}

      {/* Center content */}
      <div className="max-w-3xl w-full relative z-10 text-center">
        {/* Pill badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-semibold mb-10"
          style={{ background: "var(--filter-bg)", color: "var(--on-surface-variant)" }}
        >
          <span style={{ color: "var(--primary)" }}>✦</span>
          150+ Free & Discounted Offers
        </motion.div>

        {/* Live counter */}
        <LiveCounter />

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="font-fraunces text-5xl sm:text-6xl md:text-[5.5rem] font-black leading-[1.05] tracking-tight mb-6"
          style={{ color: "var(--on-surface)" }}
        >
          Your Student ID is
          <br />
          <span className="italic" style={{ color: "var(--primary)" }}>
            Worth Thousands.
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="font-dm-sans text-base md:text-lg max-w-lg mx-auto mb-14 leading-relaxed font-normal"
          style={{ color: "var(--on-surface-variant)" }}
        >
          Discover free tools, subscriptions, and discounts unlocked by your college email — filtered by your country.
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex justify-center gap-12 md:gap-16 mb-14"
        >
          {[
            { target: 2500, prefix: "$", suffix: "+", label: "saved/yr" },
            { target: 150, suffix: "+", label: "offers" },
            { target: 50, suffix: "+", label: "countries" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-black tabular-nums" style={{ color: "var(--on-surface)" }}>
                <AnimatedCounter target={stat.target} prefix={stat.prefix || ""} suffix={stat.suffix || ""} />
              </span>
              <span className="text-xs font-medium mt-1 tracking-wide" style={{ color: "var(--on-surface-variant)" }}>
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* CTA button */}
        <motion.a
          href="#explore"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2.5 px-9 py-4 rounded-full bg-gradient-to-br from-[#004AC6] to-[#2563EB] text-white font-bold text-base shadow-xl shadow-blue-500/15 transition-shadow hover:shadow-2xl hover:shadow-blue-500/25"
        >
          Explore Free Perks
          <ArrowDown size={18} strokeWidth={2.5} />
        </motion.a>
      </div>

      {/* Brand marquee */}
      <div className="mt-28 w-full marquee-container relative z-10">
        <div className="marquee-track py-8">
          {[...Array(4)].map((_, i) => (
            <React.Fragment key={i}>
              {[
                "github.com", "cursor.com", "jetbrains.com", "figma.com", "notion.so",
                "spotify.com", "apple.com", "amazon.com", "adobe.com", "google.com",
                "openai.com", "grammarly.com", "cloudflare.com", "nordvpn.com",
                "1password.com", "doordash.com", "samsung.com", "nike.com",
                "nytimes.com", "hulu.com", "mongodb.com", "digitalocean.com",
              ].map((domain) => (
                <div
                  key={`${domain}-${i}`}
                  className="flex items-center gap-3 px-10 grayscale opacity-30 hover:grayscale-0 hover:opacity-90 transition-all duration-300 cursor-pointer"
                >
                  <div
                    className="w-9 h-9 rounded-lg p-1.5 border"
                    style={{ background: "var(--surface)", borderColor: "var(--outline)" }}
                  >
                    <LogoImage domain={domain} className="w-full h-full" />
                  </div>
                  <span
                    className="text-xs font-bold tracking-[0.15em] uppercase"
                    style={{ color: "var(--on-surface-variant)" }}
                  >
                    {domain.split(".")[0]}
                  </span>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
