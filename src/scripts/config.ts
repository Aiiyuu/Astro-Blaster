/**
 * config.ts
 *
 * Centralized configuration and constants for the game such as canvas size,
 * speeds, colors, and other gameplay settings.
 */

// Get the game window object
const gameWindow = document.getElementById("game") as HTMLCanvasElement;

// Make sure the game window exists
if (!gameWindow) {
    throw new Error("Cannot find element with ID 'game'");
}

const config = {
    game: {
        canvasWidth: gameWindow.offsetWidth, // Game window width
        canvasHeight: gameWindow.offsetHeight, // Game window height

        // Margin buffer to keep the player within the visible game screen boundaries
        margin: {
            x: gameWindow.offsetWidth * 5 / 100,
            y: gameWindow.offsetHeight * 5 / 100
        }
    },

    player: {
        speed : 12,
        rotation_speed: 8,
        friction: 0.95,
        position : {
            x: gameWindow.offsetWidth / 2, // The initial X position of the player
            y: gameWindow.offsetHeight / 2, // The initial Y position of the player
        }
    }
}

export default config;