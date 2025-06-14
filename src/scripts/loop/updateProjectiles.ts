/**
 * updateProjectiles.ts
 *
 * Updates the position of each projectile and removes any that go off-screen.
 */

import config from '../config.js';
import Projectile from '../entities/projectile.js'

export default function updateProjectiles(projectiles: Projectile[]): void {
    // Iterate backwards to safely remove projectiles while looping
    for (let i: number = projectiles.length - 1; i >= 0; i--) {
        const projectile: Projectile = projectiles[i];

        // Update projectile position/state
        projectile.update();

        const pos: { x: number, y:number } = projectile.getPosition();

        // Remove projectile if it goes outside the canvas boundaries
        if (
            pos.x < 0 || pos.x > config.game.canvasWidth ||
            pos.y < 0 || pos.y > config.game.canvasHeight
        ) {
            projectiles.splice(i, 1);
        }
    }
}