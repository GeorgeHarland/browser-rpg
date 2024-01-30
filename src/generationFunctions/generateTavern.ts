const tavernNameAdjectives = [
  'Crimson', 'Emerald', 'Sapphire', 'Topaz', 'Golden'
]

const tavernNameNouns = [
  'Gryphon', 'Dragon', 'Zombie', 'Hedgehog', 'Gnome'
]

const tavernSizes = [
  'Small', 'Medium', 'Large', 'Huge'
]

export const getRandomTavern = () => {
  const randomAdjective = tavernNameAdjectives[Math.floor(Math.random() * tavernNameAdjectives.length)];
  const randomNoun = tavernNameNouns[Math.floor(Math.random() * tavernNameNouns.length)];
  const randomName = `The ${randomAdjective} ${randomNoun}`

  const randomSize = tavernSizes[Math.floor(Math.random() * tavernSizes.length)]
  let roomAmount = 0;
  switch(randomSize) {
    case('small'):
      roomAmount = Math.floor(Math.random() * 3) + 3; // 3-5
      break;
    case('medium'):
      roomAmount = Math.floor(Math.random() * 4) + 5; // 5-8
      break;
    case('large'):
      roomAmount = Math.floor(Math.random() * 4) + 7; // 7-10
      break;
    case('huge'):
      roomAmount = Math.floor(Math.random() * 6) + 11; // 11-16
      break;
    default:
      roomAmount = 10;
  }

  return {
    name: randomName,
    size: randomSize,
    rooms: roomAmount,
  }
}