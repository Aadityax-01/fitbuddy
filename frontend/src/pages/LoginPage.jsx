import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Zap, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

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

  /* ── shared input style ── */
  const inputStyle = {
    width: '100%', padding: '12px 16px 12px 44px',
    background: '#1a1a1a', border: '1px solid #2a2a2a',
    borderRadius: '10px', color: '#fff', fontSize: '0.95rem',
    outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', fontFamily: 'Inter, sans-serif',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, #39ff1410 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: '440px',
        background: '#111', border: '1px solid #1a1a1a',
        borderRadius: '20px', padding: '2.5rem',
        position: 'relative', zIndex: 1,
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            background: '#39ff1415', border: '1px solid #39ff1430',
            borderRadius: '16px', width: '60px', height: '60px', marginBottom: '1rem',
          }}>
            <Zap size={30} color="#39ff14" fill="#39ff14" />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 0.25rem', color: '#fff' }}>
            Welcome back
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
            Sign in to your FitBuddy AI account
          </p>
        </div>

        {/* Demo hint */}
        <div style={{
          background: '#39ff1408', border: '1px solid #39ff1425',
          borderRadius: '10px', padding: '10px 14px',
          marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <AlertCircle size={14} color="#39ff14" style={{ flexShrink: 0 }} />
          <p style={{ color: '#9ca3af', fontSize: '0.8rem', margin: 0 }}>
            <span style={{ color: '#39ff14', fontWeight: 600 }}>Demo mode:</span> Use any email &amp; password to sign in.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#ef44441a', border: '1px solid #ef444450',
            borderRadius: '10px', padding: '10px 14px',
            marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <AlertCircle size={14} color="#ef4444" style={{ flexShrink: 0 }} />
            <p style={{ color: '#ef4444', fontSize: '0.85rem', margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.85rem', marginBottom: '6px', fontWeight: 500 }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="#9ca3af" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email" name="email" placeholder="you@example.com"
                value={form.email} onChange={handleChange}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#39ff14'}
                onBlur={e => e.target.style.borderColor = '#2a2a2a'}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.85rem', marginBottom: '6px', fontWeight: 500 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#9ca3af" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type={showPass ? 'text' : 'password'} name="password" placeholder="••••••••"
                value={form.password} onChange={handleChange}
                style={{ ...inputStyle, paddingRight: '44px' }}
                onFocus={e => e.target.style.borderColor = '#39ff14'}
                onBlur={e => e.target.style.borderColor = '#2a2a2a'}
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                style={{
                  position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0,
                }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Forgot password */}
          <div style={{ textAlign: 'right', marginBottom: '1.75rem' }}>
            <a href="#" style={{ color: '#39ff14', fontSize: '0.8rem', textDecoration: 'none', fontWeight: 500 }}>
              Forgot password?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit" disabled={loading}
            style={{
              width: '100%', padding: '13px',
              background: loading ? '#39ff1499' : '#39ff14',
              color: '#000', fontWeight: 800, fontSize: '1rem',
              borderRadius: '10px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'background 0.2s, transform 0.1s',
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#5aff2d'; }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#39ff14'; }}
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
          margin: '1.5rem 0', color: '#333',
        }}>
          <div style={{ flex: 1, height: '1px', background: '#1a1a1a' }} />
          <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>or continue with</span>
          <div style={{ flex: 1, height: '1px', background: '#1a1a1a' }} />
        </div>

        {/* Google / Apple demo buttons */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {['Google', 'Apple'].map(provider => (
            <button key={provider} style={{
              flex: 1, padding: '11px',
              background: '#1a1a1a', border: '1px solid #2a2a2a',
              borderRadius: '10px', color: '#fff', fontSize: '0.85rem',
              cursor: 'pointer', fontWeight: 500,
              transition: 'border-color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#39ff14'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2a2a'}
            >
              {provider}
            </button>
          ))}
        </div>

        {/* Sign up link */}
        <p style={{ textAlign: 'center', marginTop: '1.75rem', color: '#9ca3af', fontSize: '0.875rem' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#39ff14', fontWeight: 600, textDecoration: 'none' }}>
            Sign Up
          </Link>
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
