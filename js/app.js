const symbols = ['fa-angellist', 'fa-android', 'fa-bell', 'fa-github-alt' ,'fa-car' ,'fa-bug', 'fa-heart', 'fa-child'];
const deck = document.getElementsByClassName('deck')[0];
let visibleIcons = [];
let moves = 0;
let win = 0;

function createADeck() {
    const fragment = document.createDocumentFragment();
    const fullSymbolsSet = symbols.concat(symbols);

    for (let i = 0; i < 16; i++) {
        const containerElement = document.createElement('div');
        const iconElemnt = document.createElement('div');

        iconElemnt.classList.add('hiden-card', 'fa', pickRandomSymbol(fullSymbolsSet))
        containerElement.classList.add('card');

        addListenerForTurningCard(containerElement);

        containerElement.appendChild(iconElemnt);
        fragment.appendChild(containerElement);
    }
    deck.appendChild(fragment);
}

function pickRandomSymbol(symbolsSet) {
    return symbolsSet.splice(Math.random() * symbolsSet.length, 1);
}

function addListenerForTurningCard(element) {
    element.addEventListener('click', function(evt) {
        const elementMatched = evt.target.classList.contains('matched');
        const parentMatched = evt.target.parentNode.classList.contains('matched');
        const isNotClickedOnChild = evt.target !== visibleIcons[0];
        const isNotClickedOnParent = evt.target.firstChild !== visibleIcons[0];

        if(!elementMatched && !parentMatched && (visibleIcons.length < 2) 
        && isNotClickedOnChild && isNotClickedOnParent) {
            const icon = element.firstChild;
            visibleIcons.push(icon);
            flip(icon);
            isMatch();
        }
    });
}

function flip(icon) {
    icon.parentNode.classList.toggle('flip');
    icon.classList.toggle('hiden-card');
}

function isMatch() { 
    if(visibleIcons.length === 2 && visibleIcons[0] !== visibleIcons[1]) {
        if(areCardsMatch()) {
            matchingHelper();
        }
        else {
            clearIcons();
        }
    }  
    else if(visibleIcons === 1){
      clearIcons();
    }
}

async function clearIcons() {
    await sleep(1000);
    visibleIcons.forEach((i) => flip(i));
    visibleIcons = [];
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

function areCardsMatch() {
    const firstCardClasses = visibleIcons[0].classList;
    const secondCardClasses = visibleIcons[1].classList;

    for(let element of firstCardClasses) {
        if(!secondCardClasses.contains(element)) {
            moves +=1;
            setDisplayedMoves(moves);
            return false;
        }
    }
    return true;
}

function matchingHelper() {

    visibleIcons.forEach((e) => {
        e.parentNode.classList.add('matched');
        e.classList.add('enlarge');
    });
    visibleIcons = [];
} 

function resetGame() {
    while(deck.firstChild) {
        deck.removeChild(deck.firstChild);
    }
    moves = 0;
    setDisplayedMoves(0);
    createADeck();
}

function setDisplayedMoves(toSet) {
    document.getElementById('moves').innerText = "Moves: " + toSet;
}

createADeck();