import { useContext, useEffect, useState } from "react";
import { OptionText, SpacerWithLine, SubtitleLine, Title } from "./styled";
import { useNavigate } from "react-router-dom";
import GameContext from "../../gameWorldState/gameContext";
import { generateNewGame } from "../../generationFunctions/generateNewGame";
import { validateGameState } from "../../gameWorldState/validateState";

export const Home = () => {
  const navigate = useNavigate();
  const dispatch = useContext(GameContext)?.dispatch;
  const [playerFirstName, setPlayerFirstName] = useState("Tom");
  const [playerLastName, setPlayerLastName] = useState("Karnos");

  const generateWorld = () => {
    const newGame = generateNewGame(playerFirstName, playerLastName);
    dispatch?.({ type: "LOAD_STATE", stateToLoad: newGame });
    localStorage.setItem("gameState", JSON.stringify(newGame));
    navigate("/game");
  };

  useEffect(() => {
    const savedState = localStorage.getItem("gameState");
    if (validateGameState(JSON.parse(savedState as string))) {
      navigate("/game");
    }
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <Title>World Generator</Title>
      <SpacerWithLine />
      <div style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
        <SubtitleLine>Player Character:</SubtitleLine>
        First name:
        <input
          type="text"
          value={playerFirstName}
          onChange={(e) => setPlayerFirstName(e.target.value)}
          style={{
            backgroundColor: "white",
            border: "none",
            color: "black",
            maxWidth: "120px",
          }}
        />
        Last name:
        <input
          type="text"
          value={playerLastName}
          onChange={(e) => setPlayerLastName(e.target.value)}
          style={{
            backgroundColor: "white",
            border: "none",
            color: "black",
            maxWidth: "120px",
          }}
        />
      </div>
      <SpacerWithLine />
      <OptionText onClick={generateWorld}>
        <i className="ra ra-sprout" /> Generate World
      </OptionText>
    </div>
  );
};
