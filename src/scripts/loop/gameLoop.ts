/**
 * gameLoop.ts
 *
 * Main animation loop that updates game state every frame.
 * Delegates tasks to specialized handlers.
 */

import handlePlayerMovement from './handlePlayerMovement.js';
import handleRotation from './handleRotation.js';
import handleShooting from './handleShooting.js';
import updateProjectiles from './updateProjectiles.js';
import updateMeteorites from "./updateMeteorites.js";
import detectCollision from "./collisionDetection.js";
import Game from '../entities/game.js';
import Player from '../entities/player.js';
import Projectile from '../entities/projectile.js';
import Meteorite from '../entities/meteorite.js';


export function gameLoop({ game, player, projectiles, meteorites, ctx } : {
    game: Game;
    player: Player;
    projectiles: Projectile[];
    meteorites: Meteorite[];
    ctx: CanvasRenderingContext2D;
}): void {
    function loop(): void {
        // Update overall game state based on player movement
        game.update(player.velocity);

        // Update all active projectiles (e.g. move them forward, remove off-screen)
        updateProjectiles(projectiles);

        // Update player-specific state (e.g. position, cooldowns)
        if(!player.getReadyToBeRemoved()) {
            player.update();
        }

        // Update all meteorites' statements
        updateMeteorites(meteorites);

        // Update the score text
        game.drawScore();

        // Update the player's health bar
        game.drawHealthBar();

        // Make sure the player sprite ins not defeated
        if (!player.getReadyToBeRemoved()) {
            // Handle keyboard input for player movement
            handlePlayerMovement(player);

            // Adjust player's rotation based on mouse position or input
            handleRotation(player);

            // Handle firing logic, including drawing projectiles
            handleShooting(player, projectiles, ctx);
        } else {
            // Draw the game over text
            game.drawGameOver();
        }

        // Detect and handle collisions between projectiles, player and meteorites
        detectCollision({
            game: game,
            projectiles: projectiles,
            meteorites: meteorites,
            player: player
        });

        // Request the next animation frame to keep the loop going
        requestAnimationFrame(loop);
    }

    // Start the loop
    loop();
}
