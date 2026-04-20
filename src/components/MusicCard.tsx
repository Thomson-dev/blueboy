import React, { useState } from "react";
import type { MusicItem } from "../types/music";

interface MusicCardProps {
  item: MusicItem;
  index: number;
}

function ActionButton({ text, primary }: { text: string; primary: boolean }) {
  return (
    <button
      className={[
        "font-['Bebas_Neue',sans-serif]  text-[14px] tracking-[2px] cursor-pointer transition-all duration-200",
        primary
          ? "bg-transparent text-white border border-white px-5 py-2 hover:bg-white hover:text-black"
          : "bg-transparent text-white border border-white px-5 py-2 hover:bg-white hover:text-black",
      ].join(" ")}
    >
      {text}
    </button>
  );
}

export const MusicCard: React.FC<MusicCardProps> = ({ item }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex flex-col sm:flex-row items-center sm:items-center
                 justify-center gap-6 sm:gap-10
                 py-10 sm:py-12
                 border-t border-white/[0.06] first:border-t-0
                 transition-colors duration-300 hover:bg-white/[0.02]"
    >
      {/* Cover Art */}
      <div className="w-[148px] h-[148px] flex-shrink-0 overflow-hidden relative">
        <img
          src={item.image}
          alt={item.title}
          className={[
            "w-full h-full object-cover block transition-all duration-500 ease-out",
            hovered ? "scale-[1.06] brightness-105" : "scale-100 brightness-90",
          ].join(" ")}
        />
        {/* Red accent bar on hover */}
        <div
          className={[
            "absolute bottom-0 left-0 h-[3px] bg-[#d32b2b] transition-all duration-[350ms] ease-out",
            hovered ? "w-full" : "w-0",
          ].join(" ")}
        />
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 min-w-[200px] text-center sm:text-left">
        {item.label && (
          <p className="font-['Barlow_Condensed',sans-serif] text-[11px] tracking-[3px]
                        text-white/60 font-bold m-0 uppercase">
            {item.label}
          </p>
        )}

        <h2 className="font-['Bebas_Neue',sans-serif] text-[32px] sm:text-[38px]
                       tracking-[2px] text-white leading-none m-0">
          {item.title}
        </h2>

        {item.subtitle && (
          <p className="font-['Barlow_Condensed',sans-serif] text-[11px] tracking-[2px]
                        text-white/55 font-semibold m-0 uppercase">
            {item.subtitle}
          </p>
        )}

        <div className="flex gap-2.5 mt-3 justify-center sm:justify-start flex-wrap">
          {item.buttons.map((btn) => (
            <ActionButton key={btn.text} text={btn.text} primary={btn.primary} />
          ))}
        </div>
      </div>
    </div>
  );
};