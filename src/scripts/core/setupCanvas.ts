/**
 * setupCanvas.ts
 *
 * Creates and configures the HTML canvas element used for rendering the game.
 * Appends the canvas to the game container in the DOM.
 */

import config from '../config.js';

export default function setupCanvas() {
    // Get the container element where the canvas will go
    const gameWindow: HTMLElement | null = document.getElementById('game');
    if (!gameWindow) throw new Error("Cannot find element with ID 'game'");

    // Create the canvas element
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    canvas.width = config.game.canvasWidth;
    canvas.height = config.game.canvasHeight;

    // Add the canvas to the page
    gameWindow.appendChild(canvas);

    // Get the 2D drawing context
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!ctx) throw new Error("Could not get 2D context");

    // Return both for later use
    return { canvas, ctx };
}