import type { NumberWithUnit } from "../values";

export type Dimensions = Record<
  | "space"
  | "heatingControl"
  | "bestaBottom"
  | "bestaTop"
  | "gapShelfBottom"
  | "gapShelfTop"
  | "nordli",
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
  wallMount: {
    width: NumberWithUnit;
    thickness: NumberWithUnit;
  };
  bottomRail: {
    width: NumberWithUnit;
    thickness: NumberWithUnit;
  };
  valance: {
    thickness: NumberWithUnit;
  };
};
