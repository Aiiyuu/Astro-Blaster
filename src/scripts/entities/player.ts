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

    private projectileDamage: number = config.player.projectile.damage;

    private position: { x: number, y: number }; // The initial position of the spaceship (x, y)
    public velocity: { x: number, y: number }; // The initial velocity of the spaceship (x, y)
    public acceleration: { x: number; y: number }; // Player's current acceleration in x and y directions
    public maxSpeed: number;

    private rotation: number = 0; // The spaceship's rotation angle in radians (0 means facing right)
    public rotationalVelocity: number = 0;  // To track the current rotation speed
    public rotationalAcceleration: number = 0;  // To apply gradual rotation change

    private spriteImage: HTMLImageElement = new Image();
    private defaultImage: HTMLImageElement = new Image();
    private isImageLoaded: boolean = false;

    private spriteFrames: HTMLImageElement[] = []; // Array to hold the sprite frames
    private frameIndex: number = 0;
    private frameDelay: number = 5; // Delay between frames
    private frameCounter: number = 0;

    private explosionSpriteFrames: HTMLImageElement[] = [];
    private explosionFrameIndex: number = 0;
    private explosionFrameDelay: number = 6;
    private explosionFrameCounter: number = 0;
    private isDefeated: boolean = false; // Flag to check if the player is defeated
    private readyToBeRemoved: boolean = false; // Flag to check if the explosion animation is done
    private delayBeforeRemoving: number = (config.meteorite.explosion_sprites.length - 1) * 20;

    constructor({ctx, position, velocity}: {
        ctx: CanvasRenderingContext2D,
        position: { x: number, y: number };
        velocity: { x: number, y: number }
    }) {
        this.ctx = ctx;
        this.position = position;
        this.velocity = velocity;

        // Initialize acceleration with default values
        this.acceleration = { x: 0, y: 0 };

        // Set max speed for the player, fallback to 5 if not defined in config
        this.maxSpeed = config.player.maxSpeed || 5;

        // Load sprite frames from config
        for (let i: number = 0; i < config.player.sprites.length; i++) {
            const frame = new Image();
            frame.src = config.player.sprites[i]; // Load image from config
            frame.onload = (): void => {
                if (i === 0) this.spriteImage = frame; // Set initial image
                this.isImageLoaded = true; // Only mark loaded when at least one frame is loaded
            };
            this.spriteFrames.push(frame);
        }

        // Load default image from config (idle state)
        this.defaultImage.src = config.player.default_sprite;
        this.defaultImage.onload = (): void => {
            this.isImageLoaded = true;
        };

        // Load explosion sprite frames
        this.explosionSpriteFrames = config.meteorite.explosion_sprites.map((spritePath: string): HTMLImageElement => {
            const img = new Image();
            img.src = spritePath;
            return img;
        });
    }

    /**
     *  Draws the player's spaceship on the canvas.
     *  This method handles rendering the player at the current position.
     */
    private draw(): void {
        if (!this.isImageLoaded) return; // Ensure the image is loaded before drawing

        // Dynamically calculate scaled dimensions based on image size
        const scaledWidth: number = this.spriteImage.width * config.player.scale;
        const scaledHeight: number = this.spriteImage.height * config.player.scale;

        this.ctx.save();
        // Draw the sprite at the current position
        this.ctx.translate(this.position.x, this.position.y);
        this.ctx.rotate(this.rotation);
        this.ctx.translate(-this.position.x, -this.position.y);

        // Draw image in the canvas
        this.ctx.drawImage(
            this.spriteImage,
            this.position.x - scaledWidth / 2,
            this.position.y - scaledHeight / 2,
            scaledWidth,
            scaledHeight
        );

        this.ctx.restore();
    }

    /**
     * Draws the current explosion frame at the specified position.
     * Stops once all frames are drawn.
     */
    private drawExplosion(): void {
        // Stop if we've reached the end of the explosion animation
        if (this.explosionFrameIndex >= this.explosionSpriteFrames.length) return;

        const ctx: CanvasRenderingContext2D = this.ctx;
        const explosionImg: HTMLImageElement = this.explosionSpriteFrames[this.explosionFrameIndex];

        const width: number = explosionImg.width * config.player.scale * 2;
        const height: number = explosionImg.height * config.player.scale * 2;

        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.drawImage(explosionImg, -width / 2, -height / 2, width, height);
        ctx.restore();
    }

    /**
     * Update the state of the player object
     */
    public update(): void {
        if (this.isDefeated) {
            this.updateExplosion();
            return;
        }

        this.updateSprite(); // Update sprite based on movement
        this.draw(); // Rerender the object
        this.updatePosition(); // Update object position to imitate movement
        this.updateRotation(); // Update object rotation value to imitate rotation movement
    }

    /**
     * Updates the explosion animation by incrementing the frame index.
     * Resets the frame counter and triggers removal when the last frame is reached.
     */
    private updateExplosion(): void {
        this.explosionFrameCounter++;

        // Proceed to the next frame if enough time has passed
        if (this.explosionFrameCounter >= this.explosionFrameDelay) {
            this.explosionFrameCounter = 0;
            this.explosionFrameIndex++;

            // If the last frame is reached, mark for removal after delay
            if (this.explosionFrameIndex >= this.explosionSpriteFrames.length) {
                this.explosionFrameIndex = this.explosionSpriteFrames.length - 1; // Stay on last frame
                setTimeout((): boolean => this.readyToBeRemoved = true, this.delayBeforeRemoving);
            }
        }

        this.drawExplosion();  // Draw the current explosion frame
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
            // Show idle image from config
            this.spriteImage = this.defaultImage;
        }
    }

    // Returns player's position
    public getPosition(): { x: number; y: number } {
        return { ...this.position };
    }

    // Calculate the radius based on the image size and scale factor
    public getRadius(): number {
        // Calculate the scaled width and height of the player sprite
        const scaledWidth: number = this.spriteImage.width * config.player.scale;
        const scaledHeight: number = this.spriteImage.height * config.player.scale;

        // Return the radius as half of the width or height (assuming the player is roughly circular)
        return Math.min(scaledWidth, scaledHeight) / 2;
    }

    // Returns player's rotation state
    public getRotation(): number {
        return this.rotation;
    }

    // Returns player's projectile damage
    public getProjectileDamage(): number {
        return this.projectileDamage;
    }

    // Returns the readyToBeRemoved variable
    public getReadyToBeRemoved(): boolean {
        return this.readyToBeRemoved;
    }

    /**
     * Sets the defeated state of the object.
     */
    public setIsDefeated(isDefeated: boolean): void {
        this.isDefeated = isDefeated;
    }
}

export default Player;
