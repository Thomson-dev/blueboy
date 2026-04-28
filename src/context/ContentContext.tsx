import { createContext, useContext, useState, type ReactNode } from "react";

export interface HeroContent {
  label: string;
  albumTitle: string;
  ctaText: string;
  ctaUrl: string;
  imageUrl: string;
}

export interface SiteContent {
  hero: HeroContent;
}

const defaultContent: SiteContent = {
  hero: { label: "THE NEW ALBUM", albumTitle: "MORAYO", ctaText: "LISTEN NOW", ctaUrl: "", imageUrl: "" },
};

const STORAGE_KEY = "blueboy_hero";

function loadContent(): SiteContent {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultContent;
    const parsed = JSON.parse(raw) as SiteContent;
    return { ...defaultContent, ...parsed, hero: { ...defaultContent.hero, ...parsed.hero } };
  } catch {
    return defaultContent;
  }
}

interface ContentContextValue {
  content: SiteContent;
  updateContent: (next: SiteContent) => void;
}

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(loadContent);

  function updateContent(next: SiteContent) {
    setContent(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  return (
    <ContentContext.Provider value={{ content, updateContent }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent(): ContentContextValue {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within <ContentProvider>");
  return ctx;
}
