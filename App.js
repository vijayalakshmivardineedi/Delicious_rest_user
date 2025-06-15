import React, { useEffect } from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function App() {
  useEffect(() => {
    const prepare = async () => {
      // Do any async tasks here like data loading
      await new Promise(resolve => setTimeout(resolve, 1000)); // simulate delay
      await SplashScreen.hideAsync(); // hide splash screen after loading
    };

    prepare();
  }, []);

  return <AppNavigator />;
}
