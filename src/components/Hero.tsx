import React from "react";

export const Hero: React.FC = () => {
  return (
    <div className="relative h-[88vh] overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=1600&q=85"
        alt="BlueBoy hero"
        className="w-full h-full object-cover object-top grayscale brightness-[0.55] contrast-[1.15] block"
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(10,10,10,0.88)]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[rgba(10,10,10,0.2)] to-[rgba(10,10,10,0.55)]" />

      {/* Hero text */}
      <div className="absolute bottom-16 sm:bottom-[72px] left-6 sm:left-12 lg:left-20">
        <p className="font-['Barlow_Condensed',sans-serif] text-[11px] tracking-[4px]
                      text-[#d32b2b] font-bold mb-2 uppercase">
          THE NEW ALBUM
        </p>
        <h1 className="font-['Bebas_Neue',sans-serif] text-[clamp(56px,10vw,112px)]
                       tracking-[8px] sm:tracking-[10px] text-white leading-[0.92] mb-7 uppercase">
          BlueBoy
        </h1>
        <button
          className="font-['Bebas_Neue',sans-serif] text-[14px] tracking-[3px]
                     bg-[#d32b2b] text-white border-none px-8 sm:px-10 py-3 sm:py-3.5
                     cursor-pointer transition-all duration-200
                     hover:bg-[#b52020] hover:-translate-y-0.5"
        >
          LISTEN NOW
        </button>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-30 animate-[bob_2.2s_ease-in-out_infinite]">
        <div className="w-px h-9 bg-white" />
        <div className="w-0 h-0 border-l-4 border-r-4 border-t-[5px] border-l-transparent border-r-transparent border-t-white" />
      </div>
    </div>
  );
};
