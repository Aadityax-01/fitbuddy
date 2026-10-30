import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Zap, Mail, Lock, User, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

/* ── password strength ── */
function getStrength(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0-4
}

const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColors = ['#1a1a1a', '#ef4444', '#f97316', '#f59e0b', '#39ff14'];

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useContext(AuthContext);

  const [form, setForm] = useState({
    fullName: '', email: '', password: '', confirmPassword: '', terms: false,
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const strength = getStrength(form.password);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name is required.';
    if (!form.email.includes('@')) errs.email = 'Enter a valid email.';
    if (form.password.length < 6) errs.password = 'Password must be at least 6 characters.';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    if (!form.terms) errs.terms = 'You must accept the terms.';
    return errs;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await signup(form.fullName, form.email, form.password);
      navigate('/onboarding');
    } catch (err) {
      setErrors({ general: err?.message || 'Signup failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const inputWrap = { position: 'relative', marginBottom: '0' };
  const inputStyle = (hasErr) => ({
    width: '100%', padding: '12px 16px 12px 44px',
    background: '#1a1a1a', border: `1px solid ${hasErr ? '#ef4444' : '#2a2a2a'}`,
    borderRadius: '10px', color: '#fff', fontSize: '0.95rem',
    outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
  });

  const iconStyle = { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' };

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
        width: '100%', maxWidth: '460px',
        background: '#111', border: '1px solid #1a1a1a',
        borderRadius: '20px', padding: '2.5rem',
        position: 'relative', zIndex: 1,
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
      }}>
        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: '#39ff1415', borderRadius: '8px', padding: '4px 10px',
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#39ff14' }} />
            <span style={{ fontSize: '0.75rem', color: '#39ff14', fontWeight: 600 }}>Step 1 of 2</span>
          </div>
          <div style={{ flex: 1, height: '3px', background: '#1a1a1a', borderRadius: '2px' }}>
            <div style={{ width: '50%', height: '100%', background: '#39ff14', borderRadius: '2px' }} />
          </div>
        </div>

        {/* Logo & heading */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            background: '#39ff1415', border: '1px solid #39ff1430',
            borderRadius: '16px', width: '56px', height: '56px', marginBottom: '1rem',
          }}>
            <Zap size={28} color="#39ff14" fill="#39ff14" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.25rem', color: '#fff' }}>
            Create your account
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
            Start your fitness journey today — free forever
          </p>
        </div>

        {/* General error */}
        {errors.general && (
          <div style={{
            background: '#ef44441a', border: '1px solid #ef444450',
            borderRadius: '10px', padding: '10px 14px', marginBottom: '1.25rem',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <AlertCircle size={14} color="#ef4444" />
            <p style={{ color: '#ef4444', fontSize: '0.85rem', margin: 0 }}>{errors.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {/* Full Name */}
          <div>
            <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.82rem', marginBottom: '5px', fontWeight: 500 }}>Full Name</label>
            <div style={inputWrap}>
              <User size={15} color="#9ca3af" style={iconStyle} />
              <input
                type="text" name="fullName" placeholder="Alex Johnson"
                value={form.fullName} onChange={handleChange}
                style={inputStyle(!!errors.fullName)}
                onFocus={e => e.target.style.borderColor = '#39ff14'}
                onBlur={e => e.target.style.borderColor = errors.fullName ? '#ef4444' : '#2a2a2a'}
              />
            </div>
            {errors.fullName && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div>
            <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.82rem', marginBottom: '5px', fontWeight: 500 }}>Email Address</label>
            <div style={inputWrap}>
              <Mail size={15} color="#9ca3af" style={iconStyle} />
              <input
                type="email" name="email" placeholder="you@example.com"
                value={form.email} onChange={handleChange}
                style={inputStyle(!!errors.email)}
                onFocus={e => e.target.style.borderColor = '#39ff14'}
                onBlur={e => e.target.style.borderColor = errors.email ? '#ef4444' : '#2a2a2a'}
              />
            </div>
            {errors.email && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.82rem', marginBottom: '5px', fontWeight: 500 }}>Password</label>
            <div style={{ ...inputWrap, marginBottom: '0.5rem' }}>
              <Lock size={15} color="#9ca3af" style={iconStyle} />
              <input
                type={showPass ? 'text' : 'password'} name="password" placeholder="Min. 6 characters"
                value={form.password} onChange={handleChange}
                style={{ ...inputStyle(!!errors.password), paddingRight: '44px' }}
                onFocus={e => e.target.style.borderColor = '#39ff14'}
                onBlur={e => e.target.style.borderColor = errors.password ? '#ef4444' : '#2a2a2a'}
              />
              <button type="button" onClick={() => setShowPass(v => !v)} style={{
                position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0,
              }}>
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {/* Strength indicator */}
            {form.password && (
              <div>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{
                      flex: 1, height: '3px', borderRadius: '2px',
                      background: i <= strength ? strengthColors[strength] : '#2a2a2a',
                      transition: 'background 0.3s',
                    }} />
                  ))}
                </div>
                <p style={{ fontSize: '0.75rem', color: strengthColors[strength], margin: 0 }}>
                  {strengthLabels[strength]}
                </p>
              </div>
            )}
            {errors.password && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.82rem', marginBottom: '5px', fontWeight: 500 }}>Confirm Password</label>
            <div style={inputWrap}>
              <Lock size={15} color="#9ca3af" style={iconStyle} />
              <input
                type={showConfirm ? 'text' : 'password'} name="confirmPassword" placeholder="Re-enter password"
                value={form.confirmPassword} onChange={handleChange}
                style={{ ...inputStyle(!!errors.confirmPassword), paddingRight: '44px' }}
                onFocus={e => e.target.style.borderColor = '#39ff14'}
                onBlur={e => e.target.style.borderColor = errors.confirmPassword ? '#ef4444' : '#2a2a2a'}
              />
              <button type="button" onClick={() => setShowConfirm(v => !v)} style={{
                position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0,
              }}>
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {form.confirmPassword && form.password === form.confirmPassword && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                <CheckCircle2 size={12} color="#39ff14" />
                <span style={{ fontSize: '0.75rem', color: '#39ff14' }}>Passwords match</span>
              </div>
            )}
            {errors.confirmPassword && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.confirmPassword}</p>}
          </div>

          {/* Terms */}
          <div>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox" name="terms" checked={form.terms} onChange={handleChange}
                style={{ marginTop: '3px', accentColor: '#39ff14', cursor: 'pointer', width: '15px', height: '15px' }}
              />
              <span style={{ fontSize: '0.82rem', color: '#9ca3af', lineHeight: 1.5 }}>
                I agree to the{' '}
                <a href="#" style={{ color: '#39ff14', textDecoration: 'none' }}>Terms of Service</a>
                {' '}and{' '}
                <a href="#" style={{ color: '#39ff14', textDecoration: 'none' }}>Privacy Policy</a>
              </span>
            </label>
            {errors.terms && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.terms}</p>}
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
              marginTop: '0.5rem',
            }}
          >
            {loading ? (
              <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Creating account...</>
            ) : 'Create Account →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#9ca3af', fontSize: '0.875rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#39ff14', fontWeight: 600, textDecoration: 'none' }}>
            Sign In
          </Link>
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
