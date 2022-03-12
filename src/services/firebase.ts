import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyBzh0HotJGEMEE5gOo-3nY3yYv2O6YpIgk",
  authDomain: "activies-deliver.firebaseapp.com",
  projectId: "activies-deliver",
  storageBucket: "activies-deliver.appspot.com",
  messagingSenderId: "684633285800",
  appId: "1:684633285800:web:f9771777f8cf4f3beb0e9d",
  measurementId: "G-9SRL2TD3ZF"
};

const app = initializeApp(firebaseConfig);

export { app };

