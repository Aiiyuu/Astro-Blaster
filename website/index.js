"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/**
 * This function wraps the content of a button with a div that has a class 'botontext'.
 * It then appends the wrapper back into the button and clones it.
 *
 * @param button - The button element to wrap content in.
 */
function wrapButtonContent(button) {
    // Create wrapper div
    var wrapper = document.createElement('div');
    wrapper.className = 'botontext';
    // Move all child nodes into wrapper
    while (button.firstChild) {
        wrapper.appendChild(button.firstChild);
    }
    // Append wrapper to button
    button.appendChild(wrapper);
    // Clone the wrapper and append to button
    var clone = wrapper.cloneNode(true);
    button.appendChild(clone);
}
/**
 * This function appends four <span> elements with the class 'twist' to the button.
 *
 * @param button - The button element to append twist elements to.
 */
function appendTwistElements(button) {
    for (var i = 0; i < 4; i++) {
        var span = document.createElement('span');
        span.className = 'twist';
        button.appendChild(span);
    }
}
/**
 * This function sets the width of all span.twist elements inside a button to 'calc(25% + 3px)'.
 *
 * @param button - The button element containing twist elements.
 */
function setTwistWidths(button) {
    var twists = button.querySelectorAll('span.twist');
    twists.forEach(function (twist) {
        twist.style.width = 'calc(25% + 3px)';
    });
}
/**
 * This function sets up the click event listener for the play button.
 *
 * @param playButton - The play button element.
 * @param ribbonsContainer - The ribbons container element.
 */
function setupPlayButtonEventListener(playButton, ribbonsContainer) {
    var _this = this;
    // Calculate the delay for ribbon removal based on the number of 'span' elements.
    var RIBBON_REMOVAL_DELAY = RIBBON_DELAY * (Array.from(ribbonsContainer.querySelectorAll('span')).length + 2);
    // Add a 'click' event listener to the play button
    playButton.addEventListener('click', function () {
        // Start the ribbon animation (roll-in)
        ribbonsContainer.classList.add('ribbons-roll-in');
        // Play the swoosh sound
        setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!SWOOSH_SOUND) return [3 /*break*/, 2];
                        return [4 /*yield*/, SWOOSH_SOUND.play()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); }, 300);
        // After the delay, stop the roll-in and start the roll-out animation
        setTimeout(function () {
            ribbonsContainer.classList.remove('ribbons-roll-in');
            ribbonsContainer.classList.add('ribbons-roll-out');
            // Show the game window
            if (GAME_WINDOW) {
                GAME_WINDOW.classList.add('show');
            }
        }, RIBBON_REMOVAL_DELAY); // Delay based on number of ribbons
    });
}
/**
 * This is the main function that wraps the above functions to manipulate the button.
 *
 * @param selector - The selector to find the button(s).
 */
function setupGameButton(selector) {
    if (selector === void 0) { selector = '#start-game'; }
    var buttons = document.querySelectorAll(selector);
    buttons.forEach(function (button) {
        wrapButtonContent(button); // Wrap content in .botontext and clone
        appendTwistElements(button); // Append four twist elements
        setTwistWidths(button); // Set the width of twist elements
        if (PLAY_BUTTON && RIBBONS_CONTAINER) {
            setupPlayButtonEventListener(PLAY_BUTTON, RIBBONS_CONTAINER); // Call the dedicated function
        }
    });
}
/**
 * Sets a dynamic animation delay for each span inside an element with class "ribbons".
 * The delay is calculated based on the index of each span, starting from 0ms and increasing by 300ms for each subsequent span.
 *
 * @param selector - The CSS selector for the container that holds the span elements (default is '.ribbons').
 * @param delayIncrement - The increment for the animation delay (default is 300ms).
 */
function setAnimationDelays(delayIncrement) {
    if (delayIncrement === void 0) { delayIncrement = 300; }
    if (!RIBBONS_CONTAINER)
        return;
    // Select all the span elements inside the container specified by the selector
    var spans = RIBBONS_CONTAINER.querySelectorAll("span");
    // Loop through each span and set its animation delay
    spans.forEach(function (span, index) {
        // Set the animation delay for the current span based on its index
        span.style.animationDelay = "".concat(delayIncrement * index, "ms");
    });
}
/**
 * This function displays a full-page loading overlay (".loading-wrapper") while the website loads,
 * and automatically hides it once the window 'load' event is fired (all assets like images are fully loaded).
 *
 * It expects a <div class="loading-wrapper"> to exist in the HTML and be styled to cover the screen.
 */
function showLoadingUntilSiteLoaded() {
    window.addEventListener('load', function () {
        var LOADER = document.querySelector('.loading-wrapper');
        if (LOADER) {
            LOADER.style.display = 'none';
        }
    });
}
var PLAY_BUTTON = document.querySelector('#start-game');
var RIBBONS_CONTAINER = document.querySelector('.ribbons');
var RIBBON_DELAY = 300;
var GAME_WINDOW = document.querySelector('#game');
var SWOOSH_SOUND = document.querySelector('#swoosh-sound');
window.addEventListener('DOMContentLoaded', function () {
    showLoadingUntilSiteLoaded(); // Display loader while site loads
    setupGameButton(); // Use the default selector #start-game
    setAnimationDelays(RIBBON_DELAY); // Set delays for spans inside the ".ribbons" container
});

//# sourceMappingURL=index.js.map
