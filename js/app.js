// set up the jqueries

const $movesCounter = $('#movesCounter');
const $reset = $('#reset');
const $timer = $('#timer');
const $star3 = $('#star3');
const $star2 = $('#star2');
const $modal = $('#myModal');
const $close = $('.close');

// set up variables that will change

let deckOfCards = [];
let openedCards = [];
let moves = 0;
let second = 0;
let minute = 0;
let solved = 0;
let stars = 3;
let interval;


// Shuffle function from http://stackoverflow.com/a/2450976

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// function that creates an array that holds the HTML code for the font awesome icons if the array is empty,
// shuffles the array and appends the HTML code to the site and adds event listeners to the cards

function makeDeck() {
      if (deckOfCards.length <= 0) {
            for (let i = 0; i < 16; i++) {
                  deckOfCards.push(`<i class = "fa ${cards[i%8].image}"></i>`);
            }
      }
      deckOfCards = shuffle(deckOfCards);
      for (let i = 0; i < 16; i++) {
            let $card = $(`#card-${i.toString()}`);
            $card.append(deckOfCards[i]);
            $card.click(displayCard);
      }
}

// function that displays the clicked card

function displayCard() {
      $(this).toggleClass("open show");
      openCard($(this));
}

// function that disables the event listener on the clicked card, plays the rotate animation, adds the clicked icon to the open array.
// If there are 2 opened elements call moveCounter, disable all cards if the cards match call matched othervise call missmatched

function openCard(target) {
      target.addClass('disabled');
      rotate(target);
      openedCards.push(target.attr('id'));
      if (openedCards.length === 2){
            moveCounter();
            $('.card').addClass('disabled');
            if($(`#${openedCards[0]}`).children().attr('class') === $(`#${openedCards[1]}`).children().attr('class')){
                  matched();
            } else {
                  missmatched();
            }
      }
};

// function that increments the moves counter, updates the moves text on the site and update the stars colors and status based on the number of moves

function moveCounter() {
      moves++;
      $movesCounter.text(moves)
      switch (moves) {
            case 0:
                  $star2.css('color', '#02ccba');
                  $star3.css('color', '#02ccba');
                  stars = 3;
                  break;
            case 1:
                  startTimer();
                  break;
            case starsTwo:
                  $star3.css('color', 'black');
                  stars--;
                  break;
            case starsOne:
                  $star2.css('color', 'black');
                  stars--;
      }
}

// function that removes the open and show classes and adds the match function to elements in openedCards array after waiting for 1 second
// so the rotate animation plays. After waiting for 1 second remove the event listeners on cards in openedCards array, increment solved counter,
// call clearOpened, if solved is equal to the number of pairs call end. Make all the cards responsive to event listeners.

function matched() {
      setTimeout(function() {
            $(`#${openedCards[0]}`).toggleClass('open show match');
            $(`#${openedCards[1]}`).toggleClass('open show match');
            setTimeout(function() {
                  $(`#${openedCards[0]}`).off();
                  $(`#${openedCards[1]}`).off();
                  solved++;
                  clearOpened();
                  if (solved === 8) {
                        end();
                  }
                  $('.card').removeClass('disabled');
            }, 1000);
      }, 1000);
}

// function that  adds the wrong function to elements in openedCards array after waiting for 1 second
// so the rotate animation plays. After waiting for 1 second remove the wrong show open classes from cards in openedCards array, increment solved counter,
// call clearOpened and make all the cards responsive to event listeners.

function missmatched() {
      setTimeout(function() {
            $(`#${openedCards[0]}`).toggleClass('wrong');
            $(`#${openedCards[1]}`).toggleClass('wrong');
            setTimeout(function() {
                  $(`#${openedCards[0]}`).toggleClass('wrong show open');
                  $(`#${openedCards[1]}`).toggleClass('wrong show open');
                  clearOpened();
                  $('.card').removeClass('disabled');
            }, 1000);
      }, 1000);
}

// function that clears the opendCards array

function clearOpened() {
      openedCards = [];
}

// function that sets the timer, moves and solved counter to 0, clears the timer interval.
// It iterates trough the card elements on the site and empties them, if present removes the show, open and match classes
// and removes the event listeners. It calls the moveCounter, updates the timer text and calls makeDeck.

function reset() {
      minute = 0;
      second = 0;
      moves = -1;
      solved = 0;
      clearInterval(interval);
      for (let i = 0; i < 16; i++) {
            let $currentCard = $(`#card-${i.toString()}`);
            $currentCard.empty();
            $currentCard.removeClass('show open match');
            $currentCard.off();
      }
      moveCounter();
      $timer.text(`0mins 0secs`);
      makeDeck();
}

// function that starts the interval that calls a function every second. It updates teh timer text, increments second counter,
// if seconds get to 60 it increments the minute counter and sets second counter to 0

function startTimer() {
      interval = setInterval(function(){
            $timer.text(`${minute} mins ${second} secs`);
            second++;
            if(second === 60){
                  minute++;
                  second = 0;
            }
      },1000);
}

// function that updates the modal content with data, also sets the  color of the stars according to the number of moves

function populateModal() {
      $('#modal-moves').text(`${moves} Moves, `);
      $('#modal-time').text(`${minute} Mins ${second} Secs `);
      if (stars === 2) {
            $('#modal-stars :nth-child(3)').children().css('color', 'black');
      } else if (stars === 1) {
            $('#modal-stars :nth-child(2)').children().css('color', 'black');
            $('#modal-stars :nth-child(3)').children().css('color', 'black');
      }
}

// function that stops the timer, displays the modal and calls populateModal

function end() {
      clearInterval(interval);
      $modal.css('display', 'block');
      populateModal();
}

// function that adds the rotate class to the clicked card passed in as a jquery and removes it after a second

function rotate(target) {
      target.addClass('rotate');
      setTimeout(function () {
            target.removeClass('rotate');
      }, 1000);
}

// function that initializes the game by calling makeDeck, adding an event listener to the reset and close modal buttons

function init() {
      makeDeck();
      $reset.click(reset);
      $close.click(function() {
            $modal.css('display', 'none');
            reset();
      });
}


// call init to setup the game

init();
