import React from 'react';
import Ferrofluid from '../effects/Ferrofluid';

/**
 * FerrofluidBackground
 * Renders the interactive Ferrofluid effect as a fixed full-viewport background
 * for Search and Profile pages.
 */
const FerrofluidBackground = () => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        width: '100vw',
        height: '100vh',
      }}
    >
      <Ferrofluid
        colors={["#ffffff", "#ffffff", "#ffffff"]}
        speed={0.5}
        scale={1.6}
        turbulence={1}
        fluidity={0.1}
        rimWidth={0.2}
        sharpness={2.5}
        shimmer={1.5}
        glow={2}
        flowDirection="down"
        opacity={1}
        mouseInteraction
        mouseStrength={1}
        mouseRadius={0.35}
      />
    </div>
  );
};

export default FerrofluidBackground;
