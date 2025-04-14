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

  "21": "Top right Central Incisor",
  "22": "Top right Lateral Incisor",
  "23": "Top right Canine (Cuspid)",
  "24": "Top right First Premolar",
  "25": "Top right Second Premolar",
  "26": "Top right First Molar",
  "27": "Top right Second Molar",
  "28": "Top right Third Molar (Wisdom)",

  "31": "Botoom Left Central Incisor",
  "32": "Botoom Left Lateral Incisor",
  "33": "Botoom Left Canine (Cuspid)",
  "34": "Botoom Left First Premolar",
  "35": "Botoom Left Second Premolar",
  "36": "Botoom Left First Molar",
  "37": "Botoom Left Second Molar",
  "38": "Botoom Left Third Molar (Wisdom)",

  "41": "Central Incisor",
  "42": "Lateral Incisor",
  "43": "Canine (Cuspid)",
  "44": "First Premolar",
  "45": "Second Premolar",
  "46": "First Molar",
  "47": "Second Molar",
  "48": "Third Molar (Wisdom)",
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