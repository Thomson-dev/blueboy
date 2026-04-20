import React from "react";

interface NavLinkProps {
  text: string;
  onClick?: () => void;
}

export const NavLink: React.FC<NavLinkProps> = ({ text, onClick }) => {
  return (
    <a
      href="#"
      onClick={onClick}
      className="font-['Bebas_Neue',sans-serif] text-[20px] tracking-[3px]
                 text-white/80 no-underline transition-all duration-150
                 pb-0.5 border-b-2 border-transparent
                 hover:text-white hover:border-white"
    >
      {text}
    </a>
  );
};
