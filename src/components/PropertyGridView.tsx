import React from 'react';
import { 
  Building2, 
  MapPin, 
  ArrowLeftRight, 
  Printer, 
  Edit3, 
  Trash2, 
  Phone,
  MessageSquare,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { PropertyRecord } from '../types/property';
import { formatPKR, formatPKRWordsUrdu } from '../utils/formatters';

interface PropertyGridViewProps {
  properties: PropertyRecord[];
  onOpenDetails: (prop: PropertyRecord) => void;
  onEdit: (prop: PropertyRecord) => void;
  onOpenPrint: (prop: PropertyRecord) => void;
  onOpenExchange: (prop: PropertyRecord) => void;
  onDelete: (id: string) => void;
}

export const PropertyGridView: React.FC<PropertyGridViewProps> = ({
  properties,
  onOpenDetails,
  onEdit,
  onOpenPrint,
  onOpenExchange,
  onDelete
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {properties.map((prop) => {
        const cleanPhone = prop.customer.phone.replace(/\D/g, '').replace(/^0/, '');
        const isExchangeEligible = prop.dealType !== 'sale_only';

        return (
          <div
            key={prop.id}
            className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl p-5 shadow-xs transition-all hover:shadow-md flex flex-col justify-between group"
          >
            <div>
              {/* Header: File Number & Status */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                  {prop.fileNumber}
                </span>

                <div className="flex items-center gap-1.5 text-xs">
                  {prop.dealType === 'exchange_only' && (
                    <span className="text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Exchange Only (صرف تبادلہ)
                    </span>
                  )}
                  {prop.dealType === 'sale_or_exchange' && (
                    <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Sale / Exchange
                    </span>
                  )}
                  {prop.dealType === 'sale_only' && (
                    <span className="text-sky-700 font-semibold bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                      Direct Cash Sale
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Location */}
              <h3 
                onClick={() => onOpenDetails(prop)}
                className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors cursor-pointer line-clamp-2"
              >
                {prop.title}
              </h3>

              <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-medium text-slate-800">{prop.society}, {prop.city}</span>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-slate-900">{prop.size} {prop.unit}</span>
              </div>

              {/* Valuation Banner */}
              <div className="mt-3.5 bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Demand (ڈیمانڈ)</span>
                  <span className="text-lg font-extrabold text-emerald-800 tabular-nums">
                    {formatPKR(prop.demandPKR)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Urdu Equivalent</span>
                  <span className="font-urdu text-xs text-slate-700">
                    {formatPKRWordsUrdu(prop.demandPKR)}
                  </span>
                </div>
              </div>

              {/* Exchange Criteria Tag (if applicable) */}
              {isExchangeEligible && (
                <div className="mt-3 text-xs bg-amber-50/60 border border-amber-200/80 p-2.5 rounded-xl text-amber-900">
                  <div className="flex items-center gap-1 font-bold text-[11px] mb-1">
                    <ArrowLeftRight className="w-3.5 h-3.5 text-amber-600" />
                    <span>Wants Exchange In:</span>
                  </div>
                  <div className="text-[11px] text-slate-700 font-medium truncate">
                    {prop.exchangePreferences.lookingForCity.join(', ') || 'Any City in Pakistan'}
                    {prop.exchangePreferences.lookingForSize && ` (${prop.exchangePreferences.lookingForSize})`}
                  </div>
                </div>
              )}

              {/* Customer summary */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <div>
                  <span className="text-slate-400 block text-[10px]">Owner / Client:</span>
                  <span className="font-semibold text-slate-900">{prop.customer.fullName}</span>
                </div>
                <div className="text-right font-mono text-[11px]">
                  <span>{prop.customer.phone}</span>
                </div>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-1">
                <a
                  href={`tel:${prop.customer.phone}`}
                  title="Call Customer"
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Phone className="w-4 h-4" />
                </a>
                <a
                  href={`https://wa.me/92${cleanPhone}`}
                  target="_blank"
                  rel="noreferrer"
                  title="WhatsApp Customer"
                  className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
              </div>

              <div className="flex items-center gap-1.5">
                {isExchangeEligible && (
                  <button
                    onClick={() => onOpenExchange(prop)}
                    title="Find Matching Deals"
                    className="p-2 text-amber-700 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => onOpenPrint(prop)}
                  title="Print Certificate"
                  className="p-2 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onEdit(prop)}
                  title="Edit Record"
                  className="p-2 text-slate-600 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    if (window.confirm(`Delete property ${prop.fileNumber}?`)) {
                      onDelete(prop.id);
                    }
                  }}
                  title="Delete Record"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
};
