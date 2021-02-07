// VARS
const quizContainer = document.querySelector('.quiz');
const answers = document.querySelector('.answers-wrapper').children;
const startGame = document.getElementById('new-game');
const nextQuestion = document.getElementById('next-question');
const mainQuestion = document.getElementById('question');

let questions = [];
let questionBlock = 0;

// Cache questions
fetch('questions.json').then(res => res.json()).then(data => {
  questions = data
});

// Main game logic
function gameInit() {
  // If its the last question block reset
  questionBlock > 1 ? questionBlock = 0 : false;
  // Set question
  mainQuestion.innerHTML = questions[questionBlock].question;
  // Set answers
  [...answers].forEach((item, index) => {
    // Activate buttons
    item.disabled = false
    // Button text
    item.innerHTML = questions[questionBlock].answers[index].text;
    // Add class correct to the right question
    questions[questionBlock].answers[index].correct ? item.classList.add('correct') : item.classList.remove('correct');
  })
  // Increase question block
  questionBlock++
}

// Disable button function
function disableButtons() {
  for(btn of [...answers]) {
    btn.disabled = true
  }
}

// Start game function
startGame.addEventListener('click', (e) => {
  e.target.classList.toggle('hide');
  quizContainer.classList.remove('hide');
  nextQuestion.classList.remove('hide');
  gameInit();
});

// Answer button listener
[...answers].forEach(item => {
  item.addEventListener('click', (e) => {
    // Add color for correct/incorrect answer
    e.target.classList.contains('correct') ? e.target.style.backgroundColor = 'green' : e.target.style.backgroundColor = 'red';
    // Disable buttons
    disableButtons();
    // Update questions
    setTimeout(()=> {
      e.target.removeAttribute('style');
      gameInit();
    },500)
  })
})
// Skip question
nextQuestion.addEventListener('click', () => {
  gameInit();
})