/**
 * config.ts
 *
 * Centralized configuration and constants for the game such as canvas size,
 * speeds, colors, and other gameplay settings.
 */
// Get the game window object
const gameWindow = document.getElementById("game");
// Make sure the game window exists
if (!gameWindow) {
    throw new Error("Cannot find element with ID 'game'");
}
const config = {
    game: {
        canvasWidth: gameWindow.offsetWidth, // Game window width
        canvasHeight: gameWindow.offsetHeight, // Game window height
        score_text_size: 36,
        score_text_style: 'ScoreFont',
        game_over_text_size: 72,
        game_over_text_style: 'ScoreFont',
        // Margin buffer to keep the player within the visible game screen boundaries
        margin: {
            x: gameWindow.offsetWidth * 3.5 / 100,
            y: gameWindow.offsetHeight * 6 / 100
        },
        sounds: {
            background_music: 'assets/sounds/background-music.mp3',
            game_over_sound: 'assets/sounds/game-over.mp3',
            flying_sound: 'assets/sounds/flying.mp3',
            explosion_sound: 'assets/sounds/explosion.mp3',
            shoot_sound: 'assets/sounds/shoot.mp3'
        }
    },
    player: {
        scale: 0.8, // Scale factor for the player's sprite
        speed: 0.2, // This will be used as acceleration rate
        maxSpeed: 12,
        friction: 0.97,
        health_points: 100,
        ramDamage: 10,
        rotation_speed: 0.04,
        max_rotation_speed: 0.1,
        rotation_acceleration: 0.002,
        rotation_friction: 0.97,
        position: {
            x: gameWindow.offsetWidth / 2, // The initial X position of the player
            y: gameWindow.offsetHeight / 2, // The initial Y position of the player
        },
        projectile: {
            speed: 25,
            reloadTime: 100,
            spreadMargin: 23.2,
            damage: 5
        },
        default_sprite: 'assets/images/sprites/rocket/rocket-default.svg',
        sprites: [
            'assets/images/sprites/rocket/rocket-1.svg',
            'assets/images/sprites/rocket/rocket-2.svg',
            'assets/images/sprites/rocket/rocket-3.svg',
            'assets/images/sprites/rocket/rocket-4.svg',
            'assets/images/sprites/rocket/rocket-5.svg',
        ]
    },
    meteorite: {
        // Scale factor for the meteorite's sprite
        min_scale: 0.3,
        max_scale: 0.8,
        min_speed: 0.3,
        max_speed: 2,
        health_points: 100,
        damage: 3,
        score: 5,
        spawn_interval: 2000,
        sprites: [
            'assets/images/sprites/meteorites/meteorite-blue.svg',
            'assets/images/sprites/meteorites/meteorite-green.svg',
            'assets/images/sprites/meteorites/meteorite-white.svg',
            'assets/images/sprites/meteorites/meteorite-orange.svg',
            'assets/images/sprites/meteorites/meteorite-pale-pink.svg',
            'assets/images/sprites/meteorites/meteorite-pink.svg',
            'assets/images/sprites/meteorites/meteorite-purple.svg',
            'assets/images/sprites/meteorites/meteorite-red.svg',
            'assets/images/sprites/meteorites/meteorite-yellow.svg',
        ],
        flame_sprites: [
            'assets/images/sprites/meteorites/effects/flame-1.svg',
            'assets/images/sprites/meteorites/effects/flame-2.svg',
            'assets/images/sprites/meteorites/effects/flame-3.svg',
            'assets/images/sprites/meteorites/effects/flame-4.svg',
            'assets/images/sprites/meteorites/effects/flame-5.svg',
            'assets/images/sprites/meteorites/effects/flame-6.svg',
            'assets/images/sprites/meteorites/effects/flame-7.svg',
            'assets/images/sprites/meteorites/effects/flame-8.svg',
            'assets/images/sprites/meteorites/effects/flame-9.svg',
        ],
        explosion_sprites: [
            'assets/images/sprites/meteorites/effects/explosion-1.svg',
            'assets/images/sprites/meteorites/effects/explosion-2.svg',
            'assets/images/sprites/meteorites/effects/explosion-3.svg',
            'assets/images/sprites/meteorites/effects/explosion-4.svg',
            'assets/images/sprites/meteorites/effects/explosion-5.svg',
            'assets/images/sprites/meteorites/effects/explosion-6.svg',
            'assets/images/sprites/meteorites/effects/explosion-7.svg',
        ],
    }
};
export default config;

//# sourceMappingURL=config.js.map
