/**
 * initGame.ts
 *
 * Initializes the game logic, player, and keyboard input handling.
 * Returns initialized game objects.
 */
import Game from '../entities/game.js';
import Player from '../entities/player.js';
import config from '../config.js';
import { initKeyboardControls } from '../input/keyboard.js';
export default function initGame(canvas, ctx) {
    const game = new Game(canvas, ctx);
    const player = new Player({
        ctx,
        position: config.player.position,
        velocity: { x: 0, y: 0 }
    });
    const projectiles = [];
    const meteorites = [];
    initKeyboardControls();
    return { game, player, projectiles, meteorites };
}

//# sourceMappingURL=initGame.js.map
