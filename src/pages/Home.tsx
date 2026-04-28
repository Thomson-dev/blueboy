import { useEffect, useRef, useState } from "react";
import { useContent } from "../context/ContentContext";
import { getHero, getReleases, fetchStreamingLinks, type Release, type OdesliLinks } from "../lib/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function renderTitle(title: string) {
  return title.split("\n").map((line, i, arr) => (
    <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
  ));
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700;800;900&display=swap');

  :root {
    --clr-bg:       #030a04;
    --clr-main:     hsla(130, 15%, 90%, 1);
    --clr-main-50:  hsla(130, 15%, 90%, 0.5);
    --clr-main-10:  hsla(130, 15%, 90%, 0.1);
    --clr-accent:   hsl(142, 100%, 38%);
    --ff-display:   'Bebas Neue', sans-serif;
    --ff-body:      'Barlow Condensed', sans-serif;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .wk-site {
    background: var(--clr-bg);
    color: var(--clr-main);
    font-family: var(--ff-body);
    overflow-x: hidden;
    min-height: 100vh;
  }

  /* NAV */
  .wk-nav {
    background: var(--clr-accent);
    display: flex;
    justify-content: center;
    gap: 80px;
    padding: 12px 0;
    position: relative;
    z-index: 10;
  }
  .wk-nav a {
    color: #000;
    text-decoration: none;
    font-family: var(--ff-display);
    font-size: 1.35rem;
    letter-spacing: 3px;
    transition: opacity 0.2s;
  }
  .wk-nav a:hover { opacity: 0.7; }

  /* HERO */
  .wk-hero {
    position: relative;
    width: 100%;
    height: calc(100vh - 108px);
    overflow: hidden;
    background: #111;
  }
  .wk-hero-placeholder {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #0a1a0a 0%, #030a04 50%, #051a0a 100%);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 12%;
    position: relative;
  }
  .wk-hero-placeholder::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 30% 60%, rgba(0,160,60,0.12) 0%, transparent 60%);
  }
  .wk-hero-bottom-bar {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    background: var(--clr-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 40px;
    padding: 14px 0;
    border-top: 1px solid #222;
  }
  .wk-hero-bottom-bar .label {
    font-family: var(--ff-body);
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--clr-main-50);
  }
  .wk-hero-bottom-bar .album-title {
    font-family: var(--ff-display);
    font-size: 2.2rem;
    letter-spacing: 4px;
    color: var(--clr-main);
  }

  /* BUTTON */
  .wk-btn {
    display: inline-block;
    border: 2px solid var(--clr-main);
    color: var(--clr-main);
    background: transparent;
    font-family: var(--ff-display);
    font-size: 1rem;
    letter-spacing: 3px;
    padding: 8px 22px;
    cursor: pointer;
    text-decoration: none;
    text-transform: uppercase;
    transition: background 0.2s, color 0.2s;
  }
  .wk-btn:hover { background: var(--clr-main); color: #000; }

  /* MUSIC SECTIONS */
  .wk-music-section { padding: 80px 0; }
  .wk-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 40px;
  }
  .wk-music-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
  }
  .wk-music-grid.reverse { direction: rtl; }
  .wk-music-grid.reverse > * { direction: ltr; }
  .wk-music-art-wrapper { position: relative; }
  .wk-music-info .eyebrow {
    font-family: var(--ff-body);
    font-size: 0.85rem;
    font-weight: 800;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--clr-main-50);
    margin-bottom: 12px;
  }
  .wk-music-info .title {
    font-family: var(--ff-display);
    font-size: clamp(2.5rem, 5vw, 5rem);
    letter-spacing: 3px;
    line-height: 1;
    color: var(--clr-main);
    margin-bottom: 8px;
  }
  .wk-music-info .feat {
    font-family: var(--ff-body);
    font-size: 0.9rem;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--clr-main-50);
    margin-bottom: 28px;
  }
  .wk-btn-row {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }

  /* SHELF ROW */
  .wk-more-section { padding: 40px 0 60px; }
  .wk-section-title {
    font-family: var(--ff-display);
    font-size: 1.6rem;
    letter-spacing: 4px;
    color: var(--clr-main);
    margin-bottom: 28px;
  }
  .wk-albums-row {
    display: flex;
    gap: 20px;
    overflow-x: auto;
    padding-bottom: 8px;
    scrollbar-width: none;
  }
  .wk-albums-row::-webkit-scrollbar { display: none; }
  .wk-album-card {
    flex: 0 0 220px;
    cursor: pointer;
  }
  .wk-album-card .wk-album-label {
    font-family: var(--ff-body);
    font-size: 0.85rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--clr-main-50);
    margin-top: 10px;
    text-align: center;
  }

  /* ART PLACEHOLDERS */
  .art-placeholder { width: 100%; aspect-ratio: 1; }
  .art-morayo { background: linear-gradient(135deg, #c8b89a 0%, #a0865e 100%); }
  .art-kese   { background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%); }
  .art-pomh   { background: linear-gradient(135deg, #e8e0d0 0%, #c8b89a 100%); }
  .art-s2     { background: linear-gradient(135deg, #051a0a 0%, #00802e 50%, #00ff7f 100%); }
  .art-tte    { background: linear-gradient(135deg, #3a006f 0%, #7a0dbb 100%); }
  .art-mil    { background: linear-gradient(135deg, #e8e0d0 0%, #d0c0a0 100%); }

  /* FOOTER */
  .wk-footer {
    background: #0a0a0a;
    padding: 30px 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #1a1a1a;
  }
  .wk-footer .brand {
    font-family: var(--ff-display);
    font-size: 1.6rem;
    letter-spacing: 6px;
    color: var(--clr-main-50);
  }
  .wk-footer .copy {
    font-family: var(--ff-body);
    font-size: 0.75rem;
    letter-spacing: 2px;
    color: var(--clr-main-50);
    text-transform: uppercase;
  }

  /* DIVIDER */
  .wk-divider { border: none; border-top: 1px solid #1a1a1a; }

  /* FADE-IN */
  .fade-in {
    opacity: 0;
    transform: translateY(40px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .fade-in.visible { opacity: 1; transform: none; }

  /* STREAMING MODAL */
  .wk-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.55);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    z-index: 300;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
  .wk-modal {
    background: #fff;
    color: #111;
    width: 100%;
    max-width: 400px;
    border-radius: 12px;
    padding: 28px 24px 20px;
    position: relative;
    max-height: 90vh;
    overflow-y: auto;
  }
  .wk-modal-close {
    position: absolute;
    top: 14px; right: 18px;
    background: none;
    border: none;
    font-size: 1.3rem;
    color: #aaa;
    cursor: pointer;
    line-height: 1;
  }
  .wk-modal-close:hover { color: #111; }
  .wk-modal-thumb {
    width: 100px;
    height: 100px;
    border-radius: 6px;
    overflow: hidden;
    margin: 0 auto 14px;
  }
  .wk-modal-title {
    text-align: center;
    font-family: var(--ff-display);
    font-size: 1.3rem;
    letter-spacing: 2px;
    color: #111;
    margin-bottom: 2px;
  }
  .wk-modal-sub {
    text-align: center;
    font-family: var(--ff-body);
    font-size: 0.8rem;
    letter-spacing: 1px;
    color: #999;
    margin-bottom: 20px;
  }
  .wk-service-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 13px 0;
    border-top: 1px solid #f0f0f0;
  }
  .wk-service-row:last-child { border-bottom: 1px solid #f0f0f0; }
  .wk-service-name {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: var(--ff-body);
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 1px;
    color: #111;
  }
  .wk-service-play {
    border: 1px solid #ccc;
    background: none;
    color: #111;
    font-family: var(--ff-body);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 6px 14px;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    transition: background 0.15s, color 0.15s;
  }
  .wk-service-play:hover { background: #111; color: #fff; border-color: #111; }

  @media (max-width: 768px) {
    .wk-nav { gap: 32px; }
    .wk-music-grid { grid-template-columns: 1fr; gap: 40px; }
    .wk-music-grid.reverse { direction: ltr; }
    .wk-hero-bottom-bar { flex-direction: column; gap: 10px; }
  }
`;

// ─── Streaming Modal ──────────────────────────────────────────────────────────

const PLATFORM_META: Record<string, { name: string; icon: React.ReactNode; action?: string }> = {
  spotify:      { name: "Spotify",       icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="#1DB954"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424a.622.622 0 01-.857.207c-2.348-1.435-5.304-1.759-8.785-.964a.623.623 0 01-.277-1.215c3.809-.87 7.077-.496 9.712 1.115a.622.622 0 01.207.857zm1.223-2.722a.78.78 0 01-1.072.257c-2.687-1.652-6.785-2.131-9.965-1.166a.78.78 0 01-.973-.519.781.781 0 01.519-.973c3.632-1.102 8.147-.568 11.234 1.329a.78.78 0 01.257 1.072zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71a.937.937 0 11-.543-1.794c3.527-1.07 9.396-.862 13.097 1.332a.937.937 0 11-.937 1.619z"/></svg> },
  appleMusic:   { name: "Apple Music",   icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="#FC3C44"><path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15H5.867c-.152.01-.303.017-.455.026C4.786.07 4.043.15 3.34.428 2.004.958 1.04 1.88.475 3.208A4.98 4.98 0 00.08 4.871C.027 5.33.01 5.793 0 6.256v11.489c.01.455.027.912.082 1.366.133 1.1.493 2.105 1.26 2.926.827.887 1.853 1.362 3.03 1.55.456.086.96.188 1.452.21H18.17c.152-.01.303-.018.455-.027.748-.055 1.49-.135 2.194-.412 1.326-.53 2.29-1.452 2.855-2.78.243-.562.345-1.158.392-1.762.05-.629.056-1.259.057-1.889V6.257c-.002-.044-.005-.088-.01-.133zm-6.427 3.608v5.16a3.574 3.574 0 01-.53 1.823 3.594 3.594 0 01-3.392 1.636 3.594 3.594 0 01-3.391-3.677 3.594 3.594 0 013.677-3.392c.437.016.87.1 1.28.247V5.072l-5.51 1.596v6.82a3.574 3.574 0 01-.53 1.82 3.594 3.594 0 01-3.392 1.637 3.594 3.594 0 01-3.39-3.677 3.594 3.594 0 013.676-3.391c.437.016.87.1 1.28.247V7.029c0-.575.396-1.074.956-1.206l6.96-2.014c.73-.212 1.473.308 1.473 1.067v4.856z"/></svg> },
  youtube:      { name: "YouTube",       icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
  youtubeMusic: { name: "YouTube Music", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="#FF0000"><path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm-2.316-3.564V8.46L16.2 12l-6.516 3.54z"/></svg> },
  soundcloud:   { name: "SoundCloud",    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="#FF5500"><path d="M1.175 12.225c-.015 0-.024.01-.024.024l-.235 2.19.235 2.174c0 .014.01.023.024.023.013 0 .022-.01.024-.023l.267-2.174-.267-2.19c-.002-.015-.01-.024-.024-.024zm22.065-1.855c-.496 0-.97.101-1.4.283-.289-3.298-3.034-5.868-6.406-5.868-1.107 0-2.145.295-3.028.812-.339.203-.429.411-.432.587v11.475c.004.183.148.333.332.337H23.24c.922 0 1.67-.748 1.67-1.67V12.04c0-.922-.748-1.67-1.67-1.67z"/></svg> },
  amazonMusic:  { name: "Amazon Music",  icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="#00A8E1"><path d="M13.958 10.09c0 1.232.029 2.256-.59 3.351-.502.891-1.301 1.438-2.186 1.438-1.214 0-1.922-.924-1.922-2.292 0-2.692 2.415-3.182 4.698-3.182v.685zm3.186 7.705a.66.66 0 01-.76.074c-1.071-.89-1.261-1.3-1.847-2.147-1.766 1.799-3.016 2.338-5.307 2.338-2.707 0-4.818-1.671-4.818-5.015 0-2.612 1.416-4.391 3.429-5.258 1.746-.77 4.186-.907 6.051-1.119v-.417c0-.766.06-1.67-.39-2.33-.392-.594-1.144-.839-1.812-.839-1.232 0-2.33.632-2.599 1.941l-3.147-.34C5.894 2.048 9.191 1 12.148 1c1.509 0 3.481.402 4.671 1.547C18.159 3.744 18 5.348 18 7.1v6.487c0 1.952.81 2.81 1.572 3.863.266.373.325.82-.014 1.098l-2.414 2.077z"/></svg>, action: "Play" },
  amazonStore:  { name: "Amazon Music",  icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="#00A8E1"><path d="M13.958 10.09c0 1.232.029 2.256-.59 3.351-.502.891-1.301 1.438-2.186 1.438-1.214 0-1.922-.924-1.922-2.292 0-2.692 2.415-3.182 4.698-3.182v.685zm3.186 7.705a.66.66 0 01-.76.074c-1.071-.89-1.261-1.3-1.847-2.147-1.766 1.799-3.016 2.338-5.307 2.338-2.707 0-4.818-1.671-4.818-5.015 0-2.612 1.416-4.391 3.429-5.258 1.746-.77 4.186-.907 6.051-1.119v-.417c0-.766.06-1.67-.39-2.33-.392-.594-1.144-.839-1.812-.839-1.232 0-2.33.632-2.599 1.941l-3.147-.34C5.894 2.048 9.191 1 12.148 1c1.509 0 3.481.402 4.671 1.547C18.159 3.744 18 5.348 18 7.1v6.487c0 1.952.81 2.81 1.572 3.863.266.373.325.82-.014 1.098l-2.414 2.077z"/></svg>, action: "Download" },
  itunes:       { name: "iTunes Store",  icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="#FC3C44"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10S2 17.514 2 12 6.486 2 12 2zm-.5 4v7.25A2.5 2.5 0 1013 15.5V9h3V7h-4.5z"/></svg>, action: "Download" },
  deezer:       { name: "Deezer",        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="#EF5466"><path d="M18.81 11.833H24v2.044h-5.19zm0-3.777H24v2.044h-5.19zm0 7.61H24v2.045h-5.19zM0 19.666h5.19v-2.044H0zm6.163 0h5.19v-2.044h-5.19zm6.161 0h5.19v-2.044h-5.19zm6.162 0H24v-2.044h-5.19zM6.163 15.889h5.19v-2.044h-5.19zm6.161 0h5.19v-2.044h-5.19zM6.163 12.111h5.19v-2.044h-5.19zm6.161 0h5.19v-2.044h-5.19zM12.324 8.334h5.19V6.29h-5.19z"/></svg> },
  tidal:        { name: "Tidal",         icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="#000"><path d="M12.012 3.992L8.008 7.996 4.004 3.992 0 7.996l4.004 4.004 4.004-4.004 4.004 4.004 4.004-4.004zM8.008 16.004l-4.004-4.004L0 16.004 4.004 20l4.004-4.004 4.004 4.004L20.016 12 16.012 7.996 12.008 12z"/></svg> },
  pandora:      { name: "Pandora",       icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="#3668FF"><path d="M0 0v24h8.218c5.395 0 9.893-4.395 9.893-9.995 0-5.418-4.085-8.442-8.682-8.442H6.32V24H2.903V0zm6.32 2.99h1.109c3.299 0 5.68 2.355 5.68 5.617 0 3.319-2.355 5.756-5.68 5.756H6.32z"/></svg> },
  audiomack:    { name: "Audiomack",     icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="#FFA200"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.5 16.5l-6-3.5V8l6 3.5v5z"/></svg> },
};

const PLATFORM_ORDER = ["spotify","appleMusic","youtube","youtubeMusic","soundcloud","amazonMusic","amazonStore","itunes","deezer","tidal","audiomack","pandora"];

interface ModalState { release: Release }

function StreamingModal({ state, onClose }: { state: ModalState; onClose: () => void }) {
  const { release } = state;
  const [links, setLinks] = useState<OdesliLinks | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!release.listenUrl) { setLoading(false); return; }
    fetchStreamingLinks(release.listenUrl).then((data) => {
      setLinks(data);
      setLoading(false);
    });
  }, [release.listenUrl]);

  const ordered = PLATFORM_ORDER.filter((p) => links?.[p]?.url);

  return (
    <div className="wk-overlay" onClick={onClose}>
      <div className="wk-modal" onClick={(e) => e.stopPropagation()}>
        <button className="wk-modal-close" onClick={onClose}>✕</button>
        <div className="wk-modal-thumb">
          {release.coverUrl
            ? <img src={release.coverUrl} alt={release.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <div className={`art-placeholder ${release.artClass || "art-morayo"}`} style={{ width: "100%", height: "100%" }} />
          }
        </div>
        <p className="wk-modal-title">{release.title}</p>
        <p className="wk-modal-sub">Choose music service</p>
        {loading && <p style={{ textAlign: "center", color: "#aaa", fontSize: "0.85rem", padding: "16px 0" }}>Loading…</p>}
        {!loading && !release.listenUrl && <p style={{ textAlign: "center", color: "#aaa", fontSize: "0.85rem", padding: "16px 0" }}>No streaming link added yet.</p>}
        {!loading && release.listenUrl && ordered.length === 0 && <p style={{ textAlign: "center", color: "#aaa", fontSize: "0.85rem", padding: "16px 0" }}>Could not find streaming links.</p>}
        {ordered.map((platform) => {
          const meta = PLATFORM_META[platform];
          const url = links![platform].url;
          return (
            <div className="wk-service-row" key={platform}>
              <span className="wk-service-name">{meta?.icon}{meta?.name ?? platform}</span>
              <a className="wk-service-play" href={url} target="_blank" rel="noopener noreferrer">{meta?.action ?? "Play"}</a>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { el.classList.add("visible"); observer.disconnect(); }
    }, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function FadeSection({ children }: { children: React.ReactNode }) {
  const ref = useFadeIn();
  return <div ref={ref} className="fade-in">{children}</div>;
}

// ─── Components ───────────────────────────────────────────────────────────────

function Nav() {
  return (
    <nav className="wk-nav">
      <a href="#">MUSIC</a>
      <a href="#">VIDEO</a>
      <a href="#">TOUR</a>
    </nav>
  );
}

function Hero({ onListen }: { onListen: () => void }) {
  const { content, updateContent } = useContent();

  useEffect(() => {
    getHero().then((data) => {
      if (data) updateContent({ hero: { label: data.label, albumTitle: data.albumTitle, ctaText: data.ctaText, ctaUrl: data.ctaUrl, imageUrl: data.imageUrl || "" } });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="wk-hero">
      <div className="wk-hero-placeholder">
        <img src="/hero2.jpeg" alt="Hero" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div className="wk-hero-bottom-bar">
        <span className="label">{content.hero.label}</span>
        <span className="album-title">{content.hero.albumTitle}</span>
        <button className="wk-btn" onClick={onListen}>{content.hero.ctaText || "LISTEN NOW"}</button>
      </div>
    </section>
  );
}

function ReleaseArt({ release }: { release: Release }) {
  if (release.coverUrl) {
    return <img src={release.coverUrl} alt={release.title} style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }} />;
  }
  return <div className={`art-placeholder ${release.artClass || "art-morayo"}`} style={{ width: "100%", aspectRatio: "1" }} />;
}

function FeaturedSection({ release, reverse, onListen }: { release: Release; reverse: boolean; onListen: () => void }) {
  return (
    <section className="wk-music-section">
      <div className="wk-container">
        <FadeSection>
          <div className={`wk-music-grid${reverse ? " reverse" : ""}`}>
            <ReleaseArt release={release} />
            <div className="wk-music-info">
              {release.eyebrow && <p className="eyebrow">{release.eyebrow}</p>}
              <h2 className="title">{renderTitle(release.title)}</h2>
              {release.featuredArtist && <p className="feat">{release.featuredArtist}</p>}
              <div className="wk-btn-row">
                {(release.buttons ?? ["LISTEN NOW"]).map((btn) => (
                  <button key={btn} className="wk-btn" onClick={onListen}>{btn}</button>
                ))}
              </div>
            </div>
          </div>
        </FadeSection>
      </div>
    </section>
  );
}

function ShelfRow({ releases, onListen }: { releases: Release[]; onListen: (r: Release) => void }) {
  if (releases.length === 0) return null;
  return (
    <section className="wk-more-section">
      <div className="wk-container">
        <FadeSection>
          <h3 className="wk-section-title">MORE MUSIC</h3>
          <div className="wk-albums-row">
            {releases.map((r) => (
              <div className="wk-album-card" key={r._id} onClick={() => onListen(r)}>
                <ReleaseArt release={r} />
                <p className="wk-album-label">{r.title}</p>
              </div>
            ))}
          </div>
        </FadeSection>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="wk-footer">
      <span className="brand">BLUEBOY</span>
      <span className="copy">© 2025 Blueboy. All Rights Reserved.</span>
      <a href="#/admin" style={{ fontFamily: "var(--ff-body)", fontSize: "0.7rem", letterSpacing: "2px", color: "var(--clr-main-50)", textTransform: "uppercase", textDecoration: "none" }}>
        Admin
      </a>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BlueboySite() {
  const [featured, setFeatured] = useState<Release[]>([]);
  const [shelf, setShelf] = useState<Release[]>([]);
  const [modal, setModal] = useState<ModalState | null>(null);

  useEffect(() => {
    getReleases(true).then(setFeatured);
    getReleases(false).then(setShelf);
  }, []);

  const firstFeatured = featured[0] ?? null;
  const { content } = useContent();

  function openHeroModal() {
    if (!content.hero.ctaUrl) return;
    setModal({
      release: {
        _id: "hero",
        title: content.hero.albumTitle || "LISTEN",
        eyebrow: content.hero.label,
        featuredArtist: "",
        featured: true,
        displayOrder: 0,
        coverUrl: "",
        artClass: "art-morayo",
        listenUrl: content.hero.ctaUrl,
        buttons: [content.hero.ctaText || "LISTEN NOW"],
      },
    });
  }

  return (
    <div className="wk-site">
      <style>{globalStyle}</style>
      <Nav />
      <Hero onListen={openHeroModal} />

      {featured.map((release, i) => (
        <div key={release._id}>
          {i > 0 && <hr className="wk-divider" />}
          <FeaturedSection
            release={release}
            reverse={i % 2 !== 0}
            onListen={() => setModal({ release })}
          />
        </div>
      ))}

      <hr className="wk-divider" />
      <ShelfRow releases={shelf} onListen={(r) => setModal({ release: r })} />
      <Footer />
      {modal && <StreamingModal state={modal} onClose={() => setModal(null)} />}
    </div>
  );
}
