class Enemy {
    constructor(type, x, y, difficultyMultiplier = 1.0) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.size = 10;
        this.hp = 1;
        this.scoreValue = 10;
        this.canShoot = false;
        this.shootInterval = 60;
        this.speed = 2;
        this.angle = 0;
        this.timeAlive = 0;
        this.difficultyMultiplier = difficultyMultiplier;

        this.initType();
    }

    initType() {
        switch(this.type) {
            case 'basic':
                // Simple enemy that moves down
                this.size = 10;
                this.hp = 1;
                this.maxHp = 1;
                this.speed = 2 * this.difficultyMultiplier;
                this.scoreValue = 10;
                this.color = color(255, 100, 100);
                this.canShoot = false;
                break;

            case 'shooter':
                // Enemy that shoots
                this.size = 12;
                this.hp = 2;
                this.maxHp = 2;
                this.speed = 1.5 * this.difficultyMultiplier;
                this.scoreValue = 30;
                this.color = color(255, 150, 50);
                this.canShoot = true;
                this.shootInterval = int(50 / this.difficultyMultiplier);
                break;

            case 'weaver':
                // Weaves left and right
                this.size = 11;
                this.hp = 2;
                this.maxHp = 2;
                this.speed = 2.5 * this.difficultyMultiplier;
                this.scoreValue = 40;
                this.color = color(150, 100, 255);
                this.canShoot = false;
                break;

            case 'tank':
                // Slow but tough
                this.size = 16;
                this.hp = int(5 * this.difficultyMultiplier);
                this.maxHp = this.hp;
                this.speed = 1 * this.difficultyMultiplier;
                this.scoreValue = 100;
                this.color = color(255, 50, 50);
                this.canShoot = true;
                this.shootInterval = int(40 / this.difficultyMultiplier);
                break;

            case 'fast':
                // Fast moving enemy
                this.size = 8;
                this.hp = 1;
                this.maxHp = 1;
                this.speed = 4 * this.difficultyMultiplier;
                this.scoreValue = 50;
                this.color = color(100, 255, 100);
                this.canShoot = false;
                break;

            case 'spiral':
                // Moves in spiral pattern
                this.size = 10;
                this.hp = 2;
                this.maxHp = 2;
                this.speed = 1.5 * this.difficultyMultiplier;
                this.scoreValue = 60;
                this.color = color(255, 100, 255);
                this.canShoot = true;
                this.shootInterval = int(45 / this.difficultyMultiplier);
                break;

            case 'bomber':
                // Shoots bullet spreads
                this.size = 14;
                this.hp = int(3 * this.difficultyMultiplier);
                this.maxHp = this.hp;
                this.speed = 1.2 * this.difficultyMultiplier;
                this.scoreValue = 80;
                this.color = color(255, 200, 50);
                this.canShoot = true;
                this.shootInterval = int(70 / this.difficultyMultiplier);
                break;

            case 'charger':
                // Rushes towards player
                this.size = 12;
                this.hp = 2;
                this.maxHp = 2;
                this.speed = 1 * this.difficultyMultiplier;
                this.scoreValue = 70;
                this.color = color(255, 50, 150);
                this.canShoot = false;
                this.chargeSpeed = 6 * this.difficultyMultiplier;
                this.chargeDelay = 90; // Frames before charging
                this.isCharging = false;
                break;

            case 'tracker':
                // Follows player's horizontal position
                this.size = 10;
                this.hp = 2;
                this.maxHp = 2;
                this.speed = 1.8 * this.difficultyMultiplier;
                this.scoreValue = 55;
                this.color = color(100, 255, 255);
                this.canShoot = true;
                this.shootInterval = int(60 / this.difficultyMultiplier);
                this.trackingSpeed = 2.5 * this.difficultyMultiplier;
                break;

            case 'bouncer':
                // Bounces off screen edges
                this.size = 11;
                this.hp = 2;
                this.maxHp = 2;
                this.speed = 2 * this.difficultyMultiplier;
                this.scoreValue = 65;
                this.color = color(255, 150, 255);
                this.canShoot = false;
                this.vx = random(-2, 2) * this.difficultyMultiplier;
                this.vy = this.speed;
                break;

            case 'divider':
                // Splits into smaller enemies when destroyed
                this.size = 15;
                this.hp = int(4 * this.difficultyMultiplier);
                this.maxHp = this.hp;
                this.speed = 1.5 * this.difficultyMultiplier;
                this.scoreValue = 120;
                this.color = color(150, 255, 150);
                this.canShoot = true;
                this.shootInterval = int(55 / this.difficultyMultiplier);
                this.canDivide = true;
                break;

            case 'spawner':
                // Spawns smaller enemies
                this.size = 16;
                this.hp = int(5 * this.difficultyMultiplier);
                this.maxHp = this.hp;
                this.speed = 0.8 * this.difficultyMultiplier;
                this.scoreValue = 150;
                this.color = color(200, 100, 200);
                this.canShoot = false;
                this.spawnInterval = 150;
                this.lastSpawn = 0;
                break;
        }
    }

    update() {
        this.timeAlive++;

        // Handle custom velocity (for split enemies)
        if (this.usesCustomVelocity) {
            this.x += this.vx;
            this.y += this.vy;
            return;
        }

        switch(this.type) {
            case 'basic':
                this.y += this.speed;
                break;

            case 'shooter':
                this.y += this.speed;
                // Slight horizontal wobble
                this.x += sin(this.timeAlive * 0.1) * 0.5;
                break;

            case 'weaver':
                this.y += this.speed;
                this.x += sin(this.timeAlive * 0.08) * 3;
                break;

            case 'tank':
                this.y += this.speed;
                break;

            case 'fast':
                this.y += this.speed;
                // Erratic movement
                this.x += cos(this.timeAlive * 0.15) * 2;
                break;

            case 'spiral':
                this.angle += 0.1;
                this.x += cos(this.angle) * 2;
                this.y += this.speed;
                break;

            case 'bomber':
                this.y += this.speed;
                this.x += sin(this.timeAlive * 0.05) * 1;
                break;

            case 'charger':
                if (!this.isCharging && this.timeAlive < this.chargeDelay) {
                    // Normal descent before charging
                    this.y += this.speed;
                } else if (!this.isCharging) {
                    // Start charging towards player
                    this.isCharging = true;
                    if (player && player.alive) {
                        let dx = player.x - this.x;
                        let dy = player.y - this.y;
                        let dist = sqrt(dx * dx + dy * dy);
                        this.vx = (dx / dist) * this.chargeSpeed;
                        this.vy = (dy / dist) * this.chargeSpeed;
                    }
                }
                if (this.isCharging) {
                    // Continue charging
                    this.x += this.vx;
                    this.y += this.vy;
                }
                break;

            case 'tracker':
                this.y += this.speed;
                // Track player's horizontal position
                if (player && player.alive) {
                    let dx = player.x - this.x;
                    if (abs(dx) > 5) {
                        this.x += dx > 0 ? this.trackingSpeed : -this.trackingSpeed;
                    }
                }
                break;

            case 'bouncer':
                this.x += this.vx;
                this.y += this.vy;
                // Bounce off edges
                if (this.x < this.size || this.x > GAME_WIDTH - this.size) {
                    this.vx *= -1;
                }
                if (this.y < this.size) {
                    this.vy *= -1;
                }
                break;

            case 'divider':
                this.y += this.speed;
                this.x += sin(this.timeAlive * 0.07) * 1.5;
                break;

            case 'spawner':
                this.y += this.speed;
                this.lastSpawn++;
                // Spawn small enemies periodically
                if (this.lastSpawn >= this.spawnInterval && this.y > 0 && this.y < GAME_HEIGHT - 50) {
                    this.spawnMinion();
                    this.lastSpawn = 0;
                }
                break;
        }
    }

    shoot() {
        if (!this.canShoot) return;

        // Calculate direction to player
        let dx = player.x - this.x;
        let dy = player.y - this.y;
        let angle = atan2(dy, dx);
        let speed = 3; // Reduced from 4 to 3 (75% speed)

        switch(this.type) {
            case 'shooter':
                // Single aimed shot
                enemyBullets.push(new Bullet(
                    this.x,
                    this.y,
                    cos(angle) * speed,
                    sin(angle) * speed,
                    false,
                    1
                ));
                break;

            case 'tank':
                // Triple shot spread
                for (let i = -1; i <= 1; i++) {
                    let spreadAngle = angle + i * 0.3;
                    enemyBullets.push(new Bullet(
                        this.x,
                        this.y,
                        cos(spreadAngle) * speed,
                        sin(spreadAngle) * speed,
                        false,
                        1
                    ));
                }
                break;

            case 'spiral':
                // Rotating shot
                let spiralAngle = this.angle;
                enemyBullets.push(new Bullet(
                    this.x,
                    this.y,
                    cos(spiralAngle) * speed,
                    sin(spiralAngle) * speed,
                    false,
                    1
                ));
                break;

            case 'bomber':
                // 5-way spread
                for (let i = 0; i < 5; i++) {
                    let bombAngle = angle - 0.6 + i * 0.3;
                    enemyBullets.push(new Bullet(
                        this.x,
                        this.y,
                        cos(bombAngle) * speed,
                        sin(bombAngle) * speed,
                        false,
                        1
                    ));
                }
                break;

            case 'tracker':
                // Aimed shot
                enemyBullets.push(new Bullet(
                    this.x,
                    this.y,
                    cos(angle) * speed,
                    sin(angle) * speed,
                    false,
                    1
                ));
                break;

            case 'divider':
                // Double shot
                for (let i = -1; i <= 1; i += 2) {
                    let spreadAngle = angle + i * 0.2;
                    enemyBullets.push(new Bullet(
                        this.x,
                        this.y,
                        cos(spreadAngle) * speed,
                        sin(spreadAngle) * speed,
                        false,
                        1
                    ));
                }
                break;
        }
    }

    spawnMinion() {
        // Spawner creates small basic enemies
        if (typeof enemies !== 'undefined') {
            for (let i = 0; i < 2; i++) {
                let offsetX = (i === 0 ? -1 : 1) * this.size;
                let minion = new Enemy('fast', this.x + offsetX, this.y, this.difficultyMultiplier * 0.7);
                minion.size *= 0.7; // Smaller minions
                minion.hp = 1;
                minion.scoreValue = 15;
                enemies.push(minion);
            }
        }
    }

    onDestroyed() {
        // Special behavior when divider is destroyed
        if (this.type === 'divider' && this.canDivide && typeof enemies !== 'undefined') {
            // Split into 3 smaller enemies
            for (let i = 0; i < 3; i++) {
                let angle = (i / 3) * TWO_PI;
                let splitEnemy = new Enemy('basic', this.x, this.y, this.difficultyMultiplier * 0.6);
                splitEnemy.size *= 0.6;
                splitEnemy.hp = 1;
                splitEnemy.scoreValue = 20;
                splitEnemy.vx = cos(angle) * 3;
                splitEnemy.vy = sin(angle) * 3;
                splitEnemy.usesCustomVelocity = true; // Flag to use vx/vy in update
                enemies.push(splitEnemy);
            }
        }
    }

    draw() {
        push();
        noStroke();

        // Main body
        fill(this.color);

        if (this.type === 'tank') {
            // Tank - square shape
            rectMode(CENTER);
            rect(this.x, this.y, this.size * 1.5, this.size * 1.5);
            fill(red(this.color) * 0.7, green(this.color) * 0.7, blue(this.color) * 0.7);
            rect(this.x, this.y, this.size, this.size);
        } else if (this.type === 'spiral') {
            // Spiral - rotating triangle
            push();
            translate(this.x, this.y);
            rotate(this.angle);
            triangle(0, -this.size, -this.size, this.size, this.size, this.size);
            pop();
        } else if (this.type === 'charger') {
            // Charger - pointed arrow shape
            push();
            translate(this.x, this.y);
            if (this.isCharging) {
                rotate(atan2(this.vy, this.vx) + PI/2);
                // Charging warning flash
                if (frameCount % 4 < 2) {
                    fill(255, 255, 100);
                }
            }
            triangle(0, -this.size * 1.5, -this.size, this.size, this.size, this.size);
            pop();
        } else if (this.type === 'tracker') {
            // Tracker - crosshair style
            ellipse(this.x, this.y, this.size * 2, this.size * 1.5);
            stroke(this.color);
            strokeWeight(2);
            line(this.x - this.size, this.y, this.x + this.size, this.y);
            line(this.x, this.y - this.size, this.x, this.y + this.size);
            noStroke();
            fill(255, 255, 255, 150);
            ellipse(this.x, this.y, this.size * 0.5, this.size * 0.5);
        } else if (this.type === 'bouncer') {
            // Bouncer - diamond shape
            push();
            translate(this.x, this.y);
            rotate(this.timeAlive * 0.1);
            quad(0, -this.size, this.size, 0, 0, this.size, -this.size, 0);
            pop();
        } else if (this.type === 'divider') {
            // Divider - segmented circle
            ellipse(this.x, this.y, this.size * 2, this.size * 2);
            stroke(red(this.color) * 0.5, green(this.color) * 0.5, blue(this.color) * 0.5);
            strokeWeight(2);
            for (let i = 0; i < 3; i++) {
                let angle = (i / 3) * TWO_PI;
                let x1 = this.x + cos(angle) * this.size * 0.5;
                let y1 = this.y + sin(angle) * this.size * 0.5;
                let x2 = this.x + cos(angle) * this.size;
                let y2 = this.y + sin(angle) * this.size;
                line(x1, y1, x2, y2);
            }
            noStroke();
            fill(255, 255, 255, 150);
            ellipse(this.x, this.y, this.size, this.size);
        } else if (this.type === 'spawner') {
            // Spawner - hexagon with pulsing core
            push();
            translate(this.x, this.y);
            rotate(this.timeAlive * 0.05);
            beginShape();
            for (let i = 0; i < 6; i++) {
                let angle = (i / 6) * TWO_PI;
                vertex(cos(angle) * this.size, sin(angle) * this.size);
            }
            endShape(CLOSE);
            pop();
            // Pulsing core
            let pulse = sin(this.timeAlive * 0.1) * 0.3 + 0.7;
            fill(255, 255, 255, 150 * pulse);
            ellipse(this.x, this.y, this.size * pulse, this.size * pulse);
        } else {
            // Most enemies - ellipse
            ellipse(this.x, this.y, this.size * 2, this.size * 1.5);

            // Core
            fill(255, 255, 255, 150);
            ellipse(this.x, this.y, this.size, this.size * 0.8);
        }

        // Glow effect
        fill(red(this.color), green(this.color), blue(this.color), 50);
        ellipse(this.x, this.y, this.size * 2.5, this.size * 2.5);

        // HP bar for all enemies
        let maxHp = this.hp; // Approximate max HP based on type
        switch(this.type) {
            case 'basic': maxHp = 1; break;
            case 'shooter': maxHp = 2; break;
            case 'weaver': maxHp = 2; break;
            case 'tank': maxHp = 5 * this.difficultyMultiplier; break;
            case 'fast': maxHp = 1; break;
            case 'spiral': maxHp = 2; break;
            case 'bomber': maxHp = 3 * this.difficultyMultiplier; break;
            case 'charger': maxHp = 2; break;
            case 'tracker': maxHp = 2; break;
            case 'bouncer': maxHp = 2; break;
            case 'divider': maxHp = 4 * this.difficultyMultiplier; break;
            case 'spawner': maxHp = 5 * this.difficultyMultiplier; break;
        }

        // Store initial HP if not set
        if (!this.maxHp) this.maxHp = maxHp;

        // Draw HP bar
        if (this.hp > 0 && this.maxHp > 0) {
            fill(255, 100, 100);
            rectMode(CENTER);
            rect(this.x, this.y - this.size - 5, this.size * 1.5, 3);

            fill(100, 255, 100);
            let hpWidth = map(this.hp, 0, this.maxHp, 0, this.size * 1.5);
            rect(this.x - (this.size * 1.5 - hpWidth) / 2, this.y - this.size - 5, hpWidth, 3);
        }

        pop();
    }

    isOffscreen() {
        return (
            this.x < -50 ||
            this.x > GAME_WIDTH + 50 ||
            this.y > GAME_HEIGHT + 50
        );
    }
}

// Ground Enemy (Turret/Core)
class GroundEnemy {
    constructor(x, y, type = 'turret', level = 1, targetY = GAME_HEIGHT - 60) {
        this.x = x;
        this.y = y;
        this.targetY = targetY; // Position where it should stop
        this.type = type;
        this.level = level;
        this.size = 15;
        this.hp = 3 + level * 2;
        this.maxHp = this.hp;
        this.scoreValue = 50 + level * 30;
        this.canShoot = true;
        this.shootInterval = 80 - level * 5;
        this.angle = 0;
        this.targetAngle = 0;
        this.isGround = true; // Flag to identify ground enemies

        // Scrolling behavior
        this.state = 'scrolling'; // 'scrolling' or 'stationary'
        this.scrollSpeed = 1.5; // Speed when scrolling down

        // Visual properties
        this.baseColor = type === 'core' ? color(255, 50, 50) : color(150, 150, 200);
    }

    update() {
        // Always scroll down slowly - never stop
        this.y += this.scrollSpeed;

        // Track player for aiming while scrolling
        if (player && player.alive && this.y > 0 && this.y < GAME_HEIGHT) {
            this.targetAngle = atan2(player.y - this.y, player.x - this.x);
            // Smooth rotation
            let angleDiff = this.targetAngle - this.angle;
            // Normalize angle difference
            while (angleDiff > PI) angleDiff -= TWO_PI;
            while (angleDiff < -PI) angleDiff += TWO_PI;
            this.angle += angleDiff * 0.1;
        }
    }

    shoot() {
        // Shoot while scrolling (if on screen)
        if (!this.canShoot || !player || !player.alive) return;
        if (this.y < 0 || this.y > GAME_HEIGHT) return; // Don't shoot if offscreen

        // Aim towards player
        let speed = 3.75; // Reduced from 5 to 3.75 (75% speed)
        let vx = cos(this.angle) * speed;
        let vy = sin(this.angle) * speed;

        if (this.type === 'core') {
            // Core shoots triple spread
            for (let i = -1; i <= 1; i++) {
                let spreadAngle = this.angle + i * 0.3;
                enemyBullets.push(new Bullet(
                    this.x + cos(this.angle) * this.size,
                    this.y + sin(this.angle) * this.size,
                    cos(spreadAngle) * speed,
                    sin(spreadAngle) * speed,
                    false,
                    1
                ));
            }
        } else {
            // Turret shoots single aimed shot
            enemyBullets.push(new Bullet(
                this.x + cos(this.angle) * this.size,
                this.y + sin(this.angle) * this.size,
                vx,
                vy,
                false,
                1
            ));
        }
    }

    draw() {
        push();
        noStroke();

        // Base platform
        fill(this.baseColor);
        rectMode(CENTER);
        rect(this.x, this.y, this.size * 2, this.size);

        // Rotating turret
        push();
        translate(this.x, this.y);
        rotate(this.angle);

        // Barrel
        fill(red(this.baseColor) * 0.7, green(this.baseColor) * 0.7, blue(this.baseColor) * 0.7);
        rect(this.size / 2, 0, this.size * 1.5, this.size * 0.6);

        pop();

        // Core/center
        fill(this.baseColor);
        ellipse(this.x, this.y, this.size, this.size);

        // Detail
        fill(255, 255, 255, 150);
        ellipse(this.x, this.y, this.size * 0.5, this.size * 0.5);

        // HP bar
        if (this.hp < this.maxHp) {
            fill(255, 100, 100);
            rectMode(CENTER);
            rect(this.x, this.y - this.size - 5, this.size * 2, 3);

            fill(100, 255, 100);
            let hpWidth = map(this.hp, 0, this.maxHp, 0, this.size * 2);
            rect(this.x - (this.size * 2 - hpWidth) / 2, this.y - this.size - 5, hpWidth, 3);
        }

        pop();
    }

    isOffscreen() {
        // Check if horizontally offscreen
        if (this.x < -50 || this.x > GAME_WIDTH + 50) {
            return true;
        }

        // Remove if scrolled past bottom of screen
        if (this.y > GAME_HEIGHT + 50) {
            return true;
        }

        return false;
    }
}

// Boss Enemy
class BossEnemy {
    constructor(type = 'default', areaNumber = 1) {
        this.type = type;
        this.areaNumber = areaNumber;
        this.x = GAME_WIDTH / 2;
        this.y = -100; // Start above screen
        this.targetY = 120; // Move to this position
        this.size = 40;
        this.hp = 100 + areaNumber * 50;
        this.maxHp = this.hp;
        this.scoreValue = 10000 + areaNumber * 5000;
        this.canShoot = true;
        this.shootInterval = 30;
        this.speed = 1;
        this.phase = 0; // Attack pattern phase
        this.phaseTimer = 0;
        this.movePattern = 0;
        this.isBoss = true; // Flag to identify bosses

        // Movement
        this.vx = 0;
        this.vy = 2;

        // Visual
        this.angle = 0;
        this.color = this.getBossColor();

        // Attack patterns
        this.attackCooldown = 0;
    }

    getBossColor() {
        switch(this.type) {
            case 'default': return color(200, 50, 50);
            case 'fortress': return color(150, 150, 200);
            case 'organic': return color(150, 255, 100);
            case 'mech': return color(100, 150, 255);
            default: return color(200, 50, 200);
        }
    }

    update() {
        this.phaseTimer++;
        this.angle += 0.02;

        // Entry phase - move into position
        if (this.y < this.targetY) {
            this.y += this.vy;
            return;
        }

        // Update phase based on HP
        let hpPercent = this.hp / this.maxHp;
        if (hpPercent > 0.66) {
            this.phase = 1;
            this.shootInterval = 30;
        } else if (hpPercent > 0.33) {
            this.phase = 2;
            this.shootInterval = 20;
        } else {
            this.phase = 3;
            this.shootInterval = 15;
        }

        // Movement pattern
        switch(this.movePattern) {
            case 0: // Side to side
                this.x += sin(this.phaseTimer * 0.03) * 3;
                break;
            case 1: // Figure 8
                this.x = GAME_WIDTH / 2 + sin(this.phaseTimer * 0.02) * 100;
                this.y = this.targetY + sin(this.phaseTimer * 0.04) * 30;
                break;
            case 2: // Aggressive approach
                if (player && player.alive) {
                    let dx = player.x - this.x;
                    this.x += dx * 0.02;
                }
                break;
        }

        // Change movement pattern periodically
        if (this.phaseTimer % 300 === 0) {
            this.movePattern = (this.movePattern + 1) % 3;
        }

        // Keep in bounds
        this.x = constrain(this.x, this.size, GAME_WIDTH - this.size);
        this.y = constrain(this.y, this.size, GAME_HEIGHT / 3);

        this.attackCooldown--;
    }

    shoot() {
        if (!this.canShoot || this.attackCooldown > 0 || this.y < this.targetY) return;
        if (!player || !player.alive) return;

        this.attackCooldown = this.shootInterval;

        let speed = 4.5; // Reduced from 6 to 4.5 (75% speed)

        switch(this.phase) {
            case 1: // Phase 1 - aimed shots
                {
                    let angle = atan2(player.y - this.y, player.x - this.x);
                    enemyBullets.push(new Bullet(
                        this.x,
                        this.y + this.size / 2,
                        cos(angle) * speed,
                        sin(angle) * speed,
                        false,
                        1
                    ));
                }
                break;

            case 2: // Phase 2 - spread pattern
                for (let i = -2; i <= 2; i++) {
                    let angle = atan2(player.y - this.y, player.x - this.x) + i * 0.3;
                    enemyBullets.push(new Bullet(
                        this.x,
                        this.y + this.size / 2,
                        cos(angle) * speed,
                        sin(angle) * speed,
                        false,
                        1
                    ));
                }
                break;

            case 3: // Phase 3 - circular barrage
                for (let i = 0; i < 8; i++) {
                    let angle = (i / 8) * TWO_PI + this.angle;
                    enemyBullets.push(new Bullet(
                        this.x,
                        this.y,
                        cos(angle) * speed,
                        sin(angle) * speed,
                        false,
                        1
                    ));
                }
                break;
        }
    }

    draw() {
        push();
        noStroke();

        // Warning flash in phase 3
        if (this.phase === 3 && frameCount % 6 < 3) {
            fill(255, 100, 100, 100);
            ellipse(this.x, this.y, this.size * 3, this.size * 3);
        }

        // Boss body
        fill(this.color);

        // Main body - complex shape
        ellipse(this.x, this.y, this.size * 2, this.size * 1.5);

        // Wings/sides
        push();
        translate(this.x, this.y);
        rotate(this.angle);

        fill(red(this.color) * 0.8, green(this.color) * 0.8, blue(this.color) * 0.8);
        ellipse(-this.size * 1.2, 0, this.size, this.size * 0.7);
        ellipse(this.size * 1.2, 0, this.size, this.size * 0.7);

        pop();

        // Core
        fill(255, 255, 255, 200);
        ellipse(this.x, this.y, this.size * 0.8, this.size * 0.8);

        // Details
        fill(this.color);
        ellipse(this.x, this.y, this.size * 0.5, this.size * 0.5);

        // Glowing effect
        fill(red(this.color), green(this.color), blue(this.color), 50);
        ellipse(this.x, this.y, this.size * 2.5, this.size * 2);

        // HP bar (prominent)
        let barWidth = 200;
        let barHeight = 8;
        let barX = GAME_WIDTH / 2 - barWidth / 2;
        let barY = 20;

        // Background
        fill(50, 50, 50);
        rect(barX, barY, barWidth, barHeight);

        // HP fill
        let hpPercent = this.hp / this.maxHp;
        let fillColor;
        if (hpPercent > 0.66) {
            fillColor = color(100, 255, 100);
        } else if (hpPercent > 0.33) {
            fillColor = color(255, 255, 100);
        } else {
            fillColor = color(255, 100, 100);
        }

        fill(fillColor);
        rect(barX, barY, barWidth * hpPercent, barHeight);

        // Border
        noFill();
        stroke(255);
        strokeWeight(2);
        rect(barX, barY, barWidth, barHeight);

        // Text
        noStroke();
        fill(255);
        textAlign(CENTER, TOP);
        textSize(12);
        text(`BOSS - AREA ${this.areaNumber}`, GAME_WIDTH / 2, barY - 15);
        textSize(10);
        text(`HP: ${int(this.hp)}/${int(this.maxHp)}`, GAME_WIDTH / 2, barY + barHeight + 3);

        pop();
    }

    isOffscreen() {
        // Boss never goes offscreen by itself
        return false;
    }
}

// Special Enemy: AI-AI (アイアイ)
// A rare special ground enemy that appears in specific areas
class SpecialAIAI {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 30;
        this.hp = 666;
        this.maxHp = 666;
        this.scoreValue = 10000;
        this.isGround = true;
        this.isSpecial = true; // Flag to identify as AI-AI
        this.canShoot = false;
        this.scrollSpeed = 0.3; // Very slow movement
        this.angle = 0; // For animation

        // Color scheme - make it look special
        this.baseColor = color(255, 215, 0); // Gold
        this.glowColor = color(255, 255, 100);
    }

    update() {
        // Slowly scroll down
        this.y += this.scrollSpeed;

        // Rotate for visual effect
        this.angle += 0.02;
    }

    shoot() {
        // AI-AI doesn't shoot
    }

    onDestroyed() {
        // Special rewards when destroyed
        if (player && player.alive) {
            // Main weapon +15 levels
            player.mainWeaponLevel = min(30, player.mainWeaponLevel + 15);

            // Sub weapon level 5
            player.subWeaponLevel = 5;
            if (player.subWeaponType !== 0) {
                player.initSubWeapon(player.subWeaponType);
            }

            // Add 1 life
            player.lives++;

            // Visual feedback
            createExplosion(this.x, this.y, this.size * 3);
        }
    }

    draw() {
        push();
        translate(this.x, this.y);

        // Outer glow
        noStroke();
        for (let i = 3; i > 0; i--) {
            fill(this.glowColor.levels[0], this.glowColor.levels[1], this.glowColor.levels[2], 50 / i);
            ellipse(0, 0, this.size * 2 * i * 0.4, this.size * 2 * i * 0.4);
        }

        // Main body - golden orb
        fill(255, 215, 0);
        ellipse(0, 0, this.size * 2, this.size * 2);

        // Inner shine
        fill(255, 255, 200, 200);
        ellipse(-this.size * 0.3, -this.size * 0.3, this.size * 1.2, this.size * 1.2);

        // Rotating symbols (AI characters)
        fill(255, 100, 100);
        rotate(this.angle);
        textSize(16);
        textAlign(CENTER, CENTER);
        text('AI', 0, 0);

        // Reset rotation for HP bar
        rotate(-this.angle);

        // HP bar
        if (this.hp > 0 && this.maxHp > 0) {
            fill(255, 100, 100);
            rectMode(CENTER);
            rect(0, -this.size - 10, this.size * 2, 5);

            fill(100, 255, 100);
            let hpWidth = map(this.hp, 0, this.maxHp, 0, this.size * 2);
            rect(-(this.size * 2 - hpWidth) / 2, -this.size - 10, hpWidth, 5);
        }

        // HP text
        fill(255, 255, 100);
        textSize(10);
        text(`${int(this.hp)}/${this.maxHp}`, 0, -this.size - 20);

        pop();
    }

    isOffscreen() {
        return this.y > GAME_HEIGHT + 50;
    }
}
