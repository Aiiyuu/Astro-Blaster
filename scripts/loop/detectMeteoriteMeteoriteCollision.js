/**
 * detectMeteoriteMeteoriteCollision.ts
 *
 * Detects collisions between meteorites in the game.
 * When two meteorites collide, both are removed from the game.
 * Collision is determined by comparing the distance between their centers
 * to the sum of their radii.
 */
import config from '../config.js';
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
export default function detectMeteoriteMeteoriteCollision({ game, meteorites }) {
    // Detect collisions between meteorites (meteorite-to-meteorite)
    meteorites.forEach((meteoriteA, indexA) => {
        meteorites.slice(indexA + 1).forEach((meteoriteB, indexB) => {
            // Get the positions of both meteorites
            const posA = meteoriteA.getPosition();
            const posB = meteoriteB.getPosition();
            // Calculate the distance between the centers of both meteorites
            const dx = posA.x - posB.x;
            const dy = posA.y - posB.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            // Get the radius of both meteorites
            const radiusA = meteoriteA.getRadius();
            const radiusB = meteoriteB.getRadius();
            // Check if the distance is less than the sum of the radii (i.e., collision)
            if (distance < radiusA + radiusB) {
                // Apply damage to the meteorites
                meteoriteA.applyDamage(config.meteorite.health_points);
                meteoriteB.applyDamage(config.meteorite.health_points);
            }
        });
    });
}

//# sourceMappingURL=detectMeteoriteMeteoriteCollision.js.map
