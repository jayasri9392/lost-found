import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Mail, 
  ShieldCheck, 
  Calendar, 
  LogOut, 
  Package, 
  Search, 
  Bell, 
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Recent Member';

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 card-shadow">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* Avatar Initial Circle */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-700 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold text-slate-900">{user?.name}</h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-100 text-cyan-800 border border-cyan-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-700" />
                    {user?.role?.toUpperCase() || 'USER'}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Active Session
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>{user?.email}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors shadow-sm cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Security & Credentials Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 card-shadow space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Calendar className="w-4 h-4 text-cyan-500" />
              <span>Membership Date</span>
            </div>
            <p className="text-lg font-bold text-slate-900">{formattedDate}</p>
            <p className="text-xs text-slate-500">Verified member of the ILFN network</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 card-shadow space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Lock className="w-4 h-4 text-blue-500" />
              <span>Authentication Token</span>
            </div>
            <p className="text-lg font-bold text-emerald-600">JWT Signed &amp; Valid</p>
            <p className="text-xs text-slate-500">Encrypted token stored securely</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 card-shadow space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
              <span>Account ID</span>
            </div>
            <p className="text-xs font-mono bg-slate-100 p-2 rounded-lg text-slate-700 truncate" title={user?._id}>
              {user?._id || 'Verified ID'}
            </p>
            <p className="text-xs text-slate-500">Unique identifier in MongoDB Atlas</p>
          </div>
        </div>

        {/* Future Modules Integration Ready Panels */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Lost &amp; Found Activity Center
            </h2>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-200 text-slate-700">
              Phase 2 Preparation
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* My Reported Items Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 card-shadow space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">My Reported Items</h3>
                    <p className="text-xs text-slate-500">Items you have reported lost or found</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                  0 Items
                </span>
              </div>

              <div className="p-5 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 text-center space-y-2">
                <p className="text-xs text-slate-500">
                  You have not submitted any item reports yet.
                </p>
                <p className="text-[11px] text-cyan-700 font-medium">
                  Item Reporting Module unlocks in Phase 2
                </p>
              </div>
            </div>

            {/* Active Claims Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 card-shadow space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                    <Search className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Active Claims &amp; Matches</h3>
                    <p className="text-xs text-slate-500">Ownership claims and AI matches</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                  0 Claims
                </span>
              </div>

              <div className="p-5 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 text-center space-y-2">
                <p className="text-xs text-slate-500">
                  No active claims or potential item matches right now.
                </p>
                <p className="text-[11px] text-blue-700 font-medium">
                  Intelligent Matching Module unlocks in Phase 3
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
