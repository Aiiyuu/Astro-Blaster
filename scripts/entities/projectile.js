var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * projectile.ts
 *
 * Defines the Projectile class representing bullet shots in the game.
 * Manages projectile behavior including position, movement,and interactions with other game entities.
 */
import config from "../config.js";
class Projectile {
    constructor({ ctx, position, velocity }) {
        this.shootSoundBuffer = null;
        this.lastShootTime = 0;
        this.shootCooldown = 150; // Cooldown time in ms
        this.shootSoundIsPlayed = false;
        this.ctx = ctx;
        this.position = position;
        this.velocity = velocity;
        // Initialize the Web Audio context
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        // Load the shoot sound into the AudioContext
        this.loadShootSound();
    }
    /**
     * Draw a projectile on the canvas.
     * this method handles rendering the projectile at the current position.
     */
    draw() {
        const { ctx, position, velocity } = this;
        ctx.save();
        ctx.strokeStyle = 'orange'; // Simple hot bullet color
        ctx.lineWidth = 3; // Thin stick width
        ctx.beginPath();
        const length = 10; // length of the stick
        const angle = Math.atan2(velocity.y, velocity.x);
        const startX = position.x - Math.cos(angle) * length / 2;
        const startY = position.y - Math.sin(angle) * length / 2;
        const endX = position.x + Math.cos(angle) * length / 2;
        const endY = position.y + Math.sin(angle) * length / 2;
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.restore();
    }
    /**
     * Update the state of the projectile object
     */
    update() {
        this.draw(); // Rerender the projectile
        // Update the projectile position
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        // Make sure the shoot sound is not played
        if (this.shootSoundIsPlayed)
            return;
        const currentTime = Date.now();
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
    loadShootSound() {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch the shoot sound file and decode it into an audio buffer
            try {
                const response = yield fetch(config.game.sounds.shoot_sound);
                const arrayBuffer = yield response.arrayBuffer();
                this.shootSoundBuffer = yield this.audioContext.decodeAudioData(arrayBuffer);
            }
            catch (error) {
                console.error("Error loading shoot sound:", error);
            }
        });
    }
    // Method to play the shoot sound
    playShootSound() {
        console.log(true);
        if (this.shootSoundBuffer && this.audioContext.state === 'running') {
            // Create a new source node each time a sound is played
            const soundSource = this.audioContext.createBufferSource();
            soundSource.buffer = this.shootSoundBuffer;
            // Connect the source to the destination (the speakers)
            soundSource.connect(this.audioContext.destination);
            // Start playing the sound
            soundSource.start();
        }
    }
    // Returns projectile's position
    getPosition() {
        return Object.assign({}, this.position);
    }
}
export default Projectile;

//# sourceMappingURL=projectile.js.map
