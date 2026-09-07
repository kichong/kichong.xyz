import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { FiExternalLink, FiLogOut, FiPause, FiPlay, FiPlus, FiRotateCcw, FiTrash2, FiVolume2, FiVolumeX, FiX } from "react-icons/fi";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { SiSubstack } from "react-icons/si";
import { supabase, supabaseConfigured } from "./lib/supabase";
import CustomIcon from "./components/CustomIcon";
import { CUSTOM_ICON_NAMES } from "./components/iconNames";
import { useYouTubePlayer } from "./hooks/useYouTubePlayer";

const DEFAULT_LINKS = [
  { id: "ethpapers", label: "Ethereum Papers", url: "https://ethpapers.xyz/", icon: "ethpapers", sort_order: 0 },
  { id: "substack", label: "Substack", url: "https://kichongtran.substack.com/", icon: "substack", sort_order: 1 },
  { id: "github", label: "GitHub", url: "https://github.com/kichong", icon: "github", sort_order: 2 },
  { id: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/kichongtran/", icon: "linkedin", sort_order: 3 },
];

const ORBIT_SECONDS = 44;
const DEFAULT_MEDIA_URL = "https://www.youtube.com/watch?v=3G4kCi_ldr8";
// The editor remains intact for a later iteration, but has no public entry point.
const ENABLE_ADMIN = false;

function buildEllipsePath(radiusX, radiusY, steps = 720) {
  const points = [];
  let length = 0;
  let previous = { x: 0, y: -radiusY };
  for (let step = 0; step <= steps; step += 1) {
    const angle = -Math.PI / 2 + (step / steps) * Math.PI * 2;
    const point = { x: Math.cos(angle) * radiusX, y: Math.sin(angle) * radiusY };
    if (step > 0) length += Math.hypot(point.x - previous.x, point.y - previous.y);
    points.push({ ...point, length });
    previous = point;
  }
  return { points, length };
}

function pointAtDistance(path, distance) {
  const target = ((distance % path.length) + path.length) % path.length;
  let low = 0;
  let high = path.points.length - 1;
  while (low < high) {
    const middle = Math.floor((low + high) / 2);
    if (path.points[middle].length < target) low = middle + 1;
    else high = middle;
  }
  const next = path.points[low];
  const previous = path.points[Math.max(0, low - 1)];
  const span = next.length - previous.length || 1;
  const mix = (target - previous.length) / span;
  return { x: previous.x + (next.x - previous.x) * mix, y: previous.y + (next.y - previous.y) * mix };
}

function OrbitPlane({ children, count }) {
  const planeRef = useRef(null);
  useEffect(() => {
    const plane = planeRef.current;
    if (!plane) return undefined;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame;
    const start = performance.now();
    const positionItems = (now) => {
      const path = buildEllipsePath(plane.clientWidth / 2, plane.clientHeight / 2);
      const elapsed = reduceMotion ? 0 : (now - start) / 1000;
      plane.querySelectorAll(".orbit-item").forEach((item) => {
        const index = Number(item.dataset.orbitIndex);
        const total = Math.max(1, Number(item.dataset.orbitTotal));
        const distance = path.length * (index / total + elapsed / ORBIT_SECONDS);
        const point = pointAtDistance(path, distance);
        item.style.transform = `translate(${point.x}px, ${point.y}px)`;
      });
      if (!reduceMotion) frame = requestAnimationFrame(positionItems);
    };
    positionItems(start);
    return () => cancelAnimationFrame(frame);
  }, [count]);
  return <div className="orbit-plane" ref={planeRef}>{children}</div>;
}

function LinkNode({ link, index, total }) {
  const knownLogo = link.id === "github" ? <FaGithub /> : link.id === "substack" ? <SiSubstack /> : link.id === "linkedin" ? <FaLinkedinIn /> : link.id === "ethpapers" ? <img src="/ethpapers-logo-cutout.png" alt="" /> : null;
  return (
    <div className="orbit-item" data-orbit-index={index} data-orbit-total={total}>
      <a className="link-node" href={link.url} target="_blank" rel="noreferrer" aria-label={`${link.label} (opens in a new tab)`}>
        <Motion.span className={`link-glyph ${knownLogo ? "painted-logo" : ""}`} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.35 + index * 0.08, duration: 0.6 }}>{knownLogo || <CustomIcon name={link.icon} aria-hidden="true" />}</Motion.span>
        <span className="link-label">{link.label}<FiExternalLink aria-hidden="true" /></span>
      </a>
    </div>
  );
}

function LoginDialog({ onClose, onMessage }) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  async function submit(event) {
    event.preventDefault();
    if (!supabaseConfigured) return onMessage("Connect Supabase first. See SETUP.md.");
    setSending(true);
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin, shouldCreateUser: false } });
    setSending(false);
    if (error) onMessage(error.message);
    else { onMessage("Check your email for the private sign-in link."); onClose(); }
  }
  return (
    <Motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
      <Motion.section className="admin-panel login-panel" role="dialog" aria-modal="true" aria-labelledby="login-title" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 18, opacity: 0 }} onMouseDown={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose} aria-label="Close login"><FiX /></button>
        <p className="eyebrow">Private access</p><h2 id="login-title">Site editor</h2>
        <p className="panel-copy">Enter the owner email to receive a secure sign-in link.</p>
        <form onSubmit={submit} className="editor-form">
          <label>Email<input autoFocus required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></label>
          <button className="primary-button" disabled={sending}>{sending ? "Sending…" : "Send login link"}</button>
        </form>
      </Motion.section>
    </Motion.div>
  );
}

function Editor({ links, mediaUrl, onClose, onRefresh, onMessage }) {
  const [form, setForm] = useState({ label: "", url: "https://", icon: "globe" });
  const [media, setMedia] = useState(mediaUrl);
  const [saving, setSaving] = useState(false);
  async function addLink(event) {
    event.preventDefault(); setSaving(true);
    const { error } = await supabase.from("links").insert({ ...form, sort_order: links.length });
    setSaving(false);
    if (error) return onMessage(error.message);
    setForm({ label: "", url: "https://", icon: "globe" }); onRefresh();
  }
  async function removeLink(id) {
    const { error } = await supabase.from("links").delete().eq("id", id);
    if (error) return onMessage(error.message); onRefresh();
  }
  async function signOut() { await supabase.auth.signOut(); onClose(); }
  async function saveMedia(event) {
    event.preventDefault();
    const { error } = await supabase.from("site_settings").update({ media_url: media }).eq("id", "default");
    if (error) return onMessage(error.message);
    onMessage("Media updated."); onRefresh();
  }
  return (
    <Motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
      <Motion.section className="admin-panel" role="dialog" aria-modal="true" aria-labelledby="editor-title" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 18, opacity: 0 }} onMouseDown={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose} aria-label="Close editor"><FiX /></button>
        <p className="eyebrow">Authenticated</p><h2 id="editor-title">Edit destinations</h2>
        <div className="existing-links">{links.map((link) => <div className="existing-link" key={link.id}><CustomIcon name={link.icon} /><span>{link.label}</span><button onClick={() => removeLink(link.id)} aria-label={`Delete ${link.label}`}><FiTrash2 /></button></div>)}</div>
        <form onSubmit={addLink} className="editor-form">
          <label>Name<input required maxLength="40" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="New destination" /></label>
          <label>URL<input required type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} /></label>
          <label>Icon bank<span className="icon-bank">{CUSTOM_ICON_NAMES.map((icon) => <button type="button" className={form.icon === icon ? "selected" : ""} key={icon} onClick={() => setForm({ ...form, icon })} aria-label={`Use ${icon} icon`} title={icon}><CustomIcon name={icon} /></button>)}</span></label>
          <button className="primary-button" disabled={saving}>{saving ? "Adding…" : "Add destination"}</button>
        </form>
        <form onSubmit={saveMedia} className="editor-form media-form"><label>Playing media URL<input required type="url" value={media} onChange={(e) => setMedia(e.target.value)} /></label><button className="secondary-button">Update media</button></form>
        <button className="signout-button" onClick={signOut}><FiLogOut /> Sign out</button>
      </Motion.section>
    </Motion.div>
  );
}

function MediaBar({ url }) {
  const player = useYouTubePlayer(url);
  return <div className="media-bar" aria-label="Media controls">
    <div className="youtube-host" ref={player.hostRef} />
    <button onClick={player.togglePlay} disabled={!player.ready} aria-label={player.playing ? "Pause" : "Play"}>{player.playing ? <FiPause /> : <FiPlay />}</button>
    <button onClick={player.restart} disabled={!player.ready} aria-label="Restart from beginning" title="Restart"><FiRotateCcw /></button>
    <button onClick={player.toggleMute} disabled={!player.ready} aria-label={player.muted ? "Unmute" : "Mute"}>{player.muted ? <FiVolumeX /> : <FiVolume2 />}</button>
    <input aria-label="Volume" type="range" min="0" max="100" value={player.volume} onChange={(e) => player.setVolume(e.target.value)} />
    <a href={url} target="_blank" rel="noreferrer" aria-label="Open media on YouTube"><FiExternalLink /></a>
  </div>;
}

export default function App() {
  const [links, setLinks] = useState(DEFAULT_LINKS);
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [message, setMessage] = useState("");
  const [mediaUrl, setMediaUrl] = useState(DEFAULT_MEDIA_URL);
  const orderedLinks = useMemo(() => [...links].sort((a, b) => a.sort_order - b.sort_order), [links]);
  const orbitCount = orderedLinks.length + (ENABLE_ADMIN && isAdmin ? 1 : 0);
  async function loadLinks() {
    if (!supabaseConfigured) return;
    const { data, error } = await supabase.from("links").select("id,label,url,icon,sort_order").order("sort_order");
    if (!error && data) setLinks(data);
  }
  async function loadSettings() {
    if (!supabaseConfigured) return;
    const { data } = await supabase.from("site_settings").select("media_url").eq("id", "default").maybeSingle();
    if (data?.media_url) setMediaUrl(data.media_url);
  }
  async function checkAdmin(activeSession) {
    if (!activeSession || !supabaseConfigured) return setIsAdmin(false);
    const { data } = await supabase.from("site_admins").select("user_id").eq("user_id", activeSession.user.id).maybeSingle();
    setIsAdmin(Boolean(data));
  }
  useEffect(() => {
    loadLinks(); loadSettings();
    if (!ENABLE_ADMIN || !supabaseConfigured) return undefined;
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); checkAdmin(data.session); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => { setSession(nextSession); setTimeout(() => checkAdmin(nextSession), 0); });
    return () => listener.subscription.unsubscribe();
  }, []);
  useEffect(() => { if (!message) return; const timeout = setTimeout(() => setMessage(""), 5000); return () => clearTimeout(timeout); }, [message]);
  return (
    <main className="site-shell">
      <div className="ambient-glow" aria-hidden="true" />
      <div className="fire-stage" aria-hidden="true"><img className="fire fire-state-a" src="/fire-shape-a-alpha-v3.png" alt="" /><img className="fire fire-state-b" src="/fire-shape-b-alpha-v3.png" alt="" /><img className="fire fire-spark" src="/fire-shape-a-alpha-v3.png" alt="" /></div>
      <nav className="orbit" aria-label="Destinations">
        <OrbitPlane count={orbitCount}>
          {orderedLinks.map((link, index) => <LinkNode key={link.id} link={link} index={index} total={orbitCount} />)}
          {ENABLE_ADMIN && isAdmin && <div className="orbit-item" data-orbit-index={orderedLinks.length} data-orbit-total={orbitCount}><button className="link-node add-node" onClick={() => setShowEditor(true)} aria-label="Add a destination"><FiPlus /></button></div>}
        </OrbitPlane>
      </nav>
      <MediaBar url={mediaUrl} />
      <Motion.a className="wordmark" href="/" aria-label="Kichong home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>KICHONG.XYZ</Motion.a>
      {ENABLE_ADMIN && !session && <button className="quiet-login" onClick={() => setShowLogin(true)}>login</button>}
      {ENABLE_ADMIN && session && !isAdmin && <button className="quiet-login" onClick={() => supabase.auth.signOut()}>not authorized</button>}
      <AnimatePresence>
        {ENABLE_ADMIN && showLogin && <LoginDialog onClose={() => setShowLogin(false)} onMessage={setMessage} />}
        {ENABLE_ADMIN && showEditor && <Editor links={orderedLinks} mediaUrl={mediaUrl} onClose={() => setShowEditor(false)} onRefresh={() => { loadLinks(); loadSettings(); }} onMessage={setMessage} />}
        {message && <Motion.div className="toast" role="status" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{message}</Motion.div>}
      </AnimatePresence>
    </main>
  );
}
