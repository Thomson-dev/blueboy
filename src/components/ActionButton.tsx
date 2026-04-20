import React from "react";

interface ActionButtonProps {
  text: string;
  primary: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ text }) => {
  return (
    <button
      className="font-['Bebas_Neue',sans-serif] text-[13px] tracking-[2.5px] cursor-pointer
                 transition-all duration-200 bg-transparent text-white border border-white
                 px-5 py-2 hover:bg-white hover:text-black"
    >
      {text}
    </button>
  );
};
