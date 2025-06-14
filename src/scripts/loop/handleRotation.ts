/**
 * handleRotation.ts
 *
 * Handles the player's rotation based on keyboard input.
 * Applies acceleration, friction, and caps rotational speed.
 */

import config from '../config.js';
import { isKeyPressed } from '../input/keyboard.js';
import Player from '../entities/player.js';

export default function handleRotation(player: Player): void {
    // Set rotational acceleration based on key input
    if (isKeyPressed('KeyD')) {
        player.rotationalAcceleration = config.player.rotation_acceleration;
    } else if (isKeyPressed('KeyA')) {
        player.rotationalAcceleration = -config.player.rotation_acceleration;
    } else {
        player.rotationalAcceleration = 0;
        player.rotationalVelocity *= config.player.rotation_friction;
    }

    // Update and cap rotational velocity
    player.rotationalVelocity += player.rotationalAcceleration;
    if (Math.abs(player.rotationalVelocity) > config.player.max_rotation_speed) {
        player.rotationalVelocity = Math.sign(player.rotationalVelocity) * config.player.max_rotation_speed;
    }
}