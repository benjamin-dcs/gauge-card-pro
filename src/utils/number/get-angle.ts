import { getValueInPercentage, normalize } from "../../ha/util/calculate";

export const getAngle = (value: number, min: number, max: number) => {
  const percentage = getValueInPercentage(normalize(value, min, max), min, max);
  return (percentage * 180) / 100;
};
