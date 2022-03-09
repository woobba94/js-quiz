// 결과값 저장 배열선언
const questions = [];
const subjects = [];
const inpAnswers = [];
const rightAnswers = [];
let right = 0;
let wrong = 0;
let isPause = false;

// 시작 > 출력 > input > 제출 > 정답박스 > 오답확인
const menualBox = document.querySelector('.box-manual');
const startBtn = document.querySelector('.btn-start');
const questionBox = document.querySelector('.question-area');
const inpAnswer = document.querySelector('.input-box');
const submitBtn = document.querySelector('.btn-submit');
const rightAnswerBox = document.querySelector('.right-answer-box');
const rightAnswerOutput = document.querySelector('.right-answer');
const wrongConfirmBtn = document.querySelector('.btn-confirm');
const floatingText = document.querySelector('.floating-text');
// 시작 > 제출(=input) > 오답확인
startBtn.addEventListener('click', testStart);
inpAnswer.addEventListener('keydown', enterKeydown);
submitBtn.addEventListener('click', successCheck);
wrongConfirmBtn.addEventListener('click', next);

// 콤보이펙트 준비
const comboMoniter = document.querySelector('.moniter');
const comboDisplay = document.querySelector('.combo-box');
const comboPlusText = document.querySelector('.combo-plus');

// 엔터키 버그 수정
const intervalCall300 = intervalCall(300);

// 닉네임 입력
const nickNameBox = document.querySelector('.box-nick-name');
const nickNameInput = document.querySelector('.nick-name-input');
const nickNameBtn = document.querySelector('.btn-nick-name');
nickNameBtn.addEventListener('click', nickNameConfirm);

// 점수 산출
const scoreArea = document.querySelector('.score-area');

// 객체와 클로저를 혼용하여 은닉
function counterFactory() {
  var _myScore = 0;

  function count(value) {
    _myScore = value ?? _myScore;
    if (_myScore < 0) _myScore = 0;
    return _myScore;
  }

  return {
    inc: function (combo) {
      return count(count() + 10 + combo);
    },
    dec: function () {
      return count(count() - 5);
    },
    result: function () {
      return _myScore;
    },
  };
}

var scoreCounter = counterFactory();

let nickName = '';
// 닉네임 제출
function nickNameConfirm() {
  // input이 비어있다면 실행 X
  if (isEmpty(nickNameInput)) return;
  nickName = nickNameInput.value;
  nickNameBox.style.zIndex = -3;
}

// 게임 시작버튼
function testStart() {
  // UI 렌더링 > 문제 시작
  startBtn.remove();
  menualBox.remove();
  goBtn.classList.remove('invisible');
  submitBtn.removeAttribute('disabled');
  inpAnswer.removeAttribute('readonly');
  comboDisplay.textContent = '0';
  next();
}

// 엔터키 입력 시 문제 제출
function enterKeydown(e) {
  if (e.code === 'Enter') {
    intervalCall300(() => {
      // 정지상태라면 엔터 -> next()
      if (isPause) {
        next();
      } else {
        successCheck();
      }
    });
  }
}
function intervalCall(interval) {
  // interval 시간 안에 다시 호출된 함수 콜은 무시한다
  let elapsed = true;
  return (fn) => {
    if (!elapsed) {
      return; // 마지막 호출 후 제한된 경과시간이 지나지 않은 경우 리턴
    }
    elapsed = false;
    fn();
    setTimeout(() => {
      elapsed = true;
    }, interval);
  };
}

// 제출
function successCheck() {
  // 답란이 비어있다면 실행 X
  if (isEmpty(inpAnswer)) return;
  // 사용자 입력 데이터 저장
  inpAnswers.push(inpAnswer.value);
  // 정/오답 분기
  if (isAnswer(questionBox.innerText, inpAnswer.value)) {
    floatingText.style.animation = null;
    scoreCounter.inc(combo);
    combo++;
    right++;
    showCombo(comboPlusText);
    checkCombo(combo);
    next();
  } else {
    scoreCounter.dec();
    combo = 0;
    wrong++;
    comboDisplay.style.color = 'white';
    checkCombo(combo);
    showRightAnswer();
  }
  scoreArea.innerHTML = `score : ${scoreCounter.result()}`;
  // 점수에따라 폰트변화
  if (1000 <= scoreCounter.result()) scoreArea.style.color = 'var(--color-font-2)';
  else if (500 <= scoreCounter.result()) scoreArea.style.color = 'var(--color-main-5)';
  else if (300 <= scoreCounter.result()) scoreArea.style.color = 'var(--color-main-4)';
  else if (100 <= scoreCounter.result()) scoreArea.style.color = 'var(--color-main-3)';
  else if (50 <= scoreCounter.result()) scoreArea.style.color = 'var(--color-main-2)';
  else if (25 <= scoreCounter.result()) scoreArea.style.color = 'var(--color-main-1)';
  else scoreArea.style.color = 'white';
}

// 정답일 경우
function next() {
  // 타이머 재시작 > 버튼 활성화 > 정답박스 접기 > 다음문제 출력
  reStartTimer();
  isPause = false;
  submitBtn.removeAttribute('disabled');
  inpAnswer.removeAttribute('readonly');
  rightAnswerBox.style.height = null;
  showQuestion();
  clearInputBox();
  inpAnswer.focus();
}

// 오답일 경우
function showRightAnswer() {
  // 타이머 정지 > 제출버튼 비활성화, 인풋박스 비활성화 > 정답박스 열기
  pauseTimer();
  isPause = true;
  submitBtn.setAttribute('disabled', true);
  inpAnswer.setAttribute('readonly', true);
  rightAnswerBox.style.height = '70px';
  // 정답박스 준비
  rightAnswerOutput.innerHTML = `정답 : ${getAnswer(questions[questions.length - 1])}`;
}

// 문제 출력
function showQuestion() {
  fetch('/data/data.json')
    .then((response) => response.json())
    .then((data) => {
      // 문제 데이터 저장 및 출력
      const [question, subject] = getQuestion(data);
      questionBox.innerHTML = question;
      // 결과에 사용 할 배열에 문제저장
      questions.push(question);
      subjects.push(subject);
      rightAnswers.push(getAnswer(question));
    });
}

// input 비어있는지 체크
function isEmpty(inputField) {
  if (inputField.value === '') {
    inputField.focus();
    return true;
  }
  return false;
}

// input 초기화
function clearInputBox() {
  inpAnswer.value = '';
}

// 최종 제출시 로컬스토리지에 데이터 저장 (버튼 클릭으로 테스트 -> 타이머 종료 구현시 수정)
const goBtn = document.querySelector('.go-result');
goBtn.addEventListener('click', saveandLoad);

// 입력 저장, 전송 후 결과 페이지로 전환
function saveandLoad() {
  localStorage.setItem('questions', JSON.stringify(questions));
  localStorage.setItem('subjects', JSON.stringify(subjects));
  localStorage.setItem('inpAnswers', JSON.stringify(inpAnswers));
  localStorage.setItem('rightAnswers', JSON.stringify(rightAnswers));
  localStorage.setItem('right', JSON.stringify(right));
  localStorage.setItem('wrong', JSON.stringify(wrong));
  localStorage.setItem('myScore', JSON.stringify(scoreCounter.result()));
  localStorage.setItem('nickName', JSON.stringify(nickName));
  // 테스트용 페이지 전환
  location.href = 'result.html';
  loadData();
}

function checkCombo(combo) {
  comboDisplay.textContent = `${combo}`;
  if (3 <= combo && combo < 7) {
    // effect-1
    comboDisplay.style.color = 'var(--color-font-1)';
    comboMoniter.classList += ' combo-1';
  } else if (7 <= combo) {
    // effect-2, TIME += 300 (3초);
    floating(floatingText);
    comboDisplay.style.color = 'var(--color-font-2)';
    comboMoniter.classList.remove('combo-1');
    comboMoniter.classList += ' combo-2';
    TIME += 300;
  } else {
    // 0~2 combo -> no effect
    comboMoniter.classList.remove('combo-1');
    comboMoniter.classList.remove('combo-2');
  }
}

function floating(element) {
  var y = 100;
  function frame() {
    y--;
    element.style.top = y + 50 + 'px';
    element.style.opacity = y / 100;
    if (y == 0) clearInterval(id);
  }
  var id = setInterval(frame, 10);
}

function showCombo(element) {
  var y = 10;
  function frame() {
    y--;
    element.style.zIndex = 1;
    if (y == 0) {
      element.style.zIndex = -1;
      clearInterval(id);
    }
  }
  var id = setInterval(frame, 100);
}
