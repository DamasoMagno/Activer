import { useEffect, useState } from "react";
import { app } from "../services/firebase";
import { DocumentData, getFirestore, getDoc, doc } from "firebase/firestore";

export function useFirestore(collectionName: string){
  const [ data, setData ] = useState<DocumentData>();
  const [ loading, setLoading ] = useState(true);

  const database = getFirestore(app);
  const databaseCollection = doc(database, collectionName);

  useEffect(() => {
    getDoc(databaseCollection)
      .then(response => {
        console.log(response.data());
      })
  }, []);

  return { data, loading };
} 