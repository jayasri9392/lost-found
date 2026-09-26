import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import Loader from '../components/common/Loader';
import OrbCard from '../components/effects/OrbCard';
import ILFNButton from '../components/effects/ILFNButton';
import DepthText from '../components/effects/DepthText';
import ScannerBackground from '../components/backgrounds/ScannerBackground';
import {
  Users,
  FileQuestion,
  PlusCircle,
  ShieldCheck,
  Flag,
  TrendingUp,
  Trash2,
  Shield,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'users', 'lost', 'found', 'claims', 'reports'
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [lostList, setLostList] = useState([]);
  const [foundList, setFoundList] = useState([]);
  const [claimsList, setClaimsList] = useState([]);
  const [reportsList, setReportsList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchStats = async () => {
    try {
      const res = await adminService.getStats();
      if (res.success) setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTabData = async (tab) => {
    setError('');
    try {
      if (tab === 'users') {
        const res = await adminService.getUsers();
        if (res.success) setUsersList(res.data);
      } else if (tab === 'lost') {
        const res = await adminService.getLostItems();
        if (res.success) setLostList(res.data);
      } else if (tab === 'found') {
        const res = await adminService.getFoundItems();
        if (res.success) setFoundList(res.data);
      } else if (tab === 'claims') {
        const res = await adminService.getClaims();
        if (res.success) setClaimsList(res.data);
      } else if (tab === 'reports') {
        const res = await adminService.getReports();
        if (res.success) setReportsList(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch data');
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchStats();
      await fetchTabData('overview');
      setLoading(false);
    };
    init();
  }, []);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    fetchTabData(newTab);
  };

  // User Actions
  const handleToggleRole = async (userId, currentRole) => {
    const nextRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Change this user's role to ${nextRole}?`)) return;

    try {
      await adminService.updateUserRole(userId, nextRole);
      setSuccessMessage(`User role changed to ${nextRole}`);
      fetchTabData('users');
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Role update failed');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user and all associated reports?')) return;
    try {
      await adminService.deleteUser(userId);
      setSuccessMessage('User deleted successfully.');
      fetchTabData('users');
      fetchStats();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Deletion failed');
    }
  };

  // Item Delete
  const handleDeleteItem = async (itemId, isLost) => {
    if (!window.confirm('Permanently remove this listing from ILFN?')) return;
    try {
      if (isLost) {
        await adminService.deleteLostItem(itemId);
        fetchTabData('lost');
      } else {
        await adminService.deleteFoundItem(itemId);
        fetchTabData('found');
      }
      setSuccessMessage('Item removed from platform');
      fetchStats();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Deletion failed');
    }
  };

  // Report Resolution
  const handleUpdateReport = async (reportId, status) => {
    try {
      await adminService.updateReport(reportId, { status });
      setSuccessMessage(`Report status set to ${status}`);
      fetchTabData('reports');
      fetchStats();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Report update failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader size="large" text="Opening administrative console..." />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen" style={{ background: '#030712' }}>
      {/* Scanner WebGL Background */}
      <ScannerBackground />

      {/* Page Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8" style={{ zIndex: 2 }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
            <Shield className="w-4 h-4" />
            <span>Master Administration Console</span>
          </div>
          <div style={{ minHeight: '65px' }}>
            <DepthText
              text="Admin Control"
              layers={28}
              depth={2.0}
              faceColor="#facc15"
              depthColor="#b45309"
              tilt={6}
              pointerTracking
              smoothing={0.14}
              perspective={900}
              autoOrbit
              orbitSpeed={0.3}
              fontSize="clamp(1.8rem, 5vw, 3rem)"
              fontWeight={900}
              shadow
            />
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Monitor real-time network health, oversee user privileges, moderate listings, and review disputes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
            Live Database
          </span>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* KPI Cards enhanced with Orb shaders */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          <OrbCard orbHue={210} hoverIntensity={1.8} className="p-4 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Users</span>
            <div className="text-2xl font-black text-white">{stats.users?.total || 0}</div>
          </OrbCard>

          <OrbCard orbHue={350} hoverIntensity={1.8} className="p-4 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">Lost Items</span>
            <div className="text-2xl font-black text-white">{stats.items?.totalLost || 0}</div>
            <span className="text-[10px] text-slate-400">{stats.items?.activeLost || 0} active</span>
          </OrbCard>

          <OrbCard orbHue={140} hoverIntensity={1.8} className="p-4 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Found Items</span>
            <div className="text-2xl font-black text-white">{stats.items?.totalFound || 0}</div>
            <span className="text-[10px] text-slate-400">{stats.items?.availableFound || 0} available</span>
          </OrbCard>

          <OrbCard orbHue={190} hoverIntensity={1.8} className="p-4 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">Recovery Rate</span>
            <div className="text-2xl font-black text-cyan-300">{stats.items?.recoveryRate || 0}%</div>
            <span className="text-[10px] text-slate-400">Resolved items</span>
          </OrbCard>

          <OrbCard orbHue={40} hoverIntensity={1.8} className="p-4 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Claims</span>
            <div className="text-2xl font-black text-white">{stats.claims?.total || 0}</div>
            <span className="text-[10px] text-amber-400 font-semibold">{stats.claims?.pending || 0} pending</span>
          </OrbCard>

          <OrbCard orbHue={330} hoverIntensity={1.8} className="p-4 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">Flagged Reports</span>
            <div className="text-2xl font-black text-white">{stats.reports?.total || 0}</div>
            <span className="text-[10px] text-rose-400 font-semibold">{stats.reports?.pending || 0} pending</span>
          </OrbCard>
        </div>
      )}

      {/* Tabs Menu */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'users', label: `Users (${stats?.users?.total || 0})` },
            { id: 'lost', label: `Lost Items (${stats?.items?.totalLost || 0})` },
            { id: 'found', label: `Found Items (${stats?.items?.totalFound || 0})` },
            { id: 'claims', label: `Claims (${stats?.claims?.total || 0})` },
            { id: 'reports', label: `Flagged Reports (${stats?.reports?.total || 0})` },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id)}
              className={`px-5 py-4 text-xs font-bold uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors ${
                activeTab === t.id
                  ? 'border-blue-600 text-blue-600 dark:text-cyan-400 bg-blue-50/20 dark:bg-blue-950/20'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content Panes */}
        <div className="p-6 sm:p-8">
          {/* TAB 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent System Activity</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recent Lost */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-500">
                    Latest Lost Reports
                  </h4>
                  <div className="space-y-2">
                    {stats?.recentActivity?.lostItems?.map((item) => (
                      <div key={item._id} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-200 dark:border-slate-800 last:border-none">
                        <div>
                          <span className="font-semibold text-slate-900 dark:text-white block">{item.title}</span>
                          <span className="text-slate-400">{item.category} • {item.userId?.name}</span>
                        </div>
                        <Link to={`/items/lost/${item._id}`} className="text-blue-500 hover:underline">
                          View
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Found */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-500">
                    Latest Found Reports
                  </h4>
                  <div className="space-y-2">
                    {stats?.recentActivity?.foundItems?.map((item) => (
                      <div key={item._id} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-200 dark:border-slate-800 last:border-none">
                        <div>
                          <span className="font-semibold text-slate-900 dark:text-white block">{item.title}</span>
                          <span className="text-slate-400">{item.category} • {item.userId?.name}</span>
                        </div>
                        <Link to={`/items/found/${item._id}`} className="text-blue-500 hover:underline">
                          View
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Users Management */}
          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="pb-3 px-3">Name</th>
                    <th className="pb-3 px-3">Email</th>
                    <th className="pb-3 px-3">Role</th>
                    <th className="pb-3 px-3">Joined</th>
                    <th className="pb-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                  {usersList.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                      <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">{u.name}</td>
                      <td className="py-3 px-3 text-slate-500">{u.email}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                          u.role === 'admin'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-3 text-right space-x-2">
                        <button
                          onClick={() => handleToggleRole(u._id, u.role)}
                          className="text-[11px] font-semibold text-blue-600 hover:underline"
                        >
                          {u.role === 'admin' ? 'Demote' : 'Promote to Admin'}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="text-rose-500 hover:text-rose-700 p-1"
                          title="Delete User"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: Lost Items Moderation */}
          {activeTab === 'lost' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="pb-3 px-3">Title</th>
                    <th className="pb-3 px-3">Category</th>
                    <th className="pb-3 px-3">Location</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3">Reporter</th>
                    <th className="pb-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                  {lostList.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                      <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                        <Link to={`/items/lost/${item._id}`} className="hover:text-blue-600">
                          {item.title}
                        </Link>
                      </td>
                      <td className="py-3 px-3 text-slate-500">{item.category}</td>
                      <td className="py-3 px-3 text-slate-500 truncate max-w-[150px]">{item.location}</td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{item.status}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-500">{item.userId?.name || 'User'}</td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleDeleteItem(item._id, true)}
                          className="text-rose-500 hover:text-rose-700 p-1"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 4: Found Items Moderation */}
          {activeTab === 'found' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="pb-3 px-3">Title</th>
                    <th className="pb-3 px-3">Category</th>
                    <th className="pb-3 px-3">Location</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3">Finder</th>
                    <th className="pb-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                  {foundList.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                      <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                        <Link to={`/items/found/${item._id}`} className="hover:text-emerald-600">
                          {item.title}
                        </Link>
                      </td>
                      <td className="py-3 px-3 text-slate-500">{item.category}</td>
                      <td className="py-3 px-3 text-slate-500 truncate max-w-[150px]">{item.location}</td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{item.status}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-500">{item.userId?.name || 'User'}</td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleDeleteItem(item._id, false)}
                          className="text-rose-500 hover:text-rose-700 p-1"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 5: Claims Oversight */}
          {activeTab === 'claims' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="pb-3 px-3">Claimed Item</th>
                    <th className="pb-3 px-3">Claimant</th>
                    <th className="pb-3 px-3">Finder</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                  {claimsList.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                      <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                        {c.foundItemId?.title || 'Found Item'}
                      </td>
                      <td className="py-3 px-3 text-slate-500">{c.claimantUserId?.name} ({c.claimantUserId?.email})</td>
                      <td className="py-3 px-3 text-slate-500">{c.reporterUserId?.name}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                          c.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                            : c.status === 'Pending'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 6: Flagged Reports */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              {reportsList.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No flagged content reports in queue.</p>
              ) : (
                reportsList.map((rep) => (
                  <div key={rep._id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">{rep.reason}</span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500">Reported by {rep.reporterId?.name}</span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300">
                        {rep.description}
                      </p>
                      <div className="text-[11px] text-slate-400">
                        Target Item: {rep.reportedItemType} ({rep.reportedItemId})
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateReport(rep._id, 'Resolved')}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-500"
                      >
                        Resolve
                      </button>
                      <button
                        onClick={() => handleUpdateReport(rep._id, 'Rejected')}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
      {/* End Scanner content wrapper */}
    </div>
    </div>
  );
};

export default AdminDashboard;
