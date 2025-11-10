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
            dpad: { x: 80, y: 0, size: 60 },    // D-pad (radius 60, diameter 120)
            buttonA: { x: 0, y: 0, size: 40 },  // Main fire (radius 40, diameter 80)
            buttonB: { x: 0, y: 0, size: 40 },  // Sub fire (radius 40, diameter 80)
            pauseBtn: { x: 0, y: 0, size: 35 }  // Pause button (radius 35, diameter 70) - LARGER!
        };

        // Active touches for each button
        this.activeTouches = {
            dpad: null,    // Single touch for D-pad (controls all 4 directions)
            mainFire: null,
            subFire: null,
            pause: null
        };

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
            // Priority: A button > B button > Pause > D-pad

            // Check A button (main fire)
            let distA = Math.sqrt((x - this.touchButtons.buttonA.x)**2 + (y - this.touchButtons.buttonA.y)**2);
            if (this.isInsideButton(x, y, this.touchButtons.buttonA)) {
                console.log(`  → A button pressed (dist:${distA.toFixed(1)}, threshold:${(this.touchButtons.buttonA.size * 1.2).toFixed(1)})`);
                this.mainFire = true;
                this.activeTouches.mainFire = touch.identifier;
                continue; // Skip other checks for this touch
            }

            // Check B button (sub fire)
            let distB = Math.sqrt((x - this.touchButtons.buttonB.x)**2 + (y - this.touchButtons.buttonB.y)**2);
            if (this.isInsideButton(x, y, this.touchButtons.buttonB)) {
                console.log(`  → B button pressed (dist:${distB.toFixed(1)}, threshold:${(this.touchButtons.buttonB.size * 1.2).toFixed(1)})`);
                this.subFire = true;
                this.activeTouches.subFire = touch.identifier;
                continue; // Skip other checks for this touch
            }

            // Check pause button
            let distP = Math.sqrt((x - this.touchButtons.pauseBtn.x)**2 + (y - this.touchButtons.pauseBtn.y)**2);
            if (this.isInsideButton(x, y, this.touchButtons.pauseBtn)) {
                console.log(`  → Pause button pressed (dist:${distP.toFixed(1)}, threshold:${(this.touchButtons.pauseBtn.size * 1.2).toFixed(1)})`);
                this.pause = true;
                this.activeTouches.pause = touch.identifier;
                continue; // Skip other checks for this touch
            }

            // Check D-pad (lowest priority)
            let distD = Math.sqrt((x - this.touchButtons.dpad.x)**2 + (y - this.touchButtons.dpad.y)**2);
            const dpadHit = this.checkDpad(x, y, touch.identifier);
            if (dpadHit) {
                console.log(`  → D-pad: ${dpadHit} (dist:${distD.toFixed(1)}, threshold:${(this.touchButtons.dpad.size * 1.2).toFixed(1)})`);
            } else {
                console.log(`  → Miss! Distances: A:${distA.toFixed(1)} B:${distB.toFixed(1)} P:${distP.toFixed(1)} D:${distD.toFixed(1)}`);
            }
        }
    }

    handleTouchMove(e) {
        e.preventDefault();
        const canvas = e.target;
        const rect = canvas.getBoundingClientRect();

        // Update D-pad based on movement
        for (let touch of e.touches) {
            // Map touch coordinates to p5.js coordinate system
            const x = (touch.clientX - rect.left) / rect.width * width;
            const y = (touch.clientY - rect.top) / rect.height * height;

            // Check if this touch is controlling the D-pad
            if (this.activeTouches.dpad === touch.identifier) {
                // Reset internal D-pad state
                this.touchState.left = false;
                this.touchState.right = false;
                this.touchState.up = false;
                this.touchState.down = false;

                // Recalculate D-pad based on new position (updates touchState)
                this.checkDpad(x, y, touch.identifier);
            }
        }
    }

    handleTouchEnd(e) {
        e.preventDefault();

        for (let touch of e.changedTouches) {
            const id = touch.identifier;

            // Release D-pad (all directions)
            if (this.activeTouches.dpad === id) {
                this.left = false;
                this.right = false;
                this.up = false;
                this.down = false;
                this.touchState.left = false;
                this.touchState.right = false;
                this.touchState.up = false;
                this.touchState.down = false;
                this.activeTouches.dpad = null;
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

        // D-pad hit detection: radius * 1.2 for easier tapping (size is already radius)
        if (distance < dpad.size * 1.2) {
            // Inside D-pad - allow diagonal movement!
            // Mark this touch as controlling the D-pad
            this.activeTouches.dpad = touchId;

            // Use threshold-based detection instead of angle
            const threshold = dpad.size / 6; // Adjust sensitivity

            let directions = [];

            // Horizontal direction (update internal touch state)
            if (dx < -threshold) {
                this.touchState.left = true;
                this.left = true;
                directions.push('LEFT');
            } else if (dx > threshold) {
                this.touchState.right = true;
                this.right = true;
                directions.push('RIGHT');
            }

            // Vertical direction (update internal touch state)
            if (dy < -threshold) {
                this.touchState.up = true;
                this.up = true;
                directions.push('UP');
            } else if (dy > threshold) {
                this.touchState.down = true;
                this.down = true;
                directions.push('DOWN');
            }

            return directions.length > 0 ? directions.join('+') : null;
        }
        return null;
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
        // Pause is always reset (one-time trigger)
        this.pause = false;

        // Reset all inputs
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;
        this.mainFire = false;
        this.subFire = false;

        // Restore D-pad state from internal touch state
        if (this.activeTouches.dpad !== null) {
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

    drawDebugInfo() {
        // Draw gamepad connection status (top-right corner)
        push();
        fill(255, 255, 100);
        textSize(10);
        textAlign(RIGHT, TOP);

        if (this.gamepadIndex >= 0) {
            const gamepad = navigator.getGamepads()[this.gamepadIndex];
            if (gamepad) {
                text(`Gamepad: ${gamepad.id.substring(0, 20)}`, width - 10, 120);
                text(`Connected: ${this.gamepadIndex}`, width - 10, 132);

                // Show active inputs
                let inputs = [];
                if (this.left) inputs.push('L');
                if (this.right) inputs.push('R');
                if (this.up) inputs.push('U');
                if (this.down) inputs.push('D');
                if (this.mainFire) inputs.push('A');
                if (this.subFire) inputs.push('B');
                if (inputs.length > 0) {
                    text(`Input: ${inputs.join(',')}`, width - 10, 144);
                }
            }
        } else {
            text('Gamepad: Not connected', width - 10, 120);
        }

        pop();
    }

    updateButtonPositions() {
        // Update button positions based on current canvas size
        // Called every frame to ensure positions match display

        // D-pad on bottom left - 30px up from bottom
        // Position: left edge at 10px, so center = radius + 10
        this.touchButtons.dpad.x = this.touchButtons.dpad.size + 10;
        this.touchButtons.dpad.y = height - 30; // 30px up

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

        // DEBUG: Show touch state (top-left corner)
        fill(255, 100, 100);
        textSize(10);
        textAlign(LEFT, TOP);
        text(`Touch Debug:`, 10, 120);
        text(`L:${this.left} R:${this.right} U:${this.up} D:${this.down}`, 10, 132);
        text(`A:${this.mainFire} B:${this.subFire} P:${this.pause}`, 10, 144);
        text(`Active: ${Object.values(this.activeTouches).filter(t => t !== null).length}`, 10, 156);

        // Show button positions
        fill(255, 255, 100);
        text(`Dpad:(${this.touchButtons.dpad.x.toFixed(0)},${this.touchButtons.dpad.y.toFixed(0)})`, 10, 168);
        text(`A:(${this.touchButtons.buttonA.x.toFixed(0)},${this.touchButtons.buttonA.y.toFixed(0)})`, 10, 180);
        text(`B:(${this.touchButtons.buttonB.x.toFixed(0)},${this.touchButtons.buttonB.y.toFixed(0)})`, 10, 192);

        // D-pad (simple circle - touch anywhere to move in that direction)
        const dpad = this.touchButtons.dpad;
        fill(255, 255, 255, 30);
        stroke(255, 255, 255, 100);
        strokeWeight(2);
        ellipse(dpad.x, dpad.y, dpad.size * 2, dpad.size * 2);

        // Optional: Show center point for reference
        fill(255, 255, 255, 150);
        noStroke();
        ellipse(dpad.x, dpad.y, 8, 8);

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
