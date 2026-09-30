export type DieType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20';

export interface RollResult {
  id: string;
  timestamp: number;
  dieType: DieType;
  value: number;
}

export const rollDie = (dieType: DieType): number => {
  const sides = parseInt(dieType.substring(1), 10);
  return Math.floor(Math.random() * sides) + 1;
};

export const rollMultiple = (dieType: DieType, count: number): number[] => {
  const results: number[] = [];
  for (let i = 0; i < count; i++) {
    results.push(rollDie(dieType));
  }
  return results;
};
