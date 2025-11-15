# ZNK - ZANAC-Inspired Vertical Shooter

**An original, fan-made educational project** - A tribute to the classic 1986 shooter game ZANAC, featuring the revolutionary ALG (Automatic Level of Game) system that dynamically adjusts difficulty based on player performance.

> **Note**: This is a completely original implementation with no copyrighted assets from ZANAC. All code, graphics, and game logic are created from scratch for educational purposes.

![Game Type](https://img.shields.io/badge/Type-Vertical%20Shooter-blue)
![Technology](https://img.shields.io/badge/Tech-HTML5%20%2B%20p5.js-green)
![Status](https://img.shields.io/badge/Status-Playable-brightgreen)

## 🎮 Features

### Core Gameplay
- **Vertical scrolling shooter** action with smooth 60 FPS gameplay
- **Auto-fire system** - focus on dodging and positioning
- **8 unique weapon types** (numbered 0-7) inspired by ZANAC
- **Multiple enemy types** with distinct movement patterns and behaviors
- **Score-based progression** with high score tracking

### ALG System (Automatic Level of Game)
The game features an intelligent difficulty adjustment system that monitors your performance:
- **Adaptive difficulty** - game gets harder as you improve
- **Performance tracking** - monitors destruction rate, accuracy, and survival time
- **Dynamic enemy spawning** - spawn rate and enemy types adjust to your skill
- **Fair balancing** - difficulty decreases if you're struggling

### Weapon System (0-7)
Collect numbered power-ups to change your weapon:
- **0 - ALL-RANGE**: Direction-based omnidirectional shots
- **1 - CRUSHER**: Penetrating shots that destroy bullets
- **2 - BARRIER**: Rotating shield with bullet destruction
- **3 - CIRCULAR**: Orbiting bullets around the ship
- **4 - VIBRATOR**: Wide oscillating horizontal coverage
- **5 - REWINDER**: Boomerang (mutates to laser at Lv5+)
- **6 - PLASMA**: Area-of-effect trigger bullet
- **7 - HI-SPEED**: Ultra-rapid fire with movement tracking

For detailed weapon specifications, see the [Weapon System Details](#-weapon-system-サブウェポン詳細) section below.

### Enemy Types
- **Basic**: Standard enemies, good for beginners
- **Shooter**: Fires aimed shots at the player
- **Weaver**: Moves in sinusoidal patterns
- **Tank**: Slow but heavily armored
- **Fast**: Quick-moving agile enemies
- **Spiral**: Rotates while firing
- **Bomber**: Fires wide bullet spreads

## 🕹️ Controls

| Key | Action |
|-----|--------|
| **Arrow Keys** / **WASD** | Move ship |
| **Space** / **Enter** | Start game / Restart after game over |
| **P** | Pause / Resume |

> **Note**: The ship auto-fires continuously - focus on movement and dodging!

## 🚀 How to Play

1. **Clone or download** this repository
2. **Open** `index.html` in a modern web browser
3. **Press Space or Enter** to start
4. **Survive and score!**

### Alternatively, run with a local server:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000` in your browser.

## 🎯 Gameplay Tips

1. **Collect Power-ups Strategically**: Different weapons excel in different situations
   - Use WIDE (3) or ALL (7) for crowded screens
   - Use LASER (6) or RAPID (5) for tough single targets

2. **Watch the Difficulty Indicator**: The top-right shows current difficulty level
   - The better you play, the harder it gets!
   - Take breaks to let difficulty stabilize

3. **Preserve Your Lives**: You lose weapon level when hit
   - Invulnerability period after getting hit (ship flashes)
   - Don't waste it - reposition to safety

4. **Learn Enemy Patterns**: Each enemy type has predictable behavior
   - Shooters aim at you - stay mobile
   - Weavers are predictable - time your shots
   - Tanks are slow - circle around them

5. **Score Management**: Higher scores increase difficulty
   - Focus on survival over score when overwhelmed
   - ALG system will adjust down if needed

## 🛠️ Technical Details

### Built With
- **p5.js** (v1.7.0) - Creative coding library
- **HTML5 Canvas** - Rendering
- **Vanilla JavaScript** - Game logic

### Project Structure
```
znk/
├── index.html          # Main HTML file
├── sketch.js           # Game loop and state management
├── player.js           # Player ship class
├── enemy.js            # Enemy types and behaviors
├── bullet.js           # Projectile system
├── powerup.js          # Power-up items
├── enemyManager.js     # ALG system and enemy spawning
├── particle.js         # Visual effects
└── README.md           # This file
```

### Code Architecture
- **Object-oriented design** with ES6 classes
- **Separation of concerns** - each class handles specific functionality
- **Performance optimized** - efficient particle and bullet management
- **Modular structure** - easy to extend and modify

## 🎨 Graphics & Style

- **Retro-inspired aesthetics** with modern visual effects
- **Particle system** for explosions and feedback
- **Smooth animations** at 60 FPS
- **Color-coded systems**:
  - Player bullets: Cyan/Blue
  - Enemy bullets: Red/Orange
  - Power-ups: Color-coded by type
  - Enemies: Unique colors per type

## 📊 ALG System Details

The ALG (Automatic Level of Game) system tracks:

| Metric | Impact on Difficulty |
|--------|---------------------|
| Enemies destroyed | Higher rate → Harder |
| Score gain rate | Faster gain → Harder |
| Player hits taken | Each hit → Easier |
| Weapon level | Better weapons → Harder |
| Survival time | Longer survival → Harder |

Difficulty affects:
- Enemy spawn rate
- Enemy type distribution
- Enemy health and speed
- Bullet patterns intensity

## 🏆 Scoring

- **Basic enemy**: 10 points
- **Shooter**: 30 points
- **Weaver**: 40 points
- **Fast**: 50 points
- **Spiral**: 60 points
- **Bomber**: 80 points
- **Tank**: 100 points
- **Power-up collection**: 100 points
- **Wave completion bonus**: Wave# × 100 points

## 🔮 Future Enhancements

Potential features for future versions:
- Boss battles at certain score thresholds
- More weapon types and upgrades
- Sound effects and music
- Touch controls for mobile devices
- Leaderboard system
- Special stages
- Co-op multiplayer mode

## 📜 License

This project is open source and available for **educational and non-commercial purposes only**.

MIT License with the following restrictions:
- ✅ Free for personal, educational, and non-commercial use
- ✅ Modification and sharing allowed with attribution
- ❌ Commercial use is NOT permitted without explicit permission
- ❌ Do not misrepresent this as an official ZANAC product

## ⚖️ Legal Notice / Disclaimer

**IMPORTANT - PLEASE READ:**

This is an **independent, fan-made educational project** created as a tribute to classic vertical shooter games.

### Original Work Declaration
- **All code, graphics, and game assets** in this project are **100% original creations**
- No copyrighted materials, sprites, sounds, or code from ZANAC or any other game have been used
- All game mechanics are implemented from scratch using p5.js
- Visual elements are created using basic geometric shapes (circles, rectangles, lines)

### Inspiration Attribution
This project is **inspired by game concepts and mechanics** from:
- **ZANAC** (1986) developed by Compile
- Classic vertical scrolling shooter genre conventions

Game concepts, rules, and mechanics are **not protected by copyright** and are freely implementable.

### No Affiliation
- This project is **NOT affiliated with, endorsed by, or connected to**:
  - Compile (original developer)
  - D4 Enterprise (current rights holder)
  - Any official ZANAC rights holders or licensees
- This is **not an official ZANAC product** or authorized derivative work

### Trademark Notice
- "ZANAC" is a trademark of its respective owner
- This project makes **fair use** of the name for descriptive and educational purposes only
- The trademark is used **solely to indicate inspiration** from the original game
- No trademark infringement is intended

### Usage Terms
- **For educational and non-commercial use only**
- **No warranty** of any kind is provided
- Use at your own risk
- If you believe any content infringes on your rights, please contact the repository owner

### Rights Holder Notice
If you are a rights holder and have concerns about this project, please open an issue or contact us directly. We respect intellectual property rights and will respond promptly to any legitimate concerns.

---

**This project demonstrates game development concepts and serves as a learning resource for aspiring game developers.**

## 🙏 Credits

- **Inspired by**: ZANAC (1986) by Compile
- **Original ZANAC Rights**: Currently held by D4 Enterprise Co., Ltd.
- **Developed with**: p5.js (Open Source)
- **Created by**: techs targe
- **Purpose**: Educational fan project and game development learning resource

## 🎯 Weapon System (サブウェポン詳細)

### Weapon Type Overview

ZNK features 8 distinct sub-weapons (numbered 0-7), each with unique mechanics, resource systems, and level progression (Lv0-5). Each weapon balances power, coverage, and resource limitations to create diverse tactical gameplay.

---

### Detailed Weapon Specifications

#### Weapon 0: ALL-RANGE (全方位弾)

**Basic Information:**
- **Name:** All-Range / 全方位弾
- **Type:** Direction-based projectile
- **Color:** Cyan (#64FFFF)
- **Resource System:** Infinite (no limitations)

**Level Progression:**

| Level | Damage | Size | Fire Rate | Pattern | Bullet Speed | Special Features |
|-------|--------|------|-----------|---------|--------------|------------------|
| Lv0   | 1      | 4    | 8 frames  | Single  | 8 px/frame   | Fires in movement direction |
| Lv1   | 1      | 4    | 8 frames  | Double  | 8 px/frame   | 6px offset perpendicular |
| Lv2-5 | 1      | 4    | 8 frames  | Wide Double | 8 px/frame | 10px offset perpendicular |

**Special Mechanics:**
- **Movement Tracking:** Fires in the direction the player is moving (8 directions)
- **Stationary Default:** When not moving, fires upward (forward)
- **No Ammo/Time Limit:** Can be used indefinitely
- **Perpendicular Offset:** Double shots positioned perpendicular to movement direction

**Tactical Features:**
- **Strengths:** Flexible coverage, no resource management, great for aggressive dodging
- **Weaknesses:** Low damage, requires active movement for directional control
- **Best Against:** Scattered enemies, weaker enemy types
- **Unique Trait:** Only weapon that follows player movement direction

---

#### Weapon 1: CRUSHER (貫通弾 - Straight Crusher)

**Basic Information:**
- **Name:** Straight Crusher / 貫通弾
- **Type:** Penetrating projectile
- **Color:** Green-cyan (#64FFC8)
- **Resource System:** Ammo-based (50 + 50 per level)

**Level Progression:**

| Level | Damage | Size (Diameter) | Fire Rate | Pattern | Bullet Speed | Max Ammo |
|-------|--------|-----------------|-----------|---------|--------------|----------|
| Lv0   | 2      | 8px             | 10 frames | Single  | 5.2 px/frame | 50       |
| Lv1   | 2      | 8px             | 10 frames | Double  | 6.5 px/frame | 100      |
| Lv2   | 2      | 8px             | 10 frames | Wide Double | 7.8 px/frame | 150    |
| Lv3   | 2      | 16px (2x)       | 10 frames | Giant Single | 9.1 px/frame | 200  |
| Lv4   | 2      | 16px (2x)       | 10 frames | Giant Single | 10.4 px/frame | 250 |
| Lv5   | 2      | 24px (3x)       | 10 frames | Giant Single | 11.7 px/frame | 300 |

**Special Mechanics:**
- **Penetration:** Passes through all enemies (doesn't disappear on hit)
- **Bullet Destruction:** Destroys enemy bullets on contact, including LEAD bullets
- **One-At-A-Time:** Cannot fire until previous bullet leaves screen
- **Speed Formula:** Base speed (4 + level) × 1.3
- **Size Scaling:** Lv0-2 (8px), Lv3-4 (16px), Lv5+ (24px)

**Bullet Destruction Capability:**
- ✅ Normal enemy bullets (instant destroy)
- ✅ Sig bullets (2 damage to HP 2)
- ✅ Lead bullets (can destroy with 2 damage)

**Tactical Features:**
- **Strengths:** High penetration, bullet clearing, excellent against bullet-heavy stages
- **Weaknesses:** Ammo limited, one bullet at a time, slow fire rate
- **Best Against:** Dense enemy formations, bullet hell patterns, Lead bullets
- **Unique Trait:** Only weapon besides 2 and 5 that can destroy Lead bullets

---

#### Weapon 2: BARRIER (防御幕 - Field Shutter)

**Basic Information:**
- **Name:** Field Shutter / 防御幕
- **Type:** Rotating shield (active defense)
- **Color:** Blue (#64C8FF)
- **Resource System:** Durability-based (50 + 30 per level)

**Level Progression:**

| Level | Damage | Radius | Fire Rate | Coverage | Max Durability | Decay Rate |
|-------|--------|--------|-----------|----------|----------------|------------|
| Lv0   | 3      | 25px   | 20 frames | Front 30° | 50            | 1 per 0.5s |
| Lv1   | 3      | 33px   | 20 frames | Front 30° | 80            | 1 per 0.5s |
| Lv2   | 3      | 41px   | 20 frames | Front 60° | 110           | 1 per 0.5s |
| Lv3   | 3      | 49px   | 20 frames | Front 180° | 140          | 1 per 0.5s |
| Lv4   | 3      | 57px   | 20 frames | Front 270° | 170          | 1 per 0.5s |
| Lv5   | 3      | 65px   | 20 frames | Full 360° | 200           | 1 per 0.5s |

**Special Mechanics:**
- **Active Shield:** Creates rotating barrier around player
- **Bullet Destruction:** Destroys enemy bullets on contact, including LEAD bullets
- **Enemy Damage:** Continuously damages enemies touching barrier (3 HP/contact)
- **Dual Durability Loss:** Loses durability from time decay AND bullet/enemy contact
- **Fixed Position:** Barrier does not rotate (stationary angle)
- **Enemy Durability Cost:** -0.3 durability per frame of enemy contact
- **Bullet Durability Cost:** -1 durability per bullet destroyed

**Coverage by Level:**
- **Lv0-1:** Front 30° (single segment, narrow cone)
- **Lv2:** Front 60° (2 segments, wider cone)
- **Lv3:** Front 180° (6 segments, half-circle)
- **Lv4:** Front 270° (9 segments, three-quarters)
- **Lv5:** Full 360° (12 segments, complete protection)

**Bullet Destruction Capability:**
- ✅ Normal enemy bullets (instant destroy, -1 durability)
- ✅ Sig bullets (3 damage to HP 2, -1 durability)
- ✅ Lead bullets (can destroy with 3 damage, -1 durability)

**Tactical Features:**
- **Strengths:** Passive defense, clears bullets automatically, damages enemies on contact
- **Weaknesses:** Time-limited even without combat, fragile at low levels
- **Best Against:** Bullet-heavy enemies, close-range combat, Lead bullets
- **Unique Trait:** Only defensive weapon with full 360° coverage at max level

---

#### Weapon 3: CIRCULAR (回転弾 - Rotating Shot)

**Basic Information:**
- **Name:** Circular / 回転弾
- **Type:** Orbiting projectiles
- **Color:** Yellow (#FFFF64)
- **Resource System:** Time-based (180s + 20s per level)

**Level Progression:**

| Level | Damage | Radius | Rotation Speed | Bullet Count | Duration |
|-------|--------|--------|----------------|--------------|----------|
| Lv0   | 3      | 50px   | 0.195 rad/f    | 1            | 180s     |
| Lv1   | 3      | 50px   | 0.195 rad/f    | 1            | 200s     |
| Lv2   | 3      | 50px   | 0.195 rad/f    | 2            | 220s     |
| Lv3   | 3      | 70px   | 0.195 rad/f    | 2            | 240s     |
| Lv4   | 3      | 70px   | 0.286 rad/f    | 2            | 260s     |
| Lv5   | 3      | 70px   | 0.440 rad/f    | 3            | 280s     |

**Special Mechanics:**
- **Orbital Attack:** Bullets orbit around player continuously
- **Bullet Destruction:** Destroys normal and Sig bullets (NOT Lead bullets)
- **Enemy Damage:** Damages enemies on contact (3 HP/contact)
- **Boss Deflection:** Instantly deactivates when hitting boss
- **Time Decay:** Duration decreases continuously
- **Rotation Formula:** Base speed × 1.3 (Lv0-3), × 1.3 (Lv4), × 2.0 (Lv5)

**Bullet Destruction Capability:**
- ✅ Normal enemy bullets (instant destroy)
- ✅ Sig bullets (2 damage to HP 2)
- ❌ Lead bullets (cannot destroy)

**Tactical Features:**
- **Strengths:** Continuous close-range protection, no aiming required, great against swarms
- **Weaknesses:** Short range, cannot destroy Lead bullets, vulnerable to bosses
- **Best Against:** Swarm enemies, close-range combat, enemies that approach from sides
- **Unique Trait:** Only weapon with accelerating rotation speed at higher levels

---

#### Weapon 4: VIBRATOR (振動弾 - Vibrating Shot)

**Basic Information:**
- **Name:** Vibrator / 振動弾
- **Type:** Oscillating projectile (area coverage)
- **Color:** Orange (#FF9632)
- **Resource System:** Durability per shot (fixed 20)

**Level Progression:**

| Level | Damage | Size | Oscillation Width | Oscillation Speed | Durability | Advance Distance |
|-------|--------|------|-------------------|-------------------|------------|------------------|
| Lv0   | 2      | 8px  | 63px (31.5% screen) | 0.50 rad/f     | 20         | 150px            |
| Lv1   | 2      | 12px | 67px (33.5% screen) | 0.52 rad/f     | 20         | 150px            |
| Lv2   | 2      | 16px | 71px (35.5% screen) | 0.54 rad/f     | 20         | 150px            |
| Lv3   | 2      | 20px | 76px (38% screen)   | 0.56 rad/f     | 20         | 150px            |
| Lv4   | 2      | 24px | 80px (40% screen)   | 0.58 rad/f     | 20         | 150px            |
| Lv5   | 2      | 28px | 110px (55% screen)  | 0.60 rad/f     | 20         | 150px            |

**Special Mechanics:**
- **Two-Phase Attack:**
  1. **Advancing:** Moves forward while oscillating for 150px
  2. **Oscillating:** Stops vertically, oscillates horizontally indefinitely
- **Re-Firing:** Can only re-fire after bullet enters oscillating phase
- **Bullet Destruction:** Destroys normal and Sig bullets (NOT Lead bullets)
- **Durability Decay:**
  - -0.5 per frame when in contact with enemies
  - -1 when destroying a bullet
- **Size Scaling:** Scales down to 30% of original size as durability depletes
- **Boss Deflection:** Flies off-screen when hitting boss

**Bullet Destruction Capability:**
- ✅ Normal enemy bullets (instant destroy, -1 durability)
- ✅ Sig bullets (2 damage to HP 2, -1 durability)
- ❌ Lead bullets (cannot destroy)

**Tactical Features:**
- **Strengths:** Extreme horizontal coverage (55% screen at Lv5), area denial, persistent attack
- **Weaknesses:** Limited durability per shot, cannot destroy Lead bullets, predictable pattern
- **Best Against:** Horizontally-aligned enemies, ground targets, area coverage
- **Unique Trait:** Only weapon with stationary oscillating behavior

---

#### Weapon 5: REWINDER (往復弾 - Boomerang/Laser Mutation)

**Basic Information:**
- **Name:** Rewinder / 往復弾 (Boomerang → Laser at Lv5+)
- **Type:** Returning projectile (Lv0-4) / Penetrating laser (Lv5+)
- **Color:** Purple/Magenta (#C864FF)
- **Resource System:** Infinite

**Level Progression - Boomerang Mode (Lv0-4):**

| Level | Damage | Size | Fire Rate | Pattern | Max Distance | Return Speed |
|-------|--------|------|-----------|---------|--------------|--------------|
| Lv0   | 3      | 10px | 12 frames | Single (◎) | 150px      | Variable (4-6) |
| Lv1   | 3      | 13px | 12 frames | Single (◎) | 200px      | Variable (4-6) |
| Lv2   | 3      | 16px | 12 frames | Single (◎) | 250px      | Variable (4-6) |
| Lv3   | 3      | 19px | 12 frames | Double (◎◎) | 300px     | Variable (4-6) |
| Lv4   | 3      | 22px | 12 frames | Double (◎◎) | 350px     | Variable (4-6) |

**Level Progression - Laser Mode (Lv5+):**

| Level | Damage | Size | Fire Rate | Laser Length | Bullet Speed |
|-------|--------|------|-----------|--------------|--------------|
| Lv5   | 8      | 16px | 12 frames | 100px        | 55 px/frame  |

**Special Mechanics - Boomerang (Lv0-4):**
- **Two-Phase Flight:**
  1. **Forward:** Slow forward movement (slows down as it travels)
  2. **Returning:** Returns to player, speeds up as it approaches
- **Perpetual Loop:** Returns to player and relaunches automatically
- **Bullet Destruction:** Destroys all enemy bullets including LEAD bullets
- **Dual Boomerang:** Lv3-4 fire two boomerangs with 15px horizontal offset
- **Boss Deflection:** Flies off-screen when hitting boss (doesn't return)

**Special Mechanics - Laser (Lv5+):**
- **Mutation:** Completely changes to straight laser, NO boomerang
- **Ultra-High Speed:** 30 + (level × 5) = 55 px/frame at Lv5
- **Penetrating:** Passes through all enemies
- **Bullet Destruction:** Destroys all enemy bullets including LEAD bullets
- **Extended Hitbox:** Uses laser length for collision detection

**Bullet Destruction Capability:**
- ✅ Normal enemy bullets (instant destroy)
- ✅ Sig bullets (3 damage to HP 2)
- ✅ Lead bullets (can destroy with 3 damage)

**Tactical Features:**
- **Strengths (Boomerang):** Continuous coverage, no ammo, returns to player, destroys Lead bullets
- **Strengths (Laser):** Extreme speed, high damage, long range, destroys Lead bullets
- **Weaknesses (Boomerang):** Slow forward speed, vulnerable to bosses
- **Weaknesses (Laser):** Narrow hitbox, flies past targets quickly
- **Best Against:** All enemy types, bullet-heavy stages, Lead bullets
- **Unique Trait:** Only weapon that completely mutates at max level

---

#### Weapon 6: PLASMA (反応弾 - Plasma Flash)

**Basic Information:**
- **Name:** Plasma Flash / 反応弾
- **Type:** AoE trigger projectile
- **Color:** Pink/Magenta (#FF64FF)
- **Resource System:** Ammo-based (15 + 5 per level)

**Level Progression:**

| Level | AoE Damage | Size | Fire Rate | Trigger Condition | Max Ammo | Ground Damage |
|-------|------------|------|-----------|-------------------|----------|---------------|
| Lv0   | 5          | 12px | 30 frames | On bullet contact | 15       | ❌            |
| Lv1   | 5          | 12px | 30 frames | On bullet contact | 20       | ❌            |
| Lv2   | 5          | 12px | 30 frames | On bullet contact | 25       | ❌            |
| Lv3   | 5          | 12px | 30 frames | On bullet contact | 30       | ✅ (5 HP)     |
| Lv4   | 5          | 12px | 30 frames | On bullet contact | 35       | ✅ (5 HP)     |
| Lv5   | 5          | 12px | 30 frames | **Instant**       | 40       | ✅ (5 HP)     |

**Special Mechanics:**
- **Trigger-Based Damage:**
  - Lv0-4: Triggers when touching enemy bullet or enemy
  - Lv5: **Instant trigger** on spawn (room-wide nuke)
- **Chain Reaction:**
  1. Bullet touches enemy bullet/enemy
  2. **ALL** enemy bullets on screen are erased
  3. **ALL** air enemies take 5 damage
  4. Lv3+: Ground enemies also take 5 damage
- **One Bullet At A Time:** Cannot fire until previous bullet triggers/leaves screen
- **Super Slow:** Only 2 px/frame (slowest weapon bullet)
- **Boss Immunity:** Does not damage or trigger on bosses

**Tactical Features:**
- **Strengths:** Screen-wide bullet clear, massive AoE damage, instant clear at Lv5
- **Weaknesses:** Very limited ammo, one shot at a time, slow bullet speed
- **Best Against:** Bullet hell stages, dense enemy formations, emergency situations
- **Unique Trait:** Only weapon with instant screen-wide effect (Lv5)

---

#### Weapon 7: HI-SPEED (高速速射弾 - High-Speed Shot)

**Basic Information:**
- **Name:** High-Speed / 高速速射弾
- **Type:** Rapid-fire penetrating projectile
- **Color:** Cyan (#64FFFF)
- **Resource System:** Time-based shooting only (200s + 50s per level)

**Level Progression:**

| Level | Damage | Size (Diameter) | Fire Rate | Bullet Speed | Max Duration | Time Cost/Shot |
|-------|--------|-----------------|-----------|--------------|--------------|----------------|
| Lv0   | 0.2    | 6px             | 5 frames  | 12 px/frame  | 200s         | 0.5s (30f)     |
| Lv1   | 0.2    | 6px             | 5 frames  | 14 px/frame  | 250s         | 0.5s (30f)     |
| Lv2   | 0.2    | 6px             | 5 frames  | 16 px/frame  | 300s         | 0.5s (30f)     |
| Lv3   | 0.2    | 12px (2x)       | 5 frames  | 18 px/frame  | 350s         | 0.5s (30f)     |
| Lv4   | 0.2    | 12px (2x)       | 5 frames  | 20 px/frame  | 400s         | 0.5s (30f)     |
| Lv5   | 0.2    | 18px (3x)       | 5 frames  | 22 px/frame  | 450s         | 0.5s (30f)     |

**Special Mechanics:**
- **Ultra-Rapid Fire:** 5 frames between shots (12 shots/second at 60 FPS)
- **Penetrating Bullets:** Pass through all enemies
- **Movement Curve:** Bullets curve in the direction of player movement
  - Horizontal component: Movement direction × 4
  - Vertical adjustment: Movement direction × 3
- **Time Decay:** Time only decreases when shooting (30 frames per shot)
- **Low Damage:** 1/10 normal damage (0.2 instead of 2) to balance rapid fire
- **Speed Formula:** 12 + (level × 2) px/frame
- **Size Scaling:** Lv0-2 (6px), Lv3-4 (12px), Lv5+ (18px)

**Tactical Features:**
- **Strengths:** Extremely high fire rate, long duration, penetrating bullets, curving shots
- **Weaknesses:** Very low damage per bullet, time limited, requires continuous shooting
- **Best Against:** Fast-moving enemies, dense formations, suppression fire
- **Unique Trait:** Only weapon with time decay exclusively during shooting

---

### Weapon Resource Systems Summary

| Weapon | Resource Type | Max Resources (Lv5) | Decay Condition |
|--------|---------------|---------------------|-----------------|
| 0      | None          | Infinite            | None            |
| 1      | Ammo          | 300 shots           | Per shot        |
| 2      | Durability    | 200 HP              | Time + Contact  |
| 3      | Time          | 280 seconds         | Continuous      |
| 4      | Durability/Shot | 20 HP per bullet | Enemy contact   |
| 5      | None          | Infinite            | None            |
| 6      | Ammo          | 40 shots            | Per shot        |
| 7      | Time          | 450 seconds         | Per shot        |

### Bullet Destruction Matrix

| Weapon | Normal Bullets | Sig Bullets | Lead Bullets |
|--------|----------------|-------------|--------------|
| 0      | ❌              | ❌           | ❌            |
| 1      | ✅ (Instant)    | ✅ (2 dmg)   | ✅ (2 dmg)    |
| 2      | ✅ (Instant)    | ✅ (3 dmg)   | ✅ (3 dmg)    |
| 3      | ✅ (Instant)    | ✅ (2 dmg)   | ❌            |
| 4      | ✅ (Instant)    | ✅ (2 dmg)   | ❌            |
| 5      | ✅ (Instant)    | ✅ (3 dmg)   | ✅ (3 dmg)    |
| 6      | ✅ (All clear)  | ✅ (All clear) | ✅ (All clear) |
| 7      | ❌              | ❌           | ❌            |

**Note:** Only weapons 1, 2, 5, and 6 can destroy Lead bullets (しだれ弾).

---

## 🐛 Known Issues

- None currently - please report any bugs you find!

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Share your high scores!

---

**Enjoy the game and try to beat the ALG system!** 🚀
