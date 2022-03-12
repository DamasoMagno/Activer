import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { app } from "../services/firebase";

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

export const AuthContext = createContext({} as AuthContextProps);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const auth = getAuth(app);

  const [user, setUser] = useState<User>({} as User);

  useEffect(() => {
    onAuthStateChanged(auth, (newUser) => {
      if (!newUser) {
        console.log("Usuario não carregado");
        return;
      }
      
      setUser({
        displayName: newUser?.displayName ?? null,
        photoURL: newUser?.photoURL ?? null,
        uid: newUser?.uid ?? null
      });
    });
  }, []);

  async function signIn() {
    const provider = new GoogleAuthProvider();

    try {
      const response = await signInWithPopup(auth, provider);
      setUser({...response.user});
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