import Icon from '@/assets/images/wordle-icon.svg';
import CombinatoricsModal from '@/components/CombinatoricsModal';
import { Colors } from '@/constants/Colors';
import { FIREBASE_DB } from '@/utils/FirebaseCongig';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import * as MailComposer from 'expo-mail-composer';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Page = () => {
    const { win, word, gameField } = useLocalSearchParams<{
        win: string;
        word: string;
        gameField?: string;
    }>();

    const router = useRouter();
    const [userScore, setUserScore] = useState<any>();
    const [showStats, setShowStats] = useState(win === 'true');
    const { user } = useUser();
    const combinatoricsModalRef = useRef<BottomSheetModal>(null);

    useEffect(() => {
      if (user && win === 'true') {
        updateHighscore();
      } else if (win === 'false') {
        setTimeout(() => {
          combinatoricsModalRef.current?.present();
        }, 500);
      }
    }, [user, win]);

    const updateHighscore = async () => {
      if (!user) return;

      const docRef = doc(FIREBASE_DB, `highscore/${user.id}`);
      const docSnap = await getDoc(docRef);
      
      let newScore = {
        played: 1,
        wins: win === 'true' ? 1 : 0,
        lastGame: win === 'true' ? 'win' : 'loss',
        currentStreak: win === 'true' ? 1 : 0,
      }

      if (docSnap.exists()) {
        const data = docSnap.data();

        newScore = {
          played: data.played + 1,
          wins: win === 'true' ? data.wins + 1 : data.wins,
          lastGame: win === 'true' ? 'win' : 'loss',
          currentStreak: win === 'true' && data.lastGame === 'win' ? data.currentStreak + 1 : win === 'true' ? 1 : 0,
        }
      }

      await setDoc(docRef, newScore);
      setUserScore(newScore);
    };

    const handleCorrectAnswer = () => {
      if (user) {
        setShowStats(true);
        updateHighscore();
      } else {
        setShowStats(false);
      }
    };

    const handleWrongAnswer = () => {
      setTimeout(() => {
        router.dismissAll();
        router.replace('/');
      }, 1000);
    };

    const shareGame = () => {
      const game = JSON.parse(gameField!);
      const imageText: string[][] = [];

      const wordLetters = word.split('');
      game.forEach((row: string[], rowIndex: number) => {
        imageText.push([]);
        row.forEach((letter, colIndex) => {
          if (wordLetters[colIndex] === letter) {
            imageText[rowIndex].push('🟩');
          } else if (wordLetters.includes(letter)) {
            imageText[rowIndex].push('🟨');
          } else {
            imageText[rowIndex].push('⬜');
          }
        });
      });

      const simpleHtml = `
        <html>
          <body>
            <h1>Wordle</h1>
            ${imageText
              .map(row => row.join('') + '<br>')
              .join('')}
          </body>
        </html>
      `;
      
      MailComposer.composeAsync({
        subject: `¡Acabo de jugar a Wordle!`,
        body: simpleHtml,
        isHtml: true,
      });
    };

    const navigateRoot = () => {
        router.dismissAll();
        router.replace('/');
    };

  return (
    <View style={styles.container}>
      <CombinatoricsModal 
        ref={combinatoricsModalRef}
        onCorrectAnswer={handleCorrectAnswer}
        onWrongAnswer={handleWrongAnswer}
        isUserLoggedIn={!!user}
<<<<<<< HEAD
      >
        <></>
      </CombinatoricsModal>
=======
      />
>>>>>>> 388641c9954ee525061999d3b1c2a69f406f489f

      <TouchableOpacity onPress={navigateRoot} style={{
        alignSelf: 'flex-end',
      }}>
        <Ionicons name='close' size={30} color={Colors.light.gray}/>
      </TouchableOpacity>

      <View style={styles.header}>
        {win === 'true' ? (
            <Image source={require('@/assets/images/win.png')}/>
        ) : (
            <Icon width={100} height={70}/>
        )}

        <Text style={styles.title}>
          {win === 'true' ? 'Felicidades!' : showStats ? 'Bien hecho!' : 'Gracias por jugar hoy!'}
        </Text>

        {win === 'false' && !showStats && (
          <Text style={styles.text}>La palabra era: &quot;{word.toUpperCase()}&quot;</Text>
        )}

        <SignedOut>
            {showStats ? (
              <>
                <Text style={styles.text}>¡Respuesta correcta!</Text>
                <Text style={styles.text}>¿Quieres ver tus estadísticas y tu progreso?</Text>

                <Link href={'/login'} style={styles.btn} asChild>
                    <TouchableOpacity>
                        <Text style={styles.btnText}>Crea una cuenta gratuita</Text>
                    </TouchableOpacity>
                </Link>

                <Link href={'/login'} asChild>
                    <TouchableOpacity>
                        <Text style={styles.textLink}>¿Ya estás registrado? Iniciar sesión</Text>
                    </TouchableOpacity>
                </Link>
              </>
            ) : (
              <>
                <Text style={styles.text}>¿Quieres ver tus estadísticas y tu progreso?</Text>

                <Link href={'/login'} style={styles.btn} asChild>
                    <TouchableOpacity>
                        <Text style={styles.btnText}>Crea una cuenta gratuita</Text>
                    </TouchableOpacity>
                </Link>

                <Link href={'/login'} asChild>
                    <TouchableOpacity>
                        <Text style={styles.textLink}>¿Ya estás registrado? Iniciar sesión</Text>
                    </TouchableOpacity>
                </Link>
              </>
            )}
        </SignedOut>

        <SignedIn>
          {showStats && (
            <>
              <Text style={styles.text}>Estadísticas</Text>
              <View style={styles.stats}>
                <View>
                  <Text style={styles.score}>{userScore?.played}</Text>
                  <Text>Jugado</Text>
                </View>
                <View>
                  <Text style={styles.score}>{userScore?.wins}</Text>
                  <Text>Victorias</Text>
                </View>
                <View>
                  <Text style={styles.score}>{userScore?.currentStreak}</Text>
                  <Text>Racha Actual</Text>
                </View>
              </View>
            </>
          )}
        </SignedIn>

        {showStats && (
          <>
            <View
              style={{
                height: StyleSheet.hairlineWidth,
                width: '100%',
                backgroundColor: '#4e4e4e',
              }}
            />

            <TouchableOpacity onPress={shareGame} style={styles.iconBtn}>
              <Text style={styles.btnText}>Compartir</Text>
              <Ionicons name='share-social' size={24} color={'#fff'}/>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  )
}

export default Page

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 40,
    },
    header: {
        alignItems: 'center',
        gap: 10,
    },
    title: {
        fontSize: 38,
        fontFamily: 'FrankRuhlLibre_800ExtraBold',
        textAlign: 'center',
    },
    text: {
        fontSize: 26,
        textAlign: 'center',
        fontFamily: 'FrankRuhlLibre_500Medium',
    },
    btn: {
        justifyContent: 'center',
        borderRadius: 30,
        alignItems: 'center',
        borderColor: '#000',
        borderWidth: 1,
        width: '100%',
        backgroundColor: '#000',
    },
    btnText: {
        padding: 14,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    textLink: {
        textDecorationLine: 'underline',
        fontSize: 16,
        paddingVertical: 15,
    },
    iconBtn: {
        marginVertical: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.light.green,
        borderRadius: 30,
        width: '70%',
    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
        gap: 10,
    },
    score: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
    },
})