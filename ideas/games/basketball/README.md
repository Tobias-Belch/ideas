# 📝 Basketball Game

## Current Thoughts

### Turn-based Matches
- Matches are turn based games, where every player has to perform an action every turn. Turns could be:
  - Moving (with or without the ball)
  - Passing
  - Stealing
  - Blocking
  - Rebounding
  - Shooting
  - ...
- Depending on attributes and skills, the player has a higher chance to succeed
- A high IQ could give players a better intuition of what to do next
  - See passing lanes
  - Estimate other players will react
- A high IQ might also allow to slow down the time for the decision which action to take

## 🚀 Project Genesis & Motivation
The project began as an exploration of combining the MyPlayer mode from NBA2K with the collectible and exploration elements of games like Pokémon. The initial motivation was to create a basketball game that goes beyond traditional sports simulations, focusing on player progression, team building, and world discovery. Early brainstorming led to the decision to avoid creature collection and survival mechanics, instead emphasizing skills, traits, and team assembly. Inspirations include NBA2K, FIFA Manager, and the anime Captain Tsubasa, which influenced the idea of regional backgrounds shaping player abilities.

## 🚀 Project Overview
This is a basketball RPG/simulation game concept that blends MyPlayer-style character progression with team management, world exploration, and a modular, community-driven league system. The goal is to create a game where players build and evolve their own basketball careers and teams, explore diverse regions, and interact with a customizable ecosystem. The intended audience includes basketball fans, sports sim enthusiasts, and modders.

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

## 🧩 Design Decisions & Rationale
- **Hybrid Focus:** Chosen to blend individual player progression with team management and world exploration for a dynamic experience. Alternatives like pure team management or pure player focus were considered but rejected for lack of depth.
- **Minimalist Visuals:** Decided to use icons and avatars for match simulation to reduce asset complexity and development overhead. Full player animations were rejected due to technical and resource constraints.
- **Community Modding:** Enabled users to create and share custom leagues and teams via JSON schemas and import modules, inspired by the desire for a flexible, community-driven ecosystem.
- **State Management:** Zustand was selected as the single source of truth for game state, accessible by both React UI and Phaser.js simulation, for simplicity and scalability.
- **Documentation:** Modular Markdown documentation was adopted to ensure clarity and maintainability.

## ❌ Rejected Ideas & Alternatives
- **Creature Collection & Survival Mechanics:** Dropped early in the concept phase to keep the focus on basketball skills, traits, and team building.
- **Full Player Animations:** Rejected due to asset creation workload and technical feasibility; minimalist visuals chosen instead.
- **Pure Team Management or Player Focus:** Considered but found limiting; hybrid approach selected for richer gameplay.

## 💬 Key Conversation Excerpts
> "So, I don't really want to add creatures and survival to this game, to be honest... I'm thinking of heavily focusing on special skills or traits to help while playing basketball."

> "It reminds me a lot of an anime that I used to watch as a kid, which was called Captain Tsubasa... that aspect of connecting the world and its specific characteristics... influences the kind of players there might be, and the kind of training you might be able to do there."

> "The league should be configurable... I could therefore enable people to do that on their own if they want to and maybe create a community around that."

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

