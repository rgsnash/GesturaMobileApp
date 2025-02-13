import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';

import "./global.css";

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    'Oswald-Bold': require('../assets/fonts/Oswald-Bold.ttf'),
    'Oswald-ExtraLight': require('../assets/fonts/Oswald-ExtraLight.ttf'),
    'Oswald-Light': require('../assets/fonts/Oswald-Light.ttf'),
    'Oswald-Medium': require('../assets/fonts/Oswald-Medium.ttf'),
    'Oswald-Regular': require('../assets/fonts/Oswald-Regular.ttf'),
    'Oswald-SemiBold': require('../assets/fonts/Oswald-SemiBold.ttf'),
    'Montserrat-ExtraBold': require('../assets/fonts/Montserrat-ExtraBold.ttf')
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
};

export default RootLayout;
