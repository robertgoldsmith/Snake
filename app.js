const container = document.getElementById('container')
const grid = document.getElementById('snake-grid')
const startButton = document.getElementById('start-btn')
const scoreDisplay = document.getElementById('score')
const infoBtn = document.getElementById('info-btn')
const closeBtn = document.getElementById('close-btn')
const infoOverlay = document.getElementById('info-overlay')
const infoModal = document.getElementById('info-modal')
const width = 10

let squares = []
let appleIndex = 0
let score = 0
let intervalTime = 700
let speed = 0.9
let timerId = 0

let currentSnake = [44,54,55,45]
let head = currentSnake[0]
let neck = currentSnake[1]
let body = currentSnake[2]
let tailBody = currentSnake[currentSnake.length -2]
let tailEnd = currentSnake[currentSnake.length -1]
let movePos = 1

// ---- create grid ------------------------------
function createGrid() {
  for (let i=0; i < width * width; i++) {
  const square = document.createElement('div')
  square.classList.add('square')
  grid.appendChild(square)   
  squares.push(square)
  }
}

createGrid()

// ---- refresh snake array----------------------------
function refreshSnake() {
  head = currentSnake[0]
  neck = currentSnake[1]
  body = currentSnake[2]
  tailBody = currentSnake[currentSnake.length -2]
  tailEnd = currentSnake[currentSnake.length -1]
}

// ----- remove snake classes -----------------------------
function removeClasses(element) {
  element.className = 'square'
}

// ---- initialize snake ----------------------------
function resetSnake() {
  currentSnake = [44,54,55,45]
  refreshSnake()
  currentSnake.forEach(index => squares[index].classList.add('snake'))
  squares[head].classList.add('snake-head-north')
  squares[neck].classList.add('snake-neck-ne')
  squares[tailBody].classList.add('snake-neck-nw')
  squares[tailEnd].classList.add('snake-tail-s')
}

resetSnake()

// ----- reset game-----------------------------
function startGame() {
  squares.forEach(square => removeClasses(square))
  squares[appleIndex].classList.remove('apple')
  clearInterval(timerId)
  score = 0
  scoreDisplay.textContent = score
  movePos = -width
  intervalTime = 1000
  resetSnake()
  generateApple()
  timerId = setInterval(move, intervalTime)
  container.classList.remove('rumble')
  startButton.textContent = 'Reset'
}

// ------ move ----------------------------
function move() {
  const tailPos = currentSnake.pop()
    if (
      (head + width >= width * width && movePos === width) || 
      (head % width === width -1 && movePos === 1) || 
      (head % width === 0 && movePos === -1) || 
      (head - width < 0 && movePos === -width) || 
      squares[head + movePos].classList.contains('snake')
    ) {

    if (squares[head].classList.contains('snake-head-north')) {
      squares[head].classList.remove('snake-head-north')
      squares[head].classList.add('snake-head-north-dead')
    }
    if (squares[head].classList.contains('snake-head-east')) {
      squares[head].classList.remove('snake-head-east')
      squares[head].classList.add('snake-head-east-dead')
    }
    if (squares[head].classList.contains('snake-head-south')) {
      squares[head].classList.remove('snake-head-south')
      squares[head].classList.add('snake-head-south-dead')
    }
    if (squares[head].classList.contains('snake-head-west')) {
      squares[head].classList.remove('snake-head-west')
      squares[head].classList.add('snake-head-west-dead')
    }
    container.classList.add('rumble')
    return clearInterval(timerId) 
  }

  currentSnake.unshift(head + movePos)
  refreshSnake()

  removeClasses(squares[tailPos])
  scoreDisplay.classList.remove('score-pop')

  if (squares[head].classList.contains('apple')) {
    squares[head].classList.remove('apple')
    squares[tailPos].classList.add('snake')
    currentSnake.push(tailPos)
    tailBody = currentSnake[currentSnake.length -2]
    tailEnd = currentSnake[currentSnake.length -1]
    generateApple()
    score++
    scoreDisplay.textContent = score
    scoreDisplay.classList.add('score-pop')
    clearInterval(timerId)
    intervalTime = intervalTime * speed
    timerId = setInterval(move, intervalTime)
  }
  
  squares[head].classList.add('snake')
  
  if (head === neck - width) {
    squares[head].classList.add('snake-head-north')
    if (body === head + width - 1){
      squares[neck].classList.add('snake-neck-nw')
    } else if (body === head + width + 1){
      squares[neck].classList.add('snake-neck-ne')
    } else {
      squares[neck].classList.add('snake-vertical')
    }
  }
  
  if (head === neck + 1) {
    squares[head].classList.add('snake-head-east')
    if (body === head - width - 1){
      squares[neck].classList.add('snake-neck-ne')
    } else if (body === head + width - 1){
      squares[neck].classList.add('snake-neck-se')
    } else {
      squares[neck].classList.add('snake-horizontal')
    }
  }
  
  if (head === neck + width) {
    squares[head].classList.add('snake-head-south')
    if (body === head - width + 1){
      squares[neck].classList.add('snake-neck-se')
    } else if (body === head - width - 1){
      squares[neck].classList.add('snake-neck-sw')
    } else {
      squares[neck].classList.add('snake-vertical')
    }
  }
  
  if (head === neck - 1) {
    squares[head].classList.add('snake-head-west')
    if (body === head - width + 1){
      squares[neck].classList.add('snake-neck-nw')
    } else if (body === head + width + 1){
      squares[neck].classList.add('snake-neck-sw')
    } else {
      squares[neck].classList.add('snake-horizontal')
    }
  }
  
  // tail
  if (tailEnd === tailBody - width){
    removeClasses(squares[tailEnd])
    squares[tailEnd].classList.add('snake','snake-tail-s')
  }
  
  if (tailEnd === tailBody + width){
    removeClasses(squares[tailEnd])
    squares[tailEnd].classList.add('snake','snake-tail-n')
  }
  
  if (tailEnd === tailBody - 1){
    removeClasses(squares[tailEnd])
    squares[tailEnd].classList.add('snake','snake-tail-e')
  }
  
  if (tailEnd === tailBody + 1){
    removeClasses(squares[tailEnd])
    squares[tailEnd].classList.add('snake','snake-tail-w')
  }
}

// ---- generate apple------------------------------
function generateApple() {
  do {
    appleIndex = Math.floor(Math.random() * squares.length)
  } while (squares[appleIndex].classList.contains('snake')) 
    squares[appleIndex].classList.add('apple')
} 

// ---- controls ------------------------------
function control(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'd') { 
      movePos = 1
  } else if (e.key === 'Up' || e.key === 'ArrowUp' || e.key === 'w') { 
      movePos = -width
  } else if (e.key === 'Left' || e.key === 'ArrowLeft' || e.key === 'a') { 
      movePos = -1
  } else if (e.key === 'Down' || e.key === 'ArrowDown' || e.key === 's') { 
      movePos = +width
  }
}

document.addEventListener('keydown', control)
startButton.addEventListener('click', startGame)

// ---- info panel ------------------------------
infoBtn.addEventListener('click', () => {
  infoOverlay.style.display = 'block'
  document.addEventListener('click', (event) => {
    if(event.target === infoOverlay) {
      infoOverlay.style.display = 'none'
    }
  })
})

closeBtn.addEventListener('click', () => infoOverlay.style.display = 'none')
                

