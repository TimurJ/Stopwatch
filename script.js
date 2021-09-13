let elapsedTime = 0;
let previousTime = 0;
let interval = null;
let ableToReset = false;

stopwatch = () => {
  temporaryTime = interval;
  let milliseconds = temporaryTime % 60;
  temporaryTime = Math.floor(temporaryTime / 60);
  let seconds = temporaryTime % 60;
  temporaryTime = Math.floor(temporaryTime / 60);
  let minutes = temporaryTime % 60;

  document.getElementById("time").innerHTML = `${padNumbers(
    minutes
  )}:${padNumbers(seconds)}.${milliseconds}`;

  interval = requestAnimationFrame(stopwatch);
};

padNumbers = (nums) => {
  return nums.toString().padStart(2, 0);
};

start = () => {
  interval = requestAnimationFrame(stopwatch);
};

stop = () => {
  cancelAnimationFrame(interval);
};

reset = () => {
  milliseconds = 0;
};
