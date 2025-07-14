# 📝 Project Documentation

## 🚀 Project Overview
This project is a basketball RPG/simulation game concept that blends MyPlayer-style character progression with team management, world exploration, and a modular, community-driven league system. The goal is to create a game where players build and evolve their own basketball careers and teams, explore diverse regions, and interact with a customizable ecosystem. The intended audience includes basketball fans, sports sim enthusiasts, and modders.

## 💡 Core Ideas & Features
- **Player Creation & Progression:** Create and customize a basketball player, develop skills and traits, and progress through training, matches, and exploration.
- **Team Management:** Recruit, train, and manage teammates, each with unique skills, traits, and backgrounds.
- **World Exploration:** Travel to different cities and regions, each offering unique challenges, local talent, and cultural quests.
- **Configurable League System:** Leagues, teams, and players are defined in structured files (e.g., JSON), enabling community-generated content and import of real-world stats.
- **Simulation-Driven Matches:** Matches are visualized with icons/avatars, run automatically, and allow user intervention for special skills and strategic decisions.
- **Skill Trees & Specializations:** Skills are unlocked via prerequisites, allowing for RPG-like specialization and unique player builds. Skill acquisition may involve training sessions, exploration, or meeting stat thresholds.
- **Stamina & Substitution:** Every action costs stamina, affecting performance and requiring strategic substitutions and pacing.
- **AI Scripting (DSL):** Advanced users can define player/team behavior and strategy using a custom scripting language.
- **Scouting & Discovery:** Player traits and skills are revealed progressively through scouting and gameplay, encouraging exploration and investment.

## 🧩 Design Decisions
- **Hybrid Focus:** Blend individual player progression with team management and world exploration for a dynamic experience.
- **Minimalist Visuals:** Use icons and avatars for match simulation to reduce asset complexity and development overhead.
- **Community Modding:** Enable users to create and share custom leagues and teams via JSON schemas and import modules.
- **State Management:** Use Zustand as the single source of truth for game state, accessible by both React UI and Phaser.js simulation.
- **Documentation:** Adopt modular Markdown documentation for concept, architecture, and decisions.

## 🏗️ Architecture & Structure
- **Frontend:** Built with React for UI components and dashboards.
- **Game Simulation:** Phaser.js (optional) for match logic and visualizations.
- **State Management:** Zustand for global state, shared between UI and simulation.
- **Data Storage:** JSON files for leagues, teams, and player data; local storage or IndexedDB for user progress.
- **Community Features:** Tools for importing/exporting league data and sharing with others.

### Example Architecture Diagram
```
[React UI] <-> [Zustand Store] <-> [Phaser.js Simulation]
           ^                ^
           |                |
    [JSON League Data]   [Local Storage]
```

## 💻 Code Snippets & Examples
### Zustand Store Example
```typescript
import create from 'zustand';

export const useGameStore = create((set, get) => ({
  stamina: 100,
  cooldown: 0,
  isSkillReady: true,
  reduceStamina: (amount) => set({ stamina: Math.max(0, get().stamina - amount) }),
  triggerSkill: () => {
    if (get().isSkillReady && get().stamina >= 20) {
      set({ cooldown: 5, isSkillReady: false });
      get().reduceStamina(20);
    }
  },
  tickCooldown: () => {
    const { cooldown } = get();
    if (cooldown > 1) set({ cooldown: cooldown - 1 });
    else set({ cooldown: 0, isSkillReady: true });
  },
  resetCooldown: () => set({ cooldown: 0, isSkillReady: true }),
}));
```

### League JSON Schema Example
```json
{
  "team_name": "Example Team",
  "logo": "logo.png",
  "arena": "Example Arena",
  "players": [
    { "name": "Player 1", "skills": ["3PT Shooter", "Defender"] },
    { "name": "Player 2", "skills": ["Passer"] }
  ]
}
```

## 📚 References & Inspirations
- NBA2K MyPlayer mode
- FIFA Manager series
- Captain Tsubasa anime
- Zustand (state management)
- Phaser.js (game engine)
- JSON Schema for modding

## ❓ Open Questions & Next Steps
- How should the skill tree and progression system be visualized and managed?
- What features should the custom scripting language (DSL) support for AI behavior?
- How will community content (leagues, teams) be shared and moderated?
- What are the best practices for balancing player progression and team management?
- Next: Prototype skill tree UI, design JSON schema for leagues, build initial React components, and document further architectural decisions.
