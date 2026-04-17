import React from "react";

const PinkGradientShape = () => {
  return (
    <svg
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid meet"
      className="absolute w-full h-full transform rotate-[270deg] -top-1/2 -right-1/4"
    >
      <defs>
        <linearGradient
          id="pinkGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#fcf4f2" />
          <stop offset="35%" stopColor="#fdd2cc" />
          <stop offset="70%" stopColor="#febdb6" />
        </linearGradient>
      </defs>
      <path
        d="
      M500,60
      C670,-40 940,120 920,320
      C900,520 680,540 600,680
      C520,820 700,960 480,990
      C260,1020 240,820 180,680
      C120,540 -20,520 40,320
      C100,120 330,160 500,60
      Z
    "
        fill="url(#pinkGradient)"
        stroke="none"
      />
    </svg>
  );
};
export default PinkGradientShape;
