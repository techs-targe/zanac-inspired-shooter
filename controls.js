// Input control system for keyboard, touch, and gamepad
// Unified input state that works across all control methods

class InputManager {
    constructor() {
        // Unified input states
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;
        this.mainFire = false;
        this.subFire = false;
        this.pause = false;

        // Touch control state (size = RADIUS for all buttons)
        this.touchButtons = {
            buttonA: { x: 0, y: 0, size: 40 },  // Main fire (radius 40, diameter 80)
            buttonB: { x: 0, y: 0, size: 40 },  // Sub fire (radius 40, diameter 80)
            pauseBtn: { x: 0, y: 0, size: 35 }  // Pause button (radius 35, diameter 70)
        };

        // Active touches for each button
        this.activeTouches = {
            movement: null,  // Touch used for movement (anywhere on screen)
            mainFire: null,
            subFire: null,
            pause: null
        };

        // Movement touch tracking
        this.movementTouchStart = { x: 0, y: 0 };  // Where movement touch started

        // Internal touch state (preserved across frames)
        this.touchState = {
            left: false,
            right: false,
            up: false,
            down: false
        };

        // Gamepad support
        this.gamepadIndex = -1;
        this.gamepadDeadzone = 0.2;

        // Mobile detection
        this.isMobile = this.detectMobile();

        // Setup touch controls if mobile
        if (this.isMobile) {
            this.setupTouchControls();
        }

        // Setup gamepad detection
        window.addEventListener('gamepadconnected', (e) => {
            console.log('🎮 Gamepad connected:', e.gamepad.id);
            console.log('   Index:', e.gamepad.index);
            console.log('   Buttons:', e.gamepad.buttons.length);
            console.log('   Axes:', e.gamepad.axes.length);
            this.gamepadIndex = e.gamepad.index;
        });

        window.addEventListener('gamepaddisconnected', (e) => {
            console.log('🎮 Gamepad disconnected:', e.gamepad.id);
            this.gamepadIndex = -1;
        });
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    }

    setupTouchControls() {
        // Position touch buttons based on canvas size
        const canvas = document.querySelector('canvas');
        if (!canvas) return;

        // Touch event handlers
        canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
        canvas.addEventListener('touchcancel', (e) => this.handleTouchEnd(e), { passive: false });
    }

    handleTouchStart(e) {
        e.preventDefault();
        const canvas = e.target;
        const rect = canvas.getBoundingClientRect();

        for (let touch of e.changedTouches) {
            // CRITICAL FIX: Map touch coordinates to p5.js coordinate system
            // rect = display size (CSS), width/height = p5.js canvas size
            // Direct mapping: (clientX / rect.width) * width
            const x = (touch.clientX - rect.left) / rect.width * width;
            const y = (touch.clientY - rect.top) / rect.height * height;

            console.log(`Touch: (${x.toFixed(0)}, ${y.toFixed(0)}) display:(${rect.width.toFixed(0)}x${rect.height.toFixed(0)}) canvas:(${width}x${height})`);

            // Check each button in priority order (first match wins)
            // Priority: A button > B button > Pause > Movement (anywhere else)

            // Check A button (main fire)
            if (this.isInsideButton(x, y, this.touchButtons.buttonA)) {
                console.log(`  → A button pressed`);
                this.mainFire = true;
                this.activeTouches.mainFire = touch.identifier;
                continue; // Skip other checks for this touch
            }

            // Check B button (sub fire)
            if (this.isInsideButton(x, y, this.touchButtons.buttonB)) {
                console.log(`  → B button pressed`);
                this.subFire = true;
                this.activeTouches.subFire = touch.identifier;
                continue; // Skip other checks for this touch
            }

            // Check pause button
            if (this.isInsideButton(x, y, this.touchButtons.pauseBtn)) {
                console.log(`  → Pause button pressed`);
                this.pause = true;
                this.activeTouches.pause = touch.identifier;
                continue; // Skip other checks for this touch
            }

            // Everything else is movement input - entire screen is now movement area!
            if (this.activeTouches.movement === null) {
                console.log(`  → Movement touch started at (${x.toFixed(0)}, ${y.toFixed(0)})`);
                this.activeTouches.movement = touch.identifier;
                this.movementTouchStart.x = x;
                this.movementTouchStart.y = y;
                // Initial position = no movement yet
                this.touchState.left = false;
                this.touchState.right = false;
                this.touchState.up = false;
                this.touchState.down = false;
            }
        }
    }

    handleTouchMove(e) {
        e.preventDefault();
        const canvas = e.target;
        const rect = canvas.getBoundingClientRect();

        // Update movement based on touch drag
        for (let touch of e.touches) {
            // Map touch coordinates to p5.js coordinate system
            const x = (touch.clientX - rect.left) / rect.width * width;
            const y = (touch.clientY - rect.top) / rect.height * height;

            // Check if this touch is controlling movement
            if (this.activeTouches.movement === touch.identifier) {
                // Calculate offset from touch start position
                const dx = x - this.movementTouchStart.x;
                const dy = y - this.movementTouchStart.y;

                // Threshold for detecting movement (in pixels)
                const threshold = 15;

                // Reset all directions
                this.touchState.left = false;
                this.touchState.right = false;
                this.touchState.up = false;
                this.touchState.down = false;

                // Detect direction based on offset from start position
                if (dx < -threshold) {
                    this.touchState.left = true;
                    this.left = true;
                }
                if (dx > threshold) {
                    this.touchState.right = true;
                    this.right = true;
                }
                if (dy < -threshold) {
                    this.touchState.up = true;
                    this.up = true;
                }
                if (dy > threshold) {
                    this.touchState.down = true;
                    this.down = true;
                }
            }
        }
    }

    handleTouchEnd(e) {
        e.preventDefault();

        for (let touch of e.changedTouches) {
            const id = touch.identifier;

            // Release movement (all directions)
            if (this.activeTouches.movement === id) {
                this.left = false;
                this.right = false;
                this.up = false;
                this.down = false;
                this.touchState.left = false;
                this.touchState.right = false;
                this.touchState.up = false;
                this.touchState.down = false;
                this.activeTouches.movement = null;
            }

            // Release fire buttons
            if (this.activeTouches.mainFire === id) {
                this.mainFire = false;
                this.activeTouches.mainFire = null;
            }
            if (this.activeTouches.subFire === id) {
                this.subFire = false;
                this.activeTouches.subFire = null;
            }

            // Release pause
            if (this.activeTouches.pause === id) {
                this.pause = false;
                this.activeTouches.pause = null;
            }
        }
    }


    isInsideButton(x, y, button) {
        const dx = x - button.x;
        const dy = y - button.y;
        // CRITICAL FIX: Use radius (button.size) for hit detection
        // Visual: ellipse(x, y, size*2, size*2) = diameter of size*2, radius = size
        // Hit detection: distance < size * 1.2 (20% larger for easier tapping)
        return Math.sqrt(dx * dx + dy * dy) < (button.size * 1.2);
    }

    update() {
        // Update keyboard input (this maintains backward compatibility)
        this.updateKeyboard();

        // Update gamepad input
        this.updateGamepad();
    }

    updateKeyboard() {
        // Movement keys - combine with touch/gamepad (OR logic)
        if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) this.left = true;  // A
        if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) this.right = true; // D
        if (keyIsDown(UP_ARROW) || keyIsDown(87)) this.up = true;    // W
        if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) this.down = true;  // S

        // Fire keys
        if (keyIsDown(32) || keyIsDown(88)) this.mainFire = true; // SPACE or X
        if (keyIsDown(90) || keyIsDown(67) || keyIsDown(86)) this.subFire = true;  // Z, C, or V
    }

    updateGamepad() {
        if (this.gamepadIndex < 0) return;

        const gamepads = navigator.getGamepads();
        const gamepad = gamepads[this.gamepadIndex];

        if (!gamepad) return;

        // Axes (left stick)
        const axisX = gamepad.axes[0];
        const axisY = gamepad.axes[1];

        if (axisX < -this.gamepadDeadzone) this.left = true;
        if (axisX > this.gamepadDeadzone) this.right = true;
        if (axisY < -this.gamepadDeadzone) this.up = true;
        if (axisY > this.gamepadDeadzone) this.down = true;

        // D-pad (buttons 12-15)
        if (gamepad.buttons[14] && gamepad.buttons[14].pressed) this.left = true;
        if (gamepad.buttons[15] && gamepad.buttons[15].pressed) this.right = true;
        if (gamepad.buttons[12] && gamepad.buttons[12].pressed) this.up = true;
        if (gamepad.buttons[13] && gamepad.buttons[13].pressed) this.down = true;

        // Fire buttons (A = 0, B = 1, X = 2, Y = 3)
        if (gamepad.buttons[0] && gamepad.buttons[0].pressed) this.mainFire = true; // A button
        if (gamepad.buttons[1] && gamepad.buttons[1].pressed) this.subFire = true;  // B button
        if (gamepad.buttons[2] && gamepad.buttons[2].pressed) this.mainFire = true; // X button
        if (gamepad.buttons[3] && gamepad.buttons[3].pressed) this.subFire = true;  // Y button

        // Start button for pause (button 9)
        if (gamepad.buttons[9] && gamepad.buttons[9].pressed) this.pause = true;
    }

    resetFrame() {
        // Pause is always reset (one-time trigger)
        this.pause = false;

        // Reset all inputs
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;
        this.mainFire = false;
        this.subFire = false;

        // Restore movement state from internal touch state
        if (this.activeTouches.movement !== null) {
            this.left = this.touchState.left;
            this.right = this.touchState.right;
            this.up = this.touchState.up;
            this.down = this.touchState.down;
        }

        // Restore fire button states
        if (this.activeTouches.mainFire !== null) this.mainFire = true;
        if (this.activeTouches.subFire !== null) this.subFire = true;
    }

    isGamepadLeft() {
        if (this.gamepadIndex < 0) return false;
        const gamepad = navigator.getGamepads()[this.gamepadIndex];
        if (!gamepad) return false;
        return (gamepad.axes[0] < -this.gamepadDeadzone) ||
               (gamepad.buttons[14] && gamepad.buttons[14].pressed);
    }

    isGamepadRight() {
        if (this.gamepadIndex < 0) return false;
        const gamepad = navigator.getGamepads()[this.gamepadIndex];
        if (!gamepad) return false;
        return (gamepad.axes[0] > this.gamepadDeadzone) ||
               (gamepad.buttons[15] && gamepad.buttons[15].pressed);
    }

    isGamepadUp() {
        if (this.gamepadIndex < 0) return false;
        const gamepad = navigator.getGamepads()[this.gamepadIndex];
        if (!gamepad) return false;
        return (gamepad.axes[1] < -this.gamepadDeadzone) ||
               (gamepad.buttons[12] && gamepad.buttons[12].pressed);
    }

    isGamepadDown() {
        if (this.gamepadIndex < 0) return false;
        const gamepad = navigator.getGamepads()[this.gamepadIndex];
        if (!gamepad) return false;
        return (gamepad.axes[1] > this.gamepadDeadzone) ||
               (gamepad.buttons[13] && gamepad.buttons[13].pressed);
    }

    isGamepadMainFire() {
        if (this.gamepadIndex < 0) return false;
        const gamepad = navigator.getGamepads()[this.gamepadIndex];
        if (!gamepad) return false;
        return (gamepad.buttons[0] && gamepad.buttons[0].pressed) ||
               (gamepad.buttons[2] && gamepad.buttons[2].pressed);
    }

    isGamepadSubFire() {
        if (this.gamepadIndex < 0) return false;
        const gamepad = navigator.getGamepads()[this.gamepadIndex];
        if (!gamepad) return false;
        return (gamepad.buttons[1] && gamepad.buttons[1].pressed) ||
               (gamepad.buttons[3] && gamepad.buttons[3].pressed);
    }

    updateButtonPositions() {
        // Update button positions based on current canvas size
        // Called every frame to ensure positions match display

        // All action buttons - 30px up from bottom
        const buttonY = height - 30;

        // Pause button at bottom center + shift right by 10 - shift left by 5
        this.touchButtons.pauseBtn.x = width / 2 + 10 - 5;
        this.touchButtons.pauseBtn.y = buttonY;

        // A button (main fire, red) - at right edge + shift right by 20 - shift left by 5
        this.touchButtons.buttonA.x = width - this.touchButtons.buttonA.size - 10 + 20 - 5;
        this.touchButtons.buttonA.y = buttonY;

        // B button (sub fire, blue) - right side, left of A + shift right by 20 - shift left by 5
        this.touchButtons.buttonB.x = width - this.touchButtons.buttonA.size * 2 - this.touchButtons.buttonB.size - 20 + 20 - 5;
        this.touchButtons.buttonB.y = buttonY;
    }

    drawTouchControls() {
        if (!this.isMobile) return;

        // Update positions first to match current canvas size
        this.updateButtonPositions();

        push();

        // Note: Debug info now shown by drawDebugInfo() on left side
        // Note: No D-pad drawn - entire screen is movement area!

        // A button (main fire)
        const btnA = this.touchButtons.buttonA;
        fill(255, 100, 100, this.mainFire ? 120 : 50);
        stroke(255, 255, 255, 100);
        strokeWeight(2);
        ellipse(btnA.x, btnA.y, btnA.size * 2, btnA.size * 2);
        fill(255, 255, 255, 200);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(20);
        text('A', btnA.x, btnA.y);

        // B button (sub fire)
        const btnB = this.touchButtons.buttonB;
        fill(100, 100, 255, this.subFire ? 120 : 50);
        stroke(255, 255, 255, 100);
        strokeWeight(2);
        ellipse(btnB.x, btnB.y, btnB.size * 2, btnB.size * 2);
        fill(255, 255, 255, 200);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(20);
        text('B', btnB.x, btnB.y);

        // Pause button
        const pauseBtn = this.touchButtons.pauseBtn;
        fill(200, 200, 100, this.pause ? 120 : 50);
        stroke(255, 255, 255, 100);
        strokeWeight(2);
        ellipse(pauseBtn.x, pauseBtn.y, pauseBtn.size * 2, pauseBtn.size * 2);
        fill(255, 255, 255, 200);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(12);
        text('P', pauseBtn.x, pauseBtn.y);

        pop();
    }
}

// Global input manager instance
let inputManager;
