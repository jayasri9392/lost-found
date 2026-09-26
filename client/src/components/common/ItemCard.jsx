import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Tag, Sparkles, ArrowRight } from 'lucide-react';

const ItemCard = ({ item, type, matchScore }) => {
  const isLost = type === 'lost' || Boolean(item.dateLost);
  const itemType = isLost ? 'lost' : 'found';
  const itemDate = isLost ? item.dateLost : item.dateFound;

  const formatDate = (dateString) => {
    if (!dateString) return 'Date unknown';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
      case 'Available':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'Claimed':
      case 'Matched':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'Recovered':
      case 'Returned':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      default:
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200 flex flex-col overflow-hidden">
      {/* Top Image Banner */}
      <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
            <Tag className="w-10 h-10 mb-1 opacity-50" />
            <span className="text-xs font-medium">No photo provided</span>
          </div>
        )}

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span
            className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm backdrop-blur-md ${
              isLost
                ? 'bg-rose-500/90 text-white'
                : 'bg-emerald-600/90 text-white'
            }`}
          >
            {isLost ? 'Lost Item' : 'Found Item'}
          </span>
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full border shadow-sm backdrop-blur-md ${getStatusBadge(
              item.status
            )}`}
          >
            {item.status}
          </span>
        </div>

        {/* Match Percentage Pill if available */}
        {matchScore !== undefined && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-600 text-white text-xs font-bold shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
            <span>{matchScore}% Match</span>
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-blue-600 dark:text-cyan-400">
            <Tag className="w-3.5 h-3.5" />
            <span>{item.category}</span>
            {item.subcategory && (
              <>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="text-slate-500 dark:text-slate-400">{item.subcategory}</span>
              </>
            )}
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 mb-2 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
            {item.title}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-4 leading-relaxed">
            {item.description}
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{item.location}{item.city ? `, ${item.city}` : ''}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{formatDate(itemDate)}</span>
            </div>

            <Link
              to={`/items/${itemType}/${item._id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/30 text-[11px] font-mono font-bold tracking-wider uppercase text-cyan-300 hover:border-cyan-400 hover:text-white shadow-sm hover:shadow-[0_0_12px_rgba(6,182,212,0.35)] transition-all group/btn"
            >
              <span>Details</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee] transition-all group-hover/btn:scale-125" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
