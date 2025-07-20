

import { useEffect, useState } from 'react';

import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments, useNavigationContainerRef } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { SafeAreaView } from 'react-native';
import { StatusBar  as ExpoStatusBar} from 'expo-status-bar';
import "./global.css";

SplashScreen.preventAutoHideAsync();

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const navigationRef = useNavigationContainerRef();
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  useEffect(() => {
    const unsubscribe = navigationRef?.addListener?.('state', () => {
      setIsNavigationReady(true);
    });


    const timer = setTimeout(() => {
      setIsNavigationReady(true);
    }, 300);

    return () => {
      unsubscribe?.();
      clearTimeout(timer);
    };
  }, [navigationRef]);

  useEffect(() => {

    if (loading || !isNavigationReady) return;
    const navigationTimeout = setTimeout(() => {
      const currentPath = segments.join('/');

      const publicRoutes = ['', 'index'];
      const authRoutes = ['(auth)', '(auth)/login', '(auth)/register', '(auth)/isidata', '(auth)/selection'];
      
      const isPublicRoute = publicRoutes.includes(currentPath);
      const isAuthRoute = authRoutes.some(route => currentPath.startsWith(route));


      if (!isAuthenticated) {
        if (!isPublicRoute && !isAuthRoute) {
          router.replace('/(auth)/login');
        }
      } 
    }, 50); 
    return () => clearTimeout(navigationTimeout);
  }, [isAuthenticated, loading, segments, router, isNavigationReady]);

  return <>{children}</>;
}

function RootLayoutNav() {
  const [loaded] = useFonts({
    'Poppins-LightItalic': require('../assets/fonts/Poppins-LightItalic.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Inter': require('../assets/fonts/Inter_18pt-Regular.ttf')
  });


  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthGuard>
      
      <Stack screenOptions={{ headerShown: false }}>
        
        
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="beranda" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
      </Stack>
    </AuthGuard>
  );
}

export default function RootLayout() {
  return (
    // <AuthProvider>
    //   <RootLayoutNav />
    // </AuthProvider>z
    <> 
      <ExpoStatusBar style='light' backgroundColor='#F99AB6CC"' />
      <SafeAreaView className='flex-1' >
            <AuthProvider>
                <RootLayoutNav />
         </AuthProvider>
      </SafeAreaView>

    </>
  );
}