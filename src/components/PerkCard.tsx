import React from "react";
import { ArrowRight, Star, ShieldCheck, GraduationCap, Github, Fingerprint, Sparkles, Globe, Clock, Bookmark, Share2, ThumbsUp, BadgeCheck, Scale } from "lucide-react";
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

const ELIG_ICONS: Record<string, { icon: React.ReactNode; color: string }> = {
  "Any Student": { icon: <ShieldCheck size={12} />, color: "#16A34A" },
  "University Only": { icon: <GraduationCap size={12} />, color: "#D97706" },
  "GitHub Pack": { icon: <Github size={12} />, color: "#6E40C9" },
  "SheerID": { icon: <Fingerprint size={12} />, color: "#DB2777" },
  "UNiDAYS": { icon: <Sparkles size={12} />, color: "#7C3AED" },
  "Student Beans": { icon: <Sparkles size={12} />, color: "#0891B2" },
  "Age Restricted": { icon: <Clock size={12} />, color: "#EA580C" },
  "US Only": { icon: <Globe size={12} />, color: "#2563EB" },
};

// Extract dollar value from savings string
function extractValue(savings: string): string {
  const match = savings.match(/\$[\d,]+/);
  return match ? match[0] + "/yr" : "Free";
}

function getOfferType(savings: string): string {
  const lower = savings.toLowerCase();
  if (lower.includes("free") || lower.includes("100%")) return "Free";
  if (lower.includes("off") || lower.includes("discount")) return "Discount";
  if (lower.includes("credit")) return "Credits";
  return "Free";
}

const PerkCard: React.FC<PerkCardProps> = ({ perk, index, isVisible, isClaimed, onClaim, votes, hasVoted, onVote, onShare, onOfferClick, isTrending, isSaved, onToggleSaved, isComparing, onToggleCompare, canCompare }) => {
  const staggerDelay = Math.min(index * 50, 400);
  const elig = ELIG_ICONS[perk.eligibility] || ELIG_ICONS["Any Student"];
  const value = extractValue(perk.savings);
  const offerType = getOfferType(perk.savings);

  return (
    <div
      className={`perk-card ${isVisible ? "perk-card--visible" : ""} ${perk.featured ? "perk-card--featured" : ""}`}
      style={{ transitionDelay: `${staggerDelay}ms` }}
      id={`perk-${perk.id}`}
    >
      {/* ─── Top-left badges ─── */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
        {perk.featured && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#f59e0b] text-white shadow-sm">
            <Star size={10} fill="currentColor" /> Featured
          </span>
        )}
        {perk.isNew && !perk.featured && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500 text-white shadow-sm">
            <span className="new-badge-dot" style={{ background: "#fff" }} /> NEW
          </span>
        )}
        {isTrending && !perk.featured && !perk.isNew && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FF6B35] text-white shadow-sm">
            🔥 Trending
          </span>
        )}
        {perk.expiringSoon && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-orange-500 text-white shadow-sm">
            ⏰ Expiring
          </span>
        )}
      </div>

      {/* ─── Top-right: share button ─── */}
      <button
        onClick={(e) => { e.stopPropagation(); onShare(perk); }}
        className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all hover:scale-110 hover:shadow-md"
        style={{ background: "rgba(255,255,255,0.8)", color: "#666", backdropFilter: "blur(4px)" }}
        title="Share"
      >
        <Share2 size={13} />
      </button>

      {/* ─── Logo ─── */}
      <div className="flex justify-center mt-6 mb-4">
        <div className="w-[52px] h-[52px] rounded-full bg-white flex items-center justify-center shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden p-2.5">
          <LogoImage domain={perk.domain} name={perk.company} className="w-full h-full perk-card__logo" eager={index < 8} />
        </div>
      </div>

      {/* ─── Name + Category + Verified ─── */}
      <div className="text-center mb-3 px-2">
        <h3 className="font-bold text-[17px] leading-tight mb-1.5" style={{ color: "#1a1a1a" }}>{perk.title}</h3>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--primary)" }}>
            {perk.category}
          </span>
          {perk.verified && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600">
              <BadgeCheck size={10} /> 2026
            </span>
          )}
        </div>
      </div>

      {/* ─── Description ─── */}
      <p className="text-[13px] leading-relaxed text-center mb-4 px-3 line-clamp-2" style={{ color: "#666" }}>
        {perk.description}
      </p>

      {/* ─── Stats row (3 columns with dividers) ─── */}
      <div className="flex items-center mx-3 mb-4 rounded-xl overflow-hidden" style={{ background: "rgba(0,0,0,0.02)" }}>
        <div className="flex-1 py-2.5 text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <span style={{ color: elig.color }}>{elig.icon}</span>
          </div>
          <p className="text-[10px] font-semibold" style={{ color: "#555" }}>{perk.eligibility}</p>
        </div>
        <div className="w-px h-8" style={{ background: "rgba(0,0,0,0.08)" }} />
        <div className="flex-1 py-2.5 text-center">
          <p className="text-sm font-black text-emerald-600">{value}</p>
          <p className="text-[10px] font-medium" style={{ color: "#888" }}>Value</p>
        </div>
        <div className="w-px h-8" style={{ background: "rgba(0,0,0,0.08)" }} />
        <div className="flex-1 py-2.5 text-center">
          <p className="text-xs font-bold" style={{ color: "#333" }}>{offerType}</p>
          <p className="text-[10px] font-medium" style={{ color: "#888" }}>Type</p>
        </div>
      </div>

      {/* ─── Bottom row: Get Offer + Bookmark ─── */}
      <div className="flex items-center gap-2 px-3 pb-1 mt-auto">
        <button
          onClick={(e) => { e.stopPropagation(); onOfferClick(perk); }}
          className="perk-card__cta flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-sm font-bold transition-all hover:bg-black/10"
          style={{ background: "rgba(0,0,0,0.05)", color: "#1a1a1a" }}
        >
          Get Offer <ArrowRight size={14} className="perk-card__arrow" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleSaved(perk.id); }}
          className="w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-105 shrink-0"
          style={{
            background: isSaved ? "#DCFCE7" : "white",
            border: isSaved ? "1.5px solid #86EFAC" : "1.5px solid rgba(0,0,0,0.08)",
            color: isSaved ? "#16A34A" : "#999",
          }}
          title={isSaved ? "Saved!" : "Save"}
        >
          <Bookmark size={15} fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>

      {/* ─── Micro actions row (upvote, claim, compare) ─── */}
      <div className="flex items-center justify-center gap-3 px-3 pt-2 pb-3">
        <button
          onClick={(e) => { e.stopPropagation(); onVote(perk.id); }}
          className="flex items-center gap-1 text-[11px] font-semibold transition-all hover:opacity-70"
          style={{ color: hasVoted ? "var(--primary)" : "#aaa" }}
        >
          <ThumbsUp size={11} fill={hasVoted ? "currentColor" : "none"} />
          {votes > 0 && votes}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onClaim(perk.id); }}
          className="text-[11px] font-semibold transition-all hover:opacity-70"
          style={{ color: isClaimed ? "#16A34A" : "#aaa" }}
        >
          {isClaimed ? "✓ Claimed" : "Claim"}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleCompare(perk.id); }}
          disabled={!canCompare && !isComparing}
          className="flex items-center gap-0.5 text-[11px] font-semibold transition-all hover:opacity-70 disabled:opacity-30"
          style={{ color: isComparing ? "var(--primary)" : "#aaa" }}
        >
          <Scale size={10} /> Compare
        </button>
      </div>
    </div>
  );
};

export default React.memo(PerkCard);
