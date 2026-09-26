import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileQuestion, PlusCircle, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import AnimatedAuthBackground from '../components/backgrounds/AnimatedAuthBackground';
import OrbCard from '../components/effects/OrbCard';
import ILFNButton from '../components/effects/ILFNButton';
import DepthText from '../components/effects/DepthText';

/**
 * Report landing page – shown at /report.
 * Presents a choice between reporting a lost item and reporting a found item.
 * Enhanced with AnimatedAuthBackground, DepthText in yellow, and interactive OrbCards.
 */
const Report = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        paddingTop: '6rem',
        paddingBottom: '5rem',
      }}
    >
      {/* Background Effect — fixed, behind everything */}
      <AnimatedAuthBackground />

      {/* Dark gradient overlay for readability and contrast */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          background: 'linear-gradient(135deg, rgba(2,6,23,0.85) 0%, rgba(15,23,42,0.80) 50%, rgba(2,6,23,0.90) 100%)',
        }}
      />

      {/* Main Page Content */}
      <div style={{ position: 'relative', zIndex: 2 }} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-yellow-500/30 text-yellow-300 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md shadow-[0_0_15px_rgba(250,204,21,0.15)]">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span>Submit a Report</span>
          </div>

          {/* "What would you like to report?" with DepthText in Vibrant Yellow */}
          <div className="py-2 flex justify-center" style={{ minHeight: '85px' }}>
            <DepthText
              text="What would you like to report?"
              layers={30}
              depth={2.2}
              faceColor="#facc15"
              depthColor="#ca8a04"
              tilt={6.5}
              pointerTracking
              smoothing={0.14}
              perspective={900}
              autoOrbit
              orbitSpeed={0.3}
              fontSize="clamp(1.7rem, 4.5vw, 2.75rem)"
              fontWeight={900}
              shadow
            />
          </div>

          <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto leading-relaxed">
            Choose whether you lost an item and need help finding it, or whether you found
            something and want to help return it to its owner.
          </p>
        </div>

        {/* Choice Cards (Cards UI) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          
          {/* I Lost Something Card */}
          <OrbCard
            orbHue={350}
            hoverIntensity={2.0}
            showOrb={true}
            className="p-8 flex flex-col justify-between gap-6 border-rose-500/30 hover:border-rose-400/60 shadow-rose-500/5 group"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-110 group-hover:bg-rose-500/20 transition-all duration-300">
                <FileQuestion className="w-7 h-7" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white group-hover:text-rose-300 transition-colors">
                  I Lost Something
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Submit a lost item report with specific details and photos. Our AI similarity
                  engine will automatically search candidate found items and notify you of matches.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <ILFNButton
                onClick={() => navigate('/report-lost')}
                variant="rose"
                size="md"
                icon={ArrowRight}
                className="w-full"
              >
                Report Lost Item
              </ILFNButton>
            </div>
          </OrbCard>

          {/* I Found Something Card */}
          <OrbCard
            orbHue={140}
            hoverIntensity={2.0}
            showOrb={true}
            className="p-8 flex flex-col justify-between gap-6 border-emerald-500/30 hover:border-emerald-400/60 shadow-emerald-500/5 group"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300">
                <PlusCircle className="w-7 h-7" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white group-hover:text-emerald-300 transition-colors">
                  I Found Something
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Log a found item to help reunite it with its owner. ILFN will securely
                  notify registered users who filed matching lost item claims.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <ILFNButton
                onClick={() => navigate('/report-found')}
                variant="emerald"
                size="md"
                icon={ArrowRight}
                className="w-full"
              >
                Report Found Item
              </ILFNButton>
            </div>
          </OrbCard>

        </div>

        {/* Security & Verification Info Card */}
        <OrbCard orbHue={210} hoverIntensity={1.2} showOrb={false} className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl text-cyan-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              You must be signed in to submit a report. All reported data is safely indexed.
              Private contact information is only revealed once ownership is officially verified through the Claims module.
            </p>
          </div>
        </OrbCard>

      </div>
    </div>
  );
};

export default Report;
