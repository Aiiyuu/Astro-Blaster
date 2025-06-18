/**
 * index.ts
 *
 * Entry point of the application.
 * Sets up the canvas, initializes the game, and starts the game loop.
 */

import setupCanvas from './core/setupCanvas.js';
import initGame from './core/initGame.js';
import { gameLoop } from './loop/gameLoop.js';
import { setSpawnMeteoriteInterval, removeSpawnMeteoriteInterval } from './core/spawnMeteorite.js';

// Create canvas and get 2D drawing context
const { canvas, ctx } = setupCanvas();

// Initialize game, player, and projectiles (but don't start the game just yet)
const { game, player, projectiles, meteorites } = initGame(canvas, ctx);

// Start the game only after the user clicks the "Start Game" button
const startButton = document.getElementById("start-game") as HTMLButtonElement;

startButton.addEventListener("click", (): void => {
    setTimeout((): void => {
        // Set the meteorite spawn interval (this will keep running in the background once the game starts)
        setSpawnMeteoriteInterval(meteorites, ctx);

        // Play the background music
        game.playBackgroundMusic();

        // Now that the game is starting, we can start the game loop
        gameLoop({ game, player, projectiles, meteorites, ctx });

        // Optionally, you can disable the start button to prevent restarting the game
        startButton.disabled = true;
    }, 2000);
});
