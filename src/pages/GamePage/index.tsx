import { useContext, useState } from 'react';
import 'rpg-awesome/css/rpg-awesome.min.css';
import { OptionText, Spacer, SpacerWithLine, ZoneTitle } from './styled';
import { GameStateType, OptionType, TavernType, ancestriesRecord } from '../../types';
import GameContext from '../../gameWorldState/gameContext';

const GamePage = () => {
  const gameState = useContext(GameContext)?.state;
  const dispatch = useContext(GameContext)?.dispatch;
  const [showResetInput, setShowResetInput] = useState(false);
  if(!gameState) return <div>Loading...</div>;
  const { player, npcs, locations }: GameStateType = gameState;
  const [narrative, setNarrative] = useState(
    'Welcome to the game! Narrative text will be written here.'
    );
  const tavern = locations[0] as TavernType;

  const generateOptions = (state: GameStateType): OptionType[] => {
    // current player options: general (always allowed) + location specific + talk to any npc in the location
    const playerLocation = state.locations.find(loc => loc.id === state.player.currentLocation);
    const npcsInLocation = state.npcs.filter(npc => npc.currentLocation === state.player.currentLocation);
    const locationOptions = playerLocation?.options || [];
    const npcOptions = npcsInLocation.map(npc => ({
      type: 'npc',
      description: `Speak to ${npc.firstName} ${npc.lastName}, a ${ancestriesRecord[npc.ancestry].adj}${' '}
      ${npc.profession}`,
      action: () => speakToNpc()
    }));
    const spacer = {
      type: 'spacer',
      description: '',
    } 
    const askGold = {
      type: 'gold',
      description: 'Ask for 1 gold',
      action: () => updateGold(1)
    }
    const giveGold = {
      type: 'gold',
      description: 'Give away 1 gold',
      action: () => updateGold(-1)
    }
    return [askGold, giveGold, spacer, ...npcOptions, spacer, ...locationOptions];
  }

  const updateGold = (changeAmount: number) => {
    dispatch?.({type: 'UPDATE_GOLD', amount: changeAmount});
    if (narrative === 'Your gold has changed.') {
      setNarrative('Your gold has changed. Again.');
    } else {
      setNarrative('Your gold has changed.');
    }
  };

  const speakToNpc = () => {
    setNarrative("I don't want to talk right now.");
  };

  const saveGame = () => {
    localStorage.setItem('gameState', JSON.stringify(gameState));
    setNarrative("Game saved.")
  }

  const fullyResetGame = () => {
    localStorage.removeItem('gameState');
    window.location.reload();
  }

  return (
    <div style={{ padding: '20px' }}>
      <ZoneTitle>{tavern.name}</ZoneTitle>
      <SpacerWithLine />
      <p>HP: {player.currentHp}</p>
      <p>{player.gold}g</p>
      <SpacerWithLine />
      <i>{narrative}</i>
      <SpacerWithLine />
      {
        generateOptions(gameState).map((option, index) => {
          if(option.type === 'spacer') return <Spacer />
          return (<OptionText onClick={option.action} key={index}>
            {option.description}
          </OptionText>)
        })
      }
      <SpacerWithLine />
      <OptionText onClick={saveGame}><i className="ra ra-save" /> Save to browser</OptionText>
      <SpacerWithLine />
      <OptionText onClick={() => setShowResetInput((previous) => !previous)}><i className="ra ra-bone-bite" /> Restart game with a new world</OptionText>
      {showResetInput && (
        <div>
          <OptionText onClick={fullyResetGame}>Are you sure? This world will be deleted.</OptionText>
        </div>
      )}
    </div>
  );
};

export default GamePage;
