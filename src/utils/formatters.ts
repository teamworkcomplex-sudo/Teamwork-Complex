// Pakistani currency, CNIC, Phone and Text formatters

export function formatPKR(amount: number): string {
  if (isNaN(amount) || amount === 0) return 'PKR 0';

  if (amount >= 10000000) {
    const crores = amount / 10000000;
    return `PKR ${crores.toFixed(crores % 1 === 0 ? 0 : 2)} Crore`;
  }
  if (amount >= 100000) {
    const lacs = amount / 100000;
    return `PKR ${lacs.toFixed(lacs % 1 === 0 ? 0 : 2)} Lac`;
  }
  if (amount >= 1000) {
    const thousands = amount / 1000;
    return `PKR ${thousands.toFixed(thousands % 1 === 0 ? 0 : 1)} Thousand`;
  }
  return `PKR ${amount.toLocaleString('en-PK')}`;
}

export function formatPKRFull(amount: number): string {
  if (isNaN(amount) || amount === 0) return 'Rs. 0';
  return `Rs. ${amount.toLocaleString('en-PK')}`;
}

export function formatPKRWordsUrdu(amount: number): string {
  if (!amount || amount <= 0) return 'صفر روپے';
  
  const crore = Math.floor(amount / 10000000);
  const remCrore = amount % 10000000;
  const lac = Math.floor(remCrore / 100000);
  const remLac = remCrore % 100000;
  const thousand = Math.floor(remLac / 1000);

  const parts: string[] = [];
  if (crore > 0) parts.push(`${crore} کروڑ`);
  if (lac > 0) parts.push(`${lac} لاکھ`);
  if (thousand > 0) parts.push(`${thousand} ہزار`);
  
  return parts.length > 0 ? `${parts.join(' ')} روپے` : `${amount} روپے`;
}

export function formatCNIC(val: string): string {
  const digits = val.replace(/\D/g, '').slice(0, 13);
  if (digits.length <= 5) return digits;
  if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12, 13)}`;
}

export function formatPhone(val: string): string {
  const digits = val.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 4) return digits;
  return `${digits.slice(0, 4)}-${digits.slice(4)}`;
}

export function generateFileNumber(city: string, seq: number): string {
  const year = new Date().getFullYear();
  const cityCode = city ? city.slice(0, 3).toUpperCase() : 'PAK';
  const pad = String(seq).padStart(4, '0');
  return `TWC-${year}-${cityCode}-${pad}`;
}

export const PAKISTAN_CITIES = [
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Karachi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Gujranwala',
  'Sialkot',
  'Quetta',
  'Abbottabad',
  'Bahawalpur',
  'Sargodha',
  'Gwadar',
  'Wah Cantt',
  'Sheikhupura',
  'Jhelum',
  'Mardan'
];

export const POPULAR_SOCIETIES: Record<string, string[]> = {
  'Lahore': [
    'DHA Phase 1-9',
    'Bahria Town',
    'Gulberg I, II, III',
    'Lake City',
    'Johar Town',
    'Model Town',
    'Wapda Town',
    'Askari 10 & 11',
    'State Life Society',
    'Valencia Town',
    'Central Park',
    'Raiwind Road Projects'
  ],
  'Islamabad': [
    'DHA Phase 2 & 5',
    'Bahria Enclave',
    'Gulberg Greens',
    'Sector F-6, F-7, F-8',
    'Sector G-11, G-13, G-14',
    'Sector B-17 (Multi Gardens)',
    'Park View City',
    'Eighteen',
    'Top City-1',
    'Mumtaz City'
  ],
  'Rawalpindi': [
    'Bahria Town Phase 1-8',
    'DHA Phase 1',
    'Chaklala Scheme III',
    'Askari 14',
    'Gulraiz Housing',
    'New City Phase 2',
    'Satellite Town',
    'Airport Housing Society'
  ],
  'Karachi': [
    'DHA Phase 1-8',
    'Bahria Town Karachi',
    'Clifton Blocks 1-9',
    'Gulshan-e-Iqbal',
    'PECHS',
    'Federal B Area',
    'Scheme 33',
    'North Nazimabad',
    'KDA Scheme 1'
  ],
  'Faisalabad': [
    'Eden Valley',
    'Canal Road Societies',
    'Madina Town',
    'DHA Faisalabad',
    'Wapda City',
    'FDA City',
    'Peoples Colony'
  ],
  'Multan': [
    'DHA Multan',
    'Wapda Town Phase 1 & 2',
    'Model Town',
    'Royal Orchard',
    'Buch Executive Villas',
    'Citi Housing Multan'
  ]
};

export const COMMON_FEATURES = [
  'Corner Plot (کارنر)',
  'Main Boulevard (مین بلیوارڈ)',
  'Park Facing (پارک فیسنگ)',
  'Direct Approach (براہ راست رسائی)',
  'Underground Electricity',
  'Sui Gas Connected',
  'Immediate Possession',
  'Gated Community 24/7 Security',
  'Commercial Footfall',
  'Wide Frontage (کشادہ فرنٹ)'
];
