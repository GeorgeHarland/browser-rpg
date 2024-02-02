import { useContext, useState } from 'react';
import 'rpg-awesome/css/rpg-awesome.min.css';
import { OptionText, Spacer, ZoneTitle } from './styled';
import { GameStateType, NpcType, TavernType, ancestriesRecord } from '../../types';
import GameContext from '../../gameWorldState/gameContext';

const GamePage = () => {
  const [gameState] = useContext(GameContext);
  if(!gameState) return;
  const { player, npcs, locations }: GameStateType = gameState;
  const [narrative, setNarrative] = useState(
    'Welcome to the game! Narrative text will be written here.'
    );
  const tavern = locations[0] as TavernType;

  const updateGold = (changeAmount: number) => {
    player.gold = player.gold + changeAmount;
    if (narrative === 'Your gold has changed.') {
      setNarrative('Your gold has changed. Again.');
    } else {
      setNarrative('Your gold has changed.');
    }
  };

  const speakToNpc = (npc: NpcType) => {
    if (npc.profession === 'Bartender') {
      setNarrative('Hello friend.');
    } else {
      setNarrative("I don't want to talk.");
    }
  };

  const saveGame = () => {}

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
      {npcs.map((npc) => (
        <OptionText onClick={() => speakToNpc(npc)}>
          <i className="ra ra-player" />
          Speak to {npc.firstName} {npc.lastName}, a {ancestriesRecord[npc.ancestry].adj}{' '}
          {npc.profession}
        </OptionText>
      ))}
      <Spacer />
      <OptionText onClick={saveGame}><i className="ra ra-save" />Save to browser</OptionText>
    </div>
  );
};

export default GamePage;
