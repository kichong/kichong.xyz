import { useState } from "react";
import { FiLogOut, FiTrash2, FiX } from "react-icons/fi";
import { supabase, supabaseConfigured } from "../lib/supabase";
import CustomIcon from "../components/CustomIcon";
import { CUSTOM_ICON_NAMES } from "../components/iconNames";

// Preserved for a possible future template iteration. This module is deliberately
// not imported by the public app, so authentication code stays out of its bundle.
export function DormantLoginDialog({ onClose, onMessage }) {
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
  return <section className="admin-panel login-panel" role="dialog" aria-modal="true" aria-labelledby="login-title">
    <button className="close-button" onClick={onClose} aria-label="Close login"><FiX /></button>
    <p className="eyebrow">Private access</p><h2 id="login-title">Site editor</h2>
    <form onSubmit={submit} className="editor-form"><label>Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label><button className="primary-button" disabled={sending}>{sending ? "Sending…" : "Send login link"}</button></form>
  </section>;
}

export function DormantLinkEditor({ links, onClose, onRefresh, onMessage }) {
  const [form, setForm] = useState({ label: "", url: "https://", icon: "globe" });
  async function addLink(event) { event.preventDefault(); const { error } = await supabase.from("links").insert({ ...form, sort_order: links.length }); if (error) onMessage(error.message); else onRefresh(); }
  async function removeLink(id) { const { error } = await supabase.from("links").delete().eq("id", id); if (error) onMessage(error.message); else onRefresh(); }
  async function signOut() { await supabase.auth.signOut(); onClose(); }
  return <section className="admin-panel" role="dialog" aria-modal="true" aria-labelledby="editor-title">
    <button className="close-button" onClick={onClose} aria-label="Close editor"><FiX /></button>
    <p className="eyebrow">Authenticated</p><h2 id="editor-title">Edit destinations</h2>
    <div className="existing-links">{links.map((link) => <div className="existing-link" key={link.id}><CustomIcon name={link.icon} /><span>{link.label}</span><button onClick={() => removeLink(link.id)} aria-label={`Delete ${link.label}`}><FiTrash2 /></button></div>)}</div>
    <form onSubmit={addLink} className="editor-form">
      <label>Name<input required maxLength="40" value={form.label} onChange={(event) => setForm({ ...form, label: event.target.value })} /></label>
      <label>URL<input required type="url" value={form.url} onChange={(event) => setForm({ ...form, url: event.target.value })} /></label>
      <label>Icon bank<span className="icon-bank">{CUSTOM_ICON_NAMES.map((icon) => <button type="button" className={form.icon === icon ? "selected" : ""} key={icon} onClick={() => setForm({ ...form, icon })} aria-label={`Use ${icon} icon`}><CustomIcon name={icon} /></button>)}</span></label>
      <button className="primary-button">Add destination</button>
    </form>
    <button className="signout-button" onClick={signOut}><FiLogOut /> Sign out</button>
  </section>;
}
