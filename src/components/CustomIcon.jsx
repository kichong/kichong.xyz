const drawings = {
  bookfire: <><path d="M4 5.5c3.2-.9 5.8.1 8 2.1 2.2-2 4.8-3 8-2.1v13c-3.1-.8-5.8.1-8 2-2.2-1.9-4.9-2.8-8-2Z"/><path d="M12 8v12.5M9.1 16c.2-1.1 1.1-1.7 1-2.8 1.6.8 2.3 1.8 1.9 3.4"/></>,
  stack: <><path d="m5 8 7-4 7 4-7 4Z"/><path d="m5 12 7 4 7-4M5 16l7 4 7-4"/></>,
  branch: <><circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="M8 6h3a1 1 0 0 1 1 1v9M16 6h-3a1 1 0 0 0-1 1"/></>,
  bridge: <><path d="M4 18h16M6 18v-4a6 6 0 0 1 12 0v4M9 18v-4a3 3 0 0 1 6 0v4"/><path d="M5 7h14"/></>,
  globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"/></>,
  quill: <><path d="M5 20c2-7 6-13 14-16-1 8-5 12-12 14"/><path d="m8 15 5-1-2-3 5-1"/></>,
  spark: <><path d="M12 2c.4 5.8 3 8.6 8 10-5 1.4-7.6 4.2-8 10-.4-5.8-3-8.6-8-10 5-1.4 7.6-4.2 8-10Z"/></>,
  signal: <><circle cx="12" cy="17" r="2"/><path d="M7.8 12.8a6 6 0 0 1 8.4 0M4.5 9.5a10.6 10.6 0 0 1 15 0"/></>,
  portal: <><circle cx="12" cy="12" r="8"/><path d="M8 16 16 8M10 8h6v6"/></>,
  prism: <><path d="m12 3 8 16H4Z"/><path d="m12 3 2 11-10 5M14 14l6 5"/></>,
  knot: <><path d="M7 7c3-4 7-4 10 0s-1 7-5 5-8 1-5 5 7 4 10 0"/></>,
  beacon: <><path d="M9 20h6l-1.2-8h-3.6ZM8 8.5a6 6 0 0 1 8 0M5 6a10 10 0 0 1 14 0"/></>,
};

export default function CustomIcon({ name = "globe", ...props }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...props}>{drawings[name] || drawings.globe}</svg>;
}
