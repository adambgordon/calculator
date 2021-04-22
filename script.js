initCalculator();




function initCalculator() {

    window.addEventListener('keydown',receiveKey);

}

function receiveKey(event) {
    console.log(this.value);
    console.log(event);
}

