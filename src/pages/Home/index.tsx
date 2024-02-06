import { useEffect } from "react";
import { OptionText, SpacerWithLine, Title } from "./styled";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("gameState")) {
      navigate("/game");
    }
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <Title>World Generator</Title>
      <SpacerWithLine />
      <OptionText onClick={() => navigate("/game")}>
        <i className="ra ra-sprout" /> Generate World
      </OptionText>
    </div>
  );
};

export default Home;
