import React from "react";
import type { MusicItem } from "../types/music";
import { MusicCard } from "./MusicCard";

interface MusicSectionProps {
  items: MusicItem[];
}

export const MusicSection: React.FC<MusicSectionProps> = ({ items }) => {
  return (
    <section className="bg-[#0a0a0a] w-full my-4 py-4">
      <div className="flex justify-center gap-11 mt-7 flex-col mx-auto">
        {items.map((item, i) => (
          <MusicCard key={i} item={item} index={i} />
        ))}
      </div>
    </section>
  );
};