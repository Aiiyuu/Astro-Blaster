/**
 * detectPlayerMeteoriteCollision.ts
 *
 * Contains logic for detecting collisions between the player and meteorites.
 * When a collision is detected, the player’s health is affected and the meteorite
 * is removed from the game. The collision is determined by checking if the distance
 * between the player’s position and the meteorite’s center is less than the sum of their radii.
 */

import Game from '../entities/game.js';
import Player from '../entities/player.js';
import Meteorite from '../entities/meteorite.js';
import config from '../config.js';


/**
 * Detects collisions between the player and meteorites in the game.
 * It checks for overlaps based on their positions and sizes, and triggers
 * appropriate responses (e.g., health damage, meteorite destruction).
 *
 * @param {Game} params.game - The current game instance, used for managing game state.
 * @param {Player} params.player - The player instance, used for checking the player's health and position.
 * @param {Meteorite[]} params.meteorites - Array of all meteorites in the game.
 *
 * @returns {void} This function does not return anything, it performs actions on the passed objects.
 */
export default function detectPlayerMeteoriteCollision({ game, player, meteorites }: {
    game: Game;
    player: Player;
    meteorites: Meteorite[];
}): void {
    // Loop through each meteorite and check for a collision with the player
    meteorites.forEach((meteorite: Meteorite, mIndex: number): void => {
        // Make sure the meteorite is not destroyed and the player is not defeated
        if (meteorite.getIsDestroyed() && !game.getIsDefeated()) {
            return;
        }

        // Get the positions of the player and meteorite
        const playerPos: { x: number, y: number } = player.getPosition();
        const meteoritePos: { x: number, y: number } = meteorite.getPosition();

        // Calculate the distance between the centers of the player and the meteorite
        const dx: number = playerPos.x - meteoritePos.x;
        const dy: number = playerPos.y - meteoritePos.y;
        const distance: number = Math.sqrt(dx * dx + dy * dy);

        // Assuming the radius of the player is proportional to their scale (or use fixed values)
        const playerRadius: number = player.getRadius();  // Get the actual radius of the player
        const meteoriteRadius: number = meteorite.getRadius();  // Get the actual radius of the meteorite

        // Check if the distance is less than the sum of the radii (i.e., collision)
        if (distance < playerRadius + meteoriteRadius) {
            // Apply damage to the player (adjust damage as needed)
            game.applyDamage(config.meteorite.damage);

            // Destroy the meteorite (or trigger any destruction effects)
            meteorite.applyDamage(config.player.ramDamage);

            // Update the player's score
            if (meteorite.getIsDestroyed()) {
                // Make sure the player is not defeated
                if (!game.getIsDefeated()) {
                    game.setScore(game.getScore() + config.meteorite.score);
                }
            }

            // Check if the player is not defeated
            if (game.getIsDefeated()) {
                player.setIsDefeated(true);
            }

            return;
        }
    });
}
