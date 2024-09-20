import { useContext } from "react";
import {jwtDecode} from "jwt-decode";

import AuthContext from "./context";
import authStorage from "./storage";

const useAuth = () => {
  const { user, setUser, driver, setDriver } = useContext(AuthContext);

  const logIn = ({token, driver:driverInfo}) => {
    const user = jwtDecode(token);
    setUser(user);
    if(driverInfo) setDriver(driverInfo);
    authStorage.storeToken(token);
  };

  const logOut = () => {
    setUser(null);
    authStorage.removeToken();
  };

  return { user, driver, logIn, logOut };
};

export default useAuth;
