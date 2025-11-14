class Enemy {
    constructor(type, x, y, difficultyMultiplier = 1.0) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.size = 10;
        this.hp = 1;
        this.scoreValue = 10;
        this.canShoot = false;
        this.shootInterval = 60;
        this.shootTimer = 0; // Individual shoot timer for each enemy
        this.speed = 2;
        this.angle = 0;
        this.timeAlive = 0;
        this.difficultyMultiplier = difficultyMultiplier;

        this.initType();
    }

    initType() {
        switch(this.type) {
            case 'basic':
                // Simple enemy that moves down
                this.size = 10;
                this.hp = 1;
                this.maxHp = 1;
                this.speed = 2 * this.difficultyMultiplier;
                this.scoreValue = 10;
                this.color = color(255, 100, 100);
                this.canShoot = false;
                break;

            case 'shooter':
                // Enemy that shoots
                this.size = 12;
                this.hp = 2;
                this.maxHp = 2;
                this.speed = 1.5 * this.difficultyMultiplier;
                this.scoreValue = 30;
                this.color = color(255, 150, 50);
                this.canShoot = true;
                // Linear fire rate scaling: 1.0x at diff 1.0, 1.5x at diff 5.0
                let shooterFireRate = 1.0 + (this.difficultyMultiplier - 1.0) * 0.125;
                this.shootInterval = int(50 / shooterFireRate);
                break;

            case 'weaver':
                // Weaves left and right
                this.size = 11;
                this.hp = 2;
                this.maxHp = 2;
                this.speed = 2.5 * this.difficultyMultiplier;
                this.scoreValue = 40;
                this.color = color(150, 100, 255);
                this.canShoot = false;
                break;

            case 'tank':
                // Slow but tough
                this.size = 16;
                this.hp = int(5 * this.difficultyMultiplier);
                this.maxHp = this.hp;
                this.speed = 1 * this.difficultyMultiplier;
                this.scoreValue = 100;
                this.color = color(255, 50, 50);
                this.canShoot = true;
                // Linear fire rate scaling: 1.0x at diff 1.0, 1.5x at diff 5.0
                let tankFireRate = 1.0 + (this.difficultyMultiplier - 1.0) * 0.125;
                this.shootInterval = int(40 / tankFireRate);
                break;

            case 'fast':
                // Fast moving enemy
                this.size = 8;
                this.hp = 1;
                this.maxHp = 1;
                this.speed = 4 * this.difficultyMultiplier;
                this.scoreValue = 50;
                this.color = color(100, 255, 100);
                this.canShoot = false;
                break;

            case 'spiral':
                // Moves in spiral pattern
                this.size = 10;
                this.hp = 2;
                this.maxHp = 2;
                this.speed = 1.5 * this.difficultyMultiplier;
                this.scoreValue = 60;
                this.color = color(255, 100, 255);
                this.canShoot = true;
                // Linear fire rate scaling: 1.0x at diff 1.0, 1.5x at diff 5.0
                let spiralFireRate = 1.0 + (this.difficultyMultiplier - 1.0) * 0.125;
                this.shootInterval = int(45 / spiralFireRate);
                break;

            case 'bomber':
                // Shoots bullet spreads
                this.size = 14;
                this.hp = int(3 * this.difficultyMultiplier);
                this.maxHp = this.hp;
                this.speed = 1.2 * this.difficultyMultiplier;
                this.scoreValue = 80;
                this.color = color(255, 200, 50);
                this.canShoot = true;
                // Linear fire rate scaling: 1.0x at diff 1.0, 1.5x at diff 5.0
                let bomberFireRate = 1.0 + (this.difficultyMultiplier - 1.0) * 0.125;
                this.shootInterval = int(70 / bomberFireRate);
                break;

            case 'charger':
                // Rushes towards player
                this.size = 12;
                this.hp = 2;
                this.maxHp = 2;
                this.speed = 1 * this.difficultyMultiplier;
                this.scoreValue = 70;
                this.color = color(255, 50, 150);
                this.canShoot = false;
                this.chargeSpeed = 6 * this.difficultyMultiplier;
                this.chargeDelay = 90; // Frames before charging
                this.isCharging = false;
                break;

            case 'tracker':
                // Follows player's horizontal position
                this.size = 10;
                this.hp = 2;
                this.maxHp = 2;
                this.speed = 1.8 * this.difficultyMultiplier;
                this.scoreValue = 55;
                this.color = color(100, 255, 255);
                this.canShoot = true;
                // Linear fire rate scaling: 1.0x at diff 1.0, 1.5x at diff 5.0
                let trackerFireRate = 1.0 + (this.difficultyMultiplier - 1.0) * 0.125;
                this.shootInterval = int(60 / trackerFireRate);
                this.trackingSpeed = 2.5 * this.difficultyMultiplier;
                break;

            case 'bouncer':
                // Bounces off screen edges
                this.size = 11;
                this.hp = 2;
                this.maxHp = 2;
                this.speed = 2 * this.difficultyMultiplier;
                this.scoreValue = 65;
                this.color = color(255, 150, 255);
                this.canShoot = false;
                this.vx = random(-2, 2) * this.difficultyMultiplier;
                this.vy = this.speed;
                break;

            case 'divider':
                // Splits into smaller enemies when destroyed
                this.size = 15;
                this.hp = int(4 * this.difficultyMultiplier);
                this.maxHp = this.hp;
                this.speed = 1.5 * this.difficultyMultiplier;
                this.scoreValue = 120;
                this.color = color(150, 255, 150);
                this.canShoot = true;
                this.shootInterval = int(55 / this.difficultyMultiplier);
                this.canDivide = true;
                break;

            case 'spawner':
                // Spawns smaller enemies
                this.size = 16;
                this.hp = int(5 * this.difficultyMultiplier);
                this.maxHp = this.hp;
                this.speed = 0.8 * this.difficultyMultiplier;
                this.scoreValue = 150;
                this.color = color(200, 100, 200);
                this.canShoot = false;
                this.spawnInterval = 150;
                this.lastSpawn = 0;
                break;

            case 'drobe':
                // ドローブ：降下して分裂し、シグを3発撃つ。分裂後の殻は耐久力が高い
                this.size = 14;
                this.hp = int(3 * this.difficultyMultiplier);
                this.maxHp = this.hp;
                this.speed = 1.5 * this.difficultyMultiplier;
                this.scoreValue = 100;
                this.color = color(200, 150, 100);
                this.canShoot = true;
                this.shootInterval = int(90 / this.difficultyMultiplier);
                this.canSplit = true; // 分裂可能
                this.hasSplit = false; // まだ分裂していない
                this.splitThreshold = 0.5; // HP50%で分裂
                this.bulletType = 'sig'; // シグを発射
                this.burstShots = 3; // 3発ずつ発射
                break;

            case 'drobeShell':
                // ドローブの殻：分裂後の残骸、耐久力が高い
                this.size = 12;
                this.hp = int(10 * this.difficultyMultiplier); // 耐久力が高い
                this.maxHp = this.hp;
                this.speed = 0.5 * this.difficultyMultiplier;
                this.scoreValue = 150;
                this.color = color(150, 120, 80);
                this.canShoot = false;
                break;

            case 'yellowGogos':
                // イエロー・ゴーゴス：中型ザコ。リードを真下または真上の3方向にとぎれなく撃つ。耐久力は7発
                this.size = 15;
                this.hp = int(7 * this.difficultyMultiplier);
                this.maxHp = this.hp;
                this.speed = 1.0 * this.difficultyMultiplier;
                this.scoreValue = 200;
                this.color = color(255, 255, 100);
                this.canShoot = true;
                this.shootInterval = int(20 / this.difficultyMultiplier); // とぎれなく撃つ
                this.bulletType = 'lead'; // リード弾
                this.spreadPattern = 'vertical3'; // 真下/真上3方向
                break;

            case 'blueGogos':
                // ブルー・ゴーゴス：中型ザコ。しだれ弾をばらまく。耐久力は4発
                this.size = 14;
                this.hp = int(4 * this.difficultyMultiplier);
                this.maxHp = this.hp;
                this.speed = 1.2 * this.difficultyMultiplier;
                this.scoreValue = 120;
                this.color = color(100, 150, 255);
                this.canShoot = true;
                this.shootInterval = int(35 / this.difficultyMultiplier);
                this.bulletType = 'lead'; // しだれ弾（リード）
                this.spreadPattern = 'scatter'; // ばらまく
                break;

            case 'redGogos':
                // レッド・ゴーゴス：中型ザコ。自機を狙ってシグを5発ずつ撃つ。耐久力は7発。凶悪
                this.size = 15;
                this.hp = int(7 * this.difficultyMultiplier);
                this.maxHp = this.hp;
                this.speed = 1.1 * this.difficultyMultiplier;
                this.scoreValue = 250;
                this.color = color(255, 50, 50);
                this.canShoot = true;
                this.shootInterval = int(60 / this.difficultyMultiplier);
                this.bulletType = 'sig'; // シグ（ミサイル）
                this.burstShots = 5; // 5発ずつ
                this.aimAtPlayer = true; // 自機を狙う
                break;

            case 'takuwashi':
                // タクワーシ：自機とX座標を合わせるように左右に動き、正面にくるとシグを猛烈な勢いで連射
                this.size = 13;
                this.hp = int(5 * this.difficultyMultiplier);
                this.maxHp = this.hp;
                this.speed = 0.5 * this.difficultyMultiplier; // 0.5に減速（長く画面内に留まる）
                this.scoreValue = 180;
                this.color = color(255, 200, 50);
                this.canShoot = true;
                // Linear fire rate scaling: 1.0x at diff 1.0, 1.5x at diff 5.0
                let takuwashiFireRate = 1.0 + (this.difficultyMultiplier - 1.0) * 0.125;
                this.shootInterval = max(8, int(8 / takuwashiFireRate)); // 連射速度を半分に（約7.5発/秒）
                this.bulletType = 'sig';
                this.trackPlayer = true; // X座標を合わせる
                this.rapidFireRange = 30; // 30pxに縮小（より正確に正面に来る必要がある）
                this.trackSpeed = 6; // 追跡速度を上げる（逃げないように）
                break;

            case 'degeed':
                // デギード：ゆっくり降下し、自機を左右から挟み込みにくる
                this.size = 12;
                this.hp = int(3 * this.difficultyMultiplier);
                this.maxHp = this.hp;
                this.speed = 0.8 * this.difficultyMultiplier; // ゆっくり
                this.scoreValue = 90;
                this.color = color(150, 255, 150);
                this.canShoot = false;
                this.pincer = true; // 挟み込み行動
                this.pincerSide = (this.x < GAME_WIDTH / 2) ? 'left' : 'right'; // 左右どちら側か
                break;

            case 'backDegeed':
                // バック・デギード：画面下から現れて上昇し、自機を左右から挟み込みにくる
                this.size = 12;
                this.hp = int(3 * this.difficultyMultiplier);
                this.maxHp = this.hp;
                this.speed = -1.2 * this.difficultyMultiplier; // 負の値で上昇
                this.scoreValue = 100;
                this.color = color(255, 150, 255);
                this.canShoot = false;
                this.pincer = true; // 挟み込み行動
                this.pincerSide = (this.x < GAME_WIDTH / 2) ? 'left' : 'right';
                this.fromBottom = true; // 画面下から
                break;
        }
    }

    update() {
        this.timeAlive++;

        // Handle custom velocity (for split enemies)
        if (this.usesCustomVelocity) {
            this.x += this.vx;
            this.y += this.vy;
            return;
        }

        switch(this.type) {
            case 'basic':
                this.y += this.speed;
                break;

            case 'shooter':
                this.y += this.speed;
                // Slight horizontal wobble
                this.x += sin(this.timeAlive * 0.1) * 0.5;
                break;

            case 'weaver':
                this.y += this.speed;
                this.x += sin(this.timeAlive * 0.08) * 3;
                break;

            case 'tank':
                this.y += this.speed;
                break;

            case 'fast':
                this.y += this.speed;
                // Erratic movement
                this.x += cos(this.timeAlive * 0.15) * 2;
                break;

            case 'spiral':
                this.angle += 0.1;
                this.x += cos(this.angle) * 2;
                this.y += this.speed;
                break;

            case 'bomber':
                this.y += this.speed;
                this.x += sin(this.timeAlive * 0.05) * 1;
                break;

            case 'charger':
                if (!this.isCharging && this.timeAlive < this.chargeDelay) {
                    // Normal descent before charging
                    this.y += this.speed;
                } else if (!this.isCharging) {
                    // Start charging towards player
                    this.isCharging = true;
                    if (player && player.alive) {
                        let dx = player.x - this.x;
                        let dy = player.y - this.y;
                        let dist = sqrt(dx * dx + dy * dy);
                        this.vx = (dx / dist) * this.chargeSpeed;
                        this.vy = (dy / dist) * this.chargeSpeed;
                    }
                }
                if (this.isCharging) {
                    // Continue charging
                    this.x += this.vx;
                    this.y += this.vy;
                }
                break;

            case 'tracker':
                this.y += this.speed;
                // Track player's horizontal position
                if (player && player.alive) {
                    let dx = player.x - this.x;
                    if (abs(dx) > 5) {
                        this.x += dx > 0 ? this.trackingSpeed : -this.trackingSpeed;
                    }
                }
                break;

            case 'bouncer':
                this.x += this.vx;
                this.y += this.vy;
                // Bounce off edges
                if (this.x < this.size || this.x > GAME_WIDTH - this.size) {
                    this.vx *= -1;
                }
                if (this.y < this.size) {
                    this.vy *= -1;
                }
                break;

            case 'divider':
                this.y += this.speed;
                this.x += sin(this.timeAlive * 0.07) * 1.5;
                break;

            case 'spawner':
                this.y += this.speed;
                this.lastSpawn++;
                // Spawn small enemies periodically
                if (this.lastSpawn >= this.spawnInterval && this.y > 0 && this.y < GAME_HEIGHT - 50) {
                    this.spawnMinion();
                    this.lastSpawn = 0;
                }
                break;

            case 'drobe':
                // ドローブ：降下して、HP50%以下になったら分裂
                this.y += this.speed;
                if (this.canSplit && !this.hasSplit && this.hp <= this.maxHp * this.splitThreshold) {
                    this.split();
                }
                break;

            case 'drobeShell':
                // ドローブの殻：ゆっくり降下
                this.y += this.speed;
                break;

            case 'yellowGogos':
            case 'blueGogos':
            case 'redGogos':
                // ゴーゴス系：普通に降下
                this.y += this.speed;
                this.x += sin(this.timeAlive * 0.06) * 1;
                break;

            case 'takuwashi':
                // タクワーシ：自機のX座標に合わせる（積極的に近づく・逃げない）
                this.y += this.speed;
                if (player && player.alive) {
                    let dx = player.x - this.x;
                    // 常にプレイヤーの方向に移動（条件なし・逃げない）
                    let moveSpeed = this.trackSpeed || 6; // 速度を上げる
                    // 距離に応じた移動（近い時は遅く、遠い時は速く）
                    let distance = abs(dx);
                    let actualSpeed = min(moveSpeed, distance);
                    this.x += dx > 0 ? actualSpeed : -actualSpeed;
                    // 画面端制約を追加（画面外に出ないようにする）
                    this.x = constrain(this.x, this.size, GAME_WIDTH - this.size);
                }
                break;

            case 'degeed':
                // デギード：ゆっくり降下し、挟み込み
                this.y += this.speed;
                if (player && player.alive) {
                    // 挟み込み行動：プレイヤーの左右に近づく
                    if (this.pincerSide === 'left') {
                        let targetX = player.x - 80; // 左側80px
                        if (this.x > targetX) {
                            this.x -= 1.5;
                        }
                    } else {
                        let targetX = player.x + 80; // 右側80px
                        if (this.x < targetX) {
                            this.x += 1.5;
                        }
                    }
                }
                break;

            case 'backDegeed':
                // バック・デギード：上昇して挟み込み
                this.y += this.speed; // speedが負なので上昇
                if (player && player.alive) {
                    // 挟み込み行動
                    if (this.pincerSide === 'left') {
                        let targetX = player.x - 80;
                        if (this.x > targetX) {
                            this.x -= 1.5;
                        }
                    } else {
                        let targetX = player.x + 80;
                        if (this.x < targetX) {
                            this.x += 1.5;
                        }
                    }
                }
                break;
        }

        // Update shoot timer and shoot when ready (for all enemies with canShoot)
        if (this.canShoot && this.y > 0 && this.y < GAME_HEIGHT) {
            this.shootTimer++;
            if (this.shootTimer >= this.shootInterval) {
                this.shoot();
                this.shootTimer = 0; // Reset timer
            }
        }
    }

    shoot() {
        if (!this.canShoot) return;

        // Calculate direction to player
        let dx = player.x - this.x;
        let dy = player.y - this.y;
        let angle = atan2(dy, dx);
        let baseSpeed = 3; // Base speed

        // Helper function to get adjusted speed based on bullet type
        const getAdjustedSpeed = (bulletType, isTakuwashi = false) => {
            if (isTakuwashi) return baseSpeed * 1.5; // Takuwashi keeps original speed
            // Further 30% reduction: multiply by 0.7
            if (bulletType === 'lead') return baseSpeed * 0.33 * 0.7; // Lead: 23% of base
            if (bulletType === 'sig') return baseSpeed * 0.5 * 0.7; // Sig: 35% of base
            return baseSpeed; // Normal bullets unchanged
        };

        switch(this.type) {
            case 'shooter':
                // Single aimed shot
                let shooterSpeed = getAdjustedSpeed('sig');
                enemyBullets.push(new Bullet(
                    this.x,
                    this.y,
                    cos(angle) * shooterSpeed,
                    sin(angle) * shooterSpeed,
                    false,
                    1,
                    4,
                    'sig' // シグ弾
                ));
                break;

            case 'tank':
                // Triple shot spread
                let tankSpeed = getAdjustedSpeed('sig');
                for (let i = -1; i <= 1; i++) {
                    let spreadAngle = angle + i * 0.3;
                    enemyBullets.push(new Bullet(
                        this.x,
                        this.y,
                        cos(spreadAngle) * tankSpeed,
                        sin(spreadAngle) * tankSpeed,
                        false,
                        1,
                        4,
                        'sig' // シグ弾
                    ));
                }
                break;

            case 'spiral':
                // Rotating shot - now fires LEAD bullets
                let spiralAngle = this.angle;
                let spiralSpeed = getAdjustedSpeed('lead');
                enemyBullets.push(new Bullet(
                    this.x,
                    this.y,
                    cos(spiralAngle) * spiralSpeed,
                    sin(spiralAngle) * spiralSpeed,
                    false,
                    1,
                    5,
                    'lead' // リード弾（回転パターンで回避困難）
                ));
                break;

            case 'bomber':
                // 5-way spread - outer bullets are LEAD, center are SIG
                for (let i = 0; i < 5; i++) {
                    let bombAngle = angle - 0.6 + i * 0.3;
                    // Outer 2 bullets (i=0, i=4) are LEAD, center 3 (i=1,2,3) are SIG
                    let bulletType = (i === 0 || i === 4) ? 'lead' : 'sig';
                    let bulletSize = bulletType === 'lead' ? 5 : 4;
                    let bombSpeed = getAdjustedSpeed(bulletType);
                    enemyBullets.push(new Bullet(
                        this.x,
                        this.y,
                        cos(bombAngle) * bombSpeed,
                        sin(bombAngle) * bombSpeed,
                        false,
                        1,
                        bulletSize,
                        bulletType
                    ));
                }
                break;

            case 'tracker':
                // Aimed shot - alternates between SIG and LEAD
                let trackerBulletType = (frameCount % 4 < 2) ? 'sig' : 'lead';
                let trackerBulletSize = trackerBulletType === 'lead' ? 5 : 4;
                let trackerSpeed = getAdjustedSpeed(trackerBulletType);
                enemyBullets.push(new Bullet(
                    this.x,
                    this.y,
                    cos(angle) * trackerSpeed,
                    sin(angle) * trackerSpeed,
                    false,
                    1,
                    trackerBulletSize,
                    trackerBulletType
                ));
                break;

            case 'divider':
                // Double shot
                let dividerSpeed = getAdjustedSpeed('sig');
                for (let i = -1; i <= 1; i += 2) {
                    let spreadAngle = angle + i * 0.2;
                    enemyBullets.push(new Bullet(
                        this.x,
                        this.y,
                        cos(spreadAngle) * dividerSpeed,
                        sin(spreadAngle) * dividerSpeed,
                        false,
                        1,
                        4,
                        'sig' // シグ弾
                    ));
                }
                break;

            case 'drobe':
                // ドローブ：シグを3発バースト
                if (!this.burstCounter) this.burstCounter = 0;
                if (!this.burstDelay) this.burstDelay = 0;

                if (this.burstCounter < this.burstShots) {
                    if (this.burstDelay === 0) {
                        let drobeSpeed = getAdjustedSpeed('sig');
                        enemyBullets.push(new Bullet(
                            this.x,
                            this.y,
                            cos(angle) * drobeSpeed,
                            sin(angle) * drobeSpeed,
                            false,
                            1,
                            6,
                            'sig' // シグ弾
                        ));
                        this.burstCounter++;
                        this.burstDelay = 5; // 5フレーム間隔
                    } else {
                        this.burstDelay--;
                    }
                } else {
                    this.burstCounter = 0;
                }
                break;

            case 'yellowGogos':
                // イエロー・ゴーゴス：リードを真下または真上の3方向
                let verticalDir = (this.y < GAME_HEIGHT / 2) ? 1 : -1; // 上半分なら下、下半分なら上
                let yellowSpeed = getAdjustedSpeed('lead');
                for (let i = -1; i <= 1; i++) {
                    let vAngle = (verticalDir > 0 ? PI / 2 : -PI / 2) + i * 0.3;
                    enemyBullets.push(new Bullet(
                        this.x,
                        this.y,
                        cos(vAngle) * yellowSpeed,
                        sin(vAngle) * yellowSpeed,
                        false,
                        1,
                        5,
                        'lead' // リード弾
                    ));
                }
                break;

            case 'blueGogos':
                // ブルー・ゴーゴス：しだれ弾（リード）をばらまく
                let blueSpeed = getAdjustedSpeed('lead');
                for (let i = 0; i < 6; i++) {
                    let scatterAngle = (i / 6) * TWO_PI;
                    enemyBullets.push(new Bullet(
                        this.x,
                        this.y,
                        cos(scatterAngle) * blueSpeed * 0.8,
                        sin(scatterAngle) * blueSpeed * 0.8,
                        false,
                        1,
                        5,
                        'lead' // リード弾
                    ));
                }
                break;

            case 'redGogos':
                // レッド・ゴーゴス：シグを5発バースト、自機狙い
                if (!this.burstCounter) this.burstCounter = 0;
                if (!this.burstDelay) this.burstDelay = 0;

                if (this.burstCounter < this.burstShots) {
                    if (this.burstDelay === 0) {
                        let redSpeed = getAdjustedSpeed('sig');
                        enemyBullets.push(new Bullet(
                            this.x,
                            this.y,
                            cos(angle) * redSpeed * 1.2,
                            sin(angle) * redSpeed * 1.2,
                            false,
                            1,
                            6,
                            'sig' // シグ弾
                        ));
                        this.burstCounter++;
                        this.burstDelay = 4; // 4フレーム間隔
                    } else {
                        this.burstDelay--;
                    }
                } else {
                    this.burstCounter = 0;
                }
                break;

            case 'takuwashi':
                // タクワーシ：X軸を調整しながら常にシグを猛烈連射（16連射）
                if (player && player.alive) {
                    // 常に真下に向けてシグを猛烈連射（速度は変更しない）
                    let takuwashiSpeed = getAdjustedSpeed('sig', true);
                    enemyBullets.push(new Bullet(
                        this.x,
                        this.y,
                        0,
                        takuwashiSpeed,
                        false,
                        1,
                        6,
                        'sig' // シグ弾を猛烈連射
                    ));
                }
                break;
        }
    }

    spawnMinion() {
        // Spawner creates small basic enemies
        if (typeof enemies !== 'undefined') {
            for (let i = 0; i < 2; i++) {
                let offsetX = (i === 0 ? -1 : 1) * this.size;
                let minion = new Enemy('fast', this.x + offsetX, this.y, this.difficultyMultiplier * 0.7);
                minion.size *= 0.7; // Smaller minions
                minion.hp = 1;
                minion.scoreValue = 15;
                enemies.push(minion);
            }
        }
    }

    onDestroyed() {
        // Special behavior when divider is destroyed
        if (this.type === 'divider' && this.canDivide && typeof enemies !== 'undefined') {
            // Split into 3 smaller enemies
            for (let i = 0; i < 3; i++) {
                let angle = (i / 3) * TWO_PI;
                let splitEnemy = new Enemy('basic', this.x, this.y, this.difficultyMultiplier * 0.6);
                splitEnemy.size *= 0.6;
                splitEnemy.hp = 1;
                splitEnemy.scoreValue = 20;
                splitEnemy.vx = cos(angle) * 3;
                splitEnemy.vy = sin(angle) * 3;
                splitEnemy.usesCustomVelocity = true; // Flag to use vx/vy in update
                enemies.push(splitEnemy);
            }
        }
    }

    draw() {
        push();
        noStroke();

        // Main body
        fill(this.color);

        if (this.type === 'tank') {
            // Tank - square shape
            rectMode(CENTER);
            rect(this.x, this.y, this.size * 1.5, this.size * 1.5);
            fill(red(this.color) * 0.7, green(this.color) * 0.7, blue(this.color) * 0.7);
            rect(this.x, this.y, this.size, this.size);
        } else if (this.type === 'spiral') {
            // Spiral - rotating triangle
            push();
            translate(this.x, this.y);
            rotate(this.angle);
            triangle(0, -this.size, -this.size, this.size, this.size, this.size);
            pop();
        } else if (this.type === 'charger') {
            // Charger - pointed arrow shape
            push();
            translate(this.x, this.y);
            if (this.isCharging) {
                rotate(atan2(this.vy, this.vx) + PI/2);
                // Charging warning flash
                if (frameCount % 4 < 2) {
                    fill(255, 255, 100);
                }
            }
            triangle(0, -this.size * 1.5, -this.size, this.size, this.size, this.size);
            pop();
        } else if (this.type === 'tracker') {
            // Tracker - crosshair style
            ellipse(this.x, this.y, this.size * 2, this.size * 1.5);
            stroke(this.color);
            strokeWeight(2);
            line(this.x - this.size, this.y, this.x + this.size, this.y);
            line(this.x, this.y - this.size, this.x, this.y + this.size);
            noStroke();
            fill(255, 255, 255, 150);
            ellipse(this.x, this.y, this.size * 0.5, this.size * 0.5);
        } else if (this.type === 'bouncer') {
            // Bouncer - diamond shape
            push();
            translate(this.x, this.y);
            rotate(this.timeAlive * 0.1);
            quad(0, -this.size, this.size, 0, 0, this.size, -this.size, 0);
            pop();
        } else if (this.type === 'divider') {
            // Divider - segmented circle
            ellipse(this.x, this.y, this.size * 2, this.size * 2);
            stroke(red(this.color) * 0.5, green(this.color) * 0.5, blue(this.color) * 0.5);
            strokeWeight(2);
            for (let i = 0; i < 3; i++) {
                let angle = (i / 3) * TWO_PI;
                let x1 = this.x + cos(angle) * this.size * 0.5;
                let y1 = this.y + sin(angle) * this.size * 0.5;
                let x2 = this.x + cos(angle) * this.size;
                let y2 = this.y + sin(angle) * this.size;
                line(x1, y1, x2, y2);
            }
            noStroke();
            fill(255, 255, 255, 150);
            ellipse(this.x, this.y, this.size, this.size);
        } else if (this.type === 'spawner') {
            // Spawner - hexagon with pulsing core
            push();
            translate(this.x, this.y);
            rotate(this.timeAlive * 0.05);
            beginShape();
            for (let i = 0; i < 6; i++) {
                let angle = (i / 6) * TWO_PI;
                vertex(cos(angle) * this.size, sin(angle) * this.size);
            }
            endShape(CLOSE);
            pop();
            // Pulsing core
            let pulse = sin(this.timeAlive * 0.1) * 0.3 + 0.7;
            fill(255, 255, 255, 150 * pulse);
            ellipse(this.x, this.y, this.size * pulse, this.size * pulse);
        } else {
            // Most enemies - ellipse
            ellipse(this.x, this.y, this.size * 2, this.size * 1.5);

            // Core
            fill(255, 255, 255, 150);
            ellipse(this.x, this.y, this.size, this.size * 0.8);
        }

        // Glow effect
        fill(red(this.color), green(this.color), blue(this.color), 50);
        ellipse(this.x, this.y, this.size * 2.5, this.size * 2.5);

        // HP bar for all enemies
        let maxHp = this.hp; // Approximate max HP based on type
        switch(this.type) {
            case 'basic': maxHp = 1; break;
            case 'shooter': maxHp = 2; break;
            case 'weaver': maxHp = 2; break;
            case 'tank': maxHp = 5 * this.difficultyMultiplier; break;
            case 'fast': maxHp = 1; break;
            case 'spiral': maxHp = 2; break;
            case 'bomber': maxHp = 3 * this.difficultyMultiplier; break;
            case 'charger': maxHp = 2; break;
            case 'tracker': maxHp = 2; break;
            case 'bouncer': maxHp = 2; break;
            case 'divider': maxHp = 4 * this.difficultyMultiplier; break;
            case 'spawner': maxHp = 5 * this.difficultyMultiplier; break;
        }

        // Store initial HP if not set
        if (!this.maxHp) this.maxHp = maxHp;

        // Draw HP bar
        if (this.hp > 0 && this.maxHp > 0) {
            fill(255, 100, 100);
            rectMode(CENTER);
            rect(this.x, this.y - this.size - 5, this.size * 1.5, 3);

            fill(100, 255, 100);
            let hpWidth = map(this.hp, 0, this.maxHp, 0, this.size * 1.5);
            rect(this.x - (this.size * 1.5 - hpWidth) / 2, this.y - this.size - 5, hpWidth, 3);
        }

        pop();
    }

    split() {
        // ドローブの分裂：殻を生成
        if (this.type === 'drobe' && !this.hasSplit) {
            this.hasSplit = true;

            // 殻（drobeShell）を生成
            if (typeof enemies !== 'undefined') {
                let shell = new Enemy('drobeShell', this.x, this.y, this.difficultyMultiplier);
                enemies.push(shell);

                // エフェクトを追加
                createExplosion(this.x, this.y, 20);
            }
        }
    }

    isOffscreen() {
        return (
            this.x < -50 ||
            this.x > GAME_WIDTH + 50 ||
            this.y > GAME_HEIGHT + 50
        );
    }
}

// Ground Enemy (Turret/Core)
class GroundEnemy {
    constructor(x, y, type = 'turret', level = 1, targetY = GAME_HEIGHT - 60) {
        this.x = x;
        this.y = y;
        this.targetY = targetY; // Position where it should stop
        this.type = type;
        this.level = level;
        this.size = 15;
        this.hp = 3 + level * 2;
        this.maxHp = this.hp;
        this.scoreValue = 50 + level * 30;
        this.canShoot = true;
        this.shootInterval = 60 - level * 3; // 短縮: 60-57フレーム = 1秒に1回
        this.shootTimer = 0; // 内部タイマー追加
        this.angle = 0;
        this.targetAngle = 0;
        this.isGround = true; // Flag to identify ground enemies

        // Scrolling behavior
        this.state = 'scrolling'; // 'scrolling' or 'stationary'
        this.scrollSpeed = 1.5; // Speed when scrolling down

        // Visual properties
        this.baseColor = type === 'core' ? color(255, 50, 50) : color(150, 150, 200);
    }

    update() {
        // Scroll down behavior:
        // - Normal gameplay: scroll at scrollSpeed
        // - Boss intro (phases 1-2): scroll at variable speed (set by areaManager)
        // - Boss battle (phase 3): completely stopped
        if (!areaManager || !areaManager.bossActive) {
            // Normal gameplay
            this.y += this.scrollSpeed;
        } else if (areaManager && areaManager.bossActive && areaManager.bossIntroPhase < 3) {
            // During boss intro (phases 1-2), continue scrolling at controlled speed
            this.y += this.scrollSpeed;
        }
        // else: Boss battle phase 3 - stopped (no movement)

        // Track player for aiming while scrolling
        if (player && player.alive && this.y > 0 && this.y < GAME_HEIGHT) {
            this.targetAngle = atan2(player.y - this.y, player.x - this.x);
            // Smooth rotation
            let angleDiff = this.targetAngle - this.angle;
            // Normalize angle difference
            while (angleDiff > PI) angleDiff -= TWO_PI;
            while (angleDiff < -PI) angleDiff += TWO_PI;
            this.angle += angleDiff * 0.1;
        }

        // Update shoot timer and shoot when ready
        if (this.canShoot && this.y > 0 && this.y < GAME_HEIGHT) {
            this.shootTimer++;
            if (this.shootTimer >= this.shootInterval) {
                this.shoot();
                this.shootTimer = 0; // リセット
            }
        }
    }

    shoot() {
        // Shoot while scrolling (if on screen)
        if (!this.canShoot || !player || !player.alive) return;
        if (this.y < 0 || this.y > GAME_HEIGHT) return; // Don't shoot if offscreen

        // Aim towards player
        let baseSpeed = 3.75; // Reduced from 5 to 3.75 (75% speed)
        // Adjust speed for sig bullets (1/2 speed × 0.7 = 35% of base)
        let speed = baseSpeed * 0.5 * 0.7;
        let vx = cos(this.angle) * speed;
        let vy = sin(this.angle) * speed;

        if (this.type === 'core') {
            // Core shoots triple spread (シグ弾)
            for (let i = -1; i <= 1; i++) {
                let spreadAngle = this.angle + i * 0.3;
                enemyBullets.push(new Bullet(
                    this.x + cos(this.angle) * this.size,
                    this.y + sin(this.angle) * this.size,
                    cos(spreadAngle) * speed,
                    sin(spreadAngle) * speed,
                    false,
                    1,
                    4,
                    'sig' // 地上敵も全弾シグ
                ));
            }
        } else {
            // Turret shoots single aimed shot (シグ弾)
            enemyBullets.push(new Bullet(
                this.x + cos(this.angle) * this.size,
                this.y + sin(this.angle) * this.size,
                vx,
                vy,
                false,
                1,
                4,
                'sig' // 地上敵も全弾シグ
            ));
        }
    }

    draw() {
        push();
        noStroke();

        // Base platform
        fill(this.baseColor);
        rectMode(CENTER);
        rect(this.x, this.y, this.size * 2, this.size);

        // Rotating turret
        push();
        translate(this.x, this.y);
        rotate(this.angle);

        // Barrel
        fill(red(this.baseColor) * 0.7, green(this.baseColor) * 0.7, blue(this.baseColor) * 0.7);
        rect(this.size / 2, 0, this.size * 1.5, this.size * 0.6);

        pop();

        // Core/center
        fill(this.baseColor);
        ellipse(this.x, this.y, this.size, this.size);

        // Detail
        fill(255, 255, 255, 150);
        ellipse(this.x, this.y, this.size * 0.5, this.size * 0.5);

        // HP bar removed for ground enemies (ジグの耐久力は表示しない)

        pop();
    }

    isOffscreen() {
        // Check if horizontally offscreen
        if (this.x < -50 || this.x > GAME_WIDTH + 50) {
            return true;
        }

        // Remove if scrolled past bottom of screen
        if (this.y > GAME_HEIGHT + 50) {
            return true;
        }

        return false;
    }
}

// Boss Enemy
class BossEnemy {
    constructor(type = 'default', areaNumber = 1) {
        this.type = type;
        this.areaNumber = areaNumber;
        this.x = GAME_WIDTH / 2;
        this.y = -100; // Start above screen
        this.targetY = 120; // Move to this position
        this.size = 40;
        this.hp = 100 + areaNumber * 50;
        this.maxHp = this.hp;
        this.scoreValue = 10000 + areaNumber * 5000;
        this.canShoot = true;
        this.shootInterval = 30;
        this.shootTimer = 0; // Individual shoot timer for boss
        this.speed = 1;
        this.phase = 0; // Attack pattern phase
        this.phaseTimer = 0;
        this.movePattern = areaNumber; // Use area number as unique movement pattern (1-12)
        this.isBoss = true; // Flag to identify bosses

        // Movement
        this.vx = 0;
        this.vy = 2;
        this.moveTimer = 0; // Timer for movement pattern changes

        // Visual
        this.angle = 0;
        this.color = this.getBossColor();

        // Attack patterns
        this.attackCooldown = 0;
    }

    getBossColor() {
        switch(this.type) {
            case 'default': return color(200, 50, 50);
            case 'fortress': return color(150, 150, 200);
            case 'organic': return color(150, 255, 100);
            case 'mech': return color(100, 150, 255);
            default: return color(200, 50, 200);
        }
    }

    update() {
        this.phaseTimer++;
        this.angle += 0.02;

        // Entry phase - move into position
        if (this.y < this.targetY) {
            this.y += this.vy;
            return;
        }

        // Update phase based on HP
        let hpPercent = this.hp / this.maxHp;
        if (hpPercent > 0.66) {
            this.phase = 1;
            this.shootInterval = 60; // Doubled: 30 → 60 (half fire rate)
        } else if (hpPercent > 0.33) {
            this.phase = 2;
            this.shootInterval = 40; // Doubled: 20 → 40 (half fire rate)
        } else {
            this.phase = 3;
            this.shootInterval = 30; // Doubled: 15 → 30 (half fire rate)
        }

        // Unique movement pattern per area (1-12)
        this.moveTimer++;
        switch(this.movePattern) {
            case 1: // Area 1: Simple side to side
                this.x += sin(this.phaseTimer * 0.03) * 3;
                break;

            case 2: // Area 2: Figure 8
                this.x = GAME_WIDTH / 2 + sin(this.phaseTimer * 0.02) * 100;
                this.y = this.targetY + sin(this.phaseTimer * 0.04) * 30;
                break;

            case 3: // Area 3: Aggressive horizontal tracking
                if (player && player.alive) {
                    let dx = player.x - this.x;
                    this.x += dx * 0.03;
                }
                this.y = this.targetY + sin(this.phaseTimer * 0.02) * 15;
                break;

            case 4: // Area 4: Circular motion
                this.x = GAME_WIDTH / 2 + cos(this.phaseTimer * 0.03) * 120;
                this.y = this.targetY + sin(this.phaseTimer * 0.03) * 40;
                break;

            case 5: // Area 5: Vertical oscillation + horizontal sweep
                this.y = this.targetY + sin(this.phaseTimer * 0.05) * 50;
                this.x = GAME_WIDTH / 2 + sin(this.phaseTimer * 0.015) * 150;
                break;

            case 6: // Area 6: Diagonal sweep
                if (this.moveTimer % 240 < 120) {
                    // Diagonal right-down
                    this.x += 2;
                    this.y += 0.5;
                } else {
                    // Diagonal left-up
                    this.x -= 2;
                    this.y -= 0.5;
                }
                break;

            case 7: // Area 7: Expanding spiral
                let spiralRadius = 50 + (this.phaseTimer % 180) * 0.5;
                let spiralAngle = this.phaseTimer * 0.05;
                this.x = GAME_WIDTH / 2 + cos(spiralAngle) * spiralRadius;
                this.y = this.targetY + sin(spiralAngle) * (spiralRadius * 0.4);
                break;

            case 8: // Area 8: Sharp zigzag
                if (this.moveTimer % 60 < 30) {
                    this.x += 4;
                } else {
                    this.x -= 4;
                }
                this.y = this.targetY + sin(this.phaseTimer * 0.08) * 25;
                break;

            case 9: // Area 9: Teleport-like rapid repositioning
                if (this.moveTimer % 120 === 0) {
                    // Sudden jump to random position
                    this.targetX = random(this.size + 80, GAME_WIDTH - this.size - 80);
                    this.targetTeleportY = this.targetY + random(-40, 40);
                }
                if (!this.targetX) this.targetX = this.x;
                if (!this.targetTeleportY) this.targetTeleportY = this.targetY;

                // Rapid movement to target
                this.x += (this.targetX - this.x) * 0.15;
                this.y += (this.targetTeleportY - this.y) * 0.15;
                break;

            case 10: // Area 10: Fast horizontal dashes
                if (this.moveTimer % 150 < 50) {
                    // Dash right
                    this.x += 6;
                } else if (this.moveTimer % 150 < 100) {
                    // Dash left
                    this.x -= 6;
                } else {
                    // Pause at center
                    this.x += (GAME_WIDTH / 2 - this.x) * 0.1;
                }
                this.y = this.targetY;
                break;

            case 11: // Area 11: Wave pattern (sine wave horizontally)
                this.x += 3;
                if (this.x > GAME_WIDTH - this.size || this.x < this.size) {
                    this.x = constrain(this.x, this.size, GAME_WIDTH - this.size);
                }
                this.y = this.targetY + sin(this.x * 0.03) * 60;
                break;

            case 12: // Area 12: Final boss - complex multi-pattern
                // Switches between patterns every 200 frames
                let subPattern = int(this.phaseTimer / 200) % 4;
                switch(subPattern) {
                    case 0: // Aggressive tracking + vertical oscillation
                        if (player && player.alive) {
                            this.x += (player.x - this.x) * 0.05;
                        }
                        this.y = this.targetY + sin(this.phaseTimer * 0.08) * 45;
                        break;
                    case 1: // Fast circular
                        this.x = GAME_WIDTH / 2 + cos(this.phaseTimer * 0.08) * 140;
                        this.y = this.targetY + sin(this.phaseTimer * 0.08) * 50;
                        break;
                    case 2: // Rapid zigzag
                        this.x += sin(this.phaseTimer * 0.15) * 8;
                        this.y = this.targetY + cos(this.phaseTimer * 0.1) * 35;
                        break;
                    case 3: // Dive and rise
                        let diveProgress = (this.phaseTimer % 200) / 200;
                        this.y = this.targetY + sin(diveProgress * PI) * 80;
                        this.x = GAME_WIDTH / 2 + sin(this.phaseTimer * 0.03) * 120;
                        break;
                }
                break;

            default: // Fallback to simple side to side
                this.x += sin(this.phaseTimer * 0.03) * 3;
                break;
        }

        // Keep in bounds
        this.x = constrain(this.x, this.size, GAME_WIDTH - this.size);
        this.y = constrain(this.y, this.size, GAME_HEIGHT / 3);

        this.attackCooldown--;

        // Update shoot timer and shoot when ready
        if (this.canShoot && this.y >= this.targetY) {
            this.shootTimer++;
            if (this.shootTimer >= this.shootInterval) {
                this.shoot();
                this.shootTimer = 0; // Reset timer
            }
        }
    }

    shoot() {
        if (!this.canShoot || this.y < this.targetY) return;
        if (!player || !player.alive) return;

        // Area-specific shooting patterns (1-12) with continuous fire
        // Difficulty scales with area number: more bullets, faster fire, complex patterns

        let baseSpeed = 4 + (this.areaNumber * 0.15); // Speed increases with area
        let playerAngle = atan2(player.y - this.y, player.x - this.x);

        // Helper function to get adjusted speed based on bullet type
        const getSpeed = (bulletType, multiplier = 1.0) => {
            let typeMultiplier = 1.0;
            // Further 30% reduction: multiply by 0.7
            if (bulletType === 'lead') typeMultiplier = 0.33 * 0.7; // Lead: 23% of base
            else if (bulletType === 'sig') typeMultiplier = 0.5 * 0.7; // Sig: 35% of base
            return baseSpeed * typeMultiplier * multiplier;
        };

        // Area-specific patterns
        switch(this.areaNumber) {
            case 1: // Area 1: Simple aimed shots (beginner friendly)
                {
                    let speed = getSpeed('sig');
                    enemyBullets.push(new Bullet(
                        this.x, this.y + this.size / 2,
                        cos(playerAngle) * speed,
                        sin(playerAngle) * speed,
                        false, 1, 5, 'sig'
                    ));
                }
                break;

            case 2: // Area 2: Aimed + small 3-way spread
                {
                    let speed = getSpeed('sig');
                    for (let i = -1; i <= 1; i++) {
                        let angle = playerAngle + i * 0.25;
                        enemyBullets.push(new Bullet(
                            this.x, this.y + this.size / 2,
                            cos(angle) * speed,
                            sin(angle) * speed,
                            false, 1, 5, 'sig'
                        ));
                    }
                }
                break;

            case 3: // Area 3: 5-way spread + aimed shot
                {
                    let speed = getSpeed('sig');
                    // Aimed center shot
                    enemyBullets.push(new Bullet(
                        this.x, this.y + this.size / 2,
                        cos(playerAngle) * speed,
                        sin(playerAngle) * speed,
                        false, 1, 5, 'sig'
                    ));
                    // Spread shots
                    for (let i = -2; i <= 2; i++) {
                        if (i === 0) continue;
                        let angle = playerAngle + i * 0.3;
                        enemyBullets.push(new Bullet(
                            this.x, this.y + this.size / 2,
                            cos(angle) * speed,
                            sin(angle) * speed,
                            false, 1, 5, 'sig'
                        ));
                    }
                }
                break;

            case 4: // Area 4: Wide 7-way spread with Lead bullets on edges
                {
                    for (let i = -3; i <= 3; i++) {
                        let angle = playerAngle + i * 0.35;
                        let bulletType = (i === -3 || i === 3) ? 'lead' : 'sig';
                        let speed = getSpeed(bulletType);
                        enemyBullets.push(new Bullet(
                            this.x, this.y + this.size / 2,
                            cos(angle) * speed,
                            sin(angle) * speed,
                            false, 1, 5, bulletType
                        ));
                    }
                }
                break;

            case 5: // Area 5: Spread + circular (8-way)
                {
                    let sigSpeed = getSpeed('sig');
                    let leadSpeed = getSpeed('lead', 0.8);
                    // Player-aimed spread
                    for (let i = -2; i <= 2; i++) {
                        let angle = playerAngle + i * 0.3;
                        enemyBullets.push(new Bullet(
                            this.x, this.y + this.size / 2,
                            cos(angle) * sigSpeed,
                            sin(angle) * sigSpeed,
                            false, 1, 5, 'sig'
                        ));
                    }
                    // Circular pattern
                    if (this.moveTimer % 2 === 0) {
                        for (let i = 0; i < 8; i++) {
                            let angle = (i / 8) * TWO_PI + this.angle;
                            enemyBullets.push(new Bullet(
                                this.x, this.y,
                                cos(angle) * leadSpeed,
                                sin(angle) * leadSpeed,
                                false, 1, 5, 'lead'
                            ));
                        }
                    }
                }
                break;

            case 6: // Area 6: Dense spread + side shots
                {
                    let leadSpeed = getSpeed('lead');
                    // Wide 9-way spread
                    for (let i = -4; i <= 4; i++) {
                        let angle = playerAngle + i * 0.3;
                        let bulletType = (Math.abs(i) >= 3) ? 'lead' : 'sig';
                        let speed = getSpeed(bulletType);
                        enemyBullets.push(new Bullet(
                            this.x, this.y + this.size / 2,
                            cos(angle) * speed,
                            sin(angle) * speed,
                            false, 1, 5, bulletType
                        ));
                    }
                    // Side shots
                    enemyBullets.push(new Bullet(this.x, this.y, -leadSpeed, 0, false, 1, 5, 'lead'));
                    enemyBullets.push(new Bullet(this.x, this.y, leadSpeed, 0, false, 1, 5, 'lead'));
                }
                break;

            case 7: // Area 7: Spiral + dense circular
                {
                    let sigSpeed = getSpeed('sig');
                    let leadSpeed = getSpeed('lead', 0.7);
                    // Aimed shots
                    for (let i = -2; i <= 2; i++) {
                        let angle = playerAngle + i * 0.25;
                        enemyBullets.push(new Bullet(
                            this.x, this.y + this.size / 2,
                            cos(angle) * sigSpeed,
                            sin(angle) * sigSpeed,
                            false, 1, 5, 'sig'
                        ));
                    }
                    // Spiral pattern (12-way rotating)
                    for (let i = 0; i < 12; i++) {
                        let angle = (i / 12) * TWO_PI + this.angle * 2;
                        enemyBullets.push(new Bullet(
                            this.x, this.y,
                            cos(angle) * leadSpeed,
                            sin(angle) * leadSpeed,
                            false, 1, 5, 'lead'
                        ));
                    }
                }
                break;

            case 8: // Area 8: Complex multi-pattern barrage
                {
                    let leadSpeed = getSpeed('lead');
                    // Dense 11-way spread
                    for (let i = -5; i <= 5; i++) {
                        let angle = playerAngle + i * 0.25;
                        let bulletType = (Math.abs(i) >= 4) ? 'lead' : 'sig';
                        let speed = getSpeed(bulletType);
                        enemyBullets.push(new Bullet(
                            this.x, this.y + this.size / 2,
                            cos(angle) * speed,
                            sin(angle) * speed,
                            false, 1, 5, bulletType
                        ));
                    }
                    // Circular barrage
                    if (this.moveTimer % 3 === 0) {
                        for (let i = 0; i < 16; i++) {
                            let angle = (i / 16) * TWO_PI + this.angle;
                            enemyBullets.push(new Bullet(
                                this.x, this.y,
                                cos(angle) * leadSpeed,
                                sin(angle) * leadSpeed,
                                false, 1, 5, 'lead'
                            ));
                        }
                    }
                }
                break;

            case 9: // Area 9: Spiral + tracking + multi-directional
                {
                    let sigSpeed = getSpeed('sig', 1.1);
                    let leadSpeed1 = getSpeed('lead', 0.8);
                    let leadSpeed2 = getSpeed('lead');
                    // Triple aimed shots
                    for (let i = -1; i <= 1; i++) {
                        let angle = playerAngle + i * 0.2;
                        enemyBullets.push(new Bullet(
                            this.x, this.y + this.size / 2,
                            cos(angle) * sigSpeed,
                            sin(angle) * sigSpeed,
                            false, 1, 5, 'sig'
                        ));
                    }
                    // Dense spiral (16-way)
                    for (let i = 0; i < 16; i++) {
                        let angle = (i / 16) * TWO_PI + this.angle * 1.5;
                        enemyBullets.push(new Bullet(
                            this.x, this.y,
                            cos(angle) * leadSpeed1,
                            sin(angle) * leadSpeed1,
                            false, 1, 5, 'lead'
                        ));
                    }
                    // Cross pattern
                    for (let i = 0; i < 4; i++) {
                        let angle = (i / 4) * TWO_PI;
                        enemyBullets.push(new Bullet(
                            this.x, this.y,
                            cos(angle) * leadSpeed2,
                            sin(angle) * leadSpeed2,
                            false, 1, 5, 'lead'
                        ));
                    }
                }
                break;

            case 10: // Area 10: Extreme density barrage
                {
                    let leadSpeed = getSpeed('lead', 0.9);
                    // Wide 13-way spread
                    for (let i = -6; i <= 6; i++) {
                        let angle = playerAngle + i * 0.22;
                        let bulletType = (Math.abs(i) >= 5) ? 'lead' : 'sig';
                        let speed = getSpeed(bulletType);
                        enemyBullets.push(new Bullet(
                            this.x, this.y + this.size / 2,
                            cos(angle) * speed,
                            sin(angle) * speed,
                            false, 1, 5, bulletType
                        ));
                    }
                    // Dense circular (20-way)
                    for (let i = 0; i < 20; i++) {
                        let angle = (i / 20) * TWO_PI + this.angle;
                        enemyBullets.push(new Bullet(
                            this.x, this.y,
                            cos(angle) * leadSpeed,
                            sin(angle) * leadSpeed,
                            false, 1, 5, 'lead'
                        ));
                    }
                }
                break;

            case 11: // Area 11: Massive multi-pattern assault
                {
                    let leadSpeed1 = getSpeed('lead', 0.85);
                    let leadSpeed2 = getSpeed('lead');
                    // Ultra-wide 15-way spread
                    for (let i = -7; i <= 7; i++) {
                        let angle = playerAngle + i * 0.2;
                        let bulletType = (Math.abs(i) >= 6) ? 'lead' : 'sig';
                        let speed = getSpeed(bulletType);
                        enemyBullets.push(new Bullet(
                            this.x, this.y + this.size / 2,
                            cos(angle) * speed,
                            sin(angle) * speed,
                            false, 1, 5, bulletType
                        ));
                    }
                    // Double spiral (24-way)
                    for (let i = 0; i < 24; i++) {
                        let angle = (i / 24) * TWO_PI + this.angle * 2;
                        enemyBullets.push(new Bullet(
                            this.x, this.y,
                            cos(angle) * leadSpeed1,
                            sin(angle) * leadSpeed1,
                            false, 1, 5, 'lead'
                        ));
                    }
                    // Side barrages
                    for (let i = 0; i < 3; i++) {
                        enemyBullets.push(new Bullet(this.x, this.y, -leadSpeed2, i * 0.5, false, 1, 5, 'lead'));
                        enemyBullets.push(new Bullet(this.x, this.y, leadSpeed2, i * 0.5, false, 1, 5, 'lead'));
                    }
                }
                break;

            case 12: // Area 12: FINAL BOSS - Ultimate barrage
                {
                    let leadSpeed1 = getSpeed('lead', 0.8);
                    let leadSpeed2 = getSpeed('lead');
                    let sigSpeed = getSpeed('sig', 1.2);
                    // Maximum 17-way spread
                    for (let i = -8; i <= 8; i++) {
                        let angle = playerAngle + i * 0.18;
                        let bulletType = (Math.abs(i) >= 6) ? 'lead' : 'sig';
                        let multiplier = (Math.abs(i) % 2 === 0 ? 1.1 : 0.9);
                        let speed = getSpeed(bulletType, multiplier);
                        enemyBullets.push(new Bullet(
                            this.x, this.y + this.size / 2,
                            cos(angle) * speed,
                            sin(angle) * speed,
                            false, 1, 5, bulletType
                        ));
                    }
                    // Triple spiral (32-way)
                    for (let i = 0; i < 32; i++) {
                        let angle = (i / 32) * TWO_PI + this.angle * 2.5;
                        enemyBullets.push(new Bullet(
                            this.x, this.y,
                            cos(angle) * leadSpeed1,
                            sin(angle) * leadSpeed1,
                            false, 1, 5, 'lead'
                        ));
                    }
                    // Dense circular (24-way)
                    for (let i = 0; i < 24; i++) {
                        let angle = (i / 24) * TWO_PI - this.angle;
                        enemyBullets.push(new Bullet(
                            this.x, this.y,
                            cos(angle) * leadSpeed2,
                            sin(angle) * leadSpeed2,
                            false, 1, 5, 'lead'
                        ));
                    }
                    // All-direction barrage
                    for (let i = 0; i < 8; i++) {
                        let angle = (i / 8) * TWO_PI;
                        enemyBullets.push(new Bullet(
                            this.x, this.y,
                            cos(angle) * sigSpeed,
                            sin(angle) * sigSpeed,
                            false, 1, 5, 'sig'
                        ));
                    }
                }
                break;
        }
    }

    draw() {
        push();
        noStroke();

        // Warning flash in phase 3
        if (this.phase === 3 && frameCount % 6 < 3) {
            fill(255, 100, 100, 100);
            ellipse(this.x, this.y, this.size * 3, this.size * 3);
        }

        // Boss body
        fill(this.color);

        // Main body - complex shape
        ellipse(this.x, this.y, this.size * 2, this.size * 1.5);

        // Wings/sides
        push();
        translate(this.x, this.y);
        rotate(this.angle);

        fill(red(this.color) * 0.8, green(this.color) * 0.8, blue(this.color) * 0.8);
        ellipse(-this.size * 1.2, 0, this.size, this.size * 0.7);
        ellipse(this.size * 1.2, 0, this.size, this.size * 0.7);

        pop();

        // Core
        fill(255, 255, 255, 200);
        ellipse(this.x, this.y, this.size * 0.8, this.size * 0.8);

        // Details
        fill(this.color);
        ellipse(this.x, this.y, this.size * 0.5, this.size * 0.5);

        // Glowing effect
        fill(red(this.color), green(this.color), blue(this.color), 50);
        ellipse(this.x, this.y, this.size * 2.5, this.size * 2);

        // HP bar (prominent)
        let barWidth = 200;
        let barHeight = 8;
        let barX = GAME_WIDTH / 2 - barWidth / 2;
        let barY = 20;

        // Background
        fill(50, 50, 50);
        rect(barX, barY, barWidth, barHeight);

        // HP fill
        let hpPercent = this.hp / this.maxHp;
        let fillColor;
        if (hpPercent > 0.66) {
            fillColor = color(100, 255, 100);
        } else if (hpPercent > 0.33) {
            fillColor = color(255, 255, 100);
        } else {
            fillColor = color(255, 100, 100);
        }

        fill(fillColor);
        rect(barX, barY, barWidth * hpPercent, barHeight);

        // Border
        noFill();
        stroke(255);
        strokeWeight(2);
        rect(barX, barY, barWidth, barHeight);

        // Text
        noStroke();
        fill(255);
        textAlign(CENTER, TOP);
        textSize(12);
        text(`BOSS - AREA ${this.areaNumber}`, GAME_WIDTH / 2, barY - 15);
        textSize(10);
        text(`HP: ${int(this.hp)}/${int(this.maxHp)}`, GAME_WIDTH / 2, barY + barHeight + 3);

        pop();
    }

    isOffscreen() {
        // Boss never goes offscreen by itself
        return false;
    }
}

// Special Enemy: AI-AI (アイアイ)
// A rare special ground enemy that appears in specific areas
class SpecialAIAI {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 15; // Smaller size (was 30)
        this.hp = 666;
        this.maxHp = 666;
        this.scoreValue = 10000;
        this.isGround = true;
        this.isSpecial = true; // Flag to identify as AI-AI
        this.canShoot = false;
        this.scrollSpeed = 0.075; // Very slow movement (reduced to 1/2 again)
        this.angle = 0; // For animation

        // Color scheme - make it look special
        this.baseColor = color(255, 215, 0); // Gold
        this.glowColor = color(255, 255, 100);
    }

    update() {
        // Scroll down behavior
        if (!areaManager || !areaManager.bossActive) {
            this.y += this.scrollSpeed;
        } else if (areaManager && areaManager.bossActive && areaManager.bossIntroPhase < 3) {
            // During boss intro, continue scrolling
            this.y += this.scrollSpeed;
        }

        // Rotate for visual effect
        this.angle += 0.02;
    }

    shoot() {
        // AI-AI doesn't shoot
    }

    onDestroyed() {
        // Special rewards when destroyed
        if (player && player.alive) {
            console.log('AI-AI DESTROYED! BONUS ACTIVATED!');

            // Main weapon +15 levels
            let oldMainLevel = player.mainWeaponLevel;
            player.mainWeaponLevel = min(30, player.mainWeaponLevel + 15);
            console.log(`Main weapon: ${oldMainLevel} → ${player.mainWeaponLevel}`);

            // Sub weapon level 5
            let oldSubLevel = player.subWeaponLevel;
            player.subWeaponLevel = 5;
            if (player.subWeaponType !== 0) {
                player.initSubWeapon(player.subWeaponType);
            }
            console.log(`Sub weapon level: ${oldSubLevel} → ${player.subWeaponLevel}`);

            // Add 1 life
            let oldLives = player.lives;
            player.lives++;
            console.log(`Lives: ${oldLives} → ${player.lives}`);

            // Huge visual feedback - gold particles everywhere!
            for (let i = 0; i < 100; i++) {
                particles.push(new Particle(this.x, this.y, 30, color(255, 215, 0)));
            }
            createExplosion(this.x, this.y, this.size * 5);
        }
    }

    draw() {
        push();
        translate(this.x, this.y);

        // Outer glow
        noStroke();
        for (let i = 3; i > 0; i--) {
            fill(this.glowColor.levels[0], this.glowColor.levels[1], this.glowColor.levels[2], 50 / i);
            ellipse(0, 0, this.size * 2 * i * 0.4, this.size * 2 * i * 0.4);
        }

        // Main body - golden orb
        fill(255, 215, 0);
        ellipse(0, 0, this.size * 2, this.size * 2);

        // Inner shine
        fill(255, 255, 200, 200);
        ellipse(-this.size * 0.3, -this.size * 0.3, this.size * 1.2, this.size * 1.2);

        // Rotating symbols (AI characters)
        fill(255, 100, 100);
        rotate(this.angle);
        textSize(10); // Smaller text (was 16)
        textAlign(CENTER, CENTER);
        text('AI', 0, 0);

        // Reset rotation for HP bar
        rotate(-this.angle);

        // HP bar (no text display)
        if (this.hp > 0 && this.maxHp > 0) {
            fill(255, 100, 100);
            rectMode(CENTER);
            rect(0, -this.size - 8, this.size * 2, 4);

            fill(100, 255, 100);
            let hpWidth = map(this.hp, 0, this.maxHp, 0, this.size * 2);
            rect(-(this.size * 2 - hpWidth) / 2, -this.size - 8, hpWidth, 4);
        }

        pop();
    }

    isOffscreen() {
        return this.y > GAME_HEIGHT + 50;
    }
}

// Supply Base (補給基地)
// Ground-based supply stations that don't attack but drop weapons
class SupplyBase {
    constructor(x, y, scrollSpeed = 1.5) {
        this.x = x;
        this.y = y;
        this.size = 12; // Smaller size (was 20)
        this.hp = 20; // Lower HP (was 100)
        this.maxHp = 20;
        this.scoreValue = 500;
        this.isGround = true;
        this.isSupplyBase = true; // Flag to identify as supply base
        this.canShoot = false;
        this.scrollSpeed = scrollSpeed; // Match area scroll speed

        // Color scheme - neutral/friendly
        this.baseColor = color(100, 150, 200);
    }

    update() {
        // Scroll down behavior
        if (!areaManager || !areaManager.bossActive) {
            this.y += this.scrollSpeed;
        } else if (areaManager && areaManager.bossActive && areaManager.bossIntroPhase < 3) {
            // During boss intro, continue scrolling
            this.y += this.scrollSpeed;
        }
    }

    shoot() {
        // Supply bases don't shoot
    }

    onDestroyed() {
        // Always drop a random weapon (0-7)
        let weaponType = int(random(0, 8));
        powerUps.push(new SubWeapon(this.x, this.y, weaponType));
    }

    draw() {
        push();
        translate(this.x, this.y);

        // Dome structure
        noStroke();

        // Base
        fill(80, 120, 160);
        ellipse(0, this.size * 0.3, this.size * 2, this.size * 0.8);

        // Main dome
        fill(100, 150, 200);
        ellipse(0, 0, this.size * 2, this.size * 2);

        // Highlight
        fill(150, 200, 250, 180);
        ellipse(-this.size * 0.3, -this.size * 0.3, this.size * 1.2, this.size * 1.2);

        // Small antenna on top
        stroke(150, 200, 255);
        strokeWeight(1);
        line(0, -this.size, 0, -this.size - 4);
        noStroke();
        fill(255, 100, 100);
        ellipse(0, -this.size - 4, 3, 3);

        // HP bar
        if (this.hp > 0 && this.maxHp > 0) {
            fill(255, 100, 100);
            rectMode(CENTER);
            rect(0, this.size + 5, this.size * 1.5, 2);

            fill(100, 255, 100);
            let hpWidth = map(this.hp, 0, this.maxHp, 0, this.size * 1.5);
            rect(-(this.size * 1.5 - hpWidth) / 2, this.size + 5, hpWidth, 2);
        }

        pop();
    }

    isOffscreen() {
        return this.y > GAME_HEIGHT + 50;
    }
}

// PowerBox (パワーチップボックス)
// Blue box enemies that form triangle formations (1 leader, 2 followers)
// One box contains a P-item. Special collision: touching untouched P-item box gives +5 levels without damage
class PowerBox {
    constructor(x, y, hasPowerChip = false, formation = null) {
        this.x = x;
        this.y = y;
        this.size = 10;
        this.hp = 1;
        this.maxHp = 1;
        this.scoreValue = 100;
        this.hasPowerChip = hasPowerChip; // Does this box contain a power chip?
        this.formation = formation; // Reference to parent formation
        this.speed = 1.0; // Slow movement
        this.color = color(50, 100, 255); // Blue
        this.glowPhase = 0; // For pulsing glow effect
        this.canShoot = false;
    }

    update() {
        this.y += this.speed;
        this.glowPhase += 0.1;
    }

    shoot() {
        // PowerBoxes don't shoot
    }

    hits(bullet) {
        // Check if bullet collides with this PowerBox
        let d = dist(this.x, this.y, bullet.x, bullet.y);
        return d < this.size + bullet.size;
    }

    hit(damage) {
        // Mark formation as touched when hit by bullets
        // Bullet hit = gamble ends (but P-chip still drops if this box had it)
        if (this.formation) {
            this.formation.touched = true;
        }

        this.hp -= damage;
        if (this.hp <= 0) {
            this.onDestroyed();
        }
    }

    onDestroyed() {
        // Drop power chip if this box contained one
        if (this.hasPowerChip) {
            powerUps.push(new PowerChip(this.x, this.y));
        }
    }

    // Check collision with player - special handling for untouched formations
    checkPlayerCollision(player) {
        if (!player.alive || player.respawning) return false;

        let distance = dist(this.x, this.y, player.x, player.y);
        if (distance < this.size + player.size) {
            // Collision detected - box is ALWAYS destroyed (even during invincibility)

            // Check if this is an untouched formation (gamble situation)
            if (this.formation && !this.formation.touched) {
                // Untouched formation - gamble result
                if (this.hasPowerChip) {
                    // JACKPOT! Correct box hit without attacking formation
                    let oldLevel = player.mainWeaponLevel;
                    player.mainWeaponLevel = min(player.mainWeaponLevel + 5, 30);

                    console.log(`POWERBOX JACKPOT! Main weapon: ${oldLevel} → ${player.mainWeaponLevel}`);

                    // Big visual feedback for the bonus
                    for (let i = 0; i < 50; i++) {
                        particles.push(new Particle(this.x, this.y, 20, color(255, 255, 0)));
                    }

                    // Extra score bonus for jackpot
                    addScore(500);

                    // Grant 2 seconds invincibility (same as P-item)
                    player.invulnerable = true;
                    player.invulnerableTime = 120; // 2 seconds

                    // Mark formation as touched (gamble ends on WIN)
                    this.formation.touched = true;
                } else {
                    // LOSE! Wrong box hit - take damage unless invulnerable
                    console.log(`POWERBOX MISS! Wrong box - try another one.`);

                    if (!player.invulnerable) {
                        player.hit();
                    }

                    // DON'T mark formation as touched - player can try another box
                    // this.formation.touched = true; // REMOVED - gamble continues!
                }
            } else {
                // Already attacked formation OR no formation - normal collision
                if (!player.invulnerable) {
                    player.hit();
                }
            }

            // ALWAYS destroy the box on collision (even during invincibility)
            this.hp = 0;
            createExplosion(this.x, this.y, this.size);
            addScore(this.scoreValue);
            return true;
        }
        return false;
    }

    draw() {
        push();
        translate(this.x, this.y);

        // All boxes look identical - no visual hint about which has power chip
        // Main box
        fill(50, 100, 255);
        stroke(100, 150, 255);
        strokeWeight(2);
        rectMode(CENTER);
        rect(0, 0, this.size * 2, this.size * 2);

        // Inner detail
        fill(80, 130, 255);
        rect(0, 0, this.size * 1.4, this.size * 1.4);

        // Small highlight for all boxes (not just P-item boxes)
        fill(120, 170, 255, 100);
        ellipse(-this.size * 0.3, -this.size * 0.3, this.size * 0.6, this.size * 0.6);

        pop();
    }

    isOffscreen() {
        return this.y > GAME_HEIGHT + 50;
    }
}

// PowerBox Formation Manager
// Manages a triangle formation of 3 PowerBoxes (1 leader, 2 followers)
class PowerBoxFormation {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.boxes = [];
        this.touched = false; // Has any box been attacked or touched?
        this.powerChipIndex = int(random(0, 3)); // Which box has the power chip (0, 1, or 2)

        // Create formation: triangle shape (wider spacing for 1/3 gamble)
        // Leader in front (top)
        this.boxes.push(new PowerBox(x, y, this.powerChipIndex === 0, this));

        // Two followers behind (bottom left and right) - wider spacing
        this.boxes.push(new PowerBox(x - 35, y + 50, this.powerChipIndex === 1, this));
        this.boxes.push(new PowerBox(x + 35, y + 50, this.powerChipIndex === 2, this));
    }

    update() {
        // Update all boxes
        for (let box of this.boxes) {
            box.update();
        }

        // Remove destroyed boxes (HP <= 0)
        this.boxes = this.boxes.filter(box => box.hp > 0);
    }

    draw() {
        // Draw all boxes
        for (let box of this.boxes) {
            box.draw();
        }
    }

    // Get all boxes in this formation
    getBoxes() {
        return this.boxes;
    }

    // Check if all boxes are destroyed
    allDestroyed() {
        return this.boxes.every(box => box.hp <= 0);
    }

    // Check if any box is offscreen
    isOffscreen() {
        return this.boxes.every(box => box.isOffscreen());
    }
}

// Special Crow (カラス)
// Bonus enemy that appears at game start and specific areas
// Drops 1UP if killed with sub weapon BEFORE using main weapon
class SpecialCrow {
    constructor() {
        this.x = GAME_WIDTH - 50; // Start from right edge
        this.y = -20; // Start above screen
        this.size = 12;
        this.hp = 1;
        this.maxHp = 1;
        this.scoreValue = 1000;
        this.isSpecialCrow = true;
        this.canShoot = false;

        // Movement pattern: straight down → rapid straight up
        this.phase = 0; // 0: descend, 1: ascend rapidly
        this.targetY = GAME_HEIGHT / 2; // Turn point at center
        this.descendSpeed = 2.5; // Speed going down
        this.ascendSpeed = 5.0; // Rapid speed going up
        this.angle = 0; // For flapping animation
    }

    update() {
        this.angle += 0.15; // Wing flapping animation

        if (this.phase === 0) {
            // Phase 0: Straight down
            this.y += this.descendSpeed;

            // When reaching center, switch to rapid ascent
            if (this.y >= this.targetY) {
                this.phase = 1;
            }
        } else if (this.phase === 1) {
            // Phase 1: Rapid straight up
            this.y -= this.ascendSpeed;
        }
    }

    shoot() {
        // Crow doesn't shoot
    }

    hits(bullet) {
        // Check if bullet collides with crow
        let d = dist(this.x, this.y, bullet.x, bullet.y);
        return d < this.size + bullet.size;
    }

    onDestroyed() {
        // Check if player deserves 1UP bonus
        // Bonus condition: killed with sub weapon BEFORE using main weapon
        if (player && player.alive && !player.hasUsedMainWeapon) {
            console.log('CROW BONUS! 1UP for not using main weapon!');
            powerUps.push(new OneUpItem(this.x, this.y));

            // Extra visual feedback
            for (let i = 0; i < 30; i++) {
                particles.push(new Particle(this.x, this.y, 15, color(255, 100, 255)));
            }
        }
    }

    draw() {
        push();
        translate(this.x, this.y);

        // Draw crow (simple bird shape)
        fill(50, 50, 50); // Dark gray/black
        noStroke();

        // Body
        ellipse(0, 0, this.size * 1.5, this.size);

        // Wings (flapping)
        let wingY = sin(this.angle) * 3;
        triangle(
            -this.size, wingY,
            -this.size * 2, wingY - 5,
            -this.size, wingY + 5
        );
        triangle(
            this.size, wingY,
            this.size * 2, wingY - 5,
            this.size, wingY + 5
        );

        // Head
        fill(40, 40, 40);
        ellipse(this.size * 0.4, -this.size * 0.3, this.size * 0.8, this.size * 0.8);

        // Eye
        fill(255, 0, 0);
        ellipse(this.size * 0.6, -this.size * 0.4, 3, 3);

        // Beak
        fill(255, 200, 0);
        triangle(
            this.size * 0.8, -this.size * 0.3,
            this.size * 1.2, -this.size * 0.3,
            this.size, -this.size * 0.2
        );

        pop();
    }

    isOffscreen() {
        // Offscreen if above top or too far left
        return this.y < -50 || this.x < -50;
    }
}
