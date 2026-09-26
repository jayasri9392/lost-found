import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import FerrofluidBackground from '../components/backgrounds/FerrofluidBackground';
import authService from '../services/authService';
import { 
  Mail, 
  ShieldCheck, 
  Calendar, 
  LogOut, 
  User, 
  Phone, 
  FileText, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowRight,
  LayoutDashboard,
  Shield
} from 'lucide-react';
import MoltenMetal from '../components/effects/MoltenMetal';
import DepthText from '../components/effects/DepthText';
import OrbCard from '../components/effects/OrbCard';
import ILFNButton from '../components/effects/ILFNButton';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const payload = { name, phone, bio };
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const res = await authService.updateProfile(payload);
      if (res.success) {
        setMessage('Profile updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
      } else {
        setError(res.message || 'Update failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error occurred while updating profile');
    } finally {
      setSaving(false);
    }
  };

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Recent Member';

  return (
    <div style={{ position: 'relative', minHeight: '100vh', paddingTop: '4rem' }}>
      {/* Ferrofluid full-page fixed background */}
      <FerrofluidBackground />

      {/* Dark tint overlay for content readability */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          background: 'rgba(4, 8, 20, 0.70)',
        }}
      />

      {/* Page content above background */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div className="pt-4 pb-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Profile Header Card with MoltenMetal + DepthText */}
        <div className="relative overflow-hidden bg-slate-900 rounded-3xl border border-slate-700 p-6 sm:p-8 shadow-2xl">
          {/* MoltenMetal background inside card */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden', borderRadius: 'inherit' }}>
            <MoltenMetal
              color1="#5227FF"
              color2="#FF9FFC"
              color3="#FFFFFF"
              speed={0.3}
              scale={5}
              detail={3}
              glow={1.4}
              coreSize={0.08}
              swirl={0.8}
              fold={-0.15}
              blackPoint={0.06}
              brightness={1.1}
              colorMode="molten"
              grain
              grainIntensity={0.04}
              mouseInteraction={false}
              opacity={0.85}
            />
          </div>
          {/* Dark overlay for contrast */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(5,10,25,0.7)', zIndex: 1, pointerEvents: 'none', borderRadius: 'inherit' }} />

          <div className="relative" style={{ zIndex: 2 }}>
            {/* DepthText heading */}
            <div style={{ minHeight: '65px' }} className="mb-4">
              <DepthText
                text="My Profile"
                layers={28}
                depth={2.0}
                faceColor="#facc15"
                depthColor="#7c3aed"
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

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-700 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800">
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                      {user?.role?.toUpperCase() || 'USER'}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-950 text-emerald-400 border border-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Active Session
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span>{user?.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-600 text-sm font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Go to Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-600 text-sm font-semibold text-slate-200 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Credentials Overview (OrbCard UI) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <OrbCard orbHue={190} hoverIntensity={2.0} className="p-6 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Membership Date</span>
            </div>
            <p className="text-xl font-bold text-white">{formattedDate}</p>
            <p className="text-xs text-slate-400">Verified member of the ILFN network</p>
          </OrbCard>

          <OrbCard orbHue={140} hoverIntensity={2.0} className="p-6 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Authentication Token</span>
            </div>
            <p className="text-xl font-bold text-emerald-400">JWT Signed &amp; Valid</p>
            <p className="text-xs text-slate-400">Encrypted token stored securely</p>
          </OrbCard>

          <OrbCard orbHue={270} hoverIntensity={2.0} className="p-6 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Account ID</span>
            </div>
            <p className="text-xs font-mono bg-slate-950/80 border border-slate-700/80 p-2.5 rounded-xl text-cyan-300 truncate" title={user?._id}>
              {user?._id || 'Verified ID'}
            </p>
            <p className="text-xs text-slate-400">Unique identifier in MongoDB Atlas</p>
          </OrbCard>
        </div>

        {/* Edit Profile Form (OrbCard UI) */}
        <OrbCard orbHue={200} hoverIntensity={1.5} className="p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-700/60 pb-4">
            <h2 className="text-xl font-bold text-white">Profile Details &amp; Settings</h2>
            <p className="text-xs text-slate-400 mt-1">Update your name, contact phone, or update security credentials</p>
          </div>

          {message && (
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-700 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-700 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-600 bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-600 bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Bio / Status Note
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="e.g. Student at Campus, reachable during work hours..."
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-600 bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>

            {/* Optional Password Update */}
            <div className="pt-4 border-t border-slate-700/60 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Change Password (Optional)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-600 bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-600 bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <ILFNButton
                type="submit"
                variant="cyan"
                size="md"
                loading={saving}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Profile Changes'}
              </ILFNButton>
            </div>
          </form>
        </OrbCard>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
