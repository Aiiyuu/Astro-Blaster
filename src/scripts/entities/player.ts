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
    public acceleration: { x: number; y: number }; // Player's current acceleration in x and y directions
    public maxSpeed: number;

    private rotation: number = 0; // The spaceship's rotation angle in radians (0 means facing right)
    public rotationalVelocity: number = 0;  // To track the current rotation speed
    public rotationalAcceleration: number = 0;  // To apply gradual rotation change

    private currentSprite: string = "/assets/images/sprites/rocket/rocket-default.svg"; // Default sprite path
    private spriteImage: HTMLImageElement = new Image();
    private defaultImage: HTMLImageElement = new Image();
    private isImageLoaded: boolean = false;

    private spriteFrames: HTMLImageElement[] = []; //
    private frameIndex: number = 0;
    private frameDelay: number = 5; // Delay between frames
    private frameCounter: number = 0;


    constructor({ctx, position, velocity}: {
        ctx: CanvasRenderingContext2D,
        position: { x: number, y: number };
        velocity: { x: number, y: number }
    }) {
        this.ctx = ctx;
        this.position = position;
        this.velocity = velocity;

        this.acceleration = {x: 0, y: 0};
        this.velocity = {x: 0, y: 0};
        this.maxSpeed = config.player.maxSpeed || 5;

        // Load sprite frames for animation
        for (let i: number = 1; i <= 5; i++) {
            const frame = new Image();
            frame.src = `/assets/images/sprites/rocket/rocket-${i}.svg`;
            frame.onload = (): void => {
                if (i === 1) this.spriteImage = frame; // Set initial image
                this.isImageLoaded = true; // Only mark loaded when at least one frame is loaded
            };
            this.spriteFrames.push(frame);
        }

        // Load default image shown when idle
        this.defaultImage.src = "/assets/images/sprites/rocket/rocket-default.svg";
        this.defaultImage.onload = () => {
            this.isImageLoaded = true;
        };
    }


    /**
     *  Draws the player's spaceship on the canvas.
     *  this method handles rendering the player at the current position.
     */
    private draw(): void {
        const img = new Image();

        img.src = this.currentSprite; // Dynamically choose sprite

        this.ctx.save();
        // Draw the sprite at the current position
        this.ctx.translate(this.position.x, this.position.y);
        this.ctx.rotate(this.rotation);
        this.ctx.translate(-this.position.x, -this.position.y);

        // Draw image in the canvas
        this.ctx.drawImage(
            this.spriteImage,
            this.position.x - this.spriteImage.width / 2,
            this.position.y - this.spriteImage.height / 2,
        );

        this.ctx.restore();
    }

    /**
     * Update the state of the player object
     */
    public update(): void {

        this.updateSprite(); // Update sprite based on movement

        this.draw() // Rerender the object

        this.updatePosition(); // Update object position to imitate movement
        this.updateRotation(); // Update object rotation value to imitate rotation movement
    }


    /**
     * Updates the player's position on the canvas.
     * This method handles moving the player based on the velocity.
     */
    public updatePosition(): void {
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
    }


    /**
     * Updates the player's rotation based on input and rotational physics.
     * Applies acceleration when 'D' or 'A' is pressed, and friction when no keys are pressed.
     * Ensures the rotational velocity doesn't exceed the maximum limit.
     */
    private updateRotation(): void {
        // Handle rotation acceleration
        this.rotation += this.rotationalVelocity;
    }


    /**
     * Updates the player's sprite based on movement, acceleration, and rotation
     */
    private updateSprite(): void {


        // Skip if no animation frames
        if (this.spriteFrames.length === 0) return;

        // Check if the player is moving
        const isMoving: boolean = Math.abs(this.velocity.x) >= 0.3 ||
                                  Math.abs(this.velocity.y) >= 0.3 ||
                                  Math.abs(this.rotationalVelocity) > 0.011;


        if (isMoving) {
            this.frameCounter++;

            // Advance to next frame if delay reached
            if (this.frameCounter >= this.frameDelay) {
                this.frameCounter = 0;
                this.frameIndex = (this.frameIndex + 1) % this.spriteFrames.length;
                this.spriteImage = this.spriteFrames[this.frameIndex];
            }
        } else {
            // Show idle image
            this.spriteImage = this.defaultImage;
        }
    }

    // Returns player's position
    public getPosition(): { x: number; y: number } {
        return { ...this.position };
    }

    // Returns player's rotation state
    public getRotation(): number {
        return this.rotation;
    }
}

export default Player;
