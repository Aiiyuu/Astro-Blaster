/**
 * updateMeteorites.ts
 *
 * Updates the position of each meteorite and removes any that go off-screen.
 */


import config from '../config.js';
import Meteorite from "../entities/meteorite.js";


export default function updateMeteorites(meteorites: Meteorite[]): void {
    // Iterate backwards to safely remove meteorites while looping
    for (let i: number = meteorites.length - 1; i >= 0; i--) {
        const meteorite: Meteorite = meteorites[i];

        // Update meteorite position/state
        meteorite.update();

        const pos: { x: number, y:number } = meteorite.getPosition();

        // Remove meteorite if it goes outside the canvas boundaries
        if (
            pos.x < -1000 || pos.x > config.game.canvasWidth + 500 ||
            pos.y < -1000 || pos.y > config.game.canvasHeight + 500
        ) {
            meteorites.splice(i, 1);
        }
    }
}