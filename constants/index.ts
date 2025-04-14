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

export const NAV_LINKS = [
  { href: '/', key: 'about', label: 'Home', frenchLabel: 'À propos', arabicLabel: 'معلومات عنا' },
  { href: '#about', key: 'articles', label: 'About', frenchLabel: 'Domaine', arabicLabel: 'المجال' },
  { href: '#services', key: 'services', label: 'Our Services', frenchLabel: 'Emplacement', arabicLabel: 'الموقع' },
  { href: '#clinics', key: 'contact', label: 'Our Clinics', frenchLabel: 'Contact', arabicLabel: 'اتصل بنا' },
  { href: '#location', key: 'location', label: 'Location', frenchLabel: 'Contact', arabicLabel: 'اتصل بنا' }
];
export const SERVICES = [
  {
    category: "General Dentistry",
    services: [
      "Dental Exams & Checkups",
      "Teeth Cleaning (Prophylaxis)",
      "Tooth-Colored Fillings",
      "Extractions (Simple & Surgical)",
      "Emergency Dentistry"
    ],
    path: "/dental_care.png"
  },
  {
    category: "Preventive Dentistry",
    services: [
      "Oral Cancer Screenings",
      "Night Guards for Bruxism",
      "Sports Mouthguards",
      "Periodontal Maintenance"
    ],
    path: "/tooth.png"
  },
  {
    category: "Cosmetic Dentistry",
    services: [],
    path: ""
  },
  {
    category: "Restorative Dentistry",
    services: [],
    path: ""
  },
  {
    category: "Orthodontics",
    services: [],
    path: ""
  },
  {
    category: "Pediatric Dentistry",
    services: [],
    path: ""
  },
  {
    category: "Periodontics",
    services: [],
    path: ""
  },
  {
    category: "Endodontics",
    services: [],
    path: ""
  },
  {
    category: "Oral Surgery",
    services: [],
    path: ""
  },
  {
    category: "Prosthodontics",
    services: [],
    path: ""
  },
  {
    category: "Sedation Dentistry",
    services: [],
    path: ""
  }
];