# 📝 Project Documentation

## � Project Evolution
This project began with the idea to combine NBA2K's MyPlayer mode with Pokémon-style exploration and collection. Early on, the concept included creature collection and survival mechanics, but these were explicitly rejected in favor of focusing on basketball skills, traits, and team building. The conversation evolved through a series of prompts and responses, debating whether the game should be player-focused, team-focused, or a blend. Ultimately, the hybrid approach was chosen, integrating both perspectives. Major pivots included dropping survival/creature mechanics, emphasizing regional backgrounds (inspired by Captain Tsubasa), and designing a modular, community-driven league system. See the full conversation in logs.json and the original chat export for detailed process narrative.

## 🚀 Project Genesis & Motivation
The motivation was to create a basketball game that goes beyond traditional sports simulations, focusing on player progression, team building, and world discovery. Inspirations include NBA2K, FIFA Manager, and Captain Tsubasa, with a strong emphasis on how regional backgrounds shape player abilities and training.

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

## ⚖️ Player vs. Team Focus Debate
Throughout the conversation, there was an open debate about whether the game should be player-focused, team-focused, or a blend. The final decision was to integrate both perspectives, creating a dynamic experience that balances individual progression with team management. This was a key area of uncertainty and a major pivot in the concept.

## 🌏 Personal/Inspirational Details
The concept was heavily inspired by the anime Captain Tsubasa, which emphasized how regional backgrounds influence player abilities and training. The personal connection to this inspiration shaped the idea of world discovery and unique player traits based on their origins.

## 💬 Key Conversation Excerpts
> "Hi, I'm thinking about making a game that combines something like the MyPlayer mode of NBA2K and kind of like a hunting, collectible, collecting, exploration game like Pokemon with each other."
> "So, I don't really want to add creatures and survival to this game, to be honest. ... I'm thinking of heavily focusing on special skills or traits to help while playing basketball."
> "Yeah, I like these ideas. ... it reminds me a lot of an anime that I used to watch as a kid, which was called Captain Tsubasa ... that aspect of connecting the world and its specific characteristics ... influences the kind of players there might be, and the kind of training you might be able to do there."
> "Will be interesting to think about whether these two are separate concepts, or one game, or just two different aspects of the same game, or simply two different games."
> "The league should be configurable ... I could therefore enable people to do that on their own if they want to and maybe create a community around that."

## �️ Architecture & Structure
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

## 📄 Full Conversation Reference
See [logs.json](./logs.json) for the complete conversation and context.
