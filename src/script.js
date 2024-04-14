const BreakDisplay = ({ time, onChange, modificator }) => {
  const { INCREASE, DECREASE } = modificator;

  return (
    <div className="timer__small-section">
      <p id="break-label" className="timer__small-label">
        Break Length
      </p>
      <div id="break-length" className="timer__small-display">
        <button
          type="button"
          id="break-decrement"
          className="button button_type_small"
          onClick={() => onChange(DECREASE)}
        >
          <i class="fas fa-chevron-down"></i>
        </button>
        <span className="timer__small-value">{time / 60}</span>
        <button
          type="button"
          id="break-increment"
          className="button button_type_small"
          onClick={() => onChange(INCREASE)}
        >
          <i class="fas fa-chevron-up"></i>
        </button>
      </div>
    </div>
  );
};

const SessionDisplay = ({ time, onChange, modificator }) => {
  const { INCREASE, DECREASE } = modificator;

  return (
    <div className="timer__small-section">
      <p id="session-label" className="timer__small-label">
        Session Length
      </p>
      <div id="session-length" className="timer__small-display">
        <button
          type="button"
          id="session-decrement"
          className="button button_type_small"
          onClick={() => onChange(DECREASE)}
        >
          <i class="fas fa-chevron-down"></i>
        </button>
        <span className="timer__small-value">{time / 60}</span>
        <button
          type="button"
          id="session-increment"
          className="button button_type_small"
          onClick={() => onChange(INCREASE)}
        >
          <i class="fas fa-chevron-up"></i>
        </button>
      </div>
    </div>
  );
};

const TimerButtons = ({ onStart, onReset, playSymbol }) => {
  return (
    <div className="timer__buttons">
      <button
        type="button"
        id="start_stop"
        className="button button_type_big"
        onClick={onStart}
      >
        {playSymbol}
      </button>
      <button
        type="button"
        id="reset"
        className="button button_type_big"
        onClick={onReset}
      >
        <i class="fas fa-undo-alt"></i>
      </button>
    </div>
  );
};

const TimerDisplay = ({ time, stage }) => {
  const formatTime = () => {
    let minutes = Math.floor(time / 60).toString();
    let seconds = (time % 60).toString();

    const formatTime = (val) => {
      if (val.length === 1) {
        return "0" + val;
      } else {
        return val;
      }
    };

    minutes = formatTime(minutes);
    seconds = formatTime(seconds);

    return minutes + ":" + seconds;
  };

  return (
    <div className="timer__display">
      <p id="timer-label" className="timer__label">
        {stage}
      </p>
      <div id="time-left" className="timer__time-left">
        {formatTime()}
      </div>
    </div>
  );
};

function App() {
  const [length, setLength] = React.useState({
    length: 1500,
    timer: 1500
  });
  const [breakLength, setBreakLength] = React.useState(300);
  const [runningId, setRunningId] = React.useState(0);
  const [stage, setStage] = React.useState("Session");

  const audioSignal = React.useRef();
  let breakRunning = React.useRef(false);

  const INCREASE = "INCREASE";
  const DECREASE = "DECREASE";

  const pauseSymbol = <i class="fas fa-pause"></i>;
  const playSymbol = <i class="fas fa-play"></i>;

  const changeLength = (modificator) => {
    if (runningId) return;
    const change = changeTime(modificator, length.length);
    setLength({
      length: change,
      timer: change
    });
  };

  const changeBreak = (modificator) => {
    if (runningId) return;
    setBreakLength(changeTime(modificator, breakLength));
  };

  const changeTime = (modificator, state) => {
    if (modificator === INCREASE) {
      if (state >= 3600) {
        return 3600;
      }
      return state + 60;
    } else if (modificator === DECREASE) {
      if (state <= 60) {
        return 60;
      }
      return state - 60;
    }
  };

  const switchTimer = React.useCallback(() => {
    let time;
    if (!breakRunning.current) {
      setStage("Break");
      time = breakLength + 1;
    } else {
      setStage("Session");
      time = length.length + 1;
    }
    breakRunning.current = !breakRunning.current;
    return time;
  }, [breakLength, length.length]);

  const startTimer = React.useCallback(
    (evt) => {
      evt.target.closest(".button").blur();

      let timer = length.timer;

      if (!runningId) {
        const timeoutId = setInterval(() => {
          timer -= 1;
          setLength({
            ...length,
            timer: timer
          });

          if (timer < 1) {
            timer = switchTimer();
            audioSignal.current.play();
          }
        }, 1000);
        setRunningId(timeoutId);
      } else {
        clearInterval(runningId);
        setRunningId(0);
      }
    },
    [length, runningId, switchTimer]
  );

  const reset = React.useCallback(
    (evt) => {
      evt.target.closest(".button").blur();

      audioSignal.current.currentTime = 0;
      audioSignal.current.pause();

      if (runningId) {
        clearInterval(runningId);
        setRunningId(0);
      }
      setLength({
        length: 1500,
        timer: 1500
      });
      setBreakLength(300);
      setStage("Session");
    },
    [runningId, audioSignal]
  );

  return (
    <div className="timer">
      <audio
        id="beep"
        ref={audioSignal}
        src="https://raw.githubusercontent.com/cat-street/pomodoro-timer-react/master/src/assets/audio.mp3"
      ></audio>
      <div className="timer__top">
        <BreakDisplay
          time={breakLength}
          onChange={changeBreak}
          modificator={{ INCREASE, DECREASE }}
        />
        <SessionDisplay
          time={length.length}
          onChange={changeLength}
          modificator={{ INCREASE, DECREASE }}
        />
      </div>
      <TimerDisplay time={length.timer} stage={stage} />
      <TimerButtons
        onStart={startTimer}
        onReset={reset}
        playSymbol={runningId ? pauseSymbol : playSymbol}
      />
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
