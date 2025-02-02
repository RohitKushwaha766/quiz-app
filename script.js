// Global Variables
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let mistakes = 0;
let lives = 3; // Max lives
let timer;
let remainingTime = 0;
let isQuizRunning = false; // To track if the quiz is currently running

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const questionNumber = document.getElementById("question-number"); // For displaying question number
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const nextBtn = document.getElementById("next-btn");
const scoreText = document.getElementById("score-text");
const timerElement = document.getElementById("timer");
const mistakeCountElement = document.getElementById("mistake-count");

document.getElementById("start-btn").addEventListener("click", startQuiz);
document.getElementById("restart-btn").addEventListener("click", restartQuiz);
nextBtn.addEventListener("click", nextQuestion);

const API_URL = "https://api.notesdrive.com/quiz-api.php"; //api call

// Fetch Quiz Data
async function fetchQuizData() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
   // console.log("Fetched Data:", data);

    // Check for questions array
    if (!data || !Array.isArray(data.questions)) {
      throw new Error("Invalid API response format");
    }

    questions = data.questions;

    // Fetch additional quiz metadata
    const quizMetadata = {
      correctAnswerMarks: parseFloat(data.correct_answer_marks),
      dailyDate: data.daily_date,
      difficultyLevel: data.difficulty_level || "Normal",
      duration: data.duration * 60, // Convert minutes to seconds
      maxMistakeCount: data.max_mistake_count,
      negativeMarks: parseFloat(data.negative_marks),
    };

    // Store metadata globally
    window.quizMetadata = quizMetadata;

    startScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");
    showQuestion();
  } catch (error) {
    console.error("Error fetching quiz data:", error);
  }
}

function startQuiz() {
  fetchQuizData();
}

function showQuestion() {
  if (!questions || questions.length === 0) {
    console.error("No quiz data available.");
    return;
  }

  // Show question and options
  const question = questions[currentQuestionIndex];
  questionNumber.innerText = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
  questionText.innerText = question.description || "No question text available";

  optionsContainer.innerHTML = "";

  const instruction = document.createElement("h3");
  instruction.innerText = "Choose the correct option:";
  instruction.classList.add("option-instruction");
  optionsContainer.appendChild(instruction);

  const optionsGrid = document.createElement("div");
  optionsGrid.classList.add("options-grid");
  optionsContainer.appendChild(optionsGrid);

  const optionLabels = ["A", "B", "C", "D"];

  if (Array.isArray(question.options)) {
    question.options.forEach((option, index) => {
      const button = document.createElement("button");
      const label = optionLabels[index] ? `(${optionLabels[index]}) ` : "";
      button.innerText = label + (option.description || "No option text");
      button.classList.add("option");
      button.addEventListener("click", () => checkAnswer(button, option.is_correct));
      optionsGrid.appendChild(button);
    });
  } else {
    console.error("Options are not in an array format.");
  }

  nextBtn.classList.add("hidden");
  
  // Start timer only when the question is shown
  if (!isQuizRunning) {
    startTimer();
  }
}

function checkAnswer(selectedButton, isCorrect) {
  const allButtons = document.querySelectorAll(".option");
  allButtons.forEach((button) => {
    button.disabled = true;
  });

  if (isCorrect) {
    selectedButton.classList.add("correct");
    score += window.quizMetadata.correctAnswerMarks;
  } else {
    selectedButton.classList.add("wrong");
    mistakes++;
    score -= window.quizMetadata.negativeMarks;
  }

  nextBtn.classList.remove("hidden");
  mistakeCountElement.innerText = `Mistakes: ${mistakes}`;
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex >= questions.length || mistakes >= window.quizMetadata.maxMistakeCount || lives <= 0) {
    endQuiz();
  } else {
    showQuestion();
  }
}

function endQuiz() {
  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");
  scoreText.innerText = `You scored ${score} out of ${questions.length * window.quizMetadata.correctAnswerMarks}!`;
}

function restartQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  mistakes = 0;
  lives = 3; // Reset lives
  isQuizRunning = false; // Reset quiz status
  resultScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
  timerElement.querySelector("span").innerText = "00:00"; // Reset timer display
}

function startTimer() {
  if (isQuizRunning) return; // Prevent timer from starting again

  isQuizRunning = true;
  remainingTime = window.quizMetadata.duration;
  timer = setInterval(updateTimer, 1000); // Start the timer with a 1-second interval
}

function updateTimer() {
  if (remainingTime > 0) {
    remainingTime--;
    let minutes = Math.floor(remainingTime / 60);
    let seconds = remainingTime % 60;
    timerElement.querySelector("span").innerText = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  } else {
    clearInterval(timer); // Stop the timer when it reaches 0
    endQuiz();
  }
}
