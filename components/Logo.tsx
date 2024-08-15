import { Radar } from "lucide-react";
import React from "react";

function Logo() {
  return (
    <a href="/" className="flex items-center gap-2 group">
      <Radar className="h-11 w-11 stroke-blue-500 stroke-[1.5] group-hover:stroke-violet-600 transition-colors duration-300" />
      <p className="bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent lowercase group-hover:from-indigo-400 group-hover:via-purple-500 group-hover:to-pink-500 transition-colors duration-300">
        trackr
      </p>
    </a>
  );
}

export function LogoMobile() {
  return (
    <a href="/" className="flex items-center gap-2 group">
      <p className="bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent lowercase group-hover:from-indigo-400 group-hover:via-purple-500 group-hover:to-pink-500 transition-colors duration-300">
        trackr
      </p>
    </a>
  );
}

export default Logo;
