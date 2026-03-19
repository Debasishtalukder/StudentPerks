import React from "react";
import { motion } from "motion/react";
import { ArrowRight, Star, Banknote, GraduationCap, Mail, ShieldCheck } from "lucide-react";
import { Perk, COUNTRIES } from "../data/perks";
import LogoImage from "./LogoImage";

interface PerkCardProps {
  perk: Perk;
}

const PerkCard: React.FC<PerkCardProps> = ({ perk }) => {
  const countryFlags = perk.countries
    .map((code) => COUNTRIES.find((c) => c.code === code)?.flag)
    .filter(Boolean)
    .slice(0, 3);

  const getEligibilityBadge = (eligibility: string) => {
    switch (eligibility) {
      case "University Only":
        return (
          <div className="bg-[#F59E0B]/10 text-[#B45309] px-3 py-1 rounded-full text-[13px] font-bold flex items-center gap-1.5 w-fit mb-4 border border-[#F59E0B]/20">
            <GraduationCap size={16} className="text-[#F59E0B]" /> University Only
          </div>
        );
      case ".edu Email Required":
        return (
          <div className="bg-[#3B82F6]/10 text-[#1D4ED8] px-3 py-1 rounded-full text-[13px] font-bold flex items-center gap-1.5 w-fit mb-4 border border-[#3B82F6]/20">
            <Mail size={16} className="text-[#3B82F6]" /> .edu Email Required
          </div>
        );
      case "Any Student":
      default:
        return (
          <div className="bg-[#16A34A]/10 text-[#15803D] px-3 py-1 rounded-full text-[13px] font-bold flex items-center gap-1.5 w-fit mb-4 border border-[#16A34A]/20">
            <ShieldCheck size={16} className="text-[#16A34A]" /> Any Student
          </div>
        );
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, filter: "brightness(1.05)" }}
      transition={{ duration: 0.3 }}
      onClick={() => window.open(perk.url, '_blank', 'noopener,noreferrer')}
      className="perk-card bg-white rounded-2xl p-6 border border-transparent hover:border-[#2563EB]/20 border-l-[3px] border-l-transparent hover:border-l-[#2563EB] transition-all duration-300 relative group shadow-[0_32px_64px_-12px_rgba(28,27,27,0.04)] overflow-hidden cursor-pointer"
    >
      {perk.featured && (
        <div className="absolute top-0 right-0 bg-[#FFDDB8] text-[#653E00] px-3 py-1.5 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm z-10 border-l border-b border-orange-200/50">
          <Star size={12} fill="currentColor" /> Featured
        </div>
      )}

      <div className="w-16 h-16 mb-4 bg-[#F6F3F2] flex items-center justify-center rounded-2xl p-3 shadow-inner overflow-hidden">
        <LogoImage 
          domain={perk.domain} 
          name={perk.company} 
          className="w-full h-full group-hover:scale-110 transition-transform duration-300" 
        />
      </div>

      {getEligibilityBadge(perk.eligibility)}

      <div className="flex items-center gap-2 mb-3">
        <span className="bg-blue-50 text-[#004AC6] text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-tight">
          {perk.category}
        </span>
        <span className="text-xs flex gap-1">
          {countryFlags.join(" ")}
          {perk.countries.length > 3 && "🌍"}
        </span>
      </div>

      <h3 className="font-bold text-xl leading-tight mb-2 text-[#1C1B1B]">{perk.title}</h3>
      <p className="text-sm text-[#434655] mb-5 font-medium leading-relaxed">
        {perk.description}
      </p>

      <div className="flex flex-col gap-2.5 mb-6">
        <div className="bg-[#7CF994]/20 text-[#002109] px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5">
          <Banknote size={16} className="text-emerald-600" />
          {perk.savings}
        </div>
      </div>

      <div className="inline-flex items-center text-[#004AC6] font-black text-sm transition-all">
        Get Offer <ArrowRight size={16} className="ml-1 transition-transform duration-300 ease-out group-hover:translate-x-1" />
      </div>
    </motion.div>
  );
};

export default PerkCard;
