export interface FormattedFileSize {
  /** Forme affichée : « 130 ko ». */
  short: string;
  /** Forme lue par les lecteurs d'écran, qui prononcent mal « ko » : « 130 kilooctets ». */
  long: string;
}

const UNITS = ["byte", "kilobyte", "megabyte", "gigabyte", "terabyte"] as const;

const roundToOneDecimal = (value: number) => Math.round(value * 10) / 10;

/**
 * Taille d'un fichier dans la plus grande unité qui garde la valeur sous 1 000, en unités SI
 * (1 ko = 1 000 octets) et à une décimale près : la même règle que le Back-Office.
 */
export const formatFileSize = (bytes: number, lang: string): FormattedFileSize => {
  let value = bytes;
  let unit = 0;
  while (unit < UNITS.length - 1 && roundToOneDecimal(value) >= 1000) {
    value /= 1000;
    unit++;
  }

  const format = (unitDisplay: "short" | "long") =>
    new Intl.NumberFormat(lang, {
      style: "unit",
      unit: UNITS[unit],
      unitDisplay,
      maximumFractionDigits: 1,
    }).format(value);

  return { short: format("short"), long: format("long") };
};
