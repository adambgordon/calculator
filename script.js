/* MAIN CODE */
let prev;
let current;
let operand;
const keyDictionary = initKeyDictionary();
initCalculator();



/* FUNCTIONS */
function initKeyDictionary() {
    return [
        {id:	"all-clear",	key:	"a"}, // event.Key === (a || A)
        {id:	"clear",	    key:	"c"}, // event.Key === (c || C)
        {id:	"backspace",	key:	"bs"}, // event.key === (Backspace)
                    
        {id:	"zero",	        key:	"0"},
        {id:	"one",	        key:	"1"},
        {id:	"two",	        key:	"2"},
        {id:	"three",    	key:	"3"},
        {id:	"four",	        key:	"4"},
        {id:	"five",	        key:	"5"},
        {id:	"six",          key:	"6"},
        {id:	"seven",        key:	"7"},
        {id:	"eight",    	key:	"8"},
        {id:	"nine",	        key:	"9"},
        {id:	"decimal",	    key:	"."},
                    
        {id:	"equals",	    key:	"="}, // Event.key === (Enter)
        {id:	"plus",	        key:	"+"}, // Event.key === (+ || =)
        {id:	"minus",	    key:	"-"},
        {id:	"multiply",	    key:	"*"},
        {id:	"divide",	    key:	"/"},
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
    if (keyDictionary.some(element => element.key === key)) {
        console.log(key);
    }
}

function receiveMouseInput(event) {
    const index = keyDictionary.findIndex(element => {return element.id === this.id});
    const key  = keyDictionary[index].key;
    console.log(key);
}

function receiveInput(id) {
}

function getButtonsList () {
    return document.querySelectorAll(".button");
}

