// Game constants
const GAME_WIDTH = 480;
const GAME_HEIGHT = 640;
const FPS = 60;

// Build information
const BUILD_DATE = '2026-01-09';
const BUILD_TIME = '23:55';

// Game states
const GAME_STATE = {
    TITLE: 0,
    PLAYING: 1,
    GAME_OVER: 2,
    PAUSED: 3,
    ENDING: 4
};

// Global game variables
let gameState = GAME_STATE.TITLE;
let player;
let enemyManager;
let areaManager;
let bullets = [];
let enemyBullets = [];
let enemies = [];
let groundEnemies = []; // Ground-based turrets/cores
let powerUps = [];
let particles = [];
let score = 0;
let highScore = 0;
let scrollOffset = 0;
let gameTime = 0;

// 1UP system tracking
let nextExtraLifeScore = 10000; // First 1UP at 10,000 points
let extraLifeInterval = 10000; // 10,000 points interval until 100,000

// Key states for shooting
let mainFirePressed = false;
let subFirePressed = false;

let debugMode = false;
let dKeyPressCount = 0;
let dKeyPressTimer = 0;
let endingStartTime = 0;

// Debug enemy preview mode
let debugEnemyPreviewMode = false;
let debugSelectedEnemyIndex = 0;
let debugLockedEnemy = null;
let debugSelectedArea = 1;
const debugEnemyTypes = ['basic', 'shooter', 'weaver', 'tank', 'fast', 'spiral', 'bomber',
                         'charger', 'tracker', 'bouncer', 'divider', 'spawner',
                         'drobe', 'yellowGogos', 'blueGogos', 'redGogos', 'takuwashi', 'degeed', 'backDegeed'];

function setup() {
    let canvas = createCanvas(GAME_WIDTH, GAME_HEIGHT);
    canvas.parent('gameCanvas');
    frameRate(FPS);

    // Initialize input manager for keyboard, touch, and gamepad
    inputManager = new InputManager();

    // Reset high score to 0
    highScore = 0;
    localStorage.setItem('znk_highscore', 0);

    initGame();
}

function draw() {
    background(10, 5, 25);

    // Update input manager
    if (inputManager) {
        inputManager.resetFrame();
        inputManager.update();

        // Handle game state transitions from input
        let stateChanged = false;

        // Pause button handling
        if (inputManager.pause) {
            if (gameState === GAME_STATE.TITLE) {
                // Start game from title screen with pause button
                gameState = GAME_STATE.PLAYING;
                initGame();
                stateChanged = true;
            } else if (gameState === GAME_STATE.PLAYING) {
                gameState = GAME_STATE.PAUSED;
                stateChanged = true;
            } else if (gameState === GAME_STATE.PAUSED) {
                gameState = GAME_STATE.PLAYING;
                stateChanged = true;
            } else if (gameState === GAME_STATE.GAME_OVER) {
                // Return to title from game over
                gameState = GAME_STATE.TITLE;
                stateChanged = true;
            }
        }

        // Also allow main fire or sub fire button to start game (mobile friendly)
        if (!stateChanged && (inputManager.mainFire || inputManager.subFire)) {
            if (gameState === GAME_STATE.TITLE) {
                gameState = GAME_STATE.PLAYING;
                initGame();
            } else if (gameState === GAME_STATE.GAME_OVER) {
                gameState = GAME_STATE.TITLE;
            } else if (gameState === GAME_STATE.ENDING) {
                // Only allow exit after 3 minutes
                let elapsedTime = millis() - endingStartTime;
                if (elapsedTime >= 180000) {
                    gameState = GAME_STATE.TITLE;
                }
            }
        }
    }

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
            updateGame(); // Keep game running in background
            drawGame();
            drawGameOver();
            break;
        case GAME_STATE.PAUSED:
            drawGame();
            drawPaused();
            break;
        case GAME_STATE.ENDING:
            drawEnding();
            break;
    }

    // Draw touch controls on top of everything
    if (inputManager && inputManager.isMobile) {
        inputManager.drawTouchControls();
    }
}

function initGame() {
    player = new Player();
    enemyManager = new EnemyManager();
    areaManager = new AreaManager();
    bullets = [];
    enemyBullets = [];
    enemies = [];
    groundEnemies = [];
    powerUps = [];
    particles = [];
    score = 0;
    scrollOffset = 0;
    gameTime = 0;

    // Reset 1UP system
    nextExtraLifeScore = 10000;
    extraLifeInterval = 10000;

    // Spawn PowerBox formations at game start (left and right)
    areaManager.spawnPowerBoxFormation(80);  // Left side
    areaManager.spawnPowerBoxFormation(GAME_WIDTH - 80);  // Right side

    // Spawn Crow at game start
    areaManager.spawnCrow();
}

function updateGame() {
    try {
        gameTime++;

        if (dKeyPressTimer > 0) {
            dKeyPressTimer--;
            if (dKeyPressTimer === 0) {
                dKeyPressCount = 0;
            }
        }

        // Scroll speed based on current area (stop scrolling during boss battles)
        if (!areaManager.bossActive) {
            scrollOffset += areaManager.scrollSpeed;
        }

        // Update player (if alive or game still running)
        if (player) {
            player.update();
            player.handleInput();
        }

        // Manual shooting - use inputManager or keyboard fallback
        if (player && player.alive) {
            if (inputManager) {
                if (inputManager.mainFire) {
                    player.shootMain();
                }
                if (inputManager.subFire) {
                    player.shootSub();
                }
            } else {
                // Fallback to keyboard
                if (keyIsDown(32)) { // SPACE
                    player.shootMain();
                }
                if (keyIsDown(90)) { // Z
                    player.shootSub();
                }
            }
        }

        // Debug mode: Spawn sub weapon items
        if (debugMode && frameCount % 180 === 0) {
            // Spawn all 8 sub weapons (0-7) across the screen
            for (let i = 0; i < 8; i++) {
                let x = 60 + i * 50; // Spread across screen
                try {
                    powerUps.push(new SubWeapon(x, -20, i));
                } catch (e) {
                    console.error("Error spawning debug item:", e);
                }
            }
        }

        // Update bullets
        for (let i = bullets.length - 1; i >= 0; i--) {
            if (bullets[i]) {
                bullets[i].update();
                // Remove if marked for removal (e.g., PlasmaBullet hit enemy bullet)
                if (bullets[i].shouldRemove) {
                    bullets.splice(i, 1);
                    continue;
                }
                if (bullets[i].isOffscreen && bullets[i].isOffscreen()) {
                    bullets.splice(i, 1);
                }
            }
        }

        // Update enemy bullets
        for (let i = enemyBullets.length - 1; i >= 0; i--) {
            if (enemyBullets[i]) {
                enemyBullets[i].update();
                if (enemyBullets[i].isOffscreen()) {
                    enemyBullets.splice(i, 1);
                }
            }
        }

        // Update area system
        if (areaManager) {
            areaManager.update();
            groundEnemies = areaManager.groundEnemies; // Sync ground enemies
        }

        // Update ground enemies
        for (let i = groundEnemies.length - 1; i >= 0; i--) {
            if (groundEnemies[i]) {
                // Skip if already marked for deletion
                if (groundEnemies[i].markedForDeletion) {
                    groundEnemies.splice(i, 1);
                    continue;
                }

                groundEnemies[i].update();

                // Check if ground enemy HP is 0 or below (killed by barrier/rotating weapon)
                if (groundEnemies[i].hp <= 0 && !groundEnemies[i].markedForDeletion) {
                    groundEnemies[i].markedForDeletion = true;

                    addScore(groundEnemies[i].scoreValue);
                    createExplosion(groundEnemies[i].x, groundEnemies[i].y, groundEnemies[i].size);

                    // Ground enemies have better drop rates
                    if (random() < 0.40) {
                        let dropRoll = random();
                        if (dropRoll < 0.5) {
                            powerUps.push(new PowerChip(groundEnemies[i].x, groundEnemies[i].y));
                        } else {
                            powerUps.push(new SubWeapon(groundEnemies[i].x, groundEnemies[i].y));
                        }
                    }

                    groundEnemies.splice(i, 1);
                    continue;
                }

                // Ground enemy shooting is now handled in update()
            }
        }

        // Update enemies
        if (enemyManager) enemyManager.update();
        for (let i = enemies.length - 1; i >= 0; i--) {
            if (enemies[i]) {
                // Skip if already marked for deletion
                if (enemies[i].markedForDeletion) {
                    enemies.splice(i, 1);
                    continue;
                }

                enemies[i].update();

                // Check if enemy HP is 0 or below (killed by barrier/rotating weapon)
                if (enemies[i].hp <= 0 && !enemies[i].markedForDeletion) {
                    // Mark immediately to prevent re-processing
                    enemies[i].markedForDeletion = true;

                    addScore(enemies[i].scoreValue);
                    createExplosion(enemies[i].x, enemies[i].y, enemies[i].size);

                    // Check if boss defeated
                    if (enemies[i].isBoss && !areaManager.bossDefeated) {
                        areaManager.onBossDefeated();
                        try {
                            powerUps.push(new SubWeapon(enemies[i].x, enemies[i].y, int(random(0, 8))));
                        } catch (e) {
                            console.error("Error creating boss power-up:", e);
                        }
                    } else if (!enemies[i].isBoss) {
                        // Drop powerup chance
                        if (random() < 0.30) {
                            let dropRoll = random();
                            if (dropRoll < 0.45) {
                                powerUps.push(new PowerChip(enemies[i].x, enemies[i].y));
                            } else if (dropRoll < 0.95) {
                                powerUps.push(new SubWeapon(enemies[i].x, enemies[i].y));
                            } else if (enemies[i].scoreValue >= 80) {
                                powerUps.push(new OneUpItem(enemies[i].x, enemies[i].y));
                            }
                        }
                    }

                    enemies[i].onDestroyed();
                    enemies.splice(i, 1);
                    if (enemyManager) enemyManager.onEnemyDestroyed();
                    continue;
                }

                // Check if enemy is offscreen
                if (enemies[i].isOffscreen()) {
                    enemies.splice(i, 1);
                    continue;
                }

                // Enemy shooting is now handled in each enemy's update() method
            }
        }

        // Update powerups
        for (let i = powerUps.length - 1; i >= 0; i--) {
            if (powerUps[i]) {
                powerUps[i].update();
                if (powerUps[i].isOffscreen()) {
                    powerUps.splice(i, 1);
                }
            }
        }

        // Update particles
        for (let i = particles.length - 1; i >= 0; i--) {
            if (particles[i]) {
                particles[i].update();
                if (particles[i].isDead()) {
                    particles.splice(i, 1);
                }
            }
        }

        // Collision detection
        checkCollisions();
    } catch (e) {
        console.error("Error in updateGame:", e);
        console.error("Stack trace:", e.stack);
        // Don't freeze - continue game loop
    }
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

    for (let groundEnemy of groundEnemies) {
        groundEnemy.draw();
    }

    // Draw PowerBox formations
    if (areaManager) {
        areaManager.drawPowerBoxFormations();
    }

    // Draw Crow if active
    if (areaManager && areaManager.crow) {
        areaManager.crow.draw();
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

    // Draw area info
    areaManager.drawAreaInfo();
}

function drawBackground() {
    // Use area-specific background
    areaManager.drawBackground();
}

function drawHUD() {
    push();
    fill(255);
    textSize(14);
    textAlign(LEFT, TOP);

    // Score
    text(`SCORE: ${score}`, 10, 10);
    text(`HI-SCORE: ${highScore}`, 10, 28);

    // Lives
    text(`LIVES:`, 10, 46);
    for (let i = 0; i < player.lives; i++) {
        drawMiniShip(70 + i * 18, 53);
    }

    // Main weapon level
    text(`MAIN: Lv.${player.mainWeaponLevel}`, 10, 64);

    // Sub weapon info
    let subWeaponName = player.getSubWeaponName();
    text(`SUB: ${subWeaponName} Lv.${player.subWeaponLevel}`, 10, 82);

    // Sub weapon resource display
    let resourceY = 100;
    if (player.subWeaponAmmo > 0) {
        fill(100, 255, 100);
        text(`AMMO: ${player.subWeaponAmmo}`, 10, resourceY);
    } else if (player.subWeaponTime > 0) {
        fill(255, 255, 100);
        let seconds = (player.subWeaponTime / 60).toFixed(1);
        text(`TIME: ${seconds}s`, 10, resourceY);
    } else if (player.subWeaponDurability > 0 && player.subWeaponType !== 2) {
        // Don't show for barrier (shows on screen)
        fill(255, 150, 100);
        text(`DUR: ${player.subWeaponDurability}`, 10, resourceY);
    }

    // Difficulty indicator (ALG level)
    textAlign(RIGHT, TOP);
    fill(255, 200, 100);
    text(`DIFFICULTY:`, width - 10, 10);
    text(`${enemyManager.difficultyLevel.toFixed(1)}`, width - 10, 28);

    // Controls hint
    textAlign(CENTER, TOP);
    fill(150);
    textSize(10);
    text('SPACE: Main  Z: Sub  P: Pause', width / 2, height - 15);

    if (debugMode) {
        textAlign(LEFT, TOP);
        fill(255, 255, 0);
        textSize(14);
        text('DEBUG MODE', 10, 120);

        textSize(10);
        let debugY = 138;
        text(`Area: ${areaManager.currentArea}`, 10, debugY);
        text(`Progress: ${areaManager.areaProgress}`, 10, debugY + 12);
        text(`Enemies: ${enemies.length}`, 10, debugY + 24);
        text(`Bullets: ${bullets.length}`, 10, debugY + 36);
        text(`E-Bullets: ${enemyBullets.length}`, 10, debugY + 48);
        text(`FPS: ${frameRate().toFixed(1)}`, 10, debugY + 60);
        if (player) {
            text(`Player X: ${player.x.toFixed(0)} Y: ${player.y.toFixed(0)}`, 10, debugY + 72);
            text(`Invuln: ${player.invulnerable ? player.invulnerableTime : 0}`, 10, debugY + 84);
        }
    }

    pop();
}

function drawMiniShip(x, y) {
    push();
    fill(100, 200, 255);
    noStroke();
    triangle(x, y - 4, x - 3, y + 3, x + 3, y + 3);
    pop();
}

function drawTitle() {
    push();
    fill(100, 200, 255);
    textSize(56);
    textAlign(CENTER, CENTER);
    text('ZNK', width / 2, height / 3 - 20);

    fill(255);
    textSize(18);
    text('ZANAC-INSPIRED SHOOTER', width / 2, height / 3 + 40);

    textSize(14);
    fill(200);
    text('Press SPACE or ENTER to Start', width / 2, height / 2 + 20);

    // Controls
    textSize(13);
    fill(180);
    text('CONTROLS:', width / 2, height / 2 + 60);
    textSize(12);
    text('Arrow Keys / WASD: Move', width / 2, height / 2 + 80);
    text('SPACE: Main Weapon (manual fire)', width / 2, height / 2 + 98);
    text('Z: Sub Weapon (manual fire)', width / 2, height / 2 + 116);
    text('P: Pause', width / 2, height / 2 + 134);

    // Weapon system explanation
    textSize(11);
    fill(150, 255, 150);
    text('Collect Power Chips (P) for main weapon', width / 2, height / 2 + 160);
    text('Collect Sub Weapons (0-7) with unique abilities', width / 2, height / 2 + 176);

    // ALG system
    textSize(11);
    fill(255, 200, 100);
    text('Featuring ALG System:', width / 2, height / 2 + 202);
    text('Difficulty adapts to your skill!', width / 2, height / 2 + 218);

    if (highScore > 0) {
        textSize(15);
        fill(255, 255, 100);
        text(`High Score: ${highScore}`, width / 2, height - 50);
    }

    // Build info at bottom
    textSize(10);
    fill(100);
    text(`Build: ${BUILD_DATE} ${BUILD_TIME}`, width / 2, height - 15);
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

function drawEnding() {
    // Starfield background (keep animating)
    drawBackground();

    push();
    // Dark overlay
    fill(0, 0, 0, 230);
    rect(0, 0, width, height);

    // Congratulations message
    fill(255, 200, 0);
    textSize(48);
    textAlign(CENTER, CENTER);
    text('CONGRATULATIONS!', width / 2, height / 4);

    fill(100, 255, 255);
    textSize(32);
    text('ALL AREAS CLEARED', width / 2, height / 4 + 60);

    // Final stats
    fill(255);
    textSize(24);
    text(`Final Score: ${score}`, width / 2, height / 2);

    if (score > highScore) {
        fill(255, 255, 100);
        textSize(20);
        text('NEW HIGH SCORE!', width / 2, height / 2 + 40);
    }

    // Credits
    fill(200, 200, 255);
    textSize(16);
    text('Thank you for playing!', width / 2, height / 2 + 100);

    fill(150, 150, 200);
    textSize(12);
    text('Inspired by ZANAC (1986) - Compile', width / 2, height / 2 + 130);
    text('ZNK - A fan-made tribute', width / 2, height / 2 + 150);

    // Restart instruction (only after 3 minutes = 180,000 milliseconds)
    let elapsedTime = millis() - endingStartTime;
    if (elapsedTime >= 180000) {
        fill(255);
        textSize(14);
        text('Press SPACE or ENTER to Return to Title', width / 2, height - 60);
    }

    pop();
}

function drawPaused() {
    push();

    // Debug mode enemy preview
    if (debugMode && debugEnemyPreviewMode) {
        drawEnemyPreview();
    } else {
        // Normal pause screen
        fill(0, 0, 0, 200);
        rect(0, height / 2 - 80, width, 160);

        fill(255);
        textSize(32);
        textAlign(CENTER, CENTER);
        text('PAUSED', width / 2, height / 2 - 30);

        textSize(14);
        text('Press P to Resume', width / 2, height / 2 + 10);

        // Show weapon info
        textSize(12);
        fill(200);
        text(`Main Weapon: Level ${player.mainWeaponLevel}`, width / 2, height / 2 + 40);
        text(`Sub Weapon: ${player.getSubWeaponName()} Level ${player.subWeaponLevel}`, width / 2, height / 2 + 58);

        // Debug mode hint
        if (debugMode) {
            fill(255, 255, 0);
            textSize(10);
            text('Press ← → to preview enemies', width / 2, height / 2 + 80);
        }
    }

    pop();
}

function drawEnemyPreview() {
    // Dark overlay
    fill(0, 0, 0, 230);
    rect(0, 0, width, height);

    let selectedEnemy = debugEnemyTypes[debugSelectedEnemyIndex];
    let enemyInfo = getEnemyInfo(selectedEnemy);

    // Title
    fill(100, 255, 255);
    textSize(24);
    textAlign(CENTER, TOP);
    text('ENEMY PREVIEW', width / 2, 20);

    // Enemy name
    fill(255, 200, 0);
    textSize(20);
    text(enemyInfo.displayName, width / 2, 60);

    // Enemy preview (simple representation)
    push();
    translate(width / 2, 140);
    fill(enemyInfo.color);
    noStroke();
    ellipse(0, 0, enemyInfo.size * 3, enemyInfo.size * 3);
    pop();

    // Enemy parameters
    fill(255);
    textSize(14);
    textAlign(LEFT, TOP);
    let infoY = 200;
    text(`Type: ${selectedEnemy}`, 60, infoY);
    text(`HP: ${enemyInfo.hp}`, 60, infoY + 20);
    text(`Speed: ${enemyInfo.speed.toFixed(1)}`, 60, infoY + 40);
    text(`Score: ${enemyInfo.scoreValue}`, 60, infoY + 60);
    text(`Can Shoot: ${enemyInfo.canShoot ? 'Yes' : 'No'}`, 60, infoY + 80);

    // Area selection
    fill(200, 200, 255);
    textSize(16);
    textAlign(CENTER, TOP);
    text(`Selected Area: ${debugSelectedArea}`, width / 2, 320);

    // Lock status
    if (debugLockedEnemy !== null) {
        fill(255, 100, 100);
        textSize(18);
        text(`LOCKED: ${debugLockedEnemy}`, width / 2, 360);
    }

    // Controls
    fill(200);
    textSize(12);
    textAlign(CENTER, BOTTOM);
    text('← →: Select Enemy  ↑ ↓: Select Area', width / 2, height - 60);
    text(`A/Z: ${debugLockedEnemy === null ? 'Lock Enemy' : 'Unlock Enemy'}`, width / 2, height - 40);
    text('P: Resume', width / 2, height - 20);
}

function getEnemyInfo(enemyType) {
    // Create a temporary enemy to get its parameters
    let tempEnemy = new Enemy(enemyType, 0, 0, 1.0);
    return {
        displayName: enemyType.toUpperCase(),
        hp: tempEnemy.hp,
        speed: tempEnemy.speed,
        size: tempEnemy.size,
        scoreValue: tempEnemy.scoreValue,
        canShoot: tempEnemy.canShoot,
        color: tempEnemy.color
    };
}

function checkCollisions() {
    // Player bullets vs enemies
    for (let i = bullets.length - 1; i >= 0; i--) {
        let bulletRemoved = false;

        for (let j = enemies.length - 1; j >= 0; j--) {
            if (bullets[i] && bullets[i].hits && bullets[i].hits(enemies[j])) {
                // Skip if already marked for deletion
                if (enemies[j].markedForDeletion) {
                    continue;
                }

                // Special handling for boss hits
                if (enemies[j].isBoss) {
                    enemies[j].hp -= bullets[i].damage;

                    // Weapon 1 (PenetratingBullet) - destroy on boss hit to prevent continuous damage
                    if (bullets[i] instanceof PenetratingBullet) {
                        bullets.splice(i, 1);
                        bulletRemoved = true;
                    }
                    // Weapons 4, 5 (boomerang) deflect from boss
                    else if (bullets[i] instanceof VibratingBullet ||
                        bullets[i] instanceof StraightLaserBullet ||
                        bullets[i] instanceof BoomerangBullet) {
                        bullets[i].deflectFromBoss();
                        // Don't remove bullet, it bounces away
                        break;
                    }
                    // Other bullets hit normally
                    else if (!bullets[i].penetrating) {
                        bullets.splice(i, 1);
                        bulletRemoved = true;
                    }
                } else {
                    // Normal enemy hit
                    enemies[j].hp -= bullets[i].damage;

                    // Special handling for vibrating bullet (weapon 4)
                    if (bullets[i] instanceof VibratingBullet) {
                        if (bullets[i].onHit()) {
                            // Durability depleted
                            bullets.splice(i, 1);
                            bulletRemoved = true;
                        }
                    }
                    // Remove bullet unless it's penetrating
                    else if (!bullets[i].penetrating) {
                        bullets.splice(i, 1);
                        bulletRemoved = true;
                    }
                }

                // Enemy destroyed - check if HP <= 0 and not already marked
                if (enemies[j].hp <= 0 && !enemies[j].markedForDeletion) {
                    enemies[j].markedForDeletion = true;

                    addScore(enemies[j].scoreValue);
                    createExplosion(enemies[j].x, enemies[j].y, enemies[j].size);

                    // Check if boss defeated
                    if (enemies[j].isBoss && !areaManager.bossDefeated) {
                        // Only call once - guard with bossDefeated flag
                        areaManager.onBossDefeated();
                        // Boss drops multiple items (4-6 items: P-items and 0-7 weapons)
                        try {
                            let numDrops = int(random(4, 7)); // 4-6 items
                            for (let k = 0; k < numDrops; k++) {
                                // Random offset from boss position to scatter items
                                let offsetX = random(-40, 40);
                                let offsetY = random(-30, 30);
                                let dropX = enemies[j].x + offsetX;
                                let dropY = enemies[j].y + offsetY;

                                // 50% P-item, 50% Sub weapon
                                if (random() < 0.5) {
                                    powerUps.push(new PowerChip(dropX, dropY));
                                } else {
                                    powerUps.push(new SubWeapon(dropX, dropY, int(random(0, 8))));
                                }
                            }
                        } catch (e) {
                            console.error("Error creating boss power-ups:", e);
                        }
                    } else if (!enemies[j].isBoss) {
                        // Drop powerup chance (30% for any, then split between types)
                        if (random() < 0.30) {
                            // 45% power chip, 50% sub weapon, 5% 1UP (for high-value enemies)
                            let dropRoll = random();
                            if (dropRoll < 0.45) {
                                powerUps.push(new PowerChip(enemies[j].x, enemies[j].y));
                            } else if (dropRoll < 0.95) {
                                powerUps.push(new SubWeapon(enemies[j].x, enemies[j].y));
                            } else if (enemies[j].scoreValue >= 80) {
                                // Only high-value enemies drop 1UP
                                powerUps.push(new OneUpItem(enemies[j].x, enemies[j].y));
                            }
                        }
                    }

                    // Call onDestroyed for special enemy behaviors (e.g., divider splits)
                    enemies[j].onDestroyed();
                    enemies.splice(j, 1);
                    enemyManager.onEnemyDestroyed();
                }

                if (bulletRemoved) break;
            }
        }

        // Bullets vs 1UP items (shooting makes them red)
        if (bullets[i]) {
            for (let j = powerUps.length - 1; j >= 0; j--) {
                if (powerUps[j] instanceof OneUpItem) {
                    let d = dist(bullets[i].x, bullets[i].y, powerUps[j].x, powerUps[j].y);
                    if (d < bullets[i].size + powerUps[j].size) {
                        powerUps[j].hit();
                        if (!bullets[i].penetrating) {
                            bullets.splice(i, 1);
                        }
                        break;
                    }
                }
            }
        }

        // Bullets vs ground enemies
        if (bullets[i]) {
            for (let j = groundEnemies.length - 1; j >= 0; j--) {
                if (bullets[i].hits && bullets[i].hits(groundEnemies[j])) {
                    // Skip if already marked for deletion
                    if (groundEnemies[j].markedForDeletion) {
                        continue;
                    }

                    groundEnemies[j].hp -= bullets[i].damage;

                    // Special handling for vibrating bullet (weapon 4)
                    if (bullets[i] instanceof VibratingBullet) {
                        if (bullets[i].onHit()) {
                            bullets.splice(i, 1);
                            bulletRemoved = true;
                        }
                    }
                    else if (!bullets[i].penetrating) {
                        bullets.splice(i, 1);
                        bulletRemoved = true;
                    }

                    // Ground enemy destroyed - HP must be 0 or below and not already marked
                    if (groundEnemies[j].hp <= 0 && !groundEnemies[j].markedForDeletion) {
                        groundEnemies[j].markedForDeletion = true;

                        addScore(groundEnemies[j].scoreValue);
                        createExplosion(groundEnemies[j].x, groundEnemies[j].y, groundEnemies[j].size);

                        // Call onDestroyed for special behaviors (AI-AI, Supply Base, etc.)
                        if (groundEnemies[j].onDestroyed) {
                            groundEnemies[j].onDestroyed();
                        }

                        // Normal ground enemies have better drop rates (not AI-AI or Supply Base)
                        if (!groundEnemies[j].isSpecial && !groundEnemies[j].isSupplyBase) {
                            if (random() < 0.40) {
                                let dropRoll = random();
                                if (dropRoll < 0.5) {
                                    powerUps.push(new PowerChip(groundEnemies[j].x, groundEnemies[j].y));
                                } else {
                                    powerUps.push(new SubWeapon(groundEnemies[j].x, groundEnemies[j].y));
                                }
                            }
                        }

                        groundEnemies.splice(j, 1);
                    }

                    if (bulletRemoved) break;
                }
            }
        }

        // Bullets vs PowerBox formations
        if (bullets[i] && areaManager && areaManager.powerBoxFormations) {
            for (let formation of areaManager.powerBoxFormations) {
                for (let box of formation.getBoxes()) {
                    if (box.hp > 0 && bullets[i].hits && bullets[i].hits(box)) {
                        // Mark formation as touched when hit by bullet
                        formation.touched = true;

                        box.hp -= bullets[i].damage;

                        // Special handling for vibrating bullet
                        if (bullets[i] instanceof VibratingBullet) {
                            if (bullets[i].onHit()) {
                                bullets.splice(i, 1);
                                bulletRemoved = true;
                            }
                        } else if (!bullets[i].penetrating) {
                            bullets.splice(i, 1);
                            bulletRemoved = true;
                        }

                        // PowerBox destroyed
                        if (box.hp <= 0) {
                            addScore(box.scoreValue);
                            createExplosion(box.x, box.y, box.size);
                            box.onDestroyed();
                        }

                        if (bulletRemoved) break;
                    }
                }
                if (bulletRemoved) break;
            }
        }

        // Bullets vs Crow
        if (bullets[i] && areaManager && areaManager.crow) {
            let crow = areaManager.crow;
            if (crow.hp > 0 && bullets[i].hits && bullets[i].hits(crow)) {
                crow.hp -= bullets[i].damage;

                // Remove bullet (crow has 1 HP so it will die)
                if (!bullets[i].penetrating) {
                    bullets.splice(i, 1);
                    bulletRemoved = true;
                }

                // Crow destroyed
                if (crow.hp <= 0) {
                    addScore(crow.scoreValue);
                    createExplosion(crow.x, crow.y, crow.size * 2);
                    crow.onDestroyed();
                    areaManager.crow = null; // Remove crow
                }

                if (bulletRemoved) break;
            }
        }
    }

    // Player bullets vs enemy bullets (bullet-on-bullet collision)
    // Check if player bullets can destroy enemy bullets (Sig bullets)
    for (let i = bullets.length - 1; i >= 0; i--) {
        if (!bullets[i]) continue;
        let bulletRemoved = false;

        for (let j = enemyBullets.length - 1; j >= 0; j--) {
            if (!enemyBullets[j]) continue;

            // Check distance between bullets
            let d = dist(bullets[i].x, bullets[i].y, enemyBullets[j].x, enemyBullets[j].y);
            if (d < bullets[i].size + enemyBullets[j].size) {
                // Collision detected!

                // Check if enemy bullet is destructible
                if (enemyBullets[j].bulletType === 'sig' && enemyBullets[j].destructible) {
                    // Sig bullet - reduce HP
                    enemyBullets[j].hp -= bullets[i].damage;

                    if (enemyBullets[j].hp <= 0) {
                        // Sig bullet destroyed!
                        createExplosion(enemyBullets[j].x, enemyBullets[j].y, enemyBullets[j].size);
                        enemyBullets.splice(j, 1);
                    }

                    // Remove player bullet unless it's penetrating
                    if (!bullets[i].penetrating && !(bullets[i] instanceof VibratingBullet)) {
                        bullets.splice(i, 1);
                        bulletRemoved = true;
                    }
                    break;
                } else if (enemyBullets[j].bulletType === 'lead') {
                    // Lead bullet - only weapons 1, 2, 5 can destroy
                    // This is handled in weapon-specific code in bullet.js
                    // Player bullets just pass through Lead bullets normally
                }
            }
        }

        if (bulletRemoved) break;
    }

    // Enemy bullets vs player
    if (player.alive && !player.invulnerable) {
        for (let i = enemyBullets.length - 1; i >= 0; i--) {
            if (enemyBullets[i].hits(player)) {
                enemyBullets.splice(i, 1);

                // Lv5 Weapon 2 (Barrier) grants immunity even if bullet penetrates
                if (player.subWeaponType === 2 &&
                    player.subWeaponLevel >= 5 &&
                    player.subWeaponActive) {
                    // Bullet destroyed but player takes no damage
                    // Reduce barrier durability by 1 for penetrating hit
                    if (player.subWeaponActive.durability > 0) {
                        player.subWeaponActive.durability--;
                        player.subWeaponDurability = player.subWeaponActive.durability;
                    }
                    continue;
                }

                player.hit();
                enemyManager.onPlayerHit();
                break;
            }
        }

        // Enemies vs player (collision)
        for (let i = enemies.length - 1; i >= 0; i--) {
            let d = dist(player.x, player.y, enemies[i].x, enemies[i].y);
            if (d < player.hitboxSize + enemies[i].size) {
                createExplosion(enemies[i].x, enemies[i].y, enemies[i].size);
                enemies[i].onDestroyed();
                enemies.splice(i, 1);
                player.hit();
                enemyManager.onPlayerHit();
            }
        }

        // Ground enemies vs player (collision) - DISABLED
        // Ground enemies are ground-based, so player can pass over them without taking damage
        // They can only damage player with their bullets
        /*
        for (let i = groundEnemies.length - 1; i >= 0; i--) {
            let d = dist(player.x, player.y, groundEnemies[i].x, groundEnemies[i].y);
            if (d < player.hitboxSize + groundEnemies[i].size) {
                // AI-AI and Supply Bases don't damage player on contact
                if (!groundEnemies[i].isSpecial && !groundEnemies[i].isSupplyBase) {
                    createExplosion(groundEnemies[i].x, groundEnemies[i].y, groundEnemies[i].size);
                    groundEnemies[i].onDestroyed();
                    groundEnemies.splice(i, 1);
                    player.hit();
                    enemyManager.onPlayerHit();
                }
            }
        }
        */
    }

    // PowerBox vs player (special collision handling)
    // IMPORTANT: This is OUTSIDE the invulnerability check - boxes must be destroyed even when player is invulnerable
    if (player.alive && areaManager && areaManager.powerBoxFormations) {
        for (let formation of areaManager.powerBoxFormations) {
            for (let box of formation.getBoxes()) {
                if (box.hp > 0) {
                    // Use PowerBox's special collision method
                    if (box.checkPlayerCollision(player)) {
                        // Collision was handled by PowerBox (either bonus or damage)
                        // Note: checkPlayerCollision handles all logic including damage/bonus
                    }
                }
            }
        }
    }

    // Player vs powerups
    if (player.alive) {
        for (let i = powerUps.length - 1; i >= 0; i--) {
            let d = dist(player.x, player.y, powerUps[i].x, powerUps[i].y);
            if (d < player.hitboxSize + powerUps[i].size) {
                // Check type
                if (powerUps[i].type === 'powerchip' || powerUps[i] instanceof PowerChip) {
                    player.collectPowerChip();
                    addScore(50);
                } else if (powerUps[i].type === '1up' || powerUps[i] instanceof OneUpItem) {
                    // 1UP item
                    player.lives++;
                    // Red 1UP gives more score
                    if (powerUps[i].isRed) {
                        addScore(10000);
                    } else {
                        addScore(5000);
                    }
                    // Visual effect
                    for (let j = 0; j < 30; j++) {
                        particles.push(new Particle(powerUps[i].x, powerUps[i].y, 15, color(255, 255, 100)));
                    }
                } else {
                    player.collectSubWeapon(powerUps[i].type);
                    addScore(100);
                }
                powerUps.splice(i, 1);
            }
        }
    }
}

function addScore(points) {
    // Don't add score during game over
    if (gameState === GAME_STATE.GAME_OVER) {
        return;
    }

    let oldScore = score;
    score += points;

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('znk_highscore', highScore);
    }

    // Check for 1UP by score
    // Until 100,000: every 10,000 points
    // After 100,000: every 50,000 points
    while (score >= nextExtraLifeScore) {
        // Grant 1UP
        if (player && player.alive) {
            player.lives++;
            // Visual feedback for 1UP
            for (let i = 0; i < 30; i++) {
                particles.push(new Particle(player.x, player.y, 15, color(100, 255, 100)));
            }
        }

        // Update next threshold
        if (nextExtraLifeScore < 100000) {
            // Before 100k: increment by 10k
            nextExtraLifeScore += 10000;
        } else {
            // After 100k: increment by 50k
            nextExtraLifeScore += 50000;
        }
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
        } else if (gameState === GAME_STATE.ENDING) {
            // Only allow exit after 3 minutes
            let elapsedTime = millis() - endingStartTime;
            if (elapsedTime >= 180000) {
                gameState = GAME_STATE.TITLE;
            }
        }
    }

    if (key === 'p' || key === 'P') {
        if (gameState === GAME_STATE.PLAYING) {
            gameState = GAME_STATE.PAUSED;
        } else if (gameState === GAME_STATE.PAUSED) {
            gameState = GAME_STATE.PLAYING;
        }
    }

    if ((key === 'd' || key === 'D') && gameState === GAME_STATE.PAUSED) {
        dKeyPressCount++;
        dKeyPressTimer = 60;
        if (dKeyPressCount >= 3) {
            debugMode = !debugMode;
            dKeyPressCount = 0;

            // When debug mode is activated
            if (debugMode && player) {
                player.lives = 30; // Set lives to 30
                console.log('DEBUG MODE ACTIVATED: Lives set to 30');
            }

            // Reset preview mode when debug mode is toggled off
            if (!debugMode) {
                debugEnemyPreviewMode = false;
            }
        }
    }

    // Debug mode enemy preview controls (when paused and debug mode is on)
    if (debugMode && gameState === GAME_STATE.PAUSED) {
        if (keyCode === LEFT_ARROW) {
            debugEnemyPreviewMode = true;
            debugSelectedEnemyIndex = (debugSelectedEnemyIndex - 1 + debugEnemyTypes.length) % debugEnemyTypes.length;
        } else if (keyCode === RIGHT_ARROW) {
            debugEnemyPreviewMode = true;
            debugSelectedEnemyIndex = (debugSelectedEnemyIndex + 1) % debugEnemyTypes.length;
        } else if (keyCode === UP_ARROW) {
            debugEnemyPreviewMode = true;
            debugSelectedArea = constrain(debugSelectedArea - 1, 1, 12);
        } else if (keyCode === DOWN_ARROW) {
            debugEnemyPreviewMode = true;
            debugSelectedArea = constrain(debugSelectedArea + 1, 1, 12);
        } else if (key === 'a' || key === 'A' || key === 'z' || key === 'Z') {
            // Toggle enemy lock
            if (debugLockedEnemy === null) {
                // Lock the selected enemy and set area
                debugLockedEnemy = debugEnemyTypes[debugSelectedEnemyIndex];

                // Change area if needed
                if (areaManager && debugSelectedArea !== areaManager.currentArea) {
                    // Clear all enemies and bullets
                    enemies = [];
                    enemyBullets = [];
                    groundEnemies = [];

                    // Reset area manager state
                    areaManager.currentArea = debugSelectedArea;
                    areaManager.areaProgress = 0;
                    areaManager.bossActive = false;
                    areaManager.bossDefeated = false;
                    areaManager.bossDefeatedTimer = 0;
                    areaManager.currentConfig = areaManager.areaConfigs[debugSelectedArea - 1];

                    // Reset area-specific flags
                    areaManager.groundEnemies = [];
                    areaManager.groundEnemySpawnPoints = [];
                    areaManager.aiaiSpawned = false;
                    areaManager.supplyBasesSpawned = [];
                    areaManager.powerBoxFormations = [];
                    areaManager.powerBoxMassSpawned = false;
                    areaManager.crow = null;
                    areaManager.crowSpawned = false;

                    // Reset boss intro state
                    areaManager.bossIntroPhase = 0;
                    areaManager.bossIntroTimer = 0;
                    areaManager.bossIntroScrollSpeed = 0;
                    areaManager.bossIntroTargetY = 0;

                    // Reset scroll speed based on area config
                    if (areaManager.currentConfig.hasHighSpeed) {
                        areaManager.normalScrollSpeed = 1.5;
                        areaManager.highScrollSpeed = areaManager.currentConfig.scrollSpeed;
                        areaManager.scrollSpeed = areaManager.highScrollSpeed;
                        areaManager.isInHighSpeed = true;
                    } else {
                        areaManager.scrollSpeed = 1.5;
                        areaManager.normalScrollSpeed = 1.5;
                        areaManager.isInHighSpeed = false;
                    }

                    console.log(`Area changed to: ${debugSelectedArea}`);
                }

                console.log(`Enemy locked: ${debugLockedEnemy} (Area ${debugSelectedArea})`);
            } else {
                // Unlock
                debugLockedEnemy = null;
                console.log('Enemy unlocked');
            }
        }
    }
}

