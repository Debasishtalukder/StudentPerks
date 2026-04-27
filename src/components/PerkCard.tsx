import React from "react";
import { ArrowRight, Star, Banknote, GraduationCap, ShieldCheck, Github, Fingerprint, Sparkles, Globe, Clock, Bookmark, Share2, ThumbsUp, BadgeCheck, Scale } from "lucide-react";
import { Perk, COUNTRIES } from "../data/perks";
import LogoImage from "./LogoImage";

interface PerkCardProps {
  perk: Perk;
  index: number;
  isVisible: boolean;
  isClaimed: boolean;
  onClaim: (id: string) => void;
  votes: number;
  hasVoted: boolean;
  onVote: (id: string) => void;
  onShare: (perk: Perk) => void;
  onOfferClick: (perk: Perk) => void;
  isTrending: boolean;
  isSaved: boolean;
  onToggleSaved: (id: string) => void;
  isComparing: boolean;
  onToggleCompare: (id: string) => void;
  canCompare: boolean;
}

const BADGE_MAP: Record<string, { bg: string; text: string; border: string; iconColor: string; icon: React.ReactNode; label: string }> = {
  "Any Student": { bg: "bg-[#16A34A]/10", text: "text-[#15803D]", border: "border-[#16A34A]/20", iconColor: "text-[#16A34A]", icon: <ShieldCheck size={14} />, label: "Any Student" },
  "University Only": { bg: "bg-[#F59E0B]/10", text: "text-[#B45309]", border: "border-[#F59E0B]/20", iconColor: "text-[#F59E0B]", icon: <GraduationCap size={14} />, label: "University Only" },
  "GitHub Pack": { bg: "bg-[#6E40C9]/10", text: "text-[#5B21B6]", border: "border-[#6E40C9]/20", iconColor: "text-[#6E40C9]", icon: <Github size={14} />, label: "GitHub Pack" },
  "SheerID": { bg: "bg-[#EC4899]/10", text: "text-[#BE185D]", border: "border-[#EC4899]/20", iconColor: "text-[#EC4899]", icon: <Fingerprint size={14} />, label: "SheerID" },
  "UNiDAYS": { bg: "bg-[#8B5CF6]/10", text: "text-[#6D28D9]", border: "border-[#8B5CF6]/20", iconColor: "text-[#8B5CF6]", icon: <Sparkles size={14} />, label: "UNiDAYS" },
  "Student Beans": { bg: "bg-[#06B6D4]/10", text: "text-[#0E7490]", border: "border-[#06B6D4]/20", iconColor: "text-[#06B6D4]", icon: <Sparkles size={14} />, label: "Student Beans" },
  "Age Restricted": { bg: "bg-[#F97316]/10", text: "text-[#C2410C]", border: "border-[#F97316]/20", iconColor: "text-[#F97316]", icon: <Clock size={14} />, label: "Age Restricted" },
  "US Only": { bg: "bg-[#3B82F6]/10", text: "text-[#1D4ED8]", border: "border-[#3B82F6]/20", iconColor: "text-[#3B82F6]", icon: <Globe size={14} />, label: "US Only" },
};

const PerkCard: React.FC<PerkCardProps> = ({ perk, index, isVisible, isClaimed, onClaim, votes, hasVoted, onVote, onShare, onOfferClick, isTrending, isSaved, onToggleSaved, isComparing, onToggleCompare, canCompare }) => {
  const countryFlags = perk.countries.map((code) => COUNTRIES.find((c) => c.code === code)?.flag).filter(Boolean).slice(0, 3);
  const badge = BADGE_MAP[perk.eligibility] || BADGE_MAP["Any Student"];
  // Cap stagger at 400ms so cards far down the list don't wait forever
  const staggerDelay = Math.min(index * 50, 400);

  return (
    <div
      className={`perk-card ${isVisible ? "perk-card--visible" : ""} ${perk.featured ? "perk-card--featured" : ""}`}
      style={{ transitionDelay: `${staggerDelay}ms` }}
      id={`perk-${perk.id}`}
    >
      {/* Top-right badges */}
      <div className="absolute top-0 right-0 flex items-center z-10">
        {perk.expiringSoon && (
          <span className="bg-orange-500 text-white px-2.5 py-1 text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
            ⏰ Expiring Soon
          </span>
        )}
        {isTrending && !perk.expiringSoon && (
          <span className="bg-[#FF6B35] text-white px-2.5 py-1 text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
            🔥 Trending
          </span>
        )}
        {perk.featured && !perk.expiringSoon && !isTrending && (
          <span className="bg-[#FFDDB8] text-[#653E00] px-2.5 py-1.5 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1 border-l border-b border-orange-200/50">
            <Star size={12} fill="currentColor" /> Featured
          </span>
        )}
        {perk.isNew && !perk.featured && !perk.expiringSoon && !isTrending && (
          <span className="bg-[#DCFCE7] text-[#166534] px-2.5 py-1.5 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1 border-l border-b border-green-200/50">
            <span className="new-badge-dot mr-0.5" /> NEW
          </span>
        )}
      </div>

      {/* Action buttons row */}
      <div className="absolute top-2 left-2 flex items-center gap-1 z-10">
        <button
          onClick={(e) => { e.stopPropagation(); onToggleSaved(perk.id); }}
          className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{
            background: isSaved ? "#7CF994" : "var(--bg-secondary)",
            color: isSaved ? "#002109" : "var(--on-surface-variant)",
          }}
          title={isSaved ? "Saved!" : "Save this perk"}
        >
          <Bookmark size={12} fill={isSaved ? "currentColor" : "none"} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onShare(perk); }}
          className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{ background: "var(--bg-secondary)", color: "var(--on-surface-variant)" }}
          title="Share this perk"
        >
          <Share2 size={12} />
        </button>
      </div>

      {/* Logo */}
      <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-2xl p-3 shadow-inner overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
        <LogoImage domain={perk.domain} name={perk.company} className="w-full h-full perk-card__logo" eager={index < 8} />
      </div>

      {/* Eligibility + Verified */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div className={`${badge.bg} ${badge.text} px-3 py-1 rounded-full text-[13px] font-bold flex items-center gap-1.5 border ${badge.border}`}>
          <span className={badge.iconColor}>{badge.icon}</span> {badge.label}
        </div>
        {perk.verified && (
          <div className="group/verified relative">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
              <BadgeCheck size={11} /> Verified 2026
            </span>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg text-[11px] font-medium text-white bg-[#1C1B1B] whitespace-nowrap opacity-0 group-hover/verified:opacity-100 transition-opacity pointer-events-none shadow-lg">
              We verified this offer is active as of 2026
            </div>
          </div>
        )}
      </div>

      {/* Category + flags */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-tight" style={{ background: "var(--bg-secondary)", color: "var(--primary)" }}>
          {perk.category}
        </span>
        <span className="text-xs flex gap-1">{countryFlags.join(" ")}{perk.countries.length > 3 && "🌍"}</span>
      </div>

      <h3 className="font-bold text-xl leading-tight mb-2" style={{ color: "var(--on-surface)" }}>{perk.title}</h3>
      <p className="text-sm mb-5 font-medium leading-relaxed line-clamp-3" style={{ color: "var(--on-surface-variant)" }}>
        {perk.description}
      </p>

      {/* Savings */}
      <div className="mb-4">
        <div className="px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5" style={{ background: "var(--savings-bg)", color: "#002109" }}>
          <Banknote size={16} className="text-emerald-600 shrink-0" />
          <span className="truncate">{perk.savings}</span>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="flex items-center justify-between mt-auto">
        <button
          onClick={(e) => { e.stopPropagation(); onOfferClick(perk); }}
          className="perk-card__cta inline-flex items-center font-black text-sm"
        >
          Get Offer <ArrowRight size={16} className="ml-1 perk-card__arrow" />
        </button>

        <div className="flex items-center gap-2">
          {/* Upvote */}
          <button
            onClick={(e) => { e.stopPropagation(); onVote(perk.id); }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all hover:scale-105"
            style={{
              background: hasVoted ? "rgba(37,99,235,0.1)" : "var(--bg-secondary)",
              color: hasVoted ? "var(--primary)" : "var(--on-surface-variant)",
            }}
          >
            <ThumbsUp size={12} fill={hasVoted ? "currentColor" : "none"} />
            {votes > 0 && <span>{votes}</span>}
          </button>

          {/* Claim */}
          <button
            onClick={(e) => { e.stopPropagation(); onClaim(perk.id); }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all hover:scale-105"
            style={{
              background: isClaimed ? "rgba(124,249,148,0.2)" : "var(--bg-secondary)",
              color: isClaimed ? "#15803D" : "var(--on-surface-variant)",
            }}
            title={isClaimed ? "Claimed!" : "Mark as claimed"}
          >
            {isClaimed ? "✓ Claimed" : "Claim"}
          </button>

          {/* Compare */}
          <button
            onClick={(e) => { e.stopPropagation(); onToggleCompare(perk.id); }}
            disabled={!canCompare && !isComparing}
            className="flex items-center gap-1 px-2 py-1.5 rounded-full text-xs font-bold transition-all hover:scale-105 disabled:opacity-30 disabled:hover:scale-100"
            style={{
              background: isComparing ? "rgba(37,99,235,0.15)" : "var(--bg-secondary)",
              color: isComparing ? "var(--primary)" : "var(--on-surface-variant)",
            }}
            title={isComparing ? "Remove from comparison" : canCompare ? "Add to compare" : "Max 3 tools"}
          >
            <Scale size={11} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PerkCard);
