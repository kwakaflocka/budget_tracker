export const Weights = [
  { value: "KG", label: "Kilogram", symbol: "kg", locale: "en-US" },
  { value: "G", label: "Gram", symbol: "g", locale: "en-US" },
  { value: "LB", label: "Pound", symbol: "lb", locale: "en-US" },
  { value: "OZ", label: "Ounce", symbol: "oz", locale: "en-US" },
  { value: "TON", label: "Ton", symbol: "t", locale: "en-US" },
  { value: "ST", label: "Stone", symbol: "st", locale: "en-GB" }, // Used primarily in the UK
];

export type Weight = (typeof Weights)[0];
