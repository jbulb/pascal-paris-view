import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, completeNewPassword } from '../auth/cognito';
import '../css/Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [challengeUser, setChallengeUser] = useState(null);
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

  const handleKeyPress = (evt, action) => {
    if (evt.key === 'Enter') action();
  };

  if (challengeUser) {
    return (
      <div className="login-background">
        <div className="login-wrap">
          <p style={{ color: 'white', marginBottom: '10px' }}>
            Please set a new password
          </p>
          {error && (
            <div style={{ color: '#ff6b6b', fontWeight: 'bold', marginBottom: '5px' }}>
              {error}
            </div>
          )}
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

  return (
    <div className="login-background">
      <div className="login-wrap">
        {error && (
          <div style={{ color: '#ff6b6b', fontWeight: 'bold', marginBottom: '5px' }}>
            {error}
          </div>
        )}
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
      </div>
    </div>
  );
}

export default Login;
