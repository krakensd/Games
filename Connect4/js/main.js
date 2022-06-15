

var playerRed = "R";
var playerYellow = "Y";
var currPlayer = playerRed;

var gameOver = false;
var board;
var currColumns;

var rows = 6;
var columns = 7;

window.onload = function() {
    setGame();
    currColumns = [5,5,5,5,5,5,5]
}

function setGame() {
    board = [];

    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            // Javascript
            row.push(' ');

            // HTML
            // <div id="0-0" class="tile"></div>
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.addEventListener("click", setPiece)
            document.getElementById("board").append(tile);
        }
        board.push(row);
    }
}

function setPiece() {
    if (gameOver) {
        return;
    }

    let coords = this.id.split("-");  // "0-0" -> ["0", "0"]
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    r = currColumns[c];
    if (r < 0) {
        return;
    }

    board[r][c] = currPlayer;
    let tile = document.getElementById(r.toString() + "-" + c.toString());
    if (currPlayer == playerRed) {
        tile.classList.add("red-piece");
        currPlayer = playerYellow
    }
    else {
        tile.classList.add("yellow-piece");
        currPlayer = playerRed
    }

    r -= 1; //Updating the row height for the column
    currColumns[c] = r; //Update the array

    checkWinner();
}


function checkWinner() {
    //Horizontal Check
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns -3; c++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r][c+1] && board[r][c+1] == board[r][c+2] && board[r][c+2]  == board[r][c+1]) {
                    setWinner(r, c);
                    return;
                }                      
            }
        }
    }


    // Vertical Check
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows-3; r++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r+1][c] && board[r+1][c] == board[r+2][c] && board[r+2][c]  == board[r+3][c]) {
                    setWinner(r, c);
                    return;
                }    
            }
        }
    }
    //Non-Diagnal Check
    for (let r = 0; r < rows - 3; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r+1][c+1] && board[r+1][c+1] == board[r+2][c+2] && board[r+2][c+2] == board[r+3[c+3]]) {
                    setWinner(r, c);
                    return;
                }
              
            }    
        }
    }
    //Diagnally Check
    for (let r = -3; r < rows - 3; r++) {
        for (let c = 0; c < columns -3; c++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r-1][c+1] && board[r-1][c+1] == board[r-2][c+2] && board[r-2][c+2] == board[r-3][c+3]) {
                    setWinner(r, c);
                    return;
                }
            

            }
        }
    }
}
function setWinner(r, c) {
    let winner = document.getElementById("winner");
    if (board[r][c] == playerRed) {
        winner.innerText = "Red Is The Big Winner !!!";
    }   else {
        winner.innerText = "Yellow Is The Big Winner !!!";
    }
    gameover = true;

}