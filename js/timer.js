const timer = document.querySelector('.timer');
const bettery = document.querySelector('.bettery-area>i');
let interval;
let betteryInterval;

let betteryCount = 1;
// 시간 기준 6000 : 1 min
const MAX_TIME = 18000;
// centisecond 단위로 입력
let TIME = MAX_TIME; // -> time limit 3분으로 설정

let checkMinutes = Math.floor(TIME / 6000);
let minute = checkMinutes % 6000;
let second = Math.floor((TIME % 6000) / 100);
let centisecond = TIME % 100;

let combo = 0;

// 타이머 리셋 (남은 시간을 3분으로 설정)
function resetTimer() {
  TIME = MAX_TIME;
}

// 타이머 시작 (리셋 및 시간줄이기)
function startTimer() {
  resetTimer();
  interval = setInterval(updateTimer, 10);
  // 성능을 위해 변경 : 1초마다 수행 -> 3초 마다 수행
  betteryInterval = setInterval(updateBettery, 3000);
  // 10ms(10centisecond)마다 updateTimer 실행
}

// 타이머 일시정지
function pauseTimer() {
  clearInterval(interval);
  clearInterval(betteryInterval);
}

// 타이머 재시작
function reStartTimer() {
  if (interval) {
    clearInterval(interval);
    clearInterval(betteryInterval);
  }
  interval = setInterval(updateTimer, 10);
  betteryInterval = setInterval(updateBettery, 3000);
}

function updateBettery() {
  // 기준 시간에 대한 비율
  let timeData = (TIME / MAX_TIME) * 100;
  if (60 <= timeData && timeData < 80) {
    bettery.classList.replace('fa-battery-full', 'fa-battery-three-quarters');
  } else if (40 <= timeData) {
    bettery.classList.replace('fa-battery-three-quarters', 'fa-battery-half');
  } else if (20 <= timeData) {
    bettery.classList.replace('fa-battery-half', 'fa-battery-quarter');
  } else {
    timer.classList += ' bounce-bounce';
    bettery.classList += ' bounce-bounce';
    bettery.classList.replace('fa-battery-quarter', 'fa-battery-empty');
  }
}

// 타이머 업데이트 (시간 html에 표시 및 남은시간 줄이기)
function updateTimer() {
  checkMinutes = Math.floor(TIME / 6000);
  minute = checkMinutes % 6000;
  second = Math.floor((TIME % 6000) / 100);
  centisecond = TIME % 100;

  timer.textContent = `
    ${minute < 10 ? `0${minute}` : minute}:
    ${second < 10 ? `0${second}` : second}:
    ${centisecond < 10 ? `0${centisecond}` : centisecond}
  `;

  TIME--;

  if (TIME < 0) {
    pauseTimer();
    saveandLoad();
  }
}
