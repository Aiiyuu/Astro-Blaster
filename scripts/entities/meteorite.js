/**
 * meteorite.ts
 *
 * Defines the Meteorite class representing falling space rocks in the game.
 * Handles meteorite behavior including spawning, movement, and interactions
 * with the player and environment.
 */
import config from '../config.js';
class Meteorite {
    constructor({ ctx, position, velocity, target }) {
        this.health = config.meteorite.health_points; // Max health point from config
        this.rotation = 0; // The meteorite's rotation angle in radians (0 means facing right)
        // Meteorite sprite
        this.meteoriteSpriteImage = new Image();
        this.scale = 1;
        // Flame sprites
        this.flameSpriteFrames = [];
        this.flameFrameIndex = 0;
        this.flameFrameDelay = 5;
        this.flameFrameCounter = 0;
        // Explosion sprites
        this.explosionSpriteFrames = [];
        this.explosionFrameIndex = 0;
        this.explosionFrameDelay = 6;
        this.explosionFrameCounter = 0;
        this.isDestroyed = false; // Flag to check if the meteorite is destroyed
        // Indicates whether the object can be removed after the explosion animation.
        this.readyToBeRemoved = false;
        this.delayBeforeRemoving = (config.meteorite.explosion_sprites.length - 1) * 20;
        this.explosionSoundIsPlayed = false;
        this.ctx = ctx;
        this.position = position;
        this.target = target;
        // Random scale
        this.scale = Math.random() * (config.meteorite.max_scale - config.meteorite.min_scale) + config.meteorite.min_scale;
        // Random speed and angle
        this.speed = Math.random() * (config.meteorite.max_speed - config.meteorite.min_speed) + config.meteorite.min_speed;
        const angle = Math.random() * Math.PI + Math.PI / 4; // Between 45° and 225° downward-ish
        this.velocity = velocity || {
            x: Math.cos(angle) * this.speed,
            y: Math.sin(angle) * this.speed
        };
        // Random meteorite sprite
        const meteoriteSpriteIndex = Math.floor(Math.random() * config.meteorite.sprites.length);
        this.meteoriteSpriteImage.src = config.meteorite.sprites[meteoriteSpriteIndex];
        // Load flame sprite frames
        this.flameSpriteFrames = config.meteorite.flame_sprites.map((spritePath) => {
            const img = new Image();
            img.src = spritePath;
            return img;
        });
        // Load explosion sprite frames
        this.explosionSpriteFrames = config.meteorite.explosion_sprites.map((spritePath) => {
            const img = new Image();
            img.src = spritePath;
            return img;
        });
        // Initialize sounds
        this.explosionSound = new Audio(config.game.sounds.explosion_sound);
    }
    /**
     * Calculate the angle between the meteorite and its target for rotation.
     */
    calculateRotation() {
        const dx = this.target.x - this.position.x;
        const dy = this.target.y - this.position.y;
        this.rotation = Math.atan2(dy, dx); // Calculate angle to the target
    }
    /**
     * Draw a meteorite and flame on the canvas.
     * this method handles rendering the meteorite and flame at the current position.
     */
    drawMeteorite() {
        const ctx = this.ctx;
        // Calculate rotation angle based on velocity vector (pointing direction)
        this.rotation = Math.atan2(this.velocity.y, this.velocity.x);
        ctx.save();
        // Translate to meteorite position
        ctx.translate(this.position.x, this.position.y);
        // Rotate to face movement direction
        ctx.rotate(this.rotation);
        // Draw flame behind meteorite
        const meteoriteImg = this.meteoriteSpriteImage;
        const width = meteoriteImg.width * this.scale;
        const height = meteoriteImg.height * this.scale;
        const flameImg = this.flameSpriteFrames[this.flameFrameIndex];
        if (flameImg.complete) {
            const flameWidth = flameImg.width * this.scale;
            const flameHeight = flameImg.height * this.scale;
            // Offset from meteorite center in opposite direction of velocity
            const flameOffset = Math.max(width, height) / 2;
            ctx.save();
            // Rotate flame -90 degrees
            ctx.rotate(-Math.PI / 2);
            ctx.drawImage(flameImg, -flameWidth * 1.5 / 2, -flameHeight * 1.5 / 2 - flameOffset, flameWidth * 1.5, flameHeight * 1.5);
            ctx.restore();
        }
        // Draw meteorite sprite centered
        ctx.drawImage(meteoriteImg, -width / 2, -height / 2, width, height);
        ctx.restore();
    }
    /**
     * Draw an explosion animation frame on the canvas.
     * This method handles rendering the current explosion frame at the specified position with scaling applied.
     */
    drawExplosion() {
        // Stop if we've reached the end of the explosion animation
        if (this.explosionFrameIndex >= this.explosionSpriteFrames.length)
            return;
        const ctx = this.ctx;
        const explosionImg = this.explosionSpriteFrames[this.explosionFrameIndex];
        // Calculate the width and height of the explosion frame with scaling
        const width = explosionImg.width * this.scale * 2;
        const height = explosionImg.height * this.scale * 2;
        // Save the current canvas state before modifying it
        ctx.save();
        // Move the canvas origin to the explosion's position
        ctx.translate(this.position.x, this.position.y);
        // Draw the explosion frame, centered at the current position
        ctx.drawImage(explosionImg, -width / 2, -height / 2, width, height);
        // Restore the canvas state to avoid affecting other operations
        ctx.restore();
        // Play the explosion sound
        if (!this.explosionSoundIsPlayed) {
            this.playExplosionSound();
        }
    }
    /**
     * Draw the health bar above the meteorite.
     */
    drawHealthBar() {
        const ctx = this.ctx;
        // Parameters for the health bar
        const barWidth = this.meteoriteSpriteImage.width * this.scale;
        const barHeight = 7; // Height of the health bar
        const healthPercentage = this.health / config.meteorite.health_points; // Calculate the health percentage
        // Translate to meteorite position (without rotation)
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        // Draw background of health bar (light gray for example)
        ctx.fillStyle = '#DC2525'; // Background color of the health bar
        ctx.fillRect(-barWidth / 2, this.meteoriteSpriteImage.height * this.scale / 2 + 10, barWidth, barHeight);
        // Draw the green health bar
        ctx.fillStyle = '#347433'; // Green for health
        ctx.fillRect(-barWidth / 2, this.meteoriteSpriteImage.height * this.scale / 2 + 10, barWidth * healthPercentage, barHeight);
        ctx.restore(); // Restore the canvas state
    }
    /**
     * Apply damage to the meteorite.
     * @param damage - The amount of damage to apply to the meteorite.
     */
    applyDamage(damage) {
        this.health -= damage;
        // Ensure health doesn't go negative
        if (this.health <= 0) {
            this.isDestroyed = true;
            this.health = 0;
        }
    }
    /**
     * Update the state of the meteorite object
     */
    update() {
        // Make sure the meteorite is not destroyed
        if (this.isDestroyed) {
            this.updateExplosion();
            return;
        }
        // Move meteorite
        this.position.x += this.velocity.x * this.speed;
        this.position.y += this.velocity.y * this.speed;
        // Animate flame
        this.updateSprite();
        // Draw meteorite + flame
        this.drawMeteorite();
        // Draw health bar above the meteorite
        this.drawHealthBar();
        // Update the rotation to face the target
        this.calculateRotation();
    }
    /**
     * Updates the flame's sprite
     */
    updateSprite() {
        this.flameFrameCounter++;
        if (this.flameFrameCounter >= this.flameFrameDelay) {
            this.flameFrameCounter = 0;
            this.flameFrameIndex = (this.flameFrameIndex + 1) % this.flameSpriteFrames.length;
        }
    }
    /**
     * Update the explosion animation by advancing the frame.
     * This method handles incrementing the frame counter and switching to the next explosion frame when it's time.
     */
    updateExplosion() {
        // Increment the frame counter
        this.explosionFrameCounter++;
        // Check if it's time to switch to the next frame
        if (this.explosionFrameCounter >= this.explosionFrameDelay) {
            this.explosionFrameCounter = 0; // Reset the frame counter
            this.explosionFrameIndex++; // Move to the next explosion frame
            // If the last frame is reached, stay on it (end of animation)
            if (this.explosionFrameIndex >= this.explosionSpriteFrames.length) {
                this.explosionFrameIndex = this.explosionSpriteFrames.length - 1; // Stay on last frame
                setTimeout(() => this.readyToBeRemoved = true, this.delayBeforeRemoving);
            }
        }
        // Draw the current explosion frame
        this.drawExplosion();
    }
    // Method to play the explosion sound
    playExplosionSound() {
        this.explosionSound.play().catch((error) => {
            console.error('Failed to play explosion sound:', error);
        });
    }
    // Returns meteorite's position
    getPosition() {
        return Object.assign({}, this.position);
    }
    // Returns the radius of the meteorite based on its sprite width and scale.
    getRadius() {
        // Get the width of the meteorite sprite (it may not be loaded yet, so we handle it carefully)
        const width = this.meteoriteSpriteImage.width * this.scale;
        // If the sprite is not yet loaded, we fallback to a default value for now (you can adjust it)
        if (width === 0) {
            console.warn("Meteorite sprite not yet loaded. Using fallback radius.");
            return 20 * this.scale; // Default radius if sprite width is not available
        }
        // Calculate and return the radius using the width of the sprite
        return width / 2; // The radius is half the width of the sprite
    }
    // Returns whether the object can be removed after the explosion animation
    getReadyToBeRemoved() {
        return this.readyToBeRemoved;
    }
    // Returns the isDestroyed attribute
    getIsDestroyed() {
        return this.isDestroyed;
    }
}
export default Meteorite;

//# sourceMappingURL=meteorite.js.map
