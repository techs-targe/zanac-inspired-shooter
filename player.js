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
        this.weaponType = 0;
        this.fireRate = 8; // Frames between shots
        this.weaponLevel = 1;
    }

    update() {
        // Handle invulnerability frames
        if (this.invulnerable) {
            this.invulnerableTime--;
            if (this.invulnerableTime <= 0) {
                this.invulnerable = false;
            }
        }

        // Keep player in bounds
        this.x = constrain(this.x, this.size, GAME_WIDTH - this.size);
        this.y = constrain(this.y, this.size, GAME_HEIGHT - this.size);
    }

    handleInput() {
        if (!this.alive) return;

        // Movement
        if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) { // A
            this.x -= this.speed;
        }
        if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) { // D
            this.x += this.speed;
        }
        if (keyIsDown(UP_ARROW) || keyIsDown(87)) { // W
            this.y -= this.speed;
        }
        if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) { // S
            this.y += this.speed;
        }
    }

    shoot() {
        if (!this.alive) return;

        switch(this.weaponType) {
            case 0: // Default straight shot
                bullets.push(new Bullet(this.x, this.y - this.size, 0, -8, true, 1));
                break;

            case 1: // Double shot
                bullets.push(new Bullet(this.x - 8, this.y - this.size, 0, -8, true, 1));
                bullets.push(new Bullet(this.x + 8, this.y - this.size, 0, -8, true, 1));
                break;

            case 2: // Triple spread
                bullets.push(new Bullet(this.x, this.y - this.size, 0, -8, true, 1));
                bullets.push(new Bullet(this.x, this.y - this.size, -2, -8, true, 1));
                bullets.push(new Bullet(this.x, this.y - this.size, 2, -8, true, 1));
                break;

            case 3: // Wide spread (5-way)
                for (let i = -2; i <= 2; i++) {
                    let angle = i * 0.3;
                    bullets.push(new Bullet(
                        this.x,
                        this.y - this.size,
                        sin(angle) * 8,
                        -cos(angle) * 8,
                        true,
                        1
                    ));
                }
                break;

            case 4: // Side cannons
                bullets.push(new Bullet(this.x, this.y - this.size, 0, -10, true, 2));
                bullets.push(new Bullet(this.x - 15, this.y, -3, -5, true, 1));
                bullets.push(new Bullet(this.x + 15, this.y, 3, -5, true, 1));
                break;

            case 5: // Rapid fire (handled by fire rate)
                bullets.push(new Bullet(this.x, this.y - this.size, 0, -12, true, 1));
                this.fireRate = 4;
                break;

            case 6: // Laser (thick beam)
                bullets.push(new Bullet(this.x - 3, this.y - this.size, 0, -15, true, 3, 6));
                bullets.push(new Bullet(this.x + 3, this.y - this.size, 0, -15, true, 3, 6));
                break;

            case 7: // All-around (8-way)
                for (let i = 0; i < 8; i++) {
                    let angle = (i / 8) * TWO_PI;
                    bullets.push(new Bullet(
                        this.x,
                        this.y,
                        cos(angle) * 7,
                        sin(angle) * 7,
                        true,
                        1
                    ));
                }
                break;
        }
    }

    collectPowerUp(type) {
        this.weaponType = type;
        this.weaponLevel++;

        // Reset fire rate (weapon 5 changes it)
        if (type === 5) {
            this.fireRate = 4;
        } else {
            this.fireRate = 8;
        }

        // Visual feedback
        for (let i = 0; i < 10; i++) {
            particles.push(new Particle(this.x, this.y, 8, color(100, 255, 100)));
        }
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
            this.invulnerableTime = 120; // 2 seconds at 60fps

            // Lose weapon level
            if (this.weaponType > 0) {
                this.weaponType = max(0, this.weaponType - 1);
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

        // Draw weapon indicator
        if (this.weaponType > 0) {
            fill(255, 255, 100);
            textSize(10);
            textAlign(CENTER, CENTER);
            text(this.weaponType, this.x, this.y - this.size - 15);
        }

        pop();
    }
}
