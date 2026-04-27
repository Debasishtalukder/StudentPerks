import { useState, useCallback } from "react";
import { X, Download, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import monkeyImg from "../assets/monkey.png";

interface SavingsCardProps {
  isOpen: boolean;
  onClose: () => void;
  totalSavings: number;
  toolCount: number;
  toolNames: string[];
}

// ─── Pure Canvas API card renderer ───
function drawShareCard(
  totalSavings: number,
  toolCount: number,
  toolNames: string[],
  monkeyImage: HTMLImageElement
): HTMLCanvasElement {
  const W = 1200;
  const H = 630;
  const scale = 2; // retina
  const canvas = document.createElement("canvas");
  canvas.width = W * scale;
  canvas.height = H * scale;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(scale, scale);

  // ── 1. Background ──
  ctx.fillStyle = "#f5f2eb";
  ctx.fillRect(0, 0, W, H);

  // Subtle paper fold lines
  ctx.strokeStyle = "rgba(160, 152, 128, 0.045)";
  ctx.lineWidth = 1;
  for (let y = 35; y < H; y += 36) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  for (let x = 50; x < W; x += 51) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }

  // ── 2. Monkey image — right side, cover full height ──
  const imgW = monkeyImage.naturalWidth;
  const imgH = monkeyImage.naturalHeight;
  const drawW = 520;
  const drawH = H;
  const drawX = W - drawW + 10;
  // Source crop for cover behavior
  const srcAspect = imgW / imgH;
  const dstAspect = drawW / drawH;
  let sx = 0, sy = 0, sw = imgW, sh = imgH;
  if (srcAspect > dstAspect) {
    sw = imgH * dstAspect;
    sx = (imgW - sw) / 2;
  } else {
    sh = imgW / dstAspect;
    sy = 0;
  }
  ctx.drawImage(monkeyImage, sx, sy, sw, sh, drawX, 0, drawW, drawH);

  // ── 3. Gradient fade on left edge of monkey ──
  const grad = ctx.createLinearGradient(680, 0, 800, 0);
  grad.addColorStop(0, "rgba(245, 242, 235, 1)");
  grad.addColorStop(1, "rgba(245, 242, 235, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(680, 0, 120, H);

  // ── 4. Left side text ──

  // "Hear me out..."
  ctx.font = "italic 28px 'DM Sans', sans-serif";
  ctx.fillStyle = "#999";
  ctx.fillText("Hear me out...", 60, 80);

  // Black pill badge
  const pillX = 60;
  const pillY = 110;
  const pillW = 320;
  const pillH = 56;
  const pillR = 28;
  ctx.fillStyle = "#1C1B1B";
  ctx.beginPath();
  ctx.roundRect(pillX, pillY, pillW, pillH, pillR);
  ctx.fill();

  // "StudentPerks.fun" centered in pill
  ctx.font = "bold 26px 'DM Sans', sans-serif";
  ctx.fillStyle = "#ffffff";
  const pillText = "StudentPerks.fun";
  const pillTextW = ctx.measureText(pillText).width;
  ctx.fillText(pillText, pillX + (pillW - pillTextW) / 2, pillY + 37);

  // "saves me..."
  ctx.font = "500 26px 'DM Sans', sans-serif";
  ctx.fillStyle = "#888";
  ctx.fillText("saves me...", 60, 220);

  // Big green amount
  const amountStr = "$" + totalSavings.toLocaleString();
  ctx.font = "900 120px 'Fraunces', serif";
  ctx.fillStyle = "#1a7a4a";
  ctx.fillText(amountStr, 56, 340);

  // "per year — completely free."
  ctx.font = "500 26px 'DM Sans', sans-serif";
  ctx.fillStyle = "#666";
  ctx.fillText("per year — completely free.", 60, 400);

  // ── 5. Tool name pills ──
  const displayNames = toolNames.slice(0, 8);
  const extraCount = toolNames.length - displayNames.length;
  const allPills = [...displayNames];
  if (extraCount > 0) allPills.push(`+${extraCount} more`);

  ctx.font = "bold 22px 'DM Sans', sans-serif";
  let px = 60;
  let py = 440;
  const pillPadX = 20;
  const pillPadY = 8;
  const pillGap = 8;
  const pillRowH = 40;
  const maxPillX = 660;

  for (const name of allPills) {
    const tw = ctx.measureText(name).width;
    const pw = tw + pillPadX * 2;
    const ph = 36;

    if (px + pw > maxPillX) {
      px = 60;
      py += pillRowH;
      if (py > 520) break;
    }

    // Pill background
    ctx.fillStyle = "#e8f5ee";
    ctx.beginPath();
    ctx.roundRect(px, py, pw, ph, 20);
    ctx.fill();

    // Pill text
    ctx.fillStyle = "#1a7a4a";
    ctx.fillText(name, px + pillPadX, py + ph - pillPadY - 2);

    px += pw + pillGap;
  }

  // "Powered by StudentPerks.fun"
  ctx.font = "600 20px 'DM Sans', sans-serif";
  ctx.fillStyle = "#bbb";
  ctx.fillText(`Powered by StudentPerks.fun · ${toolCount} tools`, 60, 590);

  return canvas;
}

export default function SavingsCard({ isOpen, onClose, totalSavings, toolCount, toolNames }: SavingsCardProps) {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const displayNames = toolNames.slice(0, 8);
  const extraCount = toolNames.length - displayNames.length;

  const downloadCard = useCallback(async () => {
    setDownloading(true);
    try {
      // Load monkey image first
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = monkeyImg;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load monkey image"));
      });

      const canvas = drawShareCard(totalSavings, toolCount, toolNames, img);
      const link = document.createElement("a");
      link.download = "my-student-savings-studentperks.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Failed to generate card:", err);
    }
    setDownloading(false);
  }, [totalSavings, toolCount, toolNames]);

  const copyShareText = useCallback(async () => {
    const text = `My student ID is saving me $${totalSavings.toLocaleString()}/year using free tools! Check out StudentPerks.fun to unlock yours 👇\nhttps://studentperks.fun`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch { /* fallback */ }
  }, [totalSavings]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Dark blurred overlay */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[640px]"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute -top-3 -right-3 z-30 w-9 h-9 rounded-full bg-white shadow-xl border border-black/10 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
            >
              <X size={16} strokeWidth={2.5} />
            </button>

            {/* ─── HTML Preview Card (600×315 visible) ─── */}
            <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ width: 600, height: 315 }}>
              <div
                style={{
                  width: 1200, height: 630,
                  transform: "scale(0.5)", transformOrigin: "top left",
                  position: "relative", overflow: "hidden",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {/* Background */}
                <div style={{ position: "absolute", inset: 0, background: "#f5f2eb" }} />
                <div style={{
                  position: "absolute", inset: 0, opacity: 0.045,
                  backgroundImage: `
                    repeating-linear-gradient(0deg, transparent, transparent 35px, #a09880 35px, #a09880 36px),
                    repeating-linear-gradient(90deg, transparent, transparent 50px, #b0a890 50px, #b0a890 51px)
                  `,
                }} />
                <div style={{
                  position: "absolute", inset: 0, opacity: 0.025,
                  backgroundImage: `
                    radial-gradient(ellipse at 15% 30%, #7a7060 0%, transparent 50%),
                    radial-gradient(ellipse at 75% 70%, #8a8070 0%, transparent 45%),
                    radial-gradient(ellipse at 50% 10%, #6a6050 0%, transparent 40%),
                    radial-gradient(ellipse at 85% 25%, #7a7060 0%, transparent 35%)
                  `,
                }} />

                {/* Left content */}
                <div style={{
                  position: "absolute", left: 60, top: 50, zIndex: 10, maxWidth: 620,
                  display: "flex", flexDirection: "column", height: 530,
                }}>
                  <p style={{ fontSize: 28, fontWeight: 400, fontStyle: "italic", color: "#999", marginBottom: 18 }}>
                    Hear me out...
                  </p>
                  <div style={{ marginBottom: 18 }}>
                    <span style={{
                      display: "inline-block", background: "#1C1B1B", color: "#fff",
                      fontSize: 26, fontWeight: 800, padding: "10px 28px", borderRadius: 50,
                    }}>
                      StudentPerks.fun
                    </span>
                  </div>
                  <p style={{ fontSize: 26, fontWeight: 500, color: "#888", marginBottom: 6 }}>saves me...</p>
                  <p style={{
                    fontSize: 120, fontWeight: 900, color: "#1a7a4a", lineHeight: 1, marginBottom: 6,
                    fontFamily: "'Fraunces', serif", letterSpacing: "-0.04em",
                  }}>
                    ${totalSavings.toLocaleString()}
                  </p>
                  <p style={{ fontSize: 26, fontWeight: 500, color: "#666", marginBottom: 16 }}>
                    per year — completely free.
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: "auto" }}>
                    {displayNames.map((name) => (
                      <span key={name} style={{
                        display: "inline-block", background: "#e8f5ee", color: "#1a7a4a",
                        fontSize: 22, fontWeight: 700, padding: "4px 18px", borderRadius: 20,
                      }}>
                        {name}
                      </span>
                    ))}
                    {extraCount > 0 && (
                      <span style={{
                        display: "inline-block", background: "#e8f5ee", color: "#1a7a4a",
                        fontSize: 22, fontWeight: 700, padding: "4px 18px", borderRadius: 20,
                      }}>
                        +{extraCount} more
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 20, fontWeight: 600, color: "#bbb", letterSpacing: "0.04em", marginTop: 10 }}>
                    Powered by StudentPerks.fun · {toolCount} tools
                  </p>
                </div>

                {/* Monkey gradient fade */}
                <div style={{
                  position: "absolute", right: 0, top: 0, width: 520, height: 630, zIndex: 3,
                  background: "linear-gradient(to right, #f5f2eb 0%, transparent 22%)",
                }} />
                {/* Monkey image */}
                <img
                  src={monkeyImg} alt=""
                  style={{
                    position: "absolute", right: -10, top: 0, height: 630, width: "auto",
                    zIndex: 2, objectFit: "cover", objectPosition: "center top",
                  }}
                />
              </div>
            </div>

            {/* ─── Action buttons ─── */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={downloadCard}
                disabled={downloading}
                className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#7CF994] text-[#002109] font-bold text-sm shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                <Download size={16} />
                {downloading ? "Generating..." : "Download Card"}
              </button>
              <button
                onClick={copyShareText}
                className="flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm shadow-lg border-2 hover:shadow-xl hover:scale-[1.03] transition-all bg-white/90 backdrop-blur-sm text-[#1C1B1B] border-white/60"
              >
                {copied ? <><Check size={16} className="text-emerald-600" /> Copied!</> : <><Copy size={16} /> Copy Share Text</>}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
