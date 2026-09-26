import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/common/Alert';
import ILFNButton from '../components/effects/ILFNButton';
import AnimatedAuthBackground from '../components/backgrounds/AnimatedAuthBackground';
import DepthText from '../components/effects/DepthText';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';

const Register = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate form client-side
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errors.email = 'Please enter a valid email address';
      }
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirmation password is required';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) {
      setServerError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const result = await register(
        formData.name.trim(),
        formData.email.trim(),
        formData.password,
        formData.confirmPassword
      );

      if (result.success) {
        navigate('/profile', { replace: true });
      } else {
        setServerError(result.message || 'Registration failed. Please check your information.');
      }
    } catch (err) {
      setServerError('An unexpected error occurred. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordsMatch =
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword;

  const inputBase = {
    display: 'block',
    width: '100%',
    paddingTop: '0.625rem',
    paddingBottom: '0.625rem',
    paddingRight: '0.75rem',
    fontSize: '0.875rem',
    borderRadius: '0.75rem',
    background: 'rgba(30, 41, 59, 0.7)',
    color: '#f1f5f9',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  };

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '5rem 1rem 3rem',
      }}
    >
      {/* Animated background — fixed, behind everything */}
      <AnimatedAuthBackground />

      {/* Dark gradient overlay for readability */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          background: 'linear-gradient(135deg, rgba(2,6,23,0.82) 0%, rgba(15,23,42,0.75) 50%, rgba(2,6,23,0.88) 100%)',
        }}
      />

      {/* Page content */}
      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '28rem' }}>
        {/* DepthText heading */}
        <div style={{ minHeight: '80px', marginBottom: '1rem', textAlign: 'center' }}>
          <DepthText
            text="Create Your Account"
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
            fontSize="clamp(1.5rem, 4.5vw, 2.4rem)"
            fontWeight={900}
            shadow
          />
        </div>

        {/* Subtitle */}
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>
            Intelligent Lost &amp; Found Network
          </p>
          <p style={{ fontSize: '0.75rem', color: '#67e8f9', fontWeight: 500, fontStyle: 'italic', marginTop: '0.25rem' }}>
            &ldquo;Find what was lost. Return what was found.&rdquo;
          </p>
        </div>

        {/* Glassmorphic card */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.72)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(148, 163, 184, 0.18)',
            borderRadius: '1.5rem',
            padding: '2rem',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,179,237,0.08)',
          }}
        >
          {/* Error Alert */}
          {serverError && (
            <div style={{ marginBottom: '1.25rem' }}>
              <Alert type="error" message={serverError} onDismiss={() => setServerError('')} />
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} noValidate>
            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#cbd5e1', marginBottom: '0.4rem' }}
              >
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#64748b', pointerEvents: 'none' }} />
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  style={{ ...inputBase, paddingLeft: '2.5rem', border: formErrors.name ? '1.5px solid #f43f5e' : '1.5px solid rgba(148,163,184,0.25)' }}
                  onFocus={(e) => { e.target.style.borderColor = '#22d3ee'; e.target.style.boxShadow = '0 0 0 3px rgba(34,211,238,0.15)'; }}
                  onBlur={(e) => { e.target.style.borderColor = formErrors.name ? '#f43f5e' : 'rgba(148,163,184,0.25)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              {formErrors.name && <p style={{ marginTop: '0.375rem', fontSize: '0.75rem', color: '#fb7185', fontWeight: 500 }}>{formErrors.name}</p>}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#cbd5e1', marginBottom: '0.4rem' }}
              >
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#64748b', pointerEvents: 'none' }} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jane.doe@example.com"
                  style={{ ...inputBase, paddingLeft: '2.5rem', border: formErrors.email ? '1.5px solid #f43f5e' : '1.5px solid rgba(148,163,184,0.25)' }}
                  onFocus={(e) => { e.target.style.borderColor = '#22d3ee'; e.target.style.boxShadow = '0 0 0 3px rgba(34,211,238,0.15)'; }}
                  onBlur={(e) => { e.target.style.borderColor = formErrors.email ? '#f43f5e' : 'rgba(148,163,184,0.25)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              {formErrors.email && <p style={{ marginTop: '0.375rem', fontSize: '0.75rem', color: '#fb7185', fontWeight: 500 }}>{formErrors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#cbd5e1', marginBottom: '0.4rem' }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#64748b', pointerEvents: 'none' }} />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  style={{ ...inputBase, paddingLeft: '2.5rem', paddingRight: '2.75rem', border: formErrors.password ? '1.5px solid #f43f5e' : '1.5px solid rgba(148,163,184,0.25)' }}
                  onFocus={(e) => { e.target.style.borderColor = '#22d3ee'; e.target.style.boxShadow = '0 0 0 3px rgba(34,211,238,0.15)'; }}
                  onBlur={(e) => { e.target.style.borderColor = formErrors.password ? '#f43f5e' : 'rgba(148,163,184,0.25)'; e.target.style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 0, display: 'flex' }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff style={{ width: '1rem', height: '1rem' }} /> : <Eye style={{ width: '1rem', height: '1rem' }} />}
                </button>
              </div>
              {formErrors.password && <p style={{ marginTop: '0.375rem', fontSize: '0.75rem', color: '#fb7185', fontWeight: 500 }}>{formErrors.password}</p>}
            </div>

            {/* Confirm Password Field */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <label
                  htmlFor="confirmPassword"
                  style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#cbd5e1' }}
                >
                  Confirm Password
                </label>
                {passwordsMatch && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.7rem', fontWeight: 700, color: '#34d399' }}>
                    <Check style={{ width: '0.875rem', height: '0.875rem' }} /> Passwords match
                  </span>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#64748b', pointerEvents: 'none' }} />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  style={{
                    ...inputBase,
                    paddingLeft: '2.5rem',
                    paddingRight: '2.75rem',
                    border: formErrors.confirmPassword
                      ? '1.5px solid #f43f5e'
                      : passwordsMatch
                      ? '1.5px solid #34d399'
                      : '1.5px solid rgba(148,163,184,0.25)',
                  }}
                  onFocus={(e) => { e.target.style.boxShadow = '0 0 0 3px rgba(34,211,238,0.15)'; }}
                  onBlur={(e) => { e.target.style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 0, display: 'flex' }}
                  aria-label={showConfirmPassword ? 'Hide confirmation password' : 'Show confirmation password'}
                >
                  {showConfirmPassword ? <EyeOff style={{ width: '1rem', height: '1rem' }} /> : <Eye style={{ width: '1rem', height: '1rem' }} />}
                </button>
              </div>
              {formErrors.confirmPassword && <p style={{ marginTop: '0.375rem', fontSize: '0.75rem', color: '#fb7185', fontWeight: 500 }}>{formErrors.confirmPassword}</p>}
            </div>

            {/* Submit Button */}
            <div style={{ paddingTop: '0.5rem' }}>
              <ILFNButton
                type="submit"
                variant="primary"
                size="lg"
                loading={isSubmitting}
                disabled={isSubmitting}
                icon={ArrowRight}
                className="w-full"
              >
                {isSubmitting ? 'Creating your account...' : 'Complete Registration'}
              </ILFNButton>
            </div>
          </form>

          {/* Switch to Login */}
          <div
            style={{
              marginTop: '1.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid rgba(148,163,184,0.12)',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>
              Already have an ILFN account?{' '}
              <Link
                to="/login"
                style={{ fontWeight: 700, color: '#22d3ee', textDecoration: 'underline', textUnderlineOffset: '3px' }}
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
