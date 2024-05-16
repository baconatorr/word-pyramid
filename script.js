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
let rowCount = 0;
let wins = parseInt(localStorage.getItem('wins')) || 0; 
let matches = parseInt(localStorage.getItem('matches')) || 0; 
let letterCount = 0;

if (!localStorage.getItem('visited')) {

  openModal('modal')
  localStorage.setItem('wins', 0);
  localStorage.setItem('matches', 0);
  localStorage.setItem('visited', 'true');

  
}

document.addEventListener("DOMContentLoaded", function() {
    chosenLetters = [];
    generateList();
    generateLetter();
    letterCount = 0;
    wordCount = 0;
    rowCount = 0;
    skips = 3;  
    count = 15;
    wins = parseInt(localStorage.getItem('wins')) || 0; 
    matches = parseInt(localStorage.getItem('matches')) || 0; 
    loadStats();
    var squares = document.querySelectorAll(".space");


    squares.forEach(function(square) {
        square.addEventListener("click", function() {
            var squareId = square.id;
            addLetter(squareId);
        });
    });

    function addLetter(squareId) {
      if(isFetching){
        return undefined;
      }
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
            letterCount++;
            rowCheck(squareId);
        }
    }
});

function generateList(){
    vowelCount = Math.floor(Math.random() * (3) + 6); 
    console.log(vowelCount)
    let totalConsonants = 16 - vowelCount;
    let t1Count = Math.floor(Math.max(1, totalConsonants - 6))
    let t2Count = Math.floor(Math.max(1, totalConsonants - 6))
    let t3Count = Math.floor(Math.max(1, totalConsonants - 8))
    let t4Count = Math.floor(Math.max(1, totalConsonants - 9))
    let t5Count = Math.floor(Math.max(1, totalConsonants - 10))
    let t6Count = Math.floor(Math.max(1, totalConsonants - 11))
    while(t1Count + t2Count + t3Count + t4Count + t5Count + t6Count > totalConsonants){
        if(t6Count > 0){
            t6Count--;
        } else if(t5Count > 0){
            t5Count--;
        } else {
            break;
        }
    }

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
        letterElement.style.animation = 'none';
        void letterElement.offsetWidth; 
        letterElement.style.animation = 'pop-in 0.2s ease'; 
        chosenLetters.splice(randomIndex, 1)
}

function skip(){
    if(skips > 0){
        generateLetter();
        skips--;
    }
}


function rowCheck(Id){
    let row = Id.substring(1, 2); 
    currentCheck = row;
    let word = [];
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
    let pushed = word.join(""); 
    console.log(pushed + " was pushed");
   Get(pushed);
}


function Get(word) {
    rowCount++;
    console.log(rowCount);
    isFetching = true;
    return new Promise((resolve, reject) => {
        let url = "https://api.dictionaryapi.dev/api/v2/entries/en/" + word;
        fetch(url)
            .then(response => {
                if (response.status === 404) {
                    animate("wrong");
                    reject(new Error('Word not found in the dictionary.'));
                } else if (!response.ok) {
                    Get(word);
                    throw new Error('Request failed: ' + response.status);
                } else {
                    animate("correct");
                    resolve();
                }
            })
            .catch(error => {
    });
  })
}

function animate(rw){
  isFetching = false;
    if(rw == "correct" || rw == "wrong") {
        for(let i = 1; i <= currentCheck; i++){
            let id = document.getElementById("r" + currentCheck + "s" + i);
            if (id) {
                id.classList.add(rw);
            } else {
                console.error("Element with ID 'r" + currentCheck + "s" + i + "' not found.");
            }
        }
    } else {
        console.error("Invalid animation type:", rw);
    }

    if(rw == "correct"){
      wordCount++;
    }
  winCheck();
}

function winCheck(){
  if(wordCount == 5){
    console.log('match complete');
      document.getElementById("popper-button").style.visibility = "visible";
      confetti();
      matches++;
      wins++;
      localStorage.setItem('wins', wins);
      localStorage.setItem('matches', matches);
      loadStats();
      return undefined;
  }
  if(rowCount == 5){
    console.log('match complete');
    matches++;
    localStorage.setItem('matches', matches);
    loadStats();
  }
}

function loadStats(){
  document.getElementById('winDisplay').innerText = "Wins: " + wins;
  document.getElementById('matchDisplay').innerText = "Matches: " + matches;
  let percent = Math.round(wins/matches * 100);
  if(percent != NaN){
    document.getElementById('percentDisplay').innerText = "Victory Percent: " + percent + "%";
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

function share(where) {
  if(where == "native"){
    let textToCopyOrShare = "Come try this new game!: " + " https://wordpyra.com";
  }
  navigator.clipboard.writeText(textToCopyOrShare)
}

function confetti() {
  const canvas = document.querySelector("body");
  const jsConfetti = new JSConfetti()
  jsConfetti.addConfetti()
}
