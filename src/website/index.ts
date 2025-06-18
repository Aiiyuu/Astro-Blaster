/**
 * This function wraps the content of a button with a div that has a class 'botontext'.
 * It then appends the wrapper back into the button and clones it.
 *
 * @param button - The button element to wrap content in.
 */
function wrapButtonContent(button: HTMLElement): void {
    // Create wrapper div
    const wrapper: HTMLDivElement = document.createElement('div');
    wrapper.className = 'botontext';

    // Move all child nodes into wrapper
    while (button.firstChild) {
        wrapper.appendChild(button.firstChild);
    }

    // Append wrapper to button
    button.appendChild(wrapper);

    // Clone the wrapper and append to button
    const clone: Node = wrapper.cloneNode(true);
    button.appendChild(clone);
}

/**
 * This function appends four <span> elements with the class 'twist' to the button.
 *
 * @param button - The button element to append twist elements to.
 */
function appendTwistElements(button: HTMLElement): void {
    for (let i: number = 0; i < 4; i++) {
        const span: HTMLSpanElement = document.createElement('span');
        span.className = 'twist';
        button.appendChild(span);
    }
}

/**
 * This function sets the width of all span.twist elements inside a button to 'calc(25% + 3px)'.
 *
 * @param button - The button element containing twist elements.
 */
function setTwistWidths(button: HTMLElement): void {
    const twists: NodeListOf<HTMLElement> = button.querySelectorAll<HTMLElement>('span.twist');
    twists.forEach((twist: HTMLElement): void => {
        twist.style.width = 'calc(25% + 3px)';
    });
}

/**
 * This function sets up the click event listener for the play button.
 *
 * @param playButton - The play button element.
 * @param ribbonsContainer - The ribbons container element.
 */
function setupPlayButtonEventListener(playButton: HTMLElement, ribbonsContainer: HTMLElement): void {
    // Calculate the delay for ribbon removal based on the number of 'span' elements.
    const RIBBON_REMOVAL_DELAY: number = RIBBON_DELAY * (Array.from(ribbonsContainer.querySelectorAll('span')).length + 2);

    // Add a 'click' event listener to the play button
    playButton.addEventListener('click', (): void => {
        // Start the ribbon animation (roll-in)
        ribbonsContainer.classList.add('ribbons-roll-in');


        // Play the swoosh sound
        setTimeout(async (): Promise<void> => {
            if (SWOOSH_SOUND) {
                await SWOOSH_SOUND.play();
            }
        }, 300)

        // After the delay, stop the roll-in and start the roll-out animation
        setTimeout((): void => {
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
function setupGameButton(selector: string = '#start-game'): void {
    const buttons: NodeListOf<HTMLElement> = document.querySelectorAll<HTMLElement>(selector);

    buttons.forEach((button: HTMLElement): void => {
        wrapButtonContent(button);        // Wrap content in .botontext and clone
        appendTwistElements(button);      // Append four twist elements
        setTwistWidths(button);           // Set the width of twist elements

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
function setAnimationDelays(delayIncrement: number = 300): void {
    if (!RIBBONS_CONTAINER) return;

    // Select all the span elements inside the container specified by the selector
    const spans: NodeListOf<HTMLElement> = RIBBONS_CONTAINER.querySelectorAll(`span`);

    // Loop through each span and set its animation delay
    spans.forEach((span: HTMLElement, index: number): void => {
        // Set the animation delay for the current span based on its index
        span.style.animationDelay = `${delayIncrement * index}ms`;
    });
}


const PLAY_BUTTON: HTMLButtonElement | null = document.querySelector('#start-game');
const RIBBONS_CONTAINER: HTMLDivElement | null = document.querySelector('.ribbons');
const RIBBON_DELAY: number = 300;
const GAME_WINDOW: HTMLDivElement | null = document.querySelector('#game');
const SWOOSH_SOUND = document.querySelector('#swoosh-sound') as HTMLAudioElement | null;

window.addEventListener('DOMContentLoaded', (): void => {
    setupGameButton(); // Use the default selector #start-game

    setAnimationDelays(RIBBON_DELAY); // Set delays for spans inside the ".ribbons" container
});
