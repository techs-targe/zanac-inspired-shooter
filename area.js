// Area/Stage System - 12 Areas like ZANAC
class AreaManager {
    constructor() {
        this.currentArea = 1;
        this.maxArea = 12;
        this.areaProgress = 0; // 0-1000, represents progress through area
        this.areaLength = 3000; // Frames per area (50 seconds at 60fps)
        this.bossActive = false;
        this.bossDefeated = false;
        this.bossDefeatedTimer = 0; // Frames to wait after boss defeat
        this.groundEnemies = [];
        this.groundEnemySpawnPoints = [];
        this.aiaiSpawned = false; // Track if AI-AI has spawned in this area
        this.supplyBasesSpawned = []; // Track which supply bases have been spawned
        this.powerBoxFormations = []; // Track PowerBox formations
        this.powerBoxMassSpawned = false; // Track if mass spawn has occurred
        this.crow = null; // Special crow enemy
        this.crowSpawned = false; // Track if crow has spawned in this area
        this.scrollSpeed = 1.5; // Default scroll speed
        this.normalScrollSpeed = 1.5; // Normal scroll speed
        this.highScrollSpeed = 1.5; // High scroll speed for high-speed areas
        this.isInHighSpeed = false; // Track if currently in high-speed section

        // Area configurations
        this.areaConfigs = this.initAreaConfigs();
        this.currentConfig = this.areaConfigs[this.currentArea - 1];

        // Initialize high-speed tracking
        if (this.currentConfig.hasHighSpeed) {
            this.normalScrollSpeed = 1.5;
            this.highScrollSpeed = this.currentConfig.scrollSpeed;
            this.scrollSpeed = this.highScrollSpeed;
            this.isInHighSpeed = true;
        } else {
            this.scrollSpeed = 1.5;
        }
    }

    initAreaConfigs() {
        return [
            { // Area 1 - Desert/Crater
                number: 1,
                name: 'Wasteland',
                bgColor: {r: 40, g: 30, b: 20},
                terrainColor: {r: 120, g: 90, b: 60},
                bossType: 'default',
                difficulty: 1.0,
                groundEnemyFreq: 0.15, // Increased from 0.02
                specialFeature: 'craters'
            },
            { // Area 2 - Forest (HIGH SPEED)
                number: 2,
                name: 'Forest Zone',
                bgColor: {r: 20, g: 40, b: 20},
                terrainColor: {r: 40, g: 120, b: 40},
                bossType: 'organic',
                difficulty: 1.2,
                groundEnemyFreq: 0.18,
                specialFeature: 'trees',
                hasHighSpeed: true,
                scrollSpeed: 4.0
            },
            { // Area 3 - Ocean/Coast
                number: 3,
                name: 'Coastal Area',
                bgColor: {r: 20, g: 30, b: 60},
                terrainColor: {r: 40, g: 80, b: 140},
                bossType: 'default',
                difficulty: 1.4,
                groundEnemyFreq: 0.16, // Increased from 0.025
                specialFeature: 'waves',
                hasRio: true,
                hasAiai: true
            },
            { // Area 4 - Alien Surface
                number: 4,
                name: 'Alien World',
                bgColor: {r: 40, g: 20, b: 50},
                terrainColor: {r: 120, g: 60, b: 140},
                bossType: 'organic',
                difficulty: 1.6,
                groundEnemyFreq: 0.20, // Increased from 0.035
                specialFeature: 'alien',
                hasRio: true
            },
            { // Area 5 - Space (HIGH SPEED)
                number: 5,
                name: 'Asteroid Field',
                bgColor: {r: 5, g: 5, b: 15},
                terrainColor: {r: 80, g: 80, b: 80},
                bossType: 'mech',
                difficulty: 1.8,
                groundEnemyFreq: 0.15,
                specialFeature: 'asteroids',
                hasAiai: true,
                hasHighSpeed: true,
                scrollSpeed: 4.5
            },
            { // Area 6 - Ruins
                number: 6,
                name: 'Ancient Ruins',
                bgColor: {r: 50, g: 40, b: 30},
                terrainColor: {r: 140, g: 110, b: 80},
                bossType: 'fortress',
                difficulty: 2.0,
                groundEnemyFreq: 0.22, // Increased from 0.04
                specialFeature: 'ruins',
                hasRio: true
            },
            { // Area 7 - Colony
                number: 7,
                name: 'Space Colony',
                bgColor: {r: 30, g: 30, b: 40},
                terrainColor: {r: 100, g: 100, b: 120},
                bossType: 'mech',
                difficulty: 2.2,
                groundEnemyFreq: 0.18, // Increased from 0.03
                specialFeature: 'colony',
                hasWarps: true
            },
            { // Area 8 - Organic (HIGH SPEED)
                number: 8,
                name: 'Bio-Zone',
                bgColor: {r: 30, g: 50, b: 30},
                terrainColor: {r: 80, g: 140, b: 80},
                bossType: 'organic',
                difficulty: 2.4,
                groundEnemyFreq: 0.25,
                specialFeature: 'organic',
                hasAiai: true,
                hasHighSpeed: true,
                scrollSpeed: 5.0
            },
            { // Area 9 - Mechanical Base
                number: 9,
                name: 'Mech Base',
                bgColor: {r: 40, g: 30, b: 25},
                terrainColor: {r: 120, g: 90, b: 70},
                bossType: 'fortress',
                difficulty: 2.6,
                groundEnemyFreq: 0.28, // Increased from 0.05
                specialFeature: 'mechanical'
            },
            { // Area 10 - Red Base (HIGH SPEED)
                number: 10,
                name: 'Red Fortress',
                bgColor: {r: 50, g: 20, b: 20},
                terrainColor: {r: 150, g: 60, b: 60},
                bossType: 'fortress',
                difficulty: 2.8,
                groundEnemyFreq: 0.28,
                specialFeature: 'fortress',
                hasRio: true,
                hasHighSpeed: true,
                scrollSpeed: 5.5
            },
            { // Area 11 - Pipeline (HIGH SPEED)
                number: 11,
                name: 'Core Pipeline',
                bgColor: {r: 20, g: 40, b: 50},
                terrainColor: {r: 60, g: 120, b: 150},
                bossType: 'mech',
                difficulty: 3.0,
                groundEnemyFreq: 0.32,
                specialFeature: 'pipes',
                hasAiai: true,
                hasHighSpeed: true,
                scrollSpeed: 6.0
            },
            { // Area 12 - Final (HIGH SPEED)
                number: 12,
                name: 'System Core',
                bgColor: {r: 40, g: 60, b: 20},
                terrainColor: {r: 100, g: 180, b: 60},
                bossType: 'final',
                difficulty: 3.5,
                groundEnemyFreq: 0.35,
                specialFeature: 'core',
                hasRio: true,
                hasAiai: true,
                hasHighSpeed: true,
                scrollSpeed: 6.5
            }
        ];
    }

    update() {
        // Handle boss defeated timer
        if (this.bossDefeatedTimer > 0) {
            this.bossDefeatedTimer--;
            if (this.bossDefeatedTimer <= 0) {
                this.nextArea();
            }
            return;
        }

        if (this.bossActive) {
            // Boss battle - no progress
            return;
        }

        this.areaProgress++;

        // Handle high-speed area transitions
        // High-speed for first half (0-1500), normal for second half (1500-3000)
        if (this.currentConfig.hasHighSpeed && this.areaProgress === 1500 && this.isInHighSpeed) {
            // Switch from high-speed to normal at midpoint
            this.scrollSpeed = this.normalScrollSpeed;
            this.isInHighSpeed = false;
        }

        // Spawn supply bases at specific progress points
        this.spawnSupplyBases();

        // Spawn PowerBox formations
        this.spawnPowerBoxes();

        // Update PowerBox formations
        this.updatePowerBoxFormations();

        // Spawn AI-AI at midpoint (progress = 1500) in specific areas
        if (this.areaProgress === 1500 && this.currentConfig.hasAiai && !this.aiaiSpawned) {
            this.spawnAIAI();
            this.aiaiSpawned = true;
        }

        // Spawn Crow at midpoint (progress = 1500) in areas 4, 8, 12
        if (this.areaProgress === 1500 && !this.crowSpawned) {
            if (this.currentArea === 4 || this.currentArea === 8 || this.currentArea === 12) {
                this.spawnCrow();
                this.crowSpawned = true;
            }
        }

        // Update Crow if active
        if (this.crow) {
            this.crow.update();
            // Remove if offscreen
            if (this.crow.isOffscreen()) {
                this.crow = null;
            }
        }

        // Spawn ground enemies based on area configuration - increased frequency
        if (frameCount % 60 === 0 && random() < this.currentConfig.groundEnemyFreq) {
            this.spawnGroundEnemy();
        }

        // Check if area complete
        if (this.areaProgress >= this.areaLength) {
            this.spawnBoss();
        }
    }

    spawnGroundEnemy() {
        let x = random(50, GAME_WIDTH - 50);
        let y = GAME_HEIGHT + 40; // Spawn BELOW screen (ground enemies scroll UP)
        let type = random() < 0.3 ? 'core' : 'turret';
        let level = this.currentArea;

        // Pass scroll speed to ground enemy
        let enemy = new GroundEnemy(x, y, type, level);
        enemy.scrollSpeed = this.scrollSpeed;
        this.groundEnemies.push(enemy);
    }

    spawnAIAI() {
        // Spawn special AI-AI enemy at screen edge (left or right)
        let x = random() < 0.5 ? 30 : GAME_WIDTH - 30; // Left or right edge
        let y = GAME_HEIGHT + 40; // Spawn BELOW screen (ground enemies scroll UP)
        this.groundEnemies.push(new SpecialAIAI(x, y));
    }

    spawnCrow() {
        // Spawn special Crow bonus enemy
        this.crow = new SpecialCrow();
        console.log('Crow spawned! Shoot with sub weapon before using main weapon for 1UP!');
    }

    getSupplyBasePattern(areaNumber) {
        // Hardcoded supply base patterns for each area (5 bases per area)
        // Each pattern is an array of {progress, positions[]}
        const patterns = {
            1: [ // Edges pattern
                {progress: 500, x: 30},
                {progress: 800, x: GAME_WIDTH - 30},
                {progress: 1200, x: 30},
                {progress: 1800, x: GAME_WIDTH - 30},
                {progress: 2400, x: GAME_WIDTH / 2}
            ],
            2: [ // Center cluster
                {progress: 600, x: GAME_WIDTH / 2 - 40},
                {progress: 600, x: GAME_WIDTH / 2 + 40},
                {progress: 1400, x: GAME_WIDTH / 2 - 60},
                {progress: 1400, x: GAME_WIDTH / 2},
                {progress: 1400, x: GAME_WIDTH / 2 + 60}
            ],
            3: [ // Left side line
                {progress: 400, x: 50},
                {progress: 900, x: 50},
                {progress: 1400, x: 50},
                {progress: 1900, x: GAME_WIDTH - 50},
                {progress: 2500, x: GAME_WIDTH / 2}
            ],
            4: [ // Alternating
                {progress: 500, x: 40},
                {progress: 900, x: GAME_WIDTH - 40},
                {progress: 1300, x: 40},
                {progress: 1700, x: GAME_WIDTH - 40},
                {progress: 2200, x: GAME_WIDTH / 2}
            ],
            5: [ // Wide spread
                {progress: 700, x: 60},
                {progress: 700, x: GAME_WIDTH / 2},
                {progress: 700, x: GAME_WIDTH - 60},
                {progress: 1800, x: 40},
                {progress: 1800, x: GAME_WIDTH - 40}
            ],
            6: [ // Right side line
                {progress: 500, x: GAME_WIDTH - 50},
                {progress: 1000, x: GAME_WIDTH - 50},
                {progress: 1500, x: GAME_WIDTH - 50},
                {progress: 2000, x: 50},
                {progress: 2500, x: GAME_WIDTH / 2}
            ],
            7: [ // Diagonal pattern
                {progress: 600, x: 50},
                {progress: 1000, x: GAME_WIDTH / 4},
                {progress: 1400, x: GAME_WIDTH / 2},
                {progress: 1800, x: GAME_WIDTH * 3/4},
                {progress: 2200, x: GAME_WIDTH - 50}
            ],
            8: [ // Triple clusters
                {progress: 500, x: 50},
                {progress: 500, x: GAME_WIDTH / 2},
                {progress: 500, x: GAME_WIDTH - 50},
                {progress: 2000, x: 60},
                {progress: 2000, x: GAME_WIDTH - 60}
            ],
            9: [ // Center heavy
                {progress: 700, x: GAME_WIDTH / 2},
                {progress: 1100, x: GAME_WIDTH / 2 - 50},
                {progress: 1100, x: GAME_WIDTH / 2 + 50},
                {progress: 1900, x: 40},
                {progress: 1900, x: GAME_WIDTH - 40}
            ],
            10: [ // Edge heavy
                {progress: 600, x: 30},
                {progress: 1000, x: GAME_WIDTH - 30},
                {progress: 1400, x: 30},
                {progress: 1800, x: GAME_WIDTH - 30},
                {progress: 2200, x: 30}
            ],
            11: [ // Scattered
                {progress: 400, x: 70},
                {progress: 1000, x: GAME_WIDTH - 70},
                {progress: 1500, x: GAME_WIDTH / 2},
                {progress: 2000, x: 40},
                {progress: 2600, x: GAME_WIDTH - 40}
            ],
            12: [ // Final pattern - 6 bases
                {progress: 500, x: 50},
                {progress: 500, x: GAME_WIDTH - 50},
                {progress: 1200, x: GAME_WIDTH / 3},
                {progress: 1200, x: GAME_WIDTH * 2/3},
                {progress: 2000, x: GAME_WIDTH / 2 - 40},
                {progress: 2000, x: GAME_WIDTH / 2 + 40}
            ]
        };

        return patterns[areaNumber] || patterns[1];
    }

    spawnSupplyBases() {
        let pattern = this.getSupplyBasePattern(this.currentArea);

        for (let base of pattern) {
            // Check if this base should spawn at current progress
            if (this.areaProgress === base.progress && !this.supplyBasesSpawned.includes(base.progress)) {
                this.groundEnemies.push(new SupplyBase(base.x, GAME_HEIGHT + 40, this.scrollSpeed));
                this.supplyBasesSpawned.push(base.progress);
            }
        }
    }

    spawnPowerBoxFormation(x) {
        // Create a new PowerBox formation at the specified x position
        let formation = new PowerBoxFormation(x, -40);
        this.powerBoxFormations.push(formation);
    }

    spawnPowerBoxes() {
        // Random PowerBox spawning in all areas (low frequency)
        if (frameCount % 180 === 0 && random() < 0.15) { // Every 3 seconds, 15% chance
            let x = random(60, GAME_WIDTH - 60);
            this.spawnPowerBoxFormation(x);
        }

        // Mass spawn at 30% progress (900) in areas 3, 7, 10
        if (!this.powerBoxMassSpawned && this.areaProgress === 900) {
            if (this.currentArea === 3 || this.currentArea === 7 || this.currentArea === 10) {
                // Spawn 5-7 formations in quick succession
                let numFormations = int(random(5, 8));
                for (let i = 0; i < numFormations; i++) {
                    setTimeout(() => {
                        let x = random(60, GAME_WIDTH - 60);
                        this.spawnPowerBoxFormation(x);
                    }, i * 300); // Spawn one every 0.3 seconds
                }
                this.powerBoxMassSpawned = true;
            }
        }
    }

    updatePowerBoxFormations() {
        // Update all PowerBox formations
        for (let i = this.powerBoxFormations.length - 1; i >= 0; i--) {
            let formation = this.powerBoxFormations[i];
            formation.update();

            // Remove if all boxes destroyed or offscreen
            if (formation.allDestroyed() || formation.isOffscreen()) {
                this.powerBoxFormations.splice(i, 1);
            }
        }
    }

    drawPowerBoxFormations() {
        // Draw all PowerBox formations
        for (let formation of this.powerBoxFormations) {
            formation.draw();
        }
    }

    spawnBoss() {
        if (!this.bossActive && !this.bossDefeated) {
            this.bossActive = true;
            let boss = new BossEnemy(this.currentConfig.bossType, this.currentArea);
            enemies.push(boss);
        }
    }

    onBossDefeated() {
        this.bossActive = false;
        this.bossDefeated = true;
        this.bossDefeatedTimer = 180; // 3 second delay (60 fps * 3)
    }

    nextArea() {
        if (this.currentArea < this.maxArea) {
            this.currentArea++;
            this.areaProgress = 0;
            this.bossActive = false;
            this.bossDefeated = false;
            this.bossDefeatedTimer = 0;
            this.aiaiSpawned = false; // Reset AI-AI spawn flag
            this.supplyBasesSpawned = []; // Reset supply base spawn tracking
            this.powerBoxFormations = []; // Reset PowerBox formations
            this.powerBoxMassSpawned = false; // Reset mass spawn flag
            this.crow = null; // Reset Crow
            this.crowSpawned = false; // Reset Crow spawn flag
            this.groundEnemies = [];
            this.currentConfig = this.areaConfigs[this.currentArea - 1];

            // Reset high-speed tracking for new area
            if (this.currentConfig.hasHighSpeed) {
                this.normalScrollSpeed = 1.5;
                this.highScrollSpeed = this.currentConfig.scrollSpeed;
                this.scrollSpeed = this.highScrollSpeed;
                this.isInHighSpeed = true;
            } else {
                this.scrollSpeed = 1.5;
                this.isInHighSpeed = false;
            }

            // Visual notification
            console.log(`Entering Area ${this.currentArea}: ${this.currentConfig.name}`);
        } else {
            // Game complete!
            this.onGameComplete();
        }
    }

    onGameComplete() {
        // TODO: Show ending screen
        console.log('Game Complete! You defeated the System!');
    }

    getBackgroundColors() {
        return this.currentConfig.bgColor;
    }

    getTerrainColor() {
        return this.currentConfig.terrainColor;
    }

    getDifficultyMultiplier() {
        return this.currentConfig.difficulty;
    }

    drawAreaInfo() {
        push();
        fill(255, 255, 100);
        textSize(12);
        textAlign(RIGHT, TOP);
        text(`AREA ${this.currentArea}`, GAME_WIDTH - 10, 46);
        textSize(10);
        text(this.currentConfig.name, GAME_WIDTH - 10, 62);

        // Progress bar
        if (!this.bossActive) {
            let progressPercent = this.areaProgress / this.areaLength;
            let barWidth = 100;
            let barX = GAME_WIDTH - 10 - barWidth;
            let barY = 75;

            fill(50, 50, 50);
            rect(barX, barY, barWidth, 4);

            fill(100, 255, 100);
            rect(barX, barY, barWidth * progressPercent, 4);
        } else {
            fill(255, 100, 100);
            text('BOSS FIGHT!', GAME_WIDTH - 10, 75);
        }

        pop();
    }

    drawBackground() {
        push();

        // Area-specific background
        let bg = this.getBackgroundColors();
        let terrain = this.getTerrainColor();

        // Stars (for space areas OR high-speed areas)
        if (this.currentConfig.specialFeature === 'asteroids' ||
            this.currentConfig.specialFeature === 'colony' ||
            this.currentConfig.hasHighSpeed) {
            stroke(bg.r + 40, bg.g + 40, bg.b + 80);
            strokeWeight(1);
            // More stars for high-speed areas, and they move faster
            let starCount = this.currentConfig.hasHighSpeed ? 120 : 80;
            for (let i = 0; i < starCount; i++) {
                let x = (i * 37) % width;
                let y = ((i * 73 + scrollOffset * (1 + i % 3)) % height);
                point(x, y);
            }
        }

        // Grid
        stroke(bg.r + 20, bg.g + 20, bg.b + 40, 100);
        strokeWeight(1);
        let gridSize = 40;
        for (let i = 0; i < height / gridSize + 2; i++) {
            let y = (i * gridSize - (scrollOffset % gridSize)) % height;
            line(0, y, width, y);
        }

        // Special features
        this.drawSpecialFeatures(terrain);

        pop();
    }

    drawSpecialFeatures(terrain) {
        switch(this.currentConfig.specialFeature) {
            case 'craters':
                // Draw some crater-like circles
                noFill();
                stroke(terrain.r, terrain.g, terrain.b, 100);
                for (let i = 0; i < 5; i++) {
                    let x = (i * 100 + scrollOffset * 0.3) % width;
                    let y = (i * 150 + scrollOffset * 0.5) % height;
                    ellipse(x, y, 30 + i * 10);
                }
                break;

            case 'waves':
                // Water waves
                noFill();
                stroke(terrain.r, terrain.g, terrain.b, 150);
                for (let i = 0; i < 3; i++) {
                    beginShape();
                    for (let x = 0; x < width; x += 10) {
                        let y = height - 100 + sin((x + scrollOffset * 2 + i * 50) * 0.05) * 10;
                        vertex(x, y);
                    }
                    endShape();
                }
                break;

            case 'pipes':
                // Pipeline structures
                fill(terrain.r, terrain.g, terrain.b, 100);
                noStroke();
                for (let i = 0; i < 3; i++) {
                    let x = i * 160;
                    let y = (scrollOffset + i * 200) % (height + 200);
                    rect(x, y, 40, 100);
                }
                break;
        }
    }
}
