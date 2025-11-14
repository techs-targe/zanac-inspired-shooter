class Player {
    constructor() {
        this.x = GAME_WIDTH / 2;
        this.y = GAME_HEIGHT - 80;
        this.size = 12; // Visual size (displayed)
        this.hitboxSize = 7.7; // Collision size (36% smaller: 9 × 0.85 = 7.65 ≈ 7.7)
        this.speed = 4;
        this.lives = 3;
        this.alive = true;
        this.invulnerable = false;
        this.invulnerableTime = 0;
        this.respawning = false;
        this.respawnY = GAME_HEIGHT + 20; // Start below screen
        this.respawnTargetY = GAME_HEIGHT - 80;

        // Main weapon system (power chips)
        this.mainWeaponLevel = 0; // 0-30: progressive power-up stages
        this.mainFireCooldown = 0;
        this.mainFireRate = 6; // Frames between shots

        // Sub weapon system (0-7)
        this.subWeaponType = 0; // 0-7
        this.subWeaponLevel = 0; // Level within each type (0-3+)
        this.subFireCooldown = 0;
        this.subFireRate = 8;

        // Sub weapon resources
        this.subWeaponAmmo = -1; // -1 means infinite
        this.subWeaponTime = -1; // -1 means no time limit (in frames)
        this.subWeaponDurability = -1; // -1 means infinite

        // Sub weapon state
        this.subWeaponActive = null; // For weapons like barrier, rotating shots
        this.lastMoveDir = {x: 0, y: -1}; // For weapon 0 (all-range)
        this.isMoving = false; // Track if player is currently moving

        // Crow bonus tracking (for special 1UP bonus)
        this.hasUsedMainWeapon = false; // Reset on game start and after death

        this.initSubWeapon(0);
    }

    update() {
        if (!this.alive) return; // Don't update if dead

        // Handle respawn animation
        if (this.respawning) {
            // Rise up from bottom of screen
            if (this.respawnY > this.respawnTargetY) {
                this.respawnY -= 3; // Rise up speed
                this.y = this.respawnY;
            } else {
                // Respawn complete
                this.respawning = false;
                this.y = this.respawnTargetY;
                // 5 seconds invincibility after respawn
                this.invulnerable = true;
                this.invulnerableTime = 300; // 5 seconds
            }
            return; // Don't process other updates while respawning
        }

        // Handle invulnerability frames
        if (this.invulnerable) {
            this.invulnerableTime--;
            if (this.invulnerableTime <= 0) {
                this.invulnerable = false;
            }
        }

        // Cooldown timers
        if (this.mainFireCooldown > 0) this.mainFireCooldown--;
        if (this.subFireCooldown > 0) this.subFireCooldown--;

        // Sub weapon time decay (only for time-limited weapons, except weapon 7)
        // Weapon 7 time only decreases while shooting (handled in shootWeapon7)
        if (this.subWeaponTime > 0 && this.subWeaponType !== 7) {
            this.subWeaponTime--;
            if (this.subWeaponTime <= 0) {
                this.resetToWeapon0();
            }
        }

        // Update active sub weapons (barriers, rotating shots, etc)
        if (this.subWeaponActive) {
            this.subWeaponActive.update();

            // Sync durability both ways for weapon 2 (barrier)
            if (this.subWeaponType === 2 && this.subWeaponActive.durability !== undefined) {
                this.subWeaponDurability = this.subWeaponActive.durability;
            }

            // Check if active weapon is dead
            if (this.subWeaponActive.isDead && this.subWeaponActive.isDead()) {
                this.subWeaponActive = null;
                if (this.subWeaponType === 2 || this.subWeaponType === 3) {
                    this.resetToWeapon0();
                }
            }
        }

        // Keep player in bounds
        this.x = constrain(this.x, this.size, GAME_WIDTH - this.size);
        this.y = constrain(this.y, this.size, GAME_HEIGHT - this.size);
    }

    handleInput() {
        if (!this.alive) return;

        // Track movement direction for weapon 0
        let moveX = 0, moveY = 0;

        // Use inputManager if available (supports keyboard, touch, gamepad)
        // Fall back to keyboard-only if inputManager not ready
        if (typeof inputManager !== 'undefined' && inputManager) {
            if (inputManager.left) {
                this.x -= this.speed;
                moveX = -1;
            }
            if (inputManager.right) {
                this.x += this.speed;
                moveX = 1;
            }
            if (inputManager.up) {
                this.y -= this.speed;
                moveY = -1;
            }
            if (inputManager.down) {
                this.y += this.speed;
                moveY = 1;
            }
        } else {
            // Fallback to keyboard-only
            if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) { // A
                this.x -= this.speed;
                moveX = -1;
            }
            if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) { // D
                this.x += this.speed;
                moveX = 1;
            }
            if (keyIsDown(UP_ARROW) || keyIsDown(87)) { // W
                this.y -= this.speed;
                moveY = -1;
            }
            if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) { // S
                this.y += this.speed;
                moveY = 1;
            }
        }

        // Update last move direction
        if (moveX !== 0 || moveY !== 0) {
            // Moving - use movement direction
            this.lastMoveDir = {x: moveX, y: moveY};
            this.isMoving = true;
        } else {
            // Stationary - default to upward
            this.isMoving = false;
        }
    }

    shootMain() {
        if (!this.alive || this.mainFireCooldown > 0) return;

        this.mainFireCooldown = this.mainFireRate;

        // Mark that main weapon was used (for Crow bonus)
        this.hasUsedMainWeapon = true;

        // Level 30 + Sub weapon 0: Ultra-thin laser beam with high power
        if (this.mainWeaponLevel === 30 && this.subWeaponType === 0) {
            // Create a special thin laser bullet
            let laserBullet = new PenetratingBullet(this.x, this.y - this.size, 0, -15, 2, 8);
            laserBullet.isLaserBeam = true; // Special flag for laser rendering
            bullets.push(laserBullet);
            return;
        }

        // Main weapon pattern based on level (0-5)
        // Level 6-29 use the same pattern as level 5
        let effectiveLevel = min(this.mainWeaponLevel, 5);

        switch(effectiveLevel) {
            case 0: // Single shot
                bullets.push(new Bullet(this.x, this.y - this.size, 0, -8, true, 1));
                break;

            case 1: // Single shot
                bullets.push(new Bullet(this.x, this.y - this.size, 0, -8, true, 1));
                break;

            case 2: // 2 parallel
                bullets.push(new Bullet(this.x - 6, this.y - this.size, 0, -8, true, 1));
                bullets.push(new Bullet(this.x + 6, this.y - this.size, 0, -8, true, 1));
                break;

            case 3: // 2 parallel
                bullets.push(new Bullet(this.x - 6, this.y - this.size, 0, -8, true, 1));
                bullets.push(new Bullet(this.x + 6, this.y - this.size, 0, -8, true, 1));
                break;

            case 4: // 3 parallel
                bullets.push(new Bullet(this.x, this.y - this.size, 0, -8, true, 1));
                bullets.push(new Bullet(this.x - 10, this.y - this.size, 0, -8, true, 1));
                bullets.push(new Bullet(this.x + 10, this.y - this.size, 0, -8, true, 1));
                break;

            case 5: // 3 parallel (level 5-29 use this)
                bullets.push(new Bullet(this.x, this.y - this.size, 0, -8, true, 1));
                bullets.push(new Bullet(this.x - 10, this.y - this.size, 0, -8, true, 1));
                bullets.push(new Bullet(this.x + 10, this.y - this.size, 0, -8, true, 1));
                break;
        }
    }

    shootSub() {
        if (!this.alive || this.subFireCooldown > 0) return;

        // Check ammo/durability
        if (this.subWeaponAmmo === 0 || this.subWeaponDurability === 0) {
            this.resetToWeapon0();
            return;
        }

        this.subFireCooldown = this.subFireRate;

        let fired = true; // Track if weapon actually fired
        switch(this.subWeaponType) {
            case 0: // All-range (全方位弾)
                this.shootWeapon0();
                break;
            case 1: // Straight Crusher (貫通弾)
                fired = this.shootWeapon1();
                break;
            case 2: // Field Shutter (防御幕)
                this.shootWeapon2();
                break;
            case 3: // Circular (回転弾)
                this.shootWeapon3();
                break;
            case 4: // Vibrator (振動弾)
                this.shootWeapon4();
                break;
            case 5: // Rewinder (往復弾)
                this.shootWeapon5();
                break;
            case 6: // Plasma Flash (反応弾)
                fired = this.shootWeapon6();
                break;
            case 7: // High Speed (高速速射弾)
                this.shootWeapon7();
                break;
        }

        // Consume ammo if applicable and weapon actually fired
        if (fired && this.subWeaponAmmo > 0) {
            this.subWeaponAmmo--;
        }
    }

    shootWeapon0() {
        // All-range: shoots in movement direction, or forward if stationary
        let dir;
        if (this.isMoving) {
            dir = this.lastMoveDir;
        } else {
            // Stationary - shoot forward (upward)
            dir = {x: 0, y: -1};
        }

        let speed = 8;
        let vx = dir.x * speed;
        let vy = dir.y * speed;

        if (this.subWeaponLevel === 0) {
            // Single shot
            bullets.push(new Bullet(this.x, this.y, vx, vy, true, 1));
        } else if (this.subWeaponLevel === 1) {
            // Double shot
            let offset = 6;
            let perpX = -dir.y;
            let perpY = dir.x;
            bullets.push(new Bullet(this.x + perpX * offset, this.y + perpY * offset, vx, vy, true, 1));
            bullets.push(new Bullet(this.x - perpX * offset, this.y - perpY * offset, vx, vy, true, 1));
        } else {
            // Wide double
            let offset = 10;
            let perpX = -dir.y;
            let perpY = dir.x;
            bullets.push(new Bullet(this.x + perpX * offset, this.y + perpY * offset, vx, vy, true, 1));
            bullets.push(new Bullet(this.x - perpX * offset, this.y - perpY * offset, vx, vy, true, 1));
        }
    }

    shootWeapon1() {
        // Penetrating shot - only one at a time
        let existingPenetrating = bullets.find(b => b instanceof PenetratingBullet && b.isPlayerBullet);
        if (existingPenetrating) return false; // Can't fire until current bullet is off screen

        // Speed increased by 30%
        let speed = (4 + this.subWeaponLevel) * 1.3;

        // Size scaling: Lv0-2: base size, Lv3-4: 2x diameter, Lv5+: 3x diameter
        let bulletSize;
        if (this.subWeaponLevel <= 2) {
            bulletSize = 8;
        } else if (this.subWeaponLevel <= 4) {
            bulletSize = 16; // 2x diameter
        } else {
            bulletSize = 24; // 3x diameter
        }

        if (this.subWeaponLevel === 0) {
            bullets.push(new PenetratingBullet(this.x, this.y - this.size, 0, -speed, bulletSize));
        } else if (this.subWeaponLevel === 1) {
            bullets.push(new PenetratingBullet(this.x - 6, this.y - this.size, 0, -speed, bulletSize));
            bullets.push(new PenetratingBullet(this.x + 6, this.y - this.size, 0, -speed, bulletSize));
        } else if (this.subWeaponLevel === 2) {
            bullets.push(new PenetratingBullet(this.x - 10, this.y - this.size, 0, -speed, bulletSize));
            bullets.push(new PenetratingBullet(this.x + 10, this.y - this.size, 0, -speed, bulletSize));
        } else {
            // Giant penetrating bullet
            bullets.push(new PenetratingBullet(this.x, this.y - this.size, 0, -speed, bulletSize));
        }
        return true; // Bullet fired successfully
    }

    shootWeapon2() {
        // Barrier - only create if not already active
        if (!this.subWeaponActive) {
            this.subWeaponActive = new BarrierWeapon(this, this.subWeaponLevel, this.subWeaponDurability);
        }
    }

    shootWeapon3() {
        // Rotating shots - only create if not already active
        if (!this.subWeaponActive) {
            this.subWeaponActive = new RotatingWeapon(this, this.subWeaponLevel);
        }
    }

    shootWeapon4() {
        // Vibrating shot - can re-fire to reposition ONLY after oscillation starts
        let existingBulletIndex = bullets.findIndex(b => b instanceof VibratingBullet);
        if (existingBulletIndex !== -1) {
            let existingBullet = bullets[existingBulletIndex];
            // Can only re-fire if the bullet is oscillating (not advancing)
            if (existingBullet.state === 'oscillating') {
                // Remove existing bullet before firing new one
                bullets.splice(existingBulletIndex, 1);
            } else {
                // Can't re-fire yet - bullet is still advancing
                return;
            }
        }

        let size = 8 + this.subWeaponLevel * 4;
        bullets.push(new VibratingBullet(this.x, this.y - this.size, size, this.subWeaponDurability, this.subWeaponLevel));
    }

    shootWeapon5() {
        // Weapon 5: Boomerang (Rewinder) until level 4, laser mutation at level 5+
        if (this.subWeaponLevel >= 5) {
            // Level 5+ mutation: Powerful straight laser - NO boomerang
            bullets.push(new StraightLaserBullet(this.x, this.y - this.size, this.subWeaponLevel));
        } else if (this.subWeaponLevel >= 3) {
            // Level 3-4: Two boomerangs (yoyo) - ◎◎
            let existingBoomerangs = bullets.filter(b => b instanceof BoomerangBullet);
            if (existingBoomerangs.length < 2) {
                // Create offset positions for two boomerangs
                let offset = 15;
                bullets.push(new BoomerangBullet(this, this.subWeaponLevel, -offset));
                bullets.push(new BoomerangBullet(this, this.subWeaponLevel, offset));
            }
        } else {
            // Level 0-2: Single boomerang (yoyo) - ◎
            let existingBoomerang = bullets.find(b => b instanceof BoomerangBullet);
            if (!existingBoomerang) {
                bullets.push(new BoomerangBullet(this, this.subWeaponLevel, 0));
            }
        }
    }

    shootWeapon6() {
        // Plasma flash - rapid-fire, super slow, damages all on-screen enemies
        // Only one plasma bullet at a time
        let existingPlasma = bullets.find(b => b instanceof PlasmaBullet && b.isPlayerBullet);
        if (existingPlasma) return false; // Can't fire until current bullet is off screen

        // Pass level to PlasmaBullet constructor
        bullets.push(new PlasmaBullet(this.x, this.y - this.size, 0, -2, this.subWeaponLevel)); // Super slow speed
        return true; // Bullet fired successfully
    }

    shootWeapon7() {
        // High-speed shot - curves in movement direction while shooting
        let speed = 12 + this.subWeaponLevel * 2;

        // Calculate velocity based on movement direction
        let vx = 0;
        let vy = -speed;

        if (this.isMoving && this.lastMoveDir) {
            // Curve in the direction of movement - more pronounced angle
            vx = this.lastMoveDir.x * 4; // Horizontal component
            // If moving vertically, adjust vertical speed
            if (this.lastMoveDir.y !== 0) {
                vy = -speed + this.lastMoveDir.y * 3;
            }
        }

        // Size scaling: Lv0-2: base size, Lv3-4: 2x diameter, Lv5+: 3x diameter
        let bulletSize;
        if (this.subWeaponLevel <= 2) {
            bulletSize = 6;
        } else if (this.subWeaponLevel <= 4) {
            bulletSize = 12; // 2x diameter
        } else {
            bulletSize = 18; // 3x diameter
        }

        // Reduced damage to 1/10 (0.2 instead of 2)
        bullets.push(new PenetratingBullet(this.x, this.y - this.size, vx, vy, bulletSize, 0.2));

        // Time decreases by 0.5 seconds (30 frames) per shot - 2x duration
        if (this.subWeaponTime > 0) {
            this.subWeaponTime -= 30;
            if (this.subWeaponTime <= 0) {
                this.resetToWeapon0();
            }
        }
    }

    triggerScreenClear() {
        // E.E. (Enemy Eraser) effect
        for (let i = enemies.length - 1; i >= 0; i--) {
            if (enemies[i].size < 20) { // Don't destroy giant enemies
                createExplosion(enemies[i].x, enemies[i].y, enemies[i].size);
                addScore(enemies[i].scoreValue);
                enemies.splice(i, 1);
            }
        }

        // Clear enemy bullets
        for (let i = enemyBullets.length - 1; i >= 0; i--) {
            createExplosion(enemyBullets[i].x, enemyBullets[i].y, 4);
            enemyBullets.splice(i, 1);
        }
    }

    collectPowerChip() {
        // Power up main weapon (max level 30)
        if (this.mainWeaponLevel < 30) {
            this.mainWeaponLevel++;
        }

        // Visual feedback
        for (let i = 0; i < 10; i++) {
            particles.push(new Particle(this.x, this.y, 8, color(255, 255, 100)));
        }

        // Invincibility for 2 seconds
        this.invulnerable = true;
        this.invulnerableTime = 120; // 2 seconds
    }

    collectSubWeapon(type) {
        if (type === this.subWeaponType) {
            // Same weapon - power up and restore
            let wasMaxLevel = this.subWeaponLevel >= 5;
            this.subWeaponLevel = min(this.subWeaponLevel + 1, 5);

            // Always restore resources
            this.initSubWeapon(type);

            // For weapon 2 (barrier) and weapon 3 (rotating), recreate immediately to show new visuals
            if (type === 2) {
                this.subWeaponActive = new BarrierWeapon(this, this.subWeaponLevel, this.subWeaponDurability);
            } else if (type === 3) {
                this.subWeaponActive = new RotatingWeapon(this, this.subWeaponLevel);
            }
        } else {
            // Different weapon - switch
            // Remove old weapon bullets (especially boomerang)
            for (let i = bullets.length - 1; i >= 0; i--) {
                if (bullets[i] instanceof StraightLaserBullet ||
                    bullets[i] instanceof BoomerangBullet ||
                    bullets[i] instanceof VibratingBullet ||
                    bullets[i] instanceof PlasmaBullet) {
                    bullets.splice(i, 1);
                }
            }

            this.subWeaponType = type;
            this.subWeaponLevel = 0;
            this.subWeaponActive = null;
            this.initSubWeapon(type);
        }

        // Visual feedback
        for (let i = 0; i < 15; i++) {
            particles.push(new Particle(this.x, this.y, 8, color(100, 255, 100)));
        }

        // Invincibility for 2 seconds
        this.invulnerable = true;
        this.invulnerableTime = 120; // 2 seconds
    }

    initSubWeapon(type) {
        // Reset resources based on weapon type and level
        let level = this.subWeaponLevel;

        switch(type) {
            case 0: // Infinite
                this.subWeaponAmmo = -1;
                this.subWeaponTime = -1;
                this.subWeaponDurability = -1;
                this.subFireRate = 8;
                break;

            case 1: // Ammo-based (50 + 50 per level)
                this.subWeaponAmmo = 50 + level * 50;
                this.subWeaponTime = -1;
                this.subWeaponDurability = -1;
                this.subFireRate = 10;
                break;

            case 2: // Durability-based (50 + 30 per level)
                this.subWeaponAmmo = -1;
                this.subWeaponTime = -1;
                this.subWeaponDurability = 50 + level * 30;
                this.subFireRate = 20;
                break;

            case 3: // Time-based (180 + 20 per level seconds)
                this.subWeaponAmmo = -1;
                this.subWeaponTime = (180 + level * 20) * 60; // Convert to frames (60 fps)
                this.subWeaponDurability = -1;
                this.subFireRate = 20;
                break;

            case 4: // Durability per shot (fixed 20, only 1 bullet at a time)
                this.subWeaponAmmo = -1;
                this.subWeaponTime = -1;
                this.subWeaponDurability = 20;
                this.subFireRate = 15;
                break;

            case 5: // Infinite
                this.subWeaponAmmo = -1;
                this.subWeaponTime = -1;
                this.subWeaponDurability = -1;
                this.subFireRate = 12;
                break;

            case 6: // Ammo-based (15 + 5 per level)
                this.subWeaponAmmo = 15 + level * 5;
                this.subWeaponTime = -1;
                this.subWeaponDurability = -1;
                this.subFireRate = 30;
                break;

            case 7: // Time-based shooting only (200 + 50 per level seconds)
                this.subWeaponAmmo = -1;
                this.subWeaponTime = (200 + level * 50) * 60; // Convert to frames (60 fps)
                this.subWeaponDurability = -1;
                this.subFireRate = 5;
                break;
        }
    }

    resetToWeapon0() {
        this.subWeaponType = 0;
        this.subWeaponLevel = 0;
        this.subWeaponActive = null;
        this.initSubWeapon(0);
    }

    hit() {
        if (this.invulnerable || this.respawning) return;

        // Special case: Main weapon Lv30 + Sub weapon NOT 0
        // Instead of losing life, downgrade to Lv1 and grant 5 seconds invincibility
        if (this.mainWeaponLevel === 30 && this.subWeaponType !== 0) {
            // Downgrade main weapon to Lv1
            this.mainWeaponLevel = 1;

            // Grant 5 seconds invincibility (300 frames at 60fps)
            this.invulnerable = true;
            this.invulnerableTime = 300;

            // Visual feedback: golden explosion (different from normal death)
            createExplosion(this.x, this.y, this.size * 2);
            for (let i = 0; i < 30; i++) {
                particles.push(new Particle(this.x, this.y, 15, color(255, 200, 0)));
            }

            console.log(`LV30 SHIELD ACTIVATED! Downgraded to Lv1, 5 seconds invincibility`);

            return; // Don't lose life
        }

        this.lives--;
        if (this.lives <= 0) {
            this.alive = false;
            this.die();
        } else {
            // Death explosion at current position
            createExplosion(this.x, this.y, this.size * 3);
            for (let i = 0; i < 20; i++) {
                particles.push(new Particle(this.x, this.y, 15, color(255, 100, 100)));
            }

            // Reset weapons and levels on death
            this.mainWeaponLevel = 0;
            this.subWeaponType = 0;
            this.subWeaponLevel = 0;
            this.subWeaponActive = null;

            // Remove all boomerang bullets (weapon 5)
            for (let i = bullets.length - 1; i >= 0; i--) {
                if (bullets[i] instanceof BoomerangBullet) {
                    bullets.splice(i, 1);
                }
            }

            this.initSubWeapon(0);

            // Start respawn sequence
            this.respawn();
        }
    }

    respawn() {
        this.respawning = true;
        this.x = GAME_WIDTH / 2;
        this.respawnY = GAME_HEIGHT + 20; // Start below screen
        this.y = this.respawnY;

        // Reset main weapon usage flag for Crow bonus
        this.hasUsedMainWeapon = false;
    }

    die() {
        createExplosion(this.x, this.y, this.size * 2);

        // Reset weapons and levels on death
        this.mainWeaponLevel = 0;
        this.subWeaponType = 0;
        this.subWeaponLevel = 0;
        this.subWeaponActive = null;

        // Remove all boomerang bullets (weapon 5)
        for (let i = bullets.length - 1; i >= 0; i--) {
            if (bullets[i] instanceof BoomerangBullet) {
                bullets.splice(i, 1);
            }
        }

        this.initSubWeapon(0);

        gameState = GAME_STATE.GAME_OVER;
    }

    draw() {
        push();

        // Draw ship (flashing when invulnerable)
        if (this.invulnerable && frameCount % 4 < 2) {
            // Flash effect
        } else {
            // Main ship body
            fill(100, 200, 255);
            noStroke();

            // Ship shape (triangle with details)
            triangle(
                this.x, this.y - this.size,
                this.x - this.size, this.y + this.size,
                this.x + this.size, this.y + this.size
            );

            // Cockpit
            fill(200, 220, 255);
            ellipse(this.x, this.y, this.size * 0.6);

            // Wings glow
            fill(50, 150, 255, 100);
            ellipse(this.x, this.y, this.size * 2, this.size * 1.5);

            // Engine trail
            fill(100, 200, 255, 150);
            for (let i = 0; i < 3; i++) {
                let trailY = this.y + this.size + i * 5;
                let trailSize = this.size * (0.5 - i * 0.1);
                ellipse(this.x - 6, trailY, trailSize, trailSize * 2);
                ellipse(this.x + 6, trailY, trailSize, trailSize * 2);
            }
        }

        // Draw sub weapon indicator
        if (this.subWeaponType > 0 || this.subWeaponLevel > 0) {
            fill(255, 255, 100);
            textSize(10);
            textAlign(CENTER, CENTER);
            text(`${this.subWeaponType}`, this.x, this.y - this.size - 15);

            // Level dots
            if (this.subWeaponLevel > 0) {
                for (let i = 0; i < min(this.subWeaponLevel, 5); i++) {
                    fill(100, 255, 100);
                    ellipse(this.x - 10 + i * 5, this.y - this.size - 25, 3);
                }
            }
        }

        // Draw active sub weapon (barrier, rotating, etc)
        if (this.subWeaponActive && this.subWeaponActive.draw) {
            this.subWeaponActive.draw();
        }

        pop();
    }

    getSubWeaponName() {
        const names = [
            'ALL-RANGE',
            'CRUSHER',
            'BARRIER',
            'CIRCULAR',
            'VIBRATOR',
            'REWINDER',
            'PLASMA',
            'HI-SPEED'
        ];
        return names[this.subWeaponType] || 'UNKNOWN';
    }
}
