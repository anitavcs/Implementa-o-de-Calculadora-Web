const display = document.getElementById("display");
const historyList = document.getElementById("history-list");

let currentValue = "";
let previousValue = "";
let operator = "";
let shouldResetDisplay = false;

// Função para atualizar o display
function updateDisplay(value) {
    display.textContent = value;
}

// Adiciona click nos botões
document.querySelectorAll(".btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const value = btn.dataset.value;
        const action = btn.dataset.action;

        if (action === "clear") {
            clearAll();
            return;
        }

        if (action === "equal") {
            calculate();
            return;
        }

        if (value) handleInput(value);
    });
});

// Lida com números e ponto
function handleInput(value) {

    if (value === "." && currentValue.includes(".")) return;

    if (shouldResetDisplay) {
        currentValue = value;
        shouldResetDisplay = false;
    } else {
        currentValue += value;
    }

    updateDisplay(currentValue);
}

// Limpa tudo
function clearAll() {
    currentValue = "";
    previousValue = "";
    operator = "";
    updateDisplay("0");
}

// Realiza o cálculo
function calculate() {
    if (!previousValue || !currentValue || !operator) return;

    const a = parseFloat(previousValue);
    const b = parseFloat(currentValue);

    let result = 0;

    switch (operator) {
        case "+": result = a + b; break;
        case "-": result = a - b; break;
        case "*": result = a * b; break;
        case "/":
            if (b === 0) {
                updateDisplay("Erro");
                return;
            }
            result = a / b;
            break;
    }

    const historyItem = `${a} ${operator} ${b} = ${result}`;
    addToHistory(historyItem);

    updateDisplay(result);
    currentValue = result.toString();
    previousValue = "";
    operator = "";
    shouldResetDisplay = true;
}

// Adiciona ao histórico
function addToHistory(text) {
    const li = document.createElement("li");
    li.textContent = text;

    // Recarregar valor ao clicar
    li.addEventListener("click", () => {
        const result = text.split("=").pop().trim();
        currentValue = result;
        updateDisplay(result);
    });

    historyList.prepend(li);
}

// Detecta clique em operadores
document.querySelectorAll(".op").forEach(opBtn => {
    opBtn.addEventListener("click", () => {
        const value = opBtn.dataset.value;
        if (!value) return;

        if (currentValue === "") return;

        if (previousValue && operator && !shouldResetDisplay) {
            calculate();
        }

        operator = value;
        previousValue = currentValue;
        currentValue = "";
    });
});
