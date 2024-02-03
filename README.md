# Browser RPG

Not much work put into this yet - messing around with the idea of making a single-player largely-random text-based game in the browser. Influences include Dwarf Fortress and Baldur's Gate.

What's done:
- Basic world generation following TypeScript record rules, using a useContext and useReducer to manage the gameState. - The gameState can be saved or deleted from localStorage.
- dynamic actions are created based on the gameStage (eg. if an npc is in the same room as the player, the player can talk to them).
