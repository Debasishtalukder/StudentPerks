import { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUp } from "lucide-react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FilterBar from "./components/FilterBar";
import PerkCard from "./components/PerkCard";
import IconGrid from "./components/IconGrid";
import { PERKS, COUNTRIES, CATEGORIES } from "./data/perks";

export default function App() {
  const [selectedCountry, setSelectedCountry] = useState("GLOBAL");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["All"]);
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'info' } | null>(null);

  useEffect(() => {
    // Auto-detect country with fallback
    const detectCountry = async () => {
      try {
        const response = await fetch("https://ipwho.is/");
        const data = await response.json();
        
        if (data && data.success && data.country_code) {
          const countryCode = data.country_code;
          if (COUNTRIES.some((c) => c.code === countryCode)) {
            setSelectedCountry(countryCode);
          } else {
            // Country not in our list
            setToast({ message: `Perks for ${data.country} coming soon! Showing Global perks for now.`, type: 'info' });
            setTimeout(() => setToast(null), 6000);
          }
        } else {
          throw new Error("API returned failure");
        }
      } catch (err) {
        console.warn("Country detection failed, falling back to GLOBAL:", err);
        setSelectedCountry("GLOBAL");
        setToast({ message: "Country detection failed. Defaulting to Global perks.", type: 'error' });
        setTimeout(() => setToast(null), 6000);
      }
    };

    detectCountry();

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [selectedCountry, selectedCategories]);

  const filteredPerks = useMemo(() => {
    return PERKS.filter((perk) => {
      const countryMatch = perk.countries.includes(selectedCountry) || perk.countries.includes("GLOBAL");
      
      // Robust category matching
      const categoryMatch = selectedCategories.includes("All") || 
        selectedCategories.some(selectedCat => {
          // Remove emoji and space for comparison
          const cleanSelected = selectedCat.replace(/^[^\s]+\s/, "");
          return perk.category === cleanSelected;
        });
        
      return countryMatch && categoryMatch;
    });
  }, [selectedCountry, selectedCategories]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.08, 
      rootMargin: '0px 0px -40px 0px' 
    });

    const cards = document.querySelectorAll('.perk-card');
    cards.forEach((card, i) => {
      const el = card as HTMLElement;
      el.classList.remove('visible');
      el.style.transitionDelay = `${i * 40}ms`;
      void el.offsetWidth; // force reflow
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [filteredPerks, isLoading]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#FCF9F8]">
      <Navbar />
      <Hero />
      
      <div id="explore" className="scroll-mt-24">
        <FilterBar
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          totalCount={filteredPerks.length}
        />

        <main className="max-w-7xl mx-auto px-6 py-12">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 h-80 animate-pulse">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl mb-6"></div>
                  <div className="h-4 bg-slate-100 rounded w-1/4 mb-4"></div>
                  <div className="h-6 bg-slate-100 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-slate-100 rounded w-1/2 mb-6"></div>
                  <div className="space-y-2">
                    <div className="h-10 bg-slate-100 rounded-xl"></div>
                    <div className="h-10 bg-slate-100 rounded-xl"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredPerks.map((perk) => (
                  <PerkCard key={perk.id} perk={perk} />
                ))}
              </div>
              
              {filteredPerks.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-32 flex flex-col items-center"
                >
                  <span className="text-8xl mb-8">🔍</span>
                  <h3 className="text-2xl font-fraunces font-black text-[#1C1B1B] mb-2">No perks found for this selection</h3>
                  <p className="text-[#434655] mb-8 max-w-md mx-auto">Try selecting Global or a different category to see more student benefits.</p>
                  <button 
                    onClick={() => { setSelectedCategories(["All"]); setSelectedCountry("GLOBAL"); }}
                    className="px-8 py-3 bg-[#004AC6] text-white font-bold rounded-full shadow-lg shadow-blue-500/20 hover:scale-105 transition-transform"
                  >
                    Reset Filters
                  </button>
                </motion.div>
              )}
            </>
          )}
        </main>
      </div>

      <IconGrid />

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 w-14 h-14 bg-white text-[#004AC6] rounded-full shadow-2xl flex items-center justify-center z-50 hover:bg-[#004AC6] hover:text-white transition-all border border-black/5"
          >
            <ArrowUp size={24} strokeWidth={3} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className={`fixed bottom-8 left-1/2 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border min-w-[320px] ${
              toast.type === 'error' 
                ? 'bg-red-50 border-red-100 text-red-800' 
                : 'bg-[#1C1B1B] border-white/10 text-white'
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
              toast.type === 'error' ? 'bg-red-100' : 'bg-white/10'
            }`}>
              {toast.type === 'error' ? '⚠️' : '🌍'}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold leading-tight">{toast.message}</p>
            </div>
            <button 
              onClick={() => setToast(null)}
              className="p-1 hover:opacity-70 transition-opacity"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="relative rounded-3xl overflow-hidden aspect-video shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000" 
              alt="Students collaborating" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#004AC6]/10 mix-blend-multiply"></div>
          </div>
          <div>
            <h2 className="font-fraunces text-4xl md:text-5xl font-black mb-6 text-[#1C1B1B]">More than just a discount list.</h2>
            <p className="text-[#434655] text-lg leading-relaxed mb-8 font-dm-sans">
              We partner directly with software engineering, design, and research teams to ensure students have zero friction when transitioning from academic projects to professional workflows.
            </p>
            <ul className="space-y-4">
              {["Verified .edu verification in seconds", "Stackable with existing university licenses", "Lifetime \"Early Adopter\" pricing tiers"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-[#1C1B1B] font-bold">
                  <span className="w-6 h-6 rounded-full bg-[#7CF994] flex items-center justify-center text-[#002109]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#020617] text-white py-24 px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
            <div>
              <div className="text-2xl font-black mb-6">StudentPerks.io</div>
              <p className="text-slate-400 text-sm leading-relaxed italic font-fraunces text-lg">
                Curating the academic lifestyle for the digital generation.
              </p>
            </div>
            <div>
              <h4 className="font-fraunces text-xl mb-8 text-white">Categories</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                {["Dev Tools", "Design", "Productivity", "Cloud"].map(item => (
                  <li key={item}><a href="#" className="hover:text-blue-400 transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-fraunces text-xl mb-8 text-white">Resources</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                {["Submit a Perk", "API Access", "Brand Assets"].map(item => (
                  <li key={item}><a href="#" className="hover:text-blue-400 transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-fraunces text-xl mb-8 text-white">Legal</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                {["Disclaimer", "Privacy Policy", "Terms"].map(item => (
                  <li key={item}><a href="#" className="hover:text-blue-400 transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <div>© 2024 StudentPerks.io. All rights reserved.</div>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-white transition-colors">Discord</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
