import React, { useContext, useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import AuthContext from '../../context/auth-context';
import StoreContext from '../../context/store-context';
import { useHttp } from '../../hooks/http.hook';
import { useMessage } from '../../hooks/message.hook';
import './nav-menu.css';

const NavMenu = () => {
  const message = useMessage();
  const { state, dispatch } = useContext(StoreContext);
  const [mobileMenu, setMobileMenu] = useState('');
  const auth = useContext(AuthContext);
  const { request, error, clearError, loading } = useHttp();

  useEffect(() => {
    async function getOrderSize() {
      try {
        const data = await request('/api/orders/', 'GET', null, {
          Authorization: `Bearer ${auth.token}`
        });
        dispatch({
          type: 'SET_ORDERS',
          payload: data
        });
      } catch (e) {}
    }
    getOrderSize();
  }, [dispatch, request, auth.token]);

  useEffect(() => {
    message(error);
    clearError();
  }, [error, clearError, message, state]);

  const logoutHandler = (e) => {
    e.preventDefault();
    auth.logout();
  }

  const toggleMobileNav = () => {
    setMobileMenu((state) => {
      return state === '' ? 'side-navigation__opened' : '';
    });
  }

  const isAuthCheck = () => {
    return auth.isAuth ? (
      <>
        <li><NavLink activeClassName="nav-selected" to="/create">Create Book</NavLink></li>
        <li><NavLink activeClassName="nav-selected" to="/reviews">Reviews</NavLink></li>
        <li><NavLink activeClassName="nav-selected" className="cart-nav" to="/cart">
          Cart
          <div className="order-size">{loading ? 0 : state.orders.length}</div>
        </NavLink></li>
        <li><a href="/" onClick={logoutHandler}>Sign out</a></li>
      </>
    ) : <li><NavLink activeClassName="nav-selected" to="/auth">Sign in</NavLink></li>
  }

  return (
    <nav className="blue-grey darken-4">
      <div className="nav-wrapper container">
        <Link to="/" className="app-name">FaithfulReader</Link>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          <li><NavLink activeClassName="nav-selected" exact to="/">Catalog</NavLink></li>
          {isAuthCheck()}
        </ul>
        <button data-target="slide-out"
          className="sidenav-trigger mobile-gamb"
          onClick={toggleMobileNav}  
        >
          <i className="medium material-icons">menu</i>
        </button>
        <div className={`side-navigation ${mobileMenu}`}>
          <div className="side-nav_overlay" onClick={toggleMobileNav}/>
          <div className="side-nav__body">
            <div className="side-body__header">
              <div className="side-body__title">Menu</div>
              <button type="button" className="side-nav__close"
                onClick={toggleMobileNav}>
                <i className="small material-icons">close</i>
              </button>
            </div>
            <ul className="side-nav-list" onClick={toggleMobileNav}>
              <li><NavLink activeClassName="nav-selected" exact to="/">Catalog</NavLink></li>
              {isAuthCheck()}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavMenu;