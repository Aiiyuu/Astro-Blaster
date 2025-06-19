/**
 * spawnMeteorite.ts
 *
 * Creates and adds a new meteorite to the game at a random position.
 * Controls the meteorite's initial properties such as size, speed, and trajectory.
 */
import config from '../config.js';
import Meteorite from '../entities/meteorite.js';
// Stores the interval ID for spawning meteorites, used to clear the interval later
let meteoriteSpawnInterval;
let meteoriteSpawnIntervalTime = config.meteorite.spawn_interval;
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
function getRandomEdgePosition() {
    const canvasWidth = config.game.canvasWidth;
    const canvasHeight = config.game.canvasHeight;
    // Margin outside the visible canvas to spawn meteorites
    const margin = 50;
    // Total perimeter length of the outer rectangle (including margin)
    const perimeter = 2 * (canvasWidth + 2 * margin) + 2 * (canvasHeight + 2 * margin);
    // Pick a random position along this perimeter line
    const pos = Math.random() * perimeter;
    // Define lengths of each side
    const topSideLength = canvasWidth + 2 * margin;
    const rightSideLength = canvasHeight + 2 * margin;
    const bottomSideLength = canvasWidth + 2 * margin;
    const leftSideLength = canvasHeight + 2 * margin;
    let x = 0, y = 0;
    if (pos < topSideLength) {
        // Top side (left to right)
        x = -margin + pos;
        y = -margin;
    }
    else if (pos < topSideLength + rightSideLength) {
        // Right side (top to bottom)
        x = canvasWidth + margin;
        y = -margin + (pos - topSideLength);
    }
    else if (pos < topSideLength + rightSideLength + bottomSideLength) {
        // Bottom side (right to left)
        x = canvasWidth + margin - (pos - topSideLength - rightSideLength);
        y = canvasHeight + margin;
    }
    else {
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
function getRandomTargetNearCenter() {
    const centerX = config.game.canvasWidth / 2;
    const centerY = config.game.canvasHeight / 2;
    // Add some randomness to the center position to avoid meteorites always going directly to the center
    const randomRadius = Math.random() * (config.game.canvasWidth * 0.8); // Radius between 0 and 80% of canvas width
    const randomAngle = Math.random() * Math.PI * 2; // Random angle in radians
    const targetX = centerX + randomRadius * Math.cos(randomAngle);
    const targetY = centerY + randomRadius * Math.sin(randomAngle);
    return { x: targetX, y: targetY };
}
/**
 * The function is responsible for setting the interval of the
 * meteorite spawn, defining its initial characteristics and position.
 *
 * @param meteorites - The current list of meteorites in the game.
 * @param ctx - The canvas rendering context.
 */
export function setSpawnMeteoriteInterval(meteorites, ctx) {
    meteoriteSpawnInterval = setInterval(() => {
        const position = getRandomEdgePosition();
        const target = getRandomTargetNearCenter(); // Target near the center
        // Calculate direction to the target
        const dx = target.x - position.x;
        const dy = target.y - position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const velocity = { x: (dx / distance) * 3, y: (dy / distance) * 3 }; // Speed of meteorite
        // Create meteorite instance with direction and velocity
        meteorites.push(new Meteorite({
            ctx,
            position,
            velocity, // Initial velocity that directs the meteorite towards the target
            target, // Pass target to Meteorite
        }));
    }, meteoriteSpawnIntervalTime);
}
/**
 * Clears the interval responsible for spawning meteorites,
 * stopping new meteorites from being generated.
 */
export function removeSpawnMeteoriteInterval() {
    if (meteoriteSpawnInterval) {
        clearInterval(meteoriteSpawnInterval);
    }
}

//# sourceMappingURL=spawnMeteorite.js.map
