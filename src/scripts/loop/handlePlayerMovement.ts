/**
 * handlePlayerMovement.ts
 *
 * Updates the player's movement based on keyboard input,
 * including acceleration, friction, and velocity clamping.
 */

import config from '../config.js';
import { isKeyPressed } from '../input/keyboard.js';
import Player from '../entities/player.js'

export default function handlePlayerMovement(player: Player): void {
    // Apply forward acceleration
    if (isKeyPressed('KeyW')) {
        player.acceleration.x = Math.cos(player.getRotation()) * config.player.speed;
        player.acceleration.y = Math.sin(player.getRotation()) * config.player.speed;
    } else {
        player.acceleration.x = 0;
        player.acceleration.y = 0;
    }

    // Apply acceleration to velocity
    player.velocity.x += player.acceleration.x;
    player.velocity.y += player.acceleration.y;

    // Apply friction
    player.velocity.x *= config.player.friction;
    player.velocity.y *= config.player.friction;

    // Clamp to max speed
    const speed: number = Math.hypot(player.velocity.x, player.velocity.y);
    if (speed > config.player.maxSpeed) {
        const scale: number = config.player.maxSpeed / speed;
        player.velocity.x *= scale;
        player.velocity.y *= scale;
    }
}
