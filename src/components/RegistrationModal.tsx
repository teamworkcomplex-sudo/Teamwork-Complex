import React, { useState, useEffect } from 'react';
import { 
  X, 
  Building2, 
  MapPin, 
  User, 
  ArrowLeftRight, 
  FileCheck, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { 
  PropertyRecord, 
  PropertyCategory, 
  PropertySubtype, 
  DimensionUnit, 
  DealType, 
  CashDifferenceType, 
  OwnershipDocType 
} from '../types/property';
import { 
  formatPKR, 
  formatPKRWordsUrdu, 
  formatCNIC, 
  formatPhone, 
  generateFileNumber, 
  PAKISTAN_CITIES, 
  POPULAR_SOCIETIES, 
  COMMON_FEATURES 
} from '../utils/formatters';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (property: PropertyRecord) => void;
  initialData?: PropertyRecord | null;
  existingCount: number;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  existingCount
}) => {
  const isEditing = !!initialData;

  // Active form section tab for organized PC flow
  const [activeStep, setActiveStep] = useState<'property' | 'exchange' | 'customer' | 'legal'>('property');

  // Form State
  const [fileNumber, setFileNumber] = useState('');
  const [registrationDate, setRegistrationDate] = useState('');
  const [status, setStatus] = useState<PropertyRecord['status']>('available');
  const [dealType, setDealType] = useState<DealType>('sale_or_exchange');
  const [category, setCategory] = useState<PropertyCategory>('Residential');
  const [propertyType, setPropertyType] = useState<PropertySubtype>('Plot (پلاٹ)');
  const [title, setTitle] = useState('');

  // Location
  const [city, setCity] = useState('Lahore');
  const [society, setSociety] = useState('DHA Phase 1-9');
  const [customSociety, setCustomSociety] = useState('');
  const [blockSector, setBlockSector] = useState('');
  const [plotNumber, setPlotNumber] = useState('');
  const [completeAddress, setCompleteAddress] = useState('');

  // Measurement
  const [size, setSize] = useState<number>(10);
  const [unit, setUnit] = useState<DimensionUnit>('Marla');
  const [coveredAreaSqFt, setCoveredAreaSqFt] = useState<number | undefined>(undefined);

  // Financials
  const [demandPKR, setDemandPKR] = useState<number>(25000000);
  const [minimumDemandPKR, setMinimumDemandPKR] = useState<number | undefined>(24000000);
  const [tokenBayanaPKR, setTokenBayanaPKR] = useState<number | undefined>(1000000);

  // Exchange Criteria
  const [lookingForCity, setLookingForCity] = useState<string[]>(['Islamabad', 'Rawalpindi']);
  const [lookingForPropertyType, setLookingForPropertyType] = useState<string[]>(['House / Villa (مکان / کوٹھی)']);
  const [lookingForSize, setLookingForSize] = useState('10 Marla or 1 Kanal');
  const [cashDifferenceOption, setCashDifferenceOption] = useState<CashDifferenceType>('flexible');
  const [approxDifferencePKR, setApproxDifferencePKR] = useState<number>(0);
  const [specialConditions, setSpecialConditions] = useState('');

  // Customer
  const [fullName, setFullName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [cnic, setCnic] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerCity, setCustomerCity] = useState('Lahore');
  const [clientType, setClientType] = useState<'Owner/Seller' | 'Investor' | 'Buyer' | 'Exchanger'>('Owner/Seller');

  // Legal
  const [ownershipDocType, setOwnershipDocType] = useState<OwnershipDocType>('Transfer Letter (ٹرانسفر لیٹر)');
  const [possessionStatus, setPossessionStatus] = useState<'Possession Available' | 'Non-Possession' | 'Under Construction'>('Possession Available');
  const [taxPaid, setTaxPaid] = useState(true);
  const [verifiedByTWC, setVerifiedByTWC] = useState(true);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(['Immediate Possession', 'Underground Electricity']);
  const [notes, setNotes] = useState('');

  const [formError, setFormError] = useState('');

  // Populate data when opening
  useEffect(() => {
    if (initialData) {
      setFileNumber(initialData.fileNumber);
      setRegistrationDate(initialData.registrationDate);
      setStatus(initialData.status);
      setDealType(initialData.dealType);
      setCategory(initialData.category);
      setPropertyType(initialData.propertyType);
      setTitle(initialData.title);

      setCity(initialData.city);
      setSociety(initialData.society);
      setBlockSector(initialData.blockSector);
      setPlotNumber(initialData.plotNumber);
      setCompleteAddress(initialData.completeAddress);

      setSize(initialData.size);
      setUnit(initialData.unit);
      setCoveredAreaSqFt(initialData.coveredAreaSqFt);

      setDemandPKR(initialData.demandPKR);
      setMinimumDemandPKR(initialData.minimumDemandPKR);
      setTokenBayanaPKR(initialData.tokenBayanaPKR);

      setLookingForCity(initialData.exchangePreferences.lookingForCity);
      setLookingForPropertyType(initialData.exchangePreferences.lookingForPropertyType);
      setLookingForSize(initialData.exchangePreferences.lookingForSize);
      setCashDifferenceOption(initialData.exchangePreferences.cashDifferenceOption);
      setApproxDifferencePKR(initialData.exchangePreferences.approxDifferencePKR);
      setSpecialConditions(initialData.exchangePreferences.specialConditions);

      setFullName(initialData.customer.fullName);
      setFatherName(initialData.customer.fatherName);
      setCnic(initialData.customer.cnic);
      setPhone(initialData.customer.phone);
      setWhatsapp(initialData.customer.whatsapp || initialData.customer.phone);
      setEmail(initialData.customer.email || '');
      setCustomerAddress(initialData.customer.address);
      setCustomerCity(initialData.customer.city);
      setClientType(initialData.customer.clientType);

      setOwnershipDocType(initialData.ownershipDocType);
      setPossessionStatus(initialData.possessionStatus);
      setTaxPaid(initialData.taxPaid);
      setVerifiedByTWC(initialData.verifiedByTWC);
      setSelectedFeatures(initialData.features || []);
      setNotes(initialData.notes || '');
    } else {
      // Auto-generate fresh file number
      const autoNum = generateFileNumber('LHR', existingCount + 1);
      setFileNumber(autoNum);
      setRegistrationDate(new Date().toISOString().slice(0, 10));
      setStatus('available');
      setDealType('sale_or_exchange');
      setCategory('Residential');
      setPropertyType('Plot (پلاٹ)');
      setTitle('');

      setCity('Lahore');
      setSociety('DHA Phase 1-9');
      setCustomSociety('');
      setBlockSector('');
      setPlotNumber('');
      setCompleteAddress('');

      setSize(10);
      setUnit('Marla');
      setDemandPKR(25000000);
      setMinimumDemandPKR(24000000);
      setTokenBayanaPKR(1000000);

      setLookingForCity(['Islamabad', 'Rawalpindi']);
      setLookingForPropertyType(['House / Villa (مکان / کوٹھی)']);
      setLookingForSize('10 Marla or 1 Kanal');
      setCashDifferenceOption('flexible');
      setApproxDifferencePKR(0);
      setSpecialConditions('');

      setFullName('');
      setFatherName('');
      setCnic('');
      setPhone('0300-');
      setWhatsapp('');
      setEmail('');
      setCustomerAddress('');
      setCustomerCity('Lahore');
      setClientType('Owner/Seller');

      setOwnershipDocType('Transfer Letter (ٹرانسفر لیٹر)');
      setPossessionStatus('Possession Available');
      setTaxPaid(true);
      setVerifiedByTWC(true);
      setSelectedFeatures(['Underground Electricity', 'Immediate Possession']);
      setNotes('');
    }
    setActiveStep('property');
    setFormError('');
  }, [initialData, isOpen, existingCount]);

  if (!isOpen) return null;

  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    if (!isEditing && !customSociety) {
      setFileNumber(generateFileNumber(newCity, existingCount + 1));
    }
    const societies = POPULAR_SOCIETIES[newCity];
    if (societies && societies.length > 0) {
      setSociety(societies[0]);
    } else {
      setSociety('Other / Custom');
    }
  };

  const handleToggleFeature = (feat: string) => {
    if (selectedFeatures.includes(feat)) {
      setSelectedFeatures(selectedFeatures.filter(f => f !== feat));
    } else {
      setSelectedFeatures([...selectedFeatures, feat]);
    }
  };

  const handleToggleLookingCity = (c: string) => {
    if (lookingForCity.includes(c)) {
      setLookingForCity(lookingForCity.filter(item => item !== c));
    } else {
      setLookingForCity([...lookingForCity, c]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim()) {
      setFormError('Please enter a descriptive property title (e.g. 1 Kanal Plot in DHA Phase 6).');
      setActiveStep('property');
      return;
    }
    if (!fullName.trim()) {
      setFormError('Please enter customer / owner full name.');
      setActiveStep('customer');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setFormError('Please provide a valid Pakistani contact phone number (e.g. 0300-1234567).');
      setActiveStep('customer');
      return;
    }
    if (demandPKR <= 0) {
      setFormError('Please specify property demand amount in PKR.');
      setActiveStep('property');
      return;
    }

    const finalSociety = customSociety.trim() ? customSociety.trim() : society;
    const finalAddress = completeAddress.trim() 
      ? completeAddress.trim() 
      : `${plotNumber ? plotNumber + ', ' : ''}${blockSector ? blockSector + ', ' : ''}${finalSociety}, ${city}`;

    const record: PropertyRecord = {
      id: initialData?.id || `twc-prop-${Date.now()}`,
      fileNumber: fileNumber.trim() || `TWC-${Date.now().toString().slice(-6)}`,
      registrationDate: registrationDate || new Date().toISOString().slice(0, 10),
      status,
      dealType,
      category,
      propertyType,
      title: title.trim(),
      city,
      society: finalSociety,
      blockSector: blockSector.trim(),
      plotNumber: plotNumber.trim(),
      completeAddress: finalAddress,
      size: Number(size) || 1,
      unit,
      coveredAreaSqFt: coveredAreaSqFt ? Number(coveredAreaSqFt) : undefined,
      demandPKR: Number(demandPKR) || 0,
      minimumDemandPKR: minimumDemandPKR ? Number(minimumDemandPKR) : undefined,
      exchangeValuationPKR: Number(demandPKR) || 0,
      tokenBayanaPKR: tokenBayanaPKR ? Number(tokenBayanaPKR) : undefined,
      exchangePreferences: {
        lookingForCity,
        lookingForPropertyType,
        lookingForSize: lookingForSize.trim(),
        cashDifferenceOption,
        approxDifferencePKR: Number(approxDifferencePKR) || 0,
        specialConditions: specialConditions.trim()
      },
      customer: {
        fullName: fullName.trim(),
        fatherName: fatherName.trim(),
        cnic: cnic.trim(),
        phone: phone.trim(),
        whatsapp: (whatsapp || phone).trim(),
        email: email.trim(),
        address: customerAddress.trim() || finalAddress,
        city: customerCity.trim() || city,
        clientType
      },
      ownershipDocType,
      possessionStatus,
      taxPaid,
      verifiedByTWC,
      features: selectedFeatures,
      notes: notes.trim(),
      matchedWithPropertyId: initialData?.matchedWithPropertyId,
      dealFinalizedPricePKR: initialData?.dealFinalizedPricePKR
    };

    onSave(record);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[11px] font-semibold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                {isEditing ? 'Record Update' : 'New Entry'}
              </span>
              <span className="text-slate-400 text-xs tabular-nums">
                File: {fileNumber}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-0.5">
              {isEditing ? 'Edit Property & Customer Record (ترمیم ریکارڈ)' : 'Register New Property Deal (نیا اندراج جائیداد)'}
            </h2>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Tabs */}
        <div className="bg-slate-100/90 border-b border-slate-200 px-6 py-2 flex items-center gap-2 overflow-x-auto text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveStep('property')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeStep === 'property'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>1. Property & Location (پراپرٹی تفصیل)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStep('exchange')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeStep === 'exchange'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-amber-600" />
            <span>2. Deal & Exchange Criteria (تبادلہ کی شرائط)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStep('customer')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeStep === 'customer'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5 text-sky-600" />
            <span>3. Customer / Owner Info (مالک کا ریکارڈ)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStep('legal')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeStep === 'legal'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>4. Verification & Legal (دستاویزات)</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* STEP 1: PROPERTY & LOCATION */}
          {activeStep === 'property' && (
            <div className="space-y-5 animate-in fade-in">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* File Number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Registration / File No. (فائل نمبر)
                  </label>
                  <input
                    type="text"
                    value={fileNumber}
                    onChange={(e) => setFileNumber(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-medium focus:bg-white focus:border-emerald-500 focus:outline-none"
                    placeholder="TWC-2026-LHR-0001"
                  />
                </div>

                {/* Registration Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Registration Date (تاریخ اندراج)
                  </label>
                  <input
                    type="date"
                    value={registrationDate}
                    onChange={(e) => setRegistrationDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Listing Status (حالت)
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as PropertyRecord['status'])}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="available">Available (دستیاب)</option>
                    <option value="in_exchange">In Exchange Process (زیرِ تبادلہ)</option>
                    <option value="exchanged">Exchanged (تبادلہ ہوچکا)</option>
                    <option value="sold">Sold (فروخت شدہ)</option>
                    <option value="reserved">Reserved / Token Paid (بک شدہ)</option>
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Property Title / Headline (پراپرٹی کا عنوان) *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 1 Kanal Prime Residential Plot, Sector J, DHA Phase 6"
                  required
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Category & Property Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Property Category (کیٹیگری)
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-lg">
                    {(['Residential', 'Commercial', 'Agricultural', 'Industrial'] as PropertyCategory[]).map(cat => (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`py-1.5 text-xs font-medium rounded-md transition-colors text-center truncate ${
                          category === cat
                            ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Property Subtype (قسمِ جائیداد)
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as PropertySubtype)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Plot (پلاٹ)">Plot (پلاٹ)</option>
                    <option value="House / Villa (مکان / کوٹھی)">House / Villa (مکان / کوٹھی)</option>
                    <option value="Commercial Plaza (کمرشل پلازہ)">Commercial Plaza (کمرشل پلازہ)</option>
                    <option value="Shop (دکان)">Shop (دکان)</option>
                    <option value="Apartment / Flat (فلیٹ)">Apartment / Flat (فلیٹ)</option>
                    <option value="Farm House (فارم ہاؤس)">Farm House (فارم ہاؤس)</option>
                    <option value="Agricultural Land (زرعی رقبہ)">Agricultural Land (زرعی رقبہ)</option>
                    <option value="Industrial Shed / Plot (صنعتی پلاٹ)">Industrial Shed / Plot (صنعتی پلاٹ)</option>
                  </select>
                </div>
              </div>

              {/* Location: City & Society */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City (شہر) *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => handleCityChange(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:border-emerald-500 focus:outline-none"
                  >
                    {PAKISTAN_CITIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Society / Scheme (سوسائٹی / اسکیم)
                  </label>
                  <select
                    value={society}
                    onChange={(e) => setSociety(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:border-emerald-500 focus:outline-none"
                  >
                    {(POPULAR_SOCIETIES[city] || []).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                    <option value="Other / Custom">Other (دیگر سوسائٹی)</option>
                  </select>
                </div>

                {society === 'Other / Custom' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Specify Society Name
                    </label>
                    <input
                      type="text"
                      value={customSociety}
                      onChange={(e) => setCustomSociety(e.target.value)}
                      placeholder="e.g. Wapda Town, Canal Gardens"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sector / Block / Phase
                  </label>
                  <input
                    type="text"
                    value={blockSector}
                    onChange={(e) => setBlockSector(e.target.value)}
                    placeholder="e.g. Block C, Phase 6"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Plot / House / Shop Number
                  </label>
                  <input
                    type="text"
                    value={plotNumber}
                    onChange={(e) => setPlotNumber(e.target.value)}
                    placeholder="e.g. Plot # 412, Street 7"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Complete Address (مکمل پتہ)
                  </label>
                  <input
                    type="text"
                    value={completeAddress}
                    onChange={(e) => setCompleteAddress(e.target.value)}
                    placeholder="Detailed street & address for legal certificate"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Measurement & Demand */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Area Size (رقبہ / سائز)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="any"
                      min="0.1"
                      value={size}
                      onChange={(e) => setSize(parseFloat(e.target.value) || 0)}
                      required
                      className="w-1/2 px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                    />
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value as DimensionUnit)}
                      className="w-1/2 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="Marla">Marla (مرلہ)</option>
                      <option value="Kanal">Kanal (کنال)</option>
                      <option value="Sq. Yards">Sq. Yards (گز)</option>
                      <option value="Sq. Feet">Sq. Feet (فٹ)</option>
                      <option value="Acre">Acre (ایکڑ / قلعہ)</option>
                    </select>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Demand / Valuation in PKR (ڈیمانڈ / مالیت روپے) *
                  </label>
                  <input
                    type="number"
                    step="50000"
                    value={demandPKR}
                    onChange={(e) => setDemandPKR(parseInt(e.target.value) || 0)}
                    required
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:border-emerald-500 focus:outline-none tabular-nums"
                    placeholder="25000000"
                  />
                  {/* Real-time PKR conversion helper */}
                  <div className="mt-1 flex items-center justify-between text-xs text-emerald-700 bg-emerald-50/80 px-2.5 py-1 rounded-md border border-emerald-200/60">
                    <span className="font-semibold">{formatPKR(demandPKR)}</span>
                    <span className="font-urdu text-[11px]">{formatPKRWordsUrdu(demandPKR)}</span>
                  </div>
                </div>
              </div>

              {/* Minimum Demand & Token */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Minimum Acceptable Price (اخری ریٹ) - Optional
                  </label>
                  <input
                    type="number"
                    step="50000"
                    value={minimumDemandPKR || ''}
                    onChange={(e) => setMinimumDemandPKR(parseInt(e.target.value) || undefined)}
                    placeholder="e.g. 24000000"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs tabular-nums focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Token / Bayana Amount Received (بیعانہ رقم) - Optional
                  </label>
                  <input
                    type="number"
                    step="25000"
                    value={tokenBayanaPKR || ''}
                    onChange={(e) => setTokenBayanaPKR(parseInt(e.target.value) || undefined)}
                    placeholder="e.g. 1000000"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs tabular-nums focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

            </div>
          )}

          {/* STEP 2: DEAL TYPE & EXCHANGE CRITERIA */}
          {activeStep === 'exchange' && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Deal Nature (نوعیت ڈیل)
                </label>
                <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setDealType('sale_or_exchange')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                      dealType === 'sale_or_exchange'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Sale or Exchange (فروخت یا تبادلہ)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDealType('exchange_only')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                      dealType === 'exchange_only'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Exchange Only (صرف تبادلہ)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDealType('sale_only')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                      dealType === 'sale_only'
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Direct Cash Sale (صرف کیش)
                  </button>
                </div>
              </div>

              {dealType !== 'sale_only' ? (
                <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4 space-y-4">
                  <div className="flex items-center gap-2 text-amber-800 text-xs font-bold">
                    <ArrowLeftRight className="w-4 h-4" />
                    <span>Exchange Requirements for Matching Engine (مطلوبہ تبادلہ کی شرائط)</span>
                  </div>

                  {/* Target Cities */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Desired Cities for Exchange (کن شہروں میں تبادلہ قبول ہے؟)
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {['Lahore', 'Islamabad', 'Rawalpindi', 'Karachi', 'Faisalabad', 'Multan', 'Peshawar', 'Gwadar'].map(c => {
                        const isSelected = lookingForCity.includes(c);
                        return (
                          <button
                            type="button"
                            key={c}
                            onClick={() => handleToggleLookingCity(c)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                              isSelected
                                ? 'bg-amber-600 text-white shadow-xs'
                                : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
                            }`}
                          >
                            {isSelected ? '✓ ' : '+ '}{c}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Desired Property Types & Size */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Looking For Size / Requirements (مطلوبہ سائز)
                      </label>
                      <input
                        type="text"
                        value={lookingForSize}
                        onChange={(e) => setLookingForSize(e.target.value)}
                        placeholder="e.g. 10 Marla House or 1 Kanal Plot"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Cash Adjustment / Difference (سر یا بقیہ رقم)
                      </label>
                      <select
                        value={cashDifferenceOption}
                        onChange={(e) => setCashDifferenceOption(e.target.value as CashDifferenceType)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:border-amber-500 focus:outline-none"
                      >
                        <option value="flexible">Flexible / Negotiable (حسبِ موقع بات چیت)</option>
                        <option value="give_cash">Willing to PAY Cash Difference (اضافی کیش دینے کو تیار)</option>
                        <option value="take_cash">Must RECEIVE Cash Difference (کیش رقم واپس لینی ہے)</option>
                        <option value="equal_value">Strictly Equal Value Trade (برابر قیمت کا سودا)</option>
                      </select>
                    </div>
                  </div>

                  {/* Estimated Cash Difference */}
                  {(cashDifferenceOption === 'give_cash' || cashDifferenceOption === 'take_cash') && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Estimated Cash Adjustment (تخمینہ بقیہ رقم PKR)
                      </label>
                      <input
                        type="number"
                        step="100000"
                        value={approxDifferencePKR}
                        onChange={(e) => setApproxDifferencePKR(parseInt(e.target.value) || 0)}
                        placeholder="e.g. 3000000 (30 Lakh)"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs tabular-nums focus:border-amber-500 focus:outline-none"
                      />
                      <div className="text-[11px] text-amber-800 mt-1">
                        {formatPKR(approxDifferencePKR)} · {formatPKRWordsUrdu(approxDifferencePKR)}
                      </div>
                    </div>
                  )}

                  {/* Special Notes */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Special Exchange Conditions / Notes (تبادلہ کی خصوصی شرائط)
                    </label>
                    <textarea
                      rows={2}
                      value={specialConditions}
                      onChange={(e) => setSpecialConditions(e.target.value)}
                      placeholder="e.g. Ready for immediate registry exchange, prefer DHA or CDA sectors, no litigated files"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                </div>
              ) : (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-xs">
                  This property is registered strictly for Direct Cash Sale. If the owner decides to consider property exchange later, you can switch this option at any time.
                </div>
              )}

            </div>
          )}

          {/* STEP 3: CUSTOMER / OWNER INFO */}
          {activeStep === 'customer' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-sky-50/60 border border-sky-200 rounded-xl p-3 text-xs text-sky-900 flex items-center justify-between">
                <span>Customer & Property Owner Identity Records (شناخت مالک جائیداد)</span>
                <span className="text-[11px] text-sky-700 font-medium">Auto-formatted for NADRA CNIC</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Customer Full Name (مالک کا پورا نام) *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="e.g. Chaudhry Tariq Mehmood"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:border-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Father's / Husband's Name (ولدیت / زوجیت)
                  </label>
                  <input
                    type="text"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    placeholder="e.g. Haji Muhammad Sharif"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    CNIC Number (قومی شناختی کارڈ نمبر)
                  </label>
                  <input
                    type="text"
                    value={cnic}
                    onChange={(e) => setCnic(formatCNIC(e.target.value))}
                    maxLength={15}
                    placeholder="35201-1234567-1"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono font-medium focus:border-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Phone Number (فون نمبر) *
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    maxLength={12}
                    required
                    placeholder="0300-1234567"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono font-medium focus:border-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    WhatsApp Number (واٹس ایپ)
                  </label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(formatPhone(e.target.value))}
                    maxLength={12}
                    placeholder="0300-1234567"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Customer City (رہائشی شہر)
                  </label>
                  <select
                    value={customerCity}
                    onChange={(e) => setCustomerCity(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:border-sky-500 focus:outline-none"
                  >
                    {PAKISTAN_CITIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address (ای میل) - Optional
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="client@gmail.com"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:border-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Client Role in Deal (حیثیت)
                  </label>
                  <select
                    value={clientType}
                    onChange={(e) => setClientType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:border-sky-500 focus:outline-none"
                  >
                    <option value="Owner/Seller">Sole Owner / Seller (اصل مالک)</option>
                    <option value="Exchanger">Property Exchanger (تبادلہ خواہاں)</option>
                    <option value="Investor">Real Estate Investor (انویسٹر)</option>
                    <option value="Buyer">Direct Buyer (خریدار)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Permanent Postal Address (مستقل رہائشی پتہ)
                </label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Complete residential address for agreement / notices"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:border-sky-500 focus:outline-none"
                />
              </div>

            </div>
          )}

          {/* STEP 4: VERIFICATION & LEGAL */}
          {activeStep === 'legal' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ownership Title Document (دستاویز ملکیت)
                  </label>
                  <select
                    value={ownershipDocType}
                    onChange={(e) => setOwnershipDocType(e.target.value as OwnershipDocType)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Registry Inteqal (رجسٹری انتقال)">Registry Inteqal (رجسٹری انتقال)</option>
                    <option value="Allotment Letter (الارٹمنٹ لیٹر)">Allotment Letter (الارٹمنٹ لیٹر)</option>
                    <option value="Transfer Letter (ٹرانسفر لیٹر)">Transfer Letter (ٹرانسفر لیٹر)</option>
                    <option value="File / Allocation (فائل)">File / Allocation (فائل)</option>
                    <option value="Power of Attorney (مختار نامہ)">Power of Attorney (مختار نامہ)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Possession Status (قبضہ کی صورتحال)
                  </label>
                  <select
                    value={possessionStatus}
                    onChange={(e) => setPossessionStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Possession Available">Possession Available (موقع پر قبضہ موجود)</option>
                    <option value="Non-Possession">Non-Possession / Development (زیرِ ترقی / بغیر قبضہ)</option>
                    <option value="Under Construction">Under Construction (زیرِ تعمیر)</option>
                  </select>
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={taxPaid}
                    onChange={(e) => setTaxPaid(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">FBR / TMA Taxes Clear (ٹیکس کلیئرنس)</span>
                    <span className="text-[11px] text-slate-500">Property tax and utility dues cleared</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={verifiedByTWC}
                    onChange={(e) => setVerifiedByTWC(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">Verified by Team Work Complex (تصدیق شدہ)</span>
                    <span className="text-[11px] text-slate-500">Official office physical & record check</span>
                  </div>
                </label>
              </div>

              {/* Key Features */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Property Highlights & Amenities (خصوصیات)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {COMMON_FEATURES.map(feat => {
                    const isChecked = selectedFeatures.includes(feat);
                    return (
                      <button
                        type="button"
                        key={feat}
                        onClick={() => handleToggleFeature(feat)}
                        className={`text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-2 border ${
                          isChecked
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-medium'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isChecked ? 'text-emerald-600' : 'text-slate-300'}`} />
                        <span className="truncate">{feat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Internal Remarks & Verification Notes (دفتر کے خصوصی ریمارکس)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Original file checked at society head office, meeting scheduled with owner..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

            </div>
          )}

          {/* Modal Footer / Navigation Controls */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {activeStep !== 'property' && (
                <button
                  type="button"
                  onClick={() => {
                    if (activeStep === 'legal') setActiveStep('customer');
                    else if (activeStep === 'customer') setActiveStep('exchange');
                    else if (activeStep === 'exchange') setActiveStep('property');
                  }}
                  className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Back (پیچھے)
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {activeStep !== 'legal' ? (
                <button
                  type="button"
                  onClick={() => {
                    if (activeStep === 'property') setActiveStep('exchange');
                    else if (activeStep === 'exchange') setActiveStep('customer');
                    else if (activeStep === 'customer') setActiveStep('legal');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  Continue Next Step (آگے چلیں) →
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>{isEditing ? 'Save Changes (ریکارڈ اپ ڈیٹ کریں)' : 'Confirm & Save Property (ریکارڈ محفوظ کریں)'}</span>
                </button>
              )}
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
