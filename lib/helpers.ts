import { Weights } from "@/lib/weight";

export function DateToUTCDate(date: Date) {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    )
  );
}

export function GetFormatterForWeight(unit: string) {
  const weightInfo = Weights.find((w) => w.value === unit);

  if (!weightInfo) {
    throw new Error(`Invalid unit: ${unit}`);
  }

  return new Intl.NumberFormat(weightInfo.locale, {
    style: "unit",
    unit: weightInfo.intlUnit,  // Use the valid Intl unit name
    unitDisplay: "short",
  });
}