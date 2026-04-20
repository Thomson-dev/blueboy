import type { MusicItem } from "../types/music";

export const NAV_LINKS = ["MUSIC", "VIDEO", "TOUR"];

export const MUSIC_ITEMS: MusicItem[] = [
  {
    label: "THE NEW ALBUM",
    title: "BlueBoy",
    subtitle: null,
    image: "https://images.unsplash.com/photo-1619983081563-430f63602796?w=400&q=90",
    buttons: [{ text: "LISTEN NOW", primary: true }],
  },
  {
    label: "THE NEWEST SINGLE",
    title: "KESE (DANCE)",
    subtitle: null,
    image: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=400&q=90",
    buttons: [{ text: "LISTEN NOW", primary: true }],
  },
  {
    label: "SINGLE",
    title: "PIECE OF MY HEART",
    subtitle: "FEAT. BRENT FAIYAZ",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&q=90",
    buttons: [
      { text: "LISTEN NOW", primary: true },
      { text: "WATCH NOW", primary: false },
    ],
  },
];

export const COLORS = {
  PRIMARY_RED: "#d32b2b",
  DARK_RED: "#b52020",
  BLACK: "#0a0a0a",
  DARK_BLACK: "#1a0a0a",
};
