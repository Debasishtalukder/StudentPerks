export interface Comparison {
  slug: string;
  toolA: { id: string; name: string; domain: string };
  toolB: { id: string; name: string; domain: string };
  title: string;
  rows: { label: string; a: string; b: string }[];
  prosA: string[];
  prosB: string[];
  verdict: string;
}

export const COMPARISONS: Comparison[] = [
  {
    slug: "figma-vs-framer",
    toolA: { id: "figma-education", name: "Figma", domain: "figma.com" },
    toolB: { id: "framer-edu", name: "Framer", domain: "framer.com" },
    title: "Figma vs Framer for Students",
    rows: [
      { label: "Primary Use", a: "UI/UX design & prototyping", b: "Website design & publishing" },
      { label: "Student Price", a: "Free Pro plan", b: "Free Basic plan" },
      { label: "Annual Value", a: "$144/yr", b: "$180/yr" },
      { label: "Verification", a: "Any student email", b: ".edu email" },
      { label: "Output", a: "Design files, prototypes", b: "Live websites" },
      { label: "Collaboration", a: "Real-time multiplayer", b: "Real-time multiplayer" },
      { label: "AI Features", a: "Figma AI (beta)", b: "Workshop AI" },
      { label: "Custom Domain", a: "No", b: "Yes, included" },
      { label: "CMS", a: "No", b: "Yes, built-in" },
      { label: "Learning Curve", a: "Medium (2-3 days)", b: "Medium (2-3 days)" },
      { label: "Industry Adoption", a: "Very high (standard)", b: "Growing fast" },
    ],
    prosA: ["Industry standard — employers expect it", "Best-in-class prototyping", "Huge plugin ecosystem", "Dev Mode for handoff", "Works for mobile + web design"],
    prosB: ["Publishes live websites directly", "Built-in CMS for blogs", "Free custom domain included", "Better web animations", "Faster path to a live portfolio"],
    verdict: "Use Figma for designing apps and interfaces. Use Framer for building live websites. Both are free for students — claim both and use each for what it does best.",
  },
  {
    slug: "notion-vs-evernote",
    toolA: { id: "notion-student", name: "Notion", domain: "notion.so" },
    toolB: { id: "evernote-student", name: "Evernote", domain: "evernote.com" },
    title: "Notion vs Evernote for Students",
    rows: [
      { label: "Primary Use", a: "All-in-one workspace", b: "Note-taking & clipping" },
      { label: "Student Price", a: "Free Plus plan", b: "50% off Professional" },
      { label: "Annual Value", a: "$96/yr", b: "~$42/yr saved" },
      { label: "Verification", a: "Any student email", b: "Any student" },
      { label: "Databases", a: "Yes, powerful", b: "No" },
      { label: "Task Management", a: "Built-in (Kanban, calendar)", b: "Basic tasks only" },
      { label: "Web Clipper", a: "Basic", b: "Excellent" },
      { label: "Offline Access", a: "Limited", b: "Full offline" },
      { label: "Templates", a: "Thousands (community)", b: "Limited" },
      { label: "API", a: "Yes, robust", b: "Yes" },
      { label: "Learning Curve", a: "Medium", b: "Easy" },
    ],
    prosA: ["All-in-one: notes + tasks + wikis + databases", "Free for students (not just discounted)", "Massive template library", "Better for project management", "More modern and actively developed"],
    prosB: ["Better web clipper for research", "Full offline access", "Simpler — just notes", "Better handwriting/scanning", "Faster for quick capture"],
    verdict: "Notion is the better choice for most students — it's completely free (not just discounted) and does everything Evernote does plus project management, databases, and wikis. Use Evernote only if you need excellent offline access or web clipping.",
  },
  {
    slug: "cursor-vs-jetbrains",
    toolA: { id: "cursor-pro", name: "Cursor", domain: "cursor.com" },
    toolB: { id: "jetbrains-ides", name: "JetBrains", domain: "jetbrains.com" },
    title: "Cursor vs JetBrains for Students",
    rows: [
      { label: "Primary Use", a: "AI-native code editor", b: "Full-featured IDE suite" },
      { label: "Student Price", a: "1 year free ($192/yr)", b: "Free all IDEs ($249/yr)" },
      { label: "Annual Value", a: "$192/yr", b: "$249/yr" },
      { label: "Verification", a: ".edu email", b: "University email" },
      { label: "AI Integration", a: "Core feature — elite models", b: "AI Assistant (add-on)" },
      { label: "Language Support", a: "All (via extensions)", b: "Specialized per IDE" },
      { label: "Performance", a: "Lightweight (Electron)", b: "Heavy but powerful" },
      { label: "Refactoring", a: "AI-assisted", b: "Best-in-class traditional" },
      { label: "Debugging", a: "Basic + AI help", b: "Advanced (breakpoints, profiling)" },
      { label: "Database Tools", a: "Via extensions", b: "DataGrip included" },
      { label: "Best For", a: "AI-first rapid coding", b: "Enterprise-grade development" },
    ],
    prosA: ["AI is a first-class citizen, not an add-on", "Lightweight and fast to start", "Familiar VS Code interface", "$20/month AI credits included", "Great for learning new languages with AI help"],
    prosB: ["Best debugger in the industry", "Specialized IDEs (IntelliJ, PyCharm, WebStorm)", "Superior refactoring tools", "Built-in database tools", "Better for large enterprise codebases"],
    verdict: "Use Cursor for AI-assisted rapid development and learning. Use JetBrains for serious Java/Python/web projects that need advanced debugging and refactoring. Both are free — install both and use each where it shines.",
  },
  {
    slug: "spotify-vs-apple-music",
    toolA: { id: "spotify-student", name: "Spotify", domain: "spotify.com" },
    toolB: { id: "apple-music-student", name: "Apple Music", domain: "apple.com" },
    title: "Spotify vs Apple Music Student Plans",
    rows: [
      { label: "Student Price", a: "$5.99/mo", b: "$5.99/mo" },
      { label: "Includes", a: "Hulu (ad-supported)", b: "Apple TV+" },
      { label: "Verification", a: "SheerID", b: ".edu email" },
      { label: "Audio Quality", a: "Up to 320kbps (OGG)", b: "Lossless + Spatial Audio" },
      { label: "Free Trial", a: "1 month", b: "1 month" },
      { label: "Offline Downloads", a: "Yes", b: "Yes" },
      { label: "Algorithm", a: "Excellent discovery", b: "Good, improving" },
      { label: "Social Features", a: "Collaborative playlists, Wrapped", b: "Minimal" },
      { label: "Podcast Support", a: "Built-in", b: "Separate app" },
      { label: "Cross-Platform", a: "All platforms + web", b: "Apple ecosystem + Android/web" },
      { label: "Library Size", a: "100M+ tracks", b: "100M+ tracks" },
    ],
    prosA: ["Includes Hulu (ad-supported) — huge value", "Better music discovery algorithm", "Better social features (Wrapped, playlists)", "Built-in podcasts", "Works great on all platforms"],
    prosB: ["Lossless + Spatial Audio included", "Includes Apple TV+", "Better integration with Apple devices", "Cleaner interface", "Better for classical music"],
    verdict: "Spotify Student is the better value for most students — you get Hulu included, better discovery, and it works everywhere. Choose Apple Music if you're deep in the Apple ecosystem and care about lossless audio quality.",
  },
];
