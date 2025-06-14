/**
 * projectile.ts
 *
 * Defines the Projectile class representing bullet shots in the game.
 * Manages projectile behavior including position, movement,and interactions with other game entities.
 */


class Projectile {
    // The interface provided by the browser representing the 2D rendering context
    private ctx: CanvasRenderingContext2D;

    private position: { x: number; y: number };
    private velocity: { x: number; y: number };

    constructor({ctx, position, velocity}: {
        ctx: CanvasRenderingContext2D,
        position: { x: number; y: number };
        velocity: { x: number; y: number };
    }) {
        this.ctx = ctx;
        this.position = position;
        this.velocity = velocity;
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
    }

    // Returns projectile's position
    public getPosition(): { x: number; y: number } {
        return { ...this.position };
    }
}


export default Projectile;