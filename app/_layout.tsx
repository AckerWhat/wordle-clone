import Logo from '@/assets/images/nyt-logo.svg';
import { Colors } from '@/constants/Colors';
import { tokenCache } from '@/utils/cache';
import { storage } from '@/utils/storage';
import { ClerkLoaded, ClerkProvider } from '@clerk/clerk-expo';
import {
  FrankRuhlLibre_500Medium,
  FrankRuhlLibre_800ExtraBold,
  FrankRuhlLibre_900Black,
  useFonts,
} from '@expo-google-fonts/frank-ruhl-libre';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from "react";
import { Appearance, LogBox, TouchableOpacity, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useMMKVBoolean } from 'react-native-mmkv';

LogBox.ignoreAllLogs();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env'
  );
}

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [dark] = useMMKVBoolean('dark-mode', storage);

  useEffect(()=>{
    Appearance.setColorScheme(dark ? 'dark' : 'light');
  }, [dark]);

  let [fontsLoaded] = useFonts({
    FrankRuhlLibre_800ExtraBold,
    FrankRuhlLibre_500Medium,
    FrankRuhlLibre_900Black
  })

  useEffect(()=>{
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  },[fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <GestureHandlerRootView style={{flex:1}}>
            <BottomSheetModalProvider>
              <Stack>
                <Stack.Screen name='index' options={{ headerShown: false }} />
                <Stack.Screen name='login' options={{ 
                  presentation: 'modal',
                  headerShadowVisible: false,
                  headerTitle: () => <Logo width={150} height={40} />,
                  headerTitleAlign: 'center',
                  headerLeft: () => (
                    <TouchableOpacity onPress={()=> router.replace('/')}>
                      <Ionicons name="close" size={26} color={Colors.light.gray} />
                    </TouchableOpacity>
                  )
                 }} />
                 <Stack.Screen name='game' options={{ 
                      headerTitle: 'Wordle',
                      headerTitleAlign: 'left',
                      headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
                      headerTitleStyle:{
                        fontSize: 26,
                        fontFamily: 'FrankRuhlLibre_800ExtraBold'
                      }
                  }} />
                  <Stack.Screen name='hard-game' options={{ 
                      headerTitle: 'Wordle Difícil',
                      headerTitleAlign: 'left',
                      headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
                      headerTitleStyle:{
                        fontSize: 22,
                        fontFamily: 'FrankRuhlLibre_800ExtraBold'
                      }
                  }} />
                  <Stack.Screen name='combinatorics-game' options={{ 
                      headerTitle: 'Wordle - Combinatoria',
                      headerTitleAlign: 'left',
                      headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
                      headerTitleStyle:{
                        fontSize: 22,
                        fontFamily: 'FrankRuhlLibre_800ExtraBold'
                      }
                  }} />     
                  <Stack.Screen name='end' options={{ 
                      presentation: 'fullScreenModal',
                      title: '',
                      headerShadowVisible: false,
                      headerBackVisible: false,
                  }} /> 
              </Stack>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </ThemeProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}