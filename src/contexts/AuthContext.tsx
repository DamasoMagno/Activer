import { useEffect, useState, createContext, ReactNode, useContext } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { app } from "../services/firebase";

type User = {
  displayName: string | null;
  photoURL: string | null;
  uid: string | null;
}

type AuthContextProps = {
  user: User;
  signIn: () => void;
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

    signInWithPopup(auth, provider)
      .then(response => {
        const { user } = response;

        setUser({
          displayName: user.displayName,
          photoURL: user.photoURL,
          uid: user.uid
        });
      })
      .catch(error => console.log(error))
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