import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import claimService from '../services/claimService';
import Loader from '../components/common/Loader';
import ILFNButton from '../components/effects/ILFNButton';
import ScannerBackground from '../components/backgrounds/ScannerBackground';
import { ShieldCheck, CheckCircle2, XCircle, Ban, Clock, ExternalLink } from 'lucide-react';

const Claims = () => {
  const [tab, setTab] = useState('received'); // 'received', 'sent'
  const [receivedClaims, setReceivedClaims] = useState([]);
  const [sentClaims, setSentClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchAllClaims = async () => {
    setLoading(true);
    setError('');
    try {
      const [resRec, resSent] = await Promise.all([
        claimService.getReceivedClaims(),
        claimService.getMyClaims(),
      ]);

      if (resRec.success) setReceivedClaims(resRec.data || []);
      if (resSent.success) setSentClaims(resSent.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error occurred while loading claims');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllClaims();
  }, []);

  const handleUpdateStatus = async (claimId, status) => {
    try {
      await claimService.updateClaimStatus(claimId, { status });
      setActionSuccess(`Claim ${status.toLowerCase()} successfully!`);
      fetchAllClaims();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to update claim');
    }
  };

  const handleCancelClaim = async (claimId) => {
    if (!window.confirm('Cancel this claim?')) return;
    try {
      await claimService.cancelClaim(claimId);
      setActionSuccess('Claim cancelled.');
      fetchAllClaims();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to cancel claim');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader size="large" text="Retrieving claims verification logs..." />
      </div>
    );
  }

  const activeClaims = tab === 'received' ? receivedClaims : sentClaims;

  return (
    <div className="relative min-h-screen" style={{ background: '#030712' }}>
      <ScannerBackground />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8" style={{ zIndex: 2 }}>
      {/* Header */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            Verification Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black">Ownership Claims</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Review ownership claims filed by users or monitor the status of your claims.
          </p>
        </div>

        <div className="flex bg-slate-800 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setTab('received')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              tab === 'received'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Received Claims ({receivedClaims.length})
          </button>
          <button
            onClick={() => setTab('sent')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              tab === 'sent'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            My Submitted Claims ({sentClaims.length})
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Claims List */}
      {activeClaims.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-3">
          <ShieldCheck className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">
            {tab === 'received' ? 'No claims received yet' : 'No claims submitted yet'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {tab === 'received'
              ? 'When another user believes your reported found item belongs to them, their claim will appear here.'
              : 'When you find a matching item on ILFN, submit a claim with proof of ownership.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeClaims.map((claim) => (
            <div
              key={claim._id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    claim.status === 'Approved'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                      : claim.status === 'Pending'
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                      : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                  }`}>
                    {claim.status}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(claim.createdAt).toLocaleDateString()}</span>
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {claim.foundItemId?.title || 'Found Item'}
                  </h3>
                  {claim.foundItemId && (
                    <Link
                      to={`/items/found/${claim.foundItemId._id || claim.foundItemId}`}
                      className="text-xs text-blue-600 dark:text-cyan-400 hover:underline inline-flex items-center gap-1"
                    >
                      <span>View Item</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300">
                  <strong className="font-semibold text-slate-900 dark:text-white">Claim Reason:</strong> {claim.reason}
                </p>

                <p className="text-xs text-slate-600 dark:text-slate-300">
                  <strong className="font-semibold text-slate-900 dark:text-white">Proof Details:</strong> {claim.proofDetails}
                </p>

                {claim.contactPhone && (
                  <p className="text-xs text-slate-500">
                    <strong>Phone Contact:</strong> {claim.contactPhone}
                  </p>
                )}

                {claim.proofImage && (
                  <div className="pt-1">
                    <a
                      href={claim.proofImage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 dark:text-cyan-400 hover:underline font-semibold"
                    >
                      View Attached Proof Photo
                    </a>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-700">
                {tab === 'received' && claim.status === 'Pending' && (
                  <>
                    <ILFNButton
                      onClick={() => handleUpdateStatus(claim._id, 'Approved')}
                      variant="emerald"
                      size="sm"
                      icon={CheckCircle2}
                    >
                      Approve Claim
                    </ILFNButton>
                    <ILFNButton
                      onClick={() => handleUpdateStatus(claim._id, 'Rejected')}
                      variant="danger"
                      size="sm"
                      icon={XCircle}
                    >
                      Reject Claim
                    </ILFNButton>
                  </>
                )}

                {tab === 'sent' && claim.status === 'Pending' && (
                  <ILFNButton
                    onClick={() => handleCancelClaim(claim._id)}
                    variant="secondary"
                    size="sm"
                    icon={Ban}
                  >
                    Cancel Claim
                  </ILFNButton>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

export default Claims;
