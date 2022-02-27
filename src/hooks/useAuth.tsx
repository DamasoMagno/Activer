import { useEffect, useState, createContext, ReactNode, useContext } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "../services/firebase";

type User = {
  displayName: string | null;
  photoURL: string | null;
  uid: string | null;
}

type AuthContextProps = {
  user: User | null;
  signIn: () => void;
}

type AppContextProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextProps);

export function AppContext({ children }: AppContextProps) {
  const auth = getAuth(app);

  const [user, setUser] = useState<User | null>({} as User | null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        console.log("Usuario não carregado");
      }

      setUser({
        displayName: String(user?.displayName),
        photoURL: String(user?.photoURL),
        uid: String(user?.uid)
      });
    });
  }, []);

  async function signIn() {
    const provider = new GoogleAuthProvider();

    if (user) {
      signOut(auth);
      setUser(null);

      return
    };

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