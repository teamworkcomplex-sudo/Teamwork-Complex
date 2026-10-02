export type PropertyStatus = 'available' | 'in_exchange' | 'exchanged' | 'sold' | 'reserved';

export type DealType = 'exchange_only' | 'sale_or_exchange' | 'sale_only';

export type PropertyCategory = 'Residential' | 'Commercial' | 'Agricultural' | 'Industrial';

export type PropertySubtype = 
  | 'Plot (پلاٹ)' 
  | 'House / Villa (مکان / کوٹھی)' 
  | 'Commercial Plaza (کمرشل پلازہ)' 
  | 'Shop (دکان)' 
  | 'Apartment / Flat (فلیٹ)' 
  | 'Farm House (فارم ہاؤس)' 
  | 'Agricultural Land (زرعی رقبہ)' 
  | 'Industrial Shed / Plot (صنعتی پلاٹ)';

export type DimensionUnit = 'Marla' | 'Kanal' | 'Sq. Yards' | 'Sq. Feet' | 'Acre';

export type CashDifferenceType = 'give_cash' | 'take_cash' | 'equal_value' | 'flexible';

export type OwnershipDocType = 
  | 'Registry Inteqal (رجسٹری انتقال)'
  | 'Allotment Letter (الارٹمنٹ لیٹر)'
  | 'Transfer Letter (ٹرانسفر لیٹر)'
  | 'File / Allocation (فائل)'
  | 'Power of Attorney (مختار نامہ)';

export interface Customer {
  fullName: string;
  fatherName: string;
  cnic: string; // e.g. 35201-1234567-1
  phone: string; // e.g. 0300-1234567
  whatsapp?: string;
  email?: string;
  address: string;
  city: string;
  clientType: 'Owner/Seller' | 'Investor' | 'Buyer' | 'Exchanger';
}

export interface ExchangePreferences {
  lookingForCity: string[];
  lookingForPropertyType: string[];
  lookingForSize: string;
  cashDifferenceOption: CashDifferenceType;
  approxDifferencePKR: number; // Cash adjustment to pay or receive
  specialConditions: string;
}

export interface PropertyRecord {
  id: string;
  fileNumber: string; // e.g. TWC-2026-LHR-001
  registrationDate: string; // YYYY-MM-DD
  status: PropertyStatus;
  dealType: DealType;
  category: PropertyCategory;
  propertyType: PropertySubtype;
  title: string;
  
  // Location
  city: string;
  society: string; // e.g. DHA Phase 6, Bahria Town, Gulberg
  blockSector: string; // e.g. Sector C, Block J
  plotNumber: string; // Plot / House #
  completeAddress: string;

  // Measurement
  size: number;
  unit: DimensionUnit;
  coveredAreaSqFt?: number;

  // Financials
  demandPKR: number; // e.g. 25000000 (2.5 Crore)
  minimumDemandPKR?: number;
  exchangeValuationPKR?: number;
  tokenBayanaPKR?: number;

  // Exchange Criteria
  exchangePreferences: ExchangePreferences;

  // Owner/Customer details
  customer: Customer;

  // Documents & Legal
  ownershipDocType: OwnershipDocType;
  possessionStatus: 'Possession Available' | 'Non-Possession' | 'Under Construction';
  taxPaid: boolean;
  verifiedByTWC: boolean;

  // Attributes
  features: string[];
  notes?: string;

  // Linked Exchange
  matchedWithPropertyId?: string;
  matchedDealDate?: string;
  dealFinalizedPricePKR?: number;
}

export interface ExchangeMatch {
  candidateProperty: PropertyRecord;
  matchScore: number; // 0 - 100%
  reasons: string[];
  cashDifference: number; // positive = candidate owes current, negative = current owes candidate
  direction: 'current_pays' | 'candidate_pays' | 'even_trade';
}
