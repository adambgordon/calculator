/* MAIN CODE */
let left = "";
let right = "";
let operator = "";
const keys = initKeys();
initCalculator();
initLog();

/* FUNCTIONS */

// The main "dictionary" of keys
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

// Initialize the calculator
function initCalculator() {
    initButtonGrid(); // Call button grid initializer function
    window.addEventListener("keydown",keyDown); // Add event listener for keyboard input
    window.addEventListener("keyup",keyUp); // Add event listener for keyboard input

}

// Initialize the button grid
function initButtonGrid() {
    const buttons = document.querySelectorAll(".button-grid div");
    buttons.forEach( button => {
        button.style.gridArea = button.id; // Set grid placement
        button.classList.add("button"); // Add button class
        button.classList.add(keys[keyIndexById(button.id)].type); // Add respective type class
        button.addEventListener("mousedown",mouseDown); // Add event listener for mouse input
        button.addEventListener("mouseup",mouseUp); // Add event listener for mouse input
    });
}

// Initialize the log
function initLog() {
    const slider = document.querySelector(".slider");
    slider.addEventListener("click",toggleLog);
}

// Hides/unhides the log if slider is checked/unchecked
function toggleLog (event) {
    const logWrapper = document.querySelector(".log-wrapper");
    const log = document.querySelector(".log");
    const sliderInput = document.querySelector(".slider-container input:checked");
    if (sliderInput === null) {
        logWrapper.classList.add("log-wrapper-unhidden");
        log.classList.add("log-unhidden");
    } else {
        logWrapper.classList.remove("log-wrapper-unhidden");
        log.classList.remove("log-unhidden");
    }
}

// On key down, standardize input and activate button
function keyDown (event) {
    let key = event.key;
    key = standardizeKey(key);
    if (keyIsValid(key)) {
        addActiveClasses(key);
    }
}

// On mouse down, activate button
function mouseDown (event) {
    const key = keys[keyIndexById(this.id)].key;
    addActiveClasses(key);
}

// On key up, standardize input, deactivate if necessary, and execute
function keyUp(event) {
    let key = event.key;
    key = standardizeKey(key);
    if (keyIsValid(key)) {
        removeActiveClasses(key);
        executeKey(key);
    }
}

// On mouse up, deactivate if necessary and execute
function mouseUp(event) {
    const key = keys[keyIndexById(this.id)].key;
    if (keyIsValid(key)) {
        removeActiveClasses(key);
        executeKey(key);
    }
}

// executeKey function calls type-specific execute function
function executeKey(key) {
    if (keyIsDisabled(key)) return; // Do not execute if key is disabled (e.g. decimal)
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

// Checks for complete expression
function expressionIsComplete() {
    return !(left === "" || right === "" || operator === ""); 
}



// executeOperator function triggers the computation but
// will only do so after an expression is completed, thereby
// computing the expression with the "previous" operator.

/*
PSEUDOCODE:
- when (left/operator/right) all have input
    and a new operator key is hit
- then compute the left/operator/right
- update left to the new result
- update operator to the new operator
- new state = (left i.e. result / new operator / right i.e. empty))
*/
function executeOperator (key) {
    if (left !== "") enableDecimal(); // If switching to editing right side, re-enable decimal if necessary
    if (expressionIsComplete()) {
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
        
        result = roundTo(result,10); // Round to 10 places
        logResult(left,operator,right,result); // Add to log
        left = result.toString(); // New left now = result
        right = ""; // New right is now empty
        setDisplay(left); // Display result by displaying new left
    }
    if (left === "" && key === "-") { 
        // If left side has no input yet, allow "-" as negative sign intead of minus operator
        left += key;
        setDisplay(left);
    } else if (left !== "") {
        // If left side does have input, update the operator to specified input
        operator = key;
    }
}

// Round function
function roundTo(value, places) {
    const corrector = 10**places;
    return Math.round(value*corrector)/corrector;
}

// executeNumber function updates left or right side of expression based on operator value.
// If operator is empty or "=" then we know we are editing the left side of the expression.
// If operator is not empty, then we know we are editing the right side of the expression.
function executeNumber (key) {
    if (key === ".") {
        disableDecimal(); // If input is decimal, call disable function to prevent future decimal input and proceed with execution
    }
    switch (operator) {
        case "":
            if ((left === "" || left == "-") && key === ".") left += "0"; // Add 0 before decimal if decimal input
            left += key;
            setDisplay(left);
            break;
        case "=":
            operator = "";
            left = "";
            if ((left === "" || left == "-") && key === ".") left += "0"; // Add 0 before decimal if decimal input
            left += key;
            setDisplay(left);
            break;
        default:
            if (right === "" & key === ".") right = "0"; // Add 0 before decimal if decimal input
            right += key;
            setDisplay(right);
            break;
    }
}

// executeCommand function calls all-clear, clear, or backspace
// all-clear: clears the entire expression
// clear: clears one side of the expression (whichever is current)
// backspace: shortens current side of the expression by one char
function executeCommand (key) {
    if (key == "a") {
        allClear(); // all-clear
    } else {
        if (operator === "") {
            if (key === "c") { // clear
                left = "";
                enableDecimal(); // re-enable decimal if necessary
            } else if (key === "bs") { // backspace
                left = backspace(left);
            }
            setDisplay(left);
        } else {
            if (key === "c") { // clear
                right = "";
                enableDecimal(); // re-enable decimal if necessary
            } else if (key === "bs") { // backspace
                right = backspace(right);
            }
            setDisplay(right);
        }
    }
}

// Allows for multiple keyboard inputs where appropriate
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

// Returns DOM element
function getElementById(id) {
    return document.querySelector(`#${id}`);
}

// Checks if element contains "active" class
function isActive(element) {
    return element.classList.contains("active");
}

// Adds "active" class to element
function activate (element) {
    element.classList.add("active");
}

// Removes "active" class from element
function deactivate (element) {
    element.classList.remove("active");
}

// Removes "active" class from all operator elements except self
function deactivateOtherOperators (element) {
    const operators = document.querySelectorAll(".operator");
    operators.forEach(operator => {
        if (isActive(operator) && operator !== element) {
            deactivate(operator);
        }
    });
}

// Adds "active" class to self and calls
// deactivating function on other elements as necessary
function addActiveClasses (key) {
    const index = keyIndexByKey(key);
    const id = keys[index].id;
    const type = keys[index].type;
    const element = getElementById(id);

    if (id === "all-clear" || type === "operator") {
        deactivateOtherOperators(element);
    }
    activate(element);
}

// Removes "active" class from self if appropriate
function removeActiveClasses (key) {
    const index = keyIndexByKey(key);
    const id = keys[index].id;
    const type = keys[index].type;
    const element = getElementById(id);

    if (type !== "operator" || (left === "" || id === "equals")) {
        deactivate (element);
    }
}

// Removes "disabled" class from decimal DOM element
function enableDecimal() {
    const element = document.querySelector("#decimal");
    element.classList.remove("disabled");
}

// Adds "disabled" class from decimal DOM element
function disableDecimal() {
    const element = document.querySelector("#decimal");
    element.classList.add("disabled");
}

// Checks if DOM element contains "disabled" class
function keyIsDisabled(key) {
    const id = "#"+keyId(key);
    return document.querySelector(id).classList.contains("disabled");
}

// Checks if input exists in the key dictionary
function keyIsValid(key) {
    let valid = keyIndexByKey(key) === -1 ? false : true;
    return valid;
}

// Returns key dictionary index based on id
function keyIndexById (id) {
    return keys.findIndex(element => {return element.id === id});
}

// Returns key dictionary index (e.g. 13) based on key (e.g. ".")
function keyIndexByKey (key) {
    return keys.findIndex(element => {return element.key === key});
}

// Returns id (e.g. "decimal") based on key (e.g. ".")
function keyId (key) {
    return keys[keyIndexByKey(key)].id;
}

// Manipulates result string as necessary and updates display DOM element
function setDisplay (string) {
    if (string === "") {
        string = "0";
    } else {
        string = addThousandsSeparators(string);
    }
    document.querySelector(".display").textContent = string;
}

// Checks if string contains decimal
function containsDecimal (string) {
    return string.includes(".");
}

// Checks if string contains characters after decimal
function containsDecimalPlaces (string) {
    return (containsDecimal(string) && string.indexOf(".") < string.length - 1);
}

// Adds thousands separators in appopriate positions, controlling for
// negatives, decimals, infinity, etc.
function addThousandsSeparators (string) {
    if (string === "Infinity" || string === "-Infinity") return string;

    let portions;
    let negative = "";
    let integerSide = "";
    let decimal = "";
    let decimalSide = "";

    // If contains decimal, update strings accordingly
    if (containsDecimal(string)) {
        portions = string.split(".");
        integerSide = portions[0];
        decimal = ".";

        // If chars after decimal, update decimalSide string as such
        if (containsDecimalPlaces(string)) decimalSide = portions[1];
    } else {
        integerSide = string;
    }

    // Control for negative
    if (integerSide.charAt(0) === "-") {
        negative = "-";
        integerSide = integerSide.substring(1);
    }

    // This concatenation works based on component strings being updated or remaining empty
    let newString = negative + addCommasOnly(integerSide) + decimal + decimalSide;
    return newString;
}

// Adds commas given a string of integers only
function addCommasOnly (integerString) {

    // First determine number of commas needed and number digits before first commas
    const numberOfCommas = Math.floor((integerString.length-1)/3);
    let numberOfLeadingDigits = integerString.length % 3;
    if (numberOfLeadingDigits === 0) numberOfLeadingDigits = 3;

    // Start string construction with a string of leading digits and
    // a string of the remaining digits
    let buildString = integerString.substring(0,numberOfLeadingDigits);
    let restOfString = integerString.substring(numberOfLeadingDigits);
    
    // Call loop to slice and concatenate strings and commas accordingly
    for (let i = 0; i < numberOfCommas; i++) {
        buildString = buildString + "," + restOfString.substring(0,3);
        restOfString = restOfString.substring(3);
    }
    return buildString;
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

// Clears entire expression, re-enables decimal
function allClear () {
    left = "";
    operator = "";
    right = "";
    // clearLog(); // Commented out clearLog function so that the log can now never be deleted
    enableDecimal();
    setDisplay(left);
}

// Shortens string by one char and re-enables decimal if "." is deleted
function backspace (string) {
    if(string.charAt(string.length-1) === ".") enableDecimal();
    return string.substring(0,string.length-1);
}

// Manipulates and adds full equation to the log
function logResult (left, operator, right, result) {

    // Converst number inputs to strings
    let newLeft = addThousandsSeparators(left.toString());
    let newRight = addThousandsSeparators(right.toString());
    let newResult = addThousandsSeparators(result.toString());

    // Update operators to more user-friendly chars for the log
    let newOperator;
    switch (operator) {
        case "/":
            newOperator = "÷";
            break;
        case "-":
            newOperator = "–";
            break;
        case "*":
            newOperator = "x";
            break;
        default:
            newOperator = operator;
            break;
    }

    // Creat equation string
    let output = `${newLeft} ${newOperator} ${newRight} = ${newResult}`;

    // Create DOM element for new equation
    const newLogItem = document.createElement("div");
    newLogItem.classList.add("log-item");
    newLogItem.textContent = output;
    
    // Add element to top of the log
    const log = document.querySelector(".log");
    log.insertBefore(newLogItem,log.firstElementChild);
}

// Deletes all log item DOM elements
function clearLog () {
    const logs = document.querySelectorAll(".log-item");
    logs.forEach(element => element.remove());
}