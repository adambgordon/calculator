/* MAIN CODE */
initCalculator();



/* FUNCTIONS */
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
    let id;
    if(event.shiftKey && event.code === "Digit8") {
        id = "multiply";
    } else {
        element = document.querySelector(`div[data-eventCode="${event.code}"]`);
        if (element) id = element.id;
    }
    if (id) receiveInput(id);
}

function receiveMouseInput(event) {
    receiveInput(this.id);
}

function receiveInput(id) {
    console.log(id);
}

function getButtonsList () {
    return document.querySelectorAll(".button");
}

