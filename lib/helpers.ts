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

export function GetFormatterForWeight(weight: string) {
  const locale = Weights.find((c) => c.value === weight)?.locale;

  return new Intl.NumberFormat(locale, {
    style: "weight",
    weight,
  });
}
