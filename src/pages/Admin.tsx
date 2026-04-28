import { useState, useEffect, useRef } from "react";
import { useContent, type HeroContent } from "../context/ContentContext";
import {
  login as apiLogin,
  getHero,
  saveHero,
  uploadImage,
  getReleases,
  createRelease,
  updateRelease,
  deleteRelease,
  type Release,
} from "../lib/api";

// ─── Constants ────────────────────────────────────────────────────────────────

const ART_OPTIONS = [
  { value: "art-morayo", label: "Morayo (Tan)" },
  { value: "art-kese",   label: "Kese (Dark)" },
  { value: "art-pomh",   label: "Piece of My Heart (Cream)" },
  { value: "art-s2",     label: "S2 (Green)" },
  { value: "art-tte",    label: "More Love Less Ego (Purple)" },
  { value: "art-mil",    label: "Made in Lagos (Light)" },
];

type ActiveSection = "hero" | "releases";

const emptyRelease: Omit<Release, "_id"> = {
  title: "",
  eyebrow: "",
  featuredArtist: "",
  featured: false,
  displayOrder: 0,
  coverUrl: "",
  listenUrl: "",
  artClass: "art-morayo",
  buttons: ["LISTEN NOW"],
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const adminStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700;800;900&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .adm-root {
    display: flex;
    min-height: 100vh;
    background: #07100a;
    font-family: 'Barlow Condensed', sans-serif;
    color: #d4e8d8;
  }

  /* SIDEBAR */
  .adm-sidebar {
    width: 240px;
    background: #040d06;
    border-right: 1px solid #142018;
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0; left: 0; bottom: 0;
    z-index: 20;
  }
  .adm-logo {
    padding: 28px 24px 20px;
    border-bottom: 1px solid #142018;
  }
  .adm-logo h1 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.6rem;
    letter-spacing: 5px;
    color: #00c04b;
    line-height: 1;
  }
  .adm-logo p {
    font-size: 0.7rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #4a6a50;
    margin-top: 4px;
  }
  .adm-nav { padding: 16px 0; flex: 1; overflow-y: auto; }
  .adm-nav-label {
    font-size: 0.65rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #3a5040;
    padding: 12px 24px 6px;
  }
  .adm-nav-item {
    display: block;
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    padding: 10px 24px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.95rem;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #6a8a70;
    cursor: pointer;
    transition: color 0.15s, background 0.15s;
  }
  .adm-nav-item:hover { color: #d4e8d8; background: #0f1a12; }
  .adm-nav-item.active { color: #00c04b; background: #0a1a0d; border-left: 3px solid #00c04b; }
  .adm-sidebar-footer {
    padding: 20px 24px;
    border-top: 1px solid #142018;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .adm-view-btn {
    display: block;
    padding: 10px 0;
    text-align: center;
    background: #00c04b;
    color: #000;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1rem;
    letter-spacing: 3px;
    text-decoration: none;
    cursor: pointer;
    border: none;
    transition: opacity 0.2s;
    width: 100%;
  }
  .adm-view-btn:hover { opacity: 0.85; }
  .adm-logout-btn {
    display: block;
    padding: 8px 0;
    text-align: center;
    background: transparent;
    color: #4a6a50;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.8rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    border: 1px solid #1a2a1e;
    transition: color 0.2s, border-color 0.2s;
    width: 100%;
  }
  .adm-logout-btn:hover { color: #e05555; border-color: #e05555; }

  /* MAIN */
  .adm-main {
    margin-left: 240px;
    flex: 1;
    padding: 40px;
    max-width: 900px;
  }
  .adm-section-header {
    margin-bottom: 32px;
    padding-bottom: 16px;
    border-bottom: 1px solid #142018;
  }
  .adm-section-header h2 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2rem;
    letter-spacing: 4px;
    color: #d4e8d8;
  }
  .adm-section-header p {
    font-size: 0.85rem;
    letter-spacing: 1px;
    color: #4a6a50;
    margin-top: 4px;
  }

  /* CARD */
  .adm-card {
    background: #0a140c;
    border: 1px solid #142018;
    padding: 28px;
    margin-bottom: 20px;
  }
  .adm-card h3 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.1rem;
    letter-spacing: 3px;
    color: #00c04b;
    margin-bottom: 20px;
  }

  /* FORM */
  .adm-field { margin-bottom: 18px; }
  .adm-label {
    display: block;
    font-size: 0.75rem;
    font-weight: 800;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #4a8a58;
    margin-bottom: 6px;
  }
  .adm-input, .adm-select, .adm-textarea {
    width: 100%;
    background: #050e07;
    border: 1px solid #1a2e1e;
    color: #d4e8d8;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 1rem;
    letter-spacing: 1px;
    padding: 10px 14px;
    outline: none;
    transition: border-color 0.2s;
  }
  .adm-input:focus, .adm-select:focus, .adm-textarea:focus { border-color: #00c04b; }
  .adm-textarea { resize: vertical; min-height: 80px; }
  .adm-select option { background: #050e07; }
  .adm-hint {
    font-size: 0.72rem;
    letter-spacing: 1px;
    color: #3a5040;
    margin-top: 4px;
  }

  /* TWO-COL GRID */
  .adm-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

  /* TOPBAR (mobile only) */
  .adm-topbar {
    display: none;
    position: fixed;
    top: 0; left: 0; right: 0;
    height: 56px;
    background: #040d06;
    border-bottom: 1px solid #142018;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    z-index: 25;
  }
  .adm-topbar-logo {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.4rem;
    letter-spacing: 5px;
    color: #00c04b;
  }
  .adm-hamburger {
    background: none;
    border: none;
    color: #d4e8d8;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 4px;
  }
  .adm-hamburger span {
    display: block;
    width: 24px;
    height: 2px;
    background: currentColor;
    transition: transform 0.2s, opacity 0.2s;
  }
  .adm-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .adm-hamburger.open span:nth-child(2) { opacity: 0; }
  .adm-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

  /* OVERLAY */
  .adm-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.55);
    z-index: 19;
  }
  .adm-overlay.visible { display: block; }

  /* RESPONSIVE */
  @media (max-width: 768px) {
    .adm-topbar { display: flex; }

    .adm-sidebar {
      transform: translateX(-100%);
      transition: transform 0.25s ease;
      z-index: 30;
    }
    .adm-sidebar.open { transform: translateX(0); }

    .adm-main {
      margin-left: 0;
      padding: 80px 20px 40px;
      max-width: 100%;
    }

    .adm-grid-2 { grid-template-columns: 1fr; }

    .adm-release-row {
      flex-wrap: wrap;
      gap: 12px;
    }
    .adm-release-row .adm-save-btn,
    .adm-release-row .adm-danger-btn {
      flex: 1;
      min-width: 80px;
      text-align: center;
    }

    .adm-save-row { flex-wrap: wrap; }
    .adm-save-row .adm-save-btn,
    .adm-save-row .adm-logout-btn { flex: 1; }

    .adm-card { padding: 20px 16px; }
    .adm-main .adm-section-header h2 { font-size: 1.6rem; }
  }

  @media (max-width: 480px) {
    .adm-release-info strong { font-size: 0.9rem; }
    .adm-badge { display: none; }
  }

  /* CHECKBOX */
  .adm-checkbox-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 18px;
  }
  .adm-checkbox-row input[type="checkbox"] { width: 18px; height: 18px; accent-color: #00c04b; cursor: pointer; }
  .adm-checkbox-row label { font-size: 0.85rem; letter-spacing: 2px; text-transform: uppercase; color: #d4e8d8; cursor: pointer; }

  /* BUTTONS LIST */
  .adm-buttons-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 10px; }
  .adm-button-row { display: flex; gap: 8px; align-items: center; }
  .adm-button-row .adm-input { flex: 1; }
  .adm-icon-btn {
    background: none;
    border: 1px solid #1a2e1e;
    color: #4a6a50;
    width: 36px; height: 36px;
    cursor: pointer;
    font-size: 1.1rem;
    display: flex; align-items: center; justify-content: center;
    transition: color 0.2s, border-color 0.2s;
    flex-shrink: 0;
  }
  .adm-icon-btn:hover { color: #e05555; border-color: #e05555; }
  .adm-add-btn {
    background: none;
    border: 1px dashed #1a4a24;
    color: #00c04b;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.85rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 8px 16px;
    cursor: pointer;
    transition: background 0.2s;
  }
  .adm-add-btn:hover { background: #0a1a0d; }

  /* SAVE ROW */
  .adm-save-row {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 8px;
  }
  .adm-save-btn {
    background: #00c04b;
    color: #000;
    border: none;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1rem;
    letter-spacing: 3px;
    padding: 12px 32px;
    cursor: pointer;
    transition: opacity 0.2s;
  }
  .adm-save-btn:hover:not(:disabled) { opacity: 0.85; }
  .adm-save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .adm-danger-btn {
    background: none;
    border: 1px solid #3a1010;
    color: #e05555;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 0.9rem;
    letter-spacing: 3px;
    padding: 12px 20px;
    cursor: pointer;
    transition: background 0.2s;
  }
  .adm-danger-btn:hover { background: #200a0a; }

  /* IMAGE UPLOAD */
  .adm-image-upload { margin-bottom: 18px; }
  .adm-image-preview {
    width: 100%;
    max-height: 180px;
    object-fit: cover;
    margin-bottom: 8px;
    border: 1px solid #1a2e1e;
  }
  .adm-upload-btn {
    background: none;
    border: 1px solid #1a4a24;
    color: #00c04b;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.85rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 10px 20px;
    cursor: pointer;
    transition: background 0.2s;
    width: 100%;
    text-align: center;
  }
  .adm-upload-btn:hover:not(:disabled) { background: #0a1a0d; }
  .adm-upload-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* RELEASES LIST */
  .adm-releases-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
  .adm-release-row {
    background: #050e07;
    border: 1px solid #142018;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    cursor: pointer;
    transition: border-color 0.15s;
  }
  .adm-release-row:hover { border-color: #2a4a2e; }
  .adm-release-row.selected { border-color: #00c04b; }
  .adm-release-thumb {
    width: 48px; height: 48px;
    object-fit: cover;
    flex-shrink: 0;
    border: 1px solid #1a2e1e;
  }
  .adm-release-thumb-placeholder {
    width: 48px; height: 48px;
    background: #1a2e1e;
    flex-shrink: 0;
  }
  .adm-release-info { flex: 1; min-width: 0; }
  .adm-release-info strong {
    display: block;
    font-size: 1rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #d4e8d8;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .adm-release-info span {
    font-size: 0.75rem;
    letter-spacing: 1px;
    color: #4a6a50;
  }
  .adm-badge {
    font-size: 0.65rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 3px 8px;
    border: 1px solid;
    flex-shrink: 0;
  }
  .adm-badge-featured { color: #00c04b; border-color: #00c04b; }
  .adm-badge-shelf { color: #4a6a50; border-color: #1a2e1e; }

  /* DIVIDER */
  .adm-divider {
    border: none;
    border-top: 1px solid #142018;
    margin: 24px 0;
  }

  /* TOAST */
  .adm-toast {
    position: fixed;
    bottom: 32px; right: 32px;
    background: #00c04b;
    color: #000;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1rem;
    letter-spacing: 3px;
    padding: 12px 24px;
    z-index: 100;
    animation: fadeInUp 0.3s ease;
  }
  .adm-toast-err {
    position: fixed;
    bottom: 32px; right: 32px;
    background: #e05555;
    color: #fff;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1rem;
    letter-spacing: 3px;
    padding: 12px 24px;
    z-index: 100;
    animation: fadeInUp 0.3s ease;
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

// ─── ImageUpload ──────────────────────────────────────────────────────────────

function ImageUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErr("");
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch {
      setErr("Upload failed — check Cloudinary credentials.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="adm-image-upload">
      <label className="adm-label">Image</label>
      {value && <img src={value} className="adm-image-preview" alt="preview" />}
      <button
        type="button"
        className="adm-upload-btn"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? "UPLOADING..." : value ? "CHANGE IMAGE" : "UPLOAD IMAGE"}
      </button>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
      {value && !uploading && (
        <p className="adm-hint" style={{ marginTop: 6, wordBreak: "break-all" }}>{value}</p>
      )}
      {err && <p style={{ color: "#e05555", fontSize: "0.8rem", marginTop: 6 }}>{err}</p>}
    </div>
  );
}

// ─── HeroPanel ────────────────────────────────────────────────────────────────

function HeroPanel({ token, onSave }: { token: string; onSave: () => void }) {
  const { content, updateContent } = useContent();
  const [form, setForm] = useState<HeroContent & { imageUrl: string }>({
    ...content.hero,
    imageUrl: content.hero.imageUrl,
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getHero().then((data) => {
      if (data) {
        setForm({
          label: data.label,
          albumTitle: data.albumTitle,
          ctaText: data.ctaText,
          ctaUrl: data.ctaUrl,
          imageUrl: data.imageUrl ?? "",
        });
        updateContent({ ...content, hero: { label: data.label, albumTitle: data.albumTitle, ctaText: data.ctaText, ctaUrl: data.ctaUrl, imageUrl: data.imageUrl ?? "" } });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function save() {
    setError("");
    setSaving(true);
    try {
      await saveHero({ label: form.label, albumTitle: form.albumTitle, ctaText: form.ctaText, ctaUrl: form.ctaUrl, imageUrl: form.imageUrl }, token);
      updateContent({ ...content, hero: { label: form.label, albumTitle: form.albumTitle, ctaText: form.ctaText, ctaUrl: form.ctaUrl, imageUrl: form.imageUrl } });
      onSave();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="adm-section-header">
        <h2>HERO SECTION</h2>
        <p>Edit the bottom bar text and image shown in the hero.</p>
      </div>
      <div className="adm-card">
        <h3>HERO CONTENT</h3>
        <ImageUpload value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} />
        <div className="adm-field">
          <label className="adm-label">Label</label>
          <input className="adm-input" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
          <p className="adm-hint">e.g. THE NEW ALBUM</p>
        </div>
        <div className="adm-field">
          <label className="adm-label">Album Title</label>
          <input className="adm-input" value={form.albumTitle} onChange={(e) => setForm({ ...form, albumTitle: e.target.value })} />
        </div>
        <div className="adm-grid-2">
          <div className="adm-field">
            <label className="adm-label">CTA Button Text</label>
            <input className="adm-input" value={form.ctaText} onChange={(e) => setForm({ ...form, ctaText: e.target.value })} placeholder="LISTEN NOW" />
          </div>
          <div className="adm-field">
            <label className="adm-label">CTA Button URL</label>
            <input className="adm-input" value={form.ctaUrl} onChange={(e) => setForm({ ...form, ctaUrl: e.target.value })} placeholder="https://..." />
          </div>
        </div>
        {error && <p style={{ color: "#e05555", fontSize: "0.85rem", marginBottom: 12 }}>{error}</p>}
        <div className="adm-save-row">
          <button className="adm-save-btn" onClick={save} disabled={saving}>{saving ? "SAVING..." : "SAVE CHANGES"}</button>
        </div>
      </div>
    </div>
  );
}

// ─── ReleaseForm ──────────────────────────────────────────────────────────────

type ReleaseFormData = Omit<Release, "_id">;

function ReleaseForm({
  initial,
  token,
  editId,
  onDone,
  onCancel,
}: {
  initial: ReleaseFormData;
  token: string;
  editId: string | null;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<ReleaseFormData>(initial);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  function setButton(i: number, val: string) {
    setForm({ ...form, buttons: form.buttons.map((b, j) => (j === i ? val : b)) });
  }

  async function save() {
    if (!form.title.trim()) { setErr("Title is required."); return; }
    setErr("");
    setSaving(true);
    try {
      if (editId) {
        await updateRelease(editId, form, token);
      } else {
        await createRelease(form, token);
      }
      onDone();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="adm-card">
      <h3>{editId ? "EDIT RELEASE" : "NEW RELEASE"}</h3>

      <ImageUpload value={form.coverUrl} onChange={(url) => setForm({ ...form, coverUrl: url })} />

      <div className="adm-grid-2">
        <div className="adm-field">
          <label className="adm-label">Title *</label>
          <input className="adm-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. MORAYO" />
        </div>
        <div className="adm-field">
          <label className="adm-label">Eyebrow</label>
          <input className="adm-input" value={form.eyebrow} onChange={(e) => setForm({ ...form, eyebrow: e.target.value })} placeholder="e.g. THE NEW ALBUM" />
        </div>
      </div>

      <div className="adm-grid-2">
        <div className="adm-field">
          <label className="adm-label">Featured Artist</label>
          <input className="adm-input" value={form.featuredArtist} onChange={(e) => setForm({ ...form, featuredArtist: e.target.value })} placeholder="e.g. FEAT. BRENT FAIYAZ" />
        </div>
        <div className="adm-field">
          <label className="adm-label">Display Order</label>
          <input className="adm-input" type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })} />
          <p className="adm-hint">Lower = shown first</p>
        </div>
      </div>

      <div className="adm-field">
        <label className="adm-label">Music Link</label>
        <input className="adm-input" value={form.listenUrl} onChange={(e) => setForm({ ...form, listenUrl: e.target.value })} placeholder="https://open.spotify.com/..." />
        <p className="adm-hint">Any streaming URL — we'll fetch all platform links automatically.</p>
      </div>

      <div className="adm-grid-2">
        <div className="adm-field">
          <label className="adm-label">Art Placeholder</label>
          <select className="adm-select" value={form.artClass} onChange={(e) => setForm({ ...form, artClass: e.target.value })}>
            {ART_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <p className="adm-hint">Used when no image is uploaded.</p>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", paddingTop: 24 }}>
          <div className="adm-checkbox-row">
            <input
              type="checkbox"
              id="featured-chk"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            <label htmlFor="featured-chk">Featured Section</label>
          </div>
        </div>
      </div>

      <div className="adm-field">
        <label className="adm-label">Buttons</label>
        <div className="adm-buttons-list">
          {form.buttons.map((btn, i) => (
            <div className="adm-button-row" key={i}>
              <input className="adm-input" value={btn} onChange={(e) => setButton(i, e.target.value)} />
              <button
                type="button"
                className="adm-icon-btn"
                onClick={() => setForm({ ...form, buttons: form.buttons.filter((_, j) => j !== i) })}
                title="Remove"
              >✕</button>
            </div>
          ))}
        </div>
        <button type="button" className="adm-add-btn" onClick={() => setForm({ ...form, buttons: [...form.buttons, "LISTEN NOW"] })}>
          + ADD BUTTON
        </button>
      </div>

      {err && <p style={{ color: "#e05555", fontSize: "0.85rem", marginBottom: 12 }}>{err}</p>}
      <div className="adm-save-row">
        <button className="adm-save-btn" onClick={save} disabled={saving}>{saving ? "SAVING..." : editId ? "UPDATE" : "CREATE"}</button>
        <button type="button" className="adm-logout-btn" style={{ padding: "12px 20px", border: "1px solid #1a2e1e" }} onClick={onCancel}>CANCEL</button>
      </div>
    </div>
  );
}

// ─── ReleasesPanel ────────────────────────────────────────────────────────────

function ReleasesPanel({ token, onSave }: { token: string; onSave: () => void }) {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const all = await getReleases();
    all.sort((a, b) => a.displayOrder - b.displayOrder);
    setReleases(all);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function startEdit(r: Release) {
    setEditId(r._id);
    setShowForm(true);
  }

  function startNew() {
    setEditId(null);
    setShowForm(true);
  }

  async function handleDelete(r: Release) {
    if (!window.confirm(`Delete "${r.title}"? This cannot be undone.`)) return;
    setDeleting(r._id);
    try {
      await deleteRelease(r._id, token);
      await load();
      onSave();
    } catch {
      // ignore — user stays on page
    } finally {
      setDeleting(null);
    }
  }

  async function handleFormDone() {
    setShowForm(false);
    setEditId(null);
    await load();
    onSave();
  }

  const editingRelease = editId ? releases.find((r) => r._id === editId) : null;
  const formInitial: ReleaseFormData = editingRelease
    ? { title: editingRelease.title, eyebrow: editingRelease.eyebrow, featuredArtist: editingRelease.featuredArtist, featured: editingRelease.featured, displayOrder: editingRelease.displayOrder, coverUrl: editingRelease.coverUrl, listenUrl: editingRelease.listenUrl, artClass: editingRelease.artClass, buttons: [...editingRelease.buttons] }
    : { ...emptyRelease };

  return (
    <div>
      <div className="adm-section-header">
        <h2>RELEASES</h2>
        <p>Manage featured sections and shelf items. Featured releases appear as full sections; others appear in the shelf row.</p>
      </div>

      {showForm ? (
        <ReleaseForm
          key={editId ?? "new"}
          initial={formInitial}
          token={token}
          editId={editId}
          onDone={handleFormDone}
          onCancel={() => { setShowForm(false); setEditId(null); }}
        />
      ) : (
        <>
          <div style={{ marginBottom: 20 }}>
            <button className="adm-save-btn" onClick={startNew}>+ NEW RELEASE</button>
          </div>

          {loading ? (
            <p style={{ color: "#4a6a50", letterSpacing: 2, fontSize: "0.85rem" }}>LOADING...</p>
          ) : releases.length === 0 ? (
            <p style={{ color: "#4a6a50", letterSpacing: 2, fontSize: "0.85rem" }}>No releases yet. Create one above.</p>
          ) : (
            <div className="adm-releases-list">
              {releases.map((r) => (
                <div key={r._id} className="adm-release-row">
                  {r.coverUrl
                    ? <img src={r.coverUrl} className="adm-release-thumb" alt={r.title} />
                    : <div className={`adm-release-thumb-placeholder ${r.artClass}`} />
                  }
                  <div className="adm-release-info">
                    <strong>{r.title || "—"}</strong>
                    <span>{r.eyebrow}{r.featuredArtist ? ` · ${r.featuredArtist}` : ""}</span>
                  </div>
                  <span className={`adm-badge ${r.featured ? "adm-badge-featured" : "adm-badge-shelf"}`}>
                    {r.featured ? "FEATURED" : "SHELF"}
                  </span>
                  <button className="adm-save-btn" style={{ padding: "8px 16px", fontSize: "0.85rem" }} onClick={() => startEdit(r)}>EDIT</button>
                  <button
                    className="adm-danger-btn"
                    style={{ padding: "8px 16px", fontSize: "0.85rem" }}
                    disabled={deleting === r._id}
                    onClick={() => handleDelete(r)}
                  >
                    {deleting === r._id ? "..." : "DELETE"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── LoginGate ────────────────────────────────────────────────────────────────

function LoginGate({ onAuth }: { onAuth: (token: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError("");
    setLoading(true);
    try {
      const token = await apiLogin(username, password);
      sessionStorage.setItem("admin_token", token);
      onAuth(token);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#07100a" }}>
      <style>{adminStyle}</style>
      <div className="adm-card" style={{ width: 360 }}>
        <h3>ADMIN LOGIN</h3>
        <div className="adm-field">
          <label className="adm-label">Username</label>
          <input
            className="adm-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            autoFocus
          />
        </div>
        <div className="adm-field">
          <label className="adm-label">Password</label>
          <input
            className="adm-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>
        {error && <p style={{ color: "#e05555", fontSize: "0.85rem", marginBottom: 12 }}>{error}</p>}
        <div className="adm-save-row">
          <button className="adm-save-btn" onClick={handleLogin} disabled={loading}>
            {loading ? "..." : "LOGIN"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const NAV_ITEMS: { key: ActiveSection; label: string }[] = [
  { key: "hero",     label: "Hero" },
  { key: "releases", label: "Releases" },
];

export default function Admin() {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem("admin_token"));
  const [active, setActive] = useState<ActiveSection>("hero");
  const [toast, setToast] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!token) return <LoginGate onAuth={setToken} />;

  function showToast() {
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  }

  function handleLogout() {
    sessionStorage.removeItem("admin_token");
    setToken(null);
  }

  function navigate(key: ActiveSection) {
    setActive(key);
    setSidebarOpen(false);
  }

  return (
    <div className="adm-root">
      <style>{adminStyle}</style>

      {/* Mobile top bar */}
      <div className="adm-topbar">
        <span className="adm-topbar-logo">BLUEBOY</span>
        <button
          className={`adm-hamburger ${sidebarOpen ? "open" : ""}`}
          onClick={() => setSidebarOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Sidebar overlay (mobile) */}
      <div className={`adm-overlay ${sidebarOpen ? "visible" : ""}`} onClick={() => setSidebarOpen(false)} />

      <aside className={`adm-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="adm-logo">
          <h1>BLUEBOY</h1>
          <p>Admin Dashboard</p>
        </div>
        <nav className="adm-nav">
          <p className="adm-nav-label">Content</p>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`adm-nav-item ${active === item.key ? "active" : ""}`}
              onClick={() => navigate(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="adm-sidebar-footer">
          <button className="adm-view-btn" onClick={() => (window.location.hash = "")}>VIEW SITE</button>
          <button className="adm-logout-btn" onClick={handleLogout}>Log Out</button>
        </div>
      </aside>

      <main className="adm-main">
        {active === "hero"     && <HeroPanel token={token} onSave={showToast} />}
        {active === "releases" && <ReleasesPanel token={token} onSave={showToast} />}
      </main>

      {toast && <div className="adm-toast">✓ SAVED</div>}
    </div>
  );
}
