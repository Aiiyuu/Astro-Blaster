/**
 * keyboard.ts
 * -----------------------------
 * This module handles keyboard input for the game.
 * It tracks both the continuous pressed state of keys
 * and whether a key was just clicked (pressed once).
 */

type KeyState = {
    [key: string]: boolean; // Tracks keys currently held down
};

type KeyClickState = {
    [key: string]: boolean; // Tracks keys that were just pressed this frame
};

// Stores the current pressed state of keys
const keyState: KeyState = {};

// Stores the clicked (edge-triggered) state of keys
const keyClickedState: KeyClickState = {};

/**
 * Initializes keyboard controls by setting up event listeners
 * for keydown and keyup events. These update the key state objects.
 */
export function initKeyboardControls(): void {
    window.addEventListener("keydown", (e: KeyboardEvent): void => {
        const key = e.code.toLowerCase();

        // If key wasn't already held, mark it as just clicked
        if (!keyState[key]) {
            keyClickedState[key] = true;
        }

        // Mark the key as currently held
        keyState[key] = true;
    });

    window.addEventListener("keyup", (e: KeyboardEvent): void => {
        const key = e.code.toLowerCase();

        // Reset both pressed and clicked states
        keyState[key] = false;
        keyClickedState[key] = false;
    });
}

/**
 * Returns true if the specified key is currently pressed.
 * Use this for holding actions like continuous movement.
 *
 * @param key - The key to check (use 'KeyW', 'ArrowLeft', etc.)
 */
export function isKeyPressed(key: string): boolean {
    return !!keyState[key.toLowerCase()];
}

/**
 * Returns true if the specified key was just clicked (pressed this frame).
 * This only returns true once per key press and is reset immediately after.
 * Use this for single actions like jumping or firing.
 *
 * @param key - The key to check (use 'KeyW', 'ArrowLeft', etc.)
 */
export function isKeyClicked(key: string): boolean {
    const lowerKey = key.toLowerCase();

    if (keyClickedState[lowerKey]) {
        keyClickedState[lowerKey] = false; // Clear after reading once
        return true;
    }

    return false;
}
