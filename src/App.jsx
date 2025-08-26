import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import LINK_MAP from "./LINK_MAP.json";

const GLOW = "rgba(140,255,200,0.9)";

// Fallback titles if JSON omits them
const DEFAULT_TITLES = {
  triangle: "NFTs",
  square: "Books",
  circle: "GPTs",
  cross: "Author",
};

// Minimal error boundary so runtime errors don't blank the page
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error("UI crash:", error, info); }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-black text-red-200 p-6 font-mono">
          <h2 className="text-lg mb-2">Something went wrong.</h2>
          <pre className="text-xs whitespace-pre-wrap opacity-80">
            {String(this.state.error?.message || this.state.error)}
          </pre>
          <button className="mt-4 underline" onClick={() => this.setState({ error: null })}>
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function useIsMobile() {
  const [m, setM] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const sync = () => setM(mq.matches);
    sync();
    mq.addEventListener?.("change", sync);
    return () => mq.removeEventListener?.("change", sync);
  }, []);
  return m;
}

// Accepts either Schema A: { title, items: [...] } or old array-only form: [...]
function getGroup(key) {
  const data = LINK_MAP[key];
  if (Array.isArray(data)) {
    return { title: DEFAULT_TITLES[key], items: data };
  }
  if (data && Array.isArray(data.items)) {
    return { title: data.title || DEFAULT_TITLES[key], items: data.items };
  }
  console.warn(`[LINK_MAP] ${key} has invalid shape; expected array or {title, items:[...]}.`, data);
  return { title: (data && data.title) || DEFAULT_TITLES[key], items: [] };
}

const Panel = ({ items, mobile, title }) => {
  const safeItems = Array.isArray(items) ? items : [];
  if (!Array.isArray(items)) {
    console.warn("[LINK_MAP] 'items' was not an array. Falling back to empty list.", { items });
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      className={
        "pointer-events-auto rounded-2xl bg-black/85 p-4 backdrop-blur-md border border-emerald-300/30 shadow-[0_0_30px_rgba(140,255,200,0.25)] " +
        (mobile ? "w-[min(26rem,calc(100vw-2rem))]" : "w-[min(18rem,calc(100vw-3rem))]")
      }
      role="menu"
    >
      {title && (
        <div className="mb-2 text-emerald-200/90 text-xs tracking-widest uppercase">
          {title}
        </div>
      )}
      <ul className="space-y-2">
        {safeItems.map((it) => {
          const external = /^https?:\/\//.test(it?.href || "");
          return (
            <li key={it?.label}>
              <a
                href={it?.href || "#"}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="block rounded-lg border border-emerald-400/10 bg-emerald-100/0 px-3 py-2 text-emerald-100/90 hover:bg-emerald-400/5 hover:text-emerald-100 transition"
              >
                {it?.label || "(untitled)"}
              </a>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
};

const Glow = ({ className }) => (
  <div
    className={`absolute inset-0 blur-xl opacity-70 ${className || ""}`}
    style={{ boxShadow: `0 0 60px 10px ${GLOW}, inset 0 0 40px ${GLOW}` }}
  />
);

function ShapeTriangle() {
  return (
    <div className="relative w-32 h-32 md:w-40 md:h-40">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <polygon points="50,10 90,80 10,80" fill="none" strokeWidth="4" stroke="url(#grad)" />
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={GLOW} />
            <stop offset="100%" stopColor="white" />
          </linearGradient>
        </defs>
      </svg>
      <Glow />
    </div>
  );
}

function ShapeSquare() {
  return (
    <div className="relative w-32 h-32 md:w-40 md:h-40">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect x="10" y="10" width="80" height="80" fill="none" strokeWidth="4" stroke={GLOW} />
      </svg>
      <Glow />
    </div>
  );
}

function ShapeCircle() {
  return (
    <div className="relative w-32 h-32 md:w-40 md:h-40">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="40" fill="none" strokeWidth="4" stroke={GLOW} />
      </svg>
      <Glow />
    </div>
  );
}

function ShapeCross() {
  return (
    <div className="relative w-44 h-44 md:w-52 md:h-52">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path
          d="M20 38 L38 20 L50 32 L62 20 L80 38 L68 50 L80 62 L62 80 L50 68 L38 80 L20 62 L32 50 Z"
          fill="none"
          strokeWidth="4"
          stroke={GLOW}
        />
      </svg>
      <Glow />
    </div>
  );
}

const ControllerNode = ({ shape, items, anchor, title }) => {
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();

  const ShapeComp = {
    triangle: ShapeTriangle,
    square: ShapeSquare,
    circle: ShapeCircle,
    cross: ShapeCross,
  }[shape];

  const panelPos = {
    top: "top-[calc(100%+16px)] left-1/2 -translate-x-1/2",
    right: "right-[calc(100%+16px)] top-1/2 -translate-y-1/2",
    left: "left-[calc(100%+16px)] top-1/2 -translate-y-1/2",
    bottom: "bottom-[calc(100%+16px)] left-1/2 -translate-x-1/2",
  }[anchor];

  const mobilePos = "fixed left-1/2 -translate-x-1/2 bottom-20 z-50";

  const openOn = {
    onMouseEnter: () => !isMobile && setOpen(true),
    onMouseLeave: () => !isMobile && setOpen(false),
    onClick: () => isMobile && setOpen((v) => !v),
  };

  return (
    <div className="group relative flex flex-col items-center justify-center" {...openOn}>
      <motion.div
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.98 }}
        className="cursor-pointer select-none"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <ShapeComp />
      </motion.div>

      <AnimatePresence>
        {open && (
          <div className={(isMobile ? mobilePos : `absolute ${panelPos}`) + " pointer-events-none"}>
            <Panel items={items} mobile={isMobile} title={title} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const TRI = getGroup("triangle");
  const SQU = getGroup("square");
  const CIR = getGroup("circle");
  const CRO = getGroup("cross");

  return (
    <ErrorBoundary>
      <main className="relative min-h-screen text-emerald-100 bg-black overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <GridDecor />
        </div>

        <header className="relative z-10 flex items-center justify-between px-4 md:px-6 pt-6">
          <h1 className="font-mono tracking-wider text-xs md:text-sm text-emerald-200/70">
            KICHONG.XYZ
          </h1>
          <div className="text-[10px] font-mono text-emerald-400/60">v0.1</div>
        </header>

        <section className="relative z-10 grid place-items-center pt-6 md:pt-10">
          <div className="relative w-full max-w-[900px] aspect-[1.1] md:aspect-[1.4] mx-auto">
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
              <div />
              <div className="flex items-center justify-center">
                <ControllerNode shape="triangle" items={TRI.items} anchor="top" title={TRI.title} />
              </div>
              <div />
              <div className="flex items-center justify-center">
                <ControllerNode shape="square" items={SQU.items} anchor="left" title={SQU.title} />
              </div>
              <div />
              <div className="flex items-center justify-center">
                <ControllerNode shape="circle" items={CIR.items} anchor="right" title={CIR.title} />
              </div>
              <div />
              <div className="flex items-center justify-center">
                <ControllerNode shape="cross" items={CRO.items} anchor="bottom" title={CRO.title} />
              </div>
              <div />
            </div>
          </div>
        </section>

        <div className="pointer-events-none absolute inset-0 mix-blend-screen opacity-25">
          <Scanlines />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent,rgba(0,0,0,0.7))]" />

        <footer className="relative z-10 px-4 md:px-6 py-10 text-xs text-emerald-300/40 font-mono">
          Hover or tap a shape to reveal links.
        </footer>
      </main>
    </ErrorBoundary>
  );
}

const GridDecor = () => (
  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
    <rect x="1" y="1" width="98" height="98" fill="none" stroke="rgba(140,255,200,0.6)" strokeWidth="0.6" />
    {[25, 50, 75].map((p) => (
      <g key={p}>
        <line x1={p} y1="1" x2={p} y2="99" stroke="rgba(140,255,200,0.2)" strokeWidth="0.4" />
        <line x1="1" y1={p} x2="99" y2={p} stroke="rgba(140,255,200,0.2)" strokeWidth="0.4" />
      </g>
    ))}
  </svg>
);

const Scanlines = () => (
  <div
    className="absolute inset-0"
    style={{
      backgroundImage:
        "repeating-linear-gradient(0deg, rgba(140,255,200,0.12) 0px, rgba(140,255,200,0.12) 1px, rgba(0,0,0,0) 2px)",
      animation: "scan 8s linear infinite",
    }}
  />
);

const style = document.createElement("style");
style.innerHTML = `
@keyframes scan { 0% { transform: translateY(0); } 100% { transform: translateY(-2px); } }
`;
document.head.appendChild(style);
