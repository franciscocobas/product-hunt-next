import App from "next/app";
import firebase, { FirebaseContext } from "../firebase";
import useAutenticacion from '../hooks/useAutenticacion';

const MyApp = ({ Component, pageProps }) => {
  const user = useAutenticacion(); 
  return (
    <FirebaseContext.Provider
      value={{
        firebase,
        user
      }}
    >
      <Component {...pageProps} />
    </FirebaseContext.Provider>
  );
};

export default MyApp;
