let right = 0;
let wrong = 0;

const showBtn = document.querySelector('.showResult');
const myScore = document.querySelector('.score');
//우진테스트
const studyBtn = document.querySelector('.studyBtn');
const resultSlider = document.querySelector('.result-slider');
studyBtn.addEventListener('click', showStudy);
const sliderItemWidth = 400;
let left = 0;
let childCount = 0;
let nowCount = 0;
const nextSlideBtn = document.querySelector('.btn-next-slide');
const prevSlideBtn = document.querySelector('.btn-prev-slide');

// 로컬스토리지에서 데이터 불러오기
function getData() {
  questions = JSON.parse(localStorage.getItem('questions'));
  inpAnswers = JSON.parse(localStorage.getItem('inpAnswers'));
  rightAnswers = JSON.parse(localStorage.getItem('rightAnswers'));
}

// 결과
showBtn.addEventListener('click', function showResult() {
  getData();
  // console.log(questions, inpAnswers);
  calResult();
  myScore.innerHTML = `<br/>${right} 개 맞추고<br /> ${wrong} 개 틀렸습니다!`;

  // 버튼 누르면 결과보이기
  showBtn.disabled = true;
  showBtn.classList.remove('btn-join');
  showBtn.innerHTML = '<h1>👏 👏 👏</h1>';
});

// 맞은 개수, 틀린 개수 계산
function calResult() {
  for (let i = 0; i < inpAnswers.length; i++) {
    isAnswer(questions[i], inpAnswers[i]) ? (right += 1) : (wrong += 1);
  }
}

// 여기부터 우진테스트

function createStudyList(resultSlider) {
  for (let i = 0; i < inpAnswers.length; i++) {
    // 틀린 문제만 요소로 생성
    if (isAnswer(questions[i], inpAnswers[i])) continue;
    childCount++;
    // 들어갈 요소 생성
    const resultQuestions = document.createElement('div');
    const resultRightAnswers = document.createElement('div');
    const resultInpAnswers = document.createElement('div');
    const resultChild = document.createElement('div');
    resultChild.className += 'slider_contents';
    // 문제
    resultQuestions.textContent = questions[i];
    resultChild.appendChild(resultQuestions);
    // 정답
    resultRightAnswers.textContent = `정답 : ${rightAnswers[i]}`;
    resultChild.appendChild(resultRightAnswers);
    // 답변
    resultInpAnswers.textContent = `내 제출 : ${inpAnswers[i]}`;
    resultChild.appendChild(resultInpAnswers);
    // 한 문제의 결과박스 슬라이더에 추가
    resultSlider.appendChild(resultChild);
  }
  btnVisible(nextSlideBtn);
  resultSlider.style.width = childCount * sliderItemWidth + 'px';
}

function showStudy() {
  getData();
  calResult();
  studyBtn.style.display = 'none';
  // 틀린 문제가 없을 경우
  if (!wrong) {
    resultSlider.innerHTML = '<p>틀린 문제가 없습니다..</p>';
    return;
  }
  btnVisible(nextSlideBtn);
  createStudyList(resultSlider);
}
function prevSlider() {
  nowCount--;
  left += sliderItemWidth;
  checkListCount();
  resultSlider.style.left = left + 'px';
}

function nextSlider() {
  nowCount++;
  left -= sliderItemWidth;
  checkListCount();
  resultSlider.style.left = left + 'px';
}

function checkListCount() {
  // 마지막 카운트
  if (nowCount === childCount - 1) {
    btnInvisible(nextSlideBtn);
  } else btnVisible(nextSlideBtn);

  if (nowCount === 0) btnInvisible(prevSlideBtn);
  else btnVisible(prevSlideBtn);
}

function btnVisible(btn) {
  btn.classList.replace('invisible', 'visible');
  btn.removeAttribute('disabled');
}

function btnInvisible(btn) {
  btn.classList.replace('visible', 'invisible');
  btn.setAttribute('disabled', true);
}
