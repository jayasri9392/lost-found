import React, { useState } from 'react';
import Orb from './Orb';

const OrbCard = ({
  children,
  className = '',
  orbHue = 180, // Default Cyan/Teal hue for ILFN branding, or pass 0 for original
  hoverIntensity = 2,
  rotateOnHover = true,
  forceHoverState = false,
  backgroundColor = '#000000',
  showOrb = true,
  onClick,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border border-slate-700/60 dark:border-slate-800 bg-slate-900/90 text-white backdrop-blur-md shadow-xl transition-all duration-300 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/10 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      {...props}
    >
      {/* Orb Visual Enhancement Layer (Behind content, non-blocking) */}
      {showOrb && (
        <div className="absolute -right-16 -top-16 w-64 h-64 sm:w-80 sm:h-80 pointer-events-none opacity-45 group-hover:opacity-85 transition-opacity duration-700 z-0 overflow-hidden rounded-full blur-[0.5px]">
          <Orb
            hoverIntensity={hoverIntensity}
            rotateOnHover={rotateOnHover}
            hue={orbHue}
            forceHoverState={forceHoverState || isHovered}
            backgroundColor={backgroundColor}
          />
        </div>
      )}

      {/* Subtle border shine & gradient wash */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 pointer-events-none" />

      {/* Card Content (Interactive, fully functional) */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default OrbCard;
