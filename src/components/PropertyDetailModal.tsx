import React from 'react';
import { 
  X, 
  MapPin, 
  Building2, 
  User, 
  Phone, 
  MessageSquare, 
  Printer, 
  Edit3, 
  ArrowLeftRight, 
  ShieldCheck, 
  CheckCircle2, 
  FileText,
  Calendar,
  Layers,
  Banknote
} from 'lucide-react';
import { PropertyRecord } from '../types/property';
import { formatPKR, formatPKRFull, formatPKRWordsUrdu, formatCNIC } from '../utils/formatters';

interface PropertyDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: PropertyRecord | null;
  onEdit: (prop: PropertyRecord) => void;
  onOpenPrint: (prop: PropertyRecord) => void;
  onOpenExchange: (prop: PropertyRecord) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  isOpen,
  onClose,
  property,
  onEdit,
  onOpenPrint,
  onOpenExchange
}) => {
  if (!isOpen || !property) return null;

  const cleanPhone = property.customer.phone.replace(/\D/g, '').replace(/^0/, '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                {property.fileNumber}
              </span>
              <span className="text-slate-400 text-xs">
                Registered: {property.registrationDate}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              {property.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenPrint(property)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700">
          
          {/* Key Financial & Location Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Demand (ڈیمانڈ)</span>
              <span className="text-xl font-extrabold text-emerald-800 tabular-nums">
                {formatPKR(property.demandPKR)}
              </span>
              <span className="text-[11px] text-slate-500 block font-urdu mt-0.5">
                {formatPKRWordsUrdu(property.demandPKR)}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Size & Category</span>
              <span className="text-base font-bold text-slate-900 block">
                {property.size} {property.unit}
              </span>
              <span className="text-slate-500 text-[11px]">
                {property.propertyType} ({property.category})
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Location</span>
              <span className="text-base font-bold text-slate-900 block">
                {property.city}
              </span>
              <span className="text-slate-500 text-[11px] truncate block">
                {property.society}
              </span>
            </div>
          </div>

          {/* Section: Customer / Owner Records */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center justify-between border-b pb-2">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-sky-600" />
                <span>Customer & Ownership Identity (کوائفِ مالک)</span>
              </span>
              <span className="text-[11px] text-sky-700 font-semibold bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                {property.customer.clientType}
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Full Name:</span>
                <span className="font-bold text-slate-900">{property.customer.fullName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Father / Husband Name:</span>
                <span className="font-medium text-slate-800">{property.customer.fatherName || '—'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">CNIC:</span>
                <span className="font-mono font-bold text-slate-900">{property.customer.cnic || '—'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Phone:</span>
                <span className="font-mono font-bold text-slate-900">{property.customer.phone}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Resident City:</span>
                <span className="font-medium text-slate-800">{property.customer.city}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">WhatsApp:</span>
                <span className="font-mono font-medium text-slate-800">{property.customer.whatsapp || property.customer.phone}</span>
              </div>
              <div className="sm:col-span-3">
                <span className="text-[10px] text-slate-400 uppercase block">Address:</span>
                <span className="text-slate-800">{property.customer.address}</span>
              </div>
            </div>

            {/* Quick Contact buttons */}
            <div className="pt-2 flex items-center gap-2">
              <a
                href={`tel:${property.customer.phone}`}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-slate-600" />
                <span>Call Client</span>
              </a>
              <a
                href={`https://wa.me/92${cleanPhone}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Section: Exchange Specifications */}
          {property.dealType !== 'sale_only' ? (
            <div className="border border-amber-200 bg-amber-50/30 rounded-xl p-4 space-y-3">
              <h3 className="font-bold text-amber-950 text-sm flex items-center gap-1.5 border-b border-amber-200 pb-2">
                <ArrowLeftRight className="w-4 h-4 text-amber-600" />
                <span>Exchange Preferences & Demands (تبادلہ کی شرائط)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Acceptable Cities:</span>
                  <span className="font-bold text-slate-900">
                    {property.exchangePreferences.lookingForCity.join(', ') || 'Any City in Pakistan'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Desired Property Size / Type:</span>
                  <span className="font-bold text-slate-900">
                    {property.exchangePreferences.lookingForSize || 'Flexible'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Cash Difference Option:</span>
                  <span className="font-bold text-amber-900 uppercase">
                    {property.exchangePreferences.cashDifferenceOption.replace(/_/g, ' ')}
                  </span>
                </div>
                {property.exchangePreferences.approxDifferencePKR > 0 && (
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Estimated Difference Amount:</span>
                    <span className="font-mono font-bold text-slate-900 tabular-nums">
                      {formatPKR(property.exchangePreferences.approxDifferencePKR)}
                    </span>
                  </div>
                )}
              </div>

              {property.exchangePreferences.specialConditions && (
                <div className="p-2 bg-white rounded border border-amber-200 text-xs text-amber-900">
                  <strong>Notes:</strong> {property.exchangePreferences.specialConditions}
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600">
              This property is currently listed exclusively for Direct Cash Sale.
            </div>
          )}

          {/* Section: Legal Title & Verification */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 border-b pb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Ownership Title & Documentation (ملکیت و تصدیق)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Title Document:</span>
                <span className="font-semibold text-slate-900">{property.ownershipDocType}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Possession Status:</span>
                <span className="font-semibold text-slate-900">{property.possessionStatus}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Tax Status:</span>
                <span className="font-semibold text-emerald-700">
                  {property.taxPaid ? '✓ FBR / TMA Taxes Clear' : 'Dues Pending'}
                </span>
              </div>
            </div>

            {/* Features */}
            {property.features && property.features.length > 0 && (
              <div className="pt-2">
                <span className="text-[10px] text-slate-400 uppercase block mb-1">Key Features:</span>
                <div className="flex flex-wrap gap-1.5">
                  {property.features.map(f => (
                    <span key={f} className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded text-[11px] font-medium border border-emerald-200/60">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {property.notes && (
              <div className="pt-2 text-slate-600">
                <span className="text-[10px] text-slate-400 uppercase block">Office Notes:</span>
                <p className="mt-0.5 italic">{property.notes}</p>
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => onEdit(property)}
            className="px-4 py-2 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Record (ترمیم کریں)</span>
          </button>

          <div className="flex items-center gap-2">
            {property.dealType !== 'sale_only' && (
              <button
                onClick={() => {
                  onClose();
                  onOpenExchange(property);
                }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>Find Exchange Matches</span>
              </button>
            )}

            <button
              onClick={() => onOpenPrint(property)}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official Certificate</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
