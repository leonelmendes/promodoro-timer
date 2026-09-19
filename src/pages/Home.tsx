import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View, AppState } from "react-native";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { MaterialIcons } from '@expo/vector-icons';



import { TNavigationScreenProps } from "../AppRoutes";
import { Theme } from "../shared/themes/theme";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UpdateStateByElapsedTime } from "../shared/helpers/UpdateStatebyElapsedTime";
import { NotificationService } from "../shared/services/NotificationService";


export const Home = () => {
    const navigation = useNavigation<TNavigationScreenProps>();

    const [appRunningState, setAppRunningState] = useState(AppState.currentState);
    useEffect(() => {
        const listener = AppState.addEventListener('change', setAppRunningState);

        return () => listener.remove();
    })

    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [currentStatus, setCurrentStatus] = useState<'focus' | 'short_break' | 'long_break' >('focus')
    const [counterCircleTime, setCounterCircleTime] = useState(25 * 60);

    const [currentFocusCircleTime, setCurrentFocusCircleTime] = useState(25 * 60);
    const [currentShortBreakCircleTime, setCurrentShorBreakCircleTime] = useState(5 * 60);
    const [currentLongBreakCircleTime, setCurrentLongBreakCircleTime] = useState(15 * 60);

    useFocusEffect(
        useCallback(() => {
        Promise.all([
            AsyncStorage.getItem('SHORT_BREAK_PERIOD'),
            AsyncStorage.getItem('LONG_BREAK_PERIOD'),
            AsyncStorage.getItem('FOCUS_PERIOD')
        ])
        .then(([short, long, focus]) => {
            setCurrentShorBreakCircleTime(JSON.parse(short || '5') * 60);
            setCurrentLongBreakCircleTime(JSON.parse(long || '15') * 60);
            setCurrentFocusCircleTime(JSON.parse(focus || '25') * 60);

            //setCounterCircleTime(JSON.parse(focus || '25')* 60);

        })
        },[])
    );

    useEffect(() => {
        if(!isRunning || isPaused) return;//para não iniciar de imediato

        const ref = setInterval(() => {
            setCounterCircleTime(old => old <= 0 ? old : old - 1);
        }, 1000);

        return () => clearInterval(ref)
    }, [isRunning, isPaused]);

    useEffect(() => {
        switch(currentStatus){
            case 'focus': {
                if(counterCircleTime > 0) break;

                if(step < 4){
                    setCurrentStatus('short_break');
                    setStep(old => ( old + 1) as 1);
                    setCounterCircleTime(currentShortBreakCircleTime)
                }
                else{
                    setCurrentStatus('long_break');
                    setStep(1);
                    setCounterCircleTime(currentLongBreakCircleTime)
                }
                break;
            };
            case 'short_break': 
            case 'long_break': {
                if(counterCircleTime <= 0){
                    setCurrentStatus('focus');
                    setCounterCircleTime(currentFocusCircleTime);
                }
                break;
            };
        }

       
    }, [counterCircleTime, currentStatus, isRunning, isPaused, step, currentShortBreakCircleTime, currentFocusCircleTime, currentLongBreakCircleTime])

    const isShowUpdate = useRef(true);
    useEffect(() => {
        if(isShowUpdate.current){
            isShowUpdate.current = false;

            AsyncStorage
            .getItem("APP_STATE")
            .then(value => {
                const appState = JSON.parse(value || 'null')
                if(!appState) return;

                console.log(appState);

                const updatedAppState = UpdateStateByElapsedTime(appState)

                setCounterCircleTime(appState.counterCircleTime);
                setCurrentStatus(appState.setCurrentStatus);
                setIsRunning(appState.isRunning);
                setIsPaused(appState.isPaused);
                setStep(appState.step);
            })
        }

        if(appRunningState === 'background'){
            isShowUpdate.current = true;
        }
    }, [appRunningState])

    useEffect(() => {
        NotificationService.requestPermission();

        if(appRunningState !== 'active' && isRunning && !isPaused){
            NotificationService.activateNotification();
        } else {
            NotificationService.deactivateNotification();
        }
    }, [appRunningState, isRunning, isPaused])
    const handleStart = async () => {
        setIsRunning(true);

         AsyncStorage.setItem('APP_STATE', JSON.stringify({
            step,  
            isPaused,
            isRunning: true,
            currentStatus,
            time: Date.now(),
            counterCircleTime,
            currentFocusCircleTime,
            currentShortBreakCircleTime,
            currentLongBreakCircleTime
        }))
        
    }
    const handlePause = () => {
        setIsPaused(true);

         AsyncStorage.setItem('APP_STATE', JSON.stringify({
            step,  
            isPaused: true,
            isRunning,
            currentStatus,
            time: Date.now(),
            counterCircleTime,
            currentFocusCircleTime,
            currentShortBreakCircleTime,
            currentLongBreakCircleTime
        }))
    }
    const handleStop = () => {
        setStep(1);
        setCurrentStatus('focus');
        setIsPaused(false);
        setIsRunning(false);
        setCounterCircleTime(currentFocusCircleTime);

         AsyncStorage.setItem('APP_STATE', JSON.stringify({
            step: 1,  
            isPaused: false,
            isRunning: false,
            currentStatus: 'focus',
            time: Date.now(),
            counterCircleTime: currentFocusCircleTime,
            currentFocusCircleTime,
            currentShortBreakCircleTime,
            currentLongBreakCircleTime
        }))
    }
    const handleContinue = () => {
        setIsPaused(false);

         AsyncStorage.setItem('APP_STATE', JSON.stringify({
            step,  
            isPaused: false,
            isRunning,
            currentStatus,
            time: Date.now(),
            counterCircleTime,
            currentFocusCircleTime,
            currentShortBreakCircleTime,
            currentLongBreakCircleTime
        }))
    }

    const timeProgress = useMemo(() => {
        switch (currentStatus) {
            case 'focus': return 100 - (counterCircleTime / currentFocusCircleTime) * 100;
            case 'short_break': return 100 - (counterCircleTime / currentShortBreakCircleTime) * 100;
            case 'long_break': return 100 - (counterCircleTime / currentLongBreakCircleTime) * 100;
        
            default: return 0;
        }
    }, [currentStatus, counterCircleTime, currentFocusCircleTime, currentShortBreakCircleTime, currentLongBreakCircleTime])

    return (
        <View style={styles.mainContainer}>
            
            <TouchableOpacity 
                disabled={isRunning}
                style={{...styles.settingButton, opacity: isRunning ? 0 : 1}}
                onPress={() => navigation.navigate('Settings')}>
                    <MaterialIcons 
                        name='settings'
                        size={28}
                        color={Theme.colors.divider}/>
            </TouchableOpacity>

            <View style={styles.container}>
                
                <View style={styles.titleGroup}> 
                    <View style={styles.titleContainer}>
                        <Text style={styles.titleText}>
                            POMODORO
                        </Text>
                    </View>
                    
                    <View style={styles.stateContainer}>
                        
                        {!isRunning && (<Text style={styles.stateText}>
                            Vamos nos concentrar?
                        </Text>
                        )}
                        
                        {isRunning && (
                            <>
                                {!isPaused && currentStatus === 'focus' &&(<Text style={styles.stateText}>
                                    Hora de se concentrar
                                </Text>)}

                                {!isPaused && currentStatus === 'short_break' &&(<Text style={styles.stateText}>
                                    Pausa curta
                                </Text>)}

                                {!isPaused && currentStatus === 'long_break' &&(<Text style={styles.stateText}>
                                    Pausa longa
                                </Text>)}

                                {isPaused && (<Text style={styles.stateText}>
                                    Cronômetro em Pausa
                                </Text>)}
                            </>
                        )}
                    </View>

                    <View style={styles.progressContainer}>
                        <AnimatedCircularProgress
                            size={160}
                            width={7}
                            fill={timeProgress}
                            tintColor={Theme.colors.divider}
                            backgroundColor={Theme.colors.primary} 
                            rotation={0}
                            children={() => (
                                <Text style={styles.progressText}>
                                    {Math.floor(counterCircleTime/ 60)}:{(counterCircleTime % 60).toString().padStart(2, '0')}
                                </Text>
                            )}
                        />
                    </View>
                </View>

                {!isRunning &&(<View style={styles.buttonContainer}> 
                    <TouchableOpacity 
                        style={styles.primaryButton}
                        onPress={handleStart}>
                            <Text style={styles.primaryButtonText}>
                                Iniciar
                            </Text>
                    </TouchableOpacity>
                </View>)}

              {isRunning && !isPaused &&(
                    <View style={styles.buttonContainer }> 
                        <TouchableOpacity 
                            style={styles.primaryButton}
                            onPress={handlePause}
                            >
                                <Text style={styles.primaryButtonText}>
                                    Pausar
                                </Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.secundaryButton}
                            onPress={handleStop}
                            >
                                <Text style={styles.secundaryButtonText}>
                                    Parar
                                </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {isRunning && isPaused &&(<View style={styles.buttonContainer}> 
                    <TouchableOpacity 
                        style={styles.primaryButton}
                        onPress={handleContinue}
                        >
                            <Text style={styles.primaryButtonText}>
                                Continuar
                            </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.secundaryButton}
                        onPress={handleStop}
                        >
                            <Text style={styles.secundaryButtonText}>
                                Parar
                            </Text>
                    </TouchableOpacity>
                </View> )}

                <View style={styles.pomodorosContainer}>
                    <Text style={styles.pomodorosText}>
                        Pomodoro:
                    </Text>

                    <View style={ step >= 2 || currentStatus === 'long_break' ? styles.pomodorosIndicatorComplete : styles.pomodorosIndicator}/>
                    <View style={ step >= 3 || currentStatus === 'long_break' ? styles.pomodorosIndicatorComplete : styles.pomodorosIndicator}/>
                    <View style={ step >= 4 || currentStatus === 'long_break' ? styles.pomodorosIndicatorComplete : styles.pomodorosIndicator}/>
                    <View style={ currentStatus === 'long_break' ? styles.pomodorosIndicatorComplete : styles.pomodorosIndicator}/>
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
    titleGroup: {
        gap: 24,
    },
    primaryButton: {
        backgroundColor: Theme.colors.primary,
        paddingVertical: 8,
        paddingHorizontal: 24,
        borderRadius: 50
    },
    primaryButtonText: {
        color: Theme.colors.text,
        fontFamily: Theme.fonts.interRegular,
        fontSize: Theme.fontSizes.body
    },
    secundaryButton: {
        borderColor: Theme.colors.primary,
        borderWidth: 2,
        paddingVertical: 8,
        paddingHorizontal: 24,
        borderRadius: 50
    },
    secundaryButtonText: {
        color: Theme.colors.text,
        fontFamily: Theme.fonts.interRegular,
        fontSize: Theme.fontSizes.body
    },
    buttonContainer: {
        flexDirection: 'row', 
        justifyContent: "center", 
        gap: 10
    },
    progressContainer: {
        alignItems: "center",
    },
    progressText: {
        color: Theme.colors.text,
        fontSize: Theme.fontSizes.title,
        fontFamily: Theme.fonts.interBold,
    },
    titleText: {
        color: Theme.colors.text,
        fontSize: Theme.fontSizes.title,
        fontFamily: Theme.fonts.interBold,
    },
    titleContainer: {
        alignItems: "center"
    },
    stateContainer: {
        alignItems: "center"
    },
    stateText: {
        color: Theme.colors.text,
        fontSize: Theme.fontSizes.body,
        fontFamily: Theme.fonts.interRegular,
    },
    pomodorosContainer: {
        alignItems: "center",
        gap: 6,
        flexDirection: "row",
        justifyContent: 'center'
    },
    pomodorosText: {
        color: Theme.colors.text,
        fontSize: Theme.fontSizes.body,
        fontFamily: Theme.fonts.interRegular,
    },
    pomodorosIndicator: {
        width: 20,
        height: 20,
        borderRadius: '100%',
        backgroundColor: Theme.colors.divider
    },
    pomodorosIndicatorComplete: {
        width: 20,
        height: 20,
        borderRadius: '100%',
        backgroundColor: Theme.colors.primary
    },
})