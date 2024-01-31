const firstNames = [
  'Rolf', 'Ilia', 'Semand', 'Pila', 'Grum', 'Alison', 'Elian', 'Ulfrid', 'Weslin'
]

const secondNames = [
  'Elnak', 'Cravenwood', 'Helmrock', 'Altan', 'Fearsprig', 'Underhill', 'Elkland', 'Humbletree', 'Espelian'
]

type AncestryType = {
  ancestry: string;
  adj: string;
}

const ancestries: Record<string, AncestryType> = {
  human: {
    ancestry: 'Human',
    adj: 'Human'
  },
  elf: {
    ancestry: 'Elf',
    adj: 'Elven'
  },
  dwarf: {
    ancestry: 'Dwarf',
    adj: 'Dwarvish'
  },
  gnome: {
    ancestry: 'Gnome',
    adj: 'Gnomish'
  },
  mysterious: {
    ancestry: 'Unknown',
    adj: 'Unknown'
  }
}

type ProfessionType = {
  profession: string
  opener: string
}

const professions: Record<string, ProfessionType> = {
  bard: {
    profession: 'Bard',
    opener: "Ho there why the long face? A song'll cheer you up."
  },
  bartender: {
    profession: 'Bartender',
    opener: "Hello there."
  },
  carpenter: {
    profession: 'Carpenter',
    opener: "What?..."
  },
  drunkard: {
    profession: 'Drunkard',
    opener: "Bugger off... hic..."
  },
  tailor: {
    profession: 'Tailor',
    opener: "Let me drink in peace..."
  }
}
//   'Artificer', 'Hunter', 'Blacksmith', 'Ruffian',
//   'Herbalist', 'Scoundrel', 'Gambler', 'Beggar',
//   'Deserter', 'Off-Duty Guard'
// ]

export const getRandomNpc = (profession: string | null = null) => {
  const randomFirst = firstNames[Math.floor(Math.random() * firstNames.length)];
  const randomSecond = secondNames[Math.floor(Math.random() * secondNames.length)];

  let professionObj;
  if(profession) {
    professionObj = professions[profession];
  } else {
    const profKeys = Object.keys(professions);
    professionObj = professions[profKeys[Math.floor(Math.random() * profKeys.length)]];
  }

  const ansKeys = Object.keys(ancestries);
  const randomAncestry = ancestries[ansKeys[Math.floor(Math.random() * ansKeys.length)]];

  return {
    firstName: randomFirst,
    lastName: randomSecond,
    profession: professionObj,
    ancestry: randomAncestry
  }
}