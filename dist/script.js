const BreakDisplay = ({ time, onChange, modificator }) => {
  const { INCREASE, DECREASE } = modificator;

  return /*#__PURE__*/(
    React.createElement("div", { className: "timer__small-section" }, /*#__PURE__*/
    React.createElement("p", { id: "break-label", className: "timer__small-label" }, "Break Length"), /*#__PURE__*/


    React.createElement("div", { id: "break-length", className: "timer__small-display" }, /*#__PURE__*/
    React.createElement("button", {
      type: "button",
      id: "break-decrement",
      className: "button button_type_small",
      onClick: () => onChange(DECREASE) }, /*#__PURE__*/

    React.createElement("i", { class: "fas fa-chevron-down" })), /*#__PURE__*/

    React.createElement("span", { className: "timer__small-value" }, time / 60), /*#__PURE__*/
    React.createElement("button", {
      type: "button",
      id: "break-increment",
      className: "button button_type_small",
      onClick: () => onChange(INCREASE) }, /*#__PURE__*/

    React.createElement("i", { class: "fas fa-chevron-up" })))));




};

const SessionDisplay = ({ time, onChange, modificator }) => {
  const { INCREASE, DECREASE } = modificator;

  return /*#__PURE__*/(
    React.createElement("div", { className: "timer__small-section" }, /*#__PURE__*/
    React.createElement("p", { id: "session-label", className: "timer__small-label" }, "Session Length"), /*#__PURE__*/


    React.createElement("div", { id: "session-length", className: "timer__small-display" }, /*#__PURE__*/
    React.createElement("button", {
      type: "button",
      id: "session-decrement",
      className: "button button_type_small",
      onClick: () => onChange(DECREASE) }, /*#__PURE__*/

    React.createElement("i", { class: "fas fa-chevron-down" })), /*#__PURE__*/

    React.createElement("span", { className: "timer__small-value" }, time / 60), /*#__PURE__*/
    React.createElement("button", {
      type: "button",
      id: "session-increment",
      className: "button button_type_small",
      onClick: () => onChange(INCREASE) }, /*#__PURE__*/

    React.createElement("i", { class: "fas fa-chevron-up" })))));




};

const TimerButtons = ({ onStart, onReset, playSymbol }) => {
  return /*#__PURE__*/(
    React.createElement("div", { className: "timer__buttons" }, /*#__PURE__*/
    React.createElement("button", {
      type: "button",
      id: "start_stop",
      className: "button button_type_big",
      onClick: onStart },

    playSymbol), /*#__PURE__*/

    React.createElement("button", {
      type: "button",
      id: "reset",
      className: "button button_type_big",
      onClick: onReset }, /*#__PURE__*/

    React.createElement("i", { class: "fas fa-undo-alt" }))));



};

const TimerDisplay = ({ time, stage }) => {
  const formatTime = () => {
    let minutes = Math.floor(time / 60).toString();
    let seconds = (time % 60).toString();

    const formatTime = val => {
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

  return /*#__PURE__*/(
    React.createElement("div", { className: "timer__display" }, /*#__PURE__*/
    React.createElement("p", { id: "timer-label", className: "timer__label" },
    stage), /*#__PURE__*/

    React.createElement("div", { id: "time-left", className: "timer__time-left" },
    formatTime())));



};

function App() {
  const [length, setLength] = React.useState({
    length: 1500,
    timer: 1500 });

  const [breakLength, setBreakLength] = React.useState(300);
  const [runningId, setRunningId] = React.useState(0);
  const [stage, setStage] = React.useState("Session");

  const audioSignal = React.useRef();
  let breakRunning = React.useRef(false);

  const INCREASE = "INCREASE";
  const DECREASE = "DECREASE";

  const pauseSymbol = /*#__PURE__*/React.createElement("i", { class: "fas fa-pause" });
  const playSymbol = /*#__PURE__*/React.createElement("i", { class: "fas fa-play" });

  const changeLength = modificator => {
    if (runningId) return;
    const change = changeTime(modificator, length.length);
    setLength({
      length: change,
      timer: change });

  };

  const changeBreak = modificator => {
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
  evt => {
    evt.target.closest(".button").blur();

    let timer = length.timer;

    if (!runningId) {
      const timeoutId = setInterval(() => {
        timer -= 1;
        setLength({
          ...length,
          timer: timer });


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
  [length, runningId, switchTimer]);


  const reset = React.useCallback(
  evt => {
    evt.target.closest(".button").blur();

    audioSignal.current.currentTime = 0;
    audioSignal.current.pause();

    if (runningId) {
      clearInterval(runningId);
      setRunningId(0);
    }
    setLength({
      length: 1500,
      timer: 1500 });

    setBreakLength(300);
    setStage("Session");
  },
  [runningId, audioSignal]);


  return /*#__PURE__*/(
    React.createElement("div", { className: "timer" }, /*#__PURE__*/
    React.createElement("audio", {
      id: "beep",
      ref: audioSignal,
      src: "https://raw.githubusercontent.com/cat-street/pomodoro-timer-react/master/src/assets/audio.mp3" }), /*#__PURE__*/

    React.createElement("div", { className: "timer__top" }, /*#__PURE__*/
    React.createElement(BreakDisplay, {
      time: breakLength,
      onChange: changeBreak,
      modificator: { INCREASE, DECREASE } }), /*#__PURE__*/

    React.createElement(SessionDisplay, {
      time: length.length,
      onChange: changeLength,
      modificator: { INCREASE, DECREASE } })), /*#__PURE__*/


    React.createElement(TimerDisplay, { time: length.timer, stage: stage }), /*#__PURE__*/
    React.createElement(TimerButtons, {
      onStart: startTimer,
      onReset: reset,
      playSymbol: runningId ? pauseSymbol : playSymbol })));



}

ReactDOM.render( /*#__PURE__*/
React.createElement(React.StrictMode, null, /*#__PURE__*/
React.createElement(App, null)),

document.getElementById("root"));