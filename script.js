const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
const vowels = ['A', 'E', 'I', 'O', 'U']
const t1 = ['T', 'S', 'R'];
const t2 = ['N', 'H', 'C']
const t3 = ['D', 'L','K', 'B'];
const t4 = ['M', 'W', 'F', 'G'];
const t5 = ['Y', 'P', 'V'];
const t6 = ['J', 'X', 'Q', 'Z'];

let vowelCount;
let chosenLetters = [];
let letter = "";
let skips = 3;
let randomIndex;
let night = false;
let currentCheck;
let isFetching = false;

let wordCount = 0;
let wins = 0;
let matches = 0;
let letterCount = 0;

// Check if the user has visited the page before
if (!localStorage.getItem('visited')) {
  // Run the function for first-time users
  openModal('modal')

  // Set a flag in local storage to indicate that the user has visited the page
  localStorage.setItem('visited', 'true');

  
}

document.addEventListener("DOMContentLoaded", function() {
      chosenLetters = [];
    generateList();
    generateLetter();
    letterCount = 0;
    wordCount = 0;
    skips = 3;  
    count = 15;
  
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
      if(isFetching){
        return undefined;
      }
        console.log("Square clicked:", squareId);
        let id = document.getElementById(squareId);
        let existingP = id.querySelector('p');
        if(!existingP) {
            //add style elements
            id.classList.add("space-add");
            //create p element
            let text = document.createElement('p');
            let letterText = document.createTextNode(letter);
            text.appendChild(letterText);
            id.appendChild(text);
            //play sfx
            //make new letter and reduce count
            generateLetter();
            count--;
            letterCount++;
            rowCheck(squareId);
        }
    }
});

function generateList(){
    //generate random vowel count from 3-8
    vowelCount = Math.floor(Math.random() * (3) + 6); 
    console.log(vowelCount)
    //total constants
    let totalConsonants = 16 - vowelCount;
    //calclulate distribution counts
    let t1Count = Math.floor(Math.max(1, totalConsonants - 6))
    let t2Count = Math.floor(Math.max(1, totalConsonants - 6))
    let t3Count = Math.floor(Math.max(1, totalConsonants - 8))
    let t4Count = Math.floor(Math.max(1, totalConsonants - 9))
    let t5Count = Math.floor(Math.max(1, totalConsonants - 10))
    let t6Count = Math.floor(Math.max(1, totalConsonants - 11))
    //list of distributions
    while(t1Count + t2Count + t3Count + t4Count + t5Count + t6Count > totalConsonants){
        if(t6Count > 0){
            t6Count--;
        } else if(t5Count > 0){
            t5Count--;
        } else {
            break;
        }
    }
    //add distributions to chosen array
    for(let i = 0; i < vowelCount; i++){
        chosenLetters.push(vowels[(Math.floor(Math.random() * vowels.length))])
    }
    for(let i = 0; i < t1Count; i++){
        chosenLetters.push(t1[(Math.floor(Math.random() * t1.length))])
    }
    for(let i = 0; i < t2Count; i++){
        chosenLetters.push(t2[(Math.floor(Math.random() * t2.length))])
    }
    for(let i = 0; i < t3Count; i++){
        chosenLetters.push(t3[(Math.floor(Math.random() * t3.length))])
    }
    for(let i = 0; i < t4Count; i++){
        chosenLetters.push(t4[(Math.floor(Math.random() * t4.length))])
    }
    for(let i = 0; i < t5Count; i++){
        chosenLetters.push(t5[(Math.floor(Math.random() * t5.length))])
    }
    for(let i = 0; i < t6Count; i++){
        chosenLetters.push(t6[(Math.floor(Math.random() * t6.length))])
    }

    if(vowelCount == 6){
        chosenLetters.pop()
    }
    console.log(chosenLetters);
}

function generateLetter() {
    // Choose a random letter from the array
    randomIndex = Math.floor(Math.random() * chosenLetters.length)
    console.log(randomIndex);
    letter = chosenLetters[randomIndex];
    if(letter == undefined){
        letter = letters[Math.floor(Math.random() * letters.length)]
    }
    console.log(letter);
    displayLetter();
}

function displayLetter(){
        const display = document.getElementById("letter");
        display.innerText = letter;
        let letterElement = document.querySelector('.letter');
        letterElement.style.animation = 'none'; // Remove animation
        void letterElement.offsetWidth; // Trigger reflow
        letterElement.style.animation = 'pop-in 0.2s ease'; // Re-add animation
        chosenLetters.splice(randomIndex, 1)
}

function skip(){
    if(skips > 0){
        generateLetter();
        skips--;
    }
}


function rowCheck(Id){
    // Extract row number from the ID
    let row = Id.substring(1, 2); // Assuming IDs are in the format 'rXsY'
    currentCheck = row;
    let word = [];
    // Iterate over all squares in the row
    for(let i = 1; i <= row; i++){
        let id = document.getElementById("r" + row + "s" + i);
        if (id) {
            let check = id.querySelector('p');
            if (check != null) {
                word.push(check.textContent);
            } else {
                console.log("RNC");
                return undefined;
            }
        }
    }
    let pushed = word.join(""); // Use join() to concatenate array elements into a string
    console.log(pushed + " was pushed");
    // Assuming `Get` is a valid function for fetching data
   Get(pushed);
}


function Get(word) {
    isFetching = true;
    return new Promise((resolve, reject) => {
        let url = "https://scrabble.adelbeit.com/check/" + word;
        fetch(url)
            .then(response => {
              if (!response.ok) {
                    throw new Error('Request failed: ' + response.status);
                } else {
                    animate("correct");
                    return response.json(); // Parse response JSON
                }
            })
            .then(data => {
                if (data.msg === "Valid word!") {
                    animate("correct");
                    resolve(data); // Resolve with data
                } else{
                  animate("wrong");
                  reject(error);
                }
            })
            .catch(error => {
                console.error('Error:', error.message);
                reject(error); // Reject with error
            });
    });
}


function animate(rw){
  isFetching = false;
    if(rw == "correct" || rw == "wrong") {
        for(let i = 1; i <= currentCheck; i++){
            let id = document.getElementById("r" + currentCheck + "s" + i);
            if (id) {
                id.classList.add(rw); // Adding either "correct" or "incorrect" class
            } else {
                console.error("Element with ID 'r" + currentCheck + "s" + i + "' not found.");
            }
        }
    } else {
        console.error("Invalid animation type:", rw);
    }
}

function winCheck(){
  if(wordCount == 5){
      wins++;
      localStorage.setItem('wins', wins);
  }
  if(letterCount == 16){
    matches++;
    localStorage.setItem('matches', matches);
  }
}

function refresh(){
    location.reload();
}

function openModal(id){
    let modal = document.getElementById(id);
    modal.showModal();
}

function closeModal(id){
    let modal = document.getElementById(id);
    modal.close();
}


