const display = document.querySelector("span");
const operand = document.querySelectorAll("[data-num]");
const operator = document.querySelectorAll("[data-operator]");
const equalSign = document.querySelector("#equal");
const minus = document.querySelector("#plusminus");
const dot = document.querySelector("#dot");
const bksp = document.querySelector("#backspace");
const percent = document.querySelector("#perc");
const allClear = document.querySelector("#ac");

let mainArr = [];

let firstNum = [];
let secondNum = [];
let curOp = [];

function add(a, b) {
  return Math.round((a + b) * 100) / 100;
}

function subtract(a, b) {
  return Math.round((a - b) * 100) / 100;
}

function multiply(a, b) {
  return Math.round(a * b * 100) / 100;
}

function divide(a, b) {
  return Math.round((a / b) * 100) / 100;
}

function operate(operator, num1, num2) {
  return operator(num1, num2);
}

function updateDisplay() {
  let replaceOp = curOp[0];
  let newOp = "";
  if (replaceOp === "mul") {
    newOp = " × ";
  } else if (replaceOp === "div") {
    newOp = " ÷ ";
  } else if (replaceOp === "sub") {
    newOp = " - ";
  } else if (replaceOp === "add") {
    newOp = " + ";
  }
  let arr = [...firstNum, newOp, ...secondNum];
  display.textContent = arr.join("").slice(-12);
}

allClear.addEventListener("click", () => {
  firstNum = [];
  secondNum = [];
  curOp = [];
  updateDisplay();
});

percent.addEventListener("click", calcPerc);

function calcPerc() {
  if (secondNum.length === 0) {
    let a = firstNum.join("");
    let b = +a / 100;
    firstNum = String(b).split("");
  } else if (curOp.length === 1 && !secondNum.includes("%")) {
    secondNum.push("%");
  }
  updateDisplay();
}

dot.addEventListener("click", addDot);

function addDot() {
  if (secondNum.length === 0 && curOp.length === 0) {
    if (!firstNum.includes(".")) {
      firstNum.push(".");
    }
  } else if (curOp.length === 1) {
    if (!secondNum.includes(".")) {
      secondNum.push(".");
    }
  }
  updateDisplay();
}

bksp.addEventListener("click", deleteChar);

function deleteChar() {
  if (firstNum.length >= 1 && curOp.length === 0) {
    firstNum.pop();
  } else if (curOp.length === 1 && secondNum.length === 0) {
    curOp.pop();
  } else if (secondNum.length >= 1) {
    secondNum.pop();
  }
  updateDisplay();
}

minus.addEventListener("click", function () {
  if (secondNum.length === 0 && curOp.length === 0) {
    if (!firstNum.includes("-")) {
      firstNum.unshift("-");
    } else {
      firstNum.shift();
    }
  } else if (curOp.length === 1) {
    if (!secondNum.includes("-")) {
      secondNum.unshift("-");
    } else {
      secondNum.shift();
    }
  }
  updateDisplay();
});

operator.forEach((el) => {
  el.addEventListener("click", function () {
    addOperator(el.id);
  });
});

function addOperator(e) {
  if (firstNum.length === 0) {
    return;
  } else if (secondNum.length === 0 && curOp.length === 1) {
    curOp.pop();
  }
  if (curOp.length === 1) {
    calculate();
  }
  curOp.push(e);
  updateDisplay();
}

operand.forEach((el) => {
  el.addEventListener("click", function () {
    addOperand(el.id);
  });
});

function addOperand(e) {
  if (curOp.length === 1) {
    secondNum.push(e);
  } else if (curOp.length === 0) {
    firstNum.push(e);
  }
  updateDisplay();
}

equalSign.addEventListener("click", calculate);

// *************************************************** Calculate

function calculate() {
  if (
    secondNum.length === 0 ||
    curOp.length === 0 ||
    (firstNum[0] === "." && firstNum.length === 1) ||
    (secondNum[0] === "." && secondNum.length === 1) ||
    (firstNum[0] === "-" && firstNum.length === 1) ||
    (secondNum[0] === "-" && secondNum.length === 1)
  ) {
    return;
  }
  if (secondNum.includes("%")) {
    let a = secondNum.slice(0, -1).join("");
    let b = firstNum.join("");
    let c = Math.round((+b / 100) * +a * 100) / 100;
    secondNum = String(c).split("");
  }
  let a = firstNum.join("");
  let b = secondNum.join("");

  let res;
  switch (curOp[0]) {
    case "div":
      if (b === "0") {
        res = "hi";
      } else {
        res = operate(divide, +a, +b);
      }
      break;
    case "mul":
      res = operate(multiply, +a, +b);
      break;
    case "add":
      res = operate(add, +a, +b);
      break;
    case "sub":
      res = operate(subtract, +a, +b);
      break;
  }
  curOp.shift();
  firstNum = [];
  secondNum = [];
  firstNum = String(res).split("");
  updateDisplay();
}

// ********************************************** Keyboard

window.addEventListener("keydown", function (e) {
  console.log(e);
  operand.forEach((el) => {
    if (el.id === e.key) {
      addOperand(e.key);
    }
  });
  if (e.key === "-") {
    addOperator("sub");
  } else if (e.key === "+") {
    addOperator("add");
  } else if (e.key === "/") {
    addOperator("div");
  } else if (e.key === "*") {
    addOperator("mul");
  } else if (e.key === ".") {
    addDot();
  } else if (e.key === "Enter" || e.key === "=") {
    calculate();
  } else if (e.key === "Backspace") {
    deleteChar();
  } else if (e.key === "%") {
    calcPerc();
  } else {
    return;
  }
});
