import { useContext, useState } from 'react';
import 'rpg-awesome/css/rpg-awesome.min.css';
import { OptionText, Spacer, ZoneTitle } from './styled';
import { GameStateType, TavernType, ancestriesRecord } from '../../types';
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
      <Spacer />
      <p>HP: {player.currentHp}</p>
      <p>{player.gold}g</p>
      <Spacer />
      <i>{narrative}</i>
      <Spacer />
      <OptionText onClick={() => updateGold(1)}>Ask for 1 gold</OptionText>
      <OptionText onClick={() => updateGold(-1)}>Give away 1 gold</OptionText>
      <OptionText
        onClick={() =>
          setNarrative(
            `This tavern is ${tavern.size} sized. It is known for it's ${tavern.feature}.`
          )
        }
      >
        View your surroundings
      </OptionText>
      <OptionText onClick={() => setNarrative(`You can't do this yet.`)}>
        Leave the tavern
      </OptionText>
      <Spacer />
      {npcs.map((npc, i) => (
        <OptionText onClick={() => speakToNpc()} key={i}>
          <i className="ra ra-player" />
          Speak to {npc.firstName} {npc.lastName}, a {ancestriesRecord[npc.ancestry].adj}{' '}
          {npc.profession}
        </OptionText>
      ))}
      <Spacer />
      <OptionText onClick={saveGame}><i className="ra ra-save" /> Save to browser</OptionText>
      <Spacer />
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
