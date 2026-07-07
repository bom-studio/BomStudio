"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { BarChart3, Circle, LayoutGrid, Terminal } from "lucide-react";
import { BrandSymbol } from "@/components/logo/BrandSymbol";

export function BrowserMockup() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 20 });

  const rotateX = useTransform(springY, [-150, 150], [4, -4]);
  const rotateY = useTransform(springX, [-150, 150], [-4, 4]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      className="relative flex items-center justify-center"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ rotateX, rotateY, perspective: 1200, transformStyle: "preserve-3d" }}
        className="relative w-full max-w-md"
      >
        <div className="glass-card relative overflow-hidden rounded-2xl shadow-2xl shadow-primary/10">
          <div className="glass-reflection pointer-events-none absolute inset-0 z-10 rounded-2xl" />

          {/* Browser chrome */}
          <div className="flex items-center gap-2 border-b border-border/50 px-4 py-3">
            <div className="flex gap-1.5">
              <Circle className="h-2.5 w-2.5 fill-red-400/80 text-red-400/80" />
              <Circle className="h-2.5 w-2.5 fill-amber-400/80 text-amber-400/80" />
              <Circle className="h-2.5 w-2.5 fill-emerald-400/80 text-emerald-400/80" />
            </div>
            <div className="mx-auto flex h-6 w-48 items-center justify-center rounded-md bg-muted/60 text-[10px] text-muted-foreground">
              bomstudio.kr
            </div>
          </div>

          {/* Dashboard content */}
          <div className="grid gap-3 p-4 sm:grid-cols-5">
            <div className="space-y-3 sm:col-span-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BrandSymbol size={24} />
                  <span className="text-xs font-semibold">Dashboard</span>
                </div>
                <LayoutGrid className="h-3.5 w-3.5 text-muted-foreground" />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {["메인", "소개", "문의"].map((label) => (
                  <div
                    key={label}
                    className="rounded-xl border border-border/40 bg-muted/30 p-2.5"
                  >
                    <p className="text-[9px] text-muted-foreground">{label}</p>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        className="h-full rounded-full bg-primary/40"
                        initial={{ width: 0 }}
                        animate={{ width: "70%" }}
                        transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex h-20 items-end gap-1 rounded-xl border border-border/40 bg-muted/20 p-3">
                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 rounded-sm bg-primary/30"
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 0.6, delay: 0.8 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  />
                ))}
              </div>
            </div>

            {/* Code snippet panel */}
            <div className="rounded-xl border border-border/40 bg-neutral-950 p-3 sm:col-span-2">
              <div className="mb-2 flex items-center gap-1.5">
                <Terminal className="h-3 w-3 text-emerald-400" />
                <span className="text-[9px] text-neutral-500">page.tsx</span>
              </div>
              <pre className="text-[8px] leading-relaxed text-neutral-400">
                <code>
                  <span className="text-violet-400">export</span>{" "}
                  <span className="text-sky-400">default</span>{" "}
                  <span className="text-amber-300">function</span>{" "}
                  <span className="text-emerald-300">Page</span>
                  {"() {\n"}
                  {"  "}
                  <span className="text-violet-400">return</span>{" "}
                  <span className="text-neutral-300">{"<Hero />"}</span>
                  {";\n}"}
                </code>
              </pre>
            </div>
          </div>

          <div className="flex items-center gap-2 border-t border-border/40 px-4 py-2.5">
            <BarChart3 className="h-3 w-3 text-primary" />
            <span className="text-[10px] text-muted-foreground">
              반응형 · SEO · 빠른 로딩
            </span>
          </div>
        </div>

        <motion.div
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-4 left-1/2 h-3 w-40 -translate-x-1/2 rounded-full bg-primary/15 blur-xl"
        />
      </motion.div>
    </div>
  );
}
