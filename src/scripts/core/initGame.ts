/**
 * initGame.ts
 *
 * Initializes the game logic, player, and keyboard input handling.
 * Returns initialized game objects.
 */

import Game from '../entities/game.js';
import Player from '../entities/player.js';
import Projectile from '../entities/projectile.js';
import config from '../config.js';
import { initKeyboardControls } from '../input/keyboard.js';

export default function initGame(canvas: any, ctx: any) {
    const game = new Game(canvas, ctx);
    const player = new Player({
        ctx,
        position: config.player.position,
        velocity: { x: 0, y: 0 }
    });

    const projectiles: Projectile[] = [];

    initKeyboardControls();

    return { game, player, projectiles };
}
