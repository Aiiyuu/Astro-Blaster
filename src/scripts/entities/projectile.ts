/**
 * projectile.ts
 *
 * Defines the Projectile class representing bullet shots in the game.
 * Manages projectile behavior including position, movement,and interactions with other game entities.
 */
import config from "../config.js";


class Projectile {
    // The interface provided by the browser representing the 2D rendering context
    private ctx: CanvasRenderingContext2D;

    private position: { x: number; y: number };
    private velocity: { x: number; y: number };

    // Web Audio API setup
    private audioContext: AudioContext;
    private shootSoundBuffer: AudioBuffer | null = null;
    private lastShootTime: number = 0;
    private shootCooldown: number = 150; // Cooldown time in ms
    private shootSoundIsPlayed: boolean = false;

    constructor({ctx, position, velocity}: {
        ctx: CanvasRenderingContext2D,
        position: { x: number; y: number };
        velocity: { x: number; y: number };
    }) {
        this.ctx = ctx;
        this.position = position;
        this.velocity = velocity;

        // Initialize the Web Audio context
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

        // Load the shoot sound into the AudioContext
        this.loadShootSound();
    }

    /**
     * Draw a projectile on the canvas.
     * this method handles rendering the projectile at the current position.
     */
    private draw(): void {
        const { ctx, position, velocity } = this;

        ctx.save();

        ctx.strokeStyle = 'orange'; // Simple hot bullet color
        ctx.lineWidth = 3; // Thin stick width

        ctx.beginPath();

        const length = 10; // length of the stick
        const angle: number = Math.atan2(velocity.y, velocity.x);

        const startX: number = position.x - Math.cos(angle) * length / 2;
        const startY: number = position.y - Math.sin(angle) * length / 2;
        const endX: number = position.x + Math.cos(angle) * length / 2;
        const endY: number = position.y + Math.sin(angle) * length / 2;

        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);

        ctx.stroke();

        ctx.restore();
    }

    /**
     * Update the state of the projectile object
     */
    public update(): void {
        this.draw() // Rerender the projectile

        // Update the projectile position
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Make sure the shoot sound is not played
        if (this.shootSoundIsPlayed) return;

        const currentTime:number = Date.now();
        if (currentTime - this.lastShootTime >= this.shootCooldown) {
            this.playShootSound();
            this.shootSoundIsPlayed = true;
            this.lastShootTime = currentTime; // Update last shoot time
        }
    }

    /**
     * Asynchronously loads and decodes the shooting sound into an AudioBuffer.
     * The sound is fetched from the specified URL, converted to an ArrayBuffer,
     * and then decoded using the Web Audio API for playback.
     *
     * @returns {Promise<void>} Resolves once the sound is loaded and ready to use.
     */
    private async loadShootSound(): Promise<void> {
        // Fetch the shoot sound file and decode it into an audio buffer
        try {
            const response: Response = await fetch(config.game.sounds.shoot_sound);
            const arrayBuffer = await response.arrayBuffer();
            this.shootSoundBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        } catch (error) {
            console.error("Error loading shoot sound:", error);
        }
    }

    // Method to play the shoot sound
    private playShootSound(): void {
        console.log(true)
        if (this.shootSoundBuffer && this.audioContext.state === 'running') {
            // Create a new source node each time a sound is played
            const soundSource: AudioBufferSourceNode = this.audioContext.createBufferSource();
            soundSource.buffer = this.shootSoundBuffer;

            // Connect the source to the destination (the speakers)
            soundSource.connect(this.audioContext.destination);

            // Start playing the sound
            soundSource.start();
        }
    }

    // Returns projectile's position
    public getPosition(): { x: number; y: number } {
        return { ...this.position };
    }
}


export default Projectile;