const BASE = "http://localhost:5000";

// ─── Cloudinary ───────────────────────────────────────────────────────────────

const CLOUD_NAME   = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

export async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: form }
  );
  if (!res.ok) throw new Error("Image upload failed");
  const data = await res.json();
  return data.secure_url as string;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface HeroPayload {
  label: string;
  albumTitle: string;
  ctaText: string;
  ctaUrl: string;
  imageUrl: string;
}

export async function login(username: string, password: string): Promise<string> {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  console.log("POST /api/auth/login →", data);
  if (!res.ok) throw new Error(data.message ?? "Invalid username or password");
  return data.token;
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

export async function getHero(): Promise<HeroPayload | null> {
  try {
    const res = await fetch(`${BASE}/api/hero`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function saveHero(payload: HeroPayload, token: string): Promise<void> {
  const res = await fetch(`${BASE}/api/hero`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (res.status === 404) {
    const res2 = await fetch(`${BASE}/api/hero`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res2.ok) throw new Error("Failed to save hero");
    return;
  }

  if (!res.ok) throw new Error("Failed to save hero");
}

// ─── Releases ─────────────────────────────────────────────────────────────────

export interface Release {
  _id: string;
  title: string;
  featured: boolean;
  displayOrder: number;
  coverUrl: string;
  listenUrl: string;
  eyebrow: string;
  featuredArtist: string;
  artClass: string;
  buttons: string[];
}

export async function getReleases(featured?: boolean): Promise<Release[]> {
  try {
    const query = featured !== undefined ? `?featured=${featured}` : "";
    const res = await fetch(`${BASE}/api/releases${query}`);
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function createRelease(data: Partial<Release>, token: string): Promise<Release> {
  const res = await fetch(`${BASE}/api/releases`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create release");
  return res.json();
}

export async function updateRelease(id: string, data: Partial<Release>, token: string): Promise<Release> {
  const res = await fetch(`${BASE}/api/releases/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update release");
  return res.json();
}

export async function deleteRelease(id: string, token: string): Promise<void> {
  const res = await fetch(`${BASE}/api/releases/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete release");
}

// ─── Odesli (song.link) ───────────────────────────────────────────────────────

export interface OdesliLinks {
  [platform: string]: { url: string };
}

export async function fetchStreamingLinks(musicUrl: string): Promise<OdesliLinks | null> {
  try {
    const res = await fetch(
      `https://api.song.link/v1-alpha.1/links?url=${encodeURIComponent(musicUrl)}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.linksByPlatform ?? null;
  } catch {
    return null;
  }
}
