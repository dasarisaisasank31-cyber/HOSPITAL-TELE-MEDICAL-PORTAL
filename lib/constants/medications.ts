export type BasicMedication = {
  id: string;
  name: string;
  category: string;
  defaultDosage: string;
  defaultFrequency: string;
  defaultDuration: string;
  instructions: string;
};

export const BASIC_MEDICATIONS: BasicMedication[] = [
  // Pain / Fever
  {
    id: "med-1",
    name: "Paracetamol 500mg",
    category: "Pain & Fever",
    defaultDosage: "1 Tablet",
    defaultFrequency: "SOS (When required) or up to 3 times a day",
    defaultDuration: "3 Days",
    instructions: "Take after meals.",
  },
  {
    id: "med-2",
    name: "Ibuprofen 400mg",
    category: "Pain & Fever",
    defaultDosage: "1 Tablet",
    defaultFrequency: "Twice a day",
    defaultDuration: "3 Days",
    instructions: "Take after meals.",
  },
  // Acidity / Gastric
  {
    id: "med-3",
    name: "Pantoprazole 40mg",
    category: "Acidity & Digestion",
    defaultDosage: "1 Tablet",
    defaultFrequency: "Once a day (Morning)",
    defaultDuration: "5 Days",
    instructions: "Take empty stomach, 30 minutes before breakfast.",
  },
  {
    id: "med-4",
    name: "Ondansetron 4mg",
    category: "Acidity & Digestion",
    defaultDosage: "1 Tablet",
    defaultFrequency: "SOS (When nauseous)",
    defaultDuration: "3 Days",
    instructions: "Dissolve on tongue or take with water.",
  },
  // Allergies / Cold
  {
    id: "med-5",
    name: "Cetirizine 10mg",
    category: "Allergies & Cold",
    defaultDosage: "1 Tablet",
    defaultFrequency: "Once a day (Night)",
    defaultDuration: "5 Days",
    instructions: "May cause drowsiness.",
  },
  {
    id: "med-6",
    name: "Levocetirizine 5mg",
    category: "Allergies & Cold",
    defaultDosage: "1 Tablet",
    defaultFrequency: "Once a day (Night)",
    defaultDuration: "5 Days",
    instructions: "May cause drowsiness.",
  },
  // Antibiotics (Basic)
  {
    id: "med-7",
    name: "Amoxicillin 500mg",
    category: "Antibiotics",
    defaultDosage: "1 Capsule",
    defaultFrequency: "Three times a day",
    defaultDuration: "5 Days",
    instructions: "Complete the full course.",
  },
  {
    id: "med-8",
    name: "Azithromycin 500mg",
    category: "Antibiotics",
    defaultDosage: "1 Tablet",
    defaultFrequency: "Once a day",
    defaultDuration: "3 Days",
    instructions: "Take 1 hour before or 2 hours after meals.",
  },
  // Vitamins / Supplements
  {
    id: "med-9",
    name: "Vitamin C 500mg",
    category: "Supplements",
    defaultDosage: "1 Tablet",
    defaultFrequency: "Once a day",
    defaultDuration: "10 Days",
    instructions: "Chewable tablet.",
  },
  {
    id: "med-10",
    name: "Multivitamin",
    category: "Supplements",
    defaultDosage: "1 Tablet",
    defaultFrequency: "Once a day",
    defaultDuration: "30 Days",
    instructions: "Take after breakfast.",
  }
];
