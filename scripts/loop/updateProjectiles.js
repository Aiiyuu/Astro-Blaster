/**
 * updateProjectiles.ts
 *
 * Updates the position of each projectile and removes any that go off-screen.
 */
import config from '../config.js';
export default function updateProjectiles(projectiles) {
    // Iterate backwards to safely remove projectiles while looping
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const projectile = projectiles[i];
        // Update projectile position/state
        projectile.update();
        const pos = projectile.getPosition();
        // Remove projectile if it goes outside the canvas boundaries
        if (pos.x < 0 || pos.x > config.game.canvasWidth ||
            pos.y < 0 || pos.y > config.game.canvasHeight) {
            projectiles.splice(i, 1);
        }
    }
}

//# sourceMappingURL=updateProjectiles.js.map
