interface ClassNames {
  [key: string]: boolean | undefined | null;
}
export const cn = (names: ClassNames): string =>
  Object.keys(names)
    .filter((name) => names[name])
    .join(" ");

export function interpolate(domain: number[], range: number[], number: number) {
  const clamped = minMax(domain[0], domain[1], number);
  const coef = (clamped - domain[0]) / (domain[1] - domain[0]);
  return range[0] + (range[1] - range[0]) * coef;
}
const minMax = (min: number, max: number, val: number) =>
  Math.max(min, Math.min(max, val));

export { createId } from "./createId";
