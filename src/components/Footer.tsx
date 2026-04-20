import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer
      className="border-t border-white/[0.05] px-6 sm:px-12 lg:px-20 py-6
                 flex flex-col sm:flex-row justify-between items-center gap-3 mx-auto max-w-7xl"
    >
      <span className="font-['Bebas_Neue',sans-serif] text-lg tracking-[4px] text-white/18 uppercase">
        BlueBoy
      </span>
      <p className="font-['Barlow_Condensed',sans-serif] text-[11px] tracking-[2px] text-white/18 m-0">
        © {new Date().getFullYear()} ALL RIGHTS RESERVED
      </p>
    </footer>
  );
};
