import { Shapes } from "lucide-react";
import React from "react";

function Logo() {
  return (
    <a href="/" className="flex items-center gap-2">
      <Shapes className="stroke h-11 w-11 stroke-blue-500 stroke-[1.5]" />
      <p className="text-3xl font-bold leading-tight tracking-tighter text-white">
        trackr
      </p>
    </a>
  );
}

export function LogoMobile() {
  return (
    <a href="/" className="flex items-center gap-2">
      <p className="text-3xl font-bold leading-tight tracking-tighter text-white">
        trackr
      </p>
    </a>
  );
}

export default Logo;