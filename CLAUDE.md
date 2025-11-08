# CLAUDE.md - Project Development Documentation

## 📋 Project Information

**Project Name:** ZNK - ZANAC-Inspired Vertical Shooter
**Repository:** https://github.com/techs-targe/zanac-inspired-shooter
**Created:** 2025-11-08
**Developer:** techs-targe
**AI Assistant:** Claude (Anthropic)
**Development Method:** Human-AI Collaborative Development

## 🎯 Project Overview

This project is a tribute to the classic 1986 shooter game **ZANAC** developed by Compile. The game features the revolutionary **ALG (Automatic Level of Game)** system that dynamically adjusts difficulty based on player performance - a groundbreaking feature that was ahead of its time.

### Original ZANAC (1986)
- **Developer:** Compile
- **Publisher:** Pony Canyon (Famicom/NES)
- **Platform:** Famicom/NES
- **Genre:** Vertical Scrolling Shooter
- **Notable Feature:** ALG System - adaptive difficulty adjustment

### Our Implementation
A modern web-based recreation that captures the essence of ZANAC while utilizing contemporary web technologies.

## 🛠️ Technology Stack

### Core Technologies
- **HTML5** - Structure and markup
- **JavaScript (ES6+)** - Game logic and object-oriented programming
- **p5.js (v1.7.0)** - Creative coding library for rendering and game loop

### Architecture
- **Object-Oriented Design** - Each game component is encapsulated in ES6 classes
- **Modular Structure** - Separated concerns across multiple files
- **Event-Driven System** - Efficient collision detection and game state management
- **Performance Optimized** - Array management for bullets, particles, and enemies

## 📁 Project Structure

```
znk/
├── index.html              # Main entry point, CDN links
├── sketch.js               # Game loop, state management, HUD
├── player.js               # Player class with 8 weapon types
├── enemy.js                # Enemy class with 7 types and behaviors
├── bullet.js               # Projectile system for player and enemies
├── powerup.js              # Power-up items (0-7 weapon types)
├── enemyManager.js         # ALG system implementation
├── particle.js             # Visual effects system
├── README.md               # User-facing documentation
├── CLAUDE.md               # This file - development documentation
└── .gitignore              # Git ignore rules
```

## 🎮 Game Design Details

### ALG System Implementation

The ALG (Automatic Level of Game) system is the heart of ZANAC's innovative gameplay. Our implementation tracks multiple performance metrics:

#### Performance Metrics Monitored
1. **Enemy Destruction Rate** - Enemies destroyed per second
2. **Score Gain Rate** - Points accumulated over time
3. **Player Hit Rate** - Frequency of taking damage
4. **Weapon Level** - Current power-up status
5. **Survival Time** - Total time alive

#### Difficulty Adjustment Algorithm
```javascript
// Simplified pseudocode
performanceScore = 0;

if (destroyRate > threshold) performanceScore += 0.02;
if (scoreGainRate > threshold) performanceScore += 0.015;
if (playerHit) performanceScore -= 0.05;
if (powerfulWeapon) performanceScore += 0.01;
if (longSurvival) performanceScore += 0.005;

difficultyLevel += performanceScore;
difficultyLevel = constrain(0.5, 5.0);
```

#### Difficulty Effects
- Enemy spawn rate increases/decreases
- Enemy type distribution shifts toward harder types
- Enemy HP and speed multiply by difficulty factor
- Formation spawning frequency adjusts

### Weapon System Design

Each weapon (0-7) has unique characteristics inspired by ZANAC:

| Type | Name | Description | Fire Pattern |
|------|------|-------------|--------------|
| 0 | NORMAL | Standard shot | Single forward |
| 1 | DOUBLE | Twin cannons | Parallel double |
| 2 | SPREAD | Forward spread | 3-way spread |
| 3 | WIDE | Wide coverage | 5-way wide angle |
| 4 | SIDE | Multi-directional | Forward + side shots |
| 5 | RAPID | High fire rate | Fast single shot |
| 6 | LASER | Penetrating beam | Thick parallel beams |
| 7 | ALL | Omni-directional | 8-way circular |

### Enemy Design Philosophy

Each enemy type serves a specific gameplay purpose:

1. **Basic** - Training wheels for new players
2. **Shooter** - Forces movement and dodging
3. **Weaver** - Teaches pattern recognition
4. **Tank** - Requires sustained fire and positioning
5. **Fast** - Tests reflexes
6. **Spiral** - Complex unpredictable patterns
7. **Bomber** - Area denial and bullet hell elements

## 💡 Key Features Implemented

### Core Gameplay
- ✅ 60 FPS smooth gameplay
- ✅ Auto-fire system (continuous shooting)
- ✅ 8 weapon types with distinct behaviors
- ✅ 7 enemy types with unique patterns
- ✅ Power-up collection system
- ✅ Lives and invulnerability system
- ✅ Score tracking with localStorage persistence

### ALG System
- ✅ Real-time difficulty monitoring
- ✅ Multi-factor performance analysis
- ✅ Smooth difficulty transitions
- ✅ Difficulty level display in HUD
- ✅ Fair balancing (helps struggling players)

### Visual Polish
- ✅ Particle explosion effects
- ✅ Animated starfield background
- ✅ Grid scrolling effect
- ✅ Ship engine trails
- ✅ Bullet glow effects
- ✅ Color-coded systems
- ✅ HP bars for tough enemies
- ✅ Weapon type indicators

### Game Feel
- ✅ Responsive controls (Arrow keys + WASD)
- ✅ Invulnerability flash effect
- ✅ Screen shake on explosion
- ✅ Power-up sparkle animation
- ✅ Bobbing power-up animation
- ✅ Smooth ship movement

## 🔄 Development Process

### Phase 1: Planning
- Researched ZANAC mechanics and ALG system
- Designed class architecture
- Planned file structure for modularity

### Phase 2: Core Implementation
1. **sketch.js** - Game loop and state machine
2. **player.js** - Ship control and weapon system
3. **bullet.js** - Projectile physics
4. **enemy.js** - Enemy types and behaviors

### Phase 3: Advanced Features
5. **powerup.js** - Collectible system
6. **enemyManager.js** - ALG implementation
7. **particle.js** - Visual effects

### Phase 4: Polish & Documentation
8. Collision detection refinement
9. HUD and visual feedback
10. README.md creation
11. CLAUDE.md documentation

## 🎨 Design Decisions

### Color Palette
- **Player bullets:** Cyan/Blue (#64FFFF) - Friendly, high-tech
- **Enemy bullets:** Red/Orange (#FF6464) - Danger
- **Background:** Dark blue/purple (#0A0519) - Space theme
- **Power-ups:** Rainbow spectrum (type-specific)
- **Enemies:** Unique colors per type for instant recognition

### Performance Optimizations
1. **Array cleanup** - Remove offscreen objects immediately
2. **Particle limits** - Size-based particle count
3. **Efficient collision** - Distance checks before detailed collision
4. **Frame-based spawning** - Controlled enemy creation rate

### UX Decisions
- **Auto-fire** - Focus on movement, not button mashing
- **Visual feedback** - Every action has clear visual response
- **Difficulty indicator** - Players can see ALG in action
- **LocalStorage highscore** - Persistence without backend

## 🚀 How to Run

### Quick Start
```bash
# Clone the repository
git clone https://github.com/techs-targe/zanac-inspired-shooter.git
cd zanac-inspired-shooter

# Open in browser
open index.html
```

### Local Server (Recommended)
```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server

# PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000`

## 🧪 Testing & Quality Assurance

### Manual Testing Checklist
- [x] Player movement in all directions
- [x] All 8 weapon types functional
- [x] Enemy spawning and patterns
- [x] Collision detection accuracy
- [x] Power-up collection
- [x] Lives and game over state
- [x] Score tracking and highscore
- [x] ALG difficulty adjustment
- [x] Particle effects
- [x] Pause functionality
- [x] Game restart

### Browser Compatibility
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ℹ️ Requires modern browser with ES6 support

## 📊 Game Balance Parameters

### Player Stats
- Speed: 4 pixels/frame
- Lives: 3
- Invulnerability: 120 frames (2 seconds)
- Base fire rate: 8 frames between shots

### Enemy Spawn Rates
- Base interval: 60 frames
- Min interval: 20 frames (at high difficulty)
- Formation spawn: Every 300 frames (5 seconds) at difficulty > 1.5

### ALG Parameters
- Min difficulty: 0.5
- Max difficulty: 5.0
- Starting difficulty: 1.0
- Difficulty increase rate: 0.05 per 10 seconds + performance

## 🔮 Future Enhancement Ideas

### Potential Features
- [ ] Boss battles at score milestones
- [ ] Sound effects and background music
- [ ] Additional weapon upgrades (levels per weapon)
- [ ] Special weapons (smart bombs)
- [ ] Touch controls for mobile
- [ ] Online leaderboard
- [ ] Achievements system
- [ ] Stage system with distinct backgrounds
- [ ] Co-op multiplayer
- [ ] Replay system

### Technical Improvements
- [ ] WebGL renderer for better performance
- [ ] Object pooling for bullets/particles
- [ ] Sprite sheets for animations
- [ ] Save/load game state
- [ ] Settings menu (volume, difficulty, controls)

## 🤝 Collaboration Notes

### Human-AI Development Process

This project was developed through collaborative iteration between human developer and AI assistant (Claude). The development approach:

1. **Initial Requirements** - Human specified desire for ZANAC-inspired shooter
2. **Design Discussion** - Key features identified (ALG, weapons, enemies)
3. **Incremental Implementation** - Built component by component
4. **Iterative Refinement** - Adjusted based on testing and feedback

### AI Contributions
- Full game architecture design
- Implementation of all game classes
- ALG system algorithm
- Visual effects and polish
- Comprehensive documentation

### Human Guidance
- Original concept and inspiration
- Design preferences
- Testing and validation
- Repository management

## 📝 Development Log

### 2025-11-08 - Initial Development
- Created project structure
- Implemented core game loop
- Added player class with 8 weapons
- Created 7 enemy types
- Implemented ALG system
- Added particle effects
- Created comprehensive documentation
- Set up Git repository

## 🔐 License & Attribution

### License
This project is open source and available for educational purposes.

### Attribution
- Inspired by ZANAC (1986) by Compile
- Built with p5.js by the Processing Foundation
- Developed collaboratively with Claude AI by Anthropic

## 📞 Contact & Contributing

**Developer:** techs-targe
**Email:** techs.targe@gmail.com
**Repository:** https://github.com/techs-targe/zanac-inspired-shooter

### Contributing
Contributions welcome! Please feel free to:
- Report bugs via GitHub Issues
- Suggest features
- Submit pull requests
- Share gameplay videos
- Post high scores

## 🎓 Learning Resources

For those interested in understanding the code:

### Key Concepts Demonstrated
- **Object-Oriented Programming** - ES6 class structure
- **Game Loop Pattern** - Update/Draw cycle
- **State Machine** - Title/Playing/GameOver/Paused
- **Collision Detection** - Distance-based hit detection
- **Particle Systems** - Dynamic effect generation
- **Adaptive AI** - ALG difficulty system
- **Data Persistence** - LocalStorage API

### Recommended Reading
- p5.js documentation: https://p5js.org/reference/
- Game Programming Patterns: https://gameprogrammingpatterns.com/
- The Art of Game Design: A Book of Lenses by Jesse Schell

## 🏆 Achievements & Milestones

- ✅ Fully functional ALG system
- ✅ Complete weapon variety (8 types)
- ✅ Rich enemy diversity (7 types)
- ✅ Smooth 60 FPS gameplay
- ✅ Professional documentation
- ✅ Ready for GitHub deployment

---

**Last Updated:** 2025-11-08
**Version:** 1.0.0
**Status:** Production Ready 🚀

*This project stands as a tribute to the innovative game design of ZANAC and the timeless appeal of classic shoot-'em-ups.*
