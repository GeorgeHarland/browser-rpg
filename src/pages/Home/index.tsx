import { useContext, useEffect } from "react";
import { OptionText, SpacerWithLine, Title } from "./styled";
import { useNavigate } from "react-router-dom";
import GameContext from "../../gameWorldState/gameContext";
import { generateNewGame } from "../../generationFunctions/generateNewGame";
import { validateGameState } from "../../gameWorldState/validateState";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useContext(GameContext)?.dispatch;

  const generateWorld = () => {
    const newGame = generateNewGame();
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
      <OptionText onClick={generateWorld}>
        <i className="ra ra-sprout" /> Generate World
      </OptionText>
    </div>
  );
};

export default Home;
