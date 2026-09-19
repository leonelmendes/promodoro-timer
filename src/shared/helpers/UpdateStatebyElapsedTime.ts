

interface IAppState {
    step: 2 | 1 | 3 | 4;
    isPaused: boolean;
    isRunning: boolean;
    currentStatus: "focus" | "short_break" | "long_break";
    time: number;
    counterCircleTime: number;
    currentFocusCircleTime: number;
    currentShortBreakCircleTime: number;
    currentLongBreakCircleTime: number;
}

export const UpdateStateByElapsedTime = (appState: IAppState) :  IAppState => {

    if(!appState.isRunning || appState.isPaused){
        return appState;
    }

    const now = Date.now();
    const elapsedSeconds = Math.floor(now - (appState.time ?? now) / 1000);
    if (elapsedSeconds <=0 ) return appState;

    let remaining = appState.counterCircleTime;
    let timeLeft = remaining - elapsedSeconds;
    let currentStatus = appState.currentStatus;
    let step = appState.step;

    const advanceCycle = () => {
    if (currentStatus === 'focus') {
      if (step < 4) {
        step = (step + 1) as 1 | 2 | 3 | 4;
        currentStatus = 'short_break';
        return appState.currentShortBreakCircleTime;
      } else {
        step = 1;
        currentStatus = 'long_break';
        return appState.currentLongBreakCircleTime;
      }
    }

    if (currentStatus === 'short_break' || currentStatus === 'long_break') {
      currentStatus = 'focus';
      return appState.currentFocusCircleTime;
    }

    return remaining;
  };

  while (timeLeft <= 0) {
    const overflow = Math.abs(timeLeft);
    const nextTime = advanceCycle();

    timeLeft = nextTime - overflow;
  }


  return {
    ...appState,
    step,
    time: now,
    currentStatus,
    counterCircleTime: timeLeft,
  };
}