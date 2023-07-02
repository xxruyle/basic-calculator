let operatorArray = ['×', '-', '', '÷', '+']; // the list of all the operators used in the calculator 

let numStack = [];

const display = document.querySelector('.display');

let add = function(num1, num2) {
    return num1 + num2; 
}

let subtract = function(num1, num2) { // non commutative 
    return num2 - num1  
}

let multiply = function(num1, num2) {
    return num1 * num2; 
}

let divide = function(num1, num2) { // non commutative  
    return num2/num1; 
}

let operator = function(operator, num1, num2) {
    num1 = Number(num1);
    num2 = Number(num2); 

    if (operator === '+') 
        return add(num1, num2);  
    else if (operator === '-') 
        return subtract(num1, num2);
    else if (operator === '×')
        return multiply(num1, num2);
    else if (operator === '÷') 
        return divide(num1, num2);
}

let hasMorePrecedence = function(operator, newOperator) {
    if ((newOperator === "*" && operator === "+") || (newOperator === "*" && operator === "-"))  
    {
        return true;  
    } else if ((newOperator === "/" && operator === "+") || (newOperator === "/" && operator === "-")) {
        return true; 
    } else {
        return false; 
    }
}


let infixToPostfix = function() { // use the shunting yard algorithm to  convert infix notation to reverse postfix notation  
    let operatorStack = [];  
    let postfixOutput = []; 

    for (let i = 0; i < numStack.length; i++) 
    {
        let char = numStack[i];  

        if (operatorArray.includes(char))  
        {
            if (operatorStack.length > 0) 
            {
                if (hasMorePrecedence(numStack[numStack.length - 1], char))
                {
                    postfixOutput.push(operatorStack.pop()); 
                }
            }


            operatorStack.push(char); 
        } else {
            postfixOutput.push(char); 
        }
    }



    while (operatorStack.length > 0)  
    {
        postfixOutput.push(operatorStack.pop()); 
    }

    return postfixOutput; 
}

let calculate = function() { // calculates a given postfix expression  
    let postfix = infixToPostfix(); 

    let outputStack = [];

    for (let i = 0; i < postfix.length; i++) 
    {

        let char = postfix[i]; 
        if (!operatorArray.includes(char))
        {
            outputStack.push(char); 
        } else {
            if (outputStack)
            {
                let first = outputStack.pop(); 
                let second = outputStack.pop(); 
                let res = operator(char, first, second); 
                outputStack.push(res); 
            }
        }
    }


    if (outputStack[0] === NaN)    
    {
        return 'ERROR'; 
    }


    return outputStack[0]; 
}

let displayCalculation = function() { 
    let answer = calculate();  

    const displayAnswer = document.createElement('div'); 

    if (isNaN(answer))   
    {
        answer = 'OPERATOR ERROR';  
        displayAnswer.classList.add('display-error');  
    } else {
        displayAnswer.classList.add('display-answer'); 
    }

    displayAnswer.textContent = answer ;

    clearDisplay(); 

    display.appendChild(displayAnswer); 
}


let displayNum = function(char) {
    clearAnswer(); 

    if (numStack.length === 0 || operatorArray.includes(numStack[numStack.length - 1]) || operatorArray.includes(char))  
    {
        const newNum = document.createElement('div'); 
        newNum.classList.add('display-num'); 
        newNum.textContent = char; 
        display.appendChild(newNum); 
        numStack.push(newNum.textContent); 
    } else { // if there is a number that has not been terminated by an operator
        if (char === '.')
        {
            if (!numStack[numStack.length - 1].includes('.')) // check to see if num has a decimal when the char is a decimal
            {
                const lastNum = display; 
                lastNum.lastChild.textContent += char;
                numStack[numStack.length - 1] = lastNum.lastChild.textContent;
            }
        } else {
            const lastNum = display; 
            lastNum.lastChild.textContent += char;
            numStack[numStack.length - 1] = lastNum.lastChild.textContent;
        }

    }

    console.log(numStack); 

}

let clearDisplay = function() {
    clearAnswer(); 
    const displayNums = document.querySelectorAll('.display-num'); 
    displayNums.forEach((displayNum) => {
        displayNum.remove(); 
    })
    numStack = [];
}

let clearAnswer = function() { 
    const displayAnswer = document.querySelector('.display-answer'); 
    const displayError = document.querySelector('.display-error'); 
    if (displayAnswer)
        displayAnswer.remove(); 

    if (displayError) 
        displayError.remove(); 


}




const nums = document.querySelectorAll('.num'); 
nums.forEach((num) => {
    num.addEventListener('click', (e) => {
        displayNum(e.target.textContent)
    })
})

const operators = document.querySelectorAll('.operator');
operators.forEach((operator) => {
    operator.addEventListener('click', (e) => {
        displayNum(e.target.textContent);
    })
})

const clear = document.querySelector('.clear'); 
clear.addEventListener('click', clearDisplay);

const equalCalculate = document.querySelector('.equal'); 
equalCalculate.addEventListener('click', displayCalculation); 

const keyDown = window.addEventListener('keydown', (e) => {
    const keyDiv = document.querySelector(`.num[data-key=${e.code}]`); 
    const operatorDiv = document.querySelector(`.operator[data-key=${e.code}]`);  
    const equalDiv = document.querySelector(`.equal[data-key=${e.code}]`); 
    const clearDiv = document.querySelector(`.clear[data-key=${e.code}]`); 


    if (keyDiv) 
    {
        displayNum(keyDiv.textContent); 
    }
    else if (operatorDiv)
    {
        displayNum(operatorDiv.textContent); 
    } else if (equalDiv) 
    {
        displayCalculation(); 
    } else if (clearDiv) 
    {
        clearDisplay(); 
    }
}) 



