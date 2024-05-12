import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { AuthData, authService } from "@/services/authService";

type AuthContextData = {
  authData?: AuthData;
  loading: boolean;
  signIn: (formData: any) => Promise<AuthData | undefined>;
  register: (formData: any) => Promise<AuthData | undefined>;
  signOut: () => Promise<void>;
  signInWithGoogle: (googleUser: any) => Promise<any>;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authData, setAuthData] = useState<AuthData>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  const loadStorageData = async (): Promise<void> => {
    try {
      const authDataSerialized = await AsyncStorage.getItem("@AuthData");
      if (authDataSerialized && !JSON.parse(authDataSerialized).token) {
        return;
      }
      if (authDataSerialized) {
        const authData: AuthData = JSON.parse(authDataSerialized);
        setAuthData(authData);
      }
    } catch (error) {
      console.error("Error loading storage data:", error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (formData: any): Promise<AuthData | undefined> => {
    try {
      let authData = await authService.signIn(formData);
      if (authData?.error) {
        return undefined;
      }
      // change authData.user.id to authData.user._id
      authData.user._id = authData?.user?.id;
      setAuthData(authData);
      await AsyncStorage.setItem("@AuthData", JSON.stringify(authData));
      return authData;
    } catch (error) {
      console.error("Error signing in:", error);
      return undefined;
    }
  };

  const signInWithGoogle = async (googleUser: any): Promise<any> => {
    try {
      // console.log("entra signinwithgoogle")
      const authData = await authService.signInWithGoogle(
        JSON.parse(JSON.stringify(googleUser))
      );
      if (authData) {
        setAuthData(authData);
        await AsyncStorage.setItem("@AuthData", JSON.stringify(authData));
      } else {
        console.error("Error signing in with Google.");
      }
      return googleUser;
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const register = async (formData: any): Promise<AuthData | undefined> => {
    try {
      const authData = await authService.register(formData);
      if (authData) {
        setAuthData(authData);
        await AsyncStorage.setItem("@AuthData", JSON.stringify(authData));
      } else {
        console.error("Error registering user.");
      }
      return authData;
    } catch (error) {
      console.error("Error registering user:", error);
      return undefined;
    }
  };

const signOut = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem("@AuthData");
        await AsyncStorage.removeItem("@user");
        setAuthData(undefined);
    } catch (error) {
        console.error("Error signing out:", error);
    }
};

  return (
    <AuthContext.Provider
      value={{ authData, loading, signIn, register, signOut, signInWithGoogle }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthContext, AuthProvider, useAuth };
