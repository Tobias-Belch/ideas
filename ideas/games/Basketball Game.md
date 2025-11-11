# 📝 Basketball Game

## 🚀 Project Genesis & Motivation
The project began as an exploration of combining the MyPlayer mode from NBA2K with the collectible and exploration elements of games like Pokémon. The initial motivation was to create a basketball game that goes beyond traditional sports simulations, focusing on player progression, team building, and world discovery. Early brainstorming led to the decision to avoid creature collection and survival mechanics, instead emphasizing skills, traits, and team assembly. Inspirations include NBA2K, FIFA Manager, and the anime Captain Tsubasa, which influenced the idea of regional backgrounds shaping player abilities.

## 🚀 Project Overview
This is a basketball RPG/simulation game concept that blends MyPlayer-style character progression with team management, world exploration, and a modular, community-driven league system. The goal is to create a game where players build and evolve their own basketball careers and teams, explore diverse regions, and interact with a customizable ecosystem. The intended audience includes basketball fans, sports sim enthusiasts, and modders.

## 💡 Core Ideas & Features
- **Player Creation & Progression:** Create and customize a basketball player, develop core attributes, skills, and draftable traits, and progress through training, matches, and exploration.
- **Team Management:** Recruit, train, and manage teammates, each with unique skills, traits, backgrounds, and hidden potential revealed via scouting.
- **World Exploration:** Travel to different cities and regions, each offering unique challenges, local talent, facility bonuses, and cultural quest lines.
- **Configurable League System:** Leagues, teams, and players are defined in structured files (e.g., JSON), enabling community-generated content and import of real-world stats.
- **Simulation-Driven Matches:** Matches are visualized with icons/avatars, run automatically, and allow user intervention for special skills and strategic decisions.
- **Turn-Based Action Loop:** Each possession (or time slice) is broken into turns where every on-floor player must choose/execute an action (move, pass, shoot, steal, block, rebound, etc.). Success chances are driven by attributes, skills, situational modifiers (fatigue, matchup), and hidden intelligence (Basketball IQ). High IQ grants: improved passing lane awareness, predictive hints about opponent reactions, occasional "Focus Window" (time-slow / extended decision UI) for clutch or complex plays.
- **Trait / Perk Draft System:** At creation players spend a finite point pool on positive traits (cost points) and may take negative traits (grant more points). Trait pool variants: global universal list, randomized subset per creation, cohort-based shared pool, or progressive unlock via achievements/exploration. Traits are modeled as collectible cards with rarity tiers and synergies (e.g., "Tall Parents" + "High Jumper" amplifies rebounding ceiling). Negative traits (e.g., "Only Walks", "Can't jump over a stack of paper") create build trade-offs and long-term training arcs.
- **Skill Trees & Specializations:** Skills unlocked via prerequisites & stat thresholds; branches enable archetypes (Playmaker, Rim Protector, Sharpshooter, Two-Way Wing). Some nodes require region-specific training or discovery events.
- **Stamina & Substitution:** Every action costs stamina, affecting performance and requiring strategic substitutions, pacing, and trait-based stamina modifiers.
- **AI Scripting (DSL):** Advanced users can define player/team behavior and strategy using a custom scripting language (e.g., priorities: spacing, ball movement, mismatch exploitation).
- **Scouting & Discovery:** Player traits and latent skills are progressively revealed through scouting rolls, match exposure, and synergy events, encouraging investment and narrative.

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
- Unknown Armies (background/identity & trait inspiration)
- Project Zomboid (positive/negative trait point economy)
- Zustand (state management)
- Phaser.js (game engine)
- JSON Schema for modding

## ❓ Open Questions & Next Steps
- How should the skill tree and progression system be visualized and managed?
- What features should the custom scripting language (DSL) support for AI behavior?
- How will community content (leagues, teams) be shared and moderated?
- What are the best practices for balancing player progression and team management?
- Next: Prototype skill tree UI, design JSON schema for leagues, build initial React components, and document further architectural decisions.
- How should the trait / perk pool be generated per new player (global list vs randomized subset vs cohort-shared vs unlock via success/exploration)?
