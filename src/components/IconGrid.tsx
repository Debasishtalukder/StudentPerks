import { PERKS } from "../data/perks";
import React from "react";
import LogoImage from "./LogoImage";

// Get unique companies from PERKS data
const TOOLS = Array.from(
  new Map(PERKS.map((perk) => [perk.company, { name: perk.company, domain: perk.domain }])).values()
);

const ToolIcon: React.FC<{ tool: { name: string; domain: string } }> = ({ tool }) => {
  return (
    <div
      className="perk-card visible flex items-center gap-4 bg-white/40 backdrop-blur-sm px-8 py-4 rounded-2xl border border-black/5 hover:border-[#2563EB]/20 transition-all duration-300 mx-4"
    >
      <div className="w-10 h-10 flex items-center justify-center bg-white rounded-xl p-2 shadow-sm overflow-hidden">
        <LogoImage domain={tool.domain} name={tool.name} className="w-full h-full" />
      </div>
      <span className="text-xs font-black tracking-[0.2em] uppercase text-[#434655]">
        {tool.name}
      </span>
    </div>
  );
};

export default function IconGrid() {
  // Duplicate tools for seamless loop
  const marqueeTools = [...TOOLS, ...TOOLS, ...TOOLS, ...TOOLS];

  return (
    <section className="py-32 bg-[#F7F7F7] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-20 text-center">
        <span className="inline-block px-4 py-1.5 mb-6 text-xs font-black tracking-widest uppercase bg-[#7CF994] text-[#002109] rounded-full">
          Curated Ecosystem
        </span>
        <h2 className="font-fraunces text-5xl md:text-7xl font-black leading-tight text-[#1C1B1B] tracking-tight mb-6">
          Unlock the tools the world's best students use.
        </h2>
        <p className="text-lg text-[#434655] font-dm-sans max-w-2xl mx-auto">
          A definitive collection of essential academic and creative software, negotiated specifically for the next generation of builders.
        </p>
      </div>

      <div className="w-full marquee-container">
        <div className="marquee-track py-10">
          {marqueeTools.map((tool, idx) => (
            <ToolIcon key={`${tool.name}-${idx}`} tool={tool} />
          ))}
        </div>
      </div>
    </section>
  );
}
