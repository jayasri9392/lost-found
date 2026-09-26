import React from 'react';
import Scanner from '../effects/Scanner';

/**
 * ScannerBackground
 * Renders the futuristic Scanner effect as a fixed full-viewport background
 * with a high-contrast dark overlay to ensure content readability.
 */
const ScannerBackground = () => {
  return (
    <>
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
        <Scanner
          color1="#5227FF"
          color2="#FF9FFC"
          color3="#FFFFFF"
          speed={0.5}
          sweepSpeed={0.25}
          sweepWidth={1.6}
          sweepFalloff={6}
          scale={1.5}
          frequency={2}
          ripple={0.22}
          bandDensity={11}
          lineSharpness={5.5}
          glow={0.22}
          scanDirection="vertical"
          colorSpread={0.7}
          brightness={1}
          contrast={1.15}
          softness={1.4}
          vignette={0.45}
          scanline
          grain
          grainIntensity={0.05}
          opacity={1}
          mouseInteraction
          mouseRadius={0.5}
          mouseStrength={0.5}
        />
      </div>
      {/* Dark overlay for crystal clear text readability */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          background: 'linear-gradient(135deg, rgba(3,7,18,0.78) 0%, rgba(15,23,42,0.72) 50%, rgba(3,7,18,0.85) 100%)',
        }}
      />
    </>
  );
};

export default ScannerBackground;
