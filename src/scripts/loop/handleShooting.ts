/**
 * handleShooting.ts
 *
 * Creates and adds a new projectile to the game when the Space key is clicked.
 * Enforces reload time between shots.
 */

import config from '../config.js';
import Projectile from '../entities/projectile.js';
import Player from '../entities/player.js';
import { isKeyClicked } from '../input/keyboard.js';

let lastShotTime: number = 0;

export default function handleShooting(player: Player, projectiles: Projectile[], ctx: CanvasRenderingContext2D): void {
    const now: number = performance.now();

    // Only fire if Space was clicked and enough time has passed since the last shot
    if (isKeyClicked('Space') && now - lastShotTime >= config.player.projectile.reloadTime) {
        lastShotTime = now;

        // Get current player position and rotation
        const playerPosition = { ...player.getPosition() };
        const playerRotation: number = player.getRotation();

        // Create and add a new projectile in the direction the player is facing
        projectiles.push(
            new Projectile({
                ctx,
                position: {
                    x: playerPosition.x + Math.cos(playerRotation),
                    y: playerPosition.y + Math.sin(playerRotation),
                },
                velocity: {
                    x: Math.cos(playerRotation) * config.player.projectile.speed,
                    y: Math.sin(playerRotation) * config.player.projectile.speed
                }
            })
        );
    }
}
