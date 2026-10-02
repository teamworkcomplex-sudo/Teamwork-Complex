import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  ShieldCheck, 
  Building2, 
  ArrowLeftRight, 
  QrCode, 
  FileText,
  BadgeCheck
} from 'lucide-react';
import { PropertyRecord } from '../types/property';
import { formatPKR, formatPKRFull, formatPKRWordsUrdu } from '../utils/formatters';

interface PrintCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: PropertyRecord | null;
  allProperties?: PropertyRecord[];
}

export const PrintCertificateModal: React.FC<PrintCertificateModalProps> = ({
  isOpen,
  onClose,
  property,
  allProperties = []
}) => {
  const [docType, setDocType] = useState<'certificate' | 'exchange_agreement' | 'token_slip'>('certificate');
  const [partnerPropertyId, setPartnerPropertyId] = useState<string>('');

  if (!isOpen || !property) return null;

  const partnerProperty = allProperties.find(p => p.id === partnerPropertyId) || 
    allProperties.find(p => p.id !== property.id && p.city !== property.city) ||
    allProperties.find(p => p.id !== property.id);

  const handlePrint = () => {
    window.print();
  };

  // Financial calculations for exchange deed
  const prop1Val = property.demandPKR;
  const prop2Val = partnerProperty ? partnerProperty.demandPKR : 0;
  const priceDiff = Math.abs(prop1Val - prop2Val);
  const whoPaysDiff = prop1Val > prop2Val 
    ? `${partnerProperty?.customer.fullName || 'Second Party'} will pay ${formatPKR(priceDiff)} to ${property.customer.fullName}`
    : `${property.customer.fullName} will pay ${formatPKR(priceDiff)} to ${partnerProperty?.customer.fullName || 'Second Party'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[96vh] flex flex-col overflow-hidden">
        
        {/* Modal Controls Bar (Hidden during printing) */}
        <div className="no-print px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
              TWC
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Print Official Documents (سرکاری پرنٹ سنٹر)</span>
                <span className="text-[11px] font-normal text-emerald-400">· File: {property.fileNumber}</span>
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span>{property.customer.fullName}</span>
                <span aria-hidden="true">·</span>
                <span>{property.title}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Document (پرنٹ کریں)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Selector Bar (Hidden during printing) */}
        <div className="no-print bg-slate-100 border-b border-slate-200 px-6 py-2 flex items-center justify-between overflow-x-auto text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDocType('certificate')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                docType === 'certificate'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. Property Registration Certificate (رجسٹریشن سند)
            </button>

            <button
              onClick={() => setDocType('exchange_agreement')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                docType === 'exchange_agreement'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2. Exchange Agreement Deed (معاہدہ تبادلہ جائیداد)
            </button>

            <button
              onClick={() => setDocType('token_slip')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                docType === 'token_slip'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3. Bayana Token Slip (رسید بیعانہ و امانت)
            </button>
          </div>

          {/* Select Exchange Partner if agreement */}
          {docType === 'exchange_agreement' && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500 whitespace-nowrap">Second Party:</span>
              <select
                value={partnerPropertyId}
                onChange={(e) => setPartnerPropertyId(e.target.value)}
                className="bg-white border border-slate-300 rounded px-2 py-1 text-xs"
              >
                {allProperties
                  .filter(p => p.id !== property.id)
                  .map(p => (
                    <option key={p.id} value={p.id}>
                      {p.fileNumber} - {p.customer.fullName} ({p.city} · {formatPKR(p.demandPKR)})
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>

        {/* Printable Viewport */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-200/50 flex justify-center">
          
          {/* ============================================================== */}
          {/* DOCUMENT 1: PROPERTY REGISTRATION CERTIFICATE                  */}
          {/* ============================================================== */}
          {docType === 'certificate' && (
            <div className="printable-document-container bg-white w-full max-w-[800px] shadow-lg border border-slate-300 p-8 sm:p-10 text-slate-900 relative">
              
              {/* Security Border */}
              <div className="border-4 border-double border-emerald-800 p-6 relative">
                
                {/* Corner Decorative Accents */}
                <div className="absolute top-1 left-1 w-4 h-4 border-t-2 border-l-2 border-amber-600"></div>
                <div className="absolute top-1 right-1 w-4 h-4 border-t-2 border-r-2 border-amber-600"></div>
                <div className="absolute bottom-1 left-1 w-4 h-4 border-b-2 border-l-2 border-amber-600"></div>
                <div className="absolute bottom-1 right-1 w-4 h-4 border-b-2 border-r-2 border-amber-600"></div>

                {/* Header */}
                <div className="text-center pb-4 border-b-2 border-slate-200">
                  <div className="flex items-center justify-center gap-3 mb-1">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-800 to-teal-900 flex items-center justify-center text-white font-extrabold text-xl shadow-md border-2 border-amber-400">
                      TWC
                    </div>
                  </div>
                  <h1 className="text-2xl font-black tracking-tight text-emerald-950 uppercase font-serif">
                    Team Work Complex
                  </h1>
                  <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mt-0.5">
                    Property Exchange & Real Estate Network Pakistan
                  </p>
                  <p className="text-[11px] text-slate-500 font-urdu mt-0.5">
                    پوری پاکستان میں جائیداد کی باضابطہ رجسٹریشن، محفوظ تبادلہ اور شفاف سودے بازی کا بااعتماد ادارہ
                  </p>

                  <div className="mt-3 inline-block bg-emerald-900 text-white px-5 py-1 rounded-sm text-xs font-bold tracking-wider uppercase">
                    Property Registration Certificate (سرٹیفکیٹ رجسٹریشن جائیداد)
                  </div>
                </div>

                {/* Meta details bar */}
                <div className="grid grid-cols-3 gap-2 py-3 border-b border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">FILE REGISTRATION NO.</span>
                    <span className="font-mono font-bold text-slate-900">{property.fileNumber}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-slate-500 block text-[10px]">REGISTRATION DATE</span>
                    <span className="font-medium text-slate-900">{property.registrationDate}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block text-[10px]">DEAL NATURE</span>
                    <span className="font-bold text-emerald-700 uppercase">
                      {property.dealType.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* Section 1: Customer / Owner Particulars */}
                <div className="mt-4">
                  <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider bg-slate-100 px-3 py-1 border-l-4 border-emerald-700 flex justify-between">
                    <span>1. Owner / Client Particulars (کوائفِ مالک جائیداد)</span>
                    <span className="font-mono text-emerald-800">NADRA CNIC VERIFIED</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-slate-50/50 text-xs border border-slate-200 mt-1">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Owner Name (نام مالک):</span>
                      <span className="font-bold text-slate-900">{property.customer.fullName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Father's Name (ولدیت):</span>
                      <span className="font-medium text-slate-900">{property.customer.fatherName || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">CNIC (شناختی کارڈ نمبر):</span>
                      <span className="font-mono font-bold text-slate-900">{property.customer.cnic || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Phone Number (موبائل نمبر):</span>
                      <span className="font-mono text-slate-900">{property.customer.phone}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Resident City (رہائشی شہر):</span>
                      <span className="text-slate-900">{property.customer.city}</span>
                    </div>
                    <div className="sm:col-span-1">
                      <span className="text-slate-500 block text-[10px]">Client Category:</span>
                      <span className="text-slate-900">{property.customer.clientType}</span>
                    </div>
                    <div className="col-span-2 sm:col-span-3">
                      <span className="text-slate-500 block text-[10px]">Permanent Address:</span>
                      <span className="text-slate-800">{property.customer.address}</span>
                    </div>
                  </div>
                </div>

                {/* Section 2: Property Specifications */}
                <div className="mt-4">
                  <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider bg-slate-100 px-3 py-1 border-l-4 border-emerald-700 flex justify-between">
                    <span>2. Property Particulars & Location (تفصیلات و مقامِ جائیداد)</span>
                    <span className="font-medium text-slate-600">{property.category}</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-slate-50/50 text-xs border border-slate-200 mt-1">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Property Type (نوعیت):</span>
                      <span className="font-bold text-slate-900">{property.propertyType}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Size / Dimension (رقبہ):</span>
                      <span className="font-bold text-slate-900">{property.size} {property.unit}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">City (شہر):</span>
                      <span className="font-bold text-emerald-800">{property.city}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Society / Scheme:</span>
                      <span className="text-slate-900">{property.society}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Sector / Block / Plot #:</span>
                      <span className="font-medium text-slate-900">{property.blockSector || '—'} · {property.plotNumber || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Title Document Type:</span>
                      <span className="font-medium text-slate-900">{property.ownershipDocType}</span>
                    </div>
                    <div className="col-span-2 sm:col-span-3">
                      <span className="text-slate-500 block text-[10px]">Full Site Address:</span>
                      <span className="text-slate-900 font-medium">{property.completeAddress}</span>
                    </div>
                  </div>
                </div>

                {/* Section 3: Financials & Exchange Criteria */}
                <div className="mt-4">
                  <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider bg-slate-100 px-3 py-1 border-l-4 border-emerald-700 flex justify-between">
                    <span>3. Official Demand & Exchange Terms (مالیت و تبادلہ ترجیحات)</span>
                    <span className="text-emerald-800 font-bold">{formatPKR(property.demandPKR)}</span>
                  </h3>
                  <div className="p-3 bg-slate-50/50 text-xs border border-slate-200 mt-1 space-y-2">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Official Demand (ڈیمانڈ):</span>
                        <span className="font-bold text-slate-900 text-sm tabular-nums">{formatPKRFull(property.demandPKR)}</span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-slate-500 block text-[10px]">In Urdu Words (بلحاظ الفاظ):</span>
                        <span className="font-urdu font-semibold text-emerald-800 text-[13px]">{formatPKRWordsUrdu(property.demandPKR)}</span>
                      </div>
                    </div>

                    {property.dealType !== 'sale_only' && (
                      <div className="pt-2 border-t border-slate-200 text-slate-700">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <span className="text-slate-500 block text-[10px]">Acceptable Exchange Cities:</span>
                            <span className="font-semibold text-amber-900">{property.exchangePreferences.lookingForCity.join(', ') || 'Any City'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">Cash Difference Policy (بقیہ رقم):</span>
                            <span className="font-semibold text-slate-900 uppercase">{property.exchangePreferences.cashDifferenceOption.replace(/_/g, ' ')}</span>
                          </div>
                        </div>
                        {property.exchangePreferences.specialConditions && (
                          <div className="mt-1.5 text-[11px] bg-amber-50/80 p-1.5 rounded border border-amber-200/60 text-amber-900">
                            <strong>Exchange Note:</strong> {property.exchangePreferences.specialConditions}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Legal Undertaking */}
                <div className="mt-4 p-2.5 bg-slate-50 border border-slate-200 text-[10px] text-slate-600 leading-relaxed">
                  <p className="font-medium text-slate-800">LEGAL DECLARATION & TWC CHARTER:</p>
                  <p>
                    This property has been officially registered with Team Work Complex Exchange Network. All particulars are recorded as declared by the owner/authorized representative. Any exchange agreement or bayana transaction executed through this platform adheres to statutory real estate transfer protocols across Pakistan.
                  </p>
                  <p className="font-urdu text-[11px] text-slate-700 mt-1">
                    یہ سرٹیفکیٹ ٹیم ورک کمپلیکس پراپرٹی ایکسچینج کی جانب سے باضابطہ تصدیق کے بعد جاری کیا گیا ہے۔ فریقین کی باہمی رضامندی اور قانونی تقاضوں کے مطابق تبادلہ یا فروخت کا عمل مکمل کیا جائے گا۔
                  </p>
                </div>

                {/* Signatures & Seal */}
                <div className="mt-8 pt-4 border-t-2 border-slate-200 grid grid-cols-3 gap-4 text-center text-xs">
                  <div>
                    <div className="h-10 border-b border-dashed border-slate-400"></div>
                    <span className="font-bold text-slate-800 block mt-1">Owner / Customer</span>
                    <span className="text-[10px] text-slate-500">دستخط مالک جائیداد</span>
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    <div className="w-14 h-14 rounded-full border-2 border-emerald-700 flex flex-col items-center justify-center text-[8px] font-bold text-emerald-800 uppercase tracking-tighter">
                      <span>OFFICIAL</span>
                      <span>SEAL</span>
                      <span>TWC PAK</span>
                    </div>
                    <span className="text-[9px] text-slate-400 mt-1">Verified Authenticated</span>
                  </div>

                  <div>
                    <div className="h-10 border-b border-dashed border-slate-400"></div>
                    <span className="font-bold text-slate-800 block mt-1">Director / Manager</span>
                    <span className="text-[10px] text-slate-500">ٹیم ورک کمپلیکس مجاز افسر</span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* DOCUMENT 2: PROPERTY EXCHANGE AGREEMENT DEED                   */}
          {/* ============================================================== */}
          {docType === 'exchange_agreement' && (
            <div className="printable-document-container bg-white w-full max-w-[800px] shadow-lg border border-slate-300 p-8 sm:p-10 text-slate-900 relative">
              <div className="border-2 border-slate-800 p-6">
                
                {/* Stamp Paper Style Header */}
                <div className="text-center pb-4 border-b-2 border-slate-900">
                  <div className="text-xs font-bold tracking-widest text-slate-500 uppercase">
                    GOVERNMENT OF PAKISTAN · STAMP DUTY / REAL ESTATE EXCHANGE DEED
                  </div>
                  <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight mt-1 font-serif">
                    معاہدہ اقرار نامہ تبادلہ جائیداد (EXCHANGE DEED)
                  </h1>
                  <p className="text-xs font-semibold text-emerald-800 mt-0.5">
                    Executed Under the Auspices of Team Work Complex Property Exchange Network
                  </p>
                </div>

                {/* Parties Details */}
                <div className="mt-4 space-y-4 text-xs leading-relaxed">
                  
                  {/* Party 1 */}
                  <div className="p-3 bg-slate-50 border border-slate-300 rounded">
                    <span className="font-bold text-emerald-900 text-xs block mb-1">
                      فریق اول (FIRST PARTY - OWNER OF PROPERTY A):
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div><strong>نام:</strong> {property.customer.fullName}</div>
                      <div><strong>ولدیت:</strong> {property.customer.fatherName}</div>
                      <div><strong>شناختی کارڈ:</strong> {property.customer.cnic}</div>
                      <div><strong>موبائل:</strong> {property.customer.phone}</div>
                      <div className="col-span-2">
                        <strong>تفصیل جائیداد فریق اول:</strong> {property.title} ({property.size} {property.unit}, {property.society}, {property.city}) — متفقہ مالیت: {formatPKRFull(property.demandPKR)}
                      </div>
                    </div>
                  </div>

                  {/* Party 2 */}
                  <div className="p-3 bg-slate-50 border border-slate-300 rounded">
                    <span className="font-bold text-amber-900 text-xs block mb-1">
                      فریق دوم (SECOND PARTY - OWNER OF PROPERTY B):
                    </span>
                    {partnerProperty ? (
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div><strong>نام:</strong> {partnerProperty.customer.fullName}</div>
                        <div><strong>ولدیت:</strong> {partnerProperty.customer.fatherName}</div>
                        <div><strong>شناختی کارڈ:</strong> {partnerProperty.customer.cnic}</div>
                        <div><strong>موبائل:</strong> {partnerProperty.customer.phone}</div>
                        <div className="col-span-2">
                          <strong>تفصیل جائیداد فریق دوم:</strong> {partnerProperty.title} ({partnerProperty.size} {partnerProperty.unit}, {partnerProperty.society}, {partnerProperty.city}) — متفقہ مالیت: {formatPKRFull(partnerProperty.demandPKR)}
                        </div>
                      </div>
                    ) : (
                      <div className="text-slate-400 italic">Please select Second Party from the dropdown above</div>
                    )}
                  </div>

                  {/* Terms & Cash Difference Settlement */}
                  <div className="p-3 bg-amber-50/70 border border-amber-300 rounded text-amber-950 font-medium">
                    <span className="font-bold block text-xs mb-1">
                      تصفیہ بقیہ رقم و سر (CASH ADJUSTMENT SETTLEMENT):
                    </span>
                    <p className="text-[11px]">
                      فریقین نے باہمی رضا مندی سے اپنی اپنی مذکورہ بالا جائیدادوں کا تبادلہ طے کیا ہے۔ دونوں جائیدادوں کی مالیت کے فرق کے پیشِ نظر:
                    </p>
                    <div className="my-2 p-2 bg-white rounded border border-amber-300 font-bold text-slate-900 text-xs">
                      {whoPaysDiff} (مبلغ {formatPKRFull(priceDiff)} روپے - {formatPKRWordsUrdu(priceDiff)})
                    </div>
                    <p className="text-[10px] text-amber-900">
                      بقیہ رقم بذریعہ پے آرڈر / بینک ڈرافٹ بوقت ٹرانسفر یا رجسٹری ادا کی جائے گی۔
                    </p>
                  </div>

                  {/* Statutory Clauses */}
                  <div className="text-[10px] text-slate-600 space-y-1.5 font-urdu">
                    <p>
                      ۱۔ دونوں فریقین اقرار کرتے ہیں کہ ان کی متعلقہ جائیداد ہر قسم کے قانونی تنازعہ، حکمِ امتناعی (Stay Order) اور بارِ رہن سے بالکل پاک و صاف ہے۔
                    </p>
                    <p>
                      ۲۔ کسی بھی فریق کی ملکیت میں کوئی سقم نکلنے کی صورت میں وہ ہرجانہ اور ادا شدہ رقم بمعہ سود واپس کرنے کا پابند ہوگا۔
                    </p>
                    <p>
                      ۳۔ یہ معاہدہ ادارہ "ٹیم ورک کمپلیکس" کی ثالثی میں تحریر کیا گیا ہے۔
                    </p>
                  </div>

                  {/* Signature Blocks */}
                  <div className="mt-8 pt-4 border-t border-slate-300 grid grid-cols-4 gap-2 text-center text-[10px]">
                    <div>
                      <div className="h-8 border-b border-dashed border-slate-400"></div>
                      <span className="font-bold text-slate-800 block mt-1">دستخط فریق اول</span>
                      <span>First Party</span>
                    </div>

                    <div>
                      <div className="h-8 border-b border-dashed border-slate-400"></div>
                      <span className="font-bold text-slate-800 block mt-1">دستخط فریق دوم</span>
                      <span>Second Party</span>
                    </div>

                    <div>
                      <div className="h-8 border-b border-dashed border-slate-400"></div>
                      <span className="font-bold text-slate-800 block mt-1">دستخط گواہ شد ۱</span>
                      <span>Witness 1</span>
                    </div>

                    <div>
                      <div className="h-8 border-b border-dashed border-slate-400"></div>
                      <span className="font-bold text-slate-800 block mt-1">ٹیم ورک کمپلیکس ثالث</span>
                      <span>TWC Mediator</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* DOCUMENT 3: TOKEN BAYANA SLIP                                  */}
          {/* ============================================================== */}
          {docType === 'token_slip' && (
            <div className="printable-document-container bg-white w-full max-w-[800px] shadow-lg border border-slate-300 p-8 text-slate-900 space-y-6">
              
              {/* Slip 1: Office Copy */}
              <div className="border border-slate-300 p-5 rounded-lg relative bg-slate-50/30">
                <div className="flex items-center justify-between border-b pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-emerald-900 font-serif">TEAM WORK COMPLEX</span>
                    <span className="text-[10px] text-slate-500">· Property Deal Slip</span>
                  </div>
                  <span className="px-2 py-0.5 bg-slate-800 text-white text-[10px] font-bold rounded">
                    OFFICE RECORD COPY (دفتر کاپی)
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">File No:</span>
                    <span className="font-bold font-mono">{property.fileNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Customer Name:</span>
                    <span className="font-semibold">{property.customer.fullName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">CNIC:</span>
                    <span className="font-mono">{property.customer.cnic}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-slate-500 block">Property Details:</span>
                    <span className="font-medium">{property.title} ({property.city})</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Total Agreed Price:</span>
                    <span className="font-bold text-emerald-800">{formatPKR(property.demandPKR)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Bayana / Token Received:</span>
                    <span className="font-bold text-slate-900 font-mono">
                      {formatPKRFull(property.tokenBayanaPKR || 1000000)}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-slate-500 block">Amount in Words:</span>
                    <span className="font-urdu text-slate-800">
                      {formatPKRWordsUrdu(property.tokenBayanaPKR || 1000000)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-200 flex justify-between text-[10px] text-slate-500">
                  <span>Authorized Officer Sign: _____________________</span>
                  <span>Customer Sign: _____________________</span>
                </div>
              </div>

              {/* Perforated Divider */}
              <div className="flex items-center gap-2 text-slate-400 text-xs my-2">
                <div className="flex-1 border-b border-dashed border-slate-400"></div>
                <span className="text-[10px] uppercase font-mono tracking-wider">✂ Tear Along Dotted Line (کاٹ کر الگ کریں)</span>
                <div className="flex-1 border-b border-dashed border-slate-400"></div>
              </div>

              {/* Slip 2: Customer Copy */}
              <div className="border border-slate-300 p-5 rounded-lg relative bg-white">
                <div className="flex items-center justify-between border-b pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-emerald-900 font-serif">TEAM WORK COMPLEX</span>
                    <span className="text-[10px] text-slate-500">· Official Token Receipt</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-700 text-white text-[10px] font-bold rounded">
                    CUSTOMER RECEIPT COPY (کسٹمر کاپی)
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Receipt / File No:</span>
                    <span className="font-bold font-mono text-emerald-800">{property.fileNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Received From:</span>
                    <span className="font-semibold">{property.customer.fullName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Date of Issue:</span>
                    <span>{new Date().toISOString().slice(0, 10)}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-slate-500 block">Property Earmarked:</span>
                    <span className="font-medium">{property.title} ({property.city})</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Token Amount Received:</span>
                    <span className="font-bold text-emerald-700 font-mono text-sm">
                      {formatPKRFull(property.tokenBayanaPKR || 1000000)}
                    </span>
                  </div>
                  <div className="col-span-3 bg-emerald-50/70 p-2 rounded border border-emerald-200 text-emerald-950 font-urdu text-xs">
                    مبلغ {formatPKRWordsUrdu(property.tokenBayanaPKR || 1000000)} بطور بیعانہ / امانت وصول پائے۔
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-200 flex justify-between text-[10px] text-slate-500">
                  <span>Helpline: +92 300 8451293 · teamworkcomplex@gmail.com</span>
                  <span>Authorized Signature & Stamp: _____________________</span>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
