import React from "react";
import { motion } from "motion/react";
import LogoImage from "./LogoImage";

export default function Hero() {
  return (
    <section className="relative pt-40 pb-24 px-6 overflow-hidden min-h-[80vh] flex flex-col items-center justify-center text-center">
      <div className="absolute inset-0 dot-grid -z-10 opacity-60"></div>
      
      {/* Floating Cards */}
      <div className="absolute inset-0 pointer-events-none hidden lg:block">
        {/* Sticky Note - Top Left */}
        <motion.div 
          initial={{ opacity: 0, x: -20, rotate: -6 }}
          animate={{ 
            opacity: 1, 
            x: 0, 
            y: [0, -8, 0],
            rotate: -6
          }}
          whileHover={{ scale: 1.1, filter: "brightness(1.1)", rotate: -4 }}
          transition={{
            y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 0.5 },
            x: { duration: 0.5 }
          }}
          className="absolute top-[18%] left-[5%] pointer-events-auto cursor-pointer"
        >
          <div className="bg-[#FFF9C4] p-5 rounded-xl shadow-lg border border-yellow-200/50 max-w-[180px]">
            <p className="font-fraunces text-lg font-bold text-[#827717]">Free for students!</p>
          </div>
        </motion.div>

        {/* Reminder Card - Top Right */}
        <motion.div 
          initial={{ opacity: 0, x: 20, rotate: 4 }}
          animate={{ 
            opacity: 1, 
            x: 0, 
            y: [0, -8, 0],
            rotate: 4
          }}
          whileHover={{ scale: 1.1, filter: "brightness(1.1)", rotate: 2 }}
          transition={{
            y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
            opacity: { duration: 0.5 },
            x: { duration: 0.5 }
          }}
          className="absolute top-[22%] right-[8%] pointer-events-auto cursor-pointer"
        >
          <div className="bg-white p-4 rounded-2xl shadow-xl border border-black/5 flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F6F3F2] rounded-lg flex items-center justify-center p-2 shadow-inner">
              <LogoImage domain="github.com" name="GitHub" className="w-full h-full" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-[#1C1B1B]">GitHub Pack</p>
              <p className="text-[10px] text-[#434655]">100+ tools</p>
            </div>
          </div>
        </motion.div>

        {/* Task Card - Bottom Left */}
        <motion.div 
          initial={{ opacity: 0, x: -20, rotate: -3 }}
          animate={{ 
            opacity: 1, 
            x: 0, 
            y: [0, -8, 0],
            rotate: -3
          }}
          whileHover={{ scale: 1.1, filter: "brightness(1.1)", rotate: -1 }}
          transition={{
            y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 },
            opacity: { duration: 0.5 },
            x: { duration: 0.5 }
          }}
          className="absolute bottom-[28%] left-[10%] pointer-events-auto cursor-pointer"
        >
          <div className="bg-white p-4 rounded-2xl shadow-xl border border-black/5 flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F6F3F2] rounded-lg flex items-center justify-center p-2 shadow-inner">
              <LogoImage domain="figma.com" name="Figma" className="w-full h-full" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-[#1C1B1B]">Figma Education</p>
              <p className="text-[10px] text-emerald-600 font-bold">Claimed ✓</p>
            </div>
          </div>
        </motion.div>

        {/* Integrations Card - Bottom Right */}
        <motion.div 
          initial={{ opacity: 0, x: 20, rotate: 6 }}
          animate={{ 
            opacity: 1, 
            x: 0, 
            y: [0, -8, 0],
            rotate: 6
          }}
          whileHover={{ scale: 1.1, filter: "brightness(1.1)", rotate: 4 }}
          transition={{
            y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 },
            opacity: { duration: 0.5 },
            x: { duration: 0.5 }
          }}
          className="absolute bottom-[22%] right-[6%] pointer-events-auto cursor-pointer"
        >
          <div className="bg-white p-4 rounded-2xl shadow-xl border border-black/5">
            <div className="flex -space-x-2 mb-2">
              {['notion.so', 'spotify.com', 'canva.com'].map((domain) => (
                <div key={domain} className="w-8 h-8 rounded-full border-2 border-white bg-white shadow-sm overflow-hidden p-1.5">
                  <LogoImage domain={domain} className="w-full h-full" />
                </div>
              ))}
            </div>
            <p className="text-[10px] font-bold text-[#434655] text-left">70+ integrations</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20, rotate: -2 }}
          animate={{ 
            opacity: 1, 
            x: 0,
            y: [0, -10, 0],
            rotate: -2
          }}
          whileHover={{ scale: 1.1, filter: "brightness(1.1)", rotate: 0 }}
          transition={{
            y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 },
            opacity: { duration: 0.5 },
            x: { duration: 0.5 }
          }}
          className="absolute top-[42%] right-[4%] pointer-events-auto"
        >
          <div className="bg-[#7CF994] p-6 rounded-2xl shadow-2xl border border-[#5EE078] max-w-[240px] text-left">
            <p className="font-fraunces text-xl font-black text-[#002109] mb-4 leading-tight">Claim your student benefits now!</p>
            <button className="w-full py-3 bg-[#002109] text-white rounded-xl font-bold text-sm hover:bg-[#002109]/80 transition-all shadow-lg shadow-black/10">
              Get Started Free
            </button>
          </div>
        </motion.div>

        {/* Corner Icons */}
        {/* GitHub - Top Left Corner */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            y: [0, -8, 0],
            rotate: -5
          }}
          whileHover={{ scale: 1.2, filter: "brightness(1.1)", rotate: 0 }}
          transition={{
            y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.2 },
            opacity: { duration: 0.5 },
            scale: { duration: 0.5 }
          }}
          className="absolute top-[5%] left-[15%] pointer-events-auto cursor-pointer"
        >
          <div className="w-[72px] h-[72px] bg-[#F6F3F2] rounded-2xl shadow-xl flex items-center justify-center p-4 border border-black/5 shadow-inner">
            <LogoImage domain="github.com" name="GitHub" className="w-full h-full" />
          </div>
        </motion.div>

        {/* Figma - Top Right Corner */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            y: [0, -8, 0],
            rotate: 5
          }}
          whileHover={{ scale: 1.2, filter: "brightness(1.1)", rotate: 0 }}
          transition={{
            y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.7 },
            opacity: { duration: 0.5 },
            scale: { duration: 0.5 }
          }}
          className="absolute top-[8%] right-[18%] pointer-events-auto cursor-pointer"
        >
          <div className="w-[72px] h-[72px] bg-[#F6F3F2] rounded-2xl shadow-xl flex items-center justify-center p-4 border border-black/5 shadow-inner">
            <LogoImage domain="figma.com" name="Figma" className="w-full h-full" />
          </div>
        </motion.div>

        {/* Notion - Bottom Left Corner */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            y: [0, -8, 0],
            rotate: 5
          }}
          whileHover={{ scale: 1.2, filter: "brightness(1.1)", rotate: 0 }}
          transition={{
            y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.2 },
            opacity: { duration: 0.5 },
            scale: { duration: 0.5 }
          }}
          className="absolute bottom-[10%] left-[18%] pointer-events-auto cursor-pointer"
        >
          <div className="w-[72px] h-[72px] bg-[#F6F3F2] rounded-2xl shadow-xl flex items-center justify-center p-4 border border-black/5 shadow-inner">
            <LogoImage domain="notion.so" name="Notion" className="w-full h-full" />
          </div>
        </motion.div>

        {/* Spotify - Bottom Right Corner */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            y: [0, -8, 0],
            rotate: -5
          }}
          whileHover={{ scale: 1.2, filter: "brightness(1.1)", rotate: 0 }}
          transition={{
            y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.7 },
            opacity: { duration: 0.5 },
            scale: { duration: 0.5 }
          }}
          className="absolute bottom-[5%] right-[15%] pointer-events-auto cursor-pointer"
        >
          <div className="w-[72px] h-[72px] bg-[#F6F3F2] rounded-2xl shadow-xl flex items-center justify-center p-4 border border-black/5 shadow-inner">
            <LogoImage domain="spotify.com" name="Spotify" className="w-full h-full" />
          </div>
        </motion.div>
      </div>

      <div className="max-w-4xl w-full relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EBE7E7] text-[#434655] text-sm font-semibold mb-8"
        >
          <span className="text-[#004AC6] text-lg">✦</span>
          70+ Free & Discounted Offers
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-fraunces text-6xl md:text-8xl font-black text-[#1C1B1B] leading-[1.1] mb-8 tracking-tight"
        >
          Your Student ID is <br />
          <span className="italic text-[#004AC6]">Worth Thousands.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-dm-sans text-xl md:text-2xl text-[#434655] max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Discover free tools, subscriptions, and discounts unlocked by your college email — filtered by your country.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-6 md:gap-12 mb-16"
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">💰</span>
            <span className="font-bold text-lg text-[#1C1B1B]">$10,000+ <span className="text-[#434655] font-normal">saved/yr</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛠️</span>
            <span className="font-bold text-lg text-[#1C1B1B]">70+ <span className="text-[#434655] font-normal">offers</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌍</span>
            <span className="font-bold text-lg text-[#1C1B1B]">50+ <span className="text-[#434655] font-normal">countries</span></span>
          </div>
        </motion.div>

        <motion.a
          href="#explore"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-br from-[#004AC6] to-[#2563EB] text-white font-bold text-lg shadow-2xl shadow-blue-500/20"
        >
          Explore Free Perks
          <span className="material-symbols-outlined">arrow_downward</span>
        </motion.a>
      </div>

      {/* Full-Width Brand Marquee */}
      <div className="mt-32 w-full marquee-container relative z-10">
        <div className="marquee-track py-10">
          {[...Array(4)].map((_, i) => (
            <React.Fragment key={i}>
              {['github.com', 'cursor.com', 'jetbrains.com', 'replit.com', 'figma.com', 'notion.so', 'canva.com', 'spotify.com', 'apple.com', 'amazon.com', 'adobe.com', 'slack.com', 'zoom.us', 'dropbox.com', 'vercel.com', 'netlify.com', 'cloudflare.com', 'heroku.com', 'postman.com', 'gitkraken.com', 'mongodb.com', 'digitalocean.com'].map((domain) => (
                <div key={`${domain}-${i}`} className="flex items-center gap-4 px-12 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
                  <div className="w-10 h-10 bg-white rounded-xl p-2 shadow-sm border border-black/5">
                    <LogoImage domain={domain} className="w-full h-full" />
                  </div>
                  <span className="text-sm font-black tracking-[0.2em] uppercase text-[#1C1B1B]">
                    {domain.split('.')[0]}
                  </span>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
