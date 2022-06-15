/*----- constants -----*/
const lookup = {
  '1': 'blue',
  '-1': 'red',
  'null': 'white'
};

const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

/*----- app's state (variables) -----*/
let gamegameboard, turn, winner;

/*----- cached element references -----*/
const squares = document.querySelectorAll('td div');
const message = document.querySelector('h1');

/*----- event listeners -----*/
document.querySelector('table').addEventListener('click', handleturn);
document.querySelector('button').addEventListener('click', initialize);

/*----- functions -----*/

initialize();

function initialize() {
  gameboard = [null, null, null, null, null, null, null, null, null];
  
  turn = 1;
  winner = null;
  render();
}

function render() {
  gameboard.forEach(function(sq, idx) {
    squares[idx].style.background = lookup[sq];
  });
  if (winner === 'T') {
    message.innerHTML = 'Not another tie!';
  } else if (winner) {
    message.innerHTML = `Good Job ${lookup[winner].toUpperCase()}!`;
  } else {
    message.innerHTML = `${lookup[turn].toUpperCase()}'s turn`;
  }
}

function handleturn(evt) {
  // obtain index of square
  const idx = parseInt(evt.target.id.replace('sq', ''));
  // check if square is available and return if not
  if (gameboard[idx] || winner) return;
  // update state (gameboard, turn, winner)
  gameboard[idx] = turn;
  turn *= -1;
  winner = getWinner();
  render();
}

function getWinner() {
  for (let i = 0; i < winningCombos.length; i++) {
    if (Math.abs(gameboard[winningCombos[i][0]] + gameboard[winningCombos[i][1]] + gameboard[winningCombos[i][2]]) === 3) return gameboard[winningCombos[i][0]];
  }
  
  if (gameboard.includes(null)) return null;
  return 'T';
}