class Bullet {
    constructor(x, y, vx, vy, isPlayerBullet = true, damage = 1, size = 4) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.size = size;
        this.isPlayerBullet = isPlayerBullet;
        this.damage = damage;
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
            // Enemy bullet - red/orange energy
            fill(255, 100, 100);
            ellipse(this.x, this.y, this.size, this.size);

            fill(255, 200, 100, 150);
            ellipse(this.x, this.y, this.size * 0.6, this.size * 0.6);

            // Glow effect
            fill(255, 100, 100, 80);
            ellipse(this.x, this.y, this.size * 1.8, this.size * 1.8);
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
        return d < this.size + target.size;
    }
}
