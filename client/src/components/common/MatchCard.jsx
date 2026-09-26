import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, Calendar, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import ILFNButton from '../effects/ILFNButton';

const MatchCard = ({ match, targetType = 'found', onClaimClick }) => {
  const item = targetType === 'found' ? match.foundItem : match.lostItem;
  if (!item) return null;

  const score = match.matchScore;
  const confidence = match.confidence;

  const getScoreColor = (val) => {
    if (val >= 70) return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800';
    if (val >= 45) return 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800';
    return 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800';
  };

  const itemDate = targetType === 'found' ? item.dateFound : item.dateLost;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-md p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between hover:border-cyan-500/50 transition-all">
      {/* Left Thumbnail & Info */}
      <div className="flex gap-4 items-start flex-1 min-w-0">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 shrink-0 border border-slate-200 dark:border-slate-700">
          {item.image ? (
            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 font-medium p-2 text-center">
              No photo
            </div>
          )}
          <span className="absolute bottom-1.5 left-1.5 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-900/80 text-white backdrop-blur-sm">
            {targetType === 'found' ? 'Found' : 'Lost'}
          </span>
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-cyan-400 border border-blue-200 dark:border-blue-900">
              {item.category}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {item.status}
            </span>
          </div>

          <h4 className="text-base font-bold text-slate-900 dark:text-white truncate">
            {item.title}
          </h4>

          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate max-w-[160px]">{item.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{itemDate ? new Date(itemDate).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>

          {/* Match factors preview */}
          {match.matchReasons && match.matchReasons.length > 0 && (
            <div className="pt-2 flex flex-wrap gap-1.5">
              {match.matchReasons.slice(0, 3).map((reason, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                  <span>{reason}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Score Pill & CTA */}
      <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-700">
        <div className={`px-4 py-2 rounded-2xl border flex items-center gap-2 ${getScoreColor(score)}`}>
          <Sparkles className="w-5 h-5 shrink-0" />
          <div className="text-right">
            <div className="text-lg font-black leading-none">{score}%</div>
            <div className="text-[10px] font-bold uppercase tracking-wider">{confidence} match</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/items/${targetType}/${item._id}`}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-colors inline-flex items-center gap-1"
          >
            <span>View</span>
            <ArrowRight className="w-3 h-3" />
          </Link>

          {targetType === 'found' && item.status === 'Available' && onClaimClick && (
            <ILFNButton
              onClick={() => onClaimClick(item)}
              variant="cyan"
              size="sm"
              icon={ShieldCheck}
            >
              Claim
            </ILFNButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
