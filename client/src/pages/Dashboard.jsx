import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import dashboardService from '../services/dashboardService';
import claimService from '../services/claimService';
import ItemCard from '../components/common/ItemCard';
import MatchCard from '../components/common/MatchCard';
import ClaimModal from '../components/common/ClaimModal';
import Loader from '../components/common/Loader';
import GalaxyBackground from '../components/backgrounds/GalaxyBackground';
import OrbCard from '../components/effects/OrbCard';
import ILFNButton from '../components/effects/ILFNButton';
import DepthText from '../components/effects/DepthText';
import {
  FileQuestion,
  PlusCircle,
  Sparkles,
  ShieldCheck,
  Bell,
  Clock,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Inbox,
  AlertCircle,
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState(null);
  const [activeTab, setActiveTab] = useState('lost'); // 'lost', 'found', 'matches', 'claims'

  // Selected item for claim modal from matches
  const [selectedFoundItem, setSelectedFoundItem] = useState(null);
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await dashboardService.getSummary();
      if (res.success && res.data) {
        setSummary(res.data);
      } else {
        setError(res.message || 'Unable to fetch dashboard summary');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error occurred while loading dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleClaimStatusChange = async (claimId, status) => {
    try {
      await claimService.updateClaimStatus(claimId, { status });
      setActionSuccessMessage(`Claim has been ${status.toLowerCase()}!`);
      fetchDashboard();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to update claim');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader size="large" text="Aggregating user telemetry and matching calculations..." />
      </div>
    );
  }

  const counts = summary?.counts || {};

  return (
    <div className="relative min-h-screen py-10">
      {/* Galaxy Background Effect for Dashboard Control Center */}
      <GalaxyBackground
        density={1}
        glowIntensity={0.3}
        saturation={0}
        hueShift={140}
        twinkleIntensity={0.3}
        rotationSpeed={0.1}
        repulsionStrength={2}
        autoCenterRepulsion={0}
        starSpeed={0.5}
        speed={1}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        {/* Header Greeting & Quick Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/90 p-6 sm:p-8 rounded-3xl border border-slate-700/80 shadow-2xl backdrop-blur-xl text-white">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Control Center
            </span>
            <div className="flex justify-start mb-1" style={{ minHeight: '60px' }}>
              <DepthText
                text="Dashboard"
                layers={28}
                depth={2.0}
                faceColor="#facc15"
                depthColor="#2563eb"
                tilt={6}
                pointerTracking
                smoothing={0.14}
                perspective={900}
                autoOrbit
                orbitSpeed={0.3}
                fontSize="clamp(2rem, 5vw, 3.2rem)"
                fontWeight={900}
                shadow
              />
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Welcome back, {user?.name}! Monitor your reported items, track pending ownership claims, and check intelligent matches.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ILFNButton
              onClick={() => navigate('/report-lost')}
              variant="rose"
              size="md"
              icon={FileQuestion}
            >
              Report Lost
            </ILFNButton>
            <ILFNButton
              onClick={() => navigate('/report-found')}
              variant="emerald"
              size="md"
              icon={PlusCircle}
            >
              Report Found
            </ILFNButton>
          </div>
        </div>

        {actionSuccessMessage && (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center gap-2 backdrop-blur-md">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionSuccessMessage}</span>
          </div>
        )}

        {/* KPI Metrics Cards with Orb Shader Enhancement */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Metric 1: Lost Items OrbCard */}
          <OrbCard orbHue={350} hoverIntensity={2.2} className="p-5 space-y-2">
            <div className="flex items-center justify-between text-rose-400">
              <span className="text-xs font-bold uppercase tracking-wider">Lost Items</span>
              <FileQuestion className="w-5 h-5 opacity-90" />
            </div>
            <div className="text-2xl font-black text-white">
              {counts.totalLost || 0}
            </div>
            <div className="text-[11px] text-slate-300 flex items-center gap-2">
              <span>{counts.activeLost || 0} active</span>
              <span>•</span>
              <span className="text-emerald-400">{counts.recoveredLost || 0} recovered</span>
            </div>
          </OrbCard>

          {/* Metric 2: Found Items OrbCard */}
          <OrbCard orbHue={140} hoverIntensity={2.2} className="p-5 space-y-2">
            <div className="flex items-center justify-between text-emerald-400">
              <span className="text-xs font-bold uppercase tracking-wider">Found Items</span>
              <PlusCircle className="w-5 h-5 opacity-90" />
            </div>
            <div className="text-2xl font-black text-white">
              {counts.totalFound || 0}
            </div>
            <div className="text-[11px] text-slate-300 flex items-center gap-2">
              <span>{counts.availableFound || 0} available</span>
              <span>•</span>
              <span className="text-cyan-400">{counts.returnedFound || 0} returned</span>
            </div>
          </OrbCard>

          {/* Metric 3: AI Potential Matches OrbCard */}
          <OrbCard orbHue={190} hoverIntensity={2.2} className="p-5 space-y-2">
            <div className="flex items-center justify-between text-cyan-400">
              <span className="text-xs font-bold uppercase tracking-wider">AI Matches</span>
              <Sparkles className="w-5 h-5 opacity-90" />
            </div>
            <div className="text-2xl font-black text-white">
              {counts.potentialMatches || 0}
            </div>
            <div className="text-[11px] text-slate-300">
              Across active lost listings
            </div>
          </OrbCard>

          {/* Metric 4: Pending Claims OrbCard */}
          <OrbCard orbHue={40} hoverIntensity={2.2} className="p-5 space-y-2">
            <div className="flex items-center justify-between text-amber-400">
              <span className="text-xs font-bold uppercase tracking-wider">Pending Claims</span>
              <ShieldCheck className="w-5 h-5 opacity-90" />
            </div>
            <div className="text-2xl font-black text-white">
              {(counts.pendingClaimsSent || 0) + (counts.pendingClaimsReceived || 0)}
            </div>
            <div className="text-[11px] text-slate-300">
              {counts.pendingClaimsReceived || 0} to review
            </div>
          </OrbCard>

          {/* Metric 5: Notifications OrbCard */}
          <OrbCard
            orbHue={270}
            hoverIntensity={2.2}
            className="p-5 space-y-2 col-span-2 lg:col-span-1 cursor-pointer"
            onClick={() => navigate('/notifications')}
          >
            <div className="flex items-center justify-between text-indigo-400">
              <span className="text-xs font-bold uppercase tracking-wider">Alerts</span>
              <Bell className="w-5 h-5 opacity-90" />
            </div>
            <div className="text-2xl font-black text-white flex items-center gap-2">
              <span>{counts.unreadNotifications || 0}</span>
              {counts.unreadNotifications > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white shadow-[0_0_8px_#f43f5e]">
                  New
                </span>
              )}
            </div>
            <div className="text-[11px] text-cyan-400 flex items-center gap-1 font-medium">
              <span>View notifications</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </OrbCard>
        </div>

      {/* Tabs Layout */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
          <button
            onClick={() => setActiveTab('lost')}
            className={`px-6 py-4 text-xs font-bold uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'lost'
                ? 'border-rose-500 text-rose-600 dark:text-rose-400 bg-rose-50/30 dark:bg-rose-950/20'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            My Lost Items ({counts.totalLost || 0})
          </button>

          <button
            onClick={() => setActiveTab('found')}
            className={`px-6 py-4 text-xs font-bold uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'found'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/20'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            My Found Items ({counts.totalFound || 0})
          </button>

          <button
            onClick={() => setActiveTab('matches')}
            className={`px-6 py-4 text-xs font-bold uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'matches'
                ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400 bg-cyan-50/30 dark:bg-cyan-950/20'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            AI Matches ({summary?.topMatches?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab('claims')}
            className={`px-6 py-4 text-xs font-bold uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'claims'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50/30 dark:bg-blue-950/20'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Claims Management ({(counts.claimsSent || 0) + (counts.claimsReceived || 0)})
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-8">
          {/* TAB 1: My Lost Items */}
          {activeTab === 'lost' && (
            <div>
              {summary?.recentLost?.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mx-auto">
                    <FileQuestion className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-white">
                    No lost items reported yet
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    If you have misplaced an item, file a lost report so our community and algorithm can match it.
                  </p>
                  <Link
                    to="/report-lost"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors"
                  >
                    Report Lost Item
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {summary?.recentLost?.map((item) => (
                    <ItemCard key={item._id} item={item} type="lost" />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: My Found Items */}
          {activeTab === 'found' && (
            <div>
              {summary?.recentFound?.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center mx-auto">
                    <PlusCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-white">
                    No found items reported yet
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Picked up something someone left behind? Publish a found item report to help return it safely.
                  </p>
                  <Link
                    to="/report-found"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors"
                  >
                    Report Found Item
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {summary?.recentFound?.map((item) => (
                    <ItemCard key={item._id} item={item} type="found" />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Intelligent Matches */}
          {activeTab === 'matches' && (
            <div className="space-y-4">
              {summary?.topMatches?.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-cyan-100 dark:bg-cyan-950/40 text-cyan-600 flex items-center justify-center mx-auto">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-white">
                    No high-confidence matches at this moment
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Our intelligent network scans new found items constantly. You will be alerted as soon as a potential match is found.
                  </p>
                </div>
              ) : (
                summary?.topMatches?.map((m, idx) => (
                  <MatchCard
                    key={idx}
                    match={m}
                    targetType="found"
                    onClaimClick={(item) => {
                      setSelectedFoundItem(item);
                      setClaimModalOpen(true);
                    }}
                  />
                ))
              )}
            </div>
          )}

          {/* TAB 4: Claims Management */}
          {activeTab === 'claims' && (
            <div className="space-y-8">
              {/* Claims Received to Review */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Claims Awaiting Your Review ({summary?.recentClaimsReceived?.length || 0})
                </h3>

                {summary?.recentClaimsReceived?.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No claims received on your found items yet.</p>
                ) : (
                  <div className="space-y-3">
                    {summary?.recentClaimsReceived?.map((claim) => (
                      <div
                        key={claim._id}
                        className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {claim.claimantUserId?.name || 'A user'}
                            </span>
                            <span className="text-xs text-slate-400">claimed</span>
                            <span className="text-xs font-bold text-blue-600 dark:text-cyan-400">
                              "{claim.foundItemId?.title}"
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300">
                            <strong>Proof provided:</strong> {claim.proofDetails}
                          </p>
                          {claim.contactPhone && (
                            <p className="text-xs text-slate-500">
                              Phone: {claim.contactPhone}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {claim.status === 'Pending' ? (
                            <>
                              <ILFNButton
                                onClick={() => handleClaimStatusChange(claim._id, 'Approved')}
                                variant="emerald"
                                size="sm"
                                icon={CheckCircle2}
                              >
                                Approve
                              </ILFNButton>
                              <ILFNButton
                                onClick={() => handleClaimStatusChange(claim._id, 'Rejected')}
                                variant="danger"
                                size="sm"
                                icon={XCircle}
                              >
                                Reject
                              </ILFNButton>
                            </>
                          ) : (
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                              claim.status === 'Approved'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                                : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                            }`}>
                              {claim.status}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Claims Sent by Me */}
              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Claims You Have Submitted ({summary?.recentClaimsSent?.length || 0})
                </h3>

                {summary?.recentClaimsSent?.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">You have not filed any claims yet.</p>
                ) : (
                  <div className="space-y-3">
                    {summary?.recentClaimsSent?.map((claim) => (
                      <div
                        key={claim._id}
                        className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              Claim for "{claim.foundItemId?.title}"
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            Reason: {claim.reason}
                          </p>
                        </div>

                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          claim.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                            : claim.status === 'Pending'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                        }`}>
                          {claim.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Claim Modal */}
      {selectedFoundItem && (
        <ClaimModal
          isOpen={claimModalOpen}
          onClose={() => setClaimModalOpen(false)}
          foundItem={selectedFoundItem}
          onSuccess={() => {
            setActionSuccessMessage(`Claim submitted for "${selectedFoundItem.title}".`);
            fetchDashboard();
          }}
        />
      )}
      </div>
    </div>
  );
};

export default Dashboard;
