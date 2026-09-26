import React from 'react';
import MoltenMetal from '../effects/MoltenMetal';

/**
 * Reusable MoltenMetal full-page background.
 * Sits at z-0 with pointer-events: none so interactive content stays clickable.
 */
const MoltenMetalBackground = ({ className = '' }) => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
      className={className}
      aria-hidden="true"
    >
      <MoltenMetal
        color1="#5227FF"
        color2="#FF9FFC"
        color3="#FFFFFF"
        speed={0.35}
        scale={4}
        detail={3}
        glow={1.6}
        coreSize={0.1}
        swirl={1}
        fold={-0.2}
        blackPoint={0.05}
        brightness={1.3}
        colorMode="molten"
        grain
        grainIntensity={0.05}
        mouseInteraction={false}
        mouseStrength={0.3}
        opacity={1}
      />
    </div>
  );
};

export default MoltenMetalBackground;
