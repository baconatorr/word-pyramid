const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
let letter = "";
let skips = 3;
let count = 15;
window.onload = () => {
    generateLetter();
    skips = 3;  
    count = 15;
}

document.addEventListener("DOMContentLoaded", function() {
    // Get all the square elements
    var squares = document.querySelectorAll(".space");

    // Loop through each square and add click event listener
    squares.forEach(function(square) {
        square.addEventListener("click", function() {
            // Get the ID of the clicked square
            var squareId = square.id;
            // Call your function with the ID as parameter
            addLetter(squareId);
        });
    });

    // Function to handle square click
    function addLetter(squareId) {
        console.log("Square clicked:", squareId);
        let id = document.getElementById(squareId);
        let existingP = id.querySelector('p');
        if(!existingP) {
            id.classList.add("space-add");
            let text = document.createElement('p');
            let letterText = document.createTextNode(letter);
            text.appendChild(letterText);
            id.appendChild(text);
            generateLetter();
            count--;
        }
    }
});

function generateLetter() {
    // Choose a random letter from the array
    letter = letters[Math.floor(Math.random() * 26)];
    displayLetter();
}

function displayLetter(){
    if(count > 1){
        const display = document.getElementById("letter");
        display.innerText = letter;
    }
}

function skip(){
    if(skips > 0){
        generateLetter();
        skips--;
    }
}

function refresh(){
    location.reload();
}