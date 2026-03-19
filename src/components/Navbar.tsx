import { motion } from "motion/react";
import { GraduationCap } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#FCF9F8]/80 backdrop-blur-xl border-b border-black/5">
      <div className="flex justify-between items-center px-6 py-4 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="grid grid-cols-2 gap-1 w-6 h-6 items-center justify-center">
            <div className="w-[10px] h-[10px] bg-[#2563EB] rounded-full"></div>
            <div className="w-[6px] h-[6px] bg-[#2563EB] rounded-full justify-self-center"></div>
            <div className="w-[6px] h-[6px] bg-[#2563EB] rounded-full justify-self-center"></div>
            <div className="w-[10px] h-[10px] bg-[#111111] rounded-full"></div>
          </div>
          <span className="text-xl font-bold tracking-tight text-[#1C1B1B]">
            StudentPerks<span className="text-[#2563EB]">.io</span>
          </span>
        </div>

        <div className="flex items-center gap-6">
          <a 
            href="#" 
            className="hidden md:block text-sm font-semibold text-[#434655] hover:text-[#004AC6] transition-colors"
          >
            Submit a Deal
          </a>
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
  );
}
