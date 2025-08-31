import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetBackdrop, BottomSheetModal, useBottomSheetModal } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type CombinatoricsQuestion = {
  question: string;
  options: string[];
  correctAnswer: number; // índice de la respuesta correcta (0-3)
};

const COMBINATORICS_QUESTIONS: CombinatoricsQuestion[] = [
  {
    question: "¿De cuántas maneras se pueden ordenar 5 letras diferentes?",
    options: ["60", "120", "24", "720"],
    correctAnswer: 1 // 5! = 120
  },
  {
    question: "¿Cuántas combinaciones de 3 letras se pueden formar con 6 letras diferentes?",
    options: ["18", "20", "24", "36"],
    correctAnswer: 1 // C(6,3) = 20
  },
  {
    question: "Si tienes 4 vocales y 6 consonantes, ¿de cuántas maneras puedes elegir 2 vocales y 1 consonante?",
    options: ["36", "48", "54", "72"],
    correctAnswer: 0 // C(4,2) × C(6,1) = 6 × 6 = 36
  },
  {
    question: "¿Cuántas permutaciones de la palabra AMOR existen?",
    options: ["12", "24", "16", "20"],
    correctAnswer: 1 // 4! = 24
  },
  {
    question: "¿De cuántas maneras se pueden colocar 3 libros en 5 estantes?",
    options: ["60", "125", "15", "243"],
    correctAnswer: 0 // P(5,3) = 5!/(5-3)! = 60
  }
];

type Props = {
  onCorrectAnswer: () => void;
  onWrongAnswer: () => void;
  isUserLoggedIn?: boolean;
} & React.ComponentProps<typeof BottomSheetModal>;

const CombinatoricsModal = forwardRef<BottomSheetModal, Props>(({ onCorrectAnswer, onWrongAnswer, isUserLoggedIn = false, ...props }, ref) => {
  const snapPoints = useMemo(() => ['70%'], []);
  const { dismiss } = useBottomSheetModal();
  const router = useRouter();
  
  const [currentQuestion, setCurrentQuestion] = useState<CombinatoricsQuestion>(
    COMBINATORICS_QUESTIONS[Math.floor(Math.random() * COMBINATORICS_QUESTIONS.length)]
  );
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        opacity={0.2}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    []
  );

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    
    setSelectedAnswer(answerIndex);
    const correct = answerIndex === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);

    setTimeout(() => {
      if (correct) {
        dismiss();
        onCorrectAnswer();
      } else {
        onWrongAnswer();
      }
    }, 2000);
  };

  const resetQuestion = () => {
    setCurrentQuestion(
      COMBINATORICS_QUESTIONS[Math.floor(Math.random() * COMBINATORICS_QUESTIONS.length)]
    );
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
  };

  const getOptionStyle = (index: number) => {
    if (!showResult) {
      return selectedAnswer === index ? styles.selectedOption : styles.option;
    }
    
    if (index === currentQuestion.correctAnswer) {
      return styles.correctOption;
    } else if (selectedAnswer === index && !isCorrect) {
      return styles.wrongOption;
    } else {
      return styles.disabledOption;
    }
  };

  const getOptionTextStyle = (index: number) => {
    if (!showResult) {
      return selectedAnswer === index ? styles.selectedOptionText : styles.optionText;
    }
    
    if (index === currentQuestion.correctAnswer) {
      return styles.correctOptionText;
    } else if (selectedAnswer === index && !isCorrect) {
      return styles.wrongOptionText;
    } else {
      return styles.disabledOptionText;
    }
  };

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      backdropComponent={renderBackdrop}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      handleComponent={null}
      {...props}>
      <View style={styles.contentContainer}>
        <View style={styles.modalBtns}>
          <Text style={styles.containerHeadline}>PREGUNTA DE COMBINATORIA</Text>
          <TouchableOpacity onPress={() => dismiss()}>
            <Ionicons name="close" size={28} color={Colors.light.gray} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {!showResult ? (
            <>
              <Text style={styles.instruction}>
                Responde correctamente para ver tus estadísticas:
              </Text>
              
              <Text style={styles.question}>{currentQuestion.question}</Text>
              
              <View style={styles.optionsContainer}>
                {currentQuestion.options.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={getOptionStyle(index)}
                    onPress={() => handleAnswerSelect(index)}
                    disabled={showResult}>
                    <Text style={getOptionTextStyle(index)}>
                      {String.fromCharCode(65 + index)}. {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          ) : (
            <View style={styles.resultContainer}>
              <Ionicons 
                name={isCorrect ? "checkmark-circle" : "close-circle"} 
                size={60} 
                color={isCorrect ? Colors.light.green : Colors.light.red} 
              />
              <Text style={[styles.resultTitle, { color: isCorrect ? Colors.light.green : Colors.light.red }]}>
                {isCorrect ? "¡Correcto!" : "Incorrecto"}
              </Text>
              <Text style={styles.resultMessage}>
                {isCorrect 
                  ? (isUserLoggedIn 
                      ? "Excelente conocimiento de combinatoria. Ahora puedes ver tus estadísticas."
                      : "Excelente conocimiento de combinatoria. Regístrate para guardar tus estadísticas."
                    )
                  : "La respuesta correcta era: " + String.fromCharCode(65 + currentQuestion.correctAnswer) + ". " + currentQuestion.options[currentQuestion.correctAnswer]
                }
              </Text>
            </View>
          )}
        </View>
      </View>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerHeadline: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    flex: 1,
  },
  modalBtns: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  instruction: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
    fontFamily: 'FrankRuhlLibre_500Medium',
  },
  question: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'FrankRuhlLibre_800ExtraBold',
    lineHeight: 28,
  },
  optionsContainer: {
    gap: 15,
  },
  option: {
    backgroundColor: '#f8f8f8',
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
  },
  selectedOption: {
    backgroundColor: '#e3f2fd',
    borderWidth: 2,
    borderColor: '#2196f3',
    borderRadius: 12,
    padding: 16,
  },
  correctOption: {
    backgroundColor: Colors.light.green,
    borderWidth: 2,
    borderColor: Colors.light.green,
    borderRadius: 12,
    padding: 16,
  },
  wrongOption: {
    backgroundColor: '#ffebee',
    borderWidth: 2,
    borderColor: '#f44336',
    borderRadius: 12,
    padding: 16,
  },
  disabledOption: {
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    opacity: 0.6,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  selectedOptionText: {
    fontSize: 16,
    color: '#2196f3',
    fontWeight: 'bold',
  },
  correctOptionText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  wrongOptionText: {
    fontSize: 16,
    color: '#f44336',
    fontWeight: 'bold',
  },
  disabledOptionText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
  },
  resultContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 20,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'FrankRuhlLibre_800ExtraBold',
  },
  resultMessage: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
});

CombinatoricsModal.displayName = "CombinatoricsModal";
export default CombinatoricsModal;