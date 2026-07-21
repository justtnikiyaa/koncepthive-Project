import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, Key, Mail, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuickFill = () => {
    setEmail('admin@test.com');
    setPassword('123456');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await login(email, password);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card animate-scale-up">
        <div className="login-header">
          <div className="login-logo-badge">
            <LogIn size={28} />
          </div>
          <h1>Koncepthive</h1>
          <p>Task Management System</p>
        </div>

        {error && (
          <div className="login-error-alert animate-fade-in">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                id="email"
                type="email"
                placeholder="admin@test.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <Key size={18} className="input-icon" />
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="spin-icon" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <LogIn size={18} />
              </>
            )}
          </button>
        </form>

        <div className="quick-fill-box">
          <div className="quick-fill-header">
            <span>Assessment Default Credentials</span>
          </div>
          <button type="button" onClick={handleQuickFill} className="quick-fill-btn">
            <CheckCircle2 size={16} />
            Auto-fill Admin (admin@test.com / 123456)
          </button>
        </div>
      </div>

      <style>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          background: var(--bg-card);
          border-radius: var(--radius-lg);
          padding: 36px 32px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
          border: 1px solid var(--border-color);
        }

        .login-header {
          text-align: center;
          margin-bottom: 28px;
        }

        .login-logo-badge {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: var(--primary-light);
          color: var(--primary-color);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
        }

        .login-header h1 {
          font-size: 24px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.5px;
        }

        .login-header p {
          font-size: 14px;
          color: var(--text-secondary);
          margin-top: 4px;
        }

        .login-error-alert {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #ef4444;
          border-radius: var(--radius-sm);
          font-size: 13px;
          margin-bottom: 20px;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          color: var(--text-muted);
          pointer-events: none;
        }

        .input-with-icon input {
          width: 100%;
          padding: 12px 14px 12px 42px;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          background: var(--bg-main);
          color: var(--text-primary);
          outline: none;
          transition: all 0.2s ease;
        }

        .input-with-icon input:focus {
          border-color: var(--border-focus);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
        }

        .login-btn {
          width: 100%;
          padding: 12px;
          border-radius: var(--radius-md);
          background: var(--primary-color);
          color: #ffffff;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 6px;
          transition: background 0.2s ease;
        }

        .login-btn:hover:not(:disabled) {
          background: var(--primary-hover);
        }

        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .quick-fill-box {
          margin-top: 28px;
          padding-top: 20px;
          border-top: 1px dashed var(--border-color);
          text-align: center;
        }

        .quick-fill-header {
          font-size: 12px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .quick-fill-btn {
          width: 100%;
          padding: 10px;
          border-radius: var(--radius-md);
          background: var(--bg-main);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
        }

        .quick-fill-btn:hover {
          background: var(--primary-light);
          color: var(--primary-color);
          border-color: var(--primary-color);
        }

        .spin-icon {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
