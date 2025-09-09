import OnScreenKeyboard, { BACKSPACE, ENTER } from '@/components/OnScreenKeyboard';
import RulesModal from '@/components/RulesModal';
import SettingsModal from '@/components/SettingsModal';
import { Colors } from '@/constants/Colors';
import { allWords } from '@/utils/allWords';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  ZoomIn
} from 'react-native-reanimated';

const ROWS = 6; 

const COMBINATORICS_WORDS = [
  'FORMULA', 'PERMUTA', 'FACTORIAL', 'BINOMIO', 'GRAFOS', 'VERTEX', 
  'MATRICES', 'CONJUNTO', 'CARDINALIDAD', 'COMBINACION'
];

const Page = () => {
  const [word, setWord] = useState(COMBINATORICS_WORDS[Math.floor(Math.random() * COMBINATORICS_WORDS.length)]);
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme ?? 'light'].gameBg;
  const textColor = Colors[colorScheme ?? 'light'].text;
  const grayColor = Colors[colorScheme ?? 'light'].gray;

  const router = useRouter();

  console.log('🚀 ~ Combinatorics Game ~ word:', word);
  const wordLetters = word.split('');

  const [rows, setRows] = useState<string[][]>(new Array(ROWS).fill(new Array(5).fill('')));
  const [curRow, setCurRow] = useState(0);
  const [curCol, _setCurCol] = useState(0);
  
  const [targetBoard, setTargetBoard] = useState<string[]>(new Array(word.length).fill(''));
  const [foundLetters, setFoundLetters] = useState<Set<string>>(new Set());

  const [greenLetters, setGreenLetters] = useState<string[]>([]);
  const [yellowLetters, setYellowLetters] = useState<string[]>([]);
  const [grayLetters, setGrayLetters] = useState<string[]>([]);

  const settingsModalRef = useRef<BottomSheetModal>(null);

  const handlePresentSettingsModal = () => settingsModalRef.current?.present();

  const colStateRef = useRef(curCol);
  const setCurCol = (data: number) => {
    colStateRef.current = data;
    _setCurCol(data);
  };

  const rulesModalRef = useRef<BottomSheetModal>(null);

  const handlePresentRulesModal = () => rulesModalRef.current?.present();

  const offsetShakes = Array.from({ length: ROWS }, () => useSharedValue(0));
  
  const addKey = (key: string) => {
    const newRows = [...rows.map((row) => [...row])];

    if (key === 'ENTER') {
      checkWord();
    } else if (key === 'BACKSPACE') {
      if (colStateRef.current === 0) {
        newRows[curRow][0] = '';
        setRows(newRows);
        return;
      }

      newRows[curRow][colStateRef.current - 1] = '';
      setCurCol(colStateRef.current - 1);
      setRows(newRows);
      return;
    } else if (colStateRef.current >= newRows[curRow].length) {
    } else {
      newRows[curRow][colStateRef.current] = key.toUpperCase();
      setRows(newRows);
      setCurCol(colStateRef.current + 1);
    }
  };

  const checkWord = () => {
    const currentWord = rows[curRow].join('');

    if (currentWord.length < 5) {
      shakeRow();
      return;
    }

    if (!allWords.includes(currentWord.toLowerCase())) {
      console.log('NOT A WORD');
      shakeRow();
      return;
    }

    const newFoundLetters = new Set(foundLetters);
    const newTargetBoard = [...targetBoard];

    const newGreen: string[] = [];
    const newYellow: string[] = [];
    const newGray: string[] = [];

    currentWord.split('').forEach((letter, index) => {
      if (wordLetters.includes(letter)) {
        if (!foundLetters.has(letter)) {
          newFoundLetters.add(letter);
          wordLetters.forEach((targetLetter, targetIndex) => {
            if (targetLetter === letter && newTargetBoard[targetIndex] === '') {
              newTargetBoard[targetIndex] = letter;
            }
          });
        }
        
        if (index < wordLetters.length && wordLetters[index] === letter) {
          newGreen.push(letter);
        } else {
          newYellow.push(letter);
        }
      } else {
        newGray.push(letter);
      }
    });

    setFoundLetters(newFoundLetters);
    setTargetBoard(newTargetBoard);
    setGreenLetters([...greenLetters, ...newGreen]);
    setYellowLetters([...yellowLetters, ...newYellow]);
    setGrayLetters([...grayLetters, ...newGray]);

    setTimeout(() => {
      if (newTargetBoard.join('') === word) {
        console.log('🚀 ~ checkWord ~ WIN COMBINATORICS');
        router.push(`/end?win=true&word=${word}&gameField=${JSON.stringify(rows)}&mode=combinatorics`);
      } else if (curRow + 1 >= rows.length) {
        console.log('GAME OVER COMBINATORICS');
        router.push(`/end?win=false&word=${word}&gameField=${JSON.stringify(rows)}&mode=combinatorics`);
      }
    }, 500);

    setCurRow(curRow + 1);
    setCurCol(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: any) => {
      if (e.key === 'Enter') {
        addKey(ENTER);
      } else if (e.key === 'Backspace') {
        addKey(BACKSPACE);
      } else if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
        addKey(e.key.toUpperCase());
      }
    };

    if (Platform.OS === 'web') {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (Platform.OS === 'web') {
        document.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [curCol]);

  const shakeRow = () => {
    const TIME = 80;
    const OFFSET = 10;

    offsetShakes[curRow].value = withSequence(
      withTiming(-OFFSET, { duration: TIME / 2 }),
      withRepeat(withTiming(OFFSET, { duration: TIME }), 4, true),
      withTiming(0, { duration: TIME / 2 })
    );
  };

  const getAdaptiveSize = () => {
    if (word.length <= 6) return { 
      targetWidth: 40, targetHeight: 40, targetFont: 20,
      gameWidth: 50, gameHeight: 50, gameFont: 24 
    };
    if (word.length <= 8) return { 
      targetWidth: 35, targetHeight: 35, targetFont: 18,
      gameWidth: 45, gameHeight: 45, gameFont: 20 
    };
    if (word.length <= 10) return { 
      targetWidth: 30, targetHeight: 30, targetFont: 16,
      gameWidth: 40, gameHeight: 40, gameFont: 18 
    };
    return { 
      targetWidth: 25, targetHeight: 25, targetFont: 14,
      gameWidth: 35, gameHeight: 35, gameFont: 16 
    };
  };

  const sizes = getAdaptiveSize();

  const getRowStyle = (rowIndex: number) => {
    return useAnimatedStyle(() => ({
      transform: [{ translateX: offsetShakes[rowIndex].value }]
    }));
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <SettingsModal ref={settingsModalRef} />
      <RulesModal ref={rulesModalRef}/>
      <Stack.Screen
        options={{
          headerTitle: 'Wordle - Combinatoria',
          headerRight: () => (
            <View style={styles.headerIcons}>
              <TouchableOpacity onPress={handlePresentRulesModal}>
                <Ionicons name="help-circle-outline" size={28} color={textColor} />
              </TouchableOpacity>
              <Ionicons name="podium-outline" size={24} color={textColor} />
              <TouchableOpacity onPress={handlePresentSettingsModal}>
                <Ionicons name="settings-sharp" size={24} color={textColor} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <View style={styles.targetSection}>
        <Text style={[styles.targetTitle, { color: textColor }]}>
          Palabra de Combinatoria:
        </Text>
        <View style={[styles.targetBoard, word.length > 8 && { flexWrap: 'wrap', width: '90%' }]}>
          {targetBoard.map((letter, index) => (
            <View key={index} style={[
              styles.targetCell, 
              { 
                borderColor: grayColor,
                width: sizes.targetWidth,
                height: sizes.targetHeight,
                marginBottom: word.length > 8 ? 4 : 0
              }
            ]}>
              <Text style={[
                styles.targetCellText, 
                { 
                  color: textColor,
                  fontSize: sizes.targetFont
                }
              ]}>
                {letter}
              </Text>
            </View>
          ))}
        </View>
        <Text style={[styles.progressText, { color: textColor }]}>
          Progreso: {foundLetters.size}/{new Set(wordLetters).size} letras únicas encontradas
        </Text>
      </View>

      <View style={styles.gameField}>
        {rows.map((row, rowIndex) => (
          <Animated.View 
            style={[styles.gameFieldRow, getRowStyle(rowIndex)]} 
            key={`row-${rowIndex}`}
          >
            {row.map((cell, cellIndex) => {
            
              let cellBackgroundColor = 'transparent';
              let cellTextColor = textColor;
              
              if (rowIndex < curRow && cell !== '') {
                if (cellIndex < wordLetters.length && wordLetters[cellIndex] === cell) {
             
                  cellBackgroundColor = Colors.light.green;
                  cellTextColor = '#fff';
                } else if (wordLetters.includes(cell)) {
        
                  cellBackgroundColor = Colors.light.green;
                  cellTextColor = '#fff';
                } else {
         
                  cellBackgroundColor = grayColor;
                  cellTextColor = '#fff';
                }
              }

              return (
                <Animated.View
                  entering={ZoomIn.delay(50 * cellIndex)}
                  key={`cell-${rowIndex}-${cellIndex}`}
                  style={[
                    styles.cell,
                    { 
                      borderColor: grayColor,
                      width: sizes.gameWidth,
                      height: sizes.gameHeight,
                      backgroundColor: cellBackgroundColor
                    }
                  ]}>
                  <Text style={[
                    styles.cellText,
                    { 
                      fontSize: sizes.gameFont,
                      color: cellTextColor
                    }
                  ]}>
                    {cell}
                  </Text>
                </Animated.View>
              );
            })}
          </Animated.View>
        ))}
      </View>

      <OnScreenKeyboard
        onKeyPressed={addKey}
        greenLetters={greenLetters}
        yellowLetters={yellowLetters}
        grayLetters={grayLetters}
      />
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  targetSection: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  targetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'FrankRuhlLibre_800ExtraBold',
  },
  targetBoard: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
  },
  targetCell: {
    backgroundColor: '#fff',
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 4,
  },
  targetCellText: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  progressText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  gameField: {
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  gameFieldRow: {
    flexDirection: 'row',
    gap: 6,
  },
  cell: {
    backgroundColor: '#fff',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 4,
  },
  cellText: {
    fontSize: 24,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 10,
  },
});