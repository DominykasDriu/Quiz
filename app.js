// VARS
const quizContainer = document.querySelector('.quiz');
const answers = document.querySelector('.answers-wrapper').children;
const startGame = document.getElementById('new-game');
const nextQuestion = document.getElementById('next-question');
const mainQuestion = document.getElementById('question');
const questionCounterOutput = document.getElementById('question-counter');
const scoreboard = document.getElementById('scoreboard');
const heading = document.getElementById('heading');

class Game {
  constructor(questions, answers, nextQuestion, mainQuestion, questionCounterOutput) {
    this.questions = questions;
    this.answers = answers;
    this.nextQuestion = nextQuestion;
    this.mainQuestion = mainQuestion;
    this.questionCounterOutput = questionCounterOutput;
    this.questionCounter = 0;
    this.score = 0;
  }
  
  updateAnswers() {
    // If there are question left continue with the game
    if (this.questionCounter < this.questions.length) {
      // Update the question
      this.mainQuestion.innerHTML = this.questions[this.questionCounter].question;
      // Treat buttons
      [...this.answers].forEach((item, index) => {
        // Remove correct and incorrect colors on buttons
        item.removeAttribute('style');
        // Activate buttons
        item.disabled = false
        // Inject answers text
        item.innerHTML = this.questions[this.questionCounter].answers[index].text;
        // Add class correct to the right question
        this.questions[this.questionCounter].answers[index].correct ? item.classList.add('correct') : item.classList.remove('correct');
      })
      // Increase question counter
      this.questionCounter++
      // Update question counter
      this.questionCounterOutput.innerHTML = `${this.questionCounter}/${this.questions.length}`
    }
    // Add user to scoreboard and show scoreboard 
    else {
      this.addToScoreboard(this.score);
      this.showScoreboard();
    }
  }

  // Show scoreboard
  showScoreboard() {
    // Reset score, and questions
    this.questionCounter = 0;
    this.score = 0;
    // Hide game and display scoreboard
    quizContainer.classList.add('hide');
    questionCounterOutput.classList.add('hide');
    nextQuestion.classList.add('hide');
    startGame.classList.remove('hide');
    scoreboard.classList.remove('hide');
    // Feed scoreboard
    let scoreboardData = JSON.parse(localStorage.getItem('quizScoreboard'));
    // Clear scoreboard
    scoreboard.firstElementChild.innerHTML = '';
    // Sort by highscore only feed top 6
    scoreboardData.sort((a,b) => b.score - a.score).forEach( (e, index) => {
      index < 6 ? scoreboard.firstElementChild.innerHTML += `<li>${e.name} : ${e.score}</li>` : false
    })
    heading.textContent = 'Scoreboard'
  }

  // Add user to scoreboard
  addToScoreboard(score) {
    let name = prompt('Congratualations you completed the game! What is your name?');
    let player = {
      name: name || 'Anonymous',
      score: score
    }
    // If no scoreboard does not exist in user local storage create new
    if (!JSON.parse(localStorage.getItem('quizScoreboard'))) {
      localStorage.setItem('quizScoreboard', JSON.stringify([player]))
      // Update the existing one
    } else {
      let scoreboard = JSON.parse(localStorage.getItem('quizScoreboard'));
      scoreboard.push(player);
      localStorage.setItem('quizScoreboard', JSON.stringify(scoreboard))
    }
  }

  // Button listeners
  addListeners() {
    [...this.answers].forEach(item => {
      item.addEventListener('click', (e) => {
        // Add color for correct/incorrect answer, and increment score if correct
        e.target.classList.contains('correct') ? (e.target.style.backgroundColor = 'green', this.score++) : e.target.style.backgroundColor = 'red';
        // Disable buttons
        this.disableButtons();
      })
    });
    // Listener for next question
    this.nextQuestion.addEventListener('click', () => {
      this.updateAnswers();
    })
  }

  //Disable button function
  disableButtons() {
    for (let btn of [...this.answers]) {
      btn.disabled = true
    }
  }

  // Game initialization
  init() {
    quizContainer.classList.remove('hide');
    nextQuestion.classList.remove('hide');
    questionCounterOutput.classList.remove('hide');
    scoreboard.classList.add('hide');
    heading.textContent = 'Test Your JavaScript Skills!'
    this.addListeners();
    this.updateAnswers();
  }

}

// Start game function
startGame.addEventListener('click', (e) => {
  e.target.classList.toggle('hide');
  // Fetch question and start game
  fetch('questions.json').then(res => res.json()).then(data => {
    new Game(data, answers, nextQuestion, mainQuestion, questionCounterOutput).init();
  });
});