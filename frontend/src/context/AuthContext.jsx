import authService from "../services/authService";
import {
  createContext,
  useContext,
  useState
} from "react";


const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("ems_user") || "null"
      );
    } catch {
      return null;
    }
  });

  const login = async (credentials) => {
    const result = await authService.login(credentials);

    const profile = result.user || result;
    const token = result.token || result.accessToken;

    if (token) {
      localStorage.setItem("ems_token", token);
    }

    const nextUser = {
      name:
        profile.name ||
        profile.fullName ||
        credentials.email.split("@")[0],

      email: profile.email || credentials.email,

      role: profile.role || "EMPLOYEE"
    };

    localStorage.setItem(
      "ems_user",
      JSON.stringify(nextUser)
    );

    setUser(nextUser);

    return result;
  };

  const register = async (data) => {
    return await authService.register(data);
  };

  const logout = () => {
    localStorage.removeItem("ems_token");
    localStorage.removeItem("ems_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
