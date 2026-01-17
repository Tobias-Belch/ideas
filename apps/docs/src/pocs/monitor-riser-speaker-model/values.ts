const numberWithUnit =
  <U extends string>(unit: U) =>
  (value: number) => {
    return { value, unit } as { value: number; unit: U };
  };

const inch = numberWithUnit('"');
type Inch = ReturnType<typeof inch>;

export const mm = numberWithUnit(" mm");
export type Milimeters = ReturnType<typeof mm>;

export const cm = numberWithUnit(" cm");
export type Centimeters = ReturnType<typeof cm>;

export type NumberWithUnit = Inch | Milimeters | Centimeters;

export function toMm(value: NumberWithUnit): Milimeters {
  switch (value.unit) {
    case " cm":
      return mm(value.value * 10);
    case '"':
      return mm(value.value * 25.4);
    default:
      return value;
  }
}

export function toCm(value: NumberWithUnit): Centimeters {
  switch (value.unit) {
    case " mm":
      return cm(value.value / 10);
    case '"':
      return cm(value.value * 2.54);
    default:
      return value;
  }
}

export function toInch(value: NumberWithUnit): Inch {
  switch (value.unit) {
    case " mm":
      return inch(value.value / 25.4);
    case " cm":
      return inch(value.value / 2.54);
    default:
      return value;
  }
}

export function formatValueWithUnit(
  value: Centimeters | Milimeters | Inch,
): string {
  return `${value.value}${value.unit}`;
}
