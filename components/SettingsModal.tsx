import { Colors } from '@/constants/Colors';
import { storage } from '@/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetBackdrop, BottomSheetModal, useBottomSheetModal } from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useMemo } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useMMKVBoolean } from 'react-native-mmkv';
export type Ref = BottomSheetModal;

const SettingsModal = forwardRef<Ref>((props, ref) => {
  const snapPoints = useMemo(() => ['50%'], []);
  const { dismiss } = useBottomSheetModal();
  const [dark, setDark] = useMMKVBoolean('dark-mode', storage);
  const [hard, setHard] = useMMKVBoolean('hard-mode', storage);
  const [contrast, setContrast] = useMMKVBoolean('contrast-mode', storage);

  const toggleDark = () => setDark((prev) => !!!prev);
  const toggleHard = () => setHard((prev) => !!!prev);
  const toggleContrast = () => setContrast((prev) => !!!prev);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        opacity={0.2}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
        onPress={dismiss}
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      backdropComponent={renderBackdrop}
      snapPoints={snapPoints}
      handleComponent={null}>
      <View style={styles.contentContainer}>
        <View style={styles.modalBtns}>
          <Text style={styles.containerHeadline}>CONFIGURACIÓN</Text>
          <TouchableOpacity onPress={() => dismiss()}>
            <Ionicons name="close" size={28} color={Colors.light.gray} />
          </TouchableOpacity>
        </View>
        <View>
          <View style={styles.row}>
            <View style={styles.rowText}>
<<<<<<< HEAD
=======
              <Text style={styles.rowTextBig}>Modo difícil</Text>
              <Text style={styles.rowTextSmall}>Las palabras son más largas y más difíciles.</Text>
            </View>
            <Switch
              onValueChange={toggleHard}
              value={hard}
              trackColor={{ true: '#000' }}
              ios_backgroundColor="#9a9a9a"
            />
          </View>
          <View style={styles.row}>
            <View style={styles.rowText}>
>>>>>>> 388641c9954ee525061999d3b1c2a69f406f489f
              <Text style={styles.rowTextBig}>Modo oscuro</Text>
              <Text style={styles.rowTextSmall}>Cambia la aplicación al modo oscuro.</Text>
            </View>
            <Switch
              onValueChange={toggleDark}
              value={dark}
              trackColor={{ true: '#000' }}
              ios_backgroundColor="#9a9a9a"
            />
          </View>
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.rowTextBig}>Modo de alto contraste</Text>
              <Text style={styles.rowTextSmall}>Aumentar el contraste para mejorar la visibilidad.</Text>
            </View>
            <Switch
              onValueChange={toggleContrast}
              value={contrast}
              trackColor={{ true: '#000' }}
              ios_backgroundColor="#9a9a9a"
            />
          </View>
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
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#888',
  },
  rowText: {
    flex: 1,
  },
  rowTextBig: {
    fontSize: 18,
  },
  rowTextSmall: {
    fontSize: 14,
    color: '#5e5e5e',
  },
});
SettingsModal.displayName = "SettingsModal";
export default SettingsModal;