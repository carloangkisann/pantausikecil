// import React, { useState, useEffect } from 'react';
// import { View, Text, Image, StatusBar, Dimensions } from 'react-native';
// import * as SplashScreen from 'expo-splash-screen';
// import { LinearGradient } from 'expo-linear-gradient';
// import { Stack } from 'expo-router';
// import "./global.css";

// const { height } = Dimensions.get('window');

// SplashScreen.preventAutoHideAsync();

// export default function RootLayout() {
//   const [isLoading, setIsLoading] = useState(true);
//   const [progress, setProgress] = useState(0);

//   useEffect(() => {
//     loadApp();
//   }, []);

//   const loadApp = async () => {
//     // simulasi
//     for (let i = 0; i <= 100; i += 10) {
//       setProgress(i / 20);
//       await new Promise(resolve => setTimeout(resolve, 300));
//     }
    
//     setIsLoading(false);
//     SplashScreen.hideAsync();
//   };

//   if (isLoading) {
//     return (
//       <>
//         <StatusBar barStyle="light-content" backgroundColor="#F9C5D5" />
//         <LinearGradient
//           colors={['#F9C5D5', '#F99AB6']}
//           start={{ x: 0.5, y: 0 }}
//           end={{ x: 0.5, y: 1 }}
//           className="flex-1 justify-center items-center px-5"
//         >
//           <View 
//             className="absolute items-center"
//             style={{ top: height * 0.25 }}
//           >
//             <Image 
//               source={require('../assets/images/pantausikecil.png')} 
//               className="w-60 h-60 mb-2.5"
//               resizeMode="contain"
//             />
//             <Text className="text-white text-2xl font-bold text-center">
//               PANTAUSIKECIL 
//             </Text>
//           </View>
          
//           <View 
//             className="absolute w-48 h-3 bg-white/30 rounded-md overflow-hidden"
//             style={{ bottom: height * 0.34 }}
//           >
//             <View 
//               className="h-full bg-pink-400 rounded-sm"
//               style={{ width: `${progress * 100}%` }}
//             />
//           </View>
//         </LinearGradient>
//       </>
//     );
//   }

//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="(tabs)" />
//     </Stack>
//   );
// }



import React, { useState, useEffect } from 'react';
import { View, Text, Image, StatusBar, Dimensions } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import "./global.css";

const { height } = Dimensions.get('window');

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Load fonts
  const [loaded] = useFonts({
    'Poppins-LightItalic': require('../assets/fonts/Poppins-LightItalic.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Inter' : require('../assets/fonts/Inter_18pt-Regular.ttf')
  });

  // Hide splash screen when fonts are loaded
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Don't render anything until fonts are loaded
  if (!loaded) {
    return null;
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#000"  className='font-poppins-medium'/>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index"  />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="beranda" />
        <Stack.Screen name="profile" />

      </Stack>
    </>
  );
}