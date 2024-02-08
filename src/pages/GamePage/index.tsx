import { useContext, useEffect, useState } from "react";
import "rpg-awesome/css/rpg-awesome.min.css";
import {
  NarrativeLine,
  OptionText,
  Spacer,
  SpacerWithLine,
  ZoneTitle,
} from "./styled";
import {
  GameStateType,
  LocationType,
  OptionType,
  ancestriesRecord,
} from "../../types";
import GameContext from "../../gameWorldState/gameContext";
import { useNavigate } from "react-router-dom";
import { validateGameState } from "../../gameWorldState/validateState";

const GamePage = () => {
  const navigate = useNavigate();
  const gameState = useContext(GameContext)?.state;
  const dispatch = useContext(GameContext)?.dispatch;
  const [showResetInput, setShowResetInput] = useState(false);
  if (!gameState) return <div>Loading...</div>;
  let { player, npcs, narrative, locations }: GameStateType = gameState;
  const tavern = locations[0] as LocationType;
  const [options, setOptions] = useState<OptionType[]>([]);
  const [saveRequest, setSaveRequest] = useState(false);

  const saveGame = () => {
    dispatch?.({ type: "SAVE_OPTIONS_TO_STATE", optionsToAdd: options });
    setSaveRequest(true);
  };

  useEffect(() => {
    if (saveRequest) {
      localStorage.setItem("gameState", JSON.stringify(gameState));
      dispatch?.({
        type: "UPDATE_MAIN_NARRATIVE",
        newNarrative: { text: "Game saved.", colour: "black" },
      });

      setSaveRequest(false);
    }
  }, [saveRequest]);

  useEffect(() => {
    const savedState = localStorage.getItem("gameState")
    if(!savedState) {
      navigate("/");
    }
    if ((JSON.parse(savedState as string) as GameStateType).player.firstName === 'REDIRECT_COMMAND') {
      navigate("/")
    }
    if (!validateGameState(JSON.parse(savedState as string))) {
      navigate("/")
    }
  }, []);

  const fullyResetGame = () => {
    localStorage.removeItem("gameState");
    window.location.reload();
  };

  const updateGold = (changeAmount: number) => {
    dispatch?.({ type: "UPDATE_GOLD", amount: changeAmount });
    console.log(narrative.mainNarrative.text);
    if (narrative.mainNarrative.text === "Your gold has changed.") {
      dispatch?.({
        type: "UPDATE_MAIN_NARRATIVE",
        newNarrative: {
          text: "Your gold has changed. Again.",
          colour: "black",
        },
      });
    } else {
      dispatch?.({
        type: "UPDATE_MAIN_NARRATIVE",
        newNarrative: { text: "Your gold has changed.", colour: "black" },
      });
    }
  };

  const speakToNpc = () => {
    dispatch?.({
      type: "UPDATE_MAIN_NARRATIVE",
      newNarrative: {
        text: "I don't want to talk right now.",
        colour: "black",
      },
    });
  };

  const generateOptions = (): OptionType[] => {
    const playerLocation = locations.find(
      (loc) => loc.id === player.currentLocation
    );
    const locationOptions: OptionType[] = [];
    if (playerLocation?.locationType === "tavern") {
      locationOptions.push({
        type: "location",
        description: "View surroundings",
        action: () =>
          dispatch?.({
            type: "UPDATE_MAIN_NARRATIVE",
            newNarrative: {
              text: `
          This tavern is ${playerLocation.size} sized. It is known for it's ${playerLocation.feature}.
          `,
              colour: "black",
            },
          }),
      });
      locationOptions.push({
        type: "location",
        description: "Leave tavern",
        action: () =>
          dispatch?.({
            type: "UPDATE_MAIN_NARRATIVE",
            newNarrative: { text: "You cannot leave yet.", colour: "black" },
          }),
      });
    }

    const npcsInLocation = npcs.filter(
      (npc) => npc.currentLocation === player.currentLocation
    );
    const npcOptions = npcsInLocation.map((npc) => ({
      type: "npc",
      description: `Speak to ${npc.firstName} ${npc.lastName}, a ${ancestriesRecord[npc.ancestry].adj}${" "}
      ${npc.profession}`,
      action: () => speakToNpc(),
    }));

    const spacer = {
      type: "spacer",
      description: "",
    };
    const askGold = {
      type: "gold",
      description: "Ask for 1 gold",
      action: () => updateGold(1),
    };
    const giveGold = {
      type: "gold",
      description: "Give away 1 gold",
      action: () => updateGold(-1),
    };
    return [
      askGold,
      giveGold,
      spacer,
      ...npcOptions,
      spacer,
      ...locationOptions,
    ];
  };
  // };

  useEffect(() => {
    setOptions(generateOptions());
  }, [narrative, npcs, locations, player]);

  return (
    <div style={{ padding: "20px" }}>
      <ZoneTitle>{tavern.name}</ZoneTitle>
      <SpacerWithLine />
      <p>HP: {player.currentHp}</p>
      <p>{player.gold}g</p>
      <SpacerWithLine />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <NarrativeLine textcolour={narrative.mainNarrative.colour}>
          {narrative.mainNarrative.text}
        </NarrativeLine>
        {narrative.notifications.map((notification, i) => (
          <NarrativeLine key={i} textcolour={notification.colour}>
            {notification.text}
          </NarrativeLine>
        ))}
      </div>
      <SpacerWithLine />
      {options.map((option, i) => {
        if (option.type === "spacer") return <Spacer />;
        return (
          <OptionText onClick={option.action} key={i}>
            {option.description}
          </OptionText>
        );
      })}
      <SpacerWithLine />
      <OptionText onClick={saveGame}>
        <i className="ra ra-save" /> Save to browser
      </OptionText>
      <SpacerWithLine />
      <OptionText onClick={() => setShowResetInput((previous) => !previous)}>
        <i className="ra ra-bone-bite" /> Restart game with a new world
      </OptionText>
      {showResetInput && (
        <div>
          <OptionText onClick={fullyResetGame}>
            Are you sure? This world will be deleted.
          </OptionText>
        </div>
      )}
    </div>
  );
};

export default GamePage;
