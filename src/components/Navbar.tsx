import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { GraduationCap } from "lucide-react";

interface NavbarProps {
  onStartHere: () => void;
  onSubmitPerk: () => void;
}

export default function Navbar({ onStartHere, onSubmitPerk }: NavbarProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
      setScrolled(scrollTop > 20);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      <nav
        className={`fixed top-0 w-full z-50 backdrop-blur-xl border-b transition-all duration-300 ${scrolled ? "navbar-scrolled" : ""}`}
        style={{ backgroundColor: "var(--navbar-bg)", borderColor: "var(--outline)" }}
      >
        <div className="flex justify-between items-center responsive-px py-4 w-full">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="StudentPerks" width={32} height={32} className="w-8 h-8" />
            <span className="text-xl font-bold tracking-tight" style={{ color: "var(--on-surface)" }}>
              StudentPerks<span style={{ color: "var(--primary-container)" }}>.fun</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onStartHere}
              className="hidden md:flex items-center gap-1.5 text-sm font-bold transition-colors hover:opacity-80"
              style={{ color: "var(--primary)" }}
            >
              Start Here 🚀
            </button>
            <a
              href="/blog"
              className="hidden md:block text-sm font-semibold transition-colors hover:opacity-80"
              style={{ color: "var(--on-surface-variant)" }}
            >
              Blog
            </a>
            <button
              onClick={onSubmitPerk}
              className="hidden md:block text-sm font-semibold transition-colors hover:opacity-80 cursor-pointer"
              style={{ color: "var(--on-surface-variant)" }}
            >
              Submit a Deal
            </button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#7CF994] text-[#002109] rounded-full text-xs font-bold tracking-wide shadow-sm"
            >
              <GraduationCap size={16} />
              FOR STUDENTS
            </motion.button>
          </div>
        </div>
      </nav>
    </>
  );
}
