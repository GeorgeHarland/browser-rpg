import { useContext, useEffect, useState } from "react";
import "rpg-awesome/css/rpg-awesome.min.css";
import { NarrativeLine, OptionText, Spacer, SpacerWithLine, SubtitleLine, ZoneTitle } from "./styled";
import {
  ActivityType,
  GameStateType,
  NpcType,
  OptionType,
  ancestriesRecord,
  PointOfInterest,
  PlayerType,
  ItemType,
  CurrentMonster,
} from "../../types";
import GameContext from "../../gameWorldState/gameContext";
import { useNavigate } from "react-router-dom";
import { validateGameState } from "../../gameWorldState/validateState";
import { books } from "../../data/books";
import { potions } from "../../data/potions";
import { rollForestEncounter } from "../../randomTables/explorationTables";
import { monsters } from "../../data/monsters";

export const GamePage = () => {
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

  const buyItem = (item: ItemType, npc: NpcType) => {
    dispatch?.({ type: "BUY_ITEM", itemId: item.id, npcId: npc.id, cost: item.basePrice });
    setTimeout(() => setOptions(generateOptions("dialogue", npc, null, null, true)), 5);
  };

  const exploreForest = (): void => {
    const encounter = rollForestEncounter();
    dispatch?.({
      type: "UPDATE_SUBTITLE",
      newSubtitle: { text: encounter.name },
    });
    const options: OptionType[] = [];
    switch (encounter.name) {
      case "Suspicious Mushrooms":
        dispatch?.({
          type: "UPDATE_MAIN_NARRATIVE",
          newNarrative: { text: `You found some mushrooms. They look suspicious.` },
          reset: true,
        });
        options.push({
          type: "dialogue",
          description: "Eat the mushrooms",
          action: () => {
            dispatch?.({
              type: "UPDATE_MAIN_NARRATIVE",
              newNarrative: { text: `You eat the mushrooms. They taste terrible (-2 hp).` },
              reset: true,
            });
            dispatch?.({ type: "UPDATE_PLAYER_HP", amount: -2 });
            setOptions(generateOptions("location"));
          },
        });
        options.push({
          type: "dialogue",
          description: "Leave the mushrooms alone",
          action: () => {
            dispatch?.({
              type: "UPDATE_MAIN_NARRATIVE",
              newNarrative: { text: `You left the mushrooms alone. Wise choice.` },
              reset: true,
            });
            setOptions(generateOptions("location"));
          },
        });
        setOptions(options);
        break;
      case "Goblin":
        dispatch?.({
          type: "UPDATE_MAIN_NARRATIVE",
          newNarrative: { text: `A goblin jumps out of the bushes!` },
          reset: true,
        });
        setOptions(generateOptions("combat", null, 100001));
        break;
      case "Giant Spider":
        dispatch?.({
          type: "UPDATE_MAIN_NARRATIVE",
          newNarrative: { text: `A giant spider drops down from the trees!` },
          reset: true,
        });
        setOptions(generateOptions("combat", null, 100002));
        break;
      default:
        dispatch?.({
          type: "UPDATE_MAIN_NARRATIVE",
          newNarrative: { text: `You trek the forest but find nothing of interest.` },
          reset: true,
        });
        options.push({
          type: "dialogue",
          description: "Leave",
          action: () => {
            dispatch?.({
              type: "UPDATE_MAIN_NARRATIVE",
              newNarrative: { text: `You returned to a familiar area.` },
              reset: true,
            });
            setOptions(generateOptions("location"));
          },
        });
        setOptions(options);
        break;
    }
    // setTimeout(() => setOptions(generateOptions("explore")), 5);
  };

  const generateOptions = (
    nextActivity: ActivityType = "location",
    npc: NpcType | null = null,
    monsterId: number | null = null,
    lootObject: string[] | null = null,
    keepNarrative: boolean = false
  ): OptionType[] => {
    if (player.currentHp <= 0) {
      dispatch?.({
        type: "UPDATE_MAIN_NARRATIVE",
        newNarrative: { text: `GAME OVER` },
        reset: true,
      });
      return [
        {
          type: "location",
          description: "Restart game",
          action: () => fullyResetGame(),
        },
      ];
    }

    const options: OptionType[] = [];

    switch (nextActivity) {
      case "dialogue":
        if (npc) return generateNpcOptions(npc, keepNarrative);
        if (lootObject) {
          dispatch?.({
            type: "UPDATE_MAIN_NARRATIVE",
            newNarrative: {
              text: `The dusty shelves are nearly empty. There are only ${lootObject.length} books left.`,
            },
            reset: true,
          });
          lootObject.map((itemId) => {
            const item = books[itemId];
            options.push({
              type: "location",
              description: `Read ${item.name}`,
              action: () =>
                dispatch?.({
                  type: "UPDATE_MAIN_NARRATIVE",
                  newNarrative: { text: item.bookText || "Barely legible." },
                  reset: true,
                }),
            });
          });
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
        if (!monsterId) {
          return generateLocationOptions();
        }

        let currentMonster: CurrentMonster;

        const gameState = useContext(GameContext)?.state;

        if (!gameState?.temp?.currentMonster) {
          const monsterHp =
            monsters[monsterId].minHp +
            Math.floor(Math.random() * (monsters[monsterId].maxHp - monsters[monsterId].minHp + 1));

          currentMonster = {
            monsterId: monsterId,
            currentHp: monsterHp,
            name: monsters[monsterId].name,
            description: monsters[monsterId].description,
            maxHp: monsterHp,
            attack: monsters[monsterId].baseAtk,
            exp: monsters[monsterId].baseExp,
            gold: monsters[monsterId].baseGold,
            lootTables: monsters[monsterId].lootTables,
          };
        } else {
          currentMonster = gameState.temp.currentMonster;
        }

        dispatch?.({
          type: "SET_CURRENT_MONSTER",
          monster: currentMonster,
        });

        dispatch?.({
          type: "UPDATE_MAIN_NARRATIVE",
          newNarrative: { text: `A ${currentMonster.name} is in front of you!` },
        });

        options.push({
          type: "combat",
          description: "Attack",
          action: () => attackMonster(currentMonster),
        });
        options.push({
          type: "combat",
          description: "Flee",
          action: () => fleeFromMonster(currentMonster),
        });

        return options;
      case "location":
        return generateLocationOptions();
      case "explore":
        return [];
      default:
        return generateLocationOptions();
    }
  };

  const generateLocationOptions = (): OptionType[] => {
    const locationOptions: OptionType[] = [];
    let viewSurroundingsString = "Nothing much to see around here.";
    if (!player?.locationId) {
      const tile = tiles[player.x][player.y];
      viewSurroundingsString =
        "The forest is quiet and peaceful. You can hear the sounds of small animals and a nearby stream.";
      locationOptions.push({
        type: "location",
        description: "Explore",
        action: () => exploreForest(),
      });
      locationOptions.push({
        type: "spacer",
        description: "",
      });
      tile.pointsOfInterest.forEach((locale) => {
        if (locale.playerSeen) {
          locationOptions.push({
            type: "location",
            description: `Go to ${locale.name}`,
            action: () => enterArea(locale),
          });
        }
      });
    }
    if (player?.locationId) {
      const locations = tiles[player.x][player.y].pointsOfInterest;
      const locale = locations.find((locale) => locale.id === player.locationId);
      if (locale?.type === "tavern") {
        if (!locale) return [];
        viewSurroundingsString = `
      ${locale.name} is a ${locale.size} sized ${locale.type} and has ${locale.rooms} total rooms. It is known for it's ${locale.flavor}. ${locale.bookshelf ? " There is a bookshelf in the corner. " : ""}Outside the window you can see the surrounding area is ${locale.tileTerrainType}.`;
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
              action: () => setOptions(generateOptions("dialogue", null, null, locale.bookshelf)),
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

  const generateNpcOptions = (npc: NpcType, keepNarrative: boolean = false): OptionType[] => {
    const options: OptionType[] = [];
    dispatch?.({
      type: "UPDATE_SUBTITLE",
      newSubtitle: {
        text: npc.firstName + " " + npc.lastName,
      },
    });
    if (!keepNarrative) {
      dispatch?.({
        type: "UPDATE_MAIN_NARRATIVE",
        newNarrative: {
          text: '"' + npc.dialogue.defaultOpener + '"',
        },
        reset: true,
      });
    }
    switch (npc.profession) {
      case "Gambler":
        options.push({
          type: "npc",
          description: "Play dice game (roll 2d6) - 1 gold to play",
          action: () => playDiceGame(npc),
        });
        break;
      case "Herbalist":
        // sells any potions in their inventory
        npc.inventory.forEach((itemId) => {
          const item = potions[itemId];
          options.push({
            type: "npc",
            description: `Buy ${item.name} - ${item.basePrice} gold`,
            action: () => buyItem(item, npc),
          });
        });
        break;
      default:
        break;
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
    });
    dispatch?.({
      type: "UPDATE_MAIN_NARRATIVE",
      newNarrative: { text: `Entered ${locale.name}.` },
      reset: true,
    });
    setOptions(generateOptions("location"));
  };

  const leaveTavern = (player: PlayerType) => {
    player.locationId = null;
    player.locationType = null;
    dispatch?.({
      type: "PLAYER_LEAVES_AREA",
    });
    setOptions(generateOptions("location"));
    dispatch?.({
      type: "UPDATE_MAIN_NARRATIVE",
      newNarrative: { text: `You left the tavern.` },
      reset: true,
    });
  };

  const playDiceGame = (npc: NpcType) => {
    dispatch?.({ type: "PLAY_DICE_GAME", npc: npc });
    setTimeout(() => setOptions(generateOptions("dialogue", npc, null, null, true)), 5);
  };

  const attackMonster = (monster: CurrentMonster) => {
    const playerDamage = 2;
    const monsterDamage = monster.attack;

    dispatch?.({
      type: "COMBAT_TRADE_BLOWS",
      playerDamage: playerDamage,
      monsterDamage: monsterDamage,
    });

    dispatch?.({
      type: "UPDATE_MAIN_NARRATIVE",
      newNarrative: { text: `You hit the ${monster.name} for ${playerDamage} damage!` },
      reset: true,
    });
    dispatch?.({
      type: "UPDATE_MAIN_NARRATIVE",
      newNarrative: { text: `The ${monster.name} hits you for ${monsterDamage} damage!` },
    });

    setOptions(generateOptions("combat", null, monster.monsterId));
  };

  const fleeFromMonster = (monster: CurrentMonster) => {
    const fleeSuccess = Math.random() < 0.5;
    if (fleeSuccess) {
      dispatch?.({
        type: "UPDATE_MAIN_NARRATIVE",
        newNarrative: { text: `You managed to escape the ${monster.name}!` },
        reset: true,
      });
      setOptions(generateOptions("location"));
    } else {
      const damage = monster.attack;
      dispatch?.({
        type: "MONSTER_ATTACK_PLAYER",
        damage,
      });
      dispatch?.({
        type: "UPDATE_MAIN_NARRATIVE",
        newNarrative: { text: `You failed to flee and took ${damage} damage from the ${monster.name}!` },
        reset: true,
      });
      setOptions(generateOptions("combat", null, monster.monsterId));
    }
  };

  useEffect(() => {
    setOptions(generateOptions());
  }, []);
  // }, [narrative, npcs, locations, player]);

  let title = "Unknown Area";
  if (player.x && player.y) {
    const tile = tiles[player.x][player.y];
    const locale = tile.pointsOfInterest.find((locale) => locale.id === player.locationId);
    if (locale) {
      title = locale.name;
    } else {
      title = tile.name;
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
