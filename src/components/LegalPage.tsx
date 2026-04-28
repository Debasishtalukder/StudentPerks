import { Link, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";

function LegalNav() {
  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-xl border-b" style={{ backgroundColor: "var(--navbar-bg)", borderColor: "var(--outline)" }}>
      <div className="flex justify-between items-center px-6 py-4 w-full max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="StudentPerks" width={32} height={32} className="w-8 h-8" />
          <span className="text-xl font-bold tracking-tight" style={{ color: "var(--on-surface)" }}>
            StudentPerks<span style={{ color: "var(--primary-container)" }}>.fun</span>
          </span>
        </Link>
        <Link to="/" className="text-sm font-semibold" style={{ color: "var(--primary)" }}>Back to Perks</Link>
      </div>
    </nav>
  );
}

const PAGES: Record<string, { title: string; updated: string; content: string }> = {
  "/disclaimer": {
    title: "Disclaimer",
    updated: "April 2026",
    content: `The information on StudentPerks.fun is provided for general informational purposes only. We do our best to ensure all listed offers are accurate and active, but student deals change frequently. We recommend verifying each offer directly on the provider's website before claiming.

StudentPerks.fun is not affiliated with, endorsed by, or officially connected to any of the tools, brands, or companies listed on this site unless explicitly stated.

Some links on this site may be affiliate links. This means we may earn a small commission at no extra cost to you if you sign up through our link. This helps us keep the site free and up to date.

If you find an outdated or incorrect offer, please submit a correction via our Submit a Perk form.`,
  },
  "/privacy-policy": {
    title: "Privacy Policy",
    updated: "April 2026",
    content: `At StudentPerks.fun, we take your privacy seriously. This policy explains what data we collect and how we use it.

**What we collect:**
- Email address (only if you voluntarily subscribe to our newsletter or submit a perk)
- Basic analytics data (page views, country, device type) via privacy-friendly analytics

**What we do NOT collect:**
- We do not collect names, passwords, or payment information
- We do not sell your data to third parties
- We do not use invasive tracking or behavioral advertising

**How we use your email:**
- To send weekly perk alerts (newsletter)
- To follow up on submitted perks
- You can unsubscribe at any time

**Cookies:**
- We use minimal cookies for basic site functionality
- No advertising cookies or third-party trackers

**Third-party services:**
- Google Sheets (email storage)
- Vercel (hosting)

**Contact:**
For privacy concerns, email: contact@studentperks.fun`,
  },
  "/terms": {
    title: "Terms of Use",
    updated: "April 2026",
    content: `By using StudentPerks.fun, you agree to these terms.

**Use of the site:**
- StudentPerks.fun is a free resource for students
- You may not scrape, copy, or redistribute our curated content without permission
- You may not use the site for any illegal purpose

**Accuracy of offers:**
- We strive to keep all listings accurate but cannot guarantee every offer is currently active
- Always verify offers on the provider's website
- Offer terms, pricing, and availability may change without notice

**Affiliate disclosure:**
- Some links may be affiliate links
- We only list tools we genuinely recommend
- Affiliate relationships do not influence our editorial decisions

**Intellectual property:**
- The StudentPerks.fun name, logo, and content are our intellectual property
- Tool logos and names belong to their respective owners

**Limitation of liability:**
- StudentPerks.fun is not liable for any loss or damage resulting from use of listed offers
- We are not responsible for third-party websites or their practices

**Changes to terms:**
- We may update these terms at any time
- Continued use of the site means acceptance of updated terms

**Contact:**
contact@studentperks.fun`,
  },
};

function renderContent(text: string) {
  return text.split("\n\n").map((block, i) => {
    if (block.startsWith("**") && block.endsWith("**")) {
      return <h3 key={i} className="font-bold text-lg mt-8 mb-3" style={{ color: "var(--on-surface)" }}>{block.replace(/\*\*/g, "")}</h3>;
    }
    if (block.startsWith("**")) {
      const heading = block.match(/^\*\*(.*?)\*\*/)?.[1] || "";
      const rest = block.replace(/^\*\*.*?\*\*\n?/, "");
      return (
        <div key={i} className="mb-4">
          <h3 className="font-bold text-base mt-6 mb-2" style={{ color: "var(--on-surface)" }}>{heading}</h3>
          {rest.split("\n").map((line, j) => {
            if (line.startsWith("- ")) {
              return <li key={j} className="ml-4 text-sm leading-relaxed list-disc mb-1" style={{ color: "var(--on-surface-variant)" }}>{line.slice(2)}</li>;
            }
            return line.trim() ? <p key={j} className="text-sm leading-relaxed mb-2" style={{ color: "var(--on-surface-variant)" }}>{line}</p> : null;
          })}
        </div>
      );
    }
    if (block.startsWith("- ")) {
      return (
        <ul key={i} className="mb-4">
          {block.split("\n").map((line, j) => (
            <li key={j} className="ml-4 text-sm leading-relaxed list-disc mb-1" style={{ color: "var(--on-surface-variant)" }}>{line.replace(/^- /, "")}</li>
          ))}
        </ul>
      );
    }
    return <p key={i} className="text-sm leading-relaxed mb-4" style={{ color: "var(--on-surface-variant)" }}>{block}</p>;
  });
}

export default function LegalPage() {
  const { pathname } = useLocation();
  const page = PAGES[pathname];

  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  if (!page) {
    return (
      <><LegalNav />
        <div className="min-h-screen pt-28 pb-24 px-6 text-center" style={{ background: "var(--bg)" }}>
          <h1 className="font-fraunces text-3xl font-black mb-4" style={{ color: "var(--on-surface)" }}>Page not found</h1>
          <Link to="/" className="text-sm font-bold" style={{ color: "var(--primary)" }}>← Back to Home</Link>
        </div>
      </>
    );
  }

  return (
    <><LegalNav />
      <div className="min-h-screen pt-28 pb-24 px-6" style={{ background: "var(--bg)" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-[800px] mx-auto">
          <Link to="/" className="text-sm font-bold mb-8 inline-flex items-center gap-1 hover:opacity-70 transition-opacity" style={{ color: "var(--primary)" }}>
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <h1 className="font-fraunces text-3xl md:text-4xl font-black mb-2 mt-4" style={{ color: "var(--on-surface)" }}>{page.title}</h1>
          <p className="text-xs font-medium mb-8" style={{ color: "var(--on-surface-variant)" }}>Last updated: {page.updated}</p>
          <article>{renderContent(page.content)}</article>
        </motion.div>
      </div>
    </>
  );
}
