"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Activity,
  BadgeCheck,
  BarChart3,
  Barcode,
  Boxes,
  Camera,
  Check,
  ChevronRight,
  Fingerprint,
  Gauge,
  Globe2,
  LockKeyhole,
  MapPin,
  Moon,
  PackageCheck,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Smartphone,
  Sun,
  Tags,
  Users,
  WandSparkles,
  Zap
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type InfoItem = readonly [string, string, LucideIcon];
type ThemeMode = "white" | "black";
type ScanStatus = "valid" | "warning";
type VerifiedSeal = {
  code: string;
  product: string;
  batch: string;
  region: string;
  scanCount: string;
  texture: string;
  risk: string;
  note: string;
};

const issues: InfoItem[] = [
  ["Counterfeit leakage", "Detect copied packs before they damage trust.", ShieldCheck],
  ["Weak customer proof", "Let buyers verify every product in seconds.", Smartphone],
  ["Warranty fraud", "Connect claims to genuine, scan-verified items.", BadgeCheck],
  ["Blind supply routes", "See scan clusters, suspicious regions, and repeat attempts.", MapPin]
];

const features: InfoItem[] = [
  ["Copy-resistant marks", "Each seal blends optical texture, micro-patterns, and a secure code.", Fingerprint],
  ["Phone-first verification", "No special scanner needed for customers, retailers, or field teams.", Camera],
  ["Consumer journeys", "Show product details, rewards, care tips, and warranty flows after scan.", Users],
  ["Brand intelligence", "Turn every verification into regional demand and risk signals.", BarChart3],
  ["Low-change rollout", "Works on cartons, labels, pouches, bottles, and spare part packaging.", Boxes],
  ["Instant alerts", "Flag duplicate scans, unusual velocity, and mismatched locations.", Zap]
];

const industries = ["Lubricants", "Agrochemicals", "FMCG", "Auto parts", "Pharma", "Electronics"];

const verifiedSeals: VerifiedSeal[] = [
  {
    code: "SSAI-7429-IND",
    product: "Genuine product",
    batch: "LX-482",
    region: "Lucknow, UP",
    scanCount: "First scan",
    texture: "99.94%",
    risk: "Low",
    note: "Original SealSure label. Warranty and loyalty can be activated."
  },
  {
    code: "SSAI-1184-DEL",
    product: "Genuine product",
    batch: "DL-118",
    region: "Delhi NCR",
    scanCount: "Second scan",
    texture: "98.71%",
    risk: "Medium",
    note: "Genuine label, but repeat scan detected. Ask buyer to confirm pack ownership."
  },
  {
    code: "SSAI-6502-MUM",
    product: "Genuine product",
    batch: "MH-650",
    region: "Mumbai, MH",
    scanCount: "First scan",
    texture: "99.12%",
    risk: "Low",
    note: "Original label with clean geo and batch history."
  }
];

function makeReviewSeal(code: string): VerifiedSeal {
  return {
    code: code || "UNKNOWN-CODE",
    product: "Barcode review needed",
    batch: "Not registered",
    region: "Unknown",
    scanCount: "Blocked",
    texture: "42.18%",
    risk: "High",
    note: "This barcode is not in the verified SealSure registry."
  };
}

function buildBarcodeBars(code: string) {
  const cleanCode = code.replace(/[^A-Z0-9]/gi, "") || "SEALSURE";

  return cleanCode.split("").flatMap((char, index) => {
    const seed = char.charCodeAt(0) + index * 19;
    return [2 + (seed % 4), 1, 1 + ((seed >> 2) % 3), 1, 3 + ((seed >> 4) % 4), 2];
  });
}

function BarcodeMark({ code, compact = false }: { code: string; compact?: boolean }) {
  const bars = useMemo(() => buildBarcodeBars(code), [code]);
  const total = bars.reduce((sum, width) => sum + width, 0);
  let cursor = 10;

  return (
    <svg
      viewBox="0 0 260 110"
      role="img"
      aria-label={`Barcode ${code}`}
      className="h-full w-full"
      style={{ color: "#101820" }}
      preserveAspectRatio="none"
    >
      <rect width="260" height="110" rx="10" fill="white" />
      {bars.map((width, index) => {
        const rectWidth = (width / total) * 240;
        const rect = index % 2 === 0 ? (
          <rect
            key={`${code}-${index}`}
            x={cursor}
            y="12"
            width={Math.max(rectWidth, 2)}
            height={compact ? 56 : 70}
            rx="1"
            fill="currentColor"
          />
        ) : null;
        cursor += rectWidth;
        return rect;
      })}
      <text
        x="130"
        y={compact ? 92 : 98}
        textAnchor="middle"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fontSize={compact ? 12 : 14}
        fontWeight="800"
        fill="#101820"
      >
        {code}
      </text>
    </svg>
  );
}

export default function Home() {
  const [theme, setTheme] = useState<ThemeMode>("white");
  const [sealCode, setSealCode] = useState(verifiedSeals[0].code);
  const [activeSeal, setActiveSeal] = useState<VerifiedSeal>(verifiedSeals[0]);
  const [scanStatus, setScanStatus] = useState<ScanStatus>("valid");
  const isValidScan = scanStatus === "valid";

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("sealsure-theme");
    if (savedTheme === "black" || savedTheme === "white") {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("sealsure-theme", theme);
  }, [theme]);

  function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedCode = sealCode.trim().toUpperCase();
    const matchedSeal = verifiedSeals.find((seal) => seal.code === normalizedCode);

    if (matchedSeal) {
      setActiveSeal(matchedSeal);
      setSealCode(matchedSeal.code);
      setScanStatus("valid");
      return;
    }

    setActiveSeal(makeReviewSeal(normalizedCode));
    setSealCode(normalizedCode);
    setScanStatus("warning");
  }

  function scanSample(seal: VerifiedSeal) {
    setSealCode(seal.code);
    setActiveSeal(seal);
    setScanStatus("valid");
  }

  return (
    <main data-theme={theme} className="min-h-screen overflow-x-hidden bg-mist pt-[76px] text-ink transition-colors duration-300">
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-ink/10 bg-mist/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <a href="#" className="flex items-center gap-3" aria-label="SealSure AI home">
            <span className="grid size-10 place-items-center rounded-lg bg-ink text-mint">
              <ShieldCheck size={22} />
            </span>
            <span className="text-lg font-black tracking-normal">SealSure AI</span>
          </a>
          <div className="hidden items-center gap-7 text-sm font-semibold text-ink/70 md:flex">
            <a href="#platform" className="hover:text-ink">Platform</a>
            <a href="#solutions" className="hover:text-ink">Solutions</a>
            <a href="#workflow" className="hover:text-ink">Workflow</a>
            <a href="#contact" className="hover:text-ink">Contact</a>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Change black or white theme"
              aria-pressed={theme === "black"}
              onClick={() => setTheme((currentTheme) => (currentTheme === "white" ? "black" : "white"))}
              className="inline-flex h-11 items-center gap-2 rounded-md border border-ink/15 bg-white px-3 text-sm font-black text-ink transition hover:border-ink/35"
            >
              {theme === "white" ? <Moon size={17} /> : <Sun size={17} />}
              <span className="hidden sm:inline">{theme === "white" ? "Black" : "White"}</span>
            </button>
            <a
              href="#contact"
              className="inline-flex h-11 items-center gap-2 rounded-md bg-ink px-3 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5 sm:px-4"
            >
              <span className="sm:hidden">Demo</span>
              <span className="hidden sm:inline">Book demo</span>
              <ChevronRight size={17} />
            </a>
          </div>
        </div>
      </nav>

      <section className="relative border-b border-ink/10 bg-[#eef4ef]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 md:grid-cols-[1.02fr_0.98fr] md:px-8 lg:py-20">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-fern/20 bg-white px-3 py-1.5 text-sm font-bold text-fern">
              <Sparkles size={16} />
              Product authentication for high-trust brands
            </div>
            <h1 className="text-5xl font-black leading-[0.98] tracking-normal text-ink md:text-7xl">
              SealSure AI
            </h1>
            <p className="mt-6 max-w-xl text-xl leading-8 text-ink/72">
              Copy-resistant product seals, phone-based verification, and live
              counterfeit intelligence for brands that cannot afford fake goods.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#platform"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-coral px-5 text-sm font-black text-white shadow-soft transition hover:-translate-y-0.5"
              >
                Explore platform
                <ChevronRight size={18} />
              </a>
              <a
                href="#barcode-checker"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-ink/15 bg-white px-5 text-sm font-black text-ink transition hover:border-ink/35"
              >
                <Barcode size={18} />
                Try barcode check
              </a>
            </div>
            <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
              {[
                ["99.9%", "scan confidence"],
                ["4 sec", "buyer check"],
                ["24/7", "risk alerts"]
              ].map(([value, label]) => (
                <div key={label} className="border-l border-ink/15 pl-4">
                  <div className="text-2xl font-black">{value}</div>
                  <div className="mt-1 text-sm font-semibold text-ink/58">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[620px] pb-6">
            <div className="scan-grid absolute inset-6 rounded-[2rem] border border-fern/10 bg-white/40" />
            <div className="relative grid gap-5 rounded-[1.6rem] border border-white/80 bg-white/72 p-4 shadow-soft backdrop-blur md:p-5">
              <div className="rounded-2xl bg-ink p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white/60">Live scan</p>
                    <h2 className="mt-1 text-2xl font-black">{activeSeal.product}</h2>
                  </div>
                  <div className={`grid size-12 place-items-center rounded-full ${isValidScan ? "bg-mint text-ink" : "bg-coral text-white"}`}>
                    {isValidScan ? <Check size={24} strokeWidth={3} /> : <ScanLine size={24} />}
                  </div>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-[0.72fr_1fr]">
                  <div className="security-label relative mx-auto aspect-[4/5] w-full max-w-56 overflow-hidden rounded-xl p-4 sm:max-w-none">
                    <div className="label-thread size-full rounded-lg border-8 border-white/85 shadow-inner" />
                    <div className="absolute left-5 top-5 rounded-md bg-white px-2 py-1 text-xs font-black text-ink">
                      SS-AI
                    </div>
                    <div className="absolute bottom-5 left-5 right-5 h-16 overflow-hidden rounded-lg border border-ink/10 bg-white p-1">
                      <BarcodeMark code={activeSeal.code} compact />
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      ["Texture match", activeSeal.texture],
                      ["Code integrity", isValidScan ? "Valid" : "Unknown"],
                      ["Region", activeSeal.region],
                      ["Scan count", activeSeal.scanCount]
                    ].map(([k, v]) => (
                      <div key={k} className="rounded-lg bg-white/10 p-3">
                        <div className="text-xs font-semibold text-white/48">{k}</div>
                        <div className="mt-1 text-lg font-black">{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <form
                id="barcode-checker"
                onSubmit={handleVerify}
                className="rounded-xl border border-ink/10 bg-white p-4"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                  <label className="flex-1">
                    <span className="flex items-center gap-2 text-sm font-black text-fern">
                      <Barcode size={17} />
                      Barcode / seal code
                    </span>
                    <input
                      value={sealCode}
                      onChange={(event) => setSealCode(event.target.value)}
                      className="mt-2 h-12 w-full rounded-md border border-ink/15 bg-mist px-3 font-mono text-sm font-black uppercase text-ink outline-none transition focus:border-fern"
                      placeholder="SSAI-7429-IND"
                    />
                  </label>
                  <button
                    type="submit"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-coral px-4 text-sm font-black text-white shadow-soft"
                  >
                    <PackageCheck size={18} />
                    Verify
                  </button>
                </div>
                <div className="mt-4 rounded-lg border border-ink/10 bg-mist p-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-semibold text-ink/66">{activeSeal.note}</p>
                    <span className={`w-fit rounded-full px-3 py-1 text-xs font-black ${isValidScan ? "bg-mint text-ink" : "bg-coral text-white"}`}>
                      {isValidScan ? "Verified" : "Not verified"}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {verifiedSeals.map((seal) => (
                      <button
                        key={seal.code}
                        type="button"
                        onClick={() => scanSample(seal)}
                        className="rounded-md border border-ink/10 bg-white px-3 py-2 font-mono text-xs font-black text-ink transition hover:border-fern"
                      >
                        {seal.code}
                      </button>
                    ))}
                  </div>
                </div>
              </form>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  [Activity, "Risk", activeSeal.risk],
                  [Globe2, "Batch", activeSeal.batch],
                  [Gauge, "Seal code", activeSeal.code]
                ].map(([Icon, label, value]) => (
                  <div key={String(label)} className="rounded-xl border border-ink/10 bg-white p-4">
                    <Icon className="text-fern" size={21} />
                    <p className="mt-4 text-sm font-semibold text-ink/50">{String(label)}</p>
                    <p className="mt-1 break-words text-xl font-black">{String(value)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="solutions" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-black uppercase text-coral">Where it helps</p>
            <h2 className="mt-3 text-4xl font-black tracking-normal md:text-5xl">
              Built for the messy parts of product trust.
            </h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {issues.map(([title, text, Icon]) => (
              <article key={title} className="rounded-lg border border-ink/10 bg-mist p-5">
                <Icon className="text-fern" size={27} />
                <h3 className="mt-6 text-xl font-black">{title}</h3>
                <p className="mt-3 leading-7 text-ink/63">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="platform" className="border-y border-ink/10 bg-[#f8faf7] py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-[0.92fr_1.08fr] md:px-8">
          <div>
            <p className="text-sm font-black uppercase text-fern">The platform</p>
            <h2 className="mt-3 text-4xl font-black tracking-normal md:text-5xl">
              Secure labels plus the software layer behind them.
            </h2>
            <p className="mt-5 text-lg leading-8 text-ink/66">
              SealSure AI gives brands a complete verification loop: unique
              physical seals, mobile authentication, consumer engagement, and
              actionable dashboards for operations teams.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map(([title, text, Icon]) => (
              <article key={title} className="rounded-lg border border-ink/10 bg-white p-5 shadow-[0_10px_34px_rgba(16,24,32,0.06)]">
                <Icon className="text-coral" size={25} />
                <h3 className="mt-5 text-lg font-black">{title}</h3>
                <p className="mt-2 leading-7 text-ink/62">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="bg-ink py-20 text-white">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-black uppercase text-mint">How it works</p>
              <h2 className="mt-3 text-4xl font-black tracking-normal md:text-5xl">
                From production line to post-purchase trust.
              </h2>
            </div>
            <a
              href="#contact"
              className="inline-flex h-12 w-fit items-center gap-2 rounded-md bg-white px-5 text-sm font-black text-ink"
            >
              <WandSparkles size={18} />
              Plan rollout
            </a>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-4">
            {[
              ["01", "Print unique seals", "Micro-patterns and cryptographic codes are assigned to each product."],
              ["02", "Activate batches", "Operations teams map seals to SKU, plant, route, and distributor."],
              ["03", "Scan anywhere", "Consumers or field teams verify product authenticity on a phone."],
              ["04", "Act on signals", "Duplicate scans, suspicious geography, and demand trends become alerts."]
            ].map(([num, title, text]) => (
              <article key={num} className="rounded-lg border border-white/12 bg-white/6 p-5">
                <div className="text-sm font-black text-amber">{num}</div>
                <h3 className="mt-8 text-xl font-black">{title}</h3>
                <p className="mt-3 leading-7 text-white/64">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-[1fr_0.85fr] md:px-8">
          <div className="rounded-xl border border-ink/10 bg-mist p-5 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase text-fern">Command center</p>
                <h2 className="mt-2 text-3xl font-black">Counterfeit risk map</h2>
              </div>
              <div className="rounded-md bg-coral px-3 py-2 text-sm font-black text-white">
                12 alerts
              </div>
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
              <div className="relative min-h-[320px] overflow-hidden rounded-lg bg-[#dcebe2] p-5">
                {[
                  "left-[18%] top-[22%]",
                  "left-[56%] top-[36%]",
                  "left-[72%] top-[58%]",
                  "left-[35%] top-[66%]"
                ].map((pos, idx) => (
                  <span
                    key={pos}
                    className={`absolute ${pos} grid size-14 place-items-center rounded-full border-4 border-white bg-coral text-sm font-black text-white shadow-soft`}
                  >
                    {idx + 3}
                  </span>
                ))}
                <div className="absolute bottom-5 left-5 right-5 rounded-lg bg-white p-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="text-coral" size={22} />
                    <div>
                      <p className="font-black">Duplicate scan cluster</p>
                      <p className="text-sm font-semibold text-ink/55">Same seal scanned from 4 cities in 18 minutes.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  ["Authorized scans", "94.6%", "bg-fern"],
                  ["Suspicious velocity", "3.2%", "bg-amber"],
                  ["Likely counterfeit", "2.2%", "bg-coral"]
                ].map(([label, value, color]) => (
                  <div key={label} className="rounded-lg bg-white p-4">
                    <div className="flex justify-between text-sm font-black">
                      <span>{label}</span>
                      <span>{value}</span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink/10">
                      <div className={`h-full rounded-full ${color}`} style={{ width: value }} />
                    </div>
                  </div>
                ))}
                <div className="rounded-lg bg-ink p-4 text-white">
                  <p className="text-sm font-semibold text-white/50">Recommended action</p>
                  <p className="mt-2 font-black">Audit distributor route DL-18 and freeze loyalty payouts for flagged codes.</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm font-black uppercase text-coral">Industries</p>
            <h2 className="mt-3 text-4xl font-black tracking-normal">
              Flexible enough for products already in motion.
            </h2>
            <div className="mt-8 flex flex-wrap gap-3">
              {industries.map((industry) => (
                <span key={industry} className="rounded-full border border-ink/12 bg-mist px-4 py-2 text-sm font-black">
                  {industry}
                </span>
              ))}
            </div>
            <div className="mt-8 rounded-lg border border-ink/10 p-5">
              <Tags className="text-fern" size={28} />
              <p className="mt-5 text-xl font-black">Use on existing packaging.</p>
              <p className="mt-3 leading-7 text-ink/63">
                Add seals to current label lines, cartons, warranty cards, or
                direct product surfaces without rethinking the entire package.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="bg-[#e8f1ea] py-16">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-5 md:flex-row md:items-center md:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-black uppercase text-fern">Ready to protect products?</p>
            <h2 className="mt-3 text-4xl font-black tracking-normal">
              Launch authentication without slowing your supply chain.
            </h2>
          </div>
          <a
            href="mailto:hello@sealsure.ai"
            className="inline-flex h-12 w-fit items-center gap-2 rounded-md bg-ink px-5 text-sm font-black text-white shadow-soft"
          >
            <LockKeyhole size={18} />
            hello@sealsure.ai
          </a>
        </div>
      </section>

      <footer className="bg-ink px-5 py-8 text-white md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm font-semibold text-white/55 md:flex-row">
          <p>SealSure AI</p>
          <p>Anti-counterfeit seals, verification, loyalty, warranty, and analytics.</p>
        </div>
      </footer>
    </main>
  );
}
