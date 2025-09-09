import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type Ref = BottomSheetModal;

const RulesModal = forwardRef<Ref>((props, ref) => {
  const snapPoints = useMemo(() => ['80%'], []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        opacity={0.5}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    []
  );

  const handleClose = useCallback(() => {
    if (ref && 'current' in ref && ref.current) {
      ref.current.dismiss();
    }
  }, [ref]);

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      backdropComponent={renderBackdrop}
      snapPoints={snapPoints}
      handleComponent={null}
      {...props}>
      <View style={styles.contentContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.containerHeadline}>REGLAS DEL JUEGO</Text>
          <TouchableOpacity onPress={handleClose}>
            <Ionicons name="close" size={28} color={Colors.light.gray} />
          </TouchableOpacity>
        </View>
        
        <BottomSheetScrollView style={styles.scrollView}>
          <View style={styles.content}>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>MODO CLÁSICO</Text>
              <Text style={styles.ruleText}>
                • Adivina la palabra de 5 letras en 6 intentos{'\n'}
                • Cada intento debe ser una palabra válida{'\n'}
                • Después de cada intento, el color de las casillas cambiará para mostrar qué tan cerca estás de la palabra
              </Text>
              
              <View style={styles.exampleContainer}>
                <Text style={styles.exampleTitle}>Ejemplos:</Text>
                
                <View style={styles.example}>
                  <View style={[styles.exampleTile, { backgroundColor: Colors.light.green }]}>
                    <Text style={styles.exampleTileText}>A</Text>
                  </View>
                  <Text style={styles.exampleText}>La letra A está en la palabra y en la posición correcta</Text>
                </View>
                
                <View style={styles.example}>
                  <View style={[styles.exampleTile, { backgroundColor: Colors.light.yellow }]}>
                    <Text style={styles.exampleTileText}>R</Text>
                  </View>
                  <Text style={styles.exampleText}>La letra R está en la palabra pero en posición incorrecta</Text>
                </View>
                
                <View style={styles.example}>
                  <View style={[styles.exampleTile, { backgroundColor: Colors.light.gray }]}>
                    <Text style={styles.exampleTileText}>O</Text>
                  </View>
                  <Text style={styles.exampleText}>La letra O no está en la palabra</Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>MODO DIFÍCIL</Text>
              <Text style={styles.ruleText}>
                • Las palabras pueden tener entre 6 y 8 letras{'\n'}
                • El número de intentos es aleatorio (entre 3 y 7){'\n'}
                • Las palabras son más complejas y desafiantes{'\n'}
                • Todas las demás reglas del modo clásico aplican
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>MODO COMBINATORIA</Text>
              <Text style={styles.ruleText}>
                • La palabra objetivo está relacionada con teoría combinatoria{'\n'}
                • No necesitas adivinar la palabra completa de una vez{'\n'}
                • Escribe cualquier palabra válida como intento{'\n'}
                • Las letras que coincidan con la palabra objetivo se agregarán automáticamente al tablero de construcción{'\n'}
                • Ganas cuando todas las letras de la palabra objetivo estén en el tablero
              </Text>
              
              <View style={styles.exampleContainer}>
                <Text style={styles.exampleTitle}>Ejemplo:</Text>
                <Text style={styles.exampleText}>
                  Palabra objetivo: FORMULA{'\n'}
                  Escribes: PENTA{'\n'}
                  Las letras A se añaden al tablero de construcción{'\n'}
                  Escribes: ORANGE{'\n'}
                  Las letras O, R se añaden al tablero{'\n'}
                  Continúas hasta completar FORMULA
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>CONSEJOS</Text>
              <Text style={styles.ruleText}>
                • Comienza con palabras que tengan vocales comunes{'\n'}
                • Presta atención a las letras que ya has descartado{'\n'}
                • En modo combinatoria, piensa en palabras que puedan compartir letras con términos matemáticos{'\n'}
                • Usa el teclado en pantalla para ver qué letras has usado
              </Text>
            </View>
          </View>
        </BottomSheetScrollView>
      </View>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  containerHeadline: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    fontFamily: 'FrankRuhlLibre_800ExtraBold',
  },
  ruleText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#555',
    fontFamily: 'FrankRuhlLibre_500Medium',
  },
  exampleContainer: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  example: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  exampleTile: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderRadius: 4,
  },
  exampleTileText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  exampleText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
});

RulesModal.displayName = "RulesModal";
export default RulesModal;