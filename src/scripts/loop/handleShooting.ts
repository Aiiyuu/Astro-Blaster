/**
 * handleShooting.ts
 *
 * Creates and adds a new projectile to the game when the Space key is clicked.
 * Enforces reload time between shots.
 */

import config from '../config.js';
import Projectile from '../entities/projectile.js';
import Player from '../entities/player.js';
import Game from '../entities/game.js';
import { isKeyPressed } from '../input/keyboard.js';

let lastShotTime: number = 0;

// Create and add a new projectile in the direction the player is facing
const spreadMargin: number = config.player.projectile.spreadMargin;

/**
 * Creates and adds a new projectile to the projectiles array at a given angle.
 *
 * @param margin - The margin at which the projectile is fired.
 * @param playerRotation - The current rotation of the player.
 * @param playerPosition - The current position of the player.
 * @param ctx - The canvas rendering context.
 * @param projectiles - The array to which the new projectile will be added.
 */
function shootProjectileAtAngle(
    margin: number,
    playerRotation: number,
    playerPosition: { x: number; y: number },
    ctx: CanvasRenderingContext2D,
    projectiles: Projectile[]
): void {
    projectiles.push(
        new Projectile({
            ctx,
            position: {
                x: playerPosition.x + (-Math.sin(playerRotation) * margin),
                y: playerPosition.y + (Math.cos(playerRotation) * margin)
            },
            velocity: {
                x: Math.cos(playerRotation) * config.player.projectile.speed,
                y: Math.sin(playerRotation) * config.player.projectile.speed
            },
        })
    );
}


/**
 * Handles player shooting input. Shoots two projectiles simultaneously
 * with a slight angle offset when the Space key is clicked, respecting reload time.
 *
 * @param player - The player entity.
 * @param projectiles - The current list of projectiles in the game.
 * @param ctx - The canvas rendering context.
 */
export default function handleShooting({ player, projectiles, ctx }: {
    player: Player;
    projectiles: Projectile[];
    ctx: CanvasRenderingContext2D;
}): void {
    const now: number = performance.now();

    // Only fire if Space was clicked and enough time has passed since the last shot
    if (isKeyPressed('Space') && now - lastShotTime >= config.player.projectile.reloadTime) {
        lastShotTime = now;

        // Get current player position and rotation
        const playerPosition = { ...player.getPosition() };
        const playerRotation: number = player.getRotation();

        shootProjectileAtAngle(spreadMargin, playerRotation, playerPosition, ctx, projectiles);
        shootProjectileAtAngle(spreadMargin * -1, playerRotation, playerPosition, ctx, projectiles);
    }
}
