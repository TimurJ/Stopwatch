const setMinutes = document.getElementById("minutes");
const setSeconds = document.getElementById("seconds");
const setMilliseconds = document.getElementById("milliseconds");
const startStopButton = document.getElementById("startStop");
const resetLapButton = document.getElementById("resetLap");
const lapTable = document.getElementById("lapTable");

let startTime = null;
let requestId = null;
let started;
let ableToReset;

let milliseconds = 0;
let seconds = 0;
let minutes = 0;
let lapNumber = 0;
let elapsedTime = 0;

const stopwatch = (timestamp) => {
  if (!startTime) {
    startTime = timestamp;
  }
  elapsedTime = timestamp - startTime;
  convertedTime(elapsedTime);
  requestId = requestAnimationFrame(stopwatch);
};

const convertedTime = (time) => {
  milliseconds = Math.floor(time) % 1000;
  seconds = Math.floor(time / 1000) % 60;
  minutes = Math.floor(time / 60000) % 60;

  setMinutes.innerHTML = `${padNumbers(minutes)}:`;
  setSeconds.innerHTML = `${padNumbers(seconds)}.`;
  setMilliseconds.innerHTML = `${padNumbers(Math.floor(milliseconds / 10))}`;
};

const padNumbers = (number) => {
  return number.toString().padStart(2, 0);
};

const startStop = () => {
  if (!started) {
    requestAnimationFrame(stopwatch);
    startStopButton.innerHTML = "Stop";
    resetLapButton.innerHTML = "Lap";
    ableToReset = false;
    started = true;
  } else {
    cancelAnimationFrame(requestId);
    startStopButton.innerHTML = "Start";
    resetLapButton.innerHTML = "Reset";
    ableToReset = true;
    started = false;
  }
};

const resetLap = () => {
  if (ableToReset) {
    startTime = null;
    setMinutes.innerHTML = "00:";
    setSeconds.innerHTML = "00.";
    setMilliseconds.innerHTML = "00";
  } else {
    if (started) {
      saveLap();
    }
  }
};

const saveLap = () => {
  lapNumber++;
  let row = lapTable.insertRow(0);
  let setLapNumber = row.insertCell(0);
  var setLapTime = row.insertCell(1);
  setLapNumber.innerHTML = `Lap ${lapNumber}`;
  setLapTime.innerHTML = `${padNumbers(minutes)}:${padNumbers(
    seconds
  )}.${padNumbers(Math.floor(milliseconds / 10))}`;
};

startStopButton.onclick = startStop;
resetLapButton.onclick = resetLap;
