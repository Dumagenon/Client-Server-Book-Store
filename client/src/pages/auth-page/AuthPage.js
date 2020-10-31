import React, { useState, useEffect, useContext } from 'react';
import { useHttp } from '../../hooks/http.hook';
import { useMessage } from '../../hooks/message.hook';
import AuthContext from '../../context/auth-context';
import SignInForm from '../../components/sign-in-form';
import SignUpForm from '../../components/sing-up-form';
import './authpage.css';

const AuthPage = () => {
  const message = useMessage();
  const { request, loading, error, clearError } = useHttp();
  const auth = useContext(AuthContext);
  const [authType, setAuthType] = useState('sign-up');
  const [formUp, setFormUp] = useState({
    login: '',
    email: '',
    password: ''
  });
  const [formIn, setFormIn] = useState({
    logData: '',
    password: ''
  });

  useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError]);

  const changeHandlerUp = event => {
    setFormUp({...formUp, [event.target.name]: event.target.value});
  };

  const changeHandlerIn = event => {
    setFormIn({...formIn, [event.target.name]: event.target.value})
  };

  const registerHandler = async (event) => {
    event.preventDefault();
    try {
      const data = await request('/api/auth/register', 'POST', {...formUp});
      auth.login(data.token, data.userId, data.userName);
    } catch (e) {}
  };

  const loginHandler = async (event) => {
    event.preventDefault();
    try {
      const data = await request('/api/auth/login', 'POST', {...formIn});
      auth.login(data.token, data.userId, data.userName);
    } catch (e) {}
  };

  return (
    <div className="auth-area">
      <div className="auth-tabs">
        <span
          className={`auth-tab${authType === 'sign-in' ? ' is-selected' : ''}`}
          onClick={() => setAuthType("sign-in")}
        >
          Sign In
        </span>
        <span
          className={`auth-tab${authType === 'sign-up' ? ' is-selected' : ''}`}
          onClick={() => setAuthType("sign-up")}
        >
          Sign Up
        </span>
      </div>
      {
        authType === 'sign-up' ?
          <SignUpForm
            loading={loading}
            registerHandler={registerHandler}
            changeHandler={changeHandlerUp} /> :
          <SignInForm
            loading={loading}
            loginHandler={loginHandler}
            changeHandler={changeHandlerIn} />
      }
    </div>
  )
}

export default AuthPage;