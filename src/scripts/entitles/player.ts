/**
 * player.ts
 *
 * Defines the Player class representing the spaceship controlled by the player.
 * Handles player properties such as position, movement, shooting, and collision detection.
 */

import config from '../config.js';

class Player {
    // The interface provided by the browser representing the 2D rendering context
    private ctx: CanvasRenderingContext2D;

    private position: { x: number, y: number }; // The initial position of the spaceship (x, y)
    public velocity: { x: number, y: number }; // The initial velocity of the spaceship (x, y)
    public rotation: number = 0; // The spaceship's rotation angle in radians (0 means facing right)

    constructor({ctx, position, velocity}: {
        ctx: CanvasRenderingContext2D,
        position: { x: number, y: number };
        velocity: { x: number, y: number }
    }) {
        this.ctx = ctx;
        this.position = position;
        this.velocity = velocity;
    }

    /**
     *  Draws the player's spaceship on the canvas.
     *  this method handles rendering the player at the current position.
     */
    draw(): void {
        this.ctx.save();

        // Manage rotation
        this.ctx.translate(this.position.x, this.position.y);
        this.ctx.rotate(this.rotation);
        this.ctx.translate(-this.position.x, -this.position.y);

        this.ctx.beginPath();
        this.ctx.moveTo(this.position.x + 30, this.position.y);
        this.ctx.lineTo(this.position.x - 10, this.position.y - 10);
        this.ctx.lineTo(this.position.x - 10, this.position.y + 10);
        this.ctx.closePath()

        this.ctx.strokeStyle = "white";
        this.ctx.stroke();

        this.ctx.restore();
    }

    /**
     * Update the state of the player object
     */
    update(): void {
        this.draw() // Rerender the object

        this.updatePosition(); // Update object position to imitate movement
    }

    /**
     * Updates the player's position on the canvas.
     * This method handles moving the player based on the velocity.
     */
    updatePosition(): void {
        // Update position by adding velocity
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Clamp x between margin (left edge) and (canvasWidth - margin) (right edge)
        this.position.x = Math.min(
            Math.max(this.position.x, config.game.margin.x),
            config.game.canvasWidth - config.game.margin.x
        );

        // Clamp y between margin (top edge) and (canvasHeight - margin) (bottom edge)
        this.position.y = Math.min(
            Math.max(this.position.y, config.game.margin.y),
            config.game.canvasHeight - config.game.margin.y
        );

        console.log(this.position, config.game)
    }
}

export default Player;