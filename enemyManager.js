class EnemyManager {
    constructor() {
        // ALG System parameters
        this.difficultyLevel = 1.0;
        this.minDifficulty = 0.5;
        this.maxDifficulty = 5.0;

        // Performance tracking
        this.enemiesDestroyed = 0;
        this.playerHits = 0;
        this.scoreGainRate = 0;
        this.lastScoreUpdate = 0;

        // Spawn parameters
        this.spawnTimer = 0;
        this.spawnInterval = 60; // Frames between spawns
        this.minSpawnInterval = 20;

        // Enemy type probabilities (adjusted by difficulty)
        this.enemyTypes = ['basic', 'shooter', 'weaver', 'tank', 'fast', 'spiral', 'bomber',
                          'charger', 'tracker', 'bouncer', 'divider', 'spawner',
                          'drobe', 'yellowGogos', 'blueGogos', 'redGogos', 'takuwashi', 'degeed', 'backDegeed'];

        // Wave system
        this.waveNumber = 0;
        this.waveTimer = 0;
        this.waveDuration = 600; // 10 seconds per wave
    }

    update() {
        this.spawnTimer++;
        this.waveTimer++;

        // Wave progression
        if (this.waveTimer >= this.waveDuration) {
            this.waveTimer = 0;
            this.waveNumber++;
            this.onWaveComplete();
        }

        // Spawn enemies
        let currentSpawnInterval = max(
            this.minSpawnInterval,
            this.spawnInterval / this.difficultyLevel
        );

        if (this.spawnTimer >= currentSpawnInterval) {
            this.spawnTimer = 0;
            this.spawnEnemy();
        }

        // Spawn formation occasionally
        if (frameCount % 300 === 0 && this.difficultyLevel > 1.5) {
            this.spawnFormation();
        }

        // Update difficulty based on ALG
        this.updateALG();
    }

    updateALG() {
        // ALG: Automatic Level of Game difficulty adjustment
        // Increases when player is doing well, decreases when struggling

        let performanceScore = 0;

        // Factor 1: Enemy destruction rate
        if (this.enemiesDestroyed > 10) {
            let destroyRate = this.enemiesDestroyed / (gameTime / 60); // enemies per second
            if (destroyRate > 3) performanceScore += 0.02;
            else if (destroyRate < 1) performanceScore -= 0.02;
        }

        // Factor 2: Score gain rate
        let currentScore = score - this.lastScoreUpdate;
        if (currentScore > 500) {
            performanceScore += 0.015;
        } else if (currentScore < 100) {
            performanceScore -= 0.01;
        }
        this.lastScoreUpdate = score;

        // Factor 3: Player hit rate
        if (this.playerHits > 0) {
            performanceScore -= 0.05; // Significant decrease when hit
            this.playerHits = max(0, this.playerHits - 1); // Decay over time
        }

        // Factor 4: Player weapon level
        if (player.weaponType >= 5) {
            performanceScore += 0.01; // Slightly harder with powerful weapons
        }

        // Factor 5: Survival time bonus
        if (gameTime > 1800) { // After 30 seconds
            performanceScore += 0.005;
        }

        // Apply difficulty change
        this.difficultyLevel += performanceScore;
        this.difficultyLevel = constrain(this.difficultyLevel, this.minDifficulty, this.maxDifficulty);

        // Gradually increase base difficulty over time
        if (frameCount % 600 === 0) { // Every 10 seconds
            this.difficultyLevel += 0.05;
        }
    }

    spawnEnemy() {
        let x = random(40, GAME_WIDTH - 40);
        let y = -20;

        let enemyType = this.chooseEnemyType();

        // backDegeed spawns from bottom
        if (enemyType === 'backDegeed') {
            y = GAME_HEIGHT + 20;
        }

        enemies.push(new Enemy(enemyType, x, y, this.difficultyLevel));
    }

    chooseEnemyType() {
        // Probability distribution changes with difficulty
        let rand = random();
        let diff = this.difficultyLevel;

        if (diff < 1.5) {
            // Early game - mostly basic enemies
            if (rand < 0.4) return 'basic';
            if (rand < 0.65) return 'weaver';
            if (rand < 0.8) return 'shooter';
            if (rand < 0.9) return 'fast';
            if (rand < 0.95) return 'degeed';
            return 'tracker';
        } else if (diff < 2.5) {
            // Mid game - more variety + new enemies
            if (rand < 0.2) return 'basic';
            if (rand < 0.35) return 'shooter';
            if (rand < 0.48) return 'weaver';
            if (rand < 0.6) return 'fast';
            if (rand < 0.7) return 'spiral';
            if (rand < 0.78) return 'tracker';
            if (rand < 0.85) return 'bouncer';
            if (rand < 0.9) return 'degeed';
            if (rand < 0.94) return 'drobe';
            if (rand < 0.97) return 'blueGogos';
            return 'tank';
        } else if (diff < 3.5) {
            // Late game - tougher enemies + all Gogos variants + special enemies
            if (rand < 0.08) return 'basic';
            if (rand < 0.16) return 'shooter';
            if (rand < 0.24) return 'weaver';
            if (rand < 0.32) return 'fast';
            if (rand < 0.4) return 'spiral';
            if (rand < 0.48) return 'charger';
            if (rand < 0.56) return 'tank';
            if (rand < 0.63) return 'bomber';
            if (rand < 0.69) return 'bouncer';
            if (rand < 0.75) return 'drobe';
            if (rand < 0.8) return 'yellowGogos';
            if (rand < 0.85) return 'blueGogos';
            if (rand < 0.89) return 'redGogos'; // Added redGogos
            if (rand < 0.93) return 'takuwashi'; // Added takuwashi
            if (rand < 0.97) return 'backDegeed';
            return 'degeed';
        } else if (diff < 4.5) {
            // Expert mode - very tough + dangerous enemies
            if (rand < 0.08) return 'shooter';
            if (rand < 0.16) return 'weaver';
            if (rand < 0.24) return 'fast';
            if (rand < 0.32) return 'spiral';
            if (rand < 0.42) return 'charger';
            if (rand < 0.52) return 'tank';
            if (rand < 0.62) return 'bomber';
            if (rand < 0.7) return 'divider';
            if (rand < 0.77) return 'drobe';
            if (rand < 0.83) return 'yellowGogos';
            if (rand < 0.88) return 'blueGogos';
            if (rand < 0.92) return 'redGogos'; // 凶悪
            if (rand < 0.96) return 'takuwashi'; // 16連射
            return 'bouncer';
        } else {
            // Insane mode - extremely tough + all dangerous enemies
            if (rand < 0.06) return 'shooter';
            if (rand < 0.12) return 'fast';
            if (rand < 0.2) return 'spiral';
            if (rand < 0.3) return 'charger';
            if (rand < 0.42) return 'tank';
            if (rand < 0.52) return 'bomber';
            if (rand < 0.62) return 'divider';
            if (rand < 0.7) return 'drobe';
            if (rand < 0.77) return 'yellowGogos';
            if (rand < 0.83) return 'blueGogos';
            if (rand < 0.88) return 'redGogos'; // 凶悪
            if (rand < 0.92) return 'takuwashi'; // 16連射
            if (rand < 0.96) return 'backDegeed';
            return 'spawner';
        }
    }

    spawnFormation() {
        let formationType = int(random(3));
        let startX = random(80, GAME_WIDTH - 80);

        switch(formationType) {
            case 0: // V formation
                for (let i = 0; i < 5; i++) {
                    let offset = abs(i - 2) * 40;
                    enemies.push(new Enemy('basic', startX + offset - 80, -20 - i * 30, this.difficultyLevel));
                }
                break;

            case 1: // Line formation
                for (let i = 0; i < 5; i++) {
                    enemies.push(new Enemy('shooter', startX + i * 40 - 80, -20, this.difficultyLevel));
                }
                break;

            case 2: // Diamond formation
                enemies.push(new Enemy('tank', startX, -20, this.difficultyLevel));
                enemies.push(new Enemy('shooter', startX - 40, -50, this.difficultyLevel));
                enemies.push(new Enemy('shooter', startX + 40, -50, this.difficultyLevel));
                enemies.push(new Enemy('weaver', startX - 40, -80, this.difficultyLevel));
                enemies.push(new Enemy('weaver', startX + 40, -80, this.difficultyLevel));
                break;
        }
    }

    onEnemyDestroyed() {
        this.enemiesDestroyed++;
    }

    onPlayerHit() {
        this.playerHits += 3; // Significant penalty
    }

    onScoreGained(points) {
        this.scoreGainRate += points;
    }

    onWaveComplete() {
        // Bonus for surviving a wave
        if (this.waveNumber > 0) {
            addScore(this.waveNumber * 100);
        }
    }

    getDifficultyDescription() {
        if (this.difficultyLevel < 1.5) return 'EASY';
        if (this.difficultyLevel < 2.5) return 'NORMAL';
        if (this.difficultyLevel < 3.5) return 'HARD';
        if (this.difficultyLevel < 4.5) return 'EXPERT';
        return 'INSANE';
    }
}
