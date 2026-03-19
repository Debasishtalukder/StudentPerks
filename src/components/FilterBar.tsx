import { ChevronDown } from "lucide-react";
import { motion, useSpring, useTransform, animate } from "motion/react";
import { useEffect, useState } from "react";
import { CATEGORIES, COUNTRIES } from "../data/perks";

interface FilterBarProps {
  selectedCountry: string;
  setSelectedCountry: (code: string) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  totalCount: number;
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

export default function FilterBar({
  selectedCountry,
  setSelectedCountry,
  selectedCategories,
  setSelectedCategories,
  totalCount,
}: FilterBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const currentCountry = COUNTRIES.find((c) => c.code === selectedCountry) || COUNTRIES[0];

  const filteredCountries = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCategoryToggle = (cat: string) => {
    if (cat === "All") {
      setSelectedCategories(["All"]);
      return;
    }

    let newCategories = [...selectedCategories];
    if (newCategories.includes("All")) {
      newCategories = [cat];
    } else {
      if (newCategories.includes(cat)) {
        newCategories = newCategories.filter((c) => c !== cat);
      } else {
        newCategories.push(cat);
      }
    }

    if (newCategories.length === 0) {
      newCategories = ["All"];
    }
    setSelectedCategories(newCategories);
  };

  return (
    <div className="sticky top-[72px] z-40 bg-[#FCF9F8] py-4 flex flex-col gap-4 border-b border-black/5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-7xl mx-auto w-full px-6">
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-4 bg-white px-6 py-2.5 rounded-full border-[1.5px] border-[#E5E5E5] hover:border-[#2563EB] transition-all shadow-[0_2px_4px_rgba(0,0,0,0.02)] group"
          >
            <span className="text-[20px] leading-none">{currentCountry.flag}</span>
            <span className="text-sm font-medium text-[#1C1B1B] font-dm-sans">{currentCountry.name}</span>
            <ChevronDown size={18} className={`text-[#434655] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-[16px] shadow-2xl border border-black/5 z-50 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-2 mb-1">
                  <input
                    type="text"
                    placeholder="Search country..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F6F3F2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                    autoFocus
                  />
                </div>
                <div className="max-h-64 overflow-y-auto no-scrollbar">
                  {filteredCountries.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setSelectedCountry(c.code);
                        setIsDropdownOpen(false);
                        setSearchQuery("");
                      }}
                      className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl transition-colors text-sm font-medium ${
                        selectedCountry === c.code ? 'bg-[#2563EB]/5 text-[#2563EB]' : 'hover:bg-[#F6F3F2]'
                      }`}
                    >
                      <span className="text-lg">{c.flag}</span>
                      <span>{c.name}</span>
                    </button>
                  ))}
                  {filteredCountries.length === 0 && (
                    <div className="px-4 py-8 text-center text-xs text-[#434655]">
                      No countries found
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat) => {
            const [emoji, ...nameParts] = cat.split(" ");
            const name = nameParts.join(" ");
            
            return (
              <button
                key={cat}
                onClick={() => handleCategoryToggle(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all flex items-center gap-[6px] ${
                  selectedCategories.includes(cat)
                    ? "bg-[#2563EB] text-white shadow-lg shadow-blue-500/20"
                    : "bg-[#EBE7E7] text-[#434655] hover:bg-[#E5E2E1]"
                }`}
              >
                {cat === "All" ? cat : (
                  <>
                    <span className="text-base">{emoji}</span>
                    <span>{name}</span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-6">
        <div className="bg-[#F6F3F2] px-6 py-3 rounded-2xl flex items-center justify-between">
          <p className="text-sm text-[#434655] font-medium">
            Showing <span className="text-[#1C1B1B] font-bold"><CountUp value={totalCount} /> perks</span> available in{" "}
            <span className="inline-flex items-center gap-1 font-bold text-[#1C1B1B]">
              {currentCountry.flag} {currentCountry.name} · {selectedCategories.map(c => c.replace(/^[^\s]+\s/, "")).join(", ")}
            </span>
          </p>
          <div className="hidden md:flex items-center gap-2 text-[10px] font-bold text-[#004AC6] uppercase tracking-widest cursor-pointer hover:opacity-80 transition-opacity">
            Sort by: Trending <ChevronDown size={12} />
          </div>
        </div>
      </div>
    </div>
  );
}
