import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import notificationService from '../services/notificationService';
import Loader from '../components/common/Loader';
import AnimatedAuthBackground from '../components/backgrounds/AnimatedAuthBackground';
import OrbCard from '../components/effects/OrbCard';
import ILFNButton from '../components/effects/ILFNButton';
import {
  Bell,
  CheckCircle,
  Clock,
  Trash2,
  CheckCheck,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Inbox,
} from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNotifications = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await notificationService.getNotifications();
      if (res.success) {
        setNotifications(res.data || []);
        setUnreadCount(res.unreadCount || 0);
      } else {
        setError(res.message || 'Unable to retrieve notifications');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error occurred while loading notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.warn('Failed to mark read:', err.message);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to mark all as read');
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to delete notification');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'match':
        return <Sparkles className="w-5 h-5 text-cyan-400" />;
      case 'claim_submitted':
      case 'claim_approved':
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'claim_rejected':
        return <AlertCircle className="w-5 h-5 text-rose-400" />;
      default:
        return <Bell className="w-5 h-5 text-blue-400" />;
    }
  };

  const getHue = (type) => {
    switch (type) {
      case 'match':
        return 190;
      case 'claim_submitted':
      case 'claim_approved':
        return 140;
      case 'claim_rejected':
        return 350;
      default:
        return 220;
    }
  };

  if (loading) {
    return (
      <div style={{ position: 'relative', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AnimatedAuthBackground />
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1,
            pointerEvents: 'none',
            background: 'linear-gradient(135deg, rgba(2,6,23,0.85) 0%, rgba(15,23,42,0.80) 50%, rgba(2,6,23,0.90) 100%)',
          }}
        />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <Loader size="large" text="Fetching notification feed..." />
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', paddingTop: '5rem', paddingBottom: '4rem' }}>
      {/* Register UI background — fixed, behind everything */}
      <AnimatedAuthBackground />

      {/* Dark gradient overlay for contrast and readability */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          background: 'linear-gradient(135deg, rgba(2,6,23,0.85) 0%, rgba(15,23,42,0.80) 50%, rgba(2,6,23,0.90) 100%)',
        }}
      />

      {/* Page Content */}
      <div style={{ position: 'relative', zIndex: 2 }} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header Card (Cards UI) */}
        <OrbCard orbHue={210} hoverIntensity={1.5} showOrb={true} className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl text-cyan-400">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">Notifications</h1>
                <p className="text-xs text-slate-300">
                  {unreadCount > 0 ? `${unreadCount} unread alert${unreadCount > 1 ? 's' : ''}` : 'You are all caught up!'}
                </p>
              </div>
            </div>

            {unreadCount > 0 && (
              <ILFNButton
                onClick={handleMarkAllAsRead}
                variant="secondary"
                size="sm"
                icon={CheckCheck}
              >
                Mark all as read
              </ILFNButton>
            )}
          </div>
        </OrbCard>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {notifications.length === 0 ? (
          <OrbCard orbHue={210} showOrb={true} className="py-16 text-center space-y-3">
            <Inbox className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-white">No notifications</h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              You will receive alerts here whenever potential matches are computed or claims are updated.
            </p>
          </OrbCard>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <OrbCard
                key={n._id}
                orbHue={getHue(n.type)}
                hoverIntensity={1.8}
                showOrb={!n.isRead}
                className={`p-5 transition-all ${
                  !n.isRead
                    ? 'border-cyan-500/40 bg-slate-900/90 shadow-cyan-500/5'
                    : 'border-slate-800/80 bg-slate-950/70 opacity-90 hover:opacity-100'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-2.5 rounded-xl shrink-0 ${
                        n.type === 'match'
                          ? 'bg-cyan-950/60 border border-cyan-800/60'
                          : n.type?.startsWith('claim_')
                          ? 'bg-emerald-950/60 border border-emerald-800/60'
                          : 'bg-blue-950/60 border border-blue-800/60'
                      }`}
                    >
                      {getIcon(n.type)}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">
                          {n.title}
                        </h4>
                        {!n.isRead && (
                          <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {n.message}
                      </p>
                      <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                        </span>

                        {n.relatedItemId && (
                          <Link
                            to={
                              n.relatedItemType === 'LostItem'
                                ? `/items/lost/${n.relatedItemId}`
                                : `/items/found/${n.relatedItemId}`
                            }
                            className="text-cyan-400 font-semibold hover:text-cyan-300 hover:underline flex items-center gap-1"
                          >
                            <span>View Related Item</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {!n.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(n._id)}
                        className="p-2 text-slate-400 hover:text-cyan-400 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Mark as read"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(n._id)}
                      className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </OrbCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
