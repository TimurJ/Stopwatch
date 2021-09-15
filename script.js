const setMinutes = document.getElementById("minutes");
const setSeconds = document.getElementById("seconds");
const setMilliseconds = document.getElementById("milliseconds");
const setTime = document.getElementById("time");
const startStopButton = document.getElementById("startStop");
const resetLapButton = document.getElementById("resetLap");
const lapTable = document.getElementById("lapTable");

let startTime = null;
let requestId = null;
let started;
let paused;
let ableToReset;

let milliseconds = 0;
let seconds = 0;
let minutes = 0;
let lapNumber = 0;
let elapsedTime = 0;
let stopTime = 0;
let lastLapTime = 0;

const stopwatch = (timestamp) => {
  if (!startTime) {
    startTime = timestamp;
  }

  if (started && !paused) {
    elapsedTime = timestamp - startTime - stopTime;

    requestAnimationFrame(stopwatch);
  } else if (started && paused) {
    stopTime = timestamp - startTime - elapsedTime;

    elapsedTime = timestamp - startTime - stopTime;

    paused = false;

    requestAnimationFrame(stopwatch);
  }

  displayTime(elapsedTime);
};

const displayTime = (time) => {
  convertTime(time);
  setTime.innerHTML = `${padNumbers(minutes)}:${padNumbers(
    seconds
  )}.${padNumbers(Math.floor(milliseconds / 10))}`;
};

const convertTime = (time) => {
  milliseconds = Math.floor(time) % 1000;
  seconds = Math.floor(time / 1000) % 60;
  minutes = Math.floor(time / 60000) % 60;
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
    startStopButton.innerHTML = "Start";
    resetLapButton.innerHTML = "Reset";
    ableToReset = true;
    started = false;
    paused = true;
  }
};

const resetLap = () => {
  if (ableToReset) {
    elapsedTime = null;
    setTime.innerHTML = "00:00.00";
    lapNumber = 0;
    lapTable.innerHTML = "";
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
  let setLapTime = row.insertCell(1);
  setLapNumber.innerHTML = `Lap ${lapNumber}`;
  setLapTime.innerHTML = `${padNumbers(minutes)}:${padNumbers(
    seconds
  )}.${padNumbers(Math.floor(milliseconds / 10))}`;
};

startStopButton.onclick = startStop;
resetLapButton.onclick = resetLap;
