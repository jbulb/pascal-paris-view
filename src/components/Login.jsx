import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userSignedIn } from '../store/userSlice';
import UserUtil from '../util/UserUtil';
import '../css/Login.css';

function Login() {
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = () => {
    if (password === UserUtil.expectedUserToken()) {
      dispatch(userSignedIn(password));
      navigate('/');
    } else {
      setShowError(true);
    }
  };

  const handlePasswordChange = (evt) => {
    setShowError(false);
    setPassword(evt.target.value);
  };

  const handleFocus = () => {
    setShowError(false);
  };

  const handleKeyPress = (evt) => {
    if (evt.key === 'Enter') {
      login();
    }
  };

  const messageText = 'Wrong password. Please try again.';
  const messageStyle = {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: '5px',
    opacity: '100%',
    display: showError ? 'block' : 'none',
  };

  return (
    <div className="login-background">
      <div className="login-wrap">
        <div style={messageStyle}>{messageText}</div>
        <input
          type="password"
          onFocus={handleFocus}
          onChange={handlePasswordChange}
          onKeyPress={handleKeyPress}
        />
        <button onClick={login}>Enter</button>
      </div>
    </div>
  );
}

export default Login;
