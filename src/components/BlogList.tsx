import { Link } from "react-router-dom";
import { ArrowRight, Clock, Tag } from "lucide-react";
import { motion } from "motion/react";
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

export default function BlogList() {
  return (
    <>
      <BlogNav />
      <div className="min-h-screen pt-28 pb-24 px-6" style={{ background: "var(--bg)" }}>
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <Link to="/" className="text-sm font-bold mb-6 inline-flex items-center gap-1 hover:opacity-70 transition-opacity" style={{ color: "var(--primary)" }}>
            ← Back to Perks
          </Link>
          <h1 className="font-fraunces text-4xl md:text-5xl font-black mb-4" style={{ color: "var(--on-surface)" }}>
            Blog & Guides
          </h1>
          <p className="text-lg" style={{ color: "var(--on-surface-variant)" }}>
            Guides, comparisons, and tips to help you maximize your student benefits.
          </p>
        </motion.div>

        <div className="space-y-6">
          {BLOG_POSTS.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                to={`/blog/${post.slug}`}
                className="block rounded-2xl p-6 md:p-8 border transition-all hover:shadow-lg group"
                style={{ background: "var(--surface)", borderColor: "var(--outline)" }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold" style={{ background: "var(--bg-secondary)", color: "var(--primary)" }}>
                    <Tag size={11} /> {post.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs" style={{ color: "var(--on-surface-variant)" }}>
                    <Clock size={11} /> {post.readTime}
                  </span>
                  <span className="text-xs" style={{ color: "var(--on-surface-variant)" }}>{post.date}</span>
                </div>
                <h2 className="font-fraunces text-xl md:text-2xl font-black mb-2 group-hover:text-[#2563EB] transition-colors" style={{ color: "var(--on-surface)" }}>
                  {post.title}
                </h2>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--on-surface-variant)" }}>
                  {post.excerpt}
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-bold transition-colors" style={{ color: "var(--primary)" }}>
                  Read article <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}
