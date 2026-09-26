import React, { useState } from 'react';
import { Loader2, ArrowRight } from 'lucide-react';
import { SignUpButton } from '../../shaders/sign-up-button/SignUpButton';
import '../../shaders/threeui.css';

/**
 * ILFNButton: Interactive futuristic button component with the signature ThreeUI aesthetic.
 * Incorporates the ThreeUI pill shape, metallic body, glass sphere with animated spinning ring,
 * and glowing liquid potion accents tailored to ILFN's Navy, Cyan, Teal, Rose, and Emerald palette.
 * Preserves 100% of functional requirements: onClick, type, form submit, disabled, loading.
 */
const ILFNButton = ({
  children,
  onClick,
  type = 'button',
  variant = 'cyan', // 'cyan', 'primary', 'rose', 'emerald', 'outline', 'secondary', 'danger', 'threeui'
  size = 'md', // 'sm', 'md', 'lg'
  disabled = false,
  loading = false,
  icon: Icon,
  className = '',
  style = {},
  ariaLabel,
  ...rest
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // If threeui variant is explicitly requested, render the exact registered ThreeUI SignUpButton iframe
  if (variant === 'threeui') {
    return (
      <div
        className={`relative inline-block overflow-hidden rounded-full cursor-pointer transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98] ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className}`}
        style={{ width: '280px', height: '88px', ...style }}
        onClick={!disabled && !loading ? onClick : undefined}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={ariaLabel || (typeof children === 'string' ? children : 'Action')}
        onKeyDown={(e) => {
          if (!disabled && !loading && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onClick?.(e);
          }
        }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <SignUpButton className="w-full h-full" />
        </div>
        {/* Transparent click/submit overlay */}
        <button
          type={type}
          disabled={disabled || loading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          aria-label={ariaLabel || 'Submit'}
        />
      </div>
    );
  }

  // Theme palettes for the ThreeUI sphere, glow, and borders
  const theme = {
    cyan: {
      border: 'border-cyan-500/40 group-hover:border-cyan-400',
      glow: 'shadow-[0_8px_20px_rgba(0,0,0,0.5),0_0_15px_rgba(6,182,212,0.25)] group-hover:shadow-[0_12px_28px_rgba(0,0,0,0.6),0_0_25px_rgba(6,182,212,0.45)]',
      sphereBg: 'from-cyan-900 via-cyan-800 to-slate-950',
      sphereBorder: 'border-cyan-400/50',
      sphereGlow: 'shadow-[0_0_12px_rgba(6,182,212,0.6)] group-hover:shadow-[0_0_18px_rgba(6,182,212,0.9)]',
      ringStroke: 'rgba(34, 211, 238, 0.75)',
      ringActiveStroke: '#22d3ee',
      dotColor: 'bg-cyan-400',
      textColor: 'text-slate-200 group-hover:text-white',
    },
    primary: {
      border: 'border-cyan-500/40 group-hover:border-cyan-400',
      glow: 'shadow-[0_8px_20px_rgba(0,0,0,0.5),0_0_15px_rgba(6,182,212,0.25)] group-hover:shadow-[0_12px_28px_rgba(0,0,0,0.6),0_0_25px_rgba(6,182,212,0.45)]',
      sphereBg: 'from-cyan-900 via-teal-900 to-slate-950',
      sphereBorder: 'border-cyan-400/50',
      sphereGlow: 'shadow-[0_0_12px_rgba(6,182,212,0.6)] group-hover:shadow-[0_0_18px_rgba(6,182,212,0.9)]',
      ringStroke: 'rgba(34, 211, 238, 0.75)',
      ringActiveStroke: '#22d3ee',
      dotColor: 'bg-cyan-400',
      textColor: 'text-slate-200 group-hover:text-white',
    },
    rose: {
      border: 'border-rose-500/40 group-hover:border-rose-400',
      glow: 'shadow-[0_8px_20px_rgba(0,0,0,0.5),0_0_15px_rgba(244,63,94,0.25)] group-hover:shadow-[0_12px_28px_rgba(0,0,0,0.6),0_0_25px_rgba(244,63,94,0.45)]',
      sphereBg: 'from-rose-900 via-red-900 to-slate-950',
      sphereBorder: 'border-rose-400/50',
      sphereGlow: 'shadow-[0_0_12px_rgba(244,63,94,0.6)] group-hover:shadow-[0_0_18px_rgba(244,63,94,0.9)]',
      ringStroke: 'rgba(251, 113, 133, 0.75)',
      ringActiveStroke: '#fb7185',
      dotColor: 'bg-rose-400',
      textColor: 'text-slate-200 group-hover:text-white',
    },
    emerald: {
      border: 'border-emerald-500/40 group-hover:border-emerald-400',
      glow: 'shadow-[0_8px_20px_rgba(0,0,0,0.5),0_0_15px_rgba(16,185,129,0.25)] group-hover:shadow-[0_12px_28px_rgba(0,0,0,0.6),0_0_25px_rgba(16,185,129,0.45)]',
      sphereBg: 'from-emerald-900 via-teal-900 to-slate-950',
      sphereBorder: 'border-emerald-400/50',
      sphereGlow: 'shadow-[0_0_12px_rgba(16,185,129,0.6)] group-hover:shadow-[0_0_18px_rgba(16,185,129,0.9)]',
      ringStroke: 'rgba(52, 211, 153, 0.75)',
      ringActiveStroke: '#34d399',
      dotColor: 'bg-emerald-400',
      textColor: 'text-slate-200 group-hover:text-white',
    },
    outline: {
      border: 'border-slate-700 group-hover:border-cyan-400/70',
      glow: 'shadow-[0_4px_12px_rgba(0,0,0,0.3)] group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]',
      sphereBg: 'from-slate-800 via-slate-900 to-slate-950',
      sphereBorder: 'border-slate-600 group-hover:border-cyan-400/60',
      sphereGlow: 'shadow-[0_0_8px_rgba(6,182,212,0.3)]',
      ringStroke: 'rgba(148, 163, 184, 0.6)',
      ringActiveStroke: '#22d3ee',
      dotColor: 'bg-cyan-400',
      textColor: 'text-slate-300 group-hover:text-white',
    },
    secondary: {
      border: 'border-slate-700/80 group-hover:border-slate-600',
      glow: 'shadow-[0_4px_12px_rgba(0,0,0,0.3)]',
      sphereBg: 'from-slate-800 to-slate-950',
      sphereBorder: 'border-slate-600',
      sphereGlow: 'shadow-none',
      ringStroke: 'rgba(148, 163, 184, 0.4)',
      ringActiveStroke: '#94a3b8',
      dotColor: 'bg-slate-400',
      textColor: 'text-slate-300 group-hover:text-white',
    },
    danger: {
      border: 'border-red-500/40 group-hover:border-red-400',
      glow: 'shadow-[0_8px_20px_rgba(0,0,0,0.5),0_0_15px_rgba(239,68,68,0.25)]',
      sphereBg: 'from-red-950 via-red-900 to-slate-950',
      sphereBorder: 'border-red-500/50',
      sphereGlow: 'shadow-[0_0_10px_rgba(239,68,68,0.5)]',
      ringStroke: 'rgba(248, 113, 113, 0.75)',
      ringActiveStroke: '#f87171',
      dotColor: 'bg-red-400',
      textColor: 'text-slate-200 group-hover:text-white',
    },
  }[variant] || theme.primary;

  // Size scalers
  const sizeConfig = {
    sm: {
      padding: 'pl-4 pr-1.5 py-1.5',
      sphereSize: 'w-6 h-6',
      iconSize: 'w-3 h-3',
      text: 'text-[11px] tracking-[0.14em]',
    },
    md: {
      padding: 'pl-5 pr-2 py-2',
      sphereSize: 'w-8 h-8',
      iconSize: 'w-3.5 h-3.5',
      text: 'text-xs tracking-[0.18em]',
    },
    lg: {
      padding: 'pl-6 pr-2.5 py-2.5',
      sphereSize: 'w-10 h-10',
      iconSize: 'w-4 h-4',
      text: 'text-sm tracking-[0.2em]',
    },
  }[size] || sizeConfig.md;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      aria-label={ariaLabel}
      style={style}
      className={`group relative inline-flex items-center justify-between rounded-full border transition-all duration-300 select-none cursor-pointer disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97] hover:-translate-y-0.5 ${sizeConfig.padding} ${theme.border} ${theme.glow} ${className}`}
      {...rest}
    >
      {/* ThreeUI Layer 1: Multi-stop Metallic Pill Body */}
      <span
        className="absolute inset-0 rounded-full transition-opacity duration-300"
        style={{
          background:
            'linear-gradient(180deg, #1e293b 0%, #0f172a 35%, #070d18 70%, #020617 100%)',
        }}
      />

      {/* ThreeUI Layer 2: Subtle Top Specular Rim Reflection */}
      <span className="absolute inset-x-3 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none rounded-full" />

      {/* ThreeUI Layer 3: Inner Rim Shadow */}
      <span className="absolute inset-0 rounded-full pointer-events-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-1px_1px_rgba(0,0,0,0.8)]" />

      {/* Button Text Label */}
      <span
        className={`relative z-10 font-mono font-bold uppercase transition-colors duration-250 mr-3 whitespace-nowrap ${sizeConfig.text} ${theme.textColor}`}
      >
        {children}
      </span>

      {/* ThreeUI Signature Knob / Glass Sphere on the right */}
      <div
        className={`relative z-10 ${sizeConfig.sphereSize} rounded-full flex items-center justify-center border transition-all duration-300 ${theme.sphereBorder} ${theme.sphereGlow} shrink-0`}
      >
        {/* Inner Liquid Well & Glow */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-b ${theme.sphereBg} overflow-hidden`}
        >
          {/* Liquid gradient wash */}
          <div className="absolute inset-0 bg-radial from-white/20 via-transparent to-black/60 pointer-events-none" />

          {/* Specular gloss blob */}
          <div className="absolute top-0.5 left-1 w-2.5 h-1.5 bg-white/40 rounded-full blur-[0.5px] pointer-events-none" />
        </div>

        {/* Animated Rotating Dashed Ring (Signature ThreeUI feature) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none animate-[spin_4s_linear_infinite]"
          viewBox="0 0 32 32"
        >
          <circle
            cx="16"
            cy="16"
            r="13"
            fill="none"
            stroke={isPressed ? theme.ringActiveStroke : theme.ringStroke}
            strokeWidth="1.2"
            strokeDasharray="4 3"
          />
        </svg>

        {/* Icon or Loading Spinner inside Sphere */}
        <div className="relative z-10 flex items-center justify-center text-white">
          {loading ? (
            <Loader2 className={`${sizeConfig.iconSize} animate-spin text-cyan-300`} />
          ) : Icon ? (
            <Icon className={`${sizeConfig.iconSize} transition-transform duration-200 group-hover:scale-110`} />
          ) : (
            <ArrowRight className={`${sizeConfig.iconSize} transition-transform duration-200 group-hover:translate-x-0.5`} />
          )}
        </div>
      </div>
    </button>
  );
};

export default ILFNButton;
