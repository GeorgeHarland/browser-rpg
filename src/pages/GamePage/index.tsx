import { useContext, useEffect, useState } from "react";
import "rpg-awesome/css/rpg-awesome.min.css";
import { NarrativeLine, OptionText, Spacer, SpacerWithLine, SubtitleLine, ZoneTitle } from "./styled";
import { ActivityType, GameStateType, NpcType, OptionType, ancestriesRecord, ItemType, PointOfInterest, PlayerType } from "../../types";
import GameContext from "../../gameWorldState/gameContext";
import { useNavigate } from "react-router-dom";
import { validateGameState } from "../../gameWorldState/validateState";

const GamePage = () => {
  const navigate = useNavigate();
  const gameState = useContext(GameContext)?.state;
  const dispatch = useContext(GameContext)?.dispatch;
  const [showResetInput, setShowResetInput] = useState(false);
  if (!gameState) return <div>Loading...</div>;
  const { player, npcs, narrative, tiles }: GameStateType = gameState;
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
        newNarrative: { text: "Game saved." },
        reset: true,
      });
      setSaveRequest(false);
    }
  }, [saveRequest]);

  useEffect(() => {
    const savedState = localStorage.getItem("gameState");
    if (!savedState) {
      navigate("/");
    }
    if ((JSON.parse(savedState as string) as GameStateType).player.firstName === "REDIRECT_COMMAND") {
      navigate("/");
    }
    if (!validateGameState(JSON.parse(savedState as string))) {
      navigate("/");
    }
  }, []);

  const fullyResetGame = () => {
    localStorage.removeItem("gameState");
    window.location.reload();
  };

  const updateGold = (changeAmount: number, reset: boolean = true) => {
    dispatch?.({ type: "UPDATE_GOLD", amount: changeAmount });
    if (
      narrative.mainNarrative[0].text ===
      `Your gold has changed again. (${changeAmount >= 0 ? "+" + changeAmount : changeAmount})`
    ) {
      dispatch?.({
        type: "UPDATE_MAIN_NARRATIVE",
        newNarrative: {
          text: "Your gold has changed. Again.",
        },
        reset: reset,
      });
    } else {
      dispatch?.({
        type: "UPDATE_MAIN_NARRATIVE",
        newNarrative: {
          text: `Your gold has changed. (${changeAmount >= 0 ? "+" + changeAmount : changeAmount})`,
        },
        reset: reset,
      });
    }
  };

  const updateNpcGold = (npcId: number, changeAmount: number) => {
    dispatch?.({ type: "UPDATE_NPC_GOLD", npcId: npcId, amount: changeAmount });
  };

  const generateOptions = (
    nextActivity: ActivityType = "location",
    npc: NpcType | null = null,
    lootObject: ItemType[] | null = null
  ): OptionType[] => {
    switch (nextActivity) {
      case "dialogue":
        if (npc) return generateNpcOptions(npc);
        if (lootObject) {
          dispatch?.({
            type: "UPDATE_MAIN_NARRATIVE",
            newNarrative: {
              text: `The dusty shelves are nearly empty. There are only ${lootObject.length} books left.`,
            },
            reset: true,
          });
          const options: OptionType[] = [];
          lootObject.map((item) =>
            options.push({
              type: "location",
              description: `Read ${item.name}`,
              action: () =>
                dispatch?.({
                  type: "UPDATE_MAIN_NARRATIVE",
                  newNarrative: { text: item.bookText || "Barely legible." },
                  reset: true,
                }),
            })
          );
          options.push({
            type: "spacer",
            description: "",
          });
          options.push({
            type: "location",
            description: "Go back",
            action: () => leaveArea(),
          });
          return options;
        } else return [];
      case "combat":
        return [];
      case "location":
        return generateLocationOptions();
      case "worldMap":
        return [];
      default:
        return [];
    }
  };

  const generateLocationOptions = (): OptionType[] => {
    const locationOptions: OptionType[] = [];
    let viewSurroundingsString = "Nothing much to see around here."
    if (!(player?.locationId)) {
      const tile = tiles[player.x][player.y]
      viewSurroundingsString = "The forest is peaceful. You can only hear the natural sounds of small animals."
      tile.pointsOfInterest.forEach((locale) => {
        if(locale.playerSeen) {
          locationOptions.push({
            type: "location",
            description: `Go to ${locale.name}`,
            action: () =>
              enterArea(locale)
          });
        }
      })
      locationOptions.push({
        type: "spacer",
        description: "",
      });
      locationOptions.push({
        type: "location",
        description: "Explore",
        action: () =>
          dispatch?.({
            type: "UPDATE_MAIN_NARRATIVE",
            newNarrative: { text: `Nothing let to explore in this ${tile.locationType} area.` },
            reset: true,
          }),
      });
    }
    if (player?.locationId) {
      const locations = tiles[player.x][player.y].pointsOfInterest;
      const locale = locations.find((locale) => locale.id === player.locationId);
      if(locale?.type === 'tavern') {
      if(!locale) return [];
      viewSurroundingsString = `
      This tavern is ${locale.size} sized. It is known for it's ${locale.flavor}.
      `
      locationOptions.push({
        type: "location",
        description: "Check the noticeboard",
        action: () =>
          dispatch?.({
            type: "UPDATE_MAIN_NARRATIVE",
            newNarrative: { text: "Nothing useful." },
            reset: true,
          }),
      });
      if (locale.bookshelf) {
        if (locale.bookshelf.length > 0) {
          locationOptions.push({
            type: "location",
            description: "Browse bookshelf",
            action: () => setOptions(generateOptions("dialogue", null, locale.bookshelf)),
          });
        } else {
          locationOptions.push({
            type: "location",
            description: "Browse bookshelf",
            action: () =>
              dispatch?.({
                type: "UPDATE_MAIN_NARRATIVE",
                newNarrative: { text: "Just a dusty set of shelves." },
                reset: true,
              }),
          });
        }
      }
      locationOptions.push({
        type: "location",
        description: "Leave tavern",
        action: () => leaveTavern(player),
      });
    }
    }

    const npcsInLocation = npcs.filter((npc) => npc.locationId === player.locationId);
    const npcOptions = npcsInLocation.map((npc) => ({
      type: "npc",
      description: `Speak to ${npc.firstName} ${npc.lastName}, a ${ancestriesRecord[npc.ancestry].adj}${" "}
      ${npc.profession}`,
      action: () => setOptions(generateOptions("dialogue", npc)),
    }));

    const spacer = {
      type: "spacer",
      description: "",
    };
    const viewSurroundings: OptionType = {
      type: "location",
      description: "View surroundings",
      action: () =>
        dispatch?.({
          type: "UPDATE_MAIN_NARRATIVE",
          newNarrative: {
            text: viewSurroundingsString,
          },
          reset: true,
        }),
    };
    return [viewSurroundings, spacer, ...npcOptions, spacer, ...locationOptions];
  };

  const generateNpcOptions = (npc: NpcType): OptionType[] => {
    const options: OptionType[] = [];
    dispatch?.({
      type: "UPDATE_SUBTITLE",
      newSubtitle: {
        text: npc.firstName + " " + npc.lastName,
      },
    });
    dispatch?.({
      type: "UPDATE_MAIN_NARRATIVE",
      newNarrative: {
        text: '"' + npc.dialogue.defaultOpener + '"',
      },
      reset: true,
    });
    if (npc.profession === "Gambler") {
      if (npc.gold > 0) {
        options.push({
          type: "npc",
          description: "Play dice game (roll 2d6) - 1 gold to play",
          action: () => playDiceGame(npc),
        });
      }
    }
    options.push({
      type: "npc",
      description: "Leave conversation",
      action: () => leaveConversation(npc),
    });
    return options;
  };

  const leaveArea = () => {
    setOptions(generateOptions("location"));
    dispatch?.({
      type: "UPDATE_MAIN_NARRATIVE",
      newNarrative: {
        text: "You leave the bookshelf.",
      },
      reset: true,
    });
    dispatch?.({
      type: "UPDATE_SUBTITLE",
      newSubtitle: {
        text: "",
      },
    });
  };

  const leaveConversation = (npc: NpcType) => {
    setOptions(generateOptions("location"));
    dispatch?.({
      type: "UPDATE_MAIN_NARRATIVE",
      newNarrative: {
        text: '"' + npc.dialogue.defaultCloser + '"',
      },
      reset: true,
    });
    dispatch?.({
      type: "UPDATE_SUBTITLE",
      newSubtitle: {
        text: "",
      },
    });
  };

  const enterArea = (locale: PointOfInterest) => {
    player.locationId = locale.id;
    player.locationType = locale.type;
    dispatch?.({
      type: "PLAYER_ENTERS_AREA",
      id: locale.id,
      localeType: locale.type,
    })
    dispatch?.({
      type: "UPDATE_MAIN_NARRATIVE",
      newNarrative: { text: `Entered ${locale.name}.` },
      reset: true,
    })
    setOptions(generateOptions('location'));
  }

  const leaveTavern = (player: PlayerType) => {
    player.locationId = null;
    player.locationType = null;
    dispatch?.({
      type: "PLAYER_LEAVES_AREA",
    })
    setOptions(generateOptions('location'));
    dispatch?.({
      type: "UPDATE_MAIN_NARRATIVE",
      newNarrative: { text: `You left the tavern.` },
      reset: true,
    })
  };

  const playDiceGame = (npc: NpcType) => {
    const playerRoll1 = Math.floor(Math.random() * 6) + 1;
    const playerRoll2 = Math.floor(Math.random() * 6) + 1;
    const pTotal = playerRoll1 + playerRoll2;

    dispatch?.({
      type: "UPDATE_MAIN_NARRATIVE",
      newNarrative: {
        text: `You rolled a ${playerRoll1} and a ${playerRoll2}, totaling ${pTotal}.`,
      },
      reset: true,
    });

    const opponentRoll1 = Math.floor(Math.random() * 6) + 1;
    const opponentRoll2 = Math.floor(Math.random() * 6) + 1;
    const oTotal = opponentRoll1 + opponentRoll2;

    dispatch?.({
      type: "UPDATE_MAIN_NARRATIVE",
      newNarrative: {
        text: `${npc.firstName} rolled a ${opponentRoll1} and a ${opponentRoll2}, totaling ${oTotal}.`,
      },
    });

    if (pTotal > oTotal) {
      dispatch?.({
        type: "UPDATE_MAIN_NARRATIVE",
        newNarrative: {
          text: `You win!`,
        },
      });
      updateGold(1, false);
      updateNpcGold(npc.id, -1);
    } else if (oTotal > pTotal) {
      dispatch?.({
        type: "UPDATE_MAIN_NARRATIVE",
        newNarrative: {
          text: `You lose!`,
        },
      });
      updateGold(-1, false);
      updateNpcGold(npc.id, 1);
    } else {
      dispatch?.({
        type: "UPDATE_MAIN_NARRATIVE",
        newNarrative: {
          text: `You both draw!`,
        },
      });
    }
  };

  useEffect(() => {
    setOptions(generateOptions());
  }, []);
  // }, [narrative, npcs, locations, player]);

  let title = 'Unknown Area'
  if(player.x && player.y) {
    const tile = tiles[player.x][player.y];
    const locale = tile.pointsOfInterest.find((locale) => locale.id === player.locationId);
    if(locale) {
      title = locale.name
    } else {
      title = tile.name
    }
  }

  return (
    <div style={{ display: "flex" }}>
      <div style={{ padding: "20px", minWidth: "300px" }}>
        <SubtitleLine textcolour="black" style={{ marginBottom: "2px" }}>
          {player.firstName + " " + player.lastName}
        </SubtitleLine>
        <div style={{ display: "flex", gap: "10px" }}>
          <p style={{ color: "darkred" }}>
            HP: {player.currentHp} / {player.maxHp}
          </p>
          <p style={{ color: "navy" }}>Mana: {player.mana}</p>
        </div>
        <p style={{ color: "brown" }}>{player.gold}g</p>
        <SpacerWithLine />
        {options.map((option, i) => {
          if (option.type === "spacer") return <Spacer key={i} />;
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
        <Spacer />
        <OptionText onClick={() => setShowResetInput((previous) => !previous)}>
          <i className="ra ra-bone-bite" /> Restart game with a new world
        </OptionText>
        {showResetInput && (
          <div>
            <OptionText onClick={fullyResetGame}>Are you sure? This world will be deleted.</OptionText>
          </div>
        )}
        <SpacerWithLine />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          padding: "20px",
          maxWidth: "600px",
          minWidth: "300px",
        }}
      >
        <ZoneTitle>{title}</ZoneTitle>
        <SpacerWithLine />
        {narrative.subtitle && (
          <SubtitleLine textcolour={narrative.subtitle.colour || "black"}>{narrative.subtitle.text}</SubtitleLine>
        )}
        {narrative.mainNarrative.map((mainNarrative, i) => (
          <NarrativeLine key={i} textcolour={mainNarrative.colour || "black"}>
            {mainNarrative.text}
          </NarrativeLine>
        ))}
        {narrative.notifications.map((notifications, i) => (
          <NarrativeLine key={i} textcolour={notifications.colour || "black"}>
            {notifications.text}
          </NarrativeLine>
        ))}
      </div>
    </div>
  );
};

export default GamePage;
