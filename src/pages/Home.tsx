import { useState, useEffect, useRef } from "react";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700;800;900&display=swap');

  :root {
    --clr-bg: #030a04;
    --clr-main: hsla(130, 15%, 90%, 1);
    --clr-main-50: hsla(130, 15%, 90%, 0.5);
    --clr-main-10: hsla(130, 15%, 90%, 0.1);
    --clr-accent: hsl(142, 100%, 38%);
    --ff-display: 'Bebas Neue', sans-serif;
    --ff-body: 'Barlow Condensed', sans-serif;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .wk-site {
    background: var(--clr-bg);
    color: var(--clr-main);
    font-family: var(--ff-body);
    overflow-x: hidden;
    min-height: 100vh;
  }

  /* ── NAV ── */
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

  /* ── HERO ── */
  .wk-hero {
    position: relative;
    width: 100%;
    height: calc(100vh - 108px);
    overflow: hidden;
    background: #111;
  }
  .wk-hero-bg {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(100%);
    display: block;
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

  /* ── MUSIC SECTION ── */
  .wk-music-section {
    padding: 80px 0;
  }
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
  .wk-music-art {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    display: block;
  }
  .wk-music-art-wrapper {
    position: relative;
  }
  .wk-music-art-label {
    position: absolute;
    bottom: 18px; left: 0; right: 0;
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
  }
  .wk-music-art-label span {
    font-family: var(--ff-display);
    font-size: 1.5rem;
    letter-spacing: 3px;
    color: var(--clr-accent);
  }
  .wk-music-info {}
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

  /* ── MORE MUSIC ── */
  .wk-more-section {
    padding: 40px 0 60px;
  }
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
  .wk-album-card img {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    display: block;
    transition: transform 0.3s;
  }
  .wk-album-card:hover img { transform: scale(1.03); }

  /* ── MORE VIDEOS ── */
  .wk-videos-section {
    padding: 40px 0 80px;
  }
  .wk-videos-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px;
  }
  .wk-video-card {
    position: relative;
    overflow: hidden;
    cursor: pointer;
    background: #111;
  }
  .wk-video-card img {
    width: 100%;
    aspect-ratio: 16/9;
    object-fit: cover;
    display: block;
    transition: transform 0.4s, filter 0.4s;
    filter: brightness(0.8);
  }
  .wk-video-card:hover img {
    transform: scale(1.05);
    filter: brightness(1);
  }
  .wk-video-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 4px;
  }
  .wk-video-info .vtitle {
    font-family: var(--ff-display);
    font-size: 1.1rem;
    letter-spacing: 2px;
    color: var(--clr-main);
  }
  .wk-video-info .vwatch {
    font-family: var(--ff-display);
    font-size: 0.85rem;
    letter-spacing: 2px;
    color: var(--clr-main);
    text-decoration: underline;
    cursor: pointer;
  }
  .wk-video-info .vwatch:hover { color: var(--clr-accent); }

  /* ── HERO PLACEHOLDER ── */
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
  .wk-hero-figure {
    width: 320px;
    height: 480px;
    background: linear-gradient(180deg, #2a2a2a 0%, #111 100%);
    border-radius: 2px;
  }

  /* ── ART PLACEHOLDER COLORS ── */
  .art-morayo { background: linear-gradient(135deg, #c8b89a 0%, #a0865e 100%); }
  .art-kese { background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%); }
  .art-pomh { background: linear-gradient(135deg, #e8e0d0 0%, #c8b89a 100%); }
  .art-s2 { background: linear-gradient(135deg, #051a0a 0%, #00802e 50%, #00ff7f 100%); }
  .art-tte { background: linear-gradient(135deg, #3a006f 0%, #7a0dbb 100%); }
  .art-mil { background: linear-gradient(135deg, #e8e0d0 0%, #d0c0a0 100%); }

  .art-placeholder {
    width: 100%;
    aspect-ratio: 1;
  }

  /* ── FOOTER ── */
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

  /* ── DIVIDER ── */
  .wk-divider {
    border: none;
    border-top: 1px solid #1a1a1a;
  }

  /* fade-in animation */
  .fade-in {
    opacity: 0;
    transform: translateY(40px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .fade-in.visible {
    opacity: 1;
    transform: none;
  }

  @media (max-width: 768px) {
    .wk-nav { gap: 32px; }
    .wk-music-grid { grid-template-columns: 1fr; gap: 40px; }
    .wk-videos-grid { grid-template-columns: 1fr; }
    .wk-hero-bottom-bar { flex-direction: column; gap: 10px; }
  }
`;

const AlbumArt = ({ cls, children }: { cls: string; children?: React.ReactNode }) => (
  <div className={`art-placeholder ${cls}`} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
    {children}
  </div>
);

const albums = [
  { cls: "art-pomh", label: "PIECE OF MY HEART" },
  { cls: "art-s2", label: "S2" },
  { cls: "art-tte", label: "MORE LOVE LESS EGO" },
  { cls: "art-mil", label: "MADE IN LAGOS" },
  { cls: "art-kese", label: "MORAYO" },
];

const videos = [
  { cls: "art-kese", title: "KESE (DANCE) (OFFICIAL VIDEO)" },
  { cls: "art-pomh", title: "PIECE OF MY HEART" },
  { cls: "art-s2", title: "DIAMONDS" },
  { cls: "art-tte", title: "IDK" },
  { cls: "art-morayo", title: "YOYO" },
  { cls: "art-mil", title: "JORO" },
];

function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function FadeSection({ children, style: s }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const ref = useFadeIn();
  return <div ref={ref} className="fade-in" style={s}>{children}</div>;
}

export default function BlueboySite() {
  return (
    <div className="wk-site">
      <style>{style}</style>

      {/* NAV */}
      <nav className="wk-nav">
        <a href="#">MUSIC</a>
        <a href="#">VIDEO</a>
        <a href="#">TOUR</a>
      </nav>

      {/* HERO */}
      <section className="wk-hero">
        <div className="wk-hero-placeholder">
          <svg width="100%" height="100%" style={{position:"absolute",inset:0}} viewBox="0 0 1400 700" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <rect width="1400" height="700" fill="#0d0d0d"/>
            <rect x="0" y="560" width="1400" height="140" fill="#111"/>
            <rect x="0" y="0" width="1400" height="560" fill="#0f0f0f"/>
            <rect x="600" y="60" width="200" height="500" rx="2" fill="#2a2a2a"/>
            <rect x="610" y="70" width="180" height="480" fill="#252525"/>
            <rect x="770" y="270" width="16" height="30" rx="3" fill="#444"/>
            <circle cx="778" cy="287" r="5" fill="#555"/>
            <ellipse cx="1000" cy="620" rx="120" ry="14" fill="#050505" opacity="0.6"/>
            <rect x="950" y="480" width="100" height="140" rx="8" fill="#1a1a1a"/>
            <ellipse cx="1000" cy="465" rx="50" ry="55" fill="#1e1e1e"/>
            <path d="M 975 510 Q 1000 530 1025 510" stroke="#444" strokeWidth="3" fill="none"/>
            <ellipse cx="230" cy="590" rx="80" ry="35" fill="#181818"/>
            <rect x="160" y="555" width="20" height="50" rx="3" fill="#181818"/>
            <rect x="200" y="555" width="20" height="50" rx="3" fill="#181818"/>
            <rect x="290" y="555" width="20" height="50" rx="3" fill="#181818"/>
            <ellipse cx="150" cy="565" rx="35" ry="25" fill="#181818"/>
            <path d="M120 555 Q130 535 145 545 Q150 530 160 545" stroke="#222" strokeWidth="2" fill="none"/>
          </svg>
        </div>

        <div className="wk-hero-bottom-bar">
          <span className="label">THE NEW ALBUM</span>
          <span className="album-title">MORAYO</span>
          <a href="#" className="wk-btn">LISTEN NOW</a>
        </div>
      </section>

      {/* MORAYO ALBUM SECTION */}
      <section className="wk-music-section">
        <div className="wk-container">
          <FadeSection>
            <div className="wk-music-grid">
              <div>
                <AlbumArt cls="art-morayo">
                  <svg viewBox="0 0 400 400" width="100%" height="100%">
                    <rect width="400" height="400" fill="#c8b090"/>
                    <circle cx="200" cy="160" r="100" fill="#b09070"/>
                    <ellipse cx="200" cy="350" rx="160" ry="80" fill="#a07850"/>
                    <text x="50%" y="92%" textAnchor="middle" fontFamily="serif" fontSize="22" fill="#5a3a1a" opacity="0.6">MORAYO</text>
                    <rect x="330" y="340" width="50" height="40" rx="3" fill="#00c04b"/>
                    <text x="355" y="363" textAnchor="middle" fontFamily="sans-serif" fontSize="6" fill="white" fontWeight="bold">PARENTAL</text>
                    <text x="355" y="372" textAnchor="middle" fontFamily="sans-serif" fontSize="6" fill="white">ADVISORY</text>
                  </svg>
                </AlbumArt>
              </div>
              <div className="wk-music-info">
                <p className="eyebrow">THE NEW ALBUM</p>
                <h2 className="title">MORAYO</h2>
                <div className="wk-btn-row">
                  <a href="#" className="wk-btn">LISTEN NOW</a>
                </div>
              </div>
            </div>
          </FadeSection>
        </div>
      </section>

      <hr className="wk-divider"/>

      {/* KESE (DANCE) SECTION */}
      <section className="wk-music-section">
        <div className="wk-container">
          <FadeSection>
            <div className="wk-music-grid">
              <div className="wk-music-art-wrapper">
                <AlbumArt cls="art-kese">
                  <svg viewBox="0 0 400 400" width="100%" height="100%">
                    <rect width="400" height="400" fill="#080810"/>
                    <circle cx="200" cy="180" r="130" fill="#0f0f1a" opacity="0.8"/>
                    <ellipse cx="200" cy="250" rx="70" ry="90" fill="#1a1a1a"/>
                    <ellipse cx="200" cy="155" rx="45" ry="50" fill="#1e1e1e"/>
                    <rect x="170" y="240" width="60" height="20" rx="4" fill="#e8e8e8" opacity="0.9"/>
                    <text x="30" y="50%" textAnchor="start" fontFamily="sans-serif" fontSize="28" fontWeight="900" fill="#00c04b" letterSpacing="2">KESE</text>
                    <text x="370" y="50%" textAnchor="end" fontFamily="sans-serif" fontSize="28" fontWeight="900" fill="#00c04b" letterSpacing="2">DANCE</text>
                  </svg>
                </AlbumArt>
              </div>
              <div className="wk-music-info">
                <p className="eyebrow">THE NEWEST SINGLE</p>
                <h2 className="title">KESE<br/>(DANCE)</h2>
                <div className="wk-btn-row">
                  <a href="#" className="wk-btn">LISTEN NOW</a>
                </div>
              </div>
            </div>
          </FadeSection>
        </div>
      </section>

      <hr className="wk-divider"/>

      {/* PIECE OF MY HEART SECTION */}
      <section className="wk-music-section">
        <div className="wk-container">
          <FadeSection>
            <div className="wk-music-grid">
              <div>
                <AlbumArt cls="art-pomh">
                  <svg viewBox="0 0 400 400" width="100%" height="100%">
                    <rect width="400" height="400" fill="#e8e0d0"/>
                    <rect x="50" y="50" width="300" height="300" fill="#d8d0c0"/>
                    <circle cx="155" cy="210" r="30" fill="#555"/>
                    <rect x="130" y="235" width="50" height="80" rx="5" fill="#555"/>
                    <circle cx="255" cy="200" r="35" fill="#444"/>
                    <rect x="225" y="228" width="60" height="90" rx="5" fill="#444"/>
                    <rect x="120" y="300" width="60" height="8" fill="#888"/>
                    <rect x="220" y="295" width="70" height="8" fill="#888"/>
                    <rect x="50" y="310" width="300" height="40" rx="2" fill="#b8c890" opacity="0.4"/>
                    <text x="50%" y="385" textAnchor="middle" fontFamily="sans-serif" fontSize="10" fill="#00c04b" letterSpacing="2" fontWeight="800">BLUEBOY · BRENT FAIYAZ</text>
                    <text x="50%" y="398" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fill="#888" letterSpacing="1">PIECE OF MY HEART</text>
                  </svg>
                </AlbumArt>
              </div>
              <div className="wk-music-info">
                <h2 className="title">PIECE OF<br/>MY HEART</h2>
                <p className="feat">FEAT. BRENT FAIYAZ</p>
                <div className="wk-btn-row">
                  <a href="#" className="wk-btn">LISTEN NOW</a>
                  <a href="#" className="wk-btn">WATCH NOW</a>
                </div>
              </div>
            </div>
          </FadeSection>
        </div>
      </section>

      <hr className="wk-divider"/>

      {/* MORE MUSIC */}
      <section className="wk-more-section">
        <div className="wk-container">
          <FadeSection>
            <h3 className="wk-section-title">MORE MUSIC FROM BLUEBOY</h3>
            <div className="wk-albums-row">
              {albums.map((a, i) => (
                <div className="wk-album-card" key={i}>
                  <AlbumArt cls={a.cls}>
                    <svg viewBox="0 0 220 220" width="100%" height="100%">
                      {a.cls === "art-s2" && <>
                        <rect width="220" height="220" fill="#051a0a"/>
                        <rect width="220" height="220" fill="url(#s2g)" opacity="0.8"/>
                        <defs><linearGradient id="s2g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#051a0a"/><stop offset="50%" stopColor="#00802e"/><stop offset="100%" stopColor="#00ff7f"/></linearGradient></defs>
                        <text x="50%" y="55%" textAnchor="middle" fontFamily="sans-serif" fontSize="40" fontWeight="900" fill="white" opacity="0.9">S2</text>
                        <rect x="4" y="190" width="55" height="22" rx="2" fill="#00c04b"/>
                        <text x="31" y="204" textAnchor="middle" fontFamily="sans-serif" fontSize="6" fill="white" fontWeight="bold">PARENTAL ADV.</text>
                      </>}
                      {a.cls === "art-tte" && <>
                        <rect width="220" height="220" fill="#3a006f"/>
                        <circle cx="110" cy="90" r="60" fill="#5a0dbb" opacity="0.6"/>
                        <text x="50%" y="78%" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fontWeight="800" fill="white" opacity="0.9">MORE LOVE</text>
                        <text x="50%" y="90%" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fontWeight="800" fill="white" opacity="0.9">LESS EGO</text>
                      </>}
                      {a.cls === "art-mil" && <>
                        <rect width="220" height="220" fill="#e0d8c8"/>
                        <circle cx="110" cy="100" r="50" fill="#b0a080"/>
                        <text x="50%" y="82%" textAnchor="middle" fontFamily="cursive" fontSize="14" fill="#5a3a10">Made in Lagos</text>
                        <text x="50%" y="93%" textAnchor="middle" fontFamily="cursive" fontSize="11" fill="#8a6a40">Blueboy</text>
                      </>}
                      {a.cls === "art-morayo" && <>
                        <rect width="220" height="220" fill="#c8b090"/>
                        <circle cx="110" cy="90" r="55" fill="#b09070"/>
                        <text x="50%" y="88%" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fontWeight="800" fill="#5a3a10">MORAYO</text>
                      </>}
                      {a.cls === "art-pomh" && <>
                        <rect width="220" height="220" fill="#e8e0d0"/>
                        <circle cx="80" cy="130" r="28" fill="#555"/>
                        <circle cx="145" cy="120" r="32" fill="#444"/>
                        <text x="50%" y="95%" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill="#00c04b" fontWeight="800">PIECE OF MY HEART</text>
                      </>}
                    </svg>
                  </AlbumArt>
                </div>
              ))}
            </div>
          </FadeSection>
        </div>
      </section>

      {/* MORE VIDEOS */}
      <section className="wk-videos-section">
        <div className="wk-container">
          <FadeSection>
            <h3 className="wk-section-title">MORE VIDEOS FROM BLUEBOY</h3>
            <div className="wk-videos-grid">
              {videos.map((v, i) => (
                <div className="wk-video-card" key={i}>
                  <AlbumArt cls={v.cls}>
                    <svg viewBox="0 0 640 360" width="100%" height="100%">
                      {v.cls === "art-kese" && <>
                        <rect width="640" height="360" fill="#050510"/>
                        <circle cx="320" cy="160" r="100" fill="#0a0a20" opacity="0.8"/>
                        <polygon points="300,130 300,190 360,160" fill="#00c04b" opacity="0.7"/>
                      </>}
                      {v.cls === "art-pomh" && <>
                        <rect width="640" height="360" fill="#1a0a0a"/>
                        <rect x="0" y="200" width="640" height="160" fill="#2a1010" opacity="0.5"/>
                        <polygon points="300,130 300,190 360,160" fill="#00c04b" opacity="0.7"/>
                      </>}
                      {v.cls === "art-s2" && <>
                        <rect width="640" height="360" fill="#030f07"/>
                        <circle cx="320" cy="150" r="120" fill="#0a2a12" opacity="0.5"/>
                        <polygon points="300,110 300,190 380,150" fill="#00c04b" opacity="0.7"/>
                      </>}
                      {v.cls === "art-tte" && <>
                        <rect width="640" height="360" fill="#100520"/>
                        <ellipse cx="320" cy="200" rx="200" ry="100" fill="#200a40" opacity="0.6"/>
                        <polygon points="300,130 300,190 360,160" fill="#00c04b" opacity="0.7"/>
                      </>}
                      {v.cls === "art-morayo" && <>
                        <rect width="640" height="360" fill="#1a1005"/>
                        <rect x="0" y="180" width="640" height="180" fill="#2a1a05" opacity="0.4"/>
                        <polygon points="300,110 300,190 380,150" fill="#00c04b" opacity="0.7"/>
                      </>}
                      {v.cls === "art-mil" && <>
                        <rect width="640" height="360" fill="#050505"/>
                        <circle cx="200" cy="180" r="120" fill="#0f0f0f" opacity="0.8"/>
                        <polygon points="300,130 300,190 360,160" fill="#00c04b" opacity="0.7"/>
                      </>}
                      <text x="50%" y="92%" textAnchor="middle" fontFamily="sans-serif" fontSize="14" fontWeight="800" fill="rgba(255,255,255,0.5)" letterSpacing="2">{v.title}</text>
                    </svg>
                  </AlbumArt>
                  <div className="wk-video-info">
                    <span className="vtitle">{v.title}</span>
                    <span className="vwatch">WATCH NOW</span>
                  </div>
                </div>
              ))}
            </div>
          </FadeSection>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="wk-footer">
        <span className="brand">BLUEBOY</span>
        <span className="copy">© 2025 Blueboy. All Rights Reserved.</span>
      </footer>
    </div>
  );
}
