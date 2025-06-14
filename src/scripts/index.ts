/**
 * index.ts
 *
 * Entry point of the application.
 * Sets up the canvas, initializes the game, and starts the game loop.
 */

import Game from './game.js';
import Player from './entitles/player.js';
import config from './config.js';

import { initKeyboardControls, isKeyPressed, isKeyClicked } from './input/keyboard.js';


// Get the game window object
const gameWindow: HTMLElement | null = document.getElementById('game');

// Create a canvas element and append it to the game window
const canvas = document.createElement('canvas') as HTMLCanvasElement;
canvas.width = config.game.canvasWidth;
canvas.height = config.game.canvasHeight;

// Make sure the game window exists
if (!gameWindow) {
    throw new Error("Cannot find element with ID 'game'");
}

gameWindow.appendChild(canvas);

// The interface provided by the browser representing the 2D rendering context
const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;

// Create a new instance of the Game class, passing the drawing context so the game can render on the canvas
const game = new Game(canvas, ctx);

// Create a new instance of the Player class, passing the player characteristics
const player = new Player({
    ctx: ctx,
    position: config.player.position,
    velocity: { x: 0, y: 0 }
});


function gameLoop(): void {
    /**
     * Main game loop function.
     * Continuously updates game state and redraws the frame using requestAnimationFrame
     * to achieve smooth animations. Called recursively every frame.
     */

    // game.update(); // Update game objects (e.g., starship, asteroids, bullets)
    game.update(player.velocity);   // Draw the updated state to the canvas
    player.update(); // Draw the updated state of the player

    // Handle player movement

    // Handle player movement
    if (isKeyPressed('KeyW')) {
        player.acceleration.x = Math.cos(player.rotation) * config.player.speed;
        player.acceleration.y = Math.sin(player.rotation) * config.player.speed;
    } else {
        player.acceleration.x = 0;
        player.acceleration.y = 0;
    }

    // Apply acceleration to velocity
    player.velocity.x += player.acceleration.x;
    player.velocity.y += player.acceleration.y;

    // Apply friction to velocity
    player.velocity.x *= config.player.friction;
    player.velocity.y *= config.player.friction;

    // Clamp velocity to max speed
    const speed: number = Math.hypot(player.velocity.x, player.velocity.y);
    if (speed > config.player.maxSpeed) {
        const scale: number = config.player.maxSpeed / speed;
        player.velocity.x *= scale;
        player.velocity.y *= scale;
    }

    // Handle rotation:
    if (isKeyPressed('KeyD')) {
        player.rotationalAcceleration = config.player.rotation_acceleration; // Apply clockwise rotation acceleration
    } else if (isKeyPressed('KeyA')) {
        player.rotationalAcceleration = -config.player.rotation_acceleration; // Apply counterclockwise rotation acceleration
    } else {
        // Apply rotational friction when no key is pressed
        player.rotationalAcceleration = 0;
        player.rotationalVelocity *= config.player.rotation_friction;  // Apply friction to the rotational velocity
    }

    // Update rotational velocity
    player.rotationalVelocity += player.rotationalAcceleration;

    // Apply rotational speed limit (optional)
    if (Math.abs(player.rotationalVelocity) > config.player.max_rotation_speed) {
        player.rotationalVelocity = Math.sign(player.rotationalVelocity) * config.player.max_rotation_speed;
    }


    requestAnimationFrame(gameLoop); // Update the game loop
}

// Initialize keyboard input handling
initKeyboardControls();

// Start the game loop
gameLoop();