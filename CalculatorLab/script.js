window.onload = function () {
    let a = '';
    let b = ''; 
    let expressionResult = '';
    let selectedOperation = null;

    const outputElement = document.getElementById("result");

    const digitButtons = document.querySelectorAll('[id ^= "btn_digit_"]');

    function updateDisplay(value) {
        outputElement.innerHTML = value;
    }

    // Функция обработки нажатия на цифровые кнопки
    //function onDigitButtonClicked(digit) {
    //    // Если операция не выбрана, работаем с первым числом
    //    if (!selectedOperation) {
    //        // Проверяем, не пытаемся ли мы добавить вторую точку
    //        if (digit === '.' && a.includes('.')) return;
    //        if (digit === '.' && a === '') a = '0';
    //        a += digit;
    //        // Убираем ведущий ноль если есть
    //        if (a.length > 1 && a[0] === '0' && a[1] !== '.') {
    //            a = a.substring(1);
    //        }
    //        updateDisplay(a);
    //    }
    //    // Если операция выбрана, работаем со вторым числом
    //    else {
    //        if (digit === '.' && b.includes('.')) return;
    //        if (digit === '.' && b === '') b = '0';
    //        b += digit;
    //        if (b.length > 1 && b[0] === '0' && b[1] !== '.') {
    //            b = b.substring(1);
    //        }
    //        updateDisplay(b);
    //    }
    //}



    function onDigitButtonClicked(digit) {
        // Если операция не выбрана, работаем с первым числом (a) - после выбора операции начинается ввод второго числа
        if (!selectedOperation) {
            // Проверяем, не пытаемся ли мы добавить вторую точку
            if ((digit != '.') || (digit == '.' && !a.includes(digit))) {
                // здесь у нас происходит складывание сохраненного уже числа и нажатой цифры. Оба поля string, поэтому
                // каждый раз цифра записывается в конец строки. Например: a = '14', digit = '5', 
                // a += digit - это короткая запись a = a + digit - поэтомоу после этой операции a = '145'
                a += digit;
            }
            outputElement.innerHTML = a;
        }
        // Если операция выбрана, работаем со вторым числом (b)
        else {
            if ((digit != '.') || (digit == '.' && !b.includes(digit))) {
                b += digit;
                outputElement.innerHTML = b;
            }
        }
    }










    // Функция выполнения вычислений
    function calculate() {
        if (a === '' || b === '' || !selectedOperation) {
            return;
        }

        const num1 = parseFloat(a);
        const num2 = parseFloat(b);

        switch (selectedOperation) {
            case 'x':
                expressionResult = num1 * num2;
                break;
            case '+':
                expressionResult = num1 + num2;
                break;
            case '-':
                expressionResult = num1 - num2;
                break;
            case '/':
                if (num2 === 0) {
                    alert('Деление на ноль невозможно!');
                    return;
                }
                expressionResult = num1 / num2;
                break;
            default:
                return;
        }

        // Подготавливаем к следующему вводу
        a = expressionResult.toString();
        b = '';
        selectedOperation = null;

        updateDisplay(a);
    }

    // Настройка обработчиков для цифровых кнопок
    digitButtons.forEach(button => {
        button.onclick = function () {
            const digitValue = button.innerHTML;
            onDigitButtonClicked(digitValue);
        }
    });

    // Кнопка десятичной точки
    document.getElementById("btn_digit_dot").onclick = function () {
        onDigitButtonClicked('.');
    };

    //// Обработчики для кнопок операций
    //document.getElementById("btn_op_mult").onclick = function () {
    //    if (a === '') return;
    //    if (b !== '' && selectedOperation) {
    //        calculate();
    //    }
    //    selectedOperation = 'x';
    //}

    //document.getElementById("btn_op_plus").onclick = function () {
    //    if (a === '') return;
    //    if (b !== '' && selectedOperation) {
    //        calculate();
    //    }
    //    selectedOperation = '+';
    //}

    //document.getElementById("btn_op_minus").onclick = function () {
    //    if (a === '') return;
    //    if (b !== '' && selectedOperation) {
    //        calculate();
    //    }
    //    selectedOperation = '-';
    //}

    //document.getElementById("btn_op_div").onclick = function () {
    //    if (a === '') return;
    //    if (b !== '' && selectedOperation) {
    //        calculate();
    //    }
    //    selectedOperation = '/';
    //}

    // Настраиваем обработчики для цифровых кнопок - для каждой кнопки с цифрой и точкой вызываем выше написанную функцию по формированию числа
    digitButtons.forEach(button => {
        button.onclick = function () {
            // берем текст, написанный на кнопке - он и является цифрой
            const digitValue = button.innerHTML;
            onDigitButtonClicked(digitValue);
        }
    });

    // Настраиваем обработчики для кнопок операций - сохраняем выбранную операцию в ранее созданную переменную selectedOperation
    document.getElementById("btn_op_mult").onclick = function () {
        if (a === '') return;
        selectedOperation = 'x';
    }
    document.getElementById("btn_op_plus").onclick = function () {
        if (a === '') return;
        selectedOperation = '+';
    }
    document.getElementById("btn_op_minus").onclick = function () {
        if (a === '') return;
        selectedOperation = '-';
    }
    document.getElementById("btn_op_div").onclick = function () {
        if (a === '') return;
        selectedOperation = '/';
    }

    //// Кнопка очистки (C)
    //document.getElementById("btn_op_clear").onclick = function () {
    //    a = '';
    //    b = '';
    //    selectedOperation = null;
    //    expressionResult = '';
    //    updateDisplay(0);
    //}

    // Очищаем все значения при нажатии на кнопку C (вешаем обработчик события click на кнопку С)
    document.getElementById("btn_op_clear").onclick = function () {
        a = ''
        b = ''
        selectedOperation = ''
        expressionResult = ''
        outputElement.innerHTML = 0
    }

    // Кнопка равно
    document.getElementById("btn_op_equal").onclick = function () {
        calculate();
    }

    // 1. Запрограммируйте операцию смены знака +/-;
    document.getElementById("btn_op_sign").onclick = function () {
        if (!selectedOperation && a !== '') {
            a = (parseFloat(a) * -1).toString();
            updateDisplay(a);
        } else if (selectedOperation && b !== '') {
            b = (parseFloat(b) * -1).toString();
            updateDisplay(b);
        }
    }

    // 2. Запрограммируйте операцию вычисления процента %;
    document.getElementById("btn_op_percent").onclick = function () {
        if (!selectedOperation && a !== '') {
            a = (parseFloat(a) / 100).toString();
            updateDisplay(a);
        } else if (selectedOperation && b !== '') {
            b = (parseFloat(b) / 100).toString();
            updateDisplay(b);
        } else if (a !== '' && selectedOperation && b === '') {
            // Если второе число еще не введено, применяем процент к первому
            b = (parseFloat(a) / 100).toString();
            updateDisplay(b);
        }
    }

    // Обработчик для выпадающего списка
    document.getElementById('dropdown-menu').addEventListener('change', function () {
        const selectedValue = this.value;
        const result = document.getElementById('result');

        // Выполняем разные действия в зависимости от выбора
        switch (selectedValue) {
            case 'option1':
                alert('you chose the first option');
                break;
            case 'option2':
                // 11. Сделайте смену цвета окна вывода результата по кнопке;
                result.classList.toggle('highlight-result');
                break;
            case 'option3':
                // Очищаем калькулятор
                a = '';
                b = '';
                selectedOperation = null;
                expressionResult = '';
                updateDisplay(0);
                break;
        }

        // Сбрасываем выбор на значение по умолчанию
        this.value = 'default';
    });
    //Добавьте кнопку стирания введенной цифры назад(backspace).Расположить кнопку можно, например, на месте нерабочих + /- и % кнопок;
//    Запрограммируйте операцию вычисления квадратного корня √;
//Запрограммируйте операцию возведения в квадрат x²;
//Запрограммируйте операцию вычисления факториала x!;
//Добавьте кнопку, которая за раз добавляет сразу три нуля(000);
}