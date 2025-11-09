# ZNK - ZANAC-Inspired Vertical Shooter

A tribute to the classic 1986 shooter game ZANAC, featuring the revolutionary ALG (Automatic Level of Game) system that dynamically adjusts difficulty based on player performance.

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
- **0 - NORMAL**: Standard straight shot
- **1 - DOUBLE**: Twin parallel shots
- **2 - SPREAD**: Triple forward spread
- **3 - WIDE**: 5-way wide spread pattern
- **4 - SIDE**: Forward cannon with side shots
- **5 - RAPID**: High-speed single shot
- **6 - LASER**: Powerful thick beam
- **7 - ALL**: 8-directional all-around attack

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

This project is open source and available for educational purposes. Feel free to modify and share!

## 🙏 Credits

- **Inspired by**: ZANAC (1986) by Compile
- **Developed with**: p5.js
- **Created by**: techs targe

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
