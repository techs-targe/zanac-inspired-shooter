class Bullet {
    constructor(x, y, vx, vy, isPlayerBullet = true, damage = 1, size = 4, bulletType = 'normal') {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.size = size;
        this.isPlayerBullet = isPlayerBullet;
        this.damage = damage;
        this.bulletType = bulletType; // 'normal', 'sig', 'lead'

        // Bullet HP system for enemy bullets
        if (!isPlayerBullet) {
            if (bulletType === 'sig') {
                this.hp = 2; // シグ：耐久力2
                this.maxHp = 2;
                this.destructible = true; // 破壊可能
            } else if (bulletType === 'lead') {
                this.hp = 999; // リード：基本破壊不能
                this.maxHp = 999;
                this.destructible = false; // 武器1,2,5のみ破壊可能
            } else {
                this.hp = 1;
                this.maxHp = 1;
                this.destructible = true;
            }
        }

        this.color = isPlayerBullet ? color(100, 255, 255) : color(255, 100, 100);
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
    }

    draw() {
        push();
        noStroke();

        if (this.isPlayerBullet) {
            // Player bullet - cyan/blue energy
            fill(100, 255, 255);
            ellipse(this.x, this.y, this.size, this.size * 2);

            fill(200, 255, 255, 150);
            ellipse(this.x, this.y, this.size * 0.5, this.size);

            // Glow effect
            fill(100, 255, 255, 50);
            ellipse(this.x, this.y, this.size * 2, this.size * 3);
        } else {
            // Enemy bullets - different appearance based on type
            if (this.bulletType === 'sig') {
                // シグ（ミサイル）- オレンジ色、ロケット型、破壊可能
                push();
                translate(this.x, this.y);

                // Calculate angle based on velocity for missile direction
                let angle = atan2(this.vy, this.vx);
                rotate(angle);

                // Missile body (elongated)
                fill(255, 150, 50);
                rectMode(CENTER);
                rect(0, 0, this.size * 2.5, this.size * 1.2);

                // Missile tip (pointed)
                fill(255, 100, 0);
                triangle(
                    this.size * 1.25, 0,
                    this.size * 0.4, -this.size * 0.6,
                    this.size * 0.4, this.size * 0.6
                );

                // Missile fins
                fill(255, 80, 0);
                triangle(
                    -this.size * 1.25, 0,
                    -this.size * 0.7, -this.size * 0.8,
                    -this.size * 0.7, 0
                );
                triangle(
                    -this.size * 1.25, 0,
                    -this.size * 0.7, this.size * 0.8,
                    -this.size * 0.7, 0
                );

                // Center highlight
                fill(255, 200, 100, 180);
                ellipse(0, 0, this.size * 0.8, this.size * 0.6);

                pop();

                // Glow effect (not rotated)
                fill(255, 150, 50, 80);
                ellipse(this.x, this.y, this.size * 3, this.size * 2);

                // HP indicator removed - not needed for gameplay clarity
            } else if (this.bulletType === 'lead') {
                // リード（しだれ弾）- 白い光、涙型/水滴型、基本破壊不能、目立つように
                push();
                translate(this.x, this.y);

                // Calculate angle based on velocity for teardrop direction
                let angle = atan2(this.vy, this.vx);
                rotate(angle);

                // Outer glow - bright white
                fill(255, 255, 255, 80);
                ellipse(0, 0, this.size * 2.5, this.size * 3);

                // Main body - teardrop shape (水滴型) - bright white
                fill(255, 255, 255);
                beginShape();
                // Rounded top
                for (let a = PI; a <= TWO_PI; a += 0.2) {
                    let r = this.size * 0.5;
                    vertex(cos(a) * r, sin(a) * r - this.size * 0.2);
                }
                // Pointed bottom
                vertex(0, this.size * 0.8);
                endShape(CLOSE);

                // Highlight on teardrop - very bright
                fill(255, 255, 255, 230);
                ellipse(-this.size * 0.15, -this.size * 0.3, this.size * 0.6, this.size * 0.6);

                // Bright core
                fill(255, 255, 255, 255);
                ellipse(0, 0, this.size * 0.4, this.size * 0.4);

                pop();

                // Trailing glow effect (not rotated) - bright white glow
                fill(255, 255, 255, 60);
                ellipse(this.x, this.y, this.size * 2, this.size * 2);
            } else {
                // Normal enemy bullet - red/orange energy
                fill(255, 100, 100);
                ellipse(this.x, this.y, this.size, this.size);

                fill(255, 200, 100, 150);
                ellipse(this.x, this.y, this.size * 0.6, this.size * 0.6);

                // Glow effect
                fill(255, 100, 100, 80);
                ellipse(this.x, this.y, this.size * 1.8, this.size * 1.8);
            }
        }

        pop();
    }

    isOffscreen() {
        return (
            this.x < -20 ||
            this.x > GAME_WIDTH + 20 ||
            this.y < -20 ||
            this.y > GAME_HEIGHT + 20
        );
    }

    hits(target) {
        let d = dist(this.x, this.y, target.x, target.y);
        let targetSize = target.hitboxSize !== undefined ? target.hitboxSize : target.size;
        return d < this.size + targetSize;
    }

    deflectFromBoss() {
        // Deflect bullet when hitting boss (for weapons 1, 4, 5)
        // Reverse velocity and add some random variation
        this.vx = -this.vx + random(-3, 3);
        this.vy = -this.vy + random(-3, 3);
    }
}

// Penetrating bullet (weapon 1, 7)
class PenetratingBullet extends Bullet {
    constructor(x, y, vx, vy, size = 8, damage = 2) {
        super(x, y, vx, vy, true, damage, size);
        this.penetrating = true;
    }

    update() {
        super.update();

        // Weapon 1 destroys enemy bullets on contact (INCLUDING LEAD bullets)
        if (this.isPlayerBullet && this.damage >= 2) { // Only weapon 1, not weapon 7
            for (let i = enemyBullets.length - 1; i >= 0; i--) {
                let d = dist(this.x, this.y, enemyBullets[i].x, enemyBullets[i].y);
                if (d < this.size + enemyBullets[i].size) {
                    let bullet = enemyBullets[i];
                    // Weapon 1 can destroy even LEAD bullets
                    if (bullet.bulletType === 'sig' || bullet.bulletType === 'lead' || bullet.destructible) {
                        bullet.hp -= this.damage;
                        if (bullet.hp <= 0) {
                            enemyBullets.splice(i, 1);
                        }
                    } else {
                        // Destroy normal bullets instantly
                        enemyBullets.splice(i, 1);
                    }
                }
            }
        }
    }

    draw() {
        push();
        noStroke();

        // Special rendering for LV30 laser beam
        if (this.isLaserBeam) {
            // Ultra-thin laser beam - vertical line
            let laserLength = 40; // Long laser trail

            // Outer glow
            stroke(100, 255, 255, 100);
            strokeWeight(this.size * 3);
            line(this.x, this.y, this.x, this.y + laserLength);

            // Middle glow
            stroke(150, 255, 255, 180);
            strokeWeight(this.size * 1.5);
            line(this.x, this.y, this.x, this.y + laserLength);

            // Core beam - bright white
            stroke(255, 255, 255);
            strokeWeight(this.size);
            line(this.x, this.y, this.x, this.y + laserLength);

            // Bright point at the tip
            noStroke();
            fill(255, 255, 255);
            ellipse(this.x, this.y, this.size * 2, this.size * 2);

            pop();
            return;
        }

        // Normal penetrating bullet rendering
        // Bright green/cyan penetrating beam
        fill(100, 255, 200);
        ellipse(this.x, this.y, this.size, this.size * 1.5);

        fill(200, 255, 255, 200);
        ellipse(this.x, this.y, this.size * 0.6, this.size);

        // Glow
        fill(100, 255, 200, 80);
        ellipse(this.x, this.y, this.size * 1.5, this.size * 2);

        pop();
    }
}

// Vibrating bullet (weapon 4)
class VibratingBullet extends Bullet {
    constructor(x, y, size, durability, weaponLevel = 0) {
        super(x, y, 0, -6, true, 2, size);
        this.durability = durability;
        this.maxDurability = durability;
        this.baseSize = size; // Store original size

        // Calculate vibration parameters based on weapon level
        // Lv0: 63px (31.5% screen), Lv4: 80px (40% screen), Lv5: 110px (55% screen)
        // Progressive scaling: ~+4-5px per level, Lv5 gets +30px bonus
        let vibrationAmount;
        if (weaponLevel === 0) {
            vibrationAmount = 63;
        } else if (weaponLevel === 1) {
            vibrationAmount = 67;
        } else if (weaponLevel === 2) {
            vibrationAmount = 71;
        } else if (weaponLevel === 3) {
            vibrationAmount = 76;
        } else if (weaponLevel === 4) {
            vibrationAmount = 80;
        } else {
            vibrationAmount = 110; // Lv5 and above - 55% screen coverage
        }

        this.vibrationAmount = vibrationAmount;
        // Decoupled speed formula: base 0.50 + small level scaling
        // Prevents excessive speed at large oscillations
        this.vibrationSpeed = 0.50 + (Math.min(weaponLevel, 5) * 0.02);

        this.time = 0;
        this.state = 'advancing'; // 'advancing' or 'oscillating'
        this.advanceDistance = 150; // Distance to travel before stopping
        this.startY = y;
        this.centerX = x; // Store center position for oscillation
        this.penetrating = true;
    }

    getCurrentSize() {
        // Size scales with durability (minimum 30% of original size)
        let ratio = this.durability / this.maxDurability;
        return this.baseSize * Math.max(0.3, ratio);
    }

    update() {
        this.time += this.vibrationSpeed;

        // If deflected from boss, just fly away
        if (this.state === 'deflected') {
            this.x += this.vx;
            this.y += this.vy;
            return; // Don't do any other processing
        }

        if (this.state === 'advancing') {
            // Move forward while oscillating
            this.x = this.centerX + sin(this.time) * this.vibrationAmount;
            // Clamp to screen boundaries with 10px margin
            this.x = constrain(this.x, 10, GAME_WIDTH - 10);
            this.y += this.vy;

            // Check if reached advance distance
            if (this.startY - this.y >= this.advanceDistance) {
                this.state = 'oscillating';
                this.vy = 0; // Stop vertical movement
            }
        } else if (this.state === 'oscillating') {
            // Oscillate in place
            this.x = this.centerX + sin(this.time) * this.vibrationAmount;
            // Clamp to screen boundaries with 10px margin
            this.x = constrain(this.x, 10, GAME_WIDTH - 10);
            // Y position stays the same
            // Durability only decreases when hitting enemies or bullets
        }

        // Update size based on durability
        this.size = this.getCurrentSize();

        // Check collision with enemy bullets (blocks bullets from air enemies)
        // Weapon 4 CANNOT destroy LEAD bullets
        for (let i = enemyBullets.length - 1; i >= 0; i--) {
            let d = dist(this.x, this.y, enemyBullets[i].x, enemyBullets[i].y);
            if (d < this.size) {
                let bullet = enemyBullets[i];
                // Can only destroy normal bullets and SIG, NOT LEAD
                if (bullet.bulletType !== 'lead') {
                    if (bullet.bulletType === 'sig') {
                        bullet.hp -= 2;
                        if (bullet.hp <= 0) {
                            enemyBullets.splice(i, 1);
                            // Reduce durability when destroying bullet
                            this.durability -= 1;
                        }
                    } else {
                        enemyBullets.splice(i, 1);
                        // Reduce durability when destroying bullet
                        this.durability -= 1;
                    }
                }
            }
        }

        // Check collision with enemies (damages enemies)
        for (let i = enemies.length - 1; i >= 0; i--) {
            let d = dist(this.x, this.y, enemies[i].x, enemies[i].y);
            if (d < this.size + enemies[i].size) {
                // If it's a boss, deflect immediately
                if (enemies[i].isBoss) {
                    this.deflectFromBoss();
                    return; // Stop processing this frame
                }
                enemies[i].hp -= 0.1; // Reduced damage as requested
                // Reduce durability when damaging enemy (every frame in contact)
                this.durability -= 0.5;
            }
        }

        // Check collision with ground enemies
        for (let i = groundEnemies.length - 1; i >= 0; i--) {
            let d = dist(this.x, this.y, groundEnemies[i].x, groundEnemies[i].y);
            if (d < this.size + groundEnemies[i].size) {
                groundEnemies[i].hp -= 0.1; // Reduced damage as requested
                // Reduce durability when damaging enemy (every frame in contact)
                this.durability -= 0.5;
            }
        }
    }

    deflectFromBoss() {
        // When hitting boss, fly away off screen
        this.state = 'deflected';
        this.vx = random(-10, 10);
        this.vy = random(-15, -10); // Fly upward fast
        this.durability = 0; // Deplete durability
    }

    onHit() {
        // Reduce durability when hitting enemies
        this.durability -= 1;
        return this.durability <= 0;
    }

    draw() {
        push();
        noStroke();

        // Orange vibrating energy
        fill(255, 150, 50);
        ellipse(this.x, this.y, this.size, this.size);

        fill(255, 200, 100, 200);
        ellipse(this.x, this.y, this.size * 0.7, this.size * 0.7);

        // Vibration trail
        for (let i = 1; i <= 3; i++) {
            let trailX = this.centerX + sin(this.time - i * 0.3) * this.vibrationAmount * 0.5;
            let trailY = this.y + (this.state === 'advancing' ? i * 5 : 0);
            fill(255, 150, 50, 100 / i);
            ellipse(trailX, trailY, this.size * (1 - i * 0.2), this.size * (1 - i * 0.2));
        }

        // Durability indicator
        if (this.state === 'oscillating') {
            fill(255, 255, 100);
            textSize(8);
            textAlign(CENTER);
            text(this.durability, this.x, this.y - this.size - 5);
        }

        pop();
    }

    isOffscreen() {
        // Remove if durability depleted
        if (this.durability <= 0) {
            return true;
        }
        // Remove if deflected and offscreen
        if (this.state === 'deflected') {
            return (
                this.x < -50 ||
                this.x > GAME_WIDTH + 50 ||
                this.y < -50 ||
                this.y > GAME_HEIGHT + 50
            );
        }
        // Don't remove while oscillating (unless durability is 0)
        if (this.state === 'oscillating') {
            return false;
        }
        return this.y < -20;
    }
}

// Boomerang bullet (weapon 5)
class BoomerangBullet extends Bullet {
    constructor(playerRef, level, xOffset = 0) {
        super(playerRef.x + xOffset, playerRef.y - playerRef.size, 0, -8, true, 3, 10 + level * 3);
        this.player = playerRef;
        this.level = level;
        this.xOffset = xOffset; // Horizontal offset from player (-offset for left, +offset for right)
        this.state = 'forward'; // 'forward' or 'returning'
        this.maxDistance = 150 + level * 50;
        this.startY = this.y;
        this.penetrating = true;
    }

    update() {
        // If deflected from boss, just fly away
        if (this.state === 'deflected') {
            this.x += this.vx;
            this.y += this.vy;
            return;
        }

        if (this.state === 'forward') {
            // Slower forward speed - starts slow, gets slower as it goes
            let distanceTraveled = this.startY - this.y;
            let speedMultiplier = map(distanceTraveled, 0, this.maxDistance, 1, 0.3);
            this.y += this.vy * speedMultiplier * 0.5; // Overall slower

            if (this.startY - this.y > this.maxDistance) {
                this.state = 'returning';
            }
        } else if (this.state === 'returning') {
            // Return to player - speed increases as it gets closer
            let dx = this.player.x + this.xOffset - this.x; // Target position with offset
            let dy = this.player.y - this.y;
            let dist = sqrt(dx * dx + dy * dy);

            if (dist > 5) {
                // Speed increases as it gets closer to player
                let baseSpeed = 4; // Slower base speed
                let speedMultiplier = map(dist, 200, 0, 0.5, 1.5);
                speedMultiplier = constrain(speedMultiplier, 0.5, 1.5);
                let speed = baseSpeed * speedMultiplier;

                this.vx = (dx / dist) * speed;
                this.vy = (dy / dist) * speed;
                this.x += this.vx;
                this.y += this.vy;
            } else {
                // Reached player, cycle back
                this.state = 'forward';
                this.y = this.player.y - this.player.size;
                this.x = this.player.x + this.xOffset; // Maintain offset position
                this.startY = this.y;
                this.vy = -4; // Slower initial speed
                this.vx = 0;
            }
        }

        // Weapon 5 destroys enemy bullets on contact (INCLUDING LEAD bullets)
        for (let i = enemyBullets.length - 1; i >= 0; i--) {
            let d = dist(this.x, this.y, enemyBullets[i].x, enemyBullets[i].y);
            if (d < this.size + enemyBullets[i].size) {
                let bullet = enemyBullets[i];
                // Weapon 5 can destroy even LEAD bullets
                if (bullet.bulletType === 'sig' || bullet.bulletType === 'lead' || bullet.destructible) {
                    bullet.hp -= this.damage;
                    if (bullet.hp <= 0) {
                        enemyBullets.splice(i, 1);
                    }
                } else {
                    // Destroy normal bullets instantly
                    enemyBullets.splice(i, 1);
                }
            }
        }
    }

    draw() {
        push();
        noStroke();

        // Purple/magenta boomerang
        fill(200, 100, 255);
        ellipse(this.x, this.y, this.size, this.size);

        fill(255, 150, 255, 200);
        ellipse(this.x, this.y, this.size * 0.7, this.size * 0.7);

        // Glow
        fill(200, 100, 255, 100);
        ellipse(this.x, this.y, this.size * 1.8, this.size * 1.8);

        // Trail based on state
        if (this.state === 'returning') {
            fill(200, 100, 255, 150);
            ellipse(this.x, this.y, this.size * 1.3, this.size * 1.3);
        }

        pop();
    }

    hits(target) {
        // Standard collision detection
        let d = dist(this.x, this.y, target.x, target.y);
        let targetSize = target.hitboxSize !== undefined ? target.hitboxSize : target.size;
        return d < this.size + targetSize;
    }

    deflectFromBoss() {
        // When hitting boss, get deflected off screen - don't return to player
        this.state = 'deflected'; // New state
        // Fly away from boss at high speed
        this.vx = random(-8, 8);
        this.vy = random(-12, -8); // Fly upward
    }

    isOffscreen() {
        // Remove if deflected and offscreen
        if (this.state === 'deflected') {
            return (
                this.x < -20 ||
                this.x > GAME_WIDTH + 20 ||
                this.y < -20 ||
                this.y > GAME_HEIGHT + 20
            );
        }
        // Never go offscreen when normal - always returns
        return false;
    }
}

// Straight Laser (weapon 5 - all levels)
class StraightLaserBullet extends Bullet {
    constructor(x, y, level) {
        super(x, y, 0, -30 - level * 5, true, 3 + level, 6 + level * 2); // Super high speed, thin
        this.level = level;
        this.laserLength = 50 + level * 10; // Thin laser
        this.penetrating = true;
    }

    update() {
        super.update();

        // Weapon 5 laser destroys enemy bullets on contact (INCLUDING LEAD bullets)
        for (let i = enemyBullets.length - 1; i >= 0; i--) {
            let d = dist(this.x, this.y, enemyBullets[i].x, enemyBullets[i].y);
            if (d < this.laserLength / 2 + enemyBullets[i].size) { // Use laser length for hitbox
                let bullet = enemyBullets[i];
                // Weapon 5 can destroy even LEAD bullets
                if (bullet.bulletType === 'sig' || bullet.bulletType === 'lead' || bullet.destructible) {
                    bullet.hp -= this.damage;
                    if (bullet.hp <= 0) {
                        enemyBullets.splice(i, 1);
                    }
                } else {
                    // Destroy normal bullets instantly
                    enemyBullets.splice(i, 1);
                }
            }
        }
    }

    draw() {
        push();

        // Intense laser beam - vertical
        noStroke();

        // Outer glow
        fill(255, 100, 255, 100);
        ellipse(this.x, this.y, this.size * 2.5, this.laserLength * 1.3);

        // Main laser beam
        fill(255, 150, 255);
        rect(this.x - this.size/2, this.y - this.laserLength/2, this.size, this.laserLength);

        // Core
        fill(255, 255, 255);
        rect(this.x - this.size/3, this.y - this.laserLength/2, this.size * 0.66, this.laserLength);

        // Center bright spot
        fill(255, 255, 255, 250);
        ellipse(this.x, this.y, this.size, this.size);

        // Sparkles
        if (frameCount % 2 === 0) {
            fill(255, 255, 255);
            for (let i = 0; i < 4; i++) {
                let sparkX = this.x + random(-this.size, this.size);
                let sparkY = this.y + random(-this.laserLength/2, this.laserLength/2);
                ellipse(sparkX, sparkY, 4);
            }
        }

        // Trail effect
        for (let i = 1; i <= 3; i++) {
            fill(255, 100, 255, 80 / i);
            ellipse(this.x, this.y + i * 15, this.size * (1.5 - i * 0.3), this.laserLength * 0.8);
        }

        pop();
    }

    hits(target) {
        // Extended hitbox for laser length
        let d = dist(this.x, this.y, target.x, target.y);
        let targetSize = target.hitboxSize !== undefined ? target.hitboxSize : target.size;
        return d < this.size + targetSize + this.laserLength / 2;
    }
}

// Plasma bullet (weapon 6) - damages all non-ground, non-boss enemies on contact
class PlasmaBullet extends Bullet {
    constructor(x, y, vx, vy, level = 0) {
        super(x, y, vx, vy, true, 3, 12); // Damage on contact
        this.penetrating = false; // Disappears on hit
        this.hasTriggered = false; // Track if AoE damage has been triggered
        this.level = level; // Store weapon level
        this.instantTrigger = (level >= 5); // Level 5+: trigger immediately on spawn
    }

    update() {
        // Level 5+: Instant trigger on first frame
        if (this.instantTrigger && !this.hasTriggered) {
            this.clearAllEnemyBullets();
            this.damageAllEnemies();
            this.shouldRemove = true;
            return;
        }

        super.update();

        // Check collision with enemy bullets - clear ALL enemy bullets and damage all enemies
        for (let i = enemyBullets.length - 1; i >= 0; i--) {
            let d = dist(this.x, this.y, enemyBullets[i].x, enemyBullets[i].y);
            if (d < this.size + enemyBullets[i].size) {
                // Clear ALL enemy bullets from screen
                this.clearAllEnemyBullets();
                // Trigger AoE damage to all enemies
                this.damageAllEnemies();
                // Mark this bullet for removal
                this.shouldRemove = true;
                return;
            }
        }
    }

    clearAllEnemyBullets() {
        // Clear all enemy bullets from the screen
        enemyBullets.length = 0;
    }

    damageAllEnemies() {
        // Prevent multiple triggers
        if (this.hasTriggered) return;
        this.hasTriggered = true;

        // Damage all air enemies
        for (let i = enemies.length - 1; i >= 0; i--) {
            if (enemies[i] && !enemies[i].isBoss && !enemies[i].markedForDeletion) {
                enemies[i].hp -= 5; // Decent damage to all air enemies
                if (enemies[i].hp < 0) enemies[i].hp = 0;
            }
        }

        // Level 3+: Also damage ground enemies
        if (this.level >= 3 && typeof groundEnemies !== 'undefined') {
            for (let i = groundEnemies.length - 1; i >= 0; i--) {
                if (groundEnemies[i] && !groundEnemies[i].isBoss) {
                    groundEnemies[i].hp -= 5; // Same damage to ground enemies
                    if (groundEnemies[i].hp < 0) groundEnemies[i].hp = 0;
                }
            }
        }
    }

    // Legacy method name for compatibility
    damageAllAirEnemies() {
        this.damageAllEnemies();
    }

    hits(target) {
        // Don't hit bosses
        if (target.isBoss) {
            return false;
        }

        // Level 0-2: Only hit air enemies
        // Level 3+: Hit both air and ground enemies
        if (target.isGround && this.level < 3) {
            return false; // Don't hit ground enemies at low levels
        }

        // Normal hit detection
        let d = dist(this.x, this.y, target.x, target.y);
        let targetSize = target.hitboxSize !== undefined ? target.hitboxSize : target.size;
        let doesHit = d < this.size + targetSize;

        // If hitting an enemy, trigger AoE damage and clear all enemy bullets
        if (doesHit && !this.hasTriggered) {
            this.clearAllEnemyBullets();
            this.damageAllEnemies();
        }

        return doesHit;
    }

    draw() {
        push();
        noStroke();

        // Pink/white plasma energy
        fill(255, 100, 255);
        ellipse(this.x, this.y, this.size, this.size);

        fill(255, 255, 255, 200);
        ellipse(this.x, this.y, this.size * 0.6, this.size * 0.6);

        // Sparkle effect
        if (frameCount % 2 === 0) {
            fill(255, 255, 255);
            for (let i = 0; i < 3; i++) {
                ellipse(this.x + random(-5, 5), this.y + random(-5, 5), 3);
            }
        }

        // Pulsing glow
        fill(255, 100, 255, 50 + sin(frameCount * 0.2) * 30);
        ellipse(this.x, this.y, this.size * 2, this.size * 2);

        pop();
    }
}

// Barrier weapon (weapon 2)
class BarrierWeapon {
    constructor(playerRef, level, durability) {
        this.player = playerRef;
        this.level = level;
        this.durability = durability;
        this.maxDurability = durability;
        this.radius = (level === 0) ? 30 : (25 + level * 8);
        this.angle = 0;
        this.timeDecayCounter = 0; // Counter for time-based decay

        // Level-based coverage configuration
        this.coverageConfig = this.getCoverageConfig(level);
    }

    getCoverageConfig(level) {
        switch(level) {
            case 0:
                // LV0: Front only (slightly narrower angle, but bigger radius)
                return {
                    startAngle: -PI/2 - PI/15, // -90° - 12°
                    endAngle: -PI/2 + PI/15,   // -90° + 12°
                    segments: 1
                };
            case 1:
                // LV1: Front only (single segment at 0 degrees = -90 degrees in p5.js)
                return {
                    startAngle: -PI/2 - PI/12, // -90° - 15°
                    endAngle: -PI/2 + PI/12,   // -90° + 15°
                    segments: 1
                };
            case 2:
                // LV2: Front 2 segments
                return {
                    startAngle: -PI/2 - PI/6,  // -90° - 30°
                    endAngle: -PI/2 + PI/6,    // -90° + 30°
                    segments: 2
                };
            case 3:
                // LV3: Front 180 degrees
                return {
                    startAngle: -PI,           // -180°
                    endAngle: 0,               // 0°
                    segments: 6
                };
            case 4:
                // LV4: Front 270 degrees
                return {
                    startAngle: -PI * 1.25,    // -225°
                    endAngle: PI/4,            // 45°
                    segments: 9
                };
            default:
                // LV5+: Full 360 degrees
                return {
                    startAngle: 0,
                    endAngle: TWO_PI,
                    segments: 12
                };
        }
    }

    update() {
        // Fixed barrier - no rotation
        // this.angle += 0.05;

        // Time-based durability decay: 1 per ~1.67 seconds (100 frames) - 30% of original speed
        // Stops decaying when durability reaches 1 (only enemy bullets/contact can reduce further)
        this.timeDecayCounter++;
        if (this.durability > 1 && this.timeDecayCounter >= 100) {
            this.durability -= 1;
            if (this.durability < 1) this.durability = 1;
            this.player.subWeaponDurability = this.durability;
            this.timeDecayCounter = 0;
        }

        // Check collision with enemy bullets (INCLUDING LEAD bullets)
        for (let i = enemyBullets.length - 1; i >= 0; i--) {
            let d = dist(this.player.x, this.player.y, enemyBullets[i].x, enemyBullets[i].y);
            if (d < this.radius) {
                // Check if bullet is within barrier coverage angle
                let bulletAngle = atan2(enemyBullets[i].y - this.player.y, enemyBullets[i].x - this.player.x);
                if (this.isAngleInCoverage(bulletAngle)) {
                    let bullet = enemyBullets[i];
                    // Weapon 2 can destroy even LEAD bullets
                    if (bullet.bulletType === 'sig' || bullet.bulletType === 'lead' || bullet.destructible) {
                        bullet.hp -= 3; // Barrier does 3 damage
                        if (bullet.hp <= 0) {
                            enemyBullets.splice(i, 1);
                        }
                    } else {
                        // Destroy normal bullets instantly
                        enemyBullets.splice(i, 1);
                    }
                    this.durability--;
                    if (this.durability < 0) this.durability = 0;
                    this.player.subWeaponDurability = this.durability;
                }
            }
        }

        // Check collision with all enemies (air enemies) - NO DAMAGE to enemies (ramming would be OP)
        // Barrier only protects player, durability decreases on contact
        for (let i = enemies.length - 1; i >= 0; i--) {
            // Skip if marked for deletion
            if (enemies[i].markedForDeletion) continue;

            let d = dist(this.player.x, this.player.y, enemies[i].x, enemies[i].y);
            if (d < this.radius + enemies[i].size) {
                // Check if enemy is within barrier coverage angle
                let enemyAngle = atan2(enemies[i].y - this.player.y, enemies[i].x - this.player.x);
                if (this.isAngleInCoverage(enemyAngle)) {
                    // Durability decreases but enemy takes NO damage
                    this.durability -= 0.3;
                    if (this.durability < 0) this.durability = 0;
                    this.player.subWeaponDurability = this.durability;
                }
            }
        }

        // Ground enemies: Barrier passes through without any interaction
        // No damage to ground enemies, no durability loss
    }

    isAngleInCoverage(angle) {
        // Normalize angle to -PI to PI range
        while (angle > PI) angle -= TWO_PI;
        while (angle < -PI) angle += TWO_PI;

        let start = this.coverageConfig.startAngle;
        let end = this.coverageConfig.endAngle;

        // Handle wrap-around for 360 degree coverage
        if (this.level >= 5) {
            return true; // Full coverage
        }

        // Normalize start and end angles
        while (start > PI) start -= TWO_PI;
        while (start < -PI) start += TWO_PI;
        while (end > PI) end -= TWO_PI;
        while (end < -PI) end += TWO_PI;

        // Check if angle is within range
        if (start <= end) {
            return angle >= start && angle <= end;
        } else {
            // Wrap-around case
            return angle >= start || angle <= end;
        }
    }

    draw() {
        push();

        // Barrier shield
        noFill();
        stroke(100, 200, 255, 150);
        strokeWeight(3);

        // Draw segments only within coverage range
        let segments = this.coverageConfig.segments;
        let startAngle = this.coverageConfig.startAngle;
        let endAngle = this.coverageConfig.endAngle;
        let angleRange = this.level >= 5 ? TWO_PI : (endAngle - startAngle);

        // Adjust for wrap-around
        if (this.level < 5 && endAngle < startAngle) {
            angleRange = TWO_PI - (startAngle - endAngle);
        }

        for (let i = 0; i < segments; i++) {
            let a = startAngle + (i / segments) * angleRange + this.angle;
            let x1 = this.player.x + cos(a) * this.radius;
            let y1 = this.player.y + sin(a) * this.radius;
            let a2 = a + angleRange / segments;
            let x2 = this.player.x + cos(a2) * this.radius;
            let y2 = this.player.y + sin(a2) * this.radius;

            line(x1, y1, x2, y2);
        }

        // Inner glow (arc for partial coverage, full circle for 360)
        noStroke();
        fill(100, 200, 255, 30);
        if (this.level >= 5) {
            ellipse(this.player.x, this.player.y, this.radius * 2, this.radius * 2);
        } else {
            // Draw arc for partial coverage
            arc(this.player.x, this.player.y, this.radius * 2, this.radius * 2,
                startAngle, endAngle, PIE);
        }

        // Durability indicator
        if (this.maxDurability > 0) {
            let durabilityPercent = this.durability / this.maxDurability;
            fill(255, 255 * durabilityPercent, 0);
            textSize(10);
            textAlign(CENTER);
            text(Math.floor(this.durability), this.player.x, this.player.y + this.radius + 10);
        }

        pop();
    }

    isDead() {
        return this.durability <= 0;
    }
}

// Rotating weapon (weapon 3)
class RotatingWeapon {
    constructor(playerRef, level) {
        this.player = playerRef;
        this.level = level;
        this.angle = 0;

        // Level-based configuration
        this.config = this.getConfigForLevel(level);
        this.rotationSpeed = this.config.rotationSpeed;
        this.radius = this.config.radius;
        this.numBullets = this.config.numBullets;
    }

    getConfigForLevel(level) {
        switch(level) {
            case 0:
            case 1:
                // LV1: Single bullet (speed +30%)
                return {
                    numBullets: 1,
                    radius: 50,
                    rotationSpeed: 0.195  // 0.15 * 1.3
                };
            case 2:
                // LV2: 2 bullets (double) (speed +30%)
                return {
                    numBullets: 2,
                    radius: 50,
                    rotationSpeed: 0.195  // 0.15 * 1.3
                };
            case 3:
                // LV3: 2 bullets wide (speed +30%)
                return {
                    numBullets: 2,
                    radius: 70,  // Wider radius
                    rotationSpeed: 0.195  // 0.15 * 1.3
                };
            case 4:
                // LV4: 2 bullets wide + faster rotation (speed +30%)
                return {
                    numBullets: 2,
                    radius: 70,
                    rotationSpeed: 0.286  // 0.22 * 1.3
                };
            default:
                // LV5+: 3 bullets wide + 2× speed
                return {
                    numBullets: 3,
                    radius: 70,
                    rotationSpeed: 0.44  // 0.22 * 2 (double the base LV4 speed)
                };
        }
    }

    update() {
        this.angle += this.rotationSpeed;

        // Check collision with enemy bullets
        // Weapon 3 CANNOT destroy LEAD bullets
        for (let i = enemyBullets.length - 1; i >= 0; i--) {
            for (let j = 0; j < this.numBullets; j++) {
                let a = this.angle + (j / this.numBullets) * TWO_PI;
                let bx = this.player.x + cos(a) * this.radius;
                let by = this.player.y + sin(a) * this.radius;
                let d = dist(bx, by, enemyBullets[i].x, enemyBullets[i].y);
                if (d < 12) {
                    let bullet = enemyBullets[i];
                    // Can only destroy normal bullets and SIG, NOT LEAD
                    if (bullet.bulletType !== 'lead') {
                        if (bullet.bulletType === 'sig') {
                            bullet.hp -= 2;
                            if (bullet.hp <= 0) {
                                enemyBullets.splice(i, 1);
                            }
                        } else {
                            enemyBullets.splice(i, 1);
                        }
                        break;
                    }
                }
            }
        }

        // Check collision with enemies - DAMAGE THEM
        for (let i = enemies.length - 1; i >= 0; i--) {
            // Skip if marked for deletion
            if (enemies[i].markedForDeletion) continue;

            for (let j = 0; j < this.numBullets; j++) {
                let a = this.angle + (j / this.numBullets) * TWO_PI;
                let bx = this.player.x + cos(a) * this.radius;
                let by = this.player.y + sin(a) * this.radius;
                let d = dist(bx, by, enemies[i].x, enemies[i].y);
                if (d < 15 + enemies[i].size) {
                    // If it's a boss, deflect and deactivate weapon
                    if (enemies[i].isBoss) {
                        this.deflectFromBoss();
                        return; // Stop processing this weapon
                    }
                    // DAMAGE ENEMY - but don't go below 0
                    if (enemies[i].hp > 0 && !enemies[i].markedForDeletion) {
                        enemies[i].hp -= 3.0;
                        if (enemies[i].hp < 0) enemies[i].hp = 0;
                    }
                    break;
                }
            }
        }

        // Check collision with ground enemies - DAMAGE THEM
        for (let i = groundEnemies.length - 1; i >= 0; i--) {
            // Skip if marked for deletion
            if (groundEnemies[i].markedForDeletion) continue;

            for (let j = 0; j < this.numBullets; j++) {
                let a = this.angle + (j / this.numBullets) * TWO_PI;
                let bx = this.player.x + cos(a) * this.radius;
                let by = this.player.y + sin(a) * this.radius;
                let d = dist(bx, by, groundEnemies[i].x, groundEnemies[i].y);
                if (d < 15 + groundEnemies[i].size) {
                    // DAMAGE GROUND ENEMY - but don't go below 0
                    if (groundEnemies[i].hp > 0 && !groundEnemies[i].markedForDeletion) {
                        groundEnemies[i].hp -= 3.0;
                        if (groundEnemies[i].hp < 0) groundEnemies[i].hp = 0;
                    }
                    break;
                }
            }
        }
    }

    draw() {
        push();

        for (let i = 0; i < this.numBullets; i++) {
            let a = this.angle + (i / this.numBullets) * TWO_PI;
            let x = this.player.x + cos(a) * this.radius;
            let y = this.player.y + sin(a) * this.radius;

            // Yellow rotating orbs
            noStroke();
            fill(255, 255, 100);
            ellipse(x, y, 12, 12);

            fill(255, 255, 200, 200);
            ellipse(x, y, 8, 8);

            // Glow
            fill(255, 255, 100, 80);
            ellipse(x, y, 18, 18);

            // Trail
            fill(255, 255, 100, 50);
            let prevA = a - 0.2;
            let px = this.player.x + cos(prevA) * this.radius;
            let py = this.player.y + sin(prevA) * this.radius;
            line(x, y, px, py);
        }

        pop();
    }

    deflectFromBoss() {
        // When hitting boss, create explosion effect and deactivate weapon
        createExplosion(this.player.x, this.player.y, 30);
        // Deactivate weapon by setting player's subWeaponActive to null
        this.player.subWeaponActive = null;
        // Reset to cooldown so player can re-activate immediately by pressing Z
        this.player.subFireCooldown = 0;
    }

    isDead() {
        return false; // Time-based, managed by player
    }
}
