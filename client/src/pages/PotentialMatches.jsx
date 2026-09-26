import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import matchingService from '../services/matchingService';
import MatchCard from '../components/common/MatchCard';
import ClaimModal from '../components/common/ClaimModal';
import Loader from '../components/common/Loader';
import ScannerBackground from '../components/backgrounds/ScannerBackground';
import { Sparkles, ArrowLeft, Info, HelpCircle } from 'lucide-react';

const PotentialMatches = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const isLost = type === 'lost';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [referenceItem, setReferenceItem] = useState(null);
  const [matches, setMatches] = useState([]);

  // Claim modal state
  const [selectedFoundItem, setSelectedFoundItem] = useState(null);
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [claimSuccessMessage, setClaimSuccessMessage] = useState('');

  const fetchMatches = async () => {
    setLoading(true);
    setError('');
    try {
      const res = isLost
        ? await matchingService.getMatchesForLostItem(id)
        : await matchingService.getMatchesForFoundItem(id);

      if (res.success) {
        setReferenceItem(isLost ? res.lostItem : res.foundItem);
        setMatches(res.data || []);
      } else {
        setError(res.message || 'Unable to retrieve matches');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error occurred while running matching algorithm');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [id, type]);

  const handleClaimItem = (foundItem) => {
    setSelectedFoundItem(foundItem);
    setClaimModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader size="large" text="Analyzing cross-network listings and calculating similarity scores..." />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen" style={{ background: '#030712' }}>
      <ScannerBackground />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8" style={{ zIndex: 2 }}>
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Item</span>
        </button>

        <Link
          to={`/items/${type}/${id}`}
          className="text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline"
        >
          View Full Item Listing
        </Link>
      </div>

      {claimSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-sm">
          {claimSuccessMessage}
        </div>
      )}

      {/* Reference Item Summary Card */}
      {referenceItem && (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center shrink-0 text-cyan-300">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Target {isLost ? 'Lost Item' : 'Found Item'}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-300">{referenceItem.category}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black">{referenceItem.title}</h1>
              <p className="text-xs text-slate-300 mt-0.5">{referenceItem.location}</p>
            </div>
          </div>

          <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center shrink-0">
            <span className="text-2xl font-black text-cyan-300">{matches.length}</span>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
              Potential Matches
            </span>
          </div>
        </div>
      )}

      {/* Transparent Algorithm Note */}
      <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/50 flex items-start gap-3 text-xs text-blue-900 dark:text-blue-300">
        <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="font-semibold">How matching works:</strong> Our intelligent matching
          engine evaluates multi-dimensional similarity factors including category taxonomy (30%),
          location proximity (25%), title/description keyword tokens (25%), date proximity (10%),
          and distinguishing marks (10%). Matches are estimated recommendations, not guarantees.
        </p>
      </div>

      {/* Matches List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Ranked Candidates</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold">
              Sorted by similarity
            </span>
          </h2>
        </div>

        {matches.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400 flex items-center justify-center mx-auto">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white">
              No matching listings found yet
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              We did not find any active items meeting the minimum similarity threshold. As new
              listings are posted, you will receive an automatic notification if a match is discovered.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((m) => (
              <MatchCard
                key={isLost ? m.foundItem?._id : m.lostItem?._id}
                match={m}
                targetType={isLost ? 'found' : 'lost'}
                onClaimClick={handleClaimItem}
              />
            ))}
          </div>
        )}
      </div>

      {/* Claim Modal for when user clicks Claim on a matched found item */}
      {selectedFoundItem && (
        <ClaimModal
          isOpen={claimModalOpen}
          onClose={() => setClaimModalOpen(false)}
          foundItem={selectedFoundItem}
          onSuccess={() => {
            setClaimSuccessMessage(
              `Claim submitted for "${selectedFoundItem.title}". The finder has been notified.`
            );
            fetchMatches();
          }}
        />
      )}
      </div>
    </div>
  );
};

export default PotentialMatches;
