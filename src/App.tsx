import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUp } from "lucide-react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FilterBar from "./components/FilterBar";
import PerkCard from "./components/PerkCard";
import IconGrid from "./components/IconGrid";
import SavingsCalculator from "./components/SavingsCalculator";
import StartHereModal from "./components/StartHereModal";
import Newsletter from "./components/Newsletter";
import ClaimTracker from "./components/ClaimTracker";
import SubmitPerkModal from "./components/SubmitPerkModal";
import CommunitySavings from "./components/CommunitySavings";
import SocialProof from "./components/SocialProof";
import CompareBar from "./components/CompareBar";
import CompareModal from "./components/CompareModal";
import { AdvertiseModal, ApiAccessModal, BrandAssetsModal } from "./components/FooterModals";
import { PERKS, COUNTRIES, CATEGORIES } from "./data/perks";
import type { Perk } from "./data/perks";
import { buildTrackedUrl } from "./data/affiliates";

// ─── localStorage helpers ───
function loadSet(key: string): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(key) || "[]")); } catch { return new Set(); }
}
function saveSet(key: string, s: Set<string>) {
  localStorage.setItem(key, JSON.stringify([...s]));
}
function loadVotes(): Record<string, number> {
  try { return JSON.parse(localStorage.getItem("sp_votes") || "{}"); } catch { return {}; }
}
function saveVotes(v: Record<string, number>) {
  localStorage.setItem("sp_votes", JSON.stringify(v));
}

// ─── Windowed Intersection Observer ───
// Tracks which card wrappers are near the viewport.
// Cards near viewport get full PerkCard; far-away ones get a lightweight placeholder.
function useWindowedCards(buffer: number = 10) {
  const [nearIds, setNearIds] = useState<Set<string>>(new Set());
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const nodeMap = useRef<Map<string, Element>>(new Map());

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        let changed = false;
        const entering = new Set<string>();
        const leaving = new Set<string>();

        entries.forEach((entry) => {
          const id = entry.target.getAttribute("data-perk-id");
          if (!id) return;
          if (entry.isIntersecting) {
            entering.add(id);
            changed = true;
          } else {
            leaving.add(id);
            changed = true;
          }
        });

        if (changed) {
          setNearIds((prev) => {
            const next = new Set(prev);
            entering.forEach((id) => next.add(id));
            leaving.forEach((id) => next.delete(id));
            return next;
          });
          // Once revealed, stay revealed (for fade-in animation — don't re-hide)
          if (entering.size > 0) {
            setRevealedIds((prev) => {
              const next = new Set(prev);
              entering.forEach((id) => next.add(id));
              return next;
            });
          }
        }
      },
      {
        // Large rootMargin: detect cards 300px before they enter viewport
        rootMargin: "300px 0px 300px 0px",
        threshold: 0,
      }
    );
    return () => { observerRef.current?.disconnect(); };
  }, []);

  const observe = useCallback((id: string, el: HTMLDivElement | null) => {
    if (!observerRef.current) return;
    const prev = nodeMap.current.get(id);
    if (prev) observerRef.current.unobserve(prev);
    if (el) { nodeMap.current.set(id, el); observerRef.current.observe(el); }
    else nodeMap.current.delete(id);
  }, []);

  const reset = useCallback(() => {
    setNearIds(new Set());
    setRevealedIds(new Set());
  }, []);

  return { nearIds, revealedIds, observe, reset };
}

// ─── Skeleton card ───
function SkeletonCard() {
  return (
    <div className="rounded-2xl p-6 h-[380px] flex flex-col" style={{ background: "var(--surface)" }}>
      <div className="skeleton w-16 h-16 rounded-2xl mb-4" />
      <div className="skeleton h-5 w-28 rounded-full mb-4" />
      <div className="flex gap-2 mb-3"><div className="skeleton h-4 w-16 rounded-full" /><div className="skeleton h-4 w-10 rounded-full" /></div>
      <div className="skeleton h-6 w-3/4 mb-2" />
      <div className="skeleton h-4 w-full mb-1" />
      <div className="skeleton h-4 w-2/3 mb-5" />
      <div className="skeleton h-10 w-full rounded-xl mb-3 mt-auto" />
      <div className="skeleton h-4 w-24" />
    </div>
  );
}

// Lightweight placeholder — same height as a card, no content
function CardPlaceholder() {
  return <div className="h-[380px] rounded-2xl" style={{ background: "var(--surface)", opacity: 0.3 }} />;
}

// ─── Offer Toast ───
function OfferToast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 4000); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="fixed bottom-6 right-6 z-[100] offer-toast">
      <div className="px-5 py-3 rounded-2xl shadow-2xl border flex items-center gap-3 bg-emerald-50 border-emerald-200 text-emerald-800">
        <span className="text-lg">✓</span>
        <span className="text-sm font-bold">{message}</span>
      </div>
    </div>
  );
}

// ─── Above-fold preload count ───
const PRELOAD_COUNT = 8;

export default function App() {
  // ─── Core state ───
  const [selectedCountry, setSelectedCountry] = useState("GLOBAL");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["All"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "error" | "info" } | null>(null);
  const [offerToast, setOfferToast] = useState<string | null>(null);
  const [startHereOpen, setStartHereOpen] = useState(false);
  const [submitPerkOpen, setSubmitPerkOpen] = useState(false);
  const [advertiseOpen, setAdvertiseOpen] = useState(false);
  const [apiAccessOpen, setApiAccessOpen] = useState(false);
  const [brandAssetsOpen, setBrandAssetsOpen] = useState(false);

  // ─── Compare tools ───
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const toggleCompare = useCallback((id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  }, []);

  // ─── Special filter (New / Expiring / Saved) ───
  const [specialFilter, setSpecialFilter] = useState<string | null>(null);

  // ─── Saved/bookmarked perks ───
  const [savedIds, setSavedIds] = useState<Set<string>>(() => loadSet("sp_saved"));
  const toggleSaved = useCallback((id: string) => {
    setSavedIds((prev) => {
      const next = new Set<string>(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      saveSet("sp_saved", next);
      return next;
    });
  }, []);

  // ─── Claim tracker ───
  const [claimedIds, setClaimedIds] = useState<Set<string>>(() => loadSet("sp_claimed"));
  const toggleClaim = useCallback((id: string) => {
    setClaimedIds((prev) => {
      const next = new Set<string>(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      saveSet("sp_claimed", next);
      return next;
    });
  }, []);

  // ─── Upvotes ───
  const [votes, setVotes] = useState<Record<string, number>>(() => loadVotes());
  const [votedIds, setVotedIds] = useState<Set<string>>(() => loadSet("sp_voted"));
  const toggleVote = useCallback((id: string) => {
    setVotedIds((prev) => {
      const next = new Set<string>(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      saveSet("sp_voted", next);
      return next;
    });
    setVotes((prev) => {
      const next = { ...prev };
      if (votedIds.has(id)) { next[id] = Math.max(0, (next[id] || 0) - 1); }
      else { next[id] = (next[id] || 0) + 1; }
      saveVotes(next);
      return next;
    });
  }, [votedIds]);

  const trendingIds = useMemo(() => {
    const entries = Object.entries(votes) as [string, number][];
    const sorted = entries.filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
    const cutoff = Math.max(1, Math.ceil(sorted.length * 0.1));
    return new Set(sorted.slice(0, cutoff).map(([id]) => id));
  }, [votes]);

  // ─── Windowed observer ───
  const { nearIds, revealedIds, observe, reset: resetWindow } = useWindowedCards();

  // ─── Filter transition (fast: no skeleton phase) ───
  const [gridPhase, setGridPhase] = useState<"entering" | "exiting">("entering");
  const phaseTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const [initialLoad, setInitialLoad] = useState(true);

  // Initial skeleton on first mount
  useEffect(() => {
    const t = setTimeout(() => setInitialLoad(false), 300);
    return () => clearTimeout(t);
  }, []);

  // On filter/search change: quick fade out → reset → fade in (no skeleton)
  const prevCountry = useRef(selectedCountry);
  const prevCategories = useRef(selectedCategories);
  const prevSearch = useRef(searchQuery);
  const prevSpecial = useRef(specialFilter);

  useEffect(() => {
    if (
      prevCountry.current === selectedCountry &&
      prevCategories.current === selectedCategories &&
      prevSearch.current === searchQuery &&
      prevSpecial.current === specialFilter
    ) return;

    prevCountry.current = selectedCountry;
    prevCategories.current = selectedCategories;
    prevSearch.current = searchQuery;
    prevSpecial.current = specialFilter;

    clearTimeout(phaseTimerRef.current);
    setGridPhase("exiting");

    phaseTimerRef.current = setTimeout(() => {
      resetWindow();
      setGridPhase("entering");
    }, 200);

    return () => clearTimeout(phaseTimerRef.current);
  }, [selectedCountry, selectedCategories, searchQuery, specialFilter, resetWindow]);

  // ─── Country detection ───
  useEffect(() => {
    const detectCountry = async () => {
      try {
        const res = await fetch("https://ipwho.is/");
        const data = await res.json();
        if (data?.success && data.country_code && COUNTRIES.some((c) => c.code === data.country_code)) {
          setSelectedCountry(data.country_code);
        } else if (data?.country) {
          setToast({ message: `Perks for ${data.country} coming soon! Showing Global perks.`, type: "info" });
          setTimeout(() => setToast(null), 6000);
        }
      } catch {
        setToast({ message: "Country detection failed. Defaulting to Global perks.", type: "error" });
        setTimeout(() => setToast(null), 6000);
      }
    };
    detectCountry();
    const onScroll = () => setShowScrollTop(window.scrollY > 200);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ─── Filtered + searched perks ───
  const filteredPerks = useMemo(() => {
    return PERKS.filter((perk) => {
      // Special filters override category
      if (specialFilter === "new" && !perk.isNew) return false;
      if (specialFilter === "expiring" && !perk.expiringSoon) return false;
      if (specialFilter === "saved" && !savedIds.has(perk.id)) return false;

      const countryMatch = perk.countries.includes(selectedCountry) || perk.countries.includes("GLOBAL");
      const categoryMatch = specialFilter || selectedCategories.includes("All") || selectedCategories.some((sc) => perk.category === sc.replace(/^[^\s]+\s/, ""));
      const q = searchQuery.toLowerCase();
      const searchMatch = !q || perk.title.toLowerCase().includes(q) || perk.company.toLowerCase().includes(q) || perk.category.toLowerCase().includes(q) || perk.description.toLowerCase().includes(q);
      return countryMatch && categoryMatch && searchMatch;
    });
  }, [selectedCountry, selectedCategories, searchQuery, specialFilter, savedIds]);

  // ─── Handlers ───
  const handleOfferClick = useCallback((perk: Perk) => {
    const trackedUrl = buildTrackedUrl(perk.url, perk.id);
    window.open(trackedUrl, "_blank", "noopener,noreferrer");
    setOfferToast("Opening offer in new tab ✓");
  }, []);

  const handleShare = useCallback(async (perk: Perk) => {
    const url = `${window.location.origin}#perk-${perk.id}`;
    try { await navigator.clipboard.writeText(url); } catch { /* fallback */ }
    setOfferToast("Link copied! Share with friends ✓");
  }, []);

  const filterByCategory = useCallback((cat: string) => {
    const fullCat = CATEGORIES.find((c) => c.includes(cat)) || "All";
    setSpecialFilter(null);
    setSelectedCategories([fullCat]);
    setSearchQuery("");
    setTimeout(() => {
      document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: "var(--bg)" }}>
      <Navbar onStartHere={() => setStartHereOpen(true)} onSubmitPerk={() => setSubmitPerkOpen(true)} />
      <Hero />
      <CommunitySavings />
      <SavingsCalculator />

      <div id="explore" className="scroll-mt-24">
        <FilterBar
          selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry}
          selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories}
          totalCount={filteredPerks.length}
          searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          viewMode={viewMode} setViewMode={setViewMode}
          specialFilter={specialFilter} setSpecialFilter={setSpecialFilter}
          savedCount={savedIds.size}
        />

        <main className="w-full responsive-px py-12">
          {initialLoad ? (
            /* Initial skeleton on first page load */
            <div className="card-grid">
              {[...Array(12)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className={`perk-grid ${gridPhase === "exiting" ? "perk-grid--exiting" : "perk-grid--entering"}`}>
              <div className="card-grid">
                {filteredPerks.map((perk, i) => {
                  const isAboveFold = i < PRELOAD_COUNT;
                  const isNear = isAboveFold || nearIds.has(perk.id);
                  const isRevealed = isAboveFold || revealedIds.has(perk.id);

                  return (
                    <div key={perk.id} ref={(el) => observe(perk.id, el)} data-perk-id={perk.id}>
                      {isNear ? (
                        <PerkCard
                          perk={perk}
                          index={isAboveFold ? i : Math.min(i, 8)}
                          isVisible={isRevealed}
                          isClaimed={claimedIds.has(perk.id)}
                          onClaim={toggleClaim}
                          votes={votes[perk.id] || 0}
                          hasVoted={votedIds.has(perk.id)}
                          onVote={toggleVote}
                          onShare={handleShare}
                          onOfferClick={handleOfferClick}
                          isTrending={trendingIds.has(perk.id)}
                          isSaved={savedIds.has(perk.id)}
                          onToggleSaved={toggleSaved}
                          isComparing={compareIds.includes(perk.id)}
                          onToggleCompare={toggleCompare}
                          canCompare={compareIds.length < 3}
                        />
                      ) : (
                        <CardPlaceholder />
                      )}
                    </div>
                  );
                })}
              </div>
              {filteredPerks.length === 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-32 flex flex-col items-center">
                  <span className="text-8xl mb-8">🔍</span>
                  <h3 className="text-2xl font-fraunces font-black mb-2" style={{ color: "var(--on-surface)" }}>No perks found</h3>
                  <p className="mb-8 max-w-md mx-auto" style={{ color: "var(--on-surface-variant)" }}>Try selecting Global or a different category.</p>
                  <button onClick={() => { setSelectedCategories(["All"]); setSelectedCountry("GLOBAL"); setSearchQuery(""); }}
                    className="px-8 py-3 bg-[#004AC6] text-white font-bold rounded-full shadow-lg shadow-blue-500/20 hover:scale-105 transition-transform">
                    Reset Filters
                  </button>
                </motion.div>
              )}
            </div>
          )}
        </main>
      </div>

      <IconGrid />
      <SocialProof />
      <Newsletter />

      {/* Info Section */}
      <section className="py-24 px-6" style={{ background: "var(--surface)" }}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="relative rounded-3xl overflow-hidden aspect-video shadow-2xl">
            <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000" alt="Students collaborating" className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-[#004AC6]/10 mix-blend-multiply" />
          </div>
          <div>
            <h2 className="font-fraunces text-4xl md:text-5xl font-black mb-6" style={{ color: "var(--on-surface)" }}>More than just a discount list.</h2>
            <p className="text-lg leading-relaxed mb-8 font-dm-sans" style={{ color: "var(--on-surface-variant)" }}>
              We partner directly with software engineering, design, and research teams to ensure students have zero friction when transitioning from academic projects to professional workflows.
            </p>
            <ul className="space-y-4">
              {["Verified .edu verification in seconds", "Stackable with existing university licenses", 'Lifetime "Early Adopter" pricing tiers'].map((item) => (
                <li key={item} className="flex items-center gap-3 font-bold" style={{ color: "var(--on-surface)" }}>
                  <span className="w-6 h-6 rounded-full bg-[#7CF994] flex items-center justify-center text-[#002109]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-white py-24 px-12" style={{ background: "var(--footer-bg)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
            <div>
              <div className="flex items-center gap-2 text-2xl font-black mb-6">
                <img src="/logo.png" alt="StudentPerks" width={28} height={28} className="w-7 h-7" />
                StudentPerks.fun
              </div>
              <p className="text-slate-400 text-sm leading-relaxed italic font-fraunces text-lg">Curating the academic lifestyle for the digital generation.</p>
            </div>
            <div>
              <h4 className="font-fraunces text-xl mb-8 text-white">Categories</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                {["Dev Tools", "AI Tools", "Design", "Cloud", "Security", "Music", "Streaming"].map((item) => (
                  <li key={item}><button onClick={() => filterByCategory(item)} className="hover:text-blue-400 transition-colors">{item}</button></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-fraunces text-xl mb-8 text-white">Resources</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><button onClick={() => setSubmitPerkOpen(true)} className="hover:text-blue-400 transition-colors">Submit a Perk</button></li>
                <li><button onClick={() => setAdvertiseOpen(true)} className="hover:text-blue-400 transition-colors">Advertise with Us</button></li>
                <li><button onClick={() => setApiAccessOpen(true)} className="hover:text-blue-400 transition-colors">API Access</button></li>
                <li><button onClick={() => setBrandAssetsOpen(true)} className="hover:text-blue-400 transition-colors">Brand Assets</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-fraunces text-xl mb-8 text-white">Legal</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><a href="/disclaimer" className="hover:text-blue-400 transition-colors">Disclaimer</a></li>
                <li><a href="/privacy-policy" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-blue-400 transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <div>© 2026 StudentPerks.fun. All rights reserved.</div>
            <div className="flex gap-8">
              <a href="https://twitter.com/studentperksfun" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Twitter</a>
              <a href="https://linkedin.com/company/studentperksfun" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
              <a href="https://discord.gg/studentperks" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Discord</a>
            </div>
          </div>
        </div>
      </footer>

      <ClaimTracker claimedIds={claimedIds} />
      <CompareBar compareIds={compareIds} onRemove={(id) => setCompareIds((p) => p.filter((x) => x !== id))} onClear={() => setCompareIds([])} onCompare={() => setCompareModalOpen(true)} />
      <CompareModal isOpen={compareModalOpen} onClose={() => setCompareModalOpen(false)} compareIds={compareIds} />
      <StartHereModal isOpen={startHereOpen} onClose={() => setStartHereOpen(false)} />
      <SubmitPerkModal isOpen={submitPerkOpen} onClose={() => setSubmitPerkOpen(false)} onSuccess={() => setOfferToast("✅ Perk submitted! We'll review and add it soon.")} />
      <AdvertiseModal isOpen={advertiseOpen} onClose={() => setAdvertiseOpen(false)} />
      <ApiAccessModal isOpen={apiAccessOpen} onClose={() => setApiAccessOpen(false)} />
      <BrandAssetsModal isOpen={brandAssetsOpen} onClose={() => setBrandAssetsOpen(false)} />

      <AnimatePresence>
        {showScrollTop && (
          <motion.button initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-20 right-8 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center z-50 transition-all border"
            style={{ background: "var(--surface)", color: "var(--primary)", borderColor: "var(--outline)" }}>
            <ArrowUp size={24} strokeWidth={3} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 50, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: 50, x: "-50%" }}
            className={`fixed bottom-8 left-1/2 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border min-w-[320px] ${
              toast.type === "error" ? "bg-red-50 border-red-100 text-red-800" : "bg-[#1C1B1B] border-white/10 text-white"
            }`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${toast.type === "error" ? "bg-red-100" : "bg-white/10"}`}>
              {toast.type === "error" ? "⚠️" : "🌍"}
            </div>
            <div className="flex-1"><p className="text-sm font-bold leading-tight">{toast.message}</p></div>
            <button onClick={() => setToast(null)} className="p-1 hover:opacity-70 transition-opacity">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {offerToast && <OfferToast message={offerToast} onDone={() => setOfferToast(null)} />}
    </div>
  );
}
