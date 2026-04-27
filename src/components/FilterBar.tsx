import { ChevronDown, Search, X, LayoutGrid, List, Sparkles, Clock, Bookmark } from "lucide-react";
import { animate } from "motion/react";
import { useEffect, useState, useRef } from "react";
import { CATEGORIES, COUNTRIES } from "../data/perks";

interface FilterBarProps {
  selectedCountry: string;
  setSelectedCountry: (code: string) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  totalCount: number;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (m: "grid" | "list") => void;
  specialFilter: string | null;
  setSpecialFilter: (f: string | null) => void;
  savedCount: number;
}

function CountUp({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(value);
  useEffect(() => {
    const controls = animate(displayValue, value, {
      duration: 0.5,
      onUpdate: (latest) => setDisplayValue(Math.floor(latest)),
    });
    return () => controls.stop();
  }, [value]);
  return <>{displayValue}</>;
}

const SPECIAL_FILTERS = [
  { id: "new", label: "New This Week", icon: <Sparkles size={13} />, color: "#16A34A" },
  { id: "expiring", label: "Expiring Soon", icon: <Clock size={13} />, color: "#F97316" },
  { id: "saved", label: "Saved", icon: <Bookmark size={13} />, color: "#2563EB" },
];

export default function FilterBar({
  selectedCountry, setSelectedCountry,
  selectedCategories, setSelectedCategories,
  totalCount,
  searchQuery, setSearchQuery,
  viewMode, setViewMode,
  specialFilter, setSpecialFilter,
  savedCount,
}: FilterBarProps) {
  const [countrySearch, setCountrySearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const currentCountry = COUNTRIES.find((c) => c.code === selectedCountry) || COUNTRIES[0];

  const filteredCountries = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;

      if (e.key === "/" && !isInput) {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape") {
        if (searchQuery) { setSearchQuery(""); }
        searchRef.current?.blur();
      }
      if (e.key === "g" && !isInput) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [searchQuery, setSearchQuery]);

  const handleCategoryToggle = (cat: string) => {
    setSpecialFilter(null);
    if (cat === "All") { setSelectedCategories(["All"]); return; }
    let newCategories = [...selectedCategories];
    if (newCategories.includes("All")) { newCategories = [cat]; }
    else if (newCategories.includes(cat)) { newCategories = newCategories.filter((c) => c !== cat); }
    else { newCategories.push(cat); }
    if (newCategories.length === 0) newCategories = ["All"];
    setSelectedCategories(newCategories);
  };

  const handleSpecialFilter = (id: string) => {
    if (specialFilter === id) {
      setSpecialFilter(null);
    } else {
      setSpecialFilter(id);
      setSelectedCategories(["All"]);
    }
  };

  return (
    <div
      className="sticky top-[72px] z-40 py-4 flex flex-col gap-4 border-b transition-colors duration-300"
      style={{ backgroundColor: "var(--bg)", borderColor: "var(--outline)" }}
    >
      {/* Row 1: Country + Search + View Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-7xl mx-auto w-full px-6">
        <div className="relative shrink-0">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-4 px-6 py-2.5 rounded-full border-[1.5px] transition-all shadow-[0_2px_4px_rgba(0,0,0,0.02)] group"
            style={{ background: "var(--surface)", borderColor: "var(--outline)", color: "var(--on-surface)" }}
          >
            <span className="text-[20px] leading-none">{currentCountry.flag}</span>
            <span className="text-sm font-medium font-dm-sans">{currentCountry.name}</span>
            <ChevronDown size={18} className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} style={{ color: "var(--on-surface-variant)" }} />
          </button>
          {isDropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
              <div className="absolute top-full left-0 mt-2 w-64 rounded-[16px] shadow-2xl border z-50 p-2" style={{ background: "var(--surface)", borderColor: "var(--outline)" }}>
                <div className="p-2 mb-1">
                  <input type="text" placeholder="Search country..." value={countrySearch} onChange={(e) => setCountrySearch(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                    style={{ background: "var(--bg-secondary)", color: "var(--on-surface)" }} autoFocus />
                </div>
                <div className="max-h-64 overflow-y-auto no-scrollbar">
                  {filteredCountries.map((c) => (
                    <button key={c.code} onClick={() => { setSelectedCountry(c.code); setIsDropdownOpen(false); setCountrySearch(""); }}
                      className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl transition-colors text-sm font-medium ${selectedCountry === c.code ? "text-[#2563EB]" : ""}`}
                      style={{ background: selectedCountry === c.code ? "rgba(37,99,235,0.05)" : undefined, color: selectedCountry === c.code ? undefined : "var(--on-surface)" }}>
                      <span className="text-lg">{c.flag}</span><span>{c.name}</span>
                    </button>
                  ))}
                  {filteredCountries.length === 0 && <div className="px-4 py-8 text-center text-xs" style={{ color: "var(--on-surface-variant)" }}>No countries found</div>}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Search bar with keyboard hint */}
        <div className="flex-1 max-w-md relative group">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--on-surface-variant)" }} />
          <input ref={searchRef} type="text" placeholder="Search tools, brands, categories..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-16 py-2.5 rounded-full border-[1.5px] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
            style={{ background: "var(--surface)", borderColor: "var(--outline)", color: "var(--on-surface)" }} />
          {searchQuery ? (
            <button onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-colors hover:opacity-70"
              style={{ background: "var(--bg-secondary)", color: "var(--on-surface-variant)" }}>
              <X size={12} />
            </button>
          ) : (
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-md text-[10px] font-bold border hidden sm:inline-block"
              style={{ background: "var(--bg-secondary)", borderColor: "var(--outline)", color: "var(--on-surface-variant)" }}>
              /
            </kbd>
          )}
        </div>

        <div className="flex items-center gap-1 rounded-full p-1 shrink-0" style={{ background: "var(--bg-secondary)" }}>
          <button onClick={() => setViewMode("grid")} className="w-9 h-9 rounded-full flex items-center justify-center transition-all" aria-label="Grid view"
            style={{ background: viewMode === "grid" ? "var(--surface)" : "transparent", color: viewMode === "grid" ? "var(--primary)" : "var(--on-surface-variant)", boxShadow: viewMode === "grid" ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}>
            <LayoutGrid size={16} />
          </button>
          <button onClick={() => setViewMode("list")} className="w-9 h-9 rounded-full flex items-center justify-center transition-all" aria-label="List view"
            style={{ background: viewMode === "list" ? "var(--surface)" : "transparent", color: viewMode === "list" ? "var(--primary)" : "var(--on-surface-variant)", boxShadow: viewMode === "list" ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}>
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Row 2: Special filters + Category pills */}
      <div className="max-w-7xl mx-auto w-full px-6">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {/* Special filter pills */}
          {SPECIAL_FILTERS.map((sf) => (
            <button key={sf.id} onClick={() => handleSpecialFilter(sf.id)}
              className={`px-4 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                specialFilter === sf.id ? "text-white shadow-lg" : ""
              }`}
              style={specialFilter === sf.id
                ? { background: sf.color, borderColor: sf.color }
                : { background: "var(--surface)", borderColor: "var(--outline)", color: "var(--on-surface-variant)" }
              }>
              {sf.icon}
              <span>{sf.label}</span>
              {sf.id === "saved" && savedCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-black"
                  style={{ background: specialFilter === "saved" ? "rgba(255,255,255,0.25)" : "var(--bg-secondary)" }}>
                  {savedCount}
                </span>
              )}
            </button>
          ))}

          <div className="w-px h-6 mx-1" style={{ background: "var(--outline)" }} />

          {/* Category pills */}
          {CATEGORIES.map((cat) => {
            const [emoji, ...nameParts] = cat.split(" ");
            const name = nameParts.join(" ");
            const isActive = !specialFilter && selectedCategories.includes(cat);
            return (
              <button key={cat} onClick={() => handleCategoryToggle(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all flex items-center gap-[6px] ${
                  isActive ? "bg-[#2563EB] text-white shadow-lg shadow-blue-500/20" : ""
                }`}
                style={isActive ? undefined : { background: "var(--filter-bg)", color: "var(--on-surface-variant)" }}>
                {cat === "All" ? cat : (<><span className="text-base">{emoji}</span><span>{name}</span></>)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Row 3: Results count */}
      <div className="max-w-7xl mx-auto w-full px-6">
        <div className="px-6 py-3 rounded-2xl flex items-center justify-between" style={{ background: "var(--bg-secondary)" }}>
          <p className="text-sm font-medium" style={{ color: "var(--on-surface-variant)" }}>
            Showing <span className="font-bold" style={{ color: "var(--on-surface)" }}><CountUp value={totalCount} /> perks</span>
            {searchQuery && <span> matching "<strong style={{ color: "var(--on-surface)" }}>{searchQuery}</strong>"</span>}
            {specialFilter && <span> · <strong style={{ color: "var(--on-surface)" }}>{SPECIAL_FILTERS.find(s => s.id === specialFilter)?.label}</strong></span>}
            {" "}in{" "}
            <span className="inline-flex items-center gap-1 font-bold" style={{ color: "var(--on-surface)" }}>
              {currentCountry.flag} {currentCountry.name}
            </span>
          </p>
          <div className="hidden md:flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--on-surface-variant)" }}>
            <kbd className="px-1.5 py-0.5 rounded border text-[9px]" style={{ borderColor: "var(--outline)" }}>/</kbd> search
            <kbd className="px-1.5 py-0.5 rounded border text-[9px]" style={{ borderColor: "var(--outline)" }}>G</kbd> top
            <kbd className="px-1.5 py-0.5 rounded border text-[9px]" style={{ borderColor: "var(--outline)" }}>Esc</kbd> clear
          </div>
        </div>
      </div>
    </div>
  );
}
