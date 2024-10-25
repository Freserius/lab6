// Функция priority позволяет получить 
// значение приоритета для оператора.
// Возможные операторы: +, -, *, /.

function priority(operation) {
    if (operation == '+' || operation == '-') {
        return 1;
    } else {
        return 2;
    }
}

// Проверка, является ли строка str числом.
function isNumeric(str) {
    return /^\d+(.\d+){0,1}$/.test(str);
}

// Проверка, является ли строка str цифрой.
function isDigit(str) {
    return /^\d{1}$/.test(str);
}

// Проверка, является ли строка str оператором.
function isOperation(str) {
    return /^[\+\-\*\/]{1}$/.test(str);
}

// Функция tokenize принимает один аргумент -- строку
// с арифметическим выражением и делит его на токены 
// (числа, операторы, скобки). Возвращаемое значение --
// массив токенов.

function tokenize(str) {
    let tokens = [];
    let lastNumber = '';
    for (char of str) {
        if (isDigit(char) || char == '.') {
            lastNumber += char;
        } else {
            if(lastNumber.length > 0) {
                tokens.push(lastNumber);
                lastNumber = '';
            }
        } 
        if (isOperation(char) || char == '(' || char == ')') {
            tokens.push(char);
        } 
    }
    if (lastNumber.length > 0) {
        tokens.push(lastNumber);
    }
    return tokens;
}

// Функция compile принимает один аргумент -- строку
// с арифметическим выражением, записанным в инфиксной 
// нотации, и преобразует это выражение в обратную 
// польскую нотацию (ОПН). Возвращаемое значение -- 
// результат преобразования в виде строки, в которой 
// операторы и операнды отделены друг от друга пробелами. 
// Выражение может включать действительные числа, операторы 
// +, -, *, /, а также скобки. Все операторы бинарны и левоассоциативны.
// Функция реализует алгоритм сортировочной станции 
// (https://ru.wikipedia.org/wiki/Алгоритм_сортировочной_станции).

function compile(str) {
    let out = [];
    let stack = [];
    for (token of tokenize(str)) {
        if (isNumeric(token)) {
            out.push(token);
        } else if (isOperation(token)) {
            while (stack.length > 0 && isOperation(stack[stack.length - 1]) && priority(stack[stack.length - 1]) >= priority(token)) {
                out.push(stack.pop());
            }
            stack.push(token);
        } else if (token == '(') {
            stack.push(token);
        } else if (token == ')') {
            while (stack.length > 0 && stack[stack.length-1] != '(') {
                out.push(stack.pop());
            }
            stack.pop();
        }
    }
    while (stack.length > 0) {
        out.push(stack.pop());
    }
    return out.join(' ');
}

// Функция evaluate принимает один аргумент -- строку 
// с арифметическим выражением, записанным в обратной 
// польской нотации. Возвращаемое значение -- результат 
// вычисления выражения. Выражение может включать 
// действительные числа и операторы +, -, *, /.
// Вам нужно реализовать эту функцию
// (https://ru.wikipedia.org/wiki/Обратная_польская_запись#Вычисления_на_стеке).

function evaluate(rpn) {
    const stack = [];
    const tokens = rpn.split(' ');
    
    for (const token of tokens) {
        if (isNumeric(token)) {
            stack.push(parseFloat(token));
        } else {
            
            const b = stack.pop();
            const a = stack.pop();
            let result;

            switch (token) {
                case '+':
                    result = a + b;
                    break;
                case '-':
                    result = a - b;
                    break;
                case '*':
                    result = a * b;
                    break;
                case '/':
                    if (b === 0) {
                        throw new Error("Деление на ноль");
                    }
                    result = a / b;
                    break;
                default:
                    throw new Error(`Неизвестный оператор: ${token}`);
            }

        
            stack.push(result);
        }
    }

    
    if (stack.length !== 1) {
        throw new Error("Некорректное выражение");
    }

    return stack.pop();
}


// Функция clickHandler предназначена для обработки 
// событий клика по кнопкам калькулятора. 
// По нажатию на кнопки с классами digit, operation и bracket
// на экране (элемент с классом screen) должны появляться 
// соответствующие нажатой кнопке символы.
// По нажатию на кнопку с классом clear содержимое экрана 
// должно очищаться.
// По нажатию на кнопку с классом result на экране 
// должен появиться результат вычисления введённого выражения 
// с точностью до двух знаков после десятичного разделителя (точки).
// Реализуйте эту функцию. Воспользуйтесь механизмом делегирования 
// событий (https://learn.javascript.ru/event-delegation), чтобы 
// не назначать обработчик для каждой кнопки в отдельности.

function clickHandler(event) {
    const screen = document.querySelector('.screen span'); // элемент экрана калькулятора
    const clickedButton = event.target; // элемент, на который был произведён клик

    // Проверяем, является ли нажатая кнопка цифрой, оператором, скобкой или результатом
    if (clickedButton.classList.contains('digit') || clickedButton.classList.contains('operation') || clickedButton.classList.contains('bracket')) {
        // Добавляем нажатый символ на экран
        screen.textContent += clickedButton.textContent;
    }

    // Обработка кнопки очистки (clear)
    if (clickedButton.classList.contains('clear')) {
        screen.textContent = ''; // очищаем экран
    }

    // Обработка кнопки "равно" (result)
    if (clickedButton.classList.contains('result')) {
        try {
            // Получаем выражение с экрана
            const expression = screen.textContent;
            // Компилируем выражение в ОПН
            const rpn = compile(expression);
            // Вычисляем результат
            const result = evaluate(rpn);
            // Отображаем результат с точностью до двух знаков
            screen.textContent = result.toFixed(2);
        } catch (error) {
            screen.textContent = 'Ошибка';
        }
    }
}



// Назначьте нужные обработчики событий.

window.onload = function () {
    const buttonsContainer = document.querySelector('.buttons'); // контейнер всех кнопок
    buttonsContainer.addEventListener('click', clickHandler); // назначаем делегирование событий
};

