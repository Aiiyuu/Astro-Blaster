/**
 * player.ts
 *
 * Defines the Player class representing the spaceship controlled by the player.
 * Handles player properties such as position, movement, shooting, and collision detection.
 */
import config from '../config.js';
class Player {
    constructor({ ctx, position, velocity }) {
        this.projectileDamage = config.player.projectile.damage;
        this.rotation = 0; // The spaceship's rotation angle in radians (0 means facing right)
        this.rotationalVelocity = 0; // To track the current rotation speed
        this.rotationalAcceleration = 0; // To apply gradual rotation change
        this.spriteImage = new Image();
        this.defaultImage = new Image();
        this.isImageLoaded = false;
        this.spriteFrames = []; // Array to hold the sprite frames
        this.frameIndex = 0;
        this.frameDelay = 5; // Delay between frames
        this.frameCounter = 0;
        this.explosionSpriteFrames = [];
        this.explosionFrameIndex = 0;
        this.explosionFrameDelay = 6;
        this.explosionFrameCounter = 0;
        this.isDefeated = false; // Flag to check if the player is defeated
        this.readyToBeRemoved = false; // Flag to check if the explosion animation is done
        this.delayBeforeRemoving = (config.meteorite.explosion_sprites.length - 1) * 20;
        this.ctx = ctx;
        this.position = position;
        this.velocity = velocity;
        // Initialize acceleration with default values
        this.acceleration = { x: 0, y: 0 };
        // Set max speed for the player, fallback to 5 if not defined in config
        this.maxSpeed = config.player.maxSpeed || 5;
        // Load sprite frames from config
        for (let i = 0; i < config.player.sprites.length; i++) {
            const frame = new Image();
            frame.src = config.player.sprites[i]; // Load image from config
            frame.onload = () => {
                if (i === 0)
                    this.spriteImage = frame; // Set initial image
                this.isImageLoaded = true; // Only mark loaded when at least one frame is loaded
            };
            this.spriteFrames.push(frame);
        }
        // Load default image from config (idle state)
        this.defaultImage.src = config.player.default_sprite;
        this.defaultImage.onload = () => {
            this.isImageLoaded = true;
        };
        // Load explosion sprite frames
        this.explosionSpriteFrames = config.meteorite.explosion_sprites.map((spritePath) => {
            const img = new Image();
            img.src = spritePath;
            return img;
        });
        // Initialize sounds
        this.flyingSound = new Audio(config.game.sounds.flying_sound);
        this.flyingSound.loop = true;
        this.flyingSound.volume = 0.5;
    }
    /**
     *  Draws the player's spaceship on the canvas.
     *  This method handles rendering the player at the current position.
     */
    draw() {
        if (!this.isImageLoaded)
            return; // Ensure the image is loaded before drawing
        // Dynamically calculate scaled dimensions based on image size
        const scaledWidth = this.spriteImage.width * config.player.scale;
        const scaledHeight = this.spriteImage.height * config.player.scale;
        this.ctx.save();
        // Draw the sprite at the current position
        this.ctx.translate(this.position.x, this.position.y);
        this.ctx.rotate(this.rotation);
        this.ctx.translate(-this.position.x, -this.position.y);
        // Draw image in the canvas
        this.ctx.drawImage(this.spriteImage, this.position.x - scaledWidth / 2, this.position.y - scaledHeight / 2, scaledWidth, scaledHeight);
        this.ctx.restore();
    }
    /**
     * Draws the current explosion frame at the specified position.
     * Stops once all frames are drawn.
     */
    drawExplosion() {
        // Stop if we've reached the end of the explosion animation
        if (this.explosionFrameIndex >= this.explosionSpriteFrames.length)
            return;
        const ctx = this.ctx;
        const explosionImg = this.explosionSpriteFrames[this.explosionFrameIndex];
        const width = explosionImg.width * config.player.scale * 2;
        const height = explosionImg.height * config.player.scale * 2;
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.drawImage(explosionImg, -width / 2, -height / 2, width, height);
        ctx.restore();
    }
    /**
     * Update the state of the player object
     */
    update() {
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
    updateExplosion() {
        this.explosionFrameCounter++;
        // Proceed to the next frame if enough time has passed
        if (this.explosionFrameCounter >= this.explosionFrameDelay) {
            this.explosionFrameCounter = 0;
            this.explosionFrameIndex++;
            // If the last frame is reached, mark for removal after delay
            if (this.explosionFrameIndex >= this.explosionSpriteFrames.length) {
                this.explosionFrameIndex = this.explosionSpriteFrames.length - 1; // Stay on last frame
                setTimeout(() => this.readyToBeRemoved = true, this.delayBeforeRemoving);
            }
        }
        this.drawExplosion(); // Draw the current explosion frame
    }
    /**
     * Updates the player's position on the canvas.
     * This method handles moving the player based on the velocity.
     */
    updatePosition() {
        // Update position by adding velocity
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        // Clamp x between margin (left edge) and (canvasWidth - margin) (right edge)
        this.position.x = Math.min(Math.max(this.position.x, config.game.margin.x), config.game.canvasWidth - config.game.margin.x);
        // Clamp y between margin (top edge) and (canvasHeight - margin) (bottom edge)
        this.position.y = Math.min(Math.max(this.position.y, config.game.margin.y), config.game.canvasHeight - config.game.margin.y);
    }
    /**
     * Updates the player's rotation based on input and rotational physics.
     * Applies acceleration when 'D' or 'A' is pressed, and friction when no keys are pressed.
     * Ensures the rotational velocity doesn't exceed the maximum limit.
     */
    updateRotation() {
        // Handle rotation acceleration
        this.rotation += this.rotationalVelocity;
    }
    /**
     * Updates the player's sprite based on movement, acceleration, and rotation
     */
    updateSprite() {
        // Skip if no animation frames
        if (this.spriteFrames.length === 0)
            return;
        // Check if the player is moving
        const isMoving = Math.abs(this.velocity.x) >= 0.3 ||
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
            // Play the flying sound
            this.playFlyingSound();
        }
        else {
            // Show idle image from config
            this.spriteImage = this.defaultImage;
            // Stop the flying sound
            this.stopFlyingSound();
        }
    }
    // Method to play the flying sound
    playFlyingSound() {
        this.flyingSound.play().catch((error) => {
            console.error('Failed to play flying sound:', error);
        });
    }
    // Method to stop the flying sound
    stopFlyingSound() {
        if (this.flyingSound.paused)
            return;
        this.flyingSound.pause(); // Pauses the music
        this.flyingSound.currentTime = 0; // Resets the music to the start
    }
    // Returns player's position
    getPosition() {
        return Object.assign({}, this.position);
    }
    // Calculate the radius based on the image size and scale factor
    getRadius() {
        // Calculate the scaled width and height of the player sprite
        const scaledWidth = this.spriteImage.width * config.player.scale;
        const scaledHeight = this.spriteImage.height * config.player.scale;
        // Return the radius as half of the width or height (assuming the player is roughly circular)
        return Math.min(scaledWidth, scaledHeight) / 2;
    }
    // Returns player's rotation state
    getRotation() {
        return this.rotation;
    }
    // Returns player's projectile damage
    getProjectileDamage() {
        return this.projectileDamage;
    }
    // Returns the readyToBeRemoved variable
    getReadyToBeRemoved() {
        return this.readyToBeRemoved;
    }
    /**
     * Sets the defeated state of the object.
     */
    setIsDefeated(isDefeated) {
        this.isDefeated = isDefeated;
    }
}
export default Player;

//# sourceMappingURL=player.js.map
