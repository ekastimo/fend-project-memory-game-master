/*
 * Create a list that holds all of your cards
 */
const cards = [
    { 'id': 'card1', 'className': 'fa fa-diamond' },
    { 'id': 'card2', 'className': 'fa fa-paper-plane-o' },
    { 'id': 'card3', 'className': 'fa fa-anchor' },
    { 'id': 'card4', 'className': 'fa fa-bolt' },
    { 'id': 'card5', 'className': 'fa fa-cube' },
    { 'id': 'card6', 'className': 'fa fa-anchor' },
    { 'id': 'card7', 'className': 'fa fa-leaf' },
    { 'id': 'card8', 'className': 'fa fa-bicycle' },
    { 'id': 'card9', 'className': 'fa fa-diamond' },
    { 'id': 'card10', 'className': 'fa fa-bomb' },
    { 'id': 'card11', 'className': 'fa fa-leaf' },
    { 'id': 'card12', 'className': 'fa fa-bomb' },
    { 'id': 'card13', 'className': 'fa fa-bolt' },
    { 'id': 'card14', 'className': 'fa fa-bicycle' },
    { 'id': 'card15', 'className': 'fa fa-paper-plane-o' },
    { 'id': 'card16', 'className': 'fa fa-cube' }
]

let completeCards = [

]

let currentCard = undefined
let startTime = undefined
let endTime = undefined
let movesCount = 0
let playerRating = 5
// Moves: Rating
const ratingBreakPoints = [
    { moves: 30, rating: 5 },
    { moves: 40, rating: 4 },
    { moves: 60, rating: 3 },
    { moves: 80, rating: 2 },
    { moves: 90, rating: 1 }
]


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided 'shuffle' method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(toShuffle) {
    const array = [...toShuffle]// avoid mutations to orriginal array
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function renderCards() {
    //var shuffledCards = shuffle(cards);
    var cardsHtml = cards.map(function (card) {
        return `
        <li class='card' id='${card.id}'>
            <i class='${card.className}'></i>
        </li>
    `
    }).join('')
    //render cards
    const dec = document.querySelector('.deck');
    dec.innerHTML = cardsHtml;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of 'open' cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

// Event Listeners

// Make sure we do not click complete cards
function cardCanBeClicked(card) {
    const cardId = getCardId(card);
    const isComplete = completeCards.some(function (open) {
        return open.id === cardId
    })
    const isCurrent = isCurrentCard(card);
    if (isComplete || isCurrent) {
        return false;
    }
    return true;
}

function isCurrentCard(card) {
    const cardId = getCardId(card);
    return currentCard && currentCard.id === cardId;
}

function markCardAsComplete(card) {
    const className = getCardClass(card);
    const id = getCardId(card);
    completeCards.push({ className, id })
}

// We have a correct match if the clicked card matched the current card
function isCorrectMatch(card) {
    const className = getCardClass(card);
    return currentCard && getCardClass(currentCard) === className;
}


function getCardClass(card) {
    return card.children[0].className;
}

function getCardId(card) {
    return card.id
}

function openCard(card) {
    card.classList.add('open');
    card.classList.add('show');
}

function closeCard(card) {
    card.classList.remove('open');
    card.classList.remove('show');
}

function computePlayerRating() {
    for (const ratingPair of ratingBreakPoints) {
        if (movesCount <= ratingPair.moves) {
            return ratingPair.rating;
        }
    }
    return 1;
}

function renderRating() {
    const rating = computePlayerRating(movesCount);
    const ratingHtml = Array(rating).fill().map(function () {
        return `<li><i class='fa fa-star'></i></li>`
    }).join('');
    document.querySelector('.stars').innerHTML = ratingHtml;
}

function renderMoves() {
    document.querySelector('.moves').textContent = movesCount;
}

function testCompletion() {
    const isCompleted = completeCards.length === 8;

    if (isCompleted) {
        const rating = computePlayerRating(movesCount);
        if(typeof endTime === 'undefined'){
            endTime = new Date().getTime();
        }
        const duration = (endTime - startTime)/(1000* 60);
        alert(`!!!Hurray, You won!!!! \n Moves: ${movesCount} Rating: ${rating} Duration: ${duration} Minutes`)
    }
    return isCompleted;
}

function processCardClick(card) {
    openCard(card)
    if (currentCard) {
        // We have a selected card
        if (isCorrectMatch(card)) {
            markCardAsComplete(card)
            currentCard = undefined;
        } else {
            setTimeout(function () {
                closeCard(card)
                closeCard(currentCard)
                currentCard = undefined;
            }, 200)
        }

    } else {
        //fresh selection        
        currentCard = card;
    }
    movesCount++;
    renderMoves();
    renderRating();
    setTimeout(function () {
        testCompletion();
    }, 300)
}


function handleClick() {
    if (testCompletion()) {
        return;// No need to proces
    }
    const canClick = cardCanBeClicked(this)
    if (canClick) {
        processCardClick(this);
    } else {
        // TODO this can just be igored
        alert('Oops, Invalid Selection');
    }
}

function createListeners() {
    // Add Event Listeners
    document.querySelectorAll('.card')
        .forEach(function (card) {
            card.addEventListener('click', handleClick)
        })
}


function resetGame() {
    movesCount = 0;
    completeCards = [];
    currentCard = undefined
    playerRating = 5
    renderCards();
    createListeners()
    renderMoves();
    renderRating();
    startTime = new Date().getTime();
    endTime = undefined;
}

document.querySelector('.restart')
    .addEventListener('click', resetGame)
resetGame()