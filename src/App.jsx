import { FiExternalLink } from "react-icons/fi";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { SiSubstack } from "react-icons/si";
import CustomIcon from "./components/CustomIcon";

const LINKS = [
  { id: "ethpapers", label: "Ethereum Papers", url: "https://ethpapers.xyz/", icon: "ethpapers" },
  { id: "substack", label: "Substack", url: "https://kichongtran.substack.com/", icon: "substack" },
  { id: "github", label: "GitHub", url: "https://github.com/kichong", icon: "github" },
  { id: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/kichongtran/", icon: "linkedin" },
];

function LinkNode({ link, index, total }) {
  const angle = -Math.PI / 2 + (index / total) * Math.PI * 2;
  const position = { left: `${50 + Math.cos(angle) * 50}%`, top: `${50 + Math.sin(angle) * 50}%`, "--entrance-delay": `${0.22 + index * 0.09}s` };
  const knownLogo = link.id === "github" ? <FaGithub />
    : link.id === "substack" ? <SiSubstack />
      : link.id === "linkedin" ? <FaLinkedinIn />
        : link.id === "ethpapers" ? <img src="/ethpapers-logo.webp" alt="" />
          : null;

  return <div className="orbit-item" style={position}>
    <a className="link-node" href={link.url} target="_blank" rel="noreferrer" aria-label={`${link.label} (opens in a new tab)`}>
      <span className={`link-glyph ${knownLogo ? "painted-logo" : ""}`}>{knownLogo || <CustomIcon name={link.icon} aria-hidden="true" />}</span>
      <span className="link-label">{link.label}<FiExternalLink aria-hidden="true" /></span>
    </a>
  </div>;
}

export default function App() {
  return <main className="site-shell">
    <div className="ambient-glow" aria-hidden="true" />
    <div className="fire-stage" aria-hidden="true">
      <img className="fire fire-state-a" src="/fire-a.webp" alt="" fetchPriority="high" />
      <img className="fire fire-state-b" src="/fire-b.webp" alt="" />
      <img className="fire fire-spark" src="/fire-a.webp" alt="" />
    </div>
    <nav className="orbit" aria-label="Destinations"><div className="orbit-plane">{LINKS.map((link, index) => <LinkNode key={link.id} link={link} index={index} total={LINKS.length} />)}</div></nav>
    <a className="wordmark" href="/" aria-label="Kichong home">KICHONG.XYZ</a>
  </main>;
}
