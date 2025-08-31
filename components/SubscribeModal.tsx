import { Colors } from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProps, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { MarkedList } from '@jsamr/react-native-li';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import React, { forwardRef, useCallback, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import disc from '../node_modules/@jsamr/counter-style/src/presets/disc';

type Props = {
  children?: React.ReactNode; 
} & BottomSheetModalProps;

const BENEFITS = [
  'Disfruta de acceso completo a Wordle, Spelling Bee, The Crossword y mucho más',
  'Juega a nuevos rompecabezas cada día para concentrarte o relajarte',
  'Refuerza tu estrategia con WordleBot',
  'Desbloquea más de 10 000 rompecabezas en nuestros archivos de Wordle, Spelling Bee y crucigramas',
  'Realiza un seguimiento de tus estadísticas y rachas en cualquier dispositivo',
];

const SubscribeModal = forwardRef<BottomSheetModal, Props>(({ children, ...props }, ref) => {
    const snapPoints = useMemo(() => ['90%'], []);
    const { bottom } = useSafeAreaInsets();

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
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
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            enablePanDownToClose={true}
            //handleComponent={null}
            android_keyboardInputMode="adjustResize"
            {...props} 
        >
            {children || (
                <View style={styles.contentContainer}>
                    <View style={styles.modalBtns}>
                        <Link href={'/login'} asChild>
                            <TouchableOpacity>
                                <Text style={styles.textBtn}>INICIAR SESIÓN</Text>
                            </TouchableOpacity>
                        </Link>
                        <TouchableOpacity onPress={handleClose}>
                            <Ionicons name="close" size={28} color={Colors.dark.gray} />
                        </TouchableOpacity>
                    </View>
                    <BottomSheetScrollView>
                        <Text style={styles.containerHeadline}>Juego ilimitado.{'\n'}Pruébalo gratis durante 7 días.</Text>
                        <Image source={require('@/assets/images/games.png')} style={styles.image} />

                        <View style={{ marginVertical: 20 }}>
                            <MarkedList
                                counterRenderer={disc}
                                lineStyle={{ paddingHorizontal: 40, gap: 10, marginVertical: 10 }}>
                                {BENEFITS.map((value, index) => (
                                    <Text key={index} style={styles.listText}>
                                    {value}
                                    </Text>
                                ))}
                            </MarkedList>
                        </View>
                        <Text style={styles.disclaimer}>
                            Si te suscribes a The New York Times a través de esta aplicación, el pago de tu suscripción se cargará automáticamente a tu cuenta de Google Play (asociada a tu cuenta de Android) una vez confirmes la compra. Tu cuenta de Android será debitada automáticamente por la renovación al precio aplicable que se te muestre al momento de la suscripción, cada mes (para suscripciones mensuales) o cada año (para suscripciones anuales), dentro de las 24 horas previas al inicio de tu próximo período de facturación.

                            En el caso de ofertas introductorias especiales, se te cobrará automáticamente la tarifa promocional aplicable durante el período introductorio establecido, y luego la tarifa estándar que se te haya indicado al suscribirte. El pago se realiza por adelantado.

                            Las suscripciones se renuevan automáticamente hasta que las canceles. La cancelación tendrá efecto al finalizar tu período de facturación actual. Puedes gestionar y cancelar tus suscripciones en la configuración de tu cuenta en Google Play. Para cancelar, desactiva la renovación automática al menos 24 horas antes del final de tu ciclo de facturación actual desde la configuración de tu cuenta de Google Play.
                        </Text>
                    </BottomSheetScrollView>
                    <View style={[styles.footer, { paddingBottom: bottom }]}>
                        <TouchableOpacity style={defaultStyles.btn}>
                            <Text style={defaultStyles.btnText}>Prueba gratis durante 7 días</Text>
                        </TouchableOpacity>
                        <Text style={styles.footerText}>99,99 $ al mes tras un periodo de prueba de 7 días. Cancela en cualquier momento.</Text>
                    </View>
                </View>
            )}
        </BottomSheetModal>
    );
});

SubscribeModal.displayName = "SubscribeModal";

const styles = StyleSheet.create({
    contentContainer: {
    flex: 1,
    backgroundColor: '#fff',
    },
    containerHeadline: {
        fontSize: 25,
        padding: 20,
        textAlign: 'center',
        fontFamily: 'FrankRuhlLibre_900Black',
    },
    image: {
        width: '90%',
        alignSelf: 'center',
        height: 40,
    },
    modalBtns: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    textBtn: {
        fontSize: 14,
        color: '#000',
        fontWeight: 'bold',
    },
    listText: {
        fontSize: 14,
        flexShrink: 1,
        color: '#4f4f4f',
    },
    disclaimer: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#484848',
        marginHorizontal: 30,
        lineHeight: 18,
        marginBottom: 20,
    },
    footer: {
        backgroundColor: '#fff',
        marginTop: 'auto',
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: -1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
        paddingTop: 20,
    },
    footerText: {
        textAlign: 'center',
        fontSize: 14,
        color: '#484848',
        paddingTop: 10,
    },
});

export default SubscribeModal;