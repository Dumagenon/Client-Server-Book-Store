import { useCallback, useContext } from 'react';
import AuthContext from '../context/auth-context';

export const useMessage = () => {
  const auth = useContext(AuthContext);
  
  return useCallback(text => {
    if (window.M && text) {
      switch(text) {
        case `E11000 duplicate key error collection: mern-test.reviews index: owner_1 dup key: { owner: "${auth.userName}" }`:
          window.M.toast({ html: "You can write only one review!" });
          break;
        case "jwt expired":
          auth.logout();
          break;
        default:
          window.M.toast({ html: text });
      }
    }
  },[auth])
}
