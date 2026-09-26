import React from 'react';
import Galaxy from '../effects/Galaxy';

const GalaxyBackground = ({
  density = 1,
  glowIntensity = 0.3,
  saturation = 0,
  hueShift = 140,
  twinkleIntensity = 0.3,
  rotationSpeed = 0.1,
  repulsionStrength = 2,
  autoCenterRepulsion = 0,
  starSpeed = 0.5,
  speed = 1,
  className = '',
  style = {}
}) => {
  return (
    <div
      className={`galaxy-bg-wrapper fixed inset-0 pointer-events-none z-0 overflow-hidden ${className}`}
      style={{
        width: '100vw',
        height: '100vh',
        ...style
      }}
      aria-hidden="true"
    >
      {/* Base dark space tone */}
      <div className="absolute inset-0 bg-[#07090e]" />

      {/* Animated Galaxy Starfield Canvas */}
      <div className="absolute inset-0 w-full h-full opacity-90">
        <Galaxy
          mouseRepulsion
          mouseInteraction
          density={density}
          glowIntensity={glowIntensity}
          saturation={saturation}
          hueShift={hueShift}
          twinkleIntensity={twinkleIntensity}
          rotationSpeed={rotationSpeed}
          repulsionStrength={repulsionStrength}
          autoCenterRepulsion={autoCenterRepulsion}
          starSpeed={starSpeed}
          speed={speed}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* High-contrast dashboard overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#07090e]/60 via-transparent to-[#07090e]/95 pointer-events-none" />
    </div>
  );
};

export default GalaxyBackground;
