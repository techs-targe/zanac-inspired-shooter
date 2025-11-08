class PowerUp {
    constructor(x, y, type = null) {
        this.x = x;
        this.y = y;
        this.size = 12;
        this.speed = 2;
        this.type = type !== null ? type : int(random(0, 8)); // 0-7 weapon types
        this.angle = 0;
        this.bobOffset = random(TWO_PI);

        // Color based on type
        this.colors = [
            color(200, 200, 200),  // 0 - Default (white/gray)
            color(100, 200, 255),  // 1 - Double (blue)
            color(100, 255, 100),  // 2 - Spread (green)
            color(255, 200, 100),  // 3 - Wide (orange)
            color(255, 100, 255),  // 4 - Side (magenta)
            color(255, 255, 100),  // 5 - Rapid (yellow)
            color(100, 255, 255),  // 6 - Laser (cyan)
            color(255, 150, 255)   // 7 - All-around (pink)
        ];

        this.weaponNames = [
            'NORMAL',
            'DOUBLE',
            'SPREAD',
            'WIDE',
            'SIDE',
            'RAPID',
            'LASER',
            'ALL'
        ];
    }

    update() {
        this.y += this.speed;
        this.angle += 0.1;
        this.bobOffset += 0.05;
    }

    draw() {
        push();

        // Bobbing animation
        let bob = sin(this.bobOffset) * 3;

        // Outer glow
        noStroke();
        fill(red(this.colors[this.type]), green(this.colors[this.type]), blue(this.colors[this.type]), 50);
        ellipse(this.x, this.y + bob, this.size * 3, this.size * 3);

        // Rotating border
        push();
        translate(this.x, this.y + bob);
        rotate(this.angle);
        noFill();
        stroke(this.colors[this.type]);
        strokeWeight(2);

        // Octagon shape
        beginShape();
        for (let i = 0; i < 8; i++) {
            let angle = (i / 8) * TWO_PI;
            let px = cos(angle) * this.size;
            let py = sin(angle) * this.size;
            vertex(px, py);
        }
        endShape(CLOSE);
        pop();

        // Inner circle
        fill(this.colors[this.type]);
        ellipse(this.x, this.y + bob, this.size * 1.2, this.size * 1.2);

        // Number
        fill(0);
        textAlign(CENTER, CENTER);
        textSize(14);
        textStyle(BOLD);
        text(this.type, this.x, this.y + bob);

        // Sparkle effect
        if (frameCount % 10 < 5) {
            fill(255, 255, 255, 200);
            let sparkleSize = 3;
            ellipse(this.x + this.size * 0.7, this.y + bob - this.size * 0.7, sparkleSize);
        }

        pop();
    }

    isOffscreen() {
        return this.y > GAME_HEIGHT + 50;
    }
}
