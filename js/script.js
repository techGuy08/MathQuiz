window.addEventListener("load", function () {
  const mathQuizEl = document.querySelector("#mathQuiz .mathQuiz-body");
  const mathQuizModalEl = document.getElementById("mathQuiz-modal");
  const timerEl = document.querySelector(".mathQuiz-timer");
  const QAData = generateQuestions(10);

  const progress = {
    question: 1,
    win: 0,
    wrong: 0,
    miss: 0,
    points: 0,
  };
  QAData.forEach((el, i) => {
    let Qnumber = i + 1;
    let limitAnswersTo = 3;
    let AllAnswers = [el.ans];
    while (AllAnswers.length < limitAnswersTo) {
      let random = Math.floor(Math.random() * (el.ans * 2));
      if (!AllAnswers.includes(random)) {
        AllAnswers.push(random);
      }
    }
    console.log(shuffleArray(AllAnswers));
    AllAnswersHTML = shuffleArray(AllAnswers)
      .map((el) => `<button class="mathQuiz_answers-item">${el}</button>`)
      .join("");
    let QHTML = `
      <div class="mathQuiz-item ${i === 0 ? "active" : ""}">
      <header class="mathQuiz_header">
        <h2 class="mathQuiz_question-text">
          Question <span class="mathQuiz_question-number">${Qnumber}</span>:
          <br />
          <span class="mathQuiz_question-n1">${el.n1}</span>
          X
          <span class="mathQuiz_question-n2">${el.n2}</span>?
        </h2>
      </header>
      <div class="mathQuiz_body">
        <div class="mathQuiz_answers">
         ${AllAnswersHTML}
        </div>
      </div>
      <div class="mathQuiz_footer">
        <button class="mathQuiz-item_next">Next</button>
      </div>
    </div>
      `;
    mathQuizEl.insertAdjacentHTML("beforeend", QHTML);
  });
  const AllQuestionsEl = document.querySelectorAll(".mathQuiz-item");
  function answerBtnClick(e) {
    const ActiveButtons = document.querySelectorAll(
      ".mathQuiz-item.active .mathQuiz_answers-item"
    );
    let index = progress.question - 1;
    let nextIndex = index + 1;
    isTimer = false;
    let value = Number(e.target.innerHTML);
    if (QAData[index].ans === value) {
      e.target.classList.add("correct");
      progress.win++;
      progress.points += 2;
    } else {
      e.target.classList.add("wrong");
      progress.wrong++;
    }
    showNextBtnfor(progress.question);
    progress.question++;
  }
  function showNextBtnfor(n) {
    const index = n - 1;
    if (n < 1 || n > AllQuestionsEl.length) return false;
    const nextBtn = AllQuestionsEl[index].querySelector(".mathQuiz-item_next");
    const ActiveButtons = document.querySelectorAll(
      ".mathQuiz-item.active .mathQuiz_answers-item"
    );
    ActiveButtons.forEach((btn) => {
      btn.disabled = true;
    });
    nextBtn.classList.add("active");
    nextBtn.onclick = function () {
      gotoQuestion(progress.question);
      isTimer = true;
      timerValue = 30;
      updateTimer(timerValue);
    };
    if (index === AllQuestionsEl.length - 1) {
      nextBtn.innerHTML = "Check Results";
      nextBtn.onclick = function (e) {
        mathQuizModalEl.classList.add("active");
        mathQuizModalEl.querySelector(".Res-wins").innerHTML = progress.win;
        mathQuizModalEl.querySelector(".Res-wrong").innerHTML = progress.wrong;
        mathQuizModalEl.querySelector(".Res-miss").innerHTML = progress.miss;
        mathQuizModalEl.querySelector(".Res-score").innerHTML =
          progress.points + " / " + QAData.length * 2;
        mathQuizModalEl.querySelector(".mathQuiz-reset").onclick = ResetQuiz;
      };
    }
  }
  function gotoQuestion(n) {
    const index = n >= 0 && n <= AllQuestionsEl.length ? n - 1 : null;
    if (index === null) return false;
    AllQuestionsEl.forEach((el) => el.classList.remove("active"));
    AllQuestionsEl[index].classList.add("active");
    AllQuestionsEl[index]
      .querySelectorAll(".mathQuiz_answers-item")
      .forEach((btn) => (btn.onclick = answerBtnClick));
  }
  function ResetQuiz() {
    progress.miss = 0;
    progress.wrong = 0;
    progress.points = 0;
    progress.question = 1;
    progress.win = 0;
    isTimer = true;
    timerValue = 30;
    gotoQuestion(1);
    updateTimer(timerValue);
    mathQuizModalEl.classList.remove("active");
    document.querySelectorAll(".mathQuiz_answers-item").forEach((btn) => {
      btn.classList.remove("correct");
      btn.classList.remove("wrong");
      btn.disabled = false;
    });
    document.querySelectorAll(".mathQuiz-item_next").forEach((btn) => {
      btn.classList.remove("active");
    });
  }
  gotoQuestion(progress.question);
  mathQuizModalEl.querySelector(".bg").onclick = function () {
    mathQuizModalEl.classList.remove("active");
  };
  function generateQuestions(amount) {
    const arr = [];
    for (let i = 1; i <= amount; i++) {
      let n1 = Math.floor(Math.random() * (5 * i)) + 1;
      let n2 = Math.floor(Math.random() * (5 * i)) + 1;
      let ans = n1 * n2;
      let question = {
        n1,
        n2,
        ans,
      };
      arr.push(question);
    }
    return arr;
  }
  function shuffleArray(arr) {
    if (arr.length == 0) return arr;
    for (let i = arr.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * i);
      let temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }
  let timerValue = 30;
  let isTimer = true;
  updateTimer(timerValue);
  let timerCounter = setInterval(function () {
    if (isTimer) {
      if (timerValue > 0) timerValue--;
      updateTimer(timerValue);
      if (timerValue === 0 && progress.question < QAData.length) {
        progress.question++;
        timerValue = 30;
        progress.miss++;
        gotoQuestion(progress.question);
        updateTimer(timerValue);
      } else if (timerValue === 0 && progress.question === QAData.length) {
        isTimer = false;
        progress.miss++;
        showNextBtnfor(progress.question);
      }
    }
  }, 1000);
  function updateTimer(value) {
    timerEl.innerHTML = value + "s";
    if (timerValue <= 10) {
      timerEl.classList.add("red");
    } else {
      timerEl.classList.remove("red");
    }
  }
});
