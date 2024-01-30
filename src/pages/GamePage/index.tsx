import { useState } from "react";
import "rpg-awesome/css/rpg-awesome.min.css";
import { OptionText, Spacer, StatsText, ZoneTitle } from "./styled";

const GamePage = () => {
  const [playerHp, setPlayerHp] = useState(10);
  const [playerGold, setPlayerGold] = useState(5);

  const updateGold = (changeAmount: number) => {
    setPlayerGold(playerGold + changeAmount)
  }

  return (
    <div style={{padding: '20px'}}>
      <ZoneTitle>The Sapphire Gryphon Inn</ZoneTitle>
      <Spacer />
      <StatsText>
        <p>HP: {playerHp}</p>
        <p>{playerGold}g</p>
      </StatsText>
      <Spacer />
      <OptionText onClick={() => updateGold(1)}>Ask for 1 gold</OptionText>
      <OptionText onClick={() => updateGold(-1)}>Give away 1 gold</OptionText>
      <OptionText>View your surroundings</OptionText>
      <Spacer />
      <OptionText><i className="ra ra-player"/>Speak to Rolf Spendel, a Gnome Artificier</OptionText>
      <OptionText><i className="ra ra-player"/>Speak to Ania Intick, an Elven Adventurer</OptionText>
    </div>)
}

export default GamePage;