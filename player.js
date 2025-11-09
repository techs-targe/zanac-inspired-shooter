class Player {
    constructor() {
        this.x = GAME_WIDTH / 2;
        this.y = GAME_HEIGHT - 80;
        this.size = 12;
        this.speed = 4;
        this.lives = 3;
        this.alive = true;
        this.invulnerable = false;
        this.invulnerableTime = 0;

        // Main weapon system (power chips)
        this.mainWeaponLevel = 0; // 0-5: progressive power-up stages
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

        this.initSubWeapon(0);
    }

    update() {
        if (!this.alive) return; // Don't update if dead

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

        // Movement
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

        // Main weapon pattern based on level (0-5)
        switch(this.mainWeaponLevel) {
            case 0: // Single shot, 2-shot burst
                bullets.push(new Bullet(this.x, this.y - this.size, 0, -8, true, 1));
                break;

            case 1: // Single shot, 3-shot burst
                bullets.push(new Bullet(this.x, this.y - this.size, 0, -8, true, 1));
                break;

            case 2: // 2 parallel, 2-shot burst
                bullets.push(new Bullet(this.x - 6, this.y - this.size, 0, -8, true, 1));
                bullets.push(new Bullet(this.x + 6, this.y - this.size, 0, -8, true, 1));
                break;

            case 3: // 2 parallel, 3-shot burst
                bullets.push(new Bullet(this.x - 6, this.y - this.size, 0, -8, true, 1));
                bullets.push(new Bullet(this.x + 6, this.y - this.size, 0, -8, true, 1));
                break;

            case 4: // 3 parallel, 2-shot burst
                bullets.push(new Bullet(this.x, this.y - this.size, 0, -8, true, 1));
                bullets.push(new Bullet(this.x - 10, this.y - this.size, 0, -8, true, 1));
                bullets.push(new Bullet(this.x + 10, this.y - this.size, 0, -8, true, 1));
                break;

            case 5: // 3 parallel, 3-shot burst (MAX)
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

        switch(this.subWeaponType) {
            case 0: // All-range (全方位弾)
                this.shootWeapon0();
                break;
            case 1: // Straight Crusher (貫通弾)
                this.shootWeapon1();
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
                this.shootWeapon6();
                break;
            case 7: // High Speed (高速速射弾)
                this.shootWeapon7();
                break;
        }

        // Consume ammo if applicable
        if (this.subWeaponAmmo > 0) {
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
        if (existingPenetrating) return; // Can't fire until current bullet is off screen

        // Slower speed
        let speed = 4 + this.subWeaponLevel;
        if (this.subWeaponLevel === 0) {
            bullets.push(new PenetratingBullet(this.x, this.y - this.size, 0, -speed, 8));
        } else if (this.subWeaponLevel === 1) {
            bullets.push(new PenetratingBullet(this.x - 6, this.y - this.size, 0, -speed, 8));
            bullets.push(new PenetratingBullet(this.x + 6, this.y - this.size, 0, -speed, 8));
        } else if (this.subWeaponLevel === 2) {
            bullets.push(new PenetratingBullet(this.x - 10, this.y - this.size, 0, -speed, 10));
            bullets.push(new PenetratingBullet(this.x + 10, this.y - this.size, 0, -speed, 10));
        } else {
            // Giant penetrating bullet
            bullets.push(new PenetratingBullet(this.x, this.y - this.size, 0, -speed, 20));
        }
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
        // Vibrating shot - remove existing and create new one
        for (let i = bullets.length - 1; i >= 0; i--) {
            if (bullets[i] instanceof VibratingBullet) {
                bullets.splice(i, 1);
            }
        }

        let size = 8 + this.subWeaponLevel * 4;
        bullets.push(new VibratingBullet(this.x, this.y - this.size, size, this.subWeaponDurability));
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
        bullets.push(new PlasmaBullet(this.x, this.y - this.size, 0, -2)); // Super slow speed
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

        if (this.subWeaponLevel < 3) {
            bullets.push(new PenetratingBullet(this.x, this.y - this.size, vx, vy, 6));
        } else {
            // Giant high-speed
            bullets.push(new PenetratingBullet(this.x, this.y - this.size, vx, vy, 16));
        }

        // Time only decreases while shooting
        if (this.subWeaponTime > 0) {
            this.subWeaponTime -= 2;
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
        // Power up main weapon
        if (this.mainWeaponLevel < 5) {
            this.mainWeaponLevel++;
        }

        // Visual feedback
        for (let i = 0; i < 10; i++) {
            particles.push(new Particle(this.x, this.y, 8, color(255, 255, 100)));
        }

        // Invincibility
        this.invulnerable = true;
        this.invulnerableTime = 60; // 1 second
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

        // Invincibility
        this.invulnerable = true;
        this.invulnerableTime = 300; // 5 seconds
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

            case 3: // Time-based (250 + 50 per level seconds)
                this.subWeaponAmmo = -1;
                this.subWeaponTime = (250 + level * 50) * 60; // Convert to frames (60 fps)
                this.subWeaponDurability = -1;
                this.subFireRate = 20;
                break;

            case 4: // Durability per shot (60 + 20 per level)
                this.subWeaponAmmo = -1;
                this.subWeaponTime = -1;
                this.subWeaponDurability = 60 + level * 20;
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
        if (this.invulnerable) return;

        this.lives--;
        if (this.lives <= 0) {
            this.alive = false;
            this.die();
        } else {
            // Invulnerability period
            this.invulnerable = true;
            this.invulnerableTime = 120; // 2 seconds

            // Lose main weapon level
            this.mainWeaponLevel = max(0, this.mainWeaponLevel - 1);

            // Lose sub weapon level
            this.subWeaponLevel = max(0, this.subWeaponLevel - 1);
            if (this.subWeaponLevel === 0) {
                this.resetToWeapon0();
            } else {
                this.initSubWeapon(this.subWeaponType);
            }

            // Visual feedback
            createExplosion(this.x, this.y, this.size);
        }
    }

    die() {
        createExplosion(this.x, this.y, this.size * 2);
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
