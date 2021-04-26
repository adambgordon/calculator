/* MAIN CODE */
let left = "";
let right = "";
let operator = "";
const keys = initKeys();
initCalculator();



/* FUNCTIONS */
function initKeys() {
    return [
        {id:	"all-clear",	key:	"a",    type: "command"}, // event.Key === (a || A)
        {id:	"clear",	    key:	"c",    type: "command"}, // event.Key === (c || C)
        {id:	"backspace",	key:	"bs",    type: "command"}, // event.key === (Backspace)
                    
        {id:	"zero",	        key:	"0",    type: "number"},
        {id:	"one",	        key:	"1",    type: "number"},
        {id:	"two",	        key:	"2",    type: "number"},
        {id:	"three",    	key:	"3",    type: "number"},
        {id:	"four",	        key:	"4",    type: "number"},
        {id:	"five",	        key:	"5",    type: "number"},
        {id:	"six",          key:	"6",    type: "number"},
        {id:	"seven",        key:	"7",    type: "number"},
        {id:	"eight",    	key:	"8",    type: "number"},
        {id:	"nine",	        key:	"9",    type: "number"},
        {id:	"decimal",	    key:	".",    type: "number"},
                    
        {id:	"equals",	    key:	"=",   type: "operator"}, // Event.key === (Enter)
        {id:	"plus",	        key:	"+",    type: "operator"}, // Event.key === (+ || =)
        {id:	"minus",	    key:	"-",    type: "operator"},
        {id:	"multiply",	    key:	"*",    type: "operator"}, // Event.key === (* || x)
        {id:	"divide",	    key:	"/",    type: "operator"}
    ]
}

function initCalculator() {
    initButtonGrid();
    window.addEventListener("keydown",keyDown);
    window.addEventListener("keyup",receiveKeyboardInput)

}
function initButtonGrid() {
    const buttons = document.querySelectorAll(".button-grid div");
    buttons.forEach( button => {
        button.style.gridArea = button.id; // Set grid placement
        button.classList.add("button"); // Add button class
        button.classList.add(keys[keyIndexById(button.id)].type); // Add respective type class
        button.addEventListener("mousedown",mouseDown); // Add event listener
        button.addEventListener("mouseup",receiveMouseInput); // Add event listener
    });
}



function keyDown (event) {
    let key = event.key;
    key = standardizeKey(key);
    if (keyIsValid(key)) addToActiveClass(key); 
}

function mouseDown (event) {
    const key = keys[keyIndexById(this.id)].key;
    addToActiveClass(key);
}

function receiveKeyboardInput(event) {
    let key = event.key;
    key = standardizeKey(key);
    if (keyIsValid(key)) {
        removeActiveClass(key);
        executeKey(key);
    }
}

function receiveMouseInput(event) {
    const key = keys[keyIndexById(this.id)].key;
    if (keyIsValid(key)) {
        removeActiveClass(key);
        executeKey(key);
    }}

function executeKey(key) {
    if (keyIsDisabled(key)) return;
    const type = keys[keyIndexByKey(key)].type;

    switch (type) {
        case "number":
            executeNumber(key);
            break;
        case "operator":
            executeOperator(key);
            break;
        case "command":
            executeCommand(key);
            break;
    }
}

function executeOperator (key) {
    const completeExpression = !(left === "" || right === "" || operator === "");        
    if (completeExpression) {
        left = Number(left);
        right = Number(right);

        let result;
        switch (operator) {
            case "+":
                result = add(left,right);
                break;
            case "-":
                result = subtract(left,right);
                break;
            case "*":
                result = multiply(left,right);
                break;
            case "/":
                result = divide(left,right);
                break;
        }
        logResult(left,operator,right,result);
        left = result.toString();
        right = "";
        setDisplay(left);
        enableDecimal();
    }
    operator = key;
}

function executeNumber (key) {
    if (key === ".") disableDecimal();
    switch (operator) {
        case "": 
            left = left + key;
            setDisplay(left);
            break;
        case "=":
            operator = "";
            left = key;
            setDisplay(left);
            break;
        default:
            if (right === "") enableDecimal();
            right = right + key;
            setDisplay(right);
            break;
    }
}

function executeCommand (key) {
    if (key == "a") {
        allClear();
    } else {
        if (operator === "") {
            if (key === "c") {
                left = "";
                enableDecimal();
            } else if (key === "bs") {
                left = backspace(left);
            }
            setDisplay(left);
        } else {
            if (key === "c") {
                right = "";
                enableDecimal();
            } else if (key === "bs") {
                right = backspace(right);
            }
            setDisplay(right);
        }
    }
}

function standardizeKey (key) {
    switch (key) {
        case "A":
            key = "a";
            break;
        case "C":
            key = "c";
            break;
        case "Backspace":
            key = "bs";
            break;
        case "Enter":
            key = "=";
            break;
        case "=":
            key = "+";
            break;
        case "x":
            key = "*";
            break;
    }
    return key;
}

function addToActiveClass (key) {
    const id = "#"+keyId(key);
    document.querySelector(id).classList.add("active");
}

function removeActiveClass(key) {
    const index = keyIndexByKey(key);
    const id = keys[index].id;
    const type = keys[index].type;
    const element = document.querySelector(`#${id}`);
    const operators = document.querySelectorAll(".operator");

    if ( (type === "number" || type === "command") || id === "equals" ) {
        element.classList.remove("active");
    }

    if (type === "operator" || id === "all-clear") {
        operators.forEach(operator => {
            if (operator.id !== id && operator.classList.contains("active")) operator.classList.remove("active");
        });
    }
}

function enableDecimal() {
    const element = document.querySelector("#decimal");
    element.classList.remove("disabled");
}

function disableDecimal() {
    const element = document.querySelector("#decimal");
    element.classList.add("disabled");
}

function keyIsDisabled(key) {
    const id = "#"+keyId(key);
    return document.querySelector(id).classList.contains("disabled");
}

function keyIsValid(key) {
    let valid = keyIndexByKey(key) === -1 ? false : true;
    return valid;
}

function keyIndexById (id) {
    return keys.findIndex(element => {return element.id === id});
}

function keyIndexByKey (key) {
    return keys.findIndex(element => {return element.key === key});
}

function keyId (key) {
    return keys[keyIndexByKey(key)].id;
}

function setDisplay (string) {
    if (string === "") string = "0";
    document.querySelector(".display").textContent = string;
}

function add (a,b) {
    return a + b;
}

function subtract (a,b) {
    return a - b;
}

function multiply (a,b) {
    return a * b;
}

function divide (a,b) {
    return a / b;
}


function allClear () {
    left = "";
    operator = "";
    right = "";
    clearLog();
    enableDecimal();
    setDisplay(left);
}

function backspace (string) {
    if(string.charAt(string.length-1) === ".") enableDecimal();
    return string.substring(0,string.length-1);
}

function logResult (left, operator, right, result) {
    let newOperator = operator === "/" ? "÷" : operator;
    let output = `${left} ${newOperator} ${right} = ${result}`;
    const newLog = document.createElement("div");
    newLog.classList.add("log");
    newLog.textContent = output;
    document.querySelector(".log-container").appendChild(newLog);
}

function clearLog () {
    const logs = document.querySelectorAll(".log");
    logs.forEach(element => element.remove());
}