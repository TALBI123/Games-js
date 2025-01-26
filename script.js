const progresbar = document.querySelector(".time > .progress-bar");
const numberOfQuestion = document.querySelector(".num-of-question");
const answersParent = document.querySelectorAll(".answers > *");
const timesChoice = document.querySelector(".container-times");
const topics = document.querySelector(".container-topics");
const difficulty = document.querySelector(".difficulty");
const timeBar = document.querySelector(".number-time");
const questionNum = document.querySelector("span.num");
const question = document.querySelector(".question");
const answers = document.querySelectorAll(".answer");
const panel = document.querySelector(".panel-game");
const choice = document.querySelector(".choice");
const start = document.querySelector(".start");
const score = document.querySelector(".score");
let choices = {
  topic: "",
  numQuesstion: 0,
  diffclt: "",
  time: "",
};
let questionNumber = 0;
let numberOfCorrectAnswer = 0;
let isClicked = false;
let isSelected = false;
let timeIsFinished = false;
let time;
let correctAnswer;
const objApi = (amount, diff) => {
  return [
    {
      topic: "Vehicles",
      api: `https://opentdb.com/api.php?amount=${amount}&category=28&difficulty=${diff}&type=multiple`,
    },
    {
      topic: "Film",
      api: `https://opentdb.com/api.php?amount=${amount}&category=11&difficulty=${diff}&type=multiple`,
    },
    {
      topic: "History",
      api: `https://opentdb.com/api.php?amount=${amount}&category=23&difficulty=${diff}&type=multiple`,
    },
    {
      topic: "Animals",
      api: `https://opentdb.com/api.php?amount=${amount}&type=multiple&difficulty=${diff}`,
    },
    {
      topic: "Sports",
      api: `https://opentdb.com/api.php?amount=${amount}&category=21&difficulty=${diff}&type=multiple`,
    },
  ];
};
const removeSmothly = (obj1, obj2) => {
  obj1.classList.add("show-smothly");
  setTimeout(() => {
    obj1.classList.add("disabled");
    if (obj2.classList.contains("show-smothly"))
      obj2.classList.remove("show-smothly");
    obj2.classList.remove("disabled");
  }, 700);
};
const progressBar = (value) => {
  progresbar.style.width = `${(value / choices.time) * 100}%`;
  document.querySelector(".number-time").innerHTML = `${value}`;
};
const setData = (Question, correctAnswer, worongAnswers) => {
  const indexAnswer = Math.floor(Math.random() * answers.length);
  let count = 0;
  question.textContent = Question;
  answers[indexAnswer].textContent = correctAnswer;
  [...answers]
    .filter((_, index) => index != indexAnswer)
    .forEach((elm) => {
      elm.textContent = worongAnswers[count++];
    });
};
async function getQuestionsAndAnswers(numOfQuestion, difficult, topic) {
  const url = objApi(numOfQuestion, difficult).filter(
    (obj) => obj.topic == topic
  )[0].api;
  const response = await fetch(url);
  const data = (await response.json()).results;
  correctAnswer = data[questionNumber].correct_answer;
  setData(
    data[questionNumber].question,
    data[questionNumber].correct_answer,
    data[questionNumber++].incorrect_answers
  );
  console.log(questionNumber+1);
  let SEC = choices.time;
  time = setInterval(() => {
    SEC = SEC > 0 && SEC >= 9 ? `0${SEC}` : SEC;
    progressBar(SEC--);
    if (SEC < 0) {
      const CORRECT_INDEX = [...answers].findIndex(
        (answer) => answer.textContent === correctAnswer
      );
      clearInterval(time);
      isClicked = true;
      isSelected = true;
      answersParent[CORRECT_INDEX].classList.add("correct");
    }
  }, 1000);
  answersParent.forEach((elm, index) => {
    elm.addEventListener("click", () => {
      if (isSelected) return;
      const CORRECT_INDEX = [...answers].findIndex(
        (answer) => answer.textContent === correctAnswer
      );
      if (CORRECT_INDEX == index) {
        elm.classList.add("correct");
        numberOfCorrectAnswer++;
      } else {
        elm.classList.add("wrong");
        answersParent[CORRECT_INDEX].classList.add("correct");
      }
      isClicked = true;
      isSelected = true;
      clearInterval(time);
    });
  });
  document.querySelector(".next").addEventListener("click", () => {
    if (!isClicked) return;
  console.log(questionNumber+1);
    if (questionNumber === choices.numQuesstion) {
      document.querySelector(".num-answers").textContent =
        numberOfCorrectAnswer;
      document.querySelector(".num-quetsion").textContent =
        choices.numQuesstion;
      questionNumber = 0;
      correctAnswer = 0;
      questionNum.textContent = 1;
      answersParent.forEach((elm) => {
        if (elm.classList.contains("correct")) elm.classList.remove("correct");
        else if (elm.classList.contains("wrong")) elm.classList.remove("wrong");
      });
      isSelected = false;
      isClicked = false;
      removeSmothly(panel, score);
      return;
    }
    answersParent.forEach((elm) => {
      if (elm.classList.contains("correct")) elm.classList.remove("correct");
      else if (elm.classList.contains("wrong")) elm.classList.remove("wrong");
    });
    timeBar.textContent = choices.time;
    questionNum.textContent = questionNumber + 1;
    progresbar.style.width = "100%";
    correctAnswer = data[questionNumber].correct_answer;
    setData(
      data[questionNumber].question,
      data[questionNumber].correct_answer,
      data[questionNumber++].incorrect_answers
    );
    clearInterval(time);
    let SEC = choices.time;
    time = setInterval(() => {
      progressBar(SEC--);
      if (SEC < 0) {
        const CORRECT_INDEX = [...answers].findIndex(
          (answer) => answer.textContent === correctAnswer
        );
        clearInterval(time);
        isClicked = true;
        isSelected = true;
        answersParent[CORRECT_INDEX].classList.add("correct");
      }
    }, 1000);
    isSelected = false;
    isClicked = false;
  });
}
//Events
const arrTopics = objApi().map((elm) => elm.topic);
start.addEventListener("click", () => {
  removeSmothly(start, topics);
});
[...topics.lastElementChild.children].forEach((elm, index) => {
  elm.textContent = arrTopics[index];
  elm.addEventListener("click", () => {
    removeSmothly(topics, choice);
    choices.topic = elm.textContent.trim();
  });
});
[...choice.lastElementChild.children].forEach((num) => {
  num.addEventListener("click", () => {
    removeSmothly(choice, difficulty);
    choices.numQuesstion = +num.textContent;
  });
});
[...difficulty.lastElementChild.children].forEach((elm) => {
  elm.addEventListener("click", () => {
    removeSmothly(difficulty, timesChoice);
    choices.diffclt = elm.textContent.trim();
  });
});
[...timesChoice.lastElementChild.children].forEach((elm) => {
  elm.addEventListener("click", () => {
    removeSmothly(timesChoice, panel);
    choices.time = +elm.textContent
      .trim()
      .slice(0, elm.textContent.trim().length - 1);
      console.log(choices)
    numberOfQuestion.textContent = choices.numQuesstion;
    getQuestionsAndAnswers(
      choices.numQuesstion,
      choices.diffclt,
      choices.topic
    );
  });
});
document.querySelector(".btn-restart").addEventListener("click", () => {
  removeSmothly(score, start);
});