const firstNames = [
  'Rolf', 'Ilia', 'Semand', 'Pila', 'Grum', 'Alison'
]

const secondNames = [
  'Elnak', 'Cravenwood', 'Helmrock', 'Altan', 'Fearsprig', 'Underhill'
]

const professions = [
  'Gnomish Artificier', 'Wounded Elf', 'Mysterious Hooded Stranger', 'Wizened Old Man'
]

export const getRandomNpc = () => {
  const randomFirst = firstNames[Math.floor(Math.random() * firstNames.length)];
  const randomSecond = secondNames[Math.floor(Math.random() * secondNames.length)];
  const randomProfession = professions[Math.floor(Math.random() * professions.length)];

  return {
    firstName: randomFirst,
    lastName: randomSecond,
    profession: randomProfession
  }
}