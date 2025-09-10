/* eslint-disable react/no-children-prop */
import SubscribeModal from '@/components/SubscribeModal';
import ThemedText from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { SignedIn, SignedOut, useAuth } from '@clerk/clerk-expo';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { format } from 'date-fns';
import { Link } from "expo-router";
import { useCallback, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, useColorScheme } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeInLeft } from 'react-native-reanimated';
import Icon from '../assets/images/wordle-icon.svg';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function Index() {
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme ?? 'light'].background;
  const textColor = Colors[colorScheme ?? 'light'].text;
  const subscribeModalRef = useRef<BottomSheetModal>(null);
  const handlePresentSubscribeModal = useCallback(() => {
    if (subscribeModalRef.current) {
      subscribeModalRef.current.present();
    } else {
      console.warn("Modal reference is null");
    }
  }, []);
  const { signOut } = useAuth(); 

  return (
    <View style={[styles.container, {backgroundColor}]}>
      <SubscribeModal ref={subscribeModalRef} children={undefined}>
          
      </SubscribeModal>

      <Animated.View style={styles.header} entering={FadeInDown}>
        <Icon width={100} height={70}/>
        <ThemedText style={styles.title}>Wordle</ThemedText>
        <ThemedText style={styles.text}>Consigue 6 oportunidades para adivinar una palabra de 5 letras.</ThemedText>
      </Animated.View>

      <View style={styles.menu}>
        <Link href={"/game"} style={[styles.btn,{backgroundColor: colorScheme === 'light' ? '#000' : '#4a4a4a' }]} asChild>
          <AnimatedTouchableOpacity entering={FadeInLeft}>
<<<<<<< HEAD
            <Text style={[styles.btnText, styles.primaryText]}>Jugar Clásico</Text>
          </AnimatedTouchableOpacity>
        </Link>

        <Link href={"/hard-game"} style={[styles.btn, {backgroundColor: Colors.light.red || '#ff4444' }]} asChild>
          <AnimatedTouchableOpacity entering={FadeInLeft.delay(50)}>
            <Text style={[styles.btnText, styles.primaryText]}>Modo Difícil</Text>
          </AnimatedTouchableOpacity>
        </Link>

        <Link href={"/combinatorics-game"} style={[styles.btn, {backgroundColor: Colors.light.green }]} asChild>
          <AnimatedTouchableOpacity entering={FadeInLeft.delay(100)}>
            <Text style={[styles.btnText, styles.primaryText]}>Modo Combinatoria</Text>
=======
            <Text style={[styles.btnText, styles.primaryText]}>Jugar</Text>
>>>>>>> 388641c9954ee525061999d3b1c2a69f406f489f
          </AnimatedTouchableOpacity>
        </Link>       

        <SignedOut>
          <Link href={'/login'} style={[styles.btn, {borderColor:textColor}]} asChild>
<<<<<<< HEAD
            <AnimatedTouchableOpacity entering={FadeInLeft.delay(150)}>
=======
            <AnimatedTouchableOpacity entering={FadeInLeft.delay(100)}>
>>>>>>> 388641c9954ee525061999d3b1c2a69f406f489f
              <ThemedText style={styles.btnText}>Iniciar Sesión</ThemedText>
            </AnimatedTouchableOpacity>  
          </Link> 
        </SignedOut>

        <SignedIn>
          <AnimatedTouchableOpacity entering={FadeInLeft.delay(200)}
              onPress={()=> signOut()}
              style={[styles.btn, {borderColor:textColor}]}
            >
              <ThemedText style={styles.btnText}>Cerrar Sesión</ThemedText>
          </AnimatedTouchableOpacity>
        </SignedIn>

<<<<<<< HEAD
        <AnimatedTouchableOpacity entering={FadeInLeft.delay(250)}
=======
        <AnimatedTouchableOpacity entering={FadeInLeft.delay(300)}
>>>>>>> 388641c9954ee525061999d3b1c2a69f406f489f
            onPress={handlePresentSubscribeModal}
            style={[styles.btn, {borderColor:textColor}]}
          >
            <ThemedText style={styles.btnText}>Suscribirse</ThemedText>
        </AnimatedTouchableOpacity>
      </View>

      <Animated.View style={styles.footer} entering={FadeIn.delay(300)}>
        <ThemedText style={styles.footerDate}>{format(new Date(), 'MMMM d, yyyy')}</ThemedText>
<<<<<<< HEAD
        <ThemedText style={styles.footerText}>Creador por Nicola y Jonathan</ThemedText>
=======
        <ThemedText style={styles.footerText}>Creador por Nick</ThemedText>
>>>>>>> 388641c9954ee525061999d3b1c2a69f406f489f
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent: 'center',
    paddingHorizontal: 50,
    gap: 40,
  },
  header:{
    alignItems: 'center',
    gap: 10
  },
  title:{
    fontSize:40,
    fontFamily: 'FrankRuhlLibre_800ExtraBold',
  },
  text:{
    fontSize:21,
    textAlign: 'center',
    fontFamily: 'FrankRuhlLibre_500Medium',
  },
  menu:{
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  btn:{
    justifyContent: 'center',
    borderRadius: 30,
    alignItems: 'center',
    borderColor: '#000',
    borderWidth: 1,
<<<<<<< HEAD
    width: '70%',
    maxWidth: 250,
=======
    width: '60%',
    maxWidth: 200,
>>>>>>> 388641c9954ee525061999d3b1c2a69f406f489f
  },
  btnText:{
    padding: 14,
    fontSize: 16,
    fontWeight: 'semibold',
    color: '#333',
  },
  primaryItem:{
    backgroundColor: '#000'
  },
  primaryText:{
    color: '#fff',
  },
  footer:{
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText:{
    fontSize: 14
  },
  footerDate:{
    fontSize: 14,
    fontWeight: 'bold',
  }
<<<<<<< HEAD
});
=======
})
>>>>>>> 388641c9954ee525061999d3b1c2a69f406f489f
