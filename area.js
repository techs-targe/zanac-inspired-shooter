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

        // Area configurations
        this.areaConfigs = this.initAreaConfigs();
        this.currentConfig = this.areaConfigs[this.currentArea - 1];
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
            { // Area 2 - Forest
                number: 2,
                name: 'Forest Zone',
                bgColor: {r: 20, g: 40, b: 20},
                terrainColor: {r: 40, g: 120, b: 40},
                bossType: 'organic',
                difficulty: 1.2,
                groundEnemyFreq: 0.18, // Increased from 0.03
                specialFeature: 'trees',
                hasAiai: true
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
            { // Area 5 - Space
                number: 5,
                name: 'Asteroid Field',
                bgColor: {r: 5, g: 5, b: 15},
                terrainColor: {r: 80, g: 80, b: 80},
                bossType: 'mech',
                difficulty: 1.8,
                groundEnemyFreq: 0.15, // Increased from 0.02
                specialFeature: 'asteroids',
                hasAiai: true
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
            { // Area 8 - Organic
                number: 8,
                name: 'Bio-Zone',
                bgColor: {r: 30, g: 50, b: 30},
                terrainColor: {r: 80, g: 140, b: 80},
                bossType: 'organic',
                difficulty: 2.4,
                groundEnemyFreq: 0.25, // Increased from 0.045
                specialFeature: 'organic',
                hasAiai: true
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
            { // Area 10 - Red Base
                number: 10,
                name: 'Red Fortress',
                bgColor: {r: 50, g: 20, b: 20},
                terrainColor: {r: 150, g: 60, b: 60},
                bossType: 'fortress',
                difficulty: 2.8,
                groundEnemyFreq: 0.28, // Increased from 0.05
                specialFeature: 'fortress',
                hasRio: true
            },
            { // Area 11 - Pipeline
                number: 11,
                name: 'Core Pipeline',
                bgColor: {r: 20, g: 40, b: 50},
                terrainColor: {r: 60, g: 120, b: 150},
                bossType: 'mech',
                difficulty: 3.0,
                groundEnemyFreq: 0.32, // Increased from 0.06
                specialFeature: 'pipes',
                hasAiai: true
            },
            { // Area 12 - Final
                number: 12,
                name: 'System Core',
                bgColor: {r: 40, g: 60, b: 20},
                terrainColor: {r: 100, g: 180, b: 60},
                bossType: 'final',
                difficulty: 3.5,
                groundEnemyFreq: 0.35, // Increased from 0.07
                specialFeature: 'core',
                hasRio: true,
                hasAiai: true
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
        let y = -40; // Spawn above screen
        let targetY = GAME_HEIGHT - 60; // Target position near bottom
        let type = random() < 0.3 ? 'core' : 'turret';
        let level = this.currentArea;

        this.groundEnemies.push(new GroundEnemy(x, y, type, level, targetY));
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
            this.groundEnemies = [];
            this.currentConfig = this.areaConfigs[this.currentArea - 1];

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

        // Stars (for space areas)
        if (this.currentConfig.specialFeature === 'asteroids' ||
            this.currentConfig.specialFeature === 'colony') {
            stroke(bg.r + 40, bg.g + 40, bg.b + 80);
            strokeWeight(1);
            for (let i = 0; i < 80; i++) {
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
