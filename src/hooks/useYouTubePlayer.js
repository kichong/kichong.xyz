import { useEffect, useRef, useState } from "react";

export function getYouTubeId(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "youtu.be") return parsed.pathname.slice(1).split("/")[0];
    if (parsed.hostname.includes("youtube.com")) return parsed.searchParams.get("v") || parsed.pathname.split("/").filter(Boolean).pop();
  } catch { return null; }
  return null;
}

function loadApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  return new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { previous?.(); resolve(window.YT); };
    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement("script"); script.src = "https://www.youtube.com/iframe_api"; document.head.appendChild(script);
    }
  });
}

export function useYouTubePlayer(url) {
  const hostRef = useRef(null);
  const playerRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [volume, setVolumeState] = useState(45);
  useEffect(() => {
    let active = true; const id = getYouTubeId(url); if (!id) return undefined;
    loadApi().then((YT) => {
      if (!active || !hostRef.current) return;
      playerRef.current = new YT.Player(hostRef.current, { width: 1, height: 1, videoId: id, playerVars: { autoplay: 1, controls: 0, loop: 1, playlist: id, playsinline: 1, origin: window.location.origin }, events: {
        onReady: ({ target }) => { target.setVolume(45); target.mute(); target.playVideo(); setReady(true); setMuted(true); },
        onStateChange: ({ data }) => setPlaying(data === 1),
        onAutoplayBlocked: () => setPlaying(false),
      }});
    });
    return () => { active = false; playerRef.current?.destroy?.(); playerRef.current = null; setReady(false); };
  }, [url]);
  return {
    hostRef, ready, playing, muted, volume,
    togglePlay: () => playing ? playerRef.current?.pauseVideo() : playerRef.current?.playVideo(),
    restart: () => { playerRef.current?.seekTo(0, true); playerRef.current?.playVideo(); },
    toggleMute: () => { if (muted) { playerRef.current?.unMute(); setMuted(false); } else { playerRef.current?.mute(); setMuted(true); } },
    setVolume: (value) => { const next = Number(value); setVolumeState(next); playerRef.current?.setVolume(next); if (next > 0 && muted) { playerRef.current?.unMute(); setMuted(false); } },
  };
}
