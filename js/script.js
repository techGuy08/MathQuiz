Array.prototype.shuffle = function () {
  var i = this.length,
    j,
    temp;
  if (i == 0) return this;
  while (--i) {
    j = Math.floor(Math.random() * (i + 1));
    temp = this[i];
    this[i] = this[j];
    this[j] = temp;
  }
  return this;
};
window.addEventListener("load", function () {
  const mathQuizEl = document.getElementById("mathQuiz");
  const mathQuizModalEl = document.getElementById("mathQuiz-modal");
  const QAData = [
    // {
    //   n1: 1,
    //   n2: 23,
    //   ans: 24,
    // },
    // {
    //   n1: 8,
    //   n2: 9,
    //   ans: 17,
    // },
  ];
  for (let i = 1; i <= 10; i++) {
    let n1 = Math.floor(Math.random() * (5 * i)) + 1;
    let n2 = Math.floor(Math.random() * (5 * i)) + 1;
    let ans = n1 * n2;
    let question = {
      n1,
      n2,
      ans,
    };
    QAData.push(question);
  }
  const progress = {
    question: 1,
    win: 0,
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
    AllAnswersHTML = AllAnswers.shuffle()
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
    let value = Number(e.target.innerHTML);
    if (QAData[index].ans === value) {
      e.target.classList.add("correct");
      progress.win++;
      progress.points += 2;
    } else {
      e.target.classList.add("wrong");
      progress.miss++;
    }
    progress.question++;
    ActiveButtons.forEach((btn) => {
      btn.disabled = true;
    });
    const nextBtn = AllQuestionsEl[index].querySelector(".mathQuiz-item_next");
    nextBtn.classList.add("active");
    nextBtn.onclick = function () {
      gotoQuestion(progress.question);
    };
    if (index === AllQuestionsEl.length - 1) {
      nextBtn.innerHTML = "Check Results";
      nextBtn.onclick = function (e) {
        mathQuizModalEl.classList.add("active");
        mathQuizModalEl.querySelector(".Res-wins").innerHTML = progress.win;
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
    progress.points = 0;
    progress.question = 1;
    progress.win = 0;
    gotoQuestion(1);
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
});
