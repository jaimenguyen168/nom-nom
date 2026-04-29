import React from "react";

const PinkGradientShape = () => {
  return (
    <>
      {/* Mobile: different blob anchored top-right, only Y offset, no horizontal bleed */}
      <svg
        viewBox="0 0 500 420"
        preserveAspectRatio="xMaxYMin meet"
        className="block md:hidden absolute top-0 left-0 right-0 h-auto -translate-y-1/4 pointer-events-none -translate-x-1/6"
        style={{ zIndex: -1 }}
      >
        <defs>
          <linearGradient
            id="pinkGradientMobile"
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
        {/* Organic blob contained within 0–500 x range, extends upward in Y only */}
        <g transform="scale(-0.5, 0.42) translate(-1000, 0)">
          <path
            d="
    M500,60
    C330,-40 60,120 10,150
    C100,520 320,540 300,680
    C480,820 300,960 520,990
    C740,1020 760,820 820,680
    C880,540 1020,520 960,320
    C900,120 670,160 500,60
    Z
  "
            fill="url(#pinkGradientMobile)"
          />
        </g>
      </svg>

      {/* Desktop: original shape */}
      <svg
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid meet"
        className="hidden md:block absolute w-full h-full transform rotate-270 -top-1/2 -right-1/4"
        style={{ zIndex: -1 }}
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
    </>
  );
};

export default PinkGradientShape;
