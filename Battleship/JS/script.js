//********************************************* Variable Declarations *************************************************** */
const userGameTable = $("#user-game-table");
const aiGameTable = $("#ai-game-table");
const restart = $("#restart").on("click", gameStartRestart);
const startButton = $("#start");
const shipSizes = [1, 2, 2, 3, 4, 5];
let deadAiShips = [];
let deadUserShips = [];
let attackedPositions = [];
let damage = false;
let damagedShip = [];
let userShips,
  aiShips,
  damagedAiShips,
  attackedTiles,
  damagedUserShips,
  horizontalOrVertical,
  foundShip,
  kill,
  kills,
  aiShipPositions,
  aiKills,
  killedShipsIndexes,
  attackArray,
  shot,
  betterAttackArray,
  deadShip,
  occupiedPositions;
//********************************************* Setting/Resetting Game Parameters to Initial State *************************************************** */
function gameStartRestart() {
  foundShip = [];
  killedShipsIndexes = [];
  attackedPositions = [];
  deadAiShips = [];
  damagedShip = [];
  userShips = [];
  aiShips = [];
  attackedTiles = [];
  deadShip = [];
  aiHit = 0;
  aiKills = 0;
  aiShipPositions = [];
  kill = false;
  attackArray = [];
  damagedAiShips = new Array(shipSizes.length).fill(new Array(0));
  damagedUserShips = new Array(shipSizes.length).fill(new Array(0));
  startButton.prop("disabled", false);
  $("#game-over").text("");
  $("#game-over").removeClass("flipdown");
  $("#ai-kills").text("0");
  $("#hits").text("0");
  $("#kills").text("0");
  aiGameTable.unbind("click");
  startButton.unbind("click");
  drawGameBoard("user");
  drawGameBoard("ai");
  horizontalOrVertical = 0.5;
  shipArmyGenerator("ai");
  horizontalOrVertical = $(".vertical-horizontal-slider").val() / 100;
  shipArmyGenerator("user");
  startButton.on("click", startGamePlay);
}

//********************************************* Attaching Click Handler *************************************************** */
function startGamePlay() {
  startButton.unbind("click");
  startButton.prop("disabled", true);
  aiGameTable.on("click", "th", handleAiBoardClick);
}

//********************************************* USER ATTACK *************************************************** */
/**
 * @return {Number} attack position
 */
function handleAiBoardClick() {
  let clickedTile = parseInt($(this).attr("id").split("-")[1]);
  kills = 0;
  // Marking users attack position
  for (let i = 0; i < aiShips.length; i++) {
    if (aiShips[i].includes(clickedTile)) {
      $(this).text("X");
      $(this).addClass("hit");
      $(this).css("background-color", "#ff9900");
      $(this).prop("disabled", true);
      damagedAiShips[i] = damagedAiShips[i].concat(
        aiShips[i].splice(aiShips[i].indexOf(clickedTile), 1)
      );
      break;
    } else {
      $(this).addClass("hit");
      $(this).prop("disabled", true);
      $(this).css("background-color", "#808080");
    }
  }

  // Checking if the ship is dead and changing color for the whole ship
  for (let i = 0; i < aiShips.length; i++) {
    if (!aiShips[i].length) {
      damagedAiShips[i].forEach((el) => {
        $(`#ai-${el}`).css("background-color", "red");
      });
    }
  }

  // Counting and Updating Kills statistics
  aiShips.forEach((el) => {
    if (!el.length) {
      kills++;
    }
  });
  $("#kills").text(kills);

  // Checking if Game is Over
  if (!aiShips.join("").length) {
    aiGameTable.unbind("click");
    $("#game-over").addClass("flipdown");
    $("#game-over").text("GAME OVER! YOU WON!");
    return;
  }
  // AI turn to attack
  counterAttack();
}

//********************************************* COUNTER ATTACK *************************************************** */
/**
 * @return {Number} attack position
 */
function counterAttack() {
  let valid = false;
  let randomPos;
  // If we dont have attack positions or we dont have damaged ship
  if (!attackArray.length || damage) {
    if (damage) {
      if (shot % 10 === 0 && shot !== 0 && shot !== 90) {
        attackArray.push(shot + 1, shot + 10, shot - 10);
      } else if (shot < 9 && shot !== 0) {
        attackArray.push(shot + 1, shot - 1, shot + 10);
      } else if (shot > 90 && shot !== 99) {
        attackArray.push(shot + 1, shot - 1, shot - 10);
      } else if ((shot + 1) % 10 === 0 && shot !== 99 && shot !== 9) {
        attackArray.push(shot - 1, shot + 10, shot - 10);
      } else if (shot === 0) {
        attackArray.push(shot + 1, shot + 10);
      } else if (shot === 90) {
        attackArray.push(shot + 1, shot - 10);
      } else if (shot === 99) {
        attackArray.push(shot - 1, shot - 10);
      } else if (shot === 9) {
        attackArray.push(shot - 1, shot + 10);
      } else {
        attackArray.push(shot - 1, shot + 1, shot + 10, shot - 10);
      }
    } else {
      damagedShip = [];
      attackArray = [Math.floor(Math.random() * 100)];
    }
    attackArray = attackArray.filter((el) => {
      return !attackedPositions.includes(el);
    });

    if (!attackArray.length) {
      while (!valid) {
        randomPos = Math.floor(Math.random() * 100);
        if (!attackedPositions.includes(randomPos)) {
          attackArray = [randomPos];
          valid = true;
          damagedShip = [];
        }
      }
    }
  }
  // If we have attack array and we have damaged ship
  // Filtering unnecessary positions
  if (attackArray.length && damage) {
    betterAttackArray = [];
    if (damagedShip.length >= 2) {
      if (Math.abs(damagedShip[1] - damagedShip[0]) === 10) {
        //is vertical
        attackArray = attackArray.filter((el) => {
          return el % 10 === damagedShip[0] % 10;
        });
      }
      if (Math.abs(damagedShip[1] - damagedShip[0]) === 1) {
        // check for horizontal
        attackArray = attackArray.filter((el) => {
          return Math.abs(el - damagedShip[0]) < 8;
        });
      }
    }
  }
  // If no available shooting tiles generate random
  valid = false;
  if (!attackArray.length) {
    while (!valid) {
      randomPos = Math.floor(Math.random() * 100);
      if (!attackedPositions.includes(randomPos)) {
        attackArray = [randomPos];
        valid = true;
        damagedShip = [];
      }
    }
  }
  shot = attackArray[attackArray.length - 1];
  attackedPositions = attackedPositions.concat(attackArray.pop());
  // Coloring tiles
  if (occupiedPositions.includes(shot)) {
    $(`#user-${Number(shot)}`).text("X");
    $(`#user-${Number(shot)}`).addClass("hit");
    $(`#user-${Number(shot)}`).css("background-color", "#ff9900");
    $(`#user-${Number(shot)}`).prop("disabled", true);
    damage = true;
    damagedShip.push(shot);
  } else {
    $(`#user-${Number(shot)}`).css("background-color", "#808080");
    $(`#user-${Number(shot)}`).addClass("hit");
    $(`#user-${Number(shot)}`).prop("disabled", true);
    damage = false;
  }
  // Check for kill
  userShips.forEach((el, i) => {
    if (el.every((pos) => attackedPositions.includes(pos))) {
      deadShip = userShips[i];
      userShips.splice(i, 1);
    }
  });
  if (deadShip.length) {
    deadShip.forEach((el) => {
      $(`#user-${el}`).css("background-color", "red");
      $(`#user-${el}`).prop("disabled", true);
    });
  }
  // Counting Kills
  $("#ai-kills").text(6 - userShips.length);
  $("#hits").text(attackedPositions.length);
  // checking if Game is Over
  if (!userShips.join("").length) {
    aiGameTable.unbind("click");
    $("#game-over").addClass("flipdown");
    $("#game-over").text("GAME OVER! YOU LOSE!");
    // Reveal Ai Array when Ai wins
    aiShips.flat().forEach((el) => {
      $(`#${"ai"}-${el}`).addClass("grow");
    });
    return;
  }
}
//********************************************* Generating Playing Boards *************************************************** */
/**
 * @param {string} player
 * @return {table} gameBoard
 */
function drawGameBoard(player) {
  let gameBoard = "";
  let gameTable = $(`#${player}-game-table`);
  for (let i = 0; i < 10; i++) {
    gameBoard += `<tr class='' id="${
      player + "-" + "row" + "-" + i * 10
    }"></tr>`;
    for (let j = 0; j < 10; j++) {
      gameBoard += `<th class='tg-0lax ripple' id="${
        player + "-" + (i * 10 + j)
      }"></th>`;
    }
  }
  gameTable.html(gameBoard);
}
//********************************************* Generating Battleships *************************************************** */
/**
 * @param {string} player
 * @return {array[array[]]} ships
 */
function shipArmyGenerator(player) {
  let randomLocation = null;
  let arrayOfShips;
  let isHorizontal;
  let containsTiles;
  let firstPosition;
  let touchingOthers;
  let suroundTouchArray = [];
  occupiedPositions = [];
  for (let i = 0; i < shipSizes.length; i++) {
    touchingOthers = true;
    isHorizontal = Math.random() <= horizontalOrVertical;
    ship = [];
    // first 1X1 square placement
    if (i === 0) {
      arrayOfShips = [];
      firstPosition = shipFactory(shipSizes[0], false); // 100 is board array length
      arrayOfShips.push(firstPosition);
      occupiedPositions.push(firstPosition[0]);
    } else {
      randomLocation = shipFactory(shipSizes[i], isHorizontal);
      containsTiles = randomLocation.some((position) => {
        return occupiedPositions.includes(position);
      });
      //function to find if can place not overlaping
      while (touchingOthers || containsTiles) {
        suroundTouchArray = [];
        randomLocation = shipFactory(shipSizes[i], isHorizontal);

        containsTiles = occupiedPositions.some((position) => {
          return randomLocation.includes(position);
        });
        // Pushing all possible touching positins into array
        randomLocation.forEach((el) => {
          suroundTouchArray.push(el + 1, el - 1, el + 10, el - 10);
        });
        touchingOthers = occupiedPositions.some((el) => {
          return suroundTouchArray.includes(el);
        });
      }
      occupiedPositions = occupiedPositions.concat(randomLocation);
      arrayOfShips.push(randomLocation);
    }
  }
  player === "user" ? (userShips = arrayOfShips) : (aiShips = arrayOfShips);
  colorizeShips(occupiedPositions, player);
}

//********************************************* Generating Individual Battleships *************************************************** */
/**
 * @param {String} shipSize
 * @param {Boolean} isHorizontal
 * @return {Array} generatedShip
 */
const shipFactory = (shipSize, isHorizontal) => {
  let generatedShip = [];
  let horizontalShipArray = [];
  let verticalShipArray = [];
  let persistNumber = 0;
  let randomLocation = 0;
  // if generating vertical ships
  if (!isHorizontal) {
    for (let i = 0; i < 100 - (shipSize - 1) * 10; i++) {
      // adding all numbers except ship size that will hit bottom wall
      verticalShipArray.push(persistNumber);
      persistNumber++;
    }
    randomLocation =
      verticalShipArray[
        Math.floor(Math.random() * (100 - (shipSize - 1) * 10))
      ];
    for (let i = 0; i < shipSize; i++) {
      generatedShip.push(randomLocation + i * 10);
    }
    return generatedShip;
  }
  // if generating horizontal ships
  if (isHorizontal) {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        // adding all numbers except ship size that will hit bottom wall
        if (j <= 10 - shipSize) {
          horizontalShipArray.push(persistNumber);
        }
        persistNumber++;
      }
    }
    randomLocation =
      horizontalShipArray[Math.floor(Math.random() * (110 - shipSize * 10))];
    for (let i = 0; i < shipSize; i++) {
      generatedShip.push(randomLocation + i);
    }
    return generatedShip;
  }
};

//********************************************* Ship Painting facility *************************************************** */
/**
 * @param {Array} shipSize
 * @param {Streeng} player
 */
const colorizeShips = (occupiedPositions, player) => {
  occupiedPositions.forEach((ship, i) => {
    $(`#${player}-${occupiedPositions[i]}`).css(
      "background-color",
      `${player === "user" ? "blue" : "ffefdb"}`
    );
  });
};

//********************************************* Game Initialization *************************************************** */
gameStartRestart();
