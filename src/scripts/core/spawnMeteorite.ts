/**
 * spawnMeteorite.ts
 *
 * Creates and adds a new meteorite to the game at a random position.
 * Controls the meteorite's initial properties such as size, speed, and trajectory.
 */

import config from '../config.js';
import Meteorite from '../entities/meteorite.js'


// Stores the interval ID for spawning meteorites, used to clear the interval later
let meteoriteSpawnInterval: NodeJS.Timeout;
let meteoriteSpawnIntervalTime: number = config.meteorite.spawn_interval;


/**
 * Generates a random spawn position along the continuous rectangular perimeter
 * surrounding the game canvas, including a margin outside the visible area.
 *
 * The position is uniformly distributed along the entire outer rectangle's
 * border (top, right, bottom, and left edges combined), allowing meteorites
 * to spawn anywhere around the canvas edges seamlessly without explicitly
 * enumerating corners or edges.
 *
 * @returns An object with x and y coordinates representing the spawn position
 *          just outside the visible canvas boundary.
 */
function getRandomEdgePosition(): { x: number, y: number } {
    const canvasWidth: number = config.game.canvasWidth;
    const canvasHeight: number = config.game.canvasHeight;

    // Margin outside the visible canvas to spawn meteorites
    const margin = 50;

    // Total perimeter length of the outer rectangle (including margin)
    const perimeter: number = 2 * (canvasWidth + 2 * margin) + 2 * (canvasHeight + 2 * margin);

    // Pick a random position along this perimeter line
    const pos: number = Math.random() * perimeter;

    // Define lengths of each side
    const topSideLength: number = canvasWidth + 2 * margin;
    const rightSideLength: number = canvasHeight + 2 * margin;
    const bottomSideLength: number = canvasWidth + 2 * margin;
    const leftSideLength: number = canvasHeight + 2 * margin;

    let x: number = 0, y: number = 0;

    if (pos < topSideLength) {
        // Top side (left to right)
        x = -margin + pos;
        y = -margin;
    } else if (pos < topSideLength + rightSideLength) {
        // Right side (top to bottom)
        x = canvasWidth + margin;
        y = -margin + (pos - topSideLength);
    } else if (pos < topSideLength + rightSideLength + bottomSideLength) {
        // Bottom side (right to left)
        x = canvasWidth + margin - (pos - topSideLength - rightSideLength);
        y = canvasHeight + margin;
    } else {
        // Left side (bottom to top)
        x = -margin;
        y = canvasHeight + margin - (pos - topSideLength - rightSideLength - bottomSideLength);
    }

    return { x, y };
}

/**
 * Calculates a random position near the center of the canvas.
 *
 * @returns An object with x and y coordinates of a random position near center.
 */
function getRandomTargetNearCenter(): { x: number, y: number } {
    const centerX: number = config.game.canvasWidth / 2;
    const centerY: number = config.game.canvasHeight / 2;

    // Add some randomness to the center position to avoid meteorites always going directly to the center
    const randomRadius: number = Math.random() * (config.game.canvasWidth * 0.9); // Radius between 0 and 90% of canvas width
    const randomAngle: number = Math.random() * Math.PI * 2; // Random angle in radians

    const targetX: number = centerX + randomRadius * Math.cos(randomAngle);
    const targetY: number = centerY + randomRadius * Math.sin(randomAngle);

    return { x: targetX, y: targetY };
}


/**
 * The function is responsible for setting the interval of the
 * meteorite spawn, defining its initial characteristics and position.
 *
 * @param meteorites - The current list of meteorites in the game.
 * @param ctx - The canvas rendering context.
 */
export function setSpawnMeteoriteInterval(meteorites: Meteorite[], ctx: CanvasRenderingContext2D): void {
    meteoriteSpawnInterval = setInterval((): void => {
        const position: { x:number, y:number } = getRandomEdgePosition();
        const target: { x: number, y: number } = getRandomTargetNearCenter(); // Target near the center

        // Calculate direction to the target
        const dx: number = target.x - position.x;
        const dy: number = target.y - position.y;
        const distance: number = Math.sqrt(dx * dx + dy * dy);
        const velocity = { x: (dx / distance) * 3, y: (dy / distance) * 3 }; // Speed of meteorite

        // Create meteorite instance with direction and velocity
        meteorites.push(
            new Meteorite({
                ctx,
                position,
                velocity, // Initial velocity that directs the meteorite towards the target
                target,   // Pass target to Meteorite
            })
        );
    }, meteoriteSpawnIntervalTime);
}


/**
 * Clears the interval responsible for spawning meteorites,
 * stopping new meteorites from being generated.
 */
export function removeSpawnMeteoriteInterval(): void {
    if (meteoriteSpawnInterval) {
        clearInterval(meteoriteSpawnInterval);
    }
}