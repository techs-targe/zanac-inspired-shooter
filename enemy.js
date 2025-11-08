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
                this.speed = 2 * this.difficultyMultiplier;
                this.scoreValue = 10;
                this.color = color(255, 100, 100);
                this.canShoot = false;
                break;

            case 'shooter':
                // Enemy that shoots
                this.size = 12;
                this.hp = 2;
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
                this.speed = 2.5 * this.difficultyMultiplier;
                this.scoreValue = 40;
                this.color = color(150, 100, 255);
                this.canShoot = false;
                break;

            case 'tank':
                // Slow but tough
                this.size = 16;
                this.hp = int(5 * this.difficultyMultiplier);
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
                this.speed = 4 * this.difficultyMultiplier;
                this.scoreValue = 50;
                this.color = color(100, 255, 100);
                this.canShoot = false;
                break;

            case 'spiral':
                // Moves in spiral pattern
                this.size = 10;
                this.hp = 2;
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
                this.speed = 1.2 * this.difficultyMultiplier;
                this.scoreValue = 80;
                this.color = color(255, 200, 50);
                this.canShoot = true;
                this.shootInterval = int(70 / this.difficultyMultiplier);
                break;
        }
    }

    update() {
        this.timeAlive++;

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
        }
    }

    shoot() {
        if (!this.canShoot) return;

        // Calculate direction to player
        let dx = player.x - this.x;
        let dy = player.y - this.y;
        let angle = atan2(dy, dx);
        let speed = 4;

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

        // HP indicator for tough enemies
        if (this.hp > 2) {
            fill(255, 100, 100);
            rectMode(CENTER);
            rect(this.x, this.y - this.size - 5, this.size * 1.5, 3);

            fill(100, 255, 100);
            let hpWidth = map(this.hp, 0, 5 * this.difficultyMultiplier, 0, this.size * 1.5);
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
