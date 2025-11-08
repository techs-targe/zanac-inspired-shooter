// Game constants
const GAME_WIDTH = 480;
const GAME_HEIGHT = 640;
const FPS = 60;

// Game states
const GAME_STATE = {
    TITLE: 0,
    PLAYING: 1,
    GAME_OVER: 2,
    PAUSED: 3
};

// Global game variables
let gameState = GAME_STATE.TITLE;
let player;
let enemyManager;
let bullets = [];
let enemyBullets = [];
let enemies = [];
let powerUps = [];
let particles = [];
let score = 0;
let highScore = 0;
let scrollOffset = 0;
let gameTime = 0;

function setup() {
    let canvas = createCanvas(GAME_WIDTH, GAME_HEIGHT);
    canvas.parent('gameCanvas');
    frameRate(FPS);

    // Load high score from localStorage
    highScore = parseInt(localStorage.getItem('znk_highscore')) || 0;

    initGame();
}

function draw() {
    background(10, 5, 25);

    // Draw scrolling background
    drawBackground();

    switch(gameState) {
        case GAME_STATE.TITLE:
            drawTitle();
            break;
        case GAME_STATE.PLAYING:
            updateGame();
            drawGame();
            break;
        case GAME_STATE.GAME_OVER:
            drawGame();
            drawGameOver();
            break;
        case GAME_STATE.PAUSED:
            drawGame();
            drawPaused();
            break;
    }
}

function initGame() {
    player = new Player();
    enemyManager = new EnemyManager();
    bullets = [];
    enemyBullets = [];
    enemies = [];
    powerUps = [];
    particles = [];
    score = 0;
    scrollOffset = 0;
    gameTime = 0;
}

function updateGame() {
    gameTime++;
    scrollOffset += 2;

    // Update player
    player.update();
    player.handleInput();

    // Auto-shoot
    if (frameCount % player.fireRate === 0) {
        player.shoot();
    }

    // Update bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].update();
        if (bullets[i].isOffscreen()) {
            bullets.splice(i, 1);
        }
    }

    // Update enemy bullets
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
        enemyBullets[i].update();
        if (enemyBullets[i].isOffscreen()) {
            enemyBullets.splice(i, 1);
        }
    }

    // Update enemies
    enemyManager.update();
    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].update();

        // Check if enemy is offscreen
        if (enemies[i].isOffscreen()) {
            enemies.splice(i, 1);
            continue;
        }

        // Enemy shooting
        if (enemies[i].canShoot && frameCount % enemies[i].shootInterval === 0) {
            enemies[i].shoot();
        }
    }

    // Update powerups
    for (let i = powerUps.length - 1; i >= 0; i--) {
        powerUps[i].update();
        if (powerUps[i].isOffscreen()) {
            powerUps.splice(i, 1);
        }
    }

    // Update particles
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        if (particles[i].isDead()) {
            particles.splice(i, 1);
        }
    }

    // Collision detection
    checkCollisions();
}

function drawGame() {
    // Draw all game objects
    for (let bullet of bullets) {
        bullet.draw();
    }

    for (let bullet of enemyBullets) {
        bullet.draw();
    }

    for (let enemy of enemies) {
        enemy.draw();
    }

    for (let powerUp of powerUps) {
        powerUp.draw();
    }

    for (let particle of particles) {
        particle.draw();
    }

    if (player.alive) {
        player.draw();
    }

    // Draw HUD
    drawHUD();
}

function drawBackground() {
    // Animated star field
    push();
    stroke(40, 40, 80);
    strokeWeight(1);
    for (let i = 0; i < 50; i++) {
        let x = (i * 37) % width;
        let y = ((i * 73 + scrollOffset * (1 + i % 3)) % height);
        point(x, y);
    }
    pop();

    // Grid lines
    push();
    stroke(20, 20, 40, 100);
    strokeWeight(1);
    let gridSize = 40;
    for (let i = 0; i < height / gridSize + 2; i++) {
        let y = (i * gridSize - (scrollOffset % gridSize)) % height;
        line(0, y, width, y);
    }
    pop();
}

function drawHUD() {
    push();
    fill(255);
    textSize(16);
    textAlign(LEFT, TOP);
    text(`SCORE: ${score}`, 10, 10);
    text(`HI-SCORE: ${highScore}`, 10, 30);
    text(`WEAPON: ${player.weaponType}`, 10, 50);

    // Lives
    text(`LIVES:`, 10, 70);
    for (let i = 0; i < player.lives; i++) {
        drawMiniShip(70 + i * 20, 78);
    }

    // Difficulty indicator (ALG level)
    textAlign(RIGHT, TOP);
    text(`DIFFICULTY: ${enemyManager.difficultyLevel.toFixed(1)}`, width - 10, 10);
    pop();
}

function drawMiniShip(x, y) {
    push();
    fill(100, 200, 255);
    noStroke();
    triangle(x, y - 5, x - 4, y + 5, x + 4, y + 5);
    pop();
}

function drawTitle() {
    push();
    fill(100, 200, 255);
    textSize(48);
    textAlign(CENTER, CENTER);
    text('ZNK', width / 2, height / 3);

    fill(255);
    textSize(20);
    text('ZANAC-INSPIRED SHOOTER', width / 2, height / 3 + 60);

    textSize(16);
    fill(200);
    text('Press SPACE or ENTER to Start', width / 2, height / 2 + 40);

    textSize(14);
    fill(150);
    text('Arrow Keys: Move', width / 2, height / 2 + 100);
    text('Auto-fire enabled', width / 2, height / 2 + 120);
    text('Collect numbered items (0-7) for weapons', width / 2, height / 2 + 140);

    textSize(12);
    fill(100, 255, 100);
    text('Featuring ALG System:', width / 2, height / 2 + 180);
    text('Game difficulty adapts to your skill!', width / 2, height / 2 + 200);

    if (highScore > 0) {
        textSize(16);
        fill(255, 255, 100);
        text(`High Score: ${highScore}`, width / 2, height - 50);
    }
    pop();
}

function drawGameOver() {
    push();
    fill(0, 0, 0, 200);
    rect(0, height / 2 - 100, width, 200);

    fill(255, 100, 100);
    textSize(48);
    textAlign(CENTER, CENTER);
    text('GAME OVER', width / 2, height / 2 - 30);

    fill(255);
    textSize(20);
    text(`Final Score: ${score}`, width / 2, height / 2 + 20);

    if (score > highScore) {
        fill(255, 255, 100);
        textSize(16);
        text('NEW HIGH SCORE!', width / 2, height / 2 + 50);
    }

    fill(200);
    textSize(14);
    text('Press SPACE or ENTER to Restart', width / 2, height / 2 + 80);
    pop();
}

function drawPaused() {
    push();
    fill(0, 0, 0, 200);
    rect(0, height / 2 - 50, width, 100);

    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text('PAUSED', width / 2, height / 2);

    textSize(14);
    text('Press P to Resume', width / 2, height / 2 + 30);
    pop();
}

function checkCollisions() {
    // Player bullets vs enemies
    for (let i = bullets.length - 1; i >= 0; i--) {
        for (let j = enemies.length - 1; j >= 0; j--) {
            if (bullets[i].hits(enemies[j])) {
                enemies[j].hp -= bullets[i].damage;
                bullets.splice(i, 1);

                if (enemies[j].hp <= 0) {
                    // Enemy destroyed
                    addScore(enemies[j].scoreValue);
                    createExplosion(enemies[j].x, enemies[j].y, enemies[j].size);

                    // Drop powerup chance
                    if (random() < 0.15) {
                        powerUps.push(new PowerUp(enemies[j].x, enemies[j].y));
                    }

                    enemies.splice(j, 1);
                    enemyManager.onEnemyDestroyed();
                }
                break;
            }
        }
    }

    // Enemy bullets vs player
    if (player.alive && !player.invulnerable) {
        for (let i = enemyBullets.length - 1; i >= 0; i--) {
            if (enemyBullets[i].hits(player)) {
                enemyBullets.splice(i, 1);
                player.hit();
                enemyManager.onPlayerHit();
                break;
            }
        }

        // Enemies vs player (collision)
        for (let i = enemies.length - 1; i >= 0; i--) {
            let d = dist(player.x, player.y, enemies[i].x, enemies[i].y);
            if (d < player.size + enemies[i].size) {
                createExplosion(enemies[i].x, enemies[i].y, enemies[i].size);
                enemies.splice(i, 1);
                player.hit();
                enemyManager.onPlayerHit();
            }
        }
    }

    // Player vs powerups
    if (player.alive) {
        for (let i = powerUps.length - 1; i >= 0; i--) {
            let d = dist(player.x, player.y, powerUps[i].x, powerUps[i].y);
            if (d < player.size + powerUps[i].size) {
                player.collectPowerUp(powerUps[i].type);
                addScore(100);
                powerUps.splice(i, 1);
            }
        }
    }
}

function addScore(points) {
    score += points;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('znk_highscore', highScore);
    }
    enemyManager.onScoreGained(points);
}

function createExplosion(x, y, size) {
    let particleCount = int(size * 2);
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(x, y, size));
    }
}

function keyPressed() {
    if (key === ' ' || keyCode === ENTER) {
        if (gameState === GAME_STATE.TITLE) {
            gameState = GAME_STATE.PLAYING;
            initGame();
        } else if (gameState === GAME_STATE.GAME_OVER) {
            gameState = GAME_STATE.TITLE;
        }
    }

    if (key === 'p' || key === 'P') {
        if (gameState === GAME_STATE.PLAYING) {
            gameState = GAME_STATE.PAUSED;
        } else if (gameState === GAME_STATE.PAUSED) {
            gameState = GAME_STATE.PLAYING;
        }
    }
}
