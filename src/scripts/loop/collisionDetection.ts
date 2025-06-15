/**
 * collisionDetection.ts
 *
 * Handles collision detection between game entities such as projectiles and meteorites.
 * Implements logic for determining if objects intersect based on their positions and sizes.
 * Used to trigger events like projectile destruction or meteorite damage.
 */

import Game from '../entities/game.js';
import Projectile from '../entities/projectile.js';
import Meteorite from '../entities/meteorite.js';
import Player from '../entities/player.js';
import projectile from "../entities/projectile.js";
import detectProjectileMeteoriteCollision from './detectProjectileMeteoriteCollision.js';
import detectMeteoriteMeteoriteCollision from './detectMeteoriteMeteoriteCollision.js';


/**
 * detectCollision.ts
 *
 * Handles collision detection between various game entities, including projectiles, meteorites, and the player.
 * It checks for overlaps between projectiles and meteorites, as well as meteorite-to-meteorite collisions,
 * and triggers appropriate responses (e.g., destruction or damage).
 * The function delegates specific collision checks to helper functions for clarity and modularity.
 *
 * @param {Object} params - The parameters for collision detection.
 * @param {Game} params.game - The current game instance, used for managing game state.
 * @param {Projectile[]} params.projectiles - Array of all projectiles in the game.
 * @param {Meteorite[]} params.meteorites - Array of all meteorites in the game.
 * @param {Player} params.player - The player object, used for detecting player-related collisions.
 *
 * @returns {void} This function does not return anything, it performs actions on the passed objects by calling
 * helper functions to detect and resolve collisions.
 */
export default function detectCollision({ game, meteorites, projectiles, player }: {
    game: Game;
    projectiles: Projectile[];
    meteorites: Meteorite[];
    player: Player;
}): void {

    // Check for collisions between projectiles and meteorites
    detectProjectileMeteoriteCollision({
        game: game,
        player: player,
        projectiles: projectiles,
        meteorites: meteorites,
    });

    // Check for collisions between meteorites
    detectMeteoriteMeteoriteCollision({
        game: game,
        meteorites: meteorites,
    });
}