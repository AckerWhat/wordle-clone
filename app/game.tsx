import OnScreenKeyboard, { BACKSPACE, ENTER } from '@/components/OnScreenKeyboard';
import SettingsModal from '@/components/SettingsModal';
import { Colors } from '@/constants/Colors';
import { allWords } from '@/utils/allWords';
import { words } from '@/utils/targetWords';
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

const ROWS = 6;

const Page = () => {
  const [word, setWord] = useState(words[Math.floor(Math.random() * words.length)]);
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme ?? 'light'].gameBg;
  const textColor = Colors[colorScheme ?? 'light'].text;
  const grayColor = Colors[colorScheme ?? 'light'].gray;

  const router = useRouter();

  console.log('🚀 ~ Page ~ word:', word);
  const wordLetters = word.split('');

  const [rows, setRows] = useState<string[][]>(new Array(ROWS).fill(new Array(5).fill('')));
  const [curRow, setCurRow] = useState(0);
  const [curCol, _setCurCol] = useState(0);

  const [greenLetters, setGreenLetters] = useState<string[]>([]);
  const [yellowLetters, setYellowLetters] = useState<string[]>([]);
  const [grayLetters, setGrayLetters] = useState<string[]>([]);

  const settingsModalRef = useRef<BottomSheetModal>(null);

  const handlePresentSubscribeModalPress = () => settingsModalRef.current?.present();

  const colStateRef = useRef(curCol);
  const setCurCol = (data: number) => {
    colStateRef.current = data;
    _setCurCol(data);
  };

  // Create all shared values individually
  const offsetShake0 = useSharedValue(0);
  const offsetShake1 = useSharedValue(0);
  const offsetShake2 = useSharedValue(0);
  const offsetShake3 = useSharedValue(0);
  const offsetShake4 = useSharedValue(0);
  const offsetShake5 = useSharedValue(0);
  
  const offsetShakes = [offsetShake0, offsetShake1, offsetShake2, offsetShake3, offsetShake4, offsetShake5];

  // Create tile rotates for each row
  const tileRotate00 = useSharedValue(0); const tileRotate01 = useSharedValue(0); const tileRotate02 = useSharedValue(0); const tileRotate03 = useSharedValue(0); const tileRotate04 = useSharedValue(0);
  const tileRotate10 = useSharedValue(0); const tileRotate11 = useSharedValue(0); const tileRotate12 = useSharedValue(0); const tileRotate13 = useSharedValue(0); const tileRotate14 = useSharedValue(0);
  const tileRotate20 = useSharedValue(0); const tileRotate21 = useSharedValue(0); const tileRotate22 = useSharedValue(0); const tileRotate23 = useSharedValue(0); const tileRotate24 = useSharedValue(0);
  const tileRotate30 = useSharedValue(0); const tileRotate31 = useSharedValue(0); const tileRotate32 = useSharedValue(0); const tileRotate33 = useSharedValue(0); const tileRotate34 = useSharedValue(0);
  const tileRotate40 = useSharedValue(0); const tileRotate41 = useSharedValue(0); const tileRotate42 = useSharedValue(0); const tileRotate43 = useSharedValue(0); const tileRotate44 = useSharedValue(0);
  const tileRotate50 = useSharedValue(0); const tileRotate51 = useSharedValue(0); const tileRotate52 = useSharedValue(0); const tileRotate53 = useSharedValue(0); const tileRotate54 = useSharedValue(0);
  
  const tileRotates = [
    [tileRotate00, tileRotate01, tileRotate02, tileRotate03, tileRotate04],
    [tileRotate10, tileRotate11, tileRotate12, tileRotate13, tileRotate14],
    [tileRotate20, tileRotate21, tileRotate22, tileRotate23, tileRotate24],
    [tileRotate30, tileRotate31, tileRotate32, tileRotate33, tileRotate34],
    [tileRotate40, tileRotate41, tileRotate42, tileRotate43, tileRotate44],
    [tileRotate50, tileRotate51, tileRotate52, tileRotate53, tileRotate54]
  ];

  const cellBg00 = useSharedValue('transparent'); const cellBg01 = useSharedValue('transparent'); const cellBg02 = useSharedValue('transparent'); const cellBg03 = useSharedValue('transparent'); const cellBg04 = useSharedValue('transparent');
  const cellBg10 = useSharedValue('transparent'); const cellBg11 = useSharedValue('transparent'); const cellBg12 = useSharedValue('transparent'); const cellBg13 = useSharedValue('transparent'); const cellBg14 = useSharedValue('transparent');
  const cellBg20 = useSharedValue('transparent'); const cellBg21 = useSharedValue('transparent'); const cellBg22 = useSharedValue('transparent'); const cellBg23 = useSharedValue('transparent'); const cellBg24 = useSharedValue('transparent');
  const cellBg30 = useSharedValue('transparent'); const cellBg31 = useSharedValue('transparent'); const cellBg32 = useSharedValue('transparent'); const cellBg33 = useSharedValue('transparent'); const cellBg34 = useSharedValue('transparent');
  const cellBg40 = useSharedValue('transparent'); const cellBg41 = useSharedValue('transparent'); const cellBg42 = useSharedValue('transparent'); const cellBg43 = useSharedValue('transparent'); const cellBg44 = useSharedValue('transparent');
  const cellBg50 = useSharedValue('transparent'); const cellBg51 = useSharedValue('transparent'); const cellBg52 = useSharedValue('transparent'); const cellBg53 = useSharedValue('transparent'); const cellBg54 = useSharedValue('transparent');
  
  const cellBackgrounds = [
    [cellBg00, cellBg01, cellBg02, cellBg03, cellBg04],
    [cellBg10, cellBg11, cellBg12, cellBg13, cellBg14],
    [cellBg20, cellBg21, cellBg22, cellBg23, cellBg24],
    [cellBg30, cellBg31, cellBg32, cellBg33, cellBg34],
    [cellBg40, cellBg41, cellBg42, cellBg43, cellBg44],
    [cellBg50, cellBg51, cellBg52, cellBg53, cellBg54]
  ];

  const cellBorder00 = useSharedValue(Colors.light.gray); const cellBorder01 = useSharedValue(Colors.light.gray); const cellBorder02 = useSharedValue(Colors.light.gray); const cellBorder03 = useSharedValue(Colors.light.gray); const cellBorder04 = useSharedValue(Colors.light.gray);
  const cellBorder10 = useSharedValue(Colors.light.gray); const cellBorder11 = useSharedValue(Colors.light.gray); const cellBorder12 = useSharedValue(Colors.light.gray); const cellBorder13 = useSharedValue(Colors.light.gray); const cellBorder14 = useSharedValue(Colors.light.gray);
  const cellBorder20 = useSharedValue(Colors.light.gray); const cellBorder21 = useSharedValue(Colors.light.gray); const cellBorder22 = useSharedValue(Colors.light.gray); const cellBorder23 = useSharedValue(Colors.light.gray); const cellBorder24 = useSharedValue(Colors.light.gray);
  const cellBorder30 = useSharedValue(Colors.light.gray); const cellBorder31 = useSharedValue(Colors.light.gray); const cellBorder32 = useSharedValue(Colors.light.gray); const cellBorder33 = useSharedValue(Colors.light.gray); const cellBorder34 = useSharedValue(Colors.light.gray);
  const cellBorder40 = useSharedValue(Colors.light.gray); const cellBorder41 = useSharedValue(Colors.light.gray); const cellBorder42 = useSharedValue(Colors.light.gray); const cellBorder43 = useSharedValue(Colors.light.gray); const cellBorder44 = useSharedValue(Colors.light.gray);
  const cellBorder50 = useSharedValue(Colors.light.gray); const cellBorder51 = useSharedValue(Colors.light.gray); const cellBorder52 = useSharedValue(Colors.light.gray); const cellBorder53 = useSharedValue(Colors.light.gray); const cellBorder54 = useSharedValue(Colors.light.gray);
  
  const cellBorders = [
    [cellBorder00, cellBorder01, cellBorder02, cellBorder03, cellBorder04],
    [cellBorder10, cellBorder11, cellBorder12, cellBorder13, cellBorder14],
    [cellBorder20, cellBorder21, cellBorder22, cellBorder23, cellBorder24],
    [cellBorder30, cellBorder31, cellBorder32, cellBorder33, cellBorder34],
    [cellBorder40, cellBorder41, cellBorder42, cellBorder43, cellBorder44],
    [cellBorder50, cellBorder51, cellBorder52, cellBorder53, cellBorder54]
  ];

  const rowStyle0 = useAnimatedStyle(() => ({ transform: [{ translateX: offsetShake0.value }] }));
  const rowStyle1 = useAnimatedStyle(() => ({ transform: [{ translateX: offsetShake1.value }] }));
  const rowStyle2 = useAnimatedStyle(() => ({ transform: [{ translateX: offsetShake2.value }] }));
  const rowStyle3 = useAnimatedStyle(() => ({ transform: [{ translateX: offsetShake3.value }] }));
  const rowStyle4 = useAnimatedStyle(() => ({ transform: [{ translateX: offsetShake4.value }] }));
  const rowStyle5 = useAnimatedStyle(() => ({ transform: [{ translateX: offsetShake5.value }] }));
  
  const rowStyles = [rowStyle0, rowStyle1, rowStyle2, rowStyle3, rowStyle4, rowStyle5];

  const tileStyle00 = useAnimatedStyle(() => ({ transform: [{ rotateX: `${tileRotate00.value}deg` }], borderColor: cellBorder00.value, backgroundColor: cellBg00.value }));
  const tileStyle01 = useAnimatedStyle(() => ({ transform: [{ rotateX: `${tileRotate01.value}deg` }], borderColor: cellBorder01.value, backgroundColor: cellBg01.value }));
  const tileStyle02 = useAnimatedStyle(() => ({ transform: [{ rotateX: `${tileRotate02.value}deg` }], borderColor: cellBorder02.value, backgroundColor: cellBg02.value }));
  const tileStyle03 = useAnimatedStyle(() => ({ transform: [{ rotateX: `${tileRotate03.value}deg` }], borderColor: cellBorder03.value, backgroundColor: cellBg03.value }));
  const tileStyle04 = useAnimatedStyle(() => ({ transform: [{ rotateX: `${tileRotate04.value}deg` }], borderColor: cellBorder04.value, backgroundColor: cellBg04.value }));
  const tileStyle10 = useAnimatedStyle(() => ({ transform: [{ rotateX: `${tileRotate10.value}deg` }], borderColor: cellBorder10.value, backgroundColor: cellBg10.value }));
  const tileStyle11 = useAnimatedStyle(() => ({ transform: [{ rotateX: `${tileRotate11.value}deg` }], borderColor: cellBorder11.value, backgroundColor: cellBg11.value }));
  const tileStyle12 = useAnimatedStyle(() => ({ transform: [{ rotateX: `${tileRotate12.value}deg` }], borderColor: cellBorder12.value, backgroundColor: cellBg12.value }));
  const tileStyle13 = useAnimatedStyle(() => ({ transform: [{ rotateX: `${tileRotate13.value}deg` }], borderColor: cellBorder13.value, backgroundColor: cellBg13.value }));
  const tileStyle14 = useAnimatedStyle(() => ({ transform: [{ rotateX: `${tileRotate14.value}deg` }], borderColor: cellBorder14.value, backgroundColor: cellBg14.value }));
  const tileStyle20 = useAnimatedStyle(() => ({ transform: [{ rotateX: `${tileRotate20.value}deg` }], borderColor: cellBorder20.value, backgroundColor: cellBg20.value }));
  const tileStyle21 = useAnimatedStyle(() => ({ transform: [{ rotateX: `${tileRotate21.value}deg` }], borderColor: cellBorder21.value, backgroundColor: cellBg21.value }));
  const tileStyle22 = useAnimatedStyle(() => ({ transform: [{ rotateX: `${tileRotate22.value}deg` }], borderColor: cellBorder22.value, backgroundColor: cellBg22.value }));
  const tileStyle23 = useAnimatedStyle(() => ({ transform: [{ rotateX: `${tileRotate23.value}deg` }], borderColor: cellBorder23.value, backgroundColor: cellBg23.value }));
  const tileStyle24 = useAnimatedStyle(() => ({ transform: [{ rotateX: `${tileRotate24.value}deg` }], borderColor: cellBorder24.value, backgroundColor: cellBg24.value }));
  const tileStyle30 = useAnimatedStyle(() => ({ transform: [{ rotateX: `${tileRotate30.value}deg` }], borderColor: cellBorder30.value, backgroundColor: cellBg30.value }));
  const tileStyle31 = useAnimatedStyle(() => ({ transform: [{ rotateX: `${tileRotate31.value}deg` }], borderColor: cellBorder31.value, backgroundColor: cellBg31.value }));
  const tileStyle32 = useAnimatedStyle(() => ({ transform: [{ rotateX: `${tileRotate32.value}deg` }], borderColor: cellBorder32.value, backgroundColor: cellBg32.value }));
  const tileStyle33 = useAnimatedStyle(() => ({ transform: [{ rotateX: `${tileRotate33.value}deg` }], borderColor: cellBorder33.value, backgroundColor: cellBg33.value }));
  const tileStyle34 = useAnimatedStyle(() => ({ transform: [{ rotateX: `${tileRotate34.value}deg` }], borderColor: cellBorder34.value, backgroundColor: cellBg34.value }));
  const tileStyle40 = useAnimatedStyle(() => ({ transform: [{ rotateX: `${tileRotate40.value}deg` }], borderColor: cellBorder40.value, backgroundColor: cellBg40.value }));
  const tileStyle41 = useAnimatedStyle(() => ({ transform: [{ rotateX: `${tileRotate41.value}deg` }], borderColor: cellBorder41.value, backgroundColor: cellBg41.value }));
  const tileStyle42 = useAnimatedStyle(() => ({ transform: [{ rotateX: `${tileRotate42.value}deg` }], borderColor: cellBorder42.value, backgroundColor: cellBg42.value }));
  const tileStyle43 = useAnimatedStyle(() => ({ transform: [{ rotateX: `${tileRotate43.value}deg` }], borderColor: cellBorder43.value, backgroundColor: cellBg43.value }));
  const tileStyle44 = useAnimatedStyle(() => ({ transform: [{ rotateX: `${tileRotate44.value}deg` }], borderColor: cellBorder44.value, backgroundColor: cellBg44.value }));
  const tileStyle50 = useAnimatedStyle(() => ({ transform: [{ rotateX: `${tileRotate50.value}deg` }], borderColor: cellBorder50.value, backgroundColor: cellBg50.value }));
  const tileStyle51 = useAnimatedStyle(() => ({ transform: [{ rotateX: `${tileRotate51.value}deg` }], borderColor: cellBorder51.value, backgroundColor: cellBg51.value }));
  const tileStyle52 = useAnimatedStyle(() => ({ transform: [{ rotateX: `${tileRotate52.value}deg` }], borderColor: cellBorder52.value, backgroundColor: cellBg52.value }));
  const tileStyle53 = useAnimatedStyle(() => ({ transform: [{ rotateX: `${tileRotate53.value}deg` }], borderColor: cellBorder53.value, backgroundColor: cellBg53.value }));
  const tileStyle54 = useAnimatedStyle(() => ({ transform: [{ rotateX: `${tileRotate54.value}deg` }], borderColor: cellBorder54.value, backgroundColor: cellBg54.value }));

  const tileStyles = [
    [tileStyle00, tileStyle01, tileStyle02, tileStyle03, tileStyle04],
    [tileStyle10, tileStyle11, tileStyle12, tileStyle13, tileStyle14],
    [tileStyle20, tileStyle21, tileStyle22, tileStyle23, tileStyle24],
    [tileStyle30, tileStyle31, tileStyle32, tileStyle33, tileStyle34],
    [tileStyle40, tileStyle41, tileStyle42, tileStyle43, tileStyle44],
    [tileStyle50, tileStyle51, tileStyle52, tileStyle53, tileStyle54]
  ];

  const addKey = (key: string) => {
    console.log('CURRENT: ', colStateRef.current);

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
      console.log('🚀 ~ addKey ~ curCol', colStateRef.current);

      newRows[curRow][colStateRef.current] = key;
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

    if (!allWords.includes(currentWord)) {
      console.log('NOT A WORD');
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
        console.log('🚀 ~ checkWord ~ WIN');
        router.push(`/end?win=true&word=${word}&gameField=${JSON.stringify(rows)}`);
      } else if (curRow + 1 >= rows.length) {
        console.log('GAME OVER');
        router.push(`/end?win=false&word=${word}&gameField=${JSON.stringify(rows)}`);
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
      } else if (e.key.length === 1) {
        addKey(e.key);
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
          withTiming(OFFSET, { duration: TIME }, () => {}),
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

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <SettingsModal ref={settingsModalRef} />
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={styles.headerIcons}>
              <Ionicons name="help-circle-outline" size={28} color={textColor} />
              <Ionicons name="podium-outline" size={24} color={textColor} />
              <TouchableOpacity onPress={handlePresentSubscribeModalPress}>
                <Ionicons name="settings-sharp" size={24} color={textColor} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <View style={styles.gameField}>
        {rows.map((row, rowIndex) => (
          <Animated.View style={[styles.gameFieldRow, rowStyles[rowIndex]]} key={`row-${rowIndex}`}>
            {row.map((cell, cellIndex) => (
              <Animated.View
                entering={ZoomIn.delay(50 * cellIndex)}
                key={`cell-${rowIndex}-${cellIndex}`}>
                <Animated.View
                  style={[
                    styles.cell,
                    tileStyles[rowIndex][cellIndex],
                  ]}>
                  <Animated.Text
                    style={[
                      styles.cellText,
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
    gap: 8,
  },
  gameFieldRow: {
    flexDirection: 'row',
    gap: 8,
  },
  cell: {
    backgroundColor: '#fff',
    width: 62,
    height: 62,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  cellText: {
    fontSize: 30,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 10,
  },
});