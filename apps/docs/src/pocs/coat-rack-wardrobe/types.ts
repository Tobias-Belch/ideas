import type { NumberWithUnit } from "../values";

export type Dimensions = Record<
  | "space"
  | "heatingControl"
  | "bestaBottom"
  | "bestaTop"
  | "gapShelfBottom"
  | "gapShelfTop"
  | "nordli"
  | "beam",
  {
    width: NumberWithUnit;
    height: NumberWithUnit;
    depth: NumberWithUnit;
  }
> & {
  benchBoard: {
    width: NumberWithUnit;
    depth: NumberWithUnit;
    thickness: NumberWithUnit;
  };
};
