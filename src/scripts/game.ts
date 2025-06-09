/**
 * game.ts
 *
 * Core game logic and state management for the starship vs asteroids game.
 * Handles game objects, updating their states, collision detection, and drawing.
 */

class Game {
    private ctx: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;
    private backgroundImage: HTMLImageElement;
    private backgroundLoaded: boolean = false;
    private scale: number = 0.5;

    private offsetX: number = 0;
    private offsetY: number = 0;

    // Max parallax movement allowed
    private maxOffsetX: number = 0;
    private maxOffsetY: number = 0;

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.ctx = ctx;

        this.backgroundImage = new Image();
        this.backgroundImage.src = '/assets/images/background.jpg';

        this.backgroundImage.onload = (): void => {
            this.backgroundLoaded = true;

            const bgWidth: number = this.backgroundImage.width * this.scale;
            const bgHeight: number = this.backgroundImage.height * this.scale;

            // Calculate maximum offset to ensure the background always fills the canvas
            this.maxOffsetX = Math.max(0, (bgWidth - this.canvas.width) / 2);
            this.maxOffsetY = Math.max(0, (bgHeight - this.canvas.height) / 2);
        };

        this.backgroundImage.onerror = (): void => {
            console.error('Failed to load background image.');
        };
    }

    /**
     * Updates the game state and adjusts the background's offset based on player velocity.
     * This creates the effect of a subtle parallax as the player moves around the screen.
     *
     * @param playerVelocity - The velocity of the player character (x, y) affecting the background.
     */
    update(playerVelocity: { x: number, y: number }): void {
        // Apply a subtle parallax movement (e.g. 15% of player's velocity)
        this.offsetX -= playerVelocity.x * 0.15;
        this.offsetY -= playerVelocity.y * 0.15;

        // Clamp offsets so background doesn’t move out of visible bounds
        this.offsetX = Math.max(-this.maxOffsetX, Math.min(this.offsetX, this.maxOffsetX));
        this.offsetY = Math.max(-this.maxOffsetY, Math.min(this.offsetY, this.maxOffsetY));

        // Call the draw method to re-render the screen with the updated background
        this.draw();
    }

    /**
     * Draws the background image onto the canvas.
     * The background is drawn at the center of the screen with slight offset based on camera movement.
     */
    draw(): void {
        // Clear the screen to prepare for the next frame
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.backgroundLoaded) {
            // Calculate the scaled width and height of the background image
            const bgWidth: number = this.backgroundImage.width * this.scale;
            const bgHeight: number = this.backgroundImage.height * this.scale;

            // Calculate position to draw background, centered with a slight offset based on camera movement
            const drawX: number = (this.canvas.width - bgWidth) / 2 + this.offsetX;
            const drawY: number = (this.canvas.height - bgHeight) / 2 + this.offsetY;

            // Draw the background image onto the canvas at the calculated position
            this.ctx.drawImage(
                this.backgroundImage,
                0, 0,
                this.backgroundImage.width, this.backgroundImage.height,
                drawX, drawY,
                bgWidth, bgHeight
            );
        } else {
            // If the background isn't loaded, fill the screen with a black color as a fallback
            this.ctx.fillStyle = 'black';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}

export default Game;
