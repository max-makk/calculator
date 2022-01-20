const btns = document.querySelectorAll('button')
const display = document.querySelector('.display_inner')

const leftNum = []
const operator = []
const rightNum = []

function updateDisplay() {
  const [...arr] = [...leftNum,...operator,...rightNum]
  const replaceStr = [].concat(...arr).map(el => {
    if(el === '/') {
      return el = '÷'
    } else if (el === '*') {
      return el = '×'
    } else if (el === '-' || el === '+' || el === '.' || el === '%') {
      return el
    } else if (isFinite(el)) {
      return el
    }
  })
    display.textContent = replaceStr.join('')
}

btns.forEach(el => el.addEventListener('click', function() {
  addChar(el.id)
  updateDisplay()
}))

function addChar(id) {
  if(isNumberic(id)) {
    if(operator.length === 0) {
      if(leftNum[leftNum.length - 1] === '%') {
        return
      }
      leftNum.push(id)
    } else {
      if(rightNum[rightNum.length - 1] === '%') {
        return
      }
      rightNum.push(id)
    }
  } else if(isOperator(id)) {
    if(operator.length && isNumberic(rightNum.join(''))) {
      operate(id)
    } else if(isNumberic(leftNum.join('')) && operator.length === 0) {
      operator.push(id)
    } else if (operator.length === 1 && rightNum.length === 0) {
      operator.length = 0
      operator.push(id)
    }
  } else if((id === '=' || id === 'Enter') && isNumberic(rightNum.join(''))) {
    operate()
  } else if(id === '.') {
    if(operator.length === 0) {
      if(leftNum[leftNum.length - 1] === '.') {
        leftNum.pop()
      } else if(!leftNum.includes('.')) {
        if(leftNum[leftNum.length - 1] === '%') {
          return 
        }
        leftNum.push('.')
      }
    } else {
      if(rightNum[rightNum.length - 1] === '.') {
        rightNum.pop()
      } else if(!rightNum.includes('.')) {
        if(rightNum[rightNum.length - 1] === '%') {
          return 
        }
        rightNum.push('.')
      }
    }
  } else if(id === '+/-') {
    if(operator.length === 0) {
      if(leftNum.includes('-')) {
        leftNum.shift()
      } else {
        leftNum.unshift('-')
      }
    } else if(operator.length) {
      if(rightNum.includes('-')) {
        rightNum.shift()
      } else {
        rightNum.unshift('-')
      }
    }
  } else if(id === '%') {
    if(operator.length === 0) {
      if(leftNum.includes('%')) {
        leftNum.pop()
      } else {
        if(leftNum[leftNum.length - 1] === '.' ||
           !isNumberic(leftNum.join(''))) {
          return
        }
        leftNum.push('%')
      }
    } else if(operator.length) {
      if(rightNum.includes('%')) {
        rightNum.pop()
      } else {
        if(rightNum[rightNum.length - 1] === '.' ||
           !isNumberic(rightNum.join(''))) {
          return
        }
        rightNum.push('%')
      }
    }
  } else if(id === 'Backspace') {
    if(rightNum.length) {
      rightNum.pop()
    } else if(operator.length) {
      operator.pop()
    } else {
      leftNum.pop()
    }
  } else if(id === 'ac') {
    leftNum.length = 0
    rightNum.length = 0
    operator.length = 0
  }
}

function operate(o) {
  const nextOperator = o
  if(leftNum.includes('%') || rightNum.includes('%')) {
    getPerc()
  }
  const first = parseFloat(leftNum.join(''))
  const second = parseFloat(rightNum.join(''))
  let result = ''
  switch(operator.join('')) {
    case '*':
      result = String(multiply(first,second))
      break
    case '+':
      result = String(add(first,second))
      break
    case '-':
      result = String(subtract(first,second))
      break
    case '/':
      if(second === 0) {
        alert('¯\\_(ツ)_/¯')
        return
      }
      result = String(divide(first,second))
      break
  }
  allClear()
  if(result.length > 8) {
    result = String(Number(result).toFixed(6))
  }
  result.split('').forEach(el => leftNum.push(el))
  if(nextOperator) {
    operator.push(o)
  }
  updateDisplay()
}

function allClear() {
  leftNum.length = 0
  rightNum.length = 0
  operator.length = 0
}

function add (a, b) {
  return a + b
}

function multiply (a, b) {
  return a * b
}

function divide (a, b) {
  return a / b
}

function subtract (a, b) {
  return a - b
}

function isNumberic(str) {
  let n = str
  if(str.includes('%')) {
    n = str.slice(0,-1)
  }
  return !isNaN(parseFloat(n)) && isFinite(n)
}

function isOperator(o) {
  if(o === '/' || o === '*' || o === '+' || o === '-') {
    return true
  } else {
    return false
  }
}

function getPerc() {
  if(leftNum.includes('%')) {
    const perc = parseFloat(leftNum.join('').slice(0,-1))
    const num = parseFloat(rightNum.join(''))
    let res = String((perc * num) / 100)
    leftNum.length = 0
    res.split('').forEach(el => leftNum.push(el))
  } else if(rightNum.includes('%')) {
    const perc = parseFloat(rightNum.join('').slice(0,-1))
    const num = parseFloat(leftNum.join(''))
    let res = String((perc * num) / 100)
    rightNum.length = 0
    res.split('').forEach(el => rightNum.push(el))
  }
}

window.addEventListener('keydown', function(e) {
  addChar(e.key)
  updateDisplay()
})
