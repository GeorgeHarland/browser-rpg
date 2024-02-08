import { useContext, useEffect, useState } from "react";
import { OptionText, SpacerWithLine, Title } from "./styled";
import { useNavigate } from "react-router-dom";
import GameContext from "../../gameWorldState/gameContext";
import { generateNewGame } from "../../generationFunctions/generateNewGame";
import { validateGameState } from "../../gameWorldState/validateState";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useContext(GameContext)?.dispatch;
  const [playerFirstName, setPlayerFirstName] = useState("Tom");
  const [playerLastName, setPlayerLastName] = useState("Karnos");

  const generateWorld = () => {
    const newGame = generateNewGame(playerFirstName, playerLastName);
    dispatch?.({ type: "LOAD_STATE", stateToLoad: newGame });
    localStorage.setItem("gameState", JSON.stringify(newGame));
    navigate("/game");
  }

  useEffect(() => {
    const savedState = localStorage.getItem("gameState")
    if (validateGameState(JSON.parse(savedState as string))) {
      navigate("/game")
    }
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <Title>World Generator</Title>
      <SpacerWithLine />
      <div>
        <input
          type="text"
          placeholder="Enter your first name"
          value={playerFirstName}
          onChange={(e) => setPlayerFirstName(e.target.value)}
        />
        <br />
        <input
          type="text"
          placeholder="Enter your last name"
          value={playerLastName}
          onChange={(e) => setPlayerLastName(e.target.value)}
        />
      </div>
      <SpacerWithLine />
      <OptionText onClick={generateWorld}>
        <i className="ra ra-sprout" /> Generate World
      </OptionText>
    </div>
  );
};

export default Home;
