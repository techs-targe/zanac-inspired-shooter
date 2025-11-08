class Particle {
    constructor(x, y, size, customColor = null) {
        this.x = x;
        this.y = y;
        this.vx = random(-3, 3);
        this.vy = random(-3, 3);
        this.size = random(2, size);
        this.life = 255;
        this.decay = random(3, 8);

        // Color - oranges and yellows for explosions, or custom
        if (customColor) {
            this.color = customColor;
        } else {
            let colorType = random();
            if (colorType < 0.4) {
                this.color = color(255, random(150, 200), 50);
            } else if (colorType < 0.7) {
                this.color = color(255, random(100, 150), 50);
            } else {
                this.color = color(255, 255, random(100, 200));
            }
        }
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1; // Gravity
        this.life -= this.decay;
        this.size *= 0.96; // Shrink over time
    }

    draw() {
        push();
        noStroke();

        // Outer glow
        fill(red(this.color), green(this.color), blue(this.color), this.life * 0.3);
        ellipse(this.x, this.y, this.size * 2);

        // Core
        fill(red(this.color), green(this.color), blue(this.color), this.life);
        ellipse(this.x, this.y, this.size);

        pop();
    }

    isDead() {
        return this.life <= 0 || this.size < 0.5;
    }
}
