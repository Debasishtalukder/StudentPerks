import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

export default function CommunitySavings() {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const TARGET = 12847293;

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 2500;
          const start = performance.now();
          const step = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * TARGET));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  // Slow increment after initial animation
  useEffect(() => {
    if (!hasAnimated) return;
    const interval = setInterval(() => {
      setCount((c) => c + Math.floor(Math.random() * 50) + 10);
    }, 3000);
    return () => clearInterval(interval);
  }, [hasAnimated]);

  return (
    <section ref={ref} className="py-24 px-6 text-center" style={{ background: "var(--bg)" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto"
      >
        <p className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: "var(--on-surface-variant)" }}>
          Together, students have saved
        </p>
        <p className="font-fraunces text-6xl md:text-8xl font-black text-[#16A34A] mb-3 tabular-nums">
          ${count.toLocaleString()}
        </p>
        <p className="text-xl font-medium mb-6" style={{ color: "var(--on-surface-variant)" }}>
          and counting...
        </p>
        <p className="text-sm" style={{ color: "var(--on-surface-variant)" }}>
          Based on <strong style={{ color: "var(--on-surface)" }}>5,200+</strong> students using StudentPerks.fun
        </p>
      </motion.div>
    </section>
  );
}
