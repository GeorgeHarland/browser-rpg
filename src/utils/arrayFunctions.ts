export const getRandomKey = <T extends object>(obj: T): keyof T => {
  const keys = Object.keys(obj) as Array<keyof T>;
  return getRandomElement(keys);
};

export const getRandomElement = <T>(array: T[]): T => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};
