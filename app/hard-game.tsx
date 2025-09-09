import OnScreenKeyboard, { BACKSPACE, ENTER } from '@/components/OnScreenKeyboard';
import RulesModal from '@/components/RulesModal';
import SettingsModal from '@/components/SettingsModal';
import { Colors } from '@/constants/Colors';
import { hardWords } from '@/utils/hardWords';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  ZoomIn,
} from 'react-native-reanimated';

const Page = () => {

  const getHardGameConfig = () => {
    const selectedWord = hardWords[Math.floor(Math.random() * hardWords.length)];
    const randomAttempts = Math.floor(Math.random() * 5) + 3; // 3-7 intentos
    return {
      word: selectedWord.toUpperCase(),
      rows: randomAttempts,
      wordLength: selectedWord.length
    };
  };

  const [gameConfig] = useState(getHardGameConfig());
  const { word, rows: ROWS, wordLength } = gameConfig;

  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme ?? 'light'].gameBg;
  const textColor = Colors[colorScheme ?? 'light'].text;
  const grayColor = Colors[colorScheme ?? 'light'].gray;

  const router = useRouter();

  console.log('🚀 ~ Hard Mode ~ word:', word, 'attempts:', ROWS, 'length:', wordLength);
  const wordLetters = word.split('');

  const [rows, setRows] = useState<string[][]>(
    new Array(ROWS).fill(new Array(wordLength).fill(''))
  );
  const [curRow, setCurRow] = useState(0);
  const [curCol, _setCurCol] = useState(0);

  const [greenLetters, setGreenLetters] = useState<string[]>([]);
  const [yellowLetters, setYellowLetters] = useState<string[]>([]);
  const [grayLetters, setGrayLetters] = useState<string[]>([]);

  const settingsModalRef = useRef<BottomSheetModal>(null);
  const rulesModalRef = useRef<BottomSheetModal>(null);

  const handlePresentSettingsModal = () => settingsModalRef.current?.present();
  const handlePresentRulesModal = () => rulesModalRef.current?.present();

  const colStateRef = useRef(curCol);
  const setCurCol = (data: number) => {
    colStateRef.current = data;
    _setCurCol(data);
  };

  const offsetShakes = Array.from({ length: ROWS }, () => useSharedValue(0));
  const tileRotates = Array.from({ length: ROWS }, () => 
    Array.from({ length: wordLength }, () => useSharedValue(0))
  );
  const cellBackgrounds = Array.from({ length: ROWS }, () => 
    Array.from({ length: wordLength }, () => useSharedValue('transparent'))
  );
  const cellBorders = Array.from({ length: ROWS }, () => 
    Array.from({ length: wordLength }, () => useSharedValue(Colors.light.gray))
  );

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

    if (currentWord.length < word.length) {
      shakeRow();
      return;
    }

    if (!hardWords.map(w => w.toUpperCase()).includes(currentWord)) {
      console.log('NOT A HARD WORD');
      shakeRow();
      return;
    }
    flipRow();

    const newGreen: string[] = [];
    const newYellow: string[] = [];
    const newGray: string[] = [];

    currentWord.split('').forEach((letter, index) => {
      if (letter === wordLetters[index]) {
        newGreen.push(letter);
      } else if (wordLetters.includes(letter)) {
        newYellow.push(letter);
      } else {
        newGray.push(letter);
      }
    });

    setGreenLetters([...greenLetters, ...newGreen]);
    setYellowLetters([...yellowLetters, ...newYellow]);
    setGrayLetters([...grayLetters, ...newGray]);

    setTimeout(() => {
      if (currentWord === word) {
        console.log('🚀 ~ checkWord ~ WIN HARD MODE');
        router.push(`/end?win=true&word=${word}&gameField=${JSON.stringify(rows)}&mode=hard`);
      } else if (curRow + 1 >= rows.length) {
        console.log('GAME OVER HARD MODE');
        router.push(`/end?win=false&word=${word}&gameField=${JSON.stringify(rows)}&mode=hard`);
      }
    }, 1500);
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

  const setCellColor = (cell: string, rowIndex: number, cellIndex: number) => {
    if (curRow >= rowIndex) {
      if (wordLetters[cellIndex] === cell) {
        cellBackgrounds[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(Colors.light.green)
        );
      } else if (wordLetters.includes(cell)) {
        cellBackgrounds[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(Colors.light.yellow)
        );
      } else {
        cellBackgrounds[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(grayColor)
        );
      }
    } else {
      cellBackgrounds[rowIndex][cellIndex].value = withTiming('transparent', { duration: 100 });
    }
  };

  const setBorderColor = (cell: string, rowIndex: number, cellIndex: number) => {
    if (curRow > rowIndex && cell !== '') {
      if (wordLetters[cellIndex] === cell) {
        cellBorders[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(Colors.light.green)
        );
      } else if (wordLetters.includes(cell)) {
        cellBorders[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(Colors.light.yellow)
        );
      } else {
        cellBorders[rowIndex][cellIndex].value = withDelay(cellIndex * 200, withTiming(grayColor));
      }
    }
    return Colors.light.gray;
  };

  const shakeRow = () => {
    const TIME = 80;
    const OFFSET = 10;

    offsetShakes[curRow].value = withSequence(
      withTiming(-OFFSET, { duration: TIME / 2 }),
      withRepeat(withTiming(OFFSET, { duration: TIME }), 4, true),
      withTiming(0, { duration: TIME / 2 })
    );
  };

  const flipRow = () => {
    const TIME = 300;
    const OFFSET = 90;

    tileRotates[curRow].forEach((value, index) => {
      value.value = withDelay(
        index * 100,
        withSequence(
          withTiming(OFFSET, { duration: TIME }),
          withTiming(0, { duration: TIME })
        )
      );
    });
  };

  useEffect(() => {
    if (curRow === 0) return;

    rows[curRow - 1].map((cell, cellIndex) => {
      setCellColor(cell, curRow - 1, cellIndex);
      setBorderColor(cell, curRow - 1, cellIndex);
    });
  }, [curRow]);

  const getTileStyle = (rowIndex: number, cellIndex: number) => {
    return useAnimatedStyle(() => ({
      transform: [{ rotateX: `${tileRotates[rowIndex][cellIndex].value}deg` }],
      borderColor: cellBorders[rowIndex][cellIndex].value,
      backgroundColor: cellBackgrounds[rowIndex][cellIndex].value
    }));
  };

  const getRowStyle = (rowIndex: number) => {
    return useAnimatedStyle(() => ({
      transform: [{ translateX: offsetShakes[rowIndex].value }]
    }));
  };

  const getCellSize = () => {
    if (wordLength <= 6) return { width: 50, height: 50, fontSize: 24 };
    if (wordLength <= 8) return { width: 40, height: 40, fontSize: 20 };
    return { width: 35, height: 35, fontSize: 18 };
  };

  const cellSize = getCellSize();

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <SettingsModal ref={settingsModalRef} />
      <RulesModal ref={rulesModalRef} />
      <Stack.Screen
        options={{
          headerTitle: `Wordle Difícil (${ROWS} intentos)`,
          headerTitleAlign: 'left',
          headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
          headerTitleStyle: {
            fontSize: 20,
            fontFamily: 'FrankRuhlLibre_800ExtraBold'
          },
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
      <View style={styles.gameField}>
        {rows.map((row, rowIndex) => (
          <Animated.View 
            style={[styles.gameFieldRow, getRowStyle(rowIndex)]} 
            key={`row-${rowIndex}`}
          >
            {row.map((cell, cellIndex) => (
              <Animated.View
                entering={ZoomIn.delay(50 * cellIndex)}
                key={`cell-${rowIndex}-${cellIndex}`}>
                <Animated.View
                  style={[
                    styles.cell,
                    { width: cellSize.width, height: cellSize.height },
                    getTileStyle(rowIndex, cellIndex),
                  ]}>
                  <Animated.Text
                    style={[
                      styles.cellText,
                      { fontSize: cellSize.fontSize },
                      {
                        color: curRow > rowIndex ? '#fff' : textColor,
                      },
                    ]}>
                    {cell}
                  </Animated.Text>
                </Animated.View>
              </Animated.View>
            ))}
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
    paddingVertical: 40,
  },
  gameField: {
    alignItems: 'center',
    gap: 6,
  },
  gameFieldRow: {
    flexDirection: 'row',
    gap: 4,
  },
  cell: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  cellText: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 10,
  },
});