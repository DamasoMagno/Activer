import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";

type User = {
  displayName: string | null;
  photoURL: string | null;
  uid: string | null;
}

type AuthContextProps = {
  user: User;
  signIn: () => Promise<void>;
}

type AuthContextProviderProps = {
  children: ReactNode;
}

const AuthContext = createContext({} as AuthContextProps);


export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const navigate = useNavigate();

  const [user, setUser] = useState({} as User);

  useEffect(() => {
    onAuthStateChanged(auth, userLogged => {
      if (!userLogged) {
        return navigate("/signIn");
      }

      setUser({
        displayName: userLogged?.displayName ?? null,
        photoURL: userLogged?.photoURL ?? null,
        uid: userLogged?.uid ?? null
      });
    });
  }, []);

  async function signIn() {
    const provider = new GoogleAuthProvider();

    try {
      const response = await signInWithPopup(auth, provider);
      setUser({ ...response.user });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthContext.Provider value={{ user, signIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
