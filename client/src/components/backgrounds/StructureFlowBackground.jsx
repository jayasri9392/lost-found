import React from 'react';
import { StructureFlowCollection } from '@designcodeio/threeui';
import '@designcodeio/threeui/style.css';

/**
 * StructureFlowBackground
 * Renders the StructureFlowCollection ThreeUI effect as a fixed full-viewport background
 * for the Search and Profile pages.
 * z-index: 0, pointer-events: none — content sits above it.
 */
const StructureFlowBackground = () => {
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
      <StructureFlowCollection
        variant="structure-flow"
        speed={1.00}
        pointSize={0.080}
        opacity={0.40}
        maskStart={0.20}
        maskSolid={0.50}
      />
    </div>
  );
};

export default StructureFlowBackground;
