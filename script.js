const setTime = document.getElementById("setTime");
const lapTable = document.getElementById("lapTable");
let setActiveLapNumber;
let setActiveLapTime;

const startStopButton = document.getElementById("startStopButton");
const resetLapButton = document.getElementById("resetLapButton");

let startTime = null;
let requestId = null;
let started = false;
let ableToReset = false;
let lapActive = false;

let milliseconds = 0;
let seconds = 0;
let minutes = 0;
let lapNumber = 0;
let elapsedTime = 0;
let stopTime = 0;
let lapResetTime = 0;
let lapTime = 0;
let previousLapTime = 0;

const timer = (timestamp) => {
  if (!startTime) {
    startTime = timestamp;
  }

  elapsedTime = timestamp + stopTime - startTime;

  setTime.innerHTML = convertTime(elapsedTime);

  setActiveLapTime.innerHTML = convertTime(elapsedTime - lapResetTime);

  requestId = requestAnimationFrame(timer);
};

const convertTime = (time) => {
  milliseconds = Math.floor(time) % 1000;
  seconds = Math.floor(time / 1000) % 60;
  minutes = Math.floor(time / 60000) % 60;

  return `${padNumbers(minutes)}:${padNumbers(seconds)}.${padNumbers(
    Math.floor(milliseconds / 10)
  )}`;
};

const padNumbers = (number) => {
  return number.toString().padStart(2, 0);
};

const start = () => {
  requestAnimationFrame(timer);
  startStopButton.innerHTML = "Stop";
  resetLapButton.innerHTML = "Lap";
  ableToReset = false;
  started = true;
};

const stop = () => {
  cancelAnimationFrame(requestId);

  ableToReset = true;
  started = false;
  startTime = null;

  stopTime = elapsedTime;

  startStopButton.innerHTML = "Start";
  resetLapButton.innerHTML = "Reset";
};

const reset = () => {
  elapsedTime = null;
  lapActive = false;

  lapResetTime = 0;
  lapNumber = 0;
  stopTime = 0;
  previousLapTime = 0;

  setTime.innerHTML = "00:00.00";
  lapTable.innerHTML = "";
};

const createActiveLap = () => {
  if (!lapActive) {
    const row = lapTable.insertRow(0);
    setActiveLapNumber = row.insertCell(0);
    setActiveLapTime = row.insertCell(1);

    setActiveLapNumber.innerHTML = `Lap 1`;
  }
  lapActive = true;
};

const saveLap = () => {
  const row = lapTable.insertRow(1);
  const setLapNumber = row.insertCell(0);
  const setLapTime = row.insertCell(1);

  lapNumber++;
  lapResetTime = elapsedTime;

  lapTime = elapsedTime - previousLapTime;
  previousLapTime = elapsedTime;

  setLapNumber.innerHTML = `Lap ${lapNumber}`;
  setLapTime.innerHTML = convertTime(lapTime);
  setActiveLapNumber.innerHTML = `Lap ${lapNumber + 1}`;
};

const fastestSlowestLap = () => {};

startStopButton.onclick = () => {
  if (!started) {
    createActiveLap();
    start();
  } else {
    stop();
  }
};

resetLapButton.onclick = () => {
  if (ableToReset) {
    reset();
  } else {
    saveLap();
  }
};
