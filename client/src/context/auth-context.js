import { createContext } from 'react';

export default createContext({
  token: null,
  userId: null,
  userName: null,
  login: () => {},
  logout: () => {},
  isAuth: false
});
