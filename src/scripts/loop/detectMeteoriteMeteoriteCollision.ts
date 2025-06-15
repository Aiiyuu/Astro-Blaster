/**
 * detectMeteoriteMeteoriteCollision.ts
 *
 * Detects collisions between meteorites in the game.
 * When two meteorites collide, both are removed from the game.
 * Collision is determined by comparing the distance between their centers
 * to the sum of their radii.
 */

import config from '../config.js';
import Game from '../entities/game.js';
import Projectile from '../entities/projectile.js';
import Meteorite from '../entities/meteorite.js';

/**
 * Detects collisions between meteorites in the game.
 * It checks for overlaps between meteorites based on their positions and sizes,
 * and triggers appropriate responses
 *
 * @param {Game} params.game - The current game instance, used for managing game state.
 * @param {Meteorite[]} params.meteorites - Array of all meteorites in the game.
 *
 * @returns {void} This function does not return anything. It mutates the passed meteorites array
 * by removing any meteorites that collide with each other.
 */
export default function detectMeteoriteMeteoriteCollision({ game, meteorites }: {
    game: Game;
    meteorites: Meteorite[];
}): void {
    // Detect collisions between meteorites (meteorite-to-meteorite)
    meteorites.forEach((meteoriteA: Meteorite, indexA: number): void => {
        meteorites.slice(indexA + 1).forEach((meteoriteB: Meteorite, indexB: number): void => {
            // Get the positions of both meteorites
            const posA: { x: number, y: number } = meteoriteA.getPosition();
            const posB: { x: number, y: number } = meteoriteB.getPosition();

            // Calculate the distance between the centers of both meteorites
            const dx: number = posA.x - posB.x;
            const dy: number = posA.y - posB.y;
            const distance: number = Math.sqrt(dx * dx + dy * dy);

            // Get the radius of both meteorites
            const radiusA: number = meteoriteA.getRadius();
            const radiusB: number = meteoriteB.getRadius();

            // Check if the distance is less than the sum of the radii (i.e., collision)
            if (distance < radiusA + radiusB) {
                // Apply damage to the meteorites
                meteoriteA.applyDamage(config.meteorite.health_points);
                meteoriteB.applyDamage(config.meteorite.health_points);
            }
        });
    });
}
