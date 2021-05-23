function operate(op, a, b) {


    switch (op) {
        case '+':
            return a + b;
            break;
        case '-':
            return a - b;
            break;
        case '*':
            return a * b;
            break;
        case '/':
            return a / b;
            break;
        default: 'hi'
            break;
    }
};


console.log(operate('+', 2, 2));

const display = document.querySelector('span');

let text = 0;
window.addEventListener('keypress', function(e) {
    display.textContent = text;
    text += e.key;
});
