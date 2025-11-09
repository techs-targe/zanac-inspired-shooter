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

        // Touch control state
        this.touchButtons = {
            dpad: { x: 80, y: 0, size: 100 },   // Smaller D-pad
            buttonA: { x: 0, y: 0, size: 45 },  // Main fire
            buttonB: { x: 0, y: 0, size: 45 },  // Sub fire
            pauseBtn: { x: 0, y: 0, size: 35 }  // Pause button
        };

        // Active touches for each button
        this.activeTouches = {
            left: null,
            right: null,
            up: null,
            down: null,
            mainFire: null,
            subFire: null,
            pause: null
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
            console.log('Gamepad connected:', e.gamepad.id);
            this.gamepadIndex = e.gamepad.index;
        });

        window.addEventListener('gamepaddisconnected', (e) => {
            console.log('Gamepad disconnected');
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

        // Update button positions when canvas is ready
        setTimeout(() => {
            const rect = canvas.getBoundingClientRect();

            // Position controls at the very bottom of the screen
            const bottomMargin = 70;  // Margin from bottom
            const sideMargin = 70;     // Margin from sides

            // D-pad on bottom left
            this.touchButtons.dpad.x = sideMargin;
            this.touchButtons.dpad.y = rect.height - bottomMargin;

            // B button (sub fire) on bottom right, higher position
            this.touchButtons.buttonB.x = rect.width - sideMargin;
            this.touchButtons.buttonB.y = rect.height - bottomMargin - 50;

            // A button (main fire) on bottom right, lower position
            this.touchButtons.buttonA.x = rect.width - sideMargin - 60;
            this.touchButtons.buttonA.y = rect.height - bottomMargin;

            // Pause button at bottom center
            this.touchButtons.pauseBtn.x = rect.width / 2;
            this.touchButtons.pauseBtn.y = rect.height - 25;
        }, 100);

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
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;

            // Check D-pad
            this.checkDpad(x, y, touch.identifier);

            // Check A button (main fire)
            if (this.isInsideButton(x, y, this.touchButtons.buttonA)) {
                this.mainFire = true;
                this.activeTouches.mainFire = touch.identifier;
            }

            // Check B button (sub fire)
            if (this.isInsideButton(x, y, this.touchButtons.buttonB)) {
                this.subFire = true;
                this.activeTouches.subFire = touch.identifier;
            }

            // Check pause button
            if (this.isInsideButton(x, y, this.touchButtons.pauseBtn)) {
                this.pause = true;
                this.activeTouches.pause = touch.identifier;
            }
        }
    }

    handleTouchMove(e) {
        e.preventDefault();
        const canvas = e.target;
        const rect = canvas.getBoundingClientRect();

        // Update D-pad based on movement
        for (let touch of e.touches) {
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;

            // Check if this touch is on the D-pad
            if (this.activeTouches.left === touch.identifier ||
                this.activeTouches.right === touch.identifier ||
                this.activeTouches.up === touch.identifier ||
                this.activeTouches.down === touch.identifier) {

                // Reset D-pad directions for this touch
                if (this.activeTouches.left === touch.identifier) this.left = false;
                if (this.activeTouches.right === touch.identifier) this.right = false;
                if (this.activeTouches.up === touch.identifier) this.up = false;
                if (this.activeTouches.down === touch.identifier) this.down = false;

                // Recalculate D-pad
                this.checkDpad(x, y, touch.identifier);
            }
        }
    }

    handleTouchEnd(e) {
        e.preventDefault();

        for (let touch of e.changedTouches) {
            const id = touch.identifier;

            // Release D-pad directions
            if (this.activeTouches.left === id) {
                this.left = false;
                this.activeTouches.left = null;
            }
            if (this.activeTouches.right === id) {
                this.right = false;
                this.activeTouches.right = null;
            }
            if (this.activeTouches.up === id) {
                this.up = false;
                this.activeTouches.up = null;
            }
            if (this.activeTouches.down === id) {
                this.down = false;
                this.activeTouches.down = null;
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

    checkDpad(x, y, touchId) {
        const dpad = this.touchButtons.dpad;
        const dx = x - dpad.x;
        const dy = y - dpad.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < dpad.size / 2) {
            // Inside D-pad
            const angle = Math.atan2(dy, dx);
            const angleDeg = angle * 180 / Math.PI;

            // Determine direction based on angle
            // Right: -45 to 45
            // Down: 45 to 135
            // Left: 135 to -135
            // Up: -135 to -45

            if (angleDeg >= -45 && angleDeg < 45) {
                this.right = true;
                this.activeTouches.right = touchId;
            } else if (angleDeg >= 45 && angleDeg < 135) {
                this.down = true;
                this.activeTouches.down = touchId;
            } else if (angleDeg >= 135 || angleDeg < -135) {
                this.left = true;
                this.activeTouches.left = touchId;
            } else {
                this.up = true;
                this.activeTouches.up = touchId;
            }
        }
    }

    isInsideButton(x, y, button) {
        const dx = x - button.x;
        const dy = y - button.y;
        return Math.sqrt(dx * dx + dy * dy) < button.size;
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
        if (keyIsDown(32) || keyIsDown(90) || keyIsDown(88)) this.mainFire = true; // SPACE, Z, or X
        if (keyIsDown(67) || keyIsDown(86)) this.subFire = true;  // C or V
    }

    updateGamepad() {
        if (this.gamepadIndex < 0) return;

        const gamepad = navigator.getGamepads()[this.gamepadIndex];
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
        // Reset states that are not continuous (like pause)
        // Movement and fire buttons stay pressed if held
        this.pause = false;

        // Reset keyboard-only states at start of frame
        if (!this.activeTouches.left && !this.isGamepadLeft()) this.left = false;
        if (!this.activeTouches.right && !this.isGamepadRight()) this.right = false;
        if (!this.activeTouches.up && !this.isGamepadUp()) this.up = false;
        if (!this.activeTouches.down && !this.isGamepadDown()) this.down = false;
        if (!this.activeTouches.mainFire && !this.isGamepadMainFire()) this.mainFire = false;
        if (!this.activeTouches.subFire && !this.isGamepadSubFire()) this.subFire = false;
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

    drawTouchControls() {
        if (!this.isMobile) return;

        push();

        // D-pad
        const dpad = this.touchButtons.dpad;
        fill(255, 255, 255, 30);
        stroke(255, 255, 255, 100);
        strokeWeight(2);
        ellipse(dpad.x, dpad.y, dpad.size, dpad.size);

        // D-pad directions (scaled to match size)
        fill(255, 255, 255, this.left ? 80 : 30);
        triangle(dpad.x - 35, dpad.y, dpad.x - 18, dpad.y - 8, dpad.x - 18, dpad.y + 8);

        fill(255, 255, 255, this.right ? 80 : 30);
        triangle(dpad.x + 35, dpad.y, dpad.x + 18, dpad.y - 8, dpad.x + 18, dpad.y + 8);

        fill(255, 255, 255, this.up ? 80 : 30);
        triangle(dpad.x, dpad.y - 35, dpad.x - 8, dpad.y - 18, dpad.x + 8, dpad.y - 18);

        fill(255, 255, 255, this.down ? 80 : 30);
        triangle(dpad.x, dpad.y + 35, dpad.x - 8, dpad.y + 18, dpad.x + 8, dpad.y + 18);

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
