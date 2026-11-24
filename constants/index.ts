// toothData.ts
export const TOOTHMAP = {
  "11": "Top Left Central Incisor",
  "12": "Top Left Lateral Incisor",
  "13": "Top Left Canine (Cuspid)",
  "14": "Top Left First Premolar",
  "15": "Top Left Second Premolar",
  "16": "Top Left First Molar",
  "17": "Top Left Second Molar",
  "18": "Top Left Third Molar (Wisdom)",

  "21": "Top Right Central Incisor",
  "22": "Top Right Lateral Incisor",
  "23": "Top Right Canine (Cuspid)",
  "24": "Top Right First Premolar",
  "25": "Top Right Second Premolar",
  "26": "Top Right First Molar",
  "27": "Top Right Second Molar",
  "28": "Top Right Third Molar (Wisdom)",

  "31": "Bottom Right Central Incisor",
  "32": "Bottom Right Lateral Incisor",
  "33": "Bottom Right Canine (Cuspid)",
  "34": "Bottom Right First Premolar",
  "35": "Bottom Right Second Premolar",
  "36": "Bottom Right First Molar",
  "37": "Bottom Right Second Molar",
  "38": "Bottom Right Third Molar (Wisdom)",

  "41": "Bottom Left Central Incisor",
  "42": "Bottom Left Lateral Incisor",
  "43": "Bottom Left Canine (Cuspid)",
  "44": "Bottom Left First Premolar",
  "45": "Bottom Left Second Premolar",
  "46": "Bottom Left First Molar",
  "47": "Bottom Left Second Molar",
  "48": "Bottom Left Third Molar (Wisdom)",
};

export * from "./site";

/** Reverse lookup: canonical tooth name (what we store) to its chart id. */
export const NAME_TO_ID: Record<string, string> = Object.fromEntries(Object.entries(TOOTHMAP).map(([id, name]) => [name, id]));
