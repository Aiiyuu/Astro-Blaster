/**
 * game.ts
 *
 * Core game logic and state management for the starship vs asteroids game.
 * Handles game objects, updating their states, collision detection, and drawing.
 */

import config from '../config.js';

// Define a type for sound names based on the config
type SoundName = keyof typeof config.game.sounds;

class Game {
    private ctx: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;
    private backgroundImage: HTMLImageElement;
    private backgroundLoaded: boolean = false;
    private scale: number = 0.3;

    private offsetX: number = 0;
    private offsetY: number = 0;

    // Max parallax movement allowed
    private maxOffsetX: number = 0;
    private maxOffsetY: number = 0;

    // New score property
    private score: number = 0;

    // Player's health points
    private healthPoints: number = config.player.health_points;
    private isDefeated: boolean = false;

    // Game musics and sounds
    private backgroundMusic: HTMLAudioElement;
    private gameOverSound: HTMLAudioElement;
    private gameOverSoundIsPlayed: boolean = false;


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

        // Initialize sounds
        this.backgroundMusic = new Audio(config.game.sounds.background_music);
        this.gameOverSound = new Audio(config.game.sounds.game_over_sound);
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.5;
    }

    /**
     * Updates the game state and adjusts the background's offset based on player velocity.
     * This creates the effect of a subtle parallax as the player moves around the screen.
     *
     * @param playerVelocity - The velocity of the player character (x, y) affecting the background.
     */
    public update(playerVelocity: { x: number, y: number }): void {
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
    private draw(): void {
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

    /**
     * Draws the score text at the top-right corner
     */
    public drawScore(): void {
        // Draw the score at the top-right corner
        this.ctx.font = `${config.game.score_text_size}px ${config.game.score_text_style}`;
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'right';
        this.ctx.textBaseline = 'top';

        const padding = 20; // Padding from the edge
        this.ctx.fillText(`Score: ${this.score}`, this.canvas.width - padding, padding);
    }

    /**
     * Draws the "Game Over" text at the center
     */
    public drawGameOver(): void {
        // Set up font and style for "Game Over" text
        this.ctx.font = `${config.game.game_over_text_size}px ${config.game.game_over_text_style}`;
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        // Draw the "Game Over" text in the center of the canvas
        this.ctx.fillText("Game Over", this.canvas.width / 2, this.canvas.height / 2);

        // Stop the background music if it's playing
        if (!this.backgroundMusic.paused) {
            this.stopBackgroundMusic();
        }

        // Play the game over sound only if it's not already playing
        if (this.gameOverSound.paused && !this.gameOverSoundIsPlayed) {
            this.playGameOverSound();
            this.gameOverSoundIsPlayed = true;
        }
    }

    /**
     * Draws the player's health points at the top-left corner
     */
    public drawHealthBar(): void {
        const barWidth = 240;      // Total width of the health bar
        const barHeight = 20;      // Height of the health bar
        const paddingX = 20; // Left padding
        const paddingY = 30; // Top padding (twice as large)

        const healthPercentage: number = this.healthPoints / config.player.health_points;

        // Background bar
        this.ctx.fillStyle = '#DC2525';
        this.ctx.fillRect(paddingX, paddingY, barWidth, barHeight);

        // Health foreground
        this.ctx.fillStyle = '#347433';
        this.ctx.fillRect(paddingX, paddingY, barWidth * healthPercentage, barHeight);

        // Border (optional)
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(paddingX, paddingY, barWidth, barHeight);
    }

    /**
     * Apply damage to the player.
     * @param damage - The amount of damage to apply to the player.
     */
    public applyDamage(damage: number): void {
        this.healthPoints -= damage;

        // Ensure health doesn't go negative
        if (this.healthPoints <= 0) {
            this.isDefeated = true;
            this.healthPoints = 0;
        }
    }

    // Method to play the background music
    public playBackgroundMusic(): void {
        this.backgroundMusic.play().catch((error: any): void => {
            console.error('Failed to play background music:', error);
        });
    }

    // Method to stop the background music
    private stopBackgroundMusic(): void {
        this.backgroundMusic.pause();  // Pauses the music
        this.backgroundMusic.currentTime = 0;  // Resets the music to the start
    }

    // Method to play the "Game Over" sound
    private playGameOverSound(): void {
        this.gameOverSound.play().catch((error: any): void => {
            console.error('Failed to play Game Over sound:', error);
        });
    }

    // Returns the isDefeated variable
    public getIsDefeated(): boolean {
        return this.isDefeated;
    }

    // Setter method to update the score
    public setScore(newScore: number): void {
        this.score = newScore;
    }

    // Getter method to access the score
    public getScore(): number {
        return this.score;
    }
}

export default Game;
