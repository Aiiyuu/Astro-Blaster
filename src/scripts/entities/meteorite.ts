/**
 * meteorite.ts
 *
 * Defines the Meteorite class representing falling space rocks in the game.
 * Handles meteorite behavior including spawning, movement, and interactions
 * with the player and environment.
 */

import config from '../config.js';

class Meteorite {
    // The interface provided by the browser representing the 2D rendering context
    private ctx: CanvasRenderingContext2D;

    private position: { x: number; y: number };
    private target: { x: number, y: number };
    private velocity: { x: number; y: number };

    private rotation: number = 0; // The meteorite's rotation angle in radians (0 means facing right)

    // Meteorite sprite
    private meteoriteSpriteImage: HTMLImageElement = new Image();
    private scale: number = 1;
    private speed: number;

    // Flame sprites
    private flameSpriteFrames: HTMLImageElement[] = [];
    private flameFrameIndex: number = 0;
    private flameFrameDelay: number = 5;
    private flameFrameCounter: number = 0;

    constructor({ctx, position, velocity, target}: {
        ctx: CanvasRenderingContext2D,
        position: { x: number; y: number };
        velocity?: { x: number; y: number };
        target: { x: number; y: number };
    }) {
        this.ctx = ctx;
        this.position = position;
        this.target = target;

        // Random scale
        this.scale = Math.random() * (config.meteorite.max_scale - config.meteorite.min_scale) + config.meteorite.min_scale;

        // Random speed and angle
        this.speed = Math.random() * (config.meteorite.max_speed - config.meteorite.min_speed) + config.meteorite.min_speed;
        const angle: number = Math.random() * Math.PI + Math.PI / 4; // Between 45° and 225° downward-ish

        this.velocity = velocity || {
            x: Math.cos(angle) * this.speed,
            y: Math.sin(angle) * this.speed
        };

        // Random meteorite sprite
        const meteoriteSpriteIndex: number = Math.floor(Math.random() * config.meteorite.sprites.length);
        this.meteoriteSpriteImage.src = config.meteorite.sprites[meteoriteSpriteIndex];

        // Load flame sprite frames
        this.flameSpriteFrames = config.meteorite.flame_sprites.map((spritePath: string): HTMLImageElement => {
            const img = new Image();
            img.src = spritePath;
            return img;
        });
    }

    /**
     * Calculate the angle between the meteorite and its target for rotation.
     */
    private calculateRotation(): void {
        const dx: number = this.target.x - this.position.x;
        const dy: number = this.target.y - this.position.y;
        this.rotation = Math.atan2(dy, dx); // Calculate angle to the target
    }

    /**
     * Draw a meteorite and flame on the canvas.
     * this method handles rendering the meteorite and flame at the current position.
     */
    private drawMeteorite(): void {
        const ctx: CanvasRenderingContext2D = this.ctx;

        // Calculate rotation angle based on velocity vector (pointing direction)
        this.rotation = Math.atan2(this.velocity.y, this.velocity.x);

        ctx.save();

        // Translate to meteorite position
        ctx.translate(this.position.x, this.position.y);

        // Rotate to face movement direction
        ctx.rotate(this.rotation);

        // Draw flame behind meteorite
        const meteoriteImg: HTMLImageElement = this.meteoriteSpriteImage;
        const width: number = meteoriteImg.width * this.scale;
        const height: number = meteoriteImg.height * this.scale;
        const flameImg: HTMLImageElement = this.flameSpriteFrames[this.flameFrameIndex];

        if (flameImg.complete) {
            const flameWidth: number = flameImg.width * this.scale;
            const flameHeight: number = flameImg.height * this.scale;

            // Offset from meteorite center in opposite direction of velocity
            const flameOffset: number = Math.max(width, height) / 2;

            ctx.save();
            // Rotate flame -90 degrees
            ctx.rotate(-Math.PI / 2);

            ctx.drawImage(
                flameImg,
                -flameWidth * 1.5 / 2,
                -flameHeight * 1.5 / 2 - flameOffset,
                flameWidth * 1.5,
                flameHeight * 1.5
            );
            ctx.restore();
        }

        // Draw meteorite sprite centered
        ctx.drawImage(meteoriteImg, -width / 2, -height / 2, width, height);

        ctx.restore();
    }

    /**
     * Update the state of the meteorite object
     */
    public update(): void {
        // Move meteorite
        this.position.x += this.velocity.x * this.speed;
        this.position.y += this.velocity.y * this.speed;

        // Animate flame
        this.updateSprite();

        // Draw meteorite + flame
        this.drawMeteorite();

        // Update the rotation to face the target
        this.calculateRotation();
    }

    /**
     * Updates the flame's sprite
     */
    private updateSprite(): void {
        this.flameFrameCounter++;
        if (this.flameFrameCounter >= this.flameFrameDelay) {
            this.flameFrameCounter = 0;
            this.flameFrameIndex = (this.flameFrameIndex + 1) % this.flameSpriteFrames.length;
        }
    }

    // Returns meteorite's position
    public getPosition(): { x: number; y: number } {
        return { ...this.position };
    }
}

export default Meteorite;
