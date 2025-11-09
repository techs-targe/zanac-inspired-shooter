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
                          'charger', 'tracker', 'bouncer', 'divider', 'spawner'];

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
        enemies.push(new Enemy(enemyType, x, y, this.difficultyLevel));
    }

    chooseEnemyType() {
        // Probability distribution changes with difficulty
        let rand = random();
        let diff = this.difficultyLevel;

        if (diff < 1.5) {
            // Early game - mostly basic enemies
            if (rand < 0.45) return 'basic';
            if (rand < 0.7) return 'weaver';
            if (rand < 0.85) return 'shooter';
            if (rand < 0.95) return 'fast';
            return 'tracker';
        } else if (diff < 2.5) {
            // Mid game - more variety
            if (rand < 0.25) return 'basic';
            if (rand < 0.42) return 'shooter';
            if (rand < 0.57) return 'weaver';
            if (rand < 0.7) return 'fast';
            if (rand < 0.82) return 'spiral';
            if (rand < 0.9) return 'tracker';
            if (rand < 0.96) return 'bouncer';
            return 'tank';
        } else if (diff < 3.5) {
            // Late game - tougher enemies
            if (rand < 0.15) return 'basic';
            if (rand < 0.28) return 'shooter';
            if (rand < 0.41) return 'weaver';
            if (rand < 0.54) return 'fast';
            if (rand < 0.66) return 'spiral';
            if (rand < 0.76) return 'charger';
            if (rand < 0.84) return 'tank';
            if (rand < 0.92) return 'bouncer';
            return 'bomber';
        } else if (diff < 4.5) {
            // Expert mode - very tough
            if (rand < 0.12) return 'shooter';
            if (rand < 0.24) return 'weaver';
            if (rand < 0.36) return 'fast';
            if (rand < 0.48) return 'spiral';
            if (rand < 0.6) return 'charger';
            if (rand < 0.72) return 'tank';
            if (rand < 0.82) return 'bomber';
            if (rand < 0.9) return 'divider';
            return 'bouncer';
        } else {
            // Insane mode - extremely tough
            if (rand < 0.1) return 'shooter';
            if (rand < 0.2) return 'fast';
            if (rand < 0.32) return 'spiral';
            if (rand < 0.44) return 'charger';
            if (rand < 0.58) return 'tank';
            if (rand < 0.7) return 'bomber';
            if (rand < 0.82) return 'divider';
            if (rand < 0.92) return 'bouncer';
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
