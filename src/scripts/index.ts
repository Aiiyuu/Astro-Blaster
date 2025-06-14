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

// Initialize game, player, and projectiles
const { game, player, projectiles, meteorites } = initGame(canvas, ctx);

// Set the meteorite spawn interval
setSpawnMeteoriteInterval(meteorites, ctx);

// Start the game loop
gameLoop({ game, player, projectiles, meteorites, ctx });
