import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Zap, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loginAsGuest } = useContext(AuthContext);

  const handleGuest = () => {
    loginAsGuest();
    navigate('/dashboard');
  };

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px 12px 44px',
    background: '#262626', border: '1px solid #404040',
    borderRadius: '10px', color: '#fff', fontSize: '0.95rem',
    outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#000000',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', fontFamily: 'Inter, sans-serif',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Card */}
      <div style={{
        width: '100%', maxWidth: '440px',
        background: '#171717', border: '1px solid #404040',
        borderRadius: '20px', padding: '2.5rem',
        position: 'relative', zIndex: 1,
        boxShadow: '0 25px 50px rgba(0,0,0,0.8)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            background: '#262626', border: '1px solid #404040',
            borderRadius: '16px', width: '60px', height: '60px', marginBottom: '1rem',
          }}>
            <Zap size={30} color="#FFFFFF" fill="#FFFFFF" />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 900, margin: '0 0 0.25rem', color: '#fff' }}>
            Welcome back
          </h1>
          <p style={{ color: '#A3A3A3', fontSize: '0.875rem' }}>
            Sign in to your FitBuddy AI account
          </p>
        </div>

        {/* Demo hint */}
        <div style={{
          background: '#262626', border: '1px solid #404040',
          borderRadius: '10px', padding: '10px 14px',
          marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <AlertCircle size={14} color="#FFFFFF" style={{ flexShrink: 0 }} />
          <p style={{ color: '#A3A3A3', fontSize: '0.8rem', margin: 0 }}>
            <span style={{ color: '#FFFFFF', fontWeight: 600 }}>Demo mode:</span> Use any email &amp; password to sign in.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#262626', border: '1px solid #404040',
            borderRadius: '10px', padding: '10px 14px',
            marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <AlertCircle size={14} color="#FFFFFF" style={{ flexShrink: 0 }} />
            <p style={{ color: '#FFFFFF', fontSize: '0.85rem', margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', color: '#A3A3A3', fontSize: '0.85rem', marginBottom: '6px', fontWeight: 600 }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="#A3A3A3" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email" name="email" placeholder="you@example.com"
                value={form.email} onChange={handleChange}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#FFFFFF'}
                onBlur={e => e.target.style.borderColor = '#404040'}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ display: 'block', color: '#A3A3A3', fontSize: '0.85rem', marginBottom: '6px', fontWeight: 600 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#A3A3A3" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type={showPass ? 'text' : 'password'} name="password" placeholder="••••••••"
                value={form.password} onChange={handleChange}
                style={{ ...inputStyle, paddingRight: '44px' }}
                onFocus={e => e.target.style.borderColor = '#FFFFFF'}
                onBlur={e => e.target.style.borderColor = '#404040'}
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                style={{
                  position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#A3A3A3', padding: 0,
                }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Forgot password */}
          <div style={{ textAlign: 'right', marginBottom: '1.75rem' }}>
            <a href="#" style={{ color: '#FFFFFF', fontSize: '0.8rem', textDecoration: 'none', fontWeight: 600 }}>
              Forgot password?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit" disabled={loading}
            style={{
              width: '100%', padding: '13px',
              background: loading ? '#737373' : '#FFFFFF',
              color: '#000000', fontWeight: 800, fontSize: '1rem',
              borderRadius: '10px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'background 0.2s, transform 0.1s',
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#E5E5E5'; }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#FFFFFF'; }}
            onMouseDown={e => { if (!loading) e.currentTarget.style.transform = 'scale(0.98)'; }}
            onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            {loading ? (
              <>
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                Signing in...
              </>
            ) : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          margin: '1.5rem 0', color: '#404040',
        }}>
          <div style={{ flex: 1, height: '1px', background: '#404040' }} />
          <span style={{ fontSize: '0.8rem', color: '#A3A3A3' }}>or continue with</span>
          <div style={{ flex: 1, height: '1px', background: '#404040' }} />
        </div>

        {/* Google / Apple demo buttons */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {['Google', 'Apple'].map(provider => (
            <button key={provider} style={{
              flex: 1, padding: '11px',
              background: '#262626', border: '1px solid #404040',
              borderRadius: '10px', color: '#fff', fontSize: '0.85rem',
              cursor: 'pointer', fontWeight: 600,
              transition: 'border-color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#FFFFFF'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#404040'}
            >
              {provider}
            </button>
          ))}
        </div>

        {/* Sign up link */}
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#A3A3A3', fontSize: '0.875rem' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#FFFFFF', fontWeight: 700, textDecoration: 'none' }}>
            Sign Up
          </Link>
        </p>

        {/* Continue as Guest option */}
        <div style={{ textAlign: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #404040' }}>
          <button
            type="button"
            onClick={handleGuest}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            ⚡ Continue as Guest (No Sign-in Required)
          </button>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
