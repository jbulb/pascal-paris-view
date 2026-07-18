import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  signIn,
  completeNewPassword,
  forgotPassword,
  confirmForgotPassword,
} from '../auth/cognito';
import '../css/Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [challengeUser, setChallengeUser] = useState(null);
  // 'login' | 'forgot' (request a code) | 'reset' (enter code + new password)
  const [mode, setMode] = useState('login');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    try {
      const result = await signIn(email, password);
      if (result.type === 'NEW_PASSWORD_REQUIRED') {
        setChallengeUser(result.user);
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  const handleNewPassword = async () => {
    setError('');
    try {
      await completeNewPassword(challengeUser, newPassword);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to set new password');
    }
  };

  const handleSendResetCode = async () => {
    setError('');
    if (!email.trim()) { setError('Enter your email address first'); return; }
    try {
      await forgotPassword(email.trim());
      setMode('reset');
      setInfo('A reset code has been emailed to you. Enter it below with your new password.');
    } catch (err) {
      setError(err.message || 'Could not send reset code');
    }
  };

  const handleConfirmReset = async () => {
    setError('');
    if (!resetCode.trim() || !newPassword) { setError('Enter the emailed code and a new password'); return; }
    try {
      await confirmForgotPassword(email.trim(), resetCode.trim(), newPassword);
      setMode('login');
      setPassword('');
      setNewPassword('');
      setResetCode('');
      setInfo('Password updated — sign in with your new password.');
    } catch (err) {
      setError(err.message || 'Could not reset password');
    }
  };

  const handleKeyPress = (evt, action) => {
    if (evt.key === 'Enter') action();
  };

  const errorBox = error && (
    <div style={{ color: '#ff6b6b', fontWeight: 'bold', marginBottom: '5px' }}>
      {error}
    </div>
  );

  const infoBox = info && (
    <div style={{ color: '#a9dfbf', marginBottom: '5px' }}>
      {info}
    </div>
  );

  if (challengeUser) {
    return (
      <div className="login-background">
        <div className="login-wrap">
          <p style={{ color: 'white', marginBottom: '10px' }}>
            Please set a new password
          </p>
          {errorBox}
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            onKeyDown={(e) => handleKeyPress(e, handleNewPassword)}
          />
          <button onClick={handleNewPassword}>Set Password</button>
        </div>
      </div>
    );
  }

  if (mode === 'forgot') {
    return (
      <div className="login-background">
        <div className="login-wrap">
          <p style={{ color: 'white', marginBottom: '10px' }}>
            Enter your email and we'll send you a reset code
          </p>
          {errorBox}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => { setError(''); setEmail(e.target.value); }}
            onKeyDown={(e) => handleKeyPress(e, handleSendResetCode)}
          />
          <button onClick={handleSendResetCode}>Send Reset Code</button>
          <button
            className="login-link-btn"
            onClick={() => { setError(''); setInfo(''); setMode('login'); }}
          >
            Back to sign in
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'reset') {
    return (
      <div className="login-background">
        <div className="login-wrap">
          {infoBox}
          {errorBox}
          <input
            type="text"
            placeholder="Reset code from email"
            value={resetCode}
            onChange={(e) => { setError(''); setResetCode(e.target.value); }}
            onKeyDown={(e) => handleKeyPress(e, handleConfirmReset)}
          />
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => { setError(''); setNewPassword(e.target.value); }}
            onKeyDown={(e) => handleKeyPress(e, handleConfirmReset)}
            style={{ marginTop: '10px' }}
          />
          <button onClick={handleConfirmReset}>Set New Password</button>
          <button
            className="login-link-btn"
            onClick={() => { setError(''); handleSendResetCode(); }}
          >
            Resend code
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-background">
      <div className="login-wrap">
        {infoBox}
        {errorBox}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => { setError(''); setEmail(e.target.value); }}
          onKeyDown={(e) => handleKeyPress(e, handleLogin)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => { setError(''); setPassword(e.target.value); }}
          onKeyDown={(e) => handleKeyPress(e, handleLogin)}
          style={{ marginTop: '10px' }}
        />
        <button onClick={handleLogin}>Sign In</button>
        <button
          className="login-link-btn"
          onClick={() => { setError(''); setInfo(''); setMode('forgot'); }}
        >
          Forgot password?
        </button>
      </div>
    </div>
  );
}

export default Login;
