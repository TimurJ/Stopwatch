const setTime = document.getElementById("setTime")
const lapTable = document.getElementById("lapTable")

const startStopButton = document.getElementById("startStopButton")
const resetLapButton = document.getElementById("resetLapButton")

let setActiveLapNumber
let setActiveLapTime
let setLapNumber
let setLapTime
let lapRow

let startTime = null
let requestId = null
let started = false
let ableToReset = false
let lapActive = false

let milliseconds = 0
let seconds = 0
let minutes = 0
let elapsedTime = 0
let stopTime = 0

let lapNumber = 0
let lapTime = 0
let lapResetTime = 0
let previousLapTime = 0
let fastestLap = 0
let slowestLap = 0

const timer = (timestamp) => {
  if (!startTime) {
    startTime = timestamp
  }

  elapsedTime = timestamp + stopTime - startTime

  setTime.innerHTML = convertTime(elapsedTime)

  setActiveLapTime.innerHTML = convertTime(elapsedTime - lapResetTime)

  requestId = requestAnimationFrame(timer)
}

const convertTime = (time) => {
  milliseconds = Math.floor(time) % 1000
  seconds = Math.floor(time / 1000) % 60
  minutes = Math.floor(time / 60000) % 60

  return `${padNumbers(minutes)}:${padNumbers(seconds)}.${padNumbers(Math.floor(milliseconds / 10))}`
}

const padNumbers = (number) => {
  return number.toString().padStart(2, 0)
}

const start = () => {
  requestAnimationFrame(timer)
  resetLapButton.innerHTML = "Lap"
  ableToReset = false
  started = true
}

const stop = () => {
  cancelAnimationFrame(requestId)

  ableToReset = true
  started = false
  startTime = null

  stopTime = elapsedTime
}

const reset = () => {
  elapsedTime = null
  lapActive = false

  lapResetTime = 0
  lapNumber = 0
  stopTime = 0
  previousLapTime = 0
  fastestLap = 0
  slowestLap = 0

  setTime.innerHTML = "00:00.00"
}

const resetTable = () => {
  lapTable.innerHTML = ""
  for (let i = 0; i < 7; i++) {
    const row = lapTable.insertRow(0)
    const setFirstCell = row.insertCell(0)
    const setSecondCell = row.insertCell(1)
    setFirstCell.innerHTML = ""
    setSecondCell.innerHTML = ""
  }
}

const createActiveLap = () => {
  if (!lapActive) {
    const row = lapTable.insertRow(0)
    setActiveLapNumber = row.insertCell(0)
    setActiveLapTime = row.insertCell(1)

    lapTable.deleteRow(6)

    setActiveLapNumber.innerHTML = `Lap 1`
  }
  lapActive = true
}

const saveLap = () => {
  lapRow = lapTable.insertRow(1)
  setLapNumber = lapRow.insertCell(0)
  setLapTime = lapRow.insertCell(1)

  if (lapNumber < 6) {
    lapTable.deleteRow(lapNumber + 2)
  }

  lapNumber++
  lapResetTime = elapsedTime

  lapTime = elapsedTime - previousLapTime
  previousLapTime = elapsedTime

  setLapNumber.innerHTML = `Lap ${lapNumber}`
  setLapTime.innerHTML = convertTime(lapTime)
  setActiveLapNumber.innerHTML = `Lap ${lapNumber + 1}`
}

const fastestSlowestLap = () => {
  const lapTableRowOne = lapTable.rows[1]
  const lapTableRowTwo = lapTable.rows[2]

  if (!fastestLap) {
    fastestLap = lapTime
  }

  if (lapNumber === 2) {
    if (fastestLap > lapTime) {
      slowestLap = fastestLap
      fastestLap = lapTime
      lapTableRowOne.classList.add("fastestLap")
      lapTableRowTwo.classList.add("slowestLap")
    } else {
      slowestLap = lapTime
      lapTableRowOne.classList.add("slowestLap")
      lapTableRowTwo.classList.add("fastestLap")
    }
  }

  if (lapNumber > 2) {
    if (fastestLap && lapTime < fastestLap) {
      fastestLap = lapTime
      $("#lapTable tr").removeClass("fastestLap")
      lapRow.classList.add("fastestLap")
    }

    if (slowestLap && lapTime > slowestLap) {
      slowestLap = lapTime
      $("#lapTable tr").removeClass("slowestLap")
      lapRow.classList.add("slowestLap")
    }
  }
}

const changeToStopButton = () => {
  startStopButton.classList.remove("startButton")
  startStopButton.classList.add("stopButton")
  startStopButton.innerHTML = "Stop"
}

const changeToStartButton = () => {
  startStopButton.classList.remove("stopButton")
  startStopButton.classList.add("startButton")
  startStopButton.innerHTML = "Start"
}

const activateLapButton = () => {
  resetLapButton.classList.remove("initialLapButton")
  resetLapButton.classList.add("resetLapButton")
  resetLapButton.innerHTML = "Lap"
}

const deactivateLapButton = () => {
  resetLapButton.classList.remove("resetLapButton")
  resetLapButton.classList.add("initialLapButton")
  resetLapButton.innerHTML = "Lap"
}

const changeToResetButton = () => {
  resetLapButton.innerHTML = "Reset"
}

startStopButton.onclick = () => {
  if (!started) {
    createActiveLap()
    start()
    changeToStopButton()
    activateLapButton()
  } else {
    stop()
    changeToStartButton()
    changeToResetButton()
  }
}

resetLapButton.onclick = () => {
  if (ableToReset) {
    reset()
    resetTable()
    deactivateLapButton()
  } else {
    saveLap()
    fastestSlowestLap()
  }
}
