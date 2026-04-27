import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ExternalLink, Check } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { COMPARISONS } from "../data/comparisons";
import { PERKS } from "../data/perks";
import { buildTrackedUrl } from "../data/affiliates";
import LogoImage from "./LogoImage";

function CompareNav() {
  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-xl border-b transition-colors duration-300"
      style={{ backgroundColor: "var(--navbar-bg)", borderColor: "var(--outline)" }}>
      <div className="flex justify-between items-center px-6 py-4 w-full max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="StudentPerks" width={32} height={32} className="w-8 h-8" />
          <span className="text-xl font-bold tracking-tight" style={{ color: "var(--on-surface)" }}>
            StudentPerks<span style={{ color: "var(--primary-container)" }}>.fun</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/blog" className="text-sm font-semibold" style={{ color: "var(--on-surface-variant)" }}>Blog</Link>
          <Link to="/#explore" className="text-sm font-semibold" style={{ color: "var(--primary)" }}>All Perks</Link>
        </div>
      </div>
    </nav>
  );
}

export default function ComparePage() {
  const { slug } = useParams<{ slug: string }>();
  const comparison = COMPARISONS.find((c) => c.slug === slug);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!comparison) {
    return (
      <><CompareNav />
        <div className="min-h-screen pt-28 pb-24 px-6 text-center" style={{ background: "var(--bg)" }}>
          <h1 className="font-fraunces text-3xl font-black mb-4" style={{ color: "var(--on-surface)" }}>Comparison not found</h1>
          <Link to="/" className="text-sm font-bold" style={{ color: "var(--primary)" }}>← Back to Perks</Link>
        </div>
      </>
    );
  }

  const perkA = PERKS.find((p) => p.id === comparison.toolA.id);
  const perkB = PERKS.find((p) => p.id === comparison.toolB.id);

  return (
    <><CompareNav />
      <div className="min-h-screen pt-28 pb-24 px-6" style={{ background: "var(--bg)" }}>
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/" className="text-sm font-bold mb-6 inline-flex items-center gap-1 hover:opacity-70 transition-opacity" style={{ color: "var(--primary)" }}>
              <ArrowLeft size={14} /> Back to Perks
            </Link>

            {/* Header */}
            <div className="flex items-center justify-center gap-6 my-10">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-2xl p-3 overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--outline)" }}>
                  <LogoImage domain={comparison.toolA.domain} name={comparison.toolA.name} className="w-full h-full" />
                </div>
                <p className="font-bold" style={{ color: "var(--on-surface)" }}>{comparison.toolA.name}</p>
              </div>
              <span className="text-2xl font-black" style={{ color: "var(--on-surface-variant)" }}>vs</span>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-2xl p-3 overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--outline)" }}>
                  <LogoImage domain={comparison.toolB.domain} name={comparison.toolB.name} className="w-full h-full" />
                </div>
                <p className="font-bold" style={{ color: "var(--on-surface)" }}>{comparison.toolB.name}</p>
              </div>
            </div>

            <h1 className="font-fraunces text-3xl md:text-4xl font-black text-center mb-12" style={{ color: "var(--on-surface)" }}>
              {comparison.title}
            </h1>

            {/* Comparison table */}
            <div className="rounded-2xl border overflow-hidden mb-12" style={{ background: "var(--surface)", borderColor: "var(--outline)" }}>
              {/* Table header */}
              <div className="grid grid-cols-3 gap-4 px-6 py-4 border-b" style={{ borderColor: "var(--outline)", background: "var(--bg-secondary)" }}>
                <div className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--on-surface-variant)" }}>Feature</div>
                <div className="text-sm font-bold text-center" style={{ color: "var(--primary)" }}>{comparison.toolA.name}</div>
                <div className="text-sm font-bold text-center" style={{ color: "var(--primary)" }}>{comparison.toolB.name}</div>
              </div>
              {comparison.rows.map((row, i) => (
                <div key={i} className="grid grid-cols-3 gap-4 px-6 py-3.5 border-b last:border-b-0" style={{ borderColor: "var(--outline)" }}>
                  <div className="text-xs font-bold" style={{ color: "var(--on-surface-variant)" }}>{row.label}</div>
                  <div className="text-sm text-center" style={{ color: "var(--on-surface)" }}>{row.a}</div>
                  <div className="text-sm text-center" style={{ color: "var(--on-surface)" }}>{row.b}</div>
                </div>
              ))}
            </div>

            {/* Pros */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="rounded-2xl p-6 border" style={{ background: "var(--surface)", borderColor: "var(--outline)" }}>
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ color: "var(--on-surface)" }}>
                  <span className="text-xl">👍</span> {comparison.toolA.name} Pros
                </h3>
                <ul className="space-y-2">
                  {comparison.prosA.map((pro) => (
                    <li key={pro} className="flex items-start gap-2 text-sm" style={{ color: "var(--on-surface-variant)" }}>
                      <Check size={14} className="text-emerald-500 mt-0.5 shrink-0" /> {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl p-6 border" style={{ background: "var(--surface)", borderColor: "var(--outline)" }}>
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ color: "var(--on-surface)" }}>
                  <span className="text-xl">👍</span> {comparison.toolB.name} Pros
                </h3>
                <ul className="space-y-2">
                  {comparison.prosB.map((pro) => (
                    <li key={pro} className="flex items-start gap-2 text-sm" style={{ color: "var(--on-surface-variant)" }}>
                      <Check size={14} className="text-emerald-500 mt-0.5 shrink-0" /> {pro}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Verdict */}
            <div className="rounded-2xl p-8 border mb-12 text-center" style={{ background: "var(--bg-secondary)", borderColor: "var(--outline)" }}>
              <h3 className="font-fraunces text-xl font-black mb-3" style={{ color: "var(--on-surface)" }}>
                🎓 Which Should Students Choose?
              </h3>
              <p className="text-sm leading-relaxed max-w-2xl mx-auto" style={{ color: "var(--on-surface-variant)" }}>
                {comparison.verdict}
              </p>
            </div>

            {/* Claim CTAs */}
            <div className="grid md:grid-cols-2 gap-4">
              {[{ tool: comparison.toolA, perk: perkA }, { tool: comparison.toolB, perk: perkB }].map(({ tool, perk }) => perk && (
                <a key={tool.id} href={buildTrackedUrl(perk.url, perk.id)} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-4 p-5 rounded-2xl border transition-all hover:shadow-lg group"
                  style={{ background: "var(--surface)", borderColor: "var(--outline)" }}>
                  <div className="w-12 h-12 rounded-xl p-2 overflow-hidden shrink-0" style={{ background: "var(--bg-secondary)" }}>
                    <LogoImage domain={tool.domain} name={tool.name} className="w-full h-full" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm" style={{ color: "var(--on-surface)" }}>Claim {tool.name}</p>
                    <p className="text-xs" style={{ color: "var(--on-surface-variant)" }}>{perk.savings}</p>
                  </div>
                  <ExternalLink size={16} className="group-hover:translate-x-0.5 transition-transform" style={{ color: "var(--primary)" }} />
                </a>
              ))}
            </div>

            {/* Other comparisons */}
            <div className="mt-16">
              <h3 className="font-fraunces text-xl font-black mb-6" style={{ color: "var(--on-surface)" }}>More Comparisons</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {COMPARISONS.filter((c) => c.slug !== slug).map((c) => (
                  <Link key={c.slug} to={`/compare/${c.slug}`}
                    className="flex items-center gap-3 p-4 rounded-xl border transition-all hover:shadow-md"
                    style={{ background: "var(--surface)", borderColor: "var(--outline)" }}>
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-lg p-1.5 border-2 border-white overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
                        <LogoImage domain={c.toolA.domain} className="w-full h-full" />
                      </div>
                      <div className="w-8 h-8 rounded-lg p-1.5 border-2 border-white overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
                        <LogoImage domain={c.toolB.domain} className="w-full h-full" />
                      </div>
                    </div>
                    <span className="text-sm font-bold flex-1" style={{ color: "var(--on-surface)" }}>{c.title}</span>
                    <ArrowRight size={14} style={{ color: "var(--on-surface-variant)" }} />
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
