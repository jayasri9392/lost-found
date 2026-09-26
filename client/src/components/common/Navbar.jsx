import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import notificationService from '../../services/notificationService';
import ILFNButton from '../effects/ILFNButton';
import SpecularButton from '../effects/SpecularButton';
import {
  Compass, 
  User, 
  LogOut, 
  Menu, 
  X,
  Search,
  PlusCircle,
  FileQuestion,
  LayoutDashboard,
  Bell,
  ShieldAlert,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch unread notifications count when authenticated or location changes
  useEffect(() => {
    let isMounted = true;

    const fetchNotifications = async () => {
      if (isAuthenticated) {
        try {
          const res = await notificationService.getNotifications();
          if (isMounted && res.success) {
            setUnreadCount(res.unreadCount || 0);
          }
        } catch {
          // Silent catch for background notification poll
        }
      } else {
        if (isMounted) setUnreadCount(0);
      }
    };

    fetchNotifications();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, location.pathname]);

  const handleLogout = () => {
    navigate('/logout');
    setMobileMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 flex items-center gap-1.5 ${
      isActive
        ? 'text-cyan-400 bg-slate-800/90 shadow-sm'
        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo as the Signature Button UI with Compass Symbol */}
          <div className="flex items-center gap-3 shrink-0">
            <ILFNButton
              variant="cyan"
              size="sm"
              icon={Compass}
              onClick={() => {
                navigate('/');
                setMobileMenuOpen(false);
              }}
              ariaLabel="ILFN Home"
              className="shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:shadow-[0_0_28px_rgba(6,182,212,0.6)]"
            >
              ILFN
            </ILFNButton>
            <div className="hidden lg:flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400">
                Network
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                Intelligent Lost &amp; Found
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links (SpecularButton UI) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
            <SpecularButton
              size="sm"
              radius={18}
              tint="#ffffff"
              tintOpacity={0}
              blur={0}
              textColor="#cbd5e1"
              lineColor="#ffffff"
              baseColor="#525252"
              intensity={1}
              shineSize={10}
              shineFade={40}
              thickness={1}
              speed={0.35}
              followMouse
              proximity={250}
              autoAnimate={false}
              onClick={() => navigate('/')}
              className="nav-specular"
            >
              Home
            </SpecularButton>

            <SpecularButton
              size="sm"
              radius={18}
              tint="#ffffff"
              tintOpacity={0}
              blur={0}
              textColor="#cbd5e1"
              lineColor="#ffffff"
              baseColor="#525252"
              intensity={1}
              shineSize={10}
              shineFade={40}
              thickness={1}
              speed={0.35}
              followMouse
              proximity={250}
              autoAnimate={false}
              onClick={() => navigate('/search')}
              className="nav-specular"
            >
              Search
            </SpecularButton>

            {isAuthenticated ? (
              <>
                <SpecularButton
                  size="sm"
                  radius={18}
                  tint="#ffffff"
                  tintOpacity={0}
                  blur={0}
                  textColor="#fca5a5"
                  lineColor="#f87171"
                  baseColor="#525252"
                  intensity={1}
                  shineSize={10}
                  shineFade={40}
                  thickness={1}
                  speed={0.35}
                  followMouse
                  proximity={250}
                  autoAnimate={false}
                  onClick={() => navigate('/report-lost')}
                  className="nav-specular"
                >
                  Report Lost
                </SpecularButton>

                <SpecularButton
                  size="sm"
                  radius={18}
                  tint="#ffffff"
                  tintOpacity={0}
                  blur={0}
                  textColor="#6ee7b7"
                  lineColor="#34d399"
                  baseColor="#525252"
                  intensity={1}
                  shineSize={10}
                  shineFade={40}
                  thickness={1}
                  speed={0.35}
                  followMouse
                  proximity={250}
                  autoAnimate={false}
                  onClick={() => navigate('/report-found')}
                  className="nav-specular"
                >
                  Report Found
                </SpecularButton>

                <SpecularButton
                  size="sm"
                  radius={18}
                  tint="#ffffff"
                  tintOpacity={0}
                  blur={0}
                  textColor="#93c5fd"
                  lineColor="#60a5fa"
                  baseColor="#525252"
                  intensity={1}
                  shineSize={10}
                  shineFade={40}
                  thickness={1}
                  speed={0.35}
                  followMouse
                  proximity={250}
                  autoAnimate={false}
                  onClick={() => navigate('/dashboard')}
                  className="nav-specular"
                >
                  Dashboard
                </SpecularButton>

                {/* Notifications Bell */}
                <NavLink
                  to="/notifications"
                  className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </NavLink>

                {/* Admin Link if admin */}
                {user?.role === 'admin' && (
                  <SpecularButton
                    size="sm"
                    radius={18}
                    tint="#ffffff"
                    tintOpacity={0}
                    blur={0}
                    textColor="#fcd34d"
                    lineColor="#f59e0b"
                    baseColor="#525252"
                    intensity={1}
                    shineSize={10}
                    shineFade={40}
                    thickness={1}
                    speed={0.35}
                    followMouse
                    proximity={250}
                    autoAnimate={false}
                    onClick={() => navigate('/admin')}
                    className="nav-specular"
                  >
                    Admin
                  </SpecularButton>
                )}

                <div className="h-5 w-px bg-slate-800 mx-1" />

                <SpecularButton
                  size="sm"
                  radius={18}
                  tint="#ffffff"
                  tintOpacity={0}
                  blur={0}
                  textColor="#67e8f9"
                  lineColor="#22d3ee"
                  baseColor="#525252"
                  intensity={1}
                  shineSize={10}
                  shineFade={40}
                  thickness={1}
                  speed={0.35}
                  followMouse
                  proximity={250}
                  autoAnimate={false}
                  onClick={() => navigate('/profile')}
                  className="nav-specular"
                >
                  {user?.name?.split(' ')[0] || 'Profile'}
                </SpecularButton>

                <SpecularButton
                  size="sm"
                  radius={18}
                  tint="#ffffff"
                  tintOpacity={0}
                  blur={0}
                  textColor="#fca5a5"
                  lineColor="#f87171"
                  baseColor="#525252"
                  intensity={1}
                  shineSize={10}
                  shineFade={40}
                  thickness={1}
                  speed={0.35}
                  followMouse
                  proximity={250}
                  autoAnimate={false}
                  onClick={handleLogout}
                  className="nav-specular"
                >
                  Logout
                </SpecularButton>
              </>
            ) : (
              <div className="flex items-center gap-2.5 ml-2">
                <SpecularButton
                  size="sm"
                  radius={18}
                  tint="#ffffff"
                  tintOpacity={0}
                  blur={0}
                  textColor="#cbd5e1"
                  lineColor="#94a3b8"
                  baseColor="#525252"
                  intensity={1}
                  shineSize={10}
                  shineFade={40}
                  thickness={1}
                  speed={0.35}
                  followMouse
                  proximity={250}
                  autoAnimate={false}
                  onClick={() => navigate('/login')}
                  className="nav-specular"
                >
                  Log In
                </SpecularButton>
                <SpecularButton
                  size="sm"
                  radius={18}
                  tint="#ffffff"
                  tintOpacity={0}
                  blur={0}
                  textColor="#67e8f9"
                  lineColor="#22d3ee"
                  baseColor="#525252"
                  intensity={1}
                  shineSize={10}
                  shineFade={40}
                  thickness={1}
                  speed={0.35}
                  followMouse
                  proximity={250}
                  autoAnimate={false}
                  onClick={() => navigate('/register')}
                  className="nav-specular"
                >
                  Register
                </SpecularButton>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            {isAuthenticated && unreadCount > 0 && (
              <Link to="/notifications" className="relative p-2 text-slate-300">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500" />
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 pt-3 pb-4 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Home
          </Link>

          <Link
            to="/search"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            <Search className="w-4 h-4 text-cyan-400" />
            <span>Search Database</span>
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/report-lost"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-rose-400 hover:bg-slate-800"
              >
                <FileQuestion className="w-4 h-4" />
                <span>Report Lost Item</span>
              </Link>

              <Link
                to="/report-found"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-emerald-400 hover:bg-slate-800"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Report Found Item</span>
              </Link>

              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-blue-400 hover:bg-slate-800"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/notifications"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
              >
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-400" />
                  <span>Notifications</span>
                </div>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-rose-500 text-white font-bold">
                    {unreadCount}
                  </span>
                )}
              </Link>

              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-bold text-amber-400 bg-amber-950/20 border border-amber-900/50"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                </Link>
              )}

              <div className="pt-2 border-t border-slate-800 space-y-2">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-cyan-400 hover:bg-slate-800"
                >
                  <User className="w-4 h-4" />
                  <span>Profile ({user?.name})</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-rose-400 hover:bg-slate-800 text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2.5 rounded-lg text-sm font-medium text-slate-200 bg-slate-800 hover:bg-slate-700"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-500"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
