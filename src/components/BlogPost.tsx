import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock, Tag, Twitter, Linkedin, Copy, Check } from "lucide-react";
import { motion } from "motion/react";
import { useState, useMemo, useEffect } from "react";
import type { ReactNode } from "react";
import { BLOG_POSTS } from "../data/blog";

function BlogNav() {
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
          <Link to="/blog" className="text-sm font-semibold" style={{ color: "var(--primary)" }}>Blog</Link>
          <Link to="/#explore" className="text-sm font-semibold" style={{ color: "var(--on-surface-variant)" }}>Perks</Link>
        </div>
      </div>
    </nav>
  );
}

// Simple markdown-ish renderer
function renderContent(md: string) {
  const lines = md.trim().split("\n");
  const elements: ReactNode[] = [];
  let inTable = false;
  let tableRows: string[][] = [];
  let tableKey = 0;

  const flushTable = () => {
    if (tableRows.length < 2) return;
    const headers = tableRows[0];
    const rows = tableRows.slice(2); // skip separator row
    elements.push(
      <div key={`table-${tableKey++}`} className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>{headers.map((h, i) => <th key={i} className="text-left px-3 py-2 font-bold border-b-2" style={{ borderColor: "var(--outline)", color: "var(--on-surface)" }}>{h.trim()}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>{row.map((cell, ci) => <td key={ci} className="px-3 py-2 border-b" style={{ borderColor: "var(--outline)", color: "var(--on-surface-variant)" }}>{cell.trim()}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableRows = [];
    inTable = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("|")) {
      inTable = true;
      tableRows.push(line.split("|").filter(Boolean));
      continue;
    } else if (inTable) {
      flushTable();
    }

    if (line.startsWith("## ")) {
      elements.push(<h2 key={i} id={line.slice(3).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")} className="font-fraunces text-2xl font-black mt-10 mb-4 scroll-mt-24" style={{ color: "var(--on-surface)" }}>{line.slice(3)}</h2>);
    } else if (line.startsWith("### ")) {
      elements.push(<h3 key={i} className="font-bold text-lg mt-6 mb-2" style={{ color: "var(--on-surface)" }}>{line.slice(4)}</h3>);
    } else if (line.startsWith("---")) {
      elements.push(<hr key={i} className="my-8 border-0 h-px" style={{ background: "var(--outline)" }} />);
    } else if (line.startsWith("- **")) {
      const text = line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="underline" style="color:var(--primary)">$1</a>');
      elements.push(<li key={i} className="ml-4 mb-1.5 text-sm leading-relaxed list-disc" style={{ color: "var(--on-surface-variant)" }} dangerouslySetInnerHTML={{ __html: text }} />);
    } else if (line.startsWith("- ")) {
      const text = line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="underline" style="color:var(--primary)">$1</a>');
      elements.push(<li key={i} className="ml-4 mb-1.5 text-sm leading-relaxed list-disc" style={{ color: "var(--on-surface-variant)" }} dangerouslySetInnerHTML={{ __html: text }} />);
    } else if (line.match(/^\d+\.\s/)) {
      const text = line.replace(/^\d+\.\s/, "").replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="underline" style="color:var(--primary)">$1</a>');
      elements.push(<li key={i} className="ml-4 mb-1.5 text-sm leading-relaxed list-decimal" style={{ color: "var(--on-surface-variant)" }} dangerouslySetInnerHTML={{ __html: text }} />);
    } else if (line.trim() === "") {
      // skip
    } else {
      const text = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="underline" style="color:var(--primary)">$1</a>');
      elements.push(<p key={i} className="text-sm leading-relaxed mb-3" style={{ color: "var(--on-surface-variant)" }} dangerouslySetInnerHTML={{ __html: text }} />);
    }
  }
  if (inTable) flushTable();
  return elements;
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  const [copied, setCopied] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  const toc = useMemo(() => {
    if (!post) return [];
    const headings: { text: string; id: string }[] = [];
    for (const line of post.content.split("\n")) {
      if (line.startsWith("## ")) {
        const text = line.slice(3).trim();
        headings.push({ text, id: text.toLowerCase().replace(/[^a-z0-9]+/g, "-") });
      }
    }
    return headings;
  }, [post]);

  const related = useMemo(() => {
    if (!post) return [];
    return BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);
  }, [post]);

  if (!post) {
    return (
      <>
        <BlogNav />
        <div className="min-h-screen pt-28 pb-24 px-6 text-center" style={{ background: "var(--bg)" }}>
          <h1 className="font-fraunces text-3xl font-black mb-4" style={{ color: "var(--on-surface)" }}>Article not found</h1>
          <Link to="/blog" className="text-sm font-bold" style={{ color: "var(--primary)" }}>← Back to Blog</Link>
        </div>
      </>
    );
  }

  const shareUrl = window.location.href;
  const shareText = `${post.title} — StudentPerks.fun`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <BlogNav />
      <div className="min-h-screen pt-28 pb-24 px-6" style={{ background: "var(--bg)" }}>
      <div className="max-w-6xl mx-auto flex gap-12">
        {/* Sticky TOC sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-28">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--on-surface-variant)" }}>On this page</p>
            <nav className="space-y-2">
              {toc.map((h) => (
                <a key={h.id} href={`#${h.id}`} className="block text-xs font-medium leading-snug py-1 hover:opacity-70 transition-opacity truncate" style={{ color: "var(--on-surface-variant)" }}>
                  {h.text}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/blog" className="text-sm font-bold mb-6 inline-flex items-center gap-1 hover:opacity-70 transition-opacity" style={{ color: "var(--primary)" }}>
              <ArrowLeft size={14} /> Back to Blog
            </Link>

            <div className="flex items-center gap-3 mb-4 mt-4">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold" style={{ background: "var(--bg-secondary)", color: "var(--primary)" }}>
                <Tag size={11} /> {post.category}
              </span>
              <span className="inline-flex items-center gap-1 text-xs" style={{ color: "var(--on-surface-variant)" }}>
                <Clock size={11} /> {post.readTime}
              </span>
              <span className="text-xs" style={{ color: "var(--on-surface-variant)" }}>{post.date}</span>
            </div>

            <h1 className="font-fraunces text-3xl md:text-4xl font-black mb-4 leading-tight" style={{ color: "var(--on-surface)" }}>
              {post.title}
            </h1>
            <p className="text-base mb-8 leading-relaxed" style={{ color: "var(--on-surface-variant)" }}>
              {post.excerpt}
            </p>

            {/* Share buttons */}
            <div className="flex items-center gap-2 mb-10 pb-8 border-b" style={{ borderColor: "var(--outline)" }}>
              <span className="text-xs font-bold mr-2" style={{ color: "var(--on-surface-variant)" }}>Share:</span>
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ background: "var(--bg-secondary)", color: "var(--on-surface-variant)" }}>
                <Twitter size={14} />
              </a>
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ background: "var(--bg-secondary)", color: "var(--on-surface-variant)" }}>
                <Linkedin size={14} />
              </a>
              <button onClick={copyLink}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ background: "var(--bg-secondary)", color: copied ? "#16A34A" : "var(--on-surface-variant)" }}>
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>

            {/* Article content */}
            <article className="prose-sm">
              {renderContent(post.content)}
            </article>

            {/* CTA */}
            <div className="mt-12 p-6 rounded-2xl border text-center" style={{ background: "var(--bg-secondary)", borderColor: "var(--outline)" }}>
              <p className="font-bold mb-2" style={{ color: "var(--on-surface)" }}>Found this helpful?</p>
              <p className="text-sm mb-4" style={{ color: "var(--on-surface-variant)" }}>Explore all 150+ student perks on StudentPerks.fun</p>
              <Link to="/#explore" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-br from-[#004AC6] to-[#2563EB] text-white font-bold text-sm shadow-lg hover:scale-105 transition-transform">
                Browse All Perks <ArrowRight size={14} />
              </Link>
            </div>

            {/* Related articles */}
            {related.length > 0 && (
              <div className="mt-16">
                <h3 className="font-fraunces text-xl font-black mb-6" style={{ color: "var(--on-surface)" }}>Related Articles</h3>
                <div className="space-y-4">
                  {related.map((r) => (
                    <Link key={r.slug} to={`/blog/${r.slug}`}
                      className="block p-4 rounded-xl border transition-all hover:shadow-md group"
                      style={{ background: "var(--surface)", borderColor: "var(--outline)" }}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "var(--bg-secondary)", color: "var(--primary)" }}>{r.category}</span>
                        <span className="text-[10px]" style={{ color: "var(--on-surface-variant)" }}>{r.readTime}</span>
                      </div>
                      <p className="font-bold text-sm group-hover:text-[#2563EB] transition-colors" style={{ color: "var(--on-surface)" }}>{r.title}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
    </>
  );
}
