import React, { useReducer } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useRoutes } from './routes';
import { useAuth } from './hooks/auth.hook';
import AuthContext from './context/auth-context';
import StoreContext from './context/store-context';
import NavMenu from './components/nav-menu';
import Loader from './components/loader';
import ErrorBoundry from './components/error-boundry'
import reducer from './reducer';
import 'materialize-css';

function App() {
  const { token, userId, login, logout, userName, ready } = useAuth();
  const [state, dispatch] = useReducer(reducer, {
    orders: []
  })
  const isAuth = !!token;
  const routes = useRoutes(isAuth);

  if (!ready) {
    return <Loader />;
  }

  return (
    <ErrorBoundry>
      <AuthContext.Provider value={{token, userId, login, logout, userName, isAuth}}>
        <StoreContext.Provider value={{ dispatch, state }}>
          <Router>
            <NavMenu orders={state.order}/>
            <div className="container">
              {routes}
            </div>
          </Router>
        </StoreContext.Provider>
      </AuthContext.Provider>
    </ErrorBoundry>
  );
}

export default App;
