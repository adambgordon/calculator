/* MAIN CODE */
let prev;
let current;
let operand;
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
        {id:	"multiply",	    key:	"*",    type: "operator"},
        {id:	"divide",	    key:	"/",    type: "operator"}
    ]
}

function initCalculator() {
    initButtonGrid();
    window.addEventListener('keydown',receiveKeyboardInput);

}
function initButtonGrid() {
    const buttons = document.querySelectorAll(".button-grid div");
    buttons.forEach( button => {
        button.style.gridArea = button.id;
        button.classList.add("button");
        button.addEventListener("click",receiveMouseInput)
    });
}

function receiveKeyboardInput(event) {
    let key = event.key;
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
    }
    const index = keys.findIndex(element => {return element.key === key});
    executeKey(index);
}

function receiveMouseInput(event) {
    const index = keys.findIndex(element => {return element.id === this.id});
    executeKey(index);
}

function executeKey(index) {
    if (index === -1) return;
    console.log(keys[index]);
}


function getButtonsList () {
    return document.querySelectorAll(".button");
}

