// Power Chip (for main weapon power-up)
class PowerChip {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 8;
        this.speed = 1.5;
        this.angle = 0;
        this.bobOffset = random(TWO_PI);
        this.type = 'powerchip';
    }

    update() {
        this.y += this.speed;
        this.angle += 0.1;
        this.bobOffset += 0.08;
    }

    draw() {
        push();

        // Bobbing animation
        let bob = sin(this.bobOffset) * 2;

        // Outer glow (yellow/gold)
        noStroke();
        fill(255, 255, 100, 80);
        ellipse(this.x, this.y + bob, this.size * 3.5, this.size * 3.5);

        // Rotating border
        push();
        translate(this.x, this.y + bob);
        rotate(this.angle);
        noFill();
        stroke(255, 255, 100);
        strokeWeight(2);

        // Diamond shape (like a chip)
        beginShape();
        vertex(0, -this.size);
        vertex(this.size, 0);
        vertex(0, this.size);
        vertex(-this.size, 0);
        endShape(CLOSE);
        pop();

        // Inner fill
        fill(255, 255, 150);
        ellipse(this.x, this.y + bob, this.size, this.size);

        // "P" letter for Power
        fill(200, 150, 0);
        textAlign(CENTER, CENTER);
        textSize(8);
        textStyle(BOLD);
        text('P', this.x, this.y + bob);

        // Sparkle
        if (frameCount % 15 < 3) {
            fill(255, 255, 255, 220);
            let sparkleSize = 4;
            ellipse(this.x + this.size * 0.6, this.y + bob - this.size * 0.6, sparkleSize);
        }

        pop();
    }

    isOffscreen() {
        return this.y > GAME_HEIGHT + 50;
    }
}

// Sub Weapon Item (0-7)
class SubWeapon {
    constructor(x, y, type = null) {
        this.x = x;
        this.y = y;
        this.size = 12;
        this.speed = 1.8;
        this.type = type !== null ? type : int(random(0, 8)); // 0-7 weapon types
        this.angle = 0;
        this.bobOffset = random(TWO_PI);
        this.itemType = 'subweapon';

        // Color based on type
        this.colors = [
            color(200, 200, 200),  // 0 - All-range (white/gray)
            color(100, 255, 200),  // 1 - Crusher (green)
            color(100, 200, 255),  // 2 - Barrier (blue)
            color(255, 255, 100),  // 3 - Circular (yellow)
            color(255, 150, 50),   // 4 - Vibrator (orange)
            color(200, 100, 255),  // 5 - Rewinder (purple)
            color(255, 100, 255),  // 6 - Plasma (magenta)
            color(100, 255, 255)   // 7 - High-speed (cyan)
        ];

        this.weaponNames = [
            'ALL',
            'CRU',
            'BAR',
            'CIR',
            'VIB',
            'REW',
            'PLA',
            'SPD'
        ];
    }

    update() {
        this.y += this.speed;
        this.angle += 0.08;
        this.bobOffset += 0.05;
    }

    draw() {
        push();

        // Bobbing animation
        let bob = sin(this.bobOffset) * 3;

        // Outer glow
        noStroke();
        fill(red(this.colors[this.type]), green(this.colors[this.type]), blue(this.colors[this.type]), 60);
        ellipse(this.x, this.y + bob, this.size * 3.5, this.size * 3.5);

        // Rotating border
        push();
        translate(this.x, this.y + bob);
        rotate(this.angle);
        noFill();
        stroke(this.colors[this.type]);
        strokeWeight(2.5);

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
        ellipse(this.x, this.y + bob, this.size * 1.4, this.size * 1.4);

        // Number
        fill(0);
        textAlign(CENTER, CENTER);
        textSize(16);
        textStyle(BOLD);
        text(this.type, this.x, this.y + bob);

        // Sparkle effect
        if (frameCount % 12 < 4) {
            fill(255, 255, 255, 220);
            let sparkleSize = 4;
            ellipse(this.x + this.size * 0.7, this.y + bob - this.size * 0.7, sparkleSize);
        }

        pop();
    }

    isOffscreen() {
        return this.y > GAME_HEIGHT + 50;
    }
}

// 1UP Item (Lander)
class OneUpItem {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 10;
        this.speed = 1.5;
        this.angle = 0;
        this.bobOffset = random(TWO_PI);
        this.type = '1up';
        this.shotCount = 0; // Tracks how many times it's been shot
        this.maxShots = 5; // Changes color after 5 shots
        this.isRed = false;
    }

    update() {
        this.y += this.speed;
        this.angle += 0.12;
        this.bobOffset += 0.06;
    }

    hit() {
        // Shooting the 1UP makes it red and more valuable
        this.shotCount++;
        if (this.shotCount >= this.maxShots) {
            this.isRed = true;
        }
    }

    draw() {
        push();

        // Bobbing animation
        let bob = sin(this.bobOffset) * 3;

        // Color changes when shot enough times
        let baseColor = this.isRed ? color(255, 50, 50) : color(100, 150, 255);

        // Outer glow
        noStroke();
        fill(red(baseColor), green(baseColor), blue(baseColor), 80);
        ellipse(this.x, this.y + bob, this.size * 4, this.size * 4);

        // Rotating capsule shape (like Lander)
        push();
        translate(this.x, this.y + bob);
        rotate(this.angle);

        // Body
        fill(baseColor);
        rectMode(CENTER);
        rect(0, 0, this.size * 2, this.size);

        // Caps
        ellipse(-this.size, 0, this.size, this.size);
        ellipse(this.size, 0, this.size, this.size);

        // Face/detail
        fill(255);
        ellipse(-this.size * 0.4, -this.size * 0.2, this.size * 0.4);
        ellipse(this.size * 0.4, -this.size * 0.2, this.size * 0.4);

        pop();

        // "1UP" text
        fill(255, 255, 100);
        textAlign(CENTER, CENTER);
        textSize(8);
        textStyle(BOLD);
        text('1UP', this.x, this.y + bob + this.size + 8);

        // Sparkles
        if (frameCount % 10 < 4) {
            fill(255, 255, 255, 220);
            let sparkleSize = this.isRed ? 5 : 3;
            ellipse(this.x + this.size * 0.8, this.y + bob - this.size * 0.5, sparkleSize);
        }

        // Progress indicator (shot count)
        if (!this.isRed && this.shotCount > 0) {
            fill(255, 200, 0);
            for (let i = 0; i < this.shotCount; i++) {
                let dotX = this.x - (this.maxShots * 2) + i * 4;
                ellipse(dotX, this.y + bob + this.size + 15, 2);
            }
        }

        pop();
    }

    isOffscreen() {
        return this.y > GAME_HEIGHT + 50;
    }
}

// Legacy PowerUp class for compatibility (automatically creates appropriate type)
class PowerUp {
    constructor(x, y, type = null) {
        // Handle explicit type requests
        if (type === '1up') {
            return new OneUpItem(x, y);
        }

        // Random chance: 30% power chip, 70% sub weapon
        if (type === 'powerchip' || (type === null && random() < 0.3)) {
            return new PowerChip(x, y);
        } else {
            let weaponType = (type !== null && type !== 'powerchip') ? type : int(random(0, 8));
            return new SubWeapon(x, y, weaponType);
        }
    }
}
