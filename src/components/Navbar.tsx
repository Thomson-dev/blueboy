import React, { useState } from "react";
import { NAV_LINKS } from "../utils/constants";
import { NavLink } from "./NavLink";
import { useScroll } from "../hooks/useScroll";

export const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = useScroll(10);

  return (
    <>
      {/* Main Navigation */}
      <nav
        className={[
          "sticky top-0 z-50 bg-[#d32b2b] pl-10 flex items-center  px-10 md:px-20 h-15 transition-shadow duration-300",
          scrolled ? "shadow-[0_4px_24px_rgba(211,43,43,0.5)]" : "",
        ].join(" ")}
      >
        {/* Logo */}
        <span className="font-['Bebas_Neue',sans-serif] text-2xl tracking-[4px] text-white/90 uppercase">
          BlueBoy
        </span>

        {/* Desktop center links */}
        <div className="hidden md:flex gap-14 absolute left-1/2 -translate-x-1/2">
          {NAV_LINKS.map((link) => (
            <NavLink key={link} text={link} />
          ))}
        </div>

      

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-[5px] bg-transparent border-none cursor-pointer p-1"
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-[2px] bg-white transition-all duration-200 ${
              menuOpen ? "rotate-45 translate-y-[7px]" : ""
            }`}
          />
          <span
            className={`block w-6 h-[2px] bg-white transition-all duration-200 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-6 h-[2px] bg-white transition-all duration-200 ${
              menuOpen ? "-rotate-45 -translate-y-[7px]" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      <div
        className={[
          "md:hidden bg-[#b52020] flex flex-col items-center gap-0 overflow-hidden transition-all duration-300",
          menuOpen ? "max-h-40 py-4" : "max-h-0",
        ].join(" ")}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link}
            href="#"
            onClick={() => setMenuOpen(false)}
            className="font-['Bebas_Neue',sans-serif] text-xl tracking-[3px] text-white/85
                       no-underline py-2.5 w-full text-center hover:bg-black/15 transition-colors"
          >
            {link}
          </a>
        ))}
      </div>
    </>
  );
};
