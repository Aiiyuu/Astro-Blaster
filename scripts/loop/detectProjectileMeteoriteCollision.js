/**
 * detectProjectileMeteoriteCollision.ts
 *
 * Contains logic for detecting collisions between projectiles and meteorites.
 * When a collision is detected, both the projectile and meteorite are removed from the game.
 * The collision is determined by checking if the distance between their centers is less
 * than the sum of their radii.
 */
import config from '../config.js';
/**
 * Detects collisions between projectiles and meteorites in the game.
 * It checks for overlaps based on their positions and sizes, and triggers
 * appropriate responses (e.g., destruction or damage).
 *
 * @param {Game} params.game - The current game instance, used for managing game state.
 * @param {Player} params.player - The player instance, used for getting its projectile damage.
 * @param {Projectile[]} params.projectiles - Array of all projectiles in the game.
 * @param {Meteorite[]} params.meteorites - Array of all meteorites in the game.
 *
 * @returns {void} This function does not return anything, it performs actions on the passed objects.
 */
export default function detectProjectileMeteoriteCollision({ game, player, projectiles, meteorites }) {
    // Loop through each projectile and check for collisions with meteorites
    projectiles.forEach((projectile, pIndex) => {
        meteorites.forEach((meteorite, mIndex) => {
            // Make sure the meteorite is not destroyed
            if (meteorite.getIsDestroyed()) {
                return;
            }
            // Get the positions of the projectile and meteorite
            const projectilePos = projectile.getPosition();
            const meteoritePos = meteorite.getPosition();
            // Calculate the distance between the centers of the projectile and meteorite
            const dx = projectilePos.x - meteoritePos.x;
            const dy = projectilePos.y - meteoritePos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            // Assuming the radius is proportional to their scale (or use fixed values)
            const projectileRadius = 5; // You can adjust this based on your projectile size
            const meteoriteRadius = meteorite.getRadius(); // Get the actual radius of the meteorite
            // Check if the distance is less than the sum of the radii (i.e., collision)
            if (distance < projectileRadius + meteoriteRadius) {
                // Destroy projectile
                projectiles.splice(pIndex, 1);
                // Apply damage to the meteorite
                meteorite.applyDamage(player.getProjectileDamage());
                // Update the player's score
                if (meteorite.getIsDestroyed()) {
                    // Make sure the player is not defeated
                    if (!game.getIsDefeated()) {
                        game.setScore(game.getScore() + config.meteorite.score);
                    }
                }
                return;
            }
        });
    });
}

//# sourceMappingURL=detectProjectileMeteoriteCollision.js.map
