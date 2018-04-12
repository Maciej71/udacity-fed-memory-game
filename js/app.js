const game = {
    symbols: ['fa-angellist', 'fa-android', 'fa-bell', 'fa-github-alt' ,'fa-car' ,'fa-bug', 'fa-heart', 'fa-child'],
    deck: document.getElementsByClassName('deck')[0],
    minutesElement: document.getElementById('minutes'),
    secondsElement: document.getElementById('seconds'),
    thirdStar: document.getElementById('star3'),
    secondStar: document.getElementById('star2'),
    firstStar: document.getElementById('star1'),
    visibleIcons: [],
    quotes: {start:"Let's get started", match:'What a MATCH!', keep:'Keep going'},
    moves: 0,
    win: 0,
    seconds: 0,
    minutes: 0,
    stars: 3,
    starTimer: 0,
    time: null
}

function init() {
    createADeck();
    addListenerForReset();
    addListenerForTimer();
    setQuote(game.quotes.start);
}

function setQuote(quote) {
    const textContainer = document.getElementById('quotes');
    textContainer.innerText = quote;
    textContainer.classList.toggle('winning-quote');
   
}

/*
Create a deck of cards by adding document fragment
with appended childs containing hidden cards and a proper symbol
*/
function createADeck() {
    const fragment = document.createDocumentFragment();
    const fullSymbolsSet = game.symbols.concat(game.symbols);

    for (let i = 0; i < 16; i++) {
        const containerElement = document.createElement('div');
        const iconElemnt = document.createElement('div');

        iconElemnt.classList.add('hiden-card', 'fa', pickRandomSymbol(fullSymbolsSet))
        containerElement.classList.add('card');

        addListenerForTurningCard(containerElement);

        containerElement.appendChild(iconElemnt);
        fragment.appendChild(containerElement);
    }
    game.deck.appendChild(fragment);
}

// Get a random symbol and remove it from symbols set
function pickRandomSymbol(symbolsSet) {
    return symbolsSet.splice(Math.random() * symbolsSet.length, 1);
}

// Listener for hidden card click with check if card should be turn around
function addListenerForTurningCard(element) {
    element.addEventListener('click', function(evt) {
        const elementMatched = evt.target.classList.contains('matched');
        const parentMatched = evt.target.parentNode.classList.contains('matched');
        const isNotClickedOnChild = evt.target !== game.visibleIcons[0];
        const isNotClickedOnParent = evt.target.firstChild !== game.visibleIcons[0];

        if(!elementMatched && !parentMatched && (game.visibleIcons.length < 2) 
        && isNotClickedOnChild && isNotClickedOnParent) {
            const icon = element.firstChild;
            game.visibleIcons.push(icon);
            flip(icon);
            isMatch();
        }
    });
}

// Listener for reset with setting appropriate values for variable
function addListenerForReset() {
    const resetButton = document.getElementsByClassName('reset')[0];
    resetButton.addEventListener('click', async function() {
        resetButton.classList.toggle('reduce');
        while(game.deck.firstChild) {
            game.deck.removeChild(game.deck.firstChild);
        }
        game.moves = 1;
        game.visibleIcons = [];
        game.win = 0;
        resetStars();
        game.starTimer = 0; 
        resetTimer();
        setDisplayedMoves(0);
        createADeck();
        await sleep(150);
        resetButton.classList.toggle('reduce');
    });
}

//set correct number of stars and reset elements
function resetStars() {
    switch(game.stars) {
        case 2:
            game.thirdStar.classList.add('fa-star');
            game.stars++;
            resetStars();        
            break;
        case 1:
            game.secondStar.classList.add('fa-star');
            game.stars++;
            resetStars(); 
            break;
        case 0:
            game.firstStar.innerText = '';
            game.firstStar.classList.add('fa-star');
            game.stars++;
            resetStars();
    }
}

//used to start a timer when first card is clicked
function addListenerForTimer() {
    game.deck.addEventListener('click', startTimer = function() {
        timer();
        game.deck.removeEventListener('click', startTimer);
    } );
}

function flip(icon) {
    icon.parentNode.classList.toggle('flip');
    icon.classList.toggle('hiden-card');
}

// Check if there is a match, if game should be ended and set correct quote 
async function isMatch() { 
    if(game.visibleIcons.length === 2 && game.visibleIcons[0] !== game.visibleIcons[1]) {
        if(areCardsMatch()) {
            game.win++;
            matchingHelper();
            setQuote(game.quotes.match);
            if(game.win === 8) {
                game.moves++;
                setDisplayedMoves(game.moves);
                openWinPage();
            }
            await sleep(2500);
            setQuote(game.quotes.keep);
        }
        else {
            clearIcons();
        }
    }  
    else if(game.visibleIcons === 1){
      clearIcons();
    }
}

//Turn back card
async function clearIcons() {
    await sleep(1000);
    game.visibleIcons.forEach((i) => flip(i));
    game.visibleIcons = [];
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

//Check if two cards matching
function areCardsMatch() {
    const firstCardClasses = game.visibleIcons[0].classList;
    const secondCardClasses = game.visibleIcons[1].classList;

    for(let element of firstCardClasses) {
        if(!secondCardClasses.contains(element)) {
            game.moves++;
            setDisplayedMoves(game.moves);
            return false;
        }
    }
    return true;
}

//Set matched cards
function matchingHelper() {
    game.visibleIcons.forEach((e) => {
        e.parentNode.classList.add('matched');
    });
    game.visibleIcons = [];
} 

function setDisplayedMoves(toSet) {
    document.getElementById('moves').innerText = 'Moves: ' + toSet;
}

function openWinPage() {
    document.getElementById('win-page').style.width = '100%';
    document.getElementById('win-moves').innerText = 'You did it in ' + game.moves + (game.moves === 1 ? 'move' : 'moves');
    document.getElementById('win-time').innerText = 'It took you ' + game.minutesElement.innerText + ' minutes and ' +
     game.secondsElement.innerText + ' sconds';
    document.getElementById('star-text').innerText = 'Your rating is ' + game.stars + ' ';
}

function playAgain() {
    window.location.reload(false);
}

function timer() {
    game.time = setTimeout(addTime, 1000);
} 

//Update timer 
function addTime() {
    game.seconds++;
    game.starTimer++;
    game.secondsElement.innerText = game.seconds > 9 ? game.seconds : '0' + game.seconds;
    if(game.seconds === 60) {
        game.seconds = 0;
        game.minutes++;
        game.minutesElement.innerText = game.minutes > 9 ? game.minutes : '0' + game.minutes; 
        if(game.minutes === 60) {
            stopTimer();
        }
    }
    if(game.starTimer === 60 || game.starTimer === 180 || game.starTimer === 360) {
        game.stars--;
        updateStarElements();
    }
    timer();
}

function stopTimer() {
    game.secondsElement.innerText = '--';
    game.minutesElement.innerText = '--';
}

/*
set correct text for elements,
reset variables and timer,
restore eventListenerFor Timer
*/
function resetTimer() {
    game.secondsElement.innerText = '00';
    game.minutesElement.innerText = '00';
    game.seconds = 0;
    game.minutes = 0;
    clearTimeout(game.time);
    addListenerForTimer();
}

function updateStarElements() {
    switch(game.stars) {
        case 2:
            game.thirdStar.classList.remove('fa-star');
            break;
        case 1:
            game.secondStar.classList.remove('fa-star');
            break;
        case 0:
            game.firstStar.classList.remove('fa-star');
            game.firstStar.innerText = 'Hurry';
    }
}

init();
