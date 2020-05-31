// Set Selector
const difficultyBtn = document.querySelectorAll(".difficulty__item");
const mainForm = document.querySelector(".main__form");
const mainInput = document.querySelector(".form__input");
const mainInfo = document.querySelector(".info__span");
const restartBtn = document.querySelector(".restart-Btn");
const giveupBtn = document.querySelector(".giveup-Btn");
const recordList = document.querySelector(".record__list");
const recordTry = document.querySelector(".try__number");
const numberItems = document.querySelectorAll(".numberBox__item");
const boardInput = document.querySelectorAll(".main__board__input");
const boardBtn = document.querySelectorAll(".Btn");
const boardInputBox = document.querySelector(".main__board__inputBox");
const boardDrawBox = document.querySelector(".main__board__drawBox");
const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");

// Variable
let DIFFICULTY = 3;
let NUM = [];
let GIVEUP = false;
let TRY = 0;
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Set Difficulty
function handleDifficulty() {
  DIFFICULTY = this.dataset.difficulty;
  difficultyBtn.forEach((element) => {
    if (element.classList.contains("checked")) {
      element.classList.remove("checked");
    }
  });
  this.classList.add("checked");
  handleRestart();
  console.log("DIFFICULTY: ", DIFFICULTY);
}

// Checking Input Data
function validateInput(event) {
  if (!(event.keyCode == 8 || event.keyCode == 13 || (event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105))) {
    console.log("Block");
    event.returnValue = false;
  }
  if (!(event.keyCode == 8 || event.keyCode == 13)) {
    if (mainInput.value.length >= DIFFICULTY) {
      event.returnValue = false;
    }
  }
  if (Array.from(mainInput.value).includes(event.key)) {
    event.returnValue = false;
  }
}

// Get Random Number
function getRandomNumber() {
  const Arr = [];
  let check = true;
  for (let i = 0; i < DIFFICULTY; i++) {
    const random = Math.floor(Math.random() * 10);
    if (i > 0) {
      for (let j = 0; j < i; j++) {
        if (Arr[j] == random) {
          i--;
          check = false;
          break;
        } else {
          check = true;
        }
      }
    }
    if (check) {
      Arr.push(random);
    }
  }
  NUM = [...Arr];
  console.log(NUM);
}

// Checking Data
function checkData(event) {
  event.preventDefault();
  if (mainInput.value.length == DIFFICULTY) {
    const INPUT = Array.from(mainInput.value);
    let S = 0;
    let B = 0;
    for (let i = 0; i < DIFFICULTY; i++) {
      if (NUM[i] == INPUT[i]) {
        S += 1;
      } else {
        for (let j = 0; j < DIFFICULTY; j++) {
          if (NUM[j] == INPUT[i]) {
            B += 1;
          }
        }
      }
    }
    if (!GIVEUP) {
      if (S == DIFFICULTY) {
        mainInfo.innerText = "You Win";
        GIVEUP = true;
      } else if (S == 0 && B == 0) {
        mainInfo.innerText = "OUT";
      } else {
        mainInfo.innerText = `${S}S ${B}B`;
      }
      getRecord(S, B, mainInput.value);
    }
    mainInput.value = "";
  }
}

// Record
function getRecord(S, B, V) {
  const li = document.createElement("li");
  const value = document.createElement("span");
  const data = document.createElement("span");

  li.classList.add("record__li");
  value.classList.add("listNumber");
  data.classList.add("listData");

  value.innerText = V;
  data.innerText = `${S}S ${B}B`;

  li.appendChild(value);
  li.appendChild(data);
  recordList.appendChild(li);

  TRY += 1;
  recordTry.innerText = TRY;
}

// Restart
function handleRestart() {
  GIVEUP = false;
  TRY = 0;
  recordTry.innerText = TRY;
  getRandomNumber();
  mainInput.value = "";
  mainInfo.innerText = "INFO";
  const li = document.querySelectorAll(".record__li");
  li.forEach((element) => element.remove());

  // Remove Number checking
  numberItems.forEach((element) => {
    if (element.classList.contains("check")) {
      element.classList.remove("check");
      element.classList.add("normal");
    } else if (element.classList.contains("uncheck")) {
      element.classList.remove("uncheck");
      element.classList.add("normal");
    }
  });

  // Remove Board Input
  boardInput.forEach((element) => (element.value = ""));
}

// Give Up
function handleGiveup() {
  GIVEUP = true;
  mainInfo.innerText = NUM.join("");
}

// Handle Number Item
function handleNumberItem() {
  console.log(this);
  if (this.classList.contains("normal")) {
    this.classList.remove("normal");
    this.classList.add("check");
  } else if (this.classList.contains("check")) {
    this.classList.remove("check");
    this.classList.add("uncheck");
  } else {
    this.classList.remove("uncheck");
    this.classList.add("normal");
  }
}

// Handel Mode
function handleMode() {
  const MODE = this.dataset.mode;
  boardBtn.forEach((element) => {
    if (element.classList.contains("checked")) {
      element.classList.remove("checked");
    }
  });
  this.classList.add("checked");
  if (MODE == 1) {
    boardInputBox.classList.remove("invisi");
    boardDrawBox.classList.add("invisi");
  } else {
    boardDrawBox.classList.remove("invisi");
    boardInputBox.classList.add("invisi");

    // Canvas Setting
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.strokeStyle = "#00adb5";
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = 2;
  }
}

// Drawing
function handleDraw(event) {
  if (!isDrawing) return;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(event.offsetX, event.offsetY);
  ctx.stroke();
  [lastX, lastY] = [event.offsetX, event.offsetY];
}

// Set Event Listener
function getEventListener() {
  // Choice Difficulty
  difficultyBtn.forEach((element) => element.addEventListener("click", handleDifficulty));

  // Checking Data
  mainForm.addEventListener("submit", checkData);

  // Validate Input
  mainInput.addEventListener("keydown", validateInput);

  // Restart
  restartBtn.addEventListener("click", handleRestart);

  // Give Up
  giveupBtn.addEventListener("click", handleGiveup);

  // Number Items
  numberItems.forEach((element) => element.addEventListener("click", handleNumberItem));

  // Board Btn
  boardBtn.forEach((element) => element.addEventListener("click", handleMode));

  // Canvas
  canvas.addEventListener("mousemove", handleDraw);
  canvas.addEventListener("mouseup", () => (isDrawing = false));
  canvas.addEventListener("mouseout", () => (isDrawing = false));
  canvas.addEventListener("mousedown", (event) => {
    isDrawing = true;
    [lastX, lastY] = [event.offsetX, event.offsetY];
  });
}

getEventListener();
getRandomNumber();
