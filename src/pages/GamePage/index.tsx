import { useCallback, useContext, useEffect, useState } from 'react';
import 'rpg-awesome/css/rpg-awesome.min.css';
import { NarrativeLine, OptionText, Spacer, SpacerWithLine, ZoneTitle } from './styled';
import { GameStateType, OptionType, TavernType, ancestriesRecord } from '../../types';
import GameContext from '../../gameWorldState/gameContext';

const GamePage = () => {
  const gameState = useContext(GameContext)?.state;
  const dispatch = useContext(GameContext)?.dispatch;
  const [showResetInput, setShowResetInput] = useState(false);
  if(!gameState) return <div>Loading...</div>;
  let { player, npcs, narrative, locations }: GameStateType = gameState;
  const tavern = locations[0] as TavernType;
  const [options, setOptions] = useState<OptionType[]>([]);

  const saveGame = () => {
    localStorage.setItem('gameState', JSON.stringify(gameState));
    dispatch?.({type: 'UPDATE_MAIN_NARRATIVE', newNarrative: {text: "Game saved.", colour: 'black'}});
  }

  const fullyResetGame = () => {
    localStorage.removeItem('gameState');
    window.location.reload();
  }

  const updateGold = useCallback((changeAmount: number) => {
    dispatch?.({type: 'UPDATE_GOLD', amount: changeAmount});
    console.log(narrative.mainNarrative.text)
    if (narrative.mainNarrative.text === 'Your gold has changed.') {
      dispatch?.({type: 'UPDATE_MAIN_NARRATIVE', newNarrative: {text: 'Your gold has changed. Again.', colour: 'black'}});
    } else {
      dispatch?.({type: 'UPDATE_MAIN_NARRATIVE', newNarrative: {text: 'Your gold has changed.', colour: 'black'}});
    }
  }, [narrative, dispatch]);

  const speakToNpc = () => {
      dispatch?.({type: 'UPDATE_MAIN_NARRATIVE', newNarrative: {text: "I don't want to talk right now.", colour: 'black'}});
  };

  const generateOptions = (): OptionType[] => {
    // current player options: general (always allowed) + location specific + talk to any npc in the location
    const playerLocation = locations.find(loc => loc.id === player.currentLocation);
    const npcsInLocation = npcs.filter(npc => npc.currentLocation === player.currentLocation);
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

  useEffect(() => {
    setOptions(generateOptions());
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <ZoneTitle>{tavern.name}</ZoneTitle>
      <SpacerWithLine />
      <p>HP: {player.currentHp}</p>
      <p>{player.gold}g</p>
      <SpacerWithLine />
      <div style={{'display': 'flex', 'flexDirection': 'column'}}>
        <NarrativeLine textcolour={narrative.mainNarrative.colour}>{narrative.mainNarrative.text}</NarrativeLine>
        {narrative.notifications.map((notification, i) => (
          <NarrativeLine key={i} textcolour={notification.colour}>{notification.text}</NarrativeLine>
        ))}
      </div>
      <SpacerWithLine />
      {
        options.map((option, i) => {
          if(option.type === 'spacer') return <Spacer />
          return (<OptionText onClick={option.action} key={i}>
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
