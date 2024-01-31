import { useState } from "react";
import "rpg-awesome/css/rpg-awesome.min.css";
import { OptionText, Spacer, ZoneTitle } from "./styled";
import { getRandomTavern } from "../../generationFunctions/generateTavern";
import { getRandomNpc } from "../../generationFunctions/generateNpc";

const GamePage = () => {
  const [playerHp, setPlayerHp] = useState(10);
  const [playerGold, setPlayerGold] = useState(5);
  const [tavern, setTavern] = useState(getRandomTavern());
  const [narrative, setNarrative] = useState('Welcome to the game! Narrative text will be written here.')
  const [npcs, setNpcs] = useState([getRandomNpc('bartender'), getRandomNpc(), getRandomNpc()])

  const updateGold = (changeAmount: number) => {
    setPlayerGold(playerGold + changeAmount)
    if(narrative === 'Your gold has changed.') {
      setNarrative('Your gold has changed. Again.')
    } else {
      setNarrative('Your gold has changed.')
    }
  }

  const speakToNpc = (npc) => {
    if(npc.profession.profession === 'Bartender') {
      setNarrative("Hello friend.")
    } else {
      setNarrative(npc.profession.opener)
    }
  }

  return (
    <div style={{padding: '20px'}}>
      <ZoneTitle>{tavern.name}</ZoneTitle>
      <Spacer />
      <p>HP: {playerHp}</p>
      <p>{playerGold}g</p>
      <Spacer />
      <i>{narrative}</i>
      <Spacer />
      <OptionText onClick={() => updateGold(1)}>Ask for 1 gold</OptionText>
      <OptionText onClick={() => updateGold(-1)}>Give away 1 gold</OptionText>
      <OptionText onClick={() => setNarrative(`This tavern is ${tavern.size} sized. It is known for it's ${tavern.feature}.`)}>View your surroundings</OptionText>
      <OptionText onClick={() => setNarrative(`You can't do this yet.`)}>Leave the tavern</OptionText>
      <Spacer />
      {npcs.map((npc) => <OptionText onClick={() => speakToNpc(npc)}><i className="ra ra-player"/>Speak to {npc.firstName} {npc.lastName}, a {npc.ancestry.adj} {npc.profession.profession}</OptionText>)}
    </div>
  )  
}

export default GamePage;