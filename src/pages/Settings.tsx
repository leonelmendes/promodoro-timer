import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { MaterialIcons } from '@expo/vector-icons';

import { TNavigationScreenProps } from "../AppRoutes";
import { Theme } from "../shared/themes/theme";
import { useEffect, useState } from "react";


export const Settings = () => {
    const navigation = useNavigation<TNavigationScreenProps>();

    const [loaded, setLoaded] = useState(false)
    const [focusPeriod, setFocusPeriod] = useState(25);
    const [shortBreakPeriod, setshortBreakPeriod] = useState(5);
    const [longBreakPeriod, setLongBreakPeriod] = useState(15);
    const [notificationsActivated, setnotificatioActivated] = useState(true);

    useEffect(() => {
        Promise.all([
            AsyncStorage.getItem('NOTIFICATION_ACTIVATED'),
            AsyncStorage.getItem('SHORT_BREAK_PERIOD'),
            AsyncStorage.getItem('LONG_BREAK_PERIOD'),
            AsyncStorage.getItem('FOCUS_PERIOD')
        ])
        .then(([notication, short, long, focus]) => {
            setnotificatioActivated(JSON.parse(notication || 'true'));
            setshortBreakPeriod(JSON.parse(short || '5'));
            setLongBreakPeriod(JSON.parse(long || '15'));
            setFocusPeriod(JSON.parse(focus || '25'));
        })
        .finally(() => setLoaded(true))
    },[])

    useEffect(() => {
        if(!loaded) return;
        AsyncStorage.setItem('NOTIFICATION_ACTIVATED', JSON.stringify(notificationsActivated));
    },[notificationsActivated]);
    useEffect(() => {
        if(!loaded) return;
        AsyncStorage.setItem('SHORT_BREAK_PERIOD', JSON.stringify(shortBreakPeriod));
    },[shortBreakPeriod]);
    useEffect(() => {
        if(!loaded) return;
        AsyncStorage.setItem('LONG_BREAK_PERIOD', JSON.stringify(longBreakPeriod));
    },[longBreakPeriod]);
    useEffect(() => {
        if(!loaded) return;
        AsyncStorage.setItem('FOCUS_PERIOD', JSON.stringify(focusPeriod));
    },[focusPeriod]);



    return (
        <View style={styles.mainContainer}>
            
            <TouchableOpacity 
                style={styles.settingButton}
                onPress={() => navigation.goBack()}>
                    <MaterialIcons 
                        name='close'
                        size={28}
                        color={Theme.colors.divider}/>
            </TouchableOpacity>

            <View style={styles.container}>
                
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>
                        Configurações
                    </Text>
                </View>

                <View style={styles.formContainer}> 

                    <View style={styles.formFieldContainer}>
                        <Text style={styles.fielLabel}>
                            Período de Foco
                        </Text>

                        <View style={styles.formFieldButtons}>
                            <TouchableOpacity 
                                style={focusPeriod === 15 ? styles.primaryButton : styles.secundaryButton}
                                onPress={() => setFocusPeriod(15)}>
                                <Text style={styles.primaryButtonText}>
                                    15 min
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={focusPeriod === 25 ? styles.primaryButton : styles.secundaryButton}
                                onPress={() => setFocusPeriod(25)}>
                                <Text style={styles.primaryButtonText}>
                                    25 min
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={focusPeriod === 35 ? styles.primaryButton : styles.secundaryButton}
                                onPress={() => setFocusPeriod(35)}>
                                <Text style={styles.primaryButtonText}>
                                    35 min
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={styles.formContainer}> 

                    <View style={styles.formFieldContainer}>
                        <Text style={styles.fielLabel}>
                            Pausa curta
                        </Text>

                        <View style={styles.formFieldButtons}>
                            <TouchableOpacity 
                                style={shortBreakPeriod === 3? styles.primaryButton : styles.secundaryButton} 
                                onPress={() => setshortBreakPeriod(3)}>
                                <Text style={styles.primaryButtonText}>
                                    3 min
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={shortBreakPeriod === 5? styles.primaryButton : styles.secundaryButton} 
                                onPress={() => setshortBreakPeriod(5)}>
                                <Text style={styles.primaryButtonText}>
                                    5 min
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={shortBreakPeriod === 7? styles.primaryButton : styles.secundaryButton} 
                                onPress={() => setshortBreakPeriod(7)}>
                                <Text style={styles.primaryButtonText}>
                                    7 min
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                
                <View style={styles.formContainer}> 

                    <View style={styles.formFieldContainer}>
                        <Text style={styles.fielLabel}>
                            Pausa longa
                        </Text>

                        <View style={styles.formFieldButtons}>
                            <TouchableOpacity 
                                style={longBreakPeriod === 10 ? styles.primaryButton : styles.secundaryButton}
                                onPress={() => setLongBreakPeriod(10)}>
                                <Text style={styles.primaryButtonText}>
                                    10 min
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={longBreakPeriod === 15 ? styles.primaryButton : styles.secundaryButton}
                                onPress={() => setLongBreakPeriod(15)}>
                                <Text style={styles.primaryButtonText}>
                                    15 min
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={longBreakPeriod === 20 ? styles.primaryButton : styles.secundaryButton}
                                onPress={() => setLongBreakPeriod(20)}>
                                <Text style={styles.primaryButtonText}>
                                    20 min
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={styles.formContainer}> 

                    <View style={styles.formFieldContainer}>
                        <Text style={styles.fielLabel}>
                            Notificações
                        </Text>

                        <View style={styles.formFieldButtons}>
                            <TouchableOpacity 
                                style={!notificationsActivated ? styles.primaryButton : styles.secundaryButton}
                                onPress={() => setnotificatioActivated(false)}>
                                <Text style={styles.primaryButtonText}>
                                    Ativado
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={notificationsActivated ? styles.primaryButton : styles.secundaryButton}
                                onPress={() => setnotificatioActivated(true)}>
                                <Text style={styles.primaryButtonText}>
                                    Desativado
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 36,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    mainContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16
    },
    settingButton: {
        alignSelf: 'flex-end'
    },
    primaryButton: {
        borderWidth: 2,
        borderRadius: 55,
        backgroundColor: Theme.colors.primary,
        paddingVertical: 8,
        paddingHorizontal: 24,
        borderColor: Theme.colors.primary
    },
    primaryButtonText: {
        color: Theme.colors.text,
        fontFamily: Theme.fonts.interRegular,
        fontSize: Theme.fontSizes.body
    },
    secundaryButton: {
        backgroundColor: Theme.colors.divider,
        paddingVertical: 8,
        paddingHorizontal: 24,
        borderWidth: 2,
        borderRadius: 55,
        borderColor: Theme.colors.divider
    },
    secundaryButtonText: {
        color: Theme.colors.text,
        fontFamily: Theme.fonts.interRegular,
        fontSize: Theme.fontSizes.body
    },
    formContainer: {
        flexDirection: 'row', 
        justifyContent: "center", 
        gap: 10,
        width: '100%',
        maxWidth: 300,
    },
    titleText: {
        color: Theme.colors.text,
        fontSize: Theme.fontSizes.title,
        fontFamily: Theme.fonts.interBold,
    },
    titleContainer: {
        alignItems: "center"
    },
    formFieldContainer: {
        gap: 8,
        width: '100%'
    },
    fielLabel: {
        fontFamily: Theme.fonts.interRegular,
        fontSize: Theme.fontSizes.label,
        color: Theme.colors.text,
        alignSelf: 'flex-start'
    },
    formFieldButtons: {
        flexDirection: 'row',
        gap: 20,
        justifyContent: 'center',
        width: '100%'
    }
})