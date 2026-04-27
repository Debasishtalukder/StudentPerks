import { motion } from "motion/react";
import { Heart, Repeat2 } from "lucide-react";

const TWEETS = [
  { avatar: "👨‍💻", name: "Alex Chen", handle: "@devstudent_22", text: "Just saved $249/yr on JetBrains IDEs through StudentPerks.fun. Why did nobody tell me about this sooner?? My entire CS class is signing up now.", likes: 847, retweets: 124, time: "2h" },
  { avatar: "👩‍🎨", name: "Maya Rodriguez", handle: "@maya_designs", text: "Figma Pro + Adobe CC + Canva Pro all FREE as a student?? I was paying $50/mo for Adobe alone. StudentPerks.fun is insane 🤯", likes: 1203, retweets: 289, time: "5h" },
  { avatar: "🧑‍🔬", name: "Jordan Park", handle: "@jordanpark_ml", text: "The savings calculator on StudentPerks.fun says I'm saving $1,181/year. Made a share card and my whole lab group signed up in one day.", likes: 634, retweets: 98, time: "8h" },
  { avatar: "👩‍💼", name: "Priya Sharma", handle: "@priya_codes", text: "GitHub Student Pack → Copilot → Cursor Pro → JetBrains. All free. That's $700+ in dev tools. Being a student has never been this good.", likes: 2156, retweets: 412, time: "1d" },
  { avatar: "🧑‍🎓", name: "Sam Williams", handle: "@samwill_uk", text: "Spotify + Hulu + Amazon Prime Student + YouTube Premium for under $20/mo total. StudentPerks.fun showed me all the student rates in one place.", likes: 956, retweets: 167, time: "1d" },
  { avatar: "👨‍🏫", name: "Dr. Tanaka", handle: "@prof_tanaka", text: "I now share StudentPerks.fun with every incoming freshman class. The GitHub Pack alone is worth the 5 minutes it takes to verify.", likes: 1847, retweets: 523, time: "3d" },
];

function TweetCard({ tweet, index }: { tweet: typeof TWEETS[0]; index: number; key?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="rounded-2xl p-5 border transition-all hover:shadow-lg"
      style={{ background: "var(--surface)", borderColor: "var(--outline)" }}
    >
      <div className="flex items-start gap-3 mb-3">
        <span className="text-2xl">{tweet.avatar}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm truncate" style={{ color: "var(--on-surface)" }}>{tweet.name}</span>
            <span className="text-xs" style={{ color: "var(--on-surface-variant)" }}>{tweet.handle}</span>
            <span className="text-xs ml-auto shrink-0" style={{ color: "var(--on-surface-variant)" }}>· {tweet.time}</span>
          </div>
        </div>
      </div>
      <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--on-surface)" }}>{tweet.text}</p>
      <div className="flex items-center gap-6 text-xs" style={{ color: "var(--on-surface-variant)" }}>
        <span className="flex items-center gap-1.5 hover:text-red-500 transition-colors cursor-pointer">
          <Heart size={13} /> {tweet.likes.toLocaleString()}
        </span>
        <span className="flex items-center gap-1.5 hover:text-green-500 transition-colors cursor-pointer">
          <Repeat2 size={13} /> {tweet.retweets}
        </span>
      </div>
    </motion.div>
  );
}

export default function SocialProof() {
  return (
    <section className="py-24 px-6" style={{ background: "var(--bg-secondary)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-fraunces text-4xl md:text-5xl font-black mb-3" style={{ color: "var(--on-surface)" }}>
            Students are talking 💬
          </h2>
          <p className="text-lg" style={{ color: "var(--on-surface-variant)" }}>
            See what students are saying about their savings
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TWEETS.map((tweet, i) => (
            <TweetCard key={tweet.handle} tweet={tweet} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
