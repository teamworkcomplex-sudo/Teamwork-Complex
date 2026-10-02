import React from 'react';
import { 
  Building2, 
  MapPin, 
  ArrowLeftRight, 
  Printer, 
  Edit3, 
  Trash2, 
  ExternalLink,
  CheckCircle2,
  Clock,
  Check,
  Tag
} from 'lucide-react';
import { PropertyRecord } from '../types/property';
import { formatPKR, formatCNIC } from '../utils/formatters';

interface PropertyTableViewProps {
  properties: PropertyRecord[];
  onOpenDetails: (prop: PropertyRecord) => void;
  onEdit: (prop: PropertyRecord) => void;
  onOpenPrint: (prop: PropertyRecord) => void;
  onOpenExchange: (prop: PropertyRecord) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: PropertyRecord['status']) => void;
}

export const PropertyTableView: React.FC<PropertyTableViewProps> = ({
  properties,
  onOpenDetails,
  onEdit,
  onOpenPrint,
  onOpenExchange,
  onDelete,
  onStatusChange
}) => {
  const getStatusBadge = (status: PropertyRecord['status']) => {
    switch (status) {
      case 'available':
        return <span className="text-emerald-700 font-semibold text-xs">Available (دستیاب)</span>;
      case 'in_exchange':
        return <span className="text-amber-700 font-semibold text-xs">In Exchange (زیرِ تبادلہ)</span>;
      case 'exchanged':
        return <span className="text-indigo-700 font-semibold text-xs">Exchanged (تبادلہ شدہ)</span>;
      case 'sold':
        return <span className="text-slate-500 font-semibold text-xs">Sold (فروخت)</span>;
      case 'reserved':
        return <span className="text-purple-700 font-semibold text-xs">Reserved (بک شدہ)</span>;
      default:
        return <span>{status}</span>;
    }
  };

  const getDealTypeLabel = (dealType: PropertyRecord['dealType']) => {
    switch (dealType) {
      case 'exchange_only':
        return <span className="text-amber-700 font-medium">Exchange Only</span>;
      case 'sale_or_exchange':
        return <span className="text-emerald-700 font-medium">Sale or Exchange</span>;
      case 'sale_only':
        return <span className="text-sky-700 font-medium">Cash Sale</span>;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">File / Reg #</th>
              <th className="py-3 px-4">Property & Location</th>
              <th className="py-3 px-4">Size & Type</th>
              <th className="py-3 px-4">Demand (PKR)</th>
              <th className="py-3 px-4">Deal Nature</th>
              <th className="py-3 px-4">Customer / Owner</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions (اقدامات)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {properties.map((prop) => (
              <tr 
                key={prop.id} 
                className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                onClick={() => onOpenDetails(prop)}
              >
                {/* File Number & Date */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="font-mono font-bold text-slate-900 group-hover:text-emerald-700 transition-colors block">
                    {prop.fileNumber}
                  </span>
                  <span className="text-[11px] text-slate-400 tabular-nums">
                    {prop.registrationDate}
                  </span>
                </td>

                {/* Title & Society */}
                <td className="py-3.5 px-4 max-w-xs">
                  <div className="font-bold text-slate-900 truncate">
                    {prop.title}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{prop.society}, {prop.city}</span>
                    {prop.plotNumber && <span>· {prop.plotNumber}</span>}
                  </div>
                </td>

                {/* Size & Type */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="font-bold text-slate-800 tabular-nums block">
                    {prop.size} {prop.unit}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {prop.propertyType.split(' ')[0]}
                  </span>
                </td>

                {/* Demand */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="font-extrabold text-emerald-800 tabular-nums text-sm block">
                    {formatPKR(prop.demandPKR)}
                  </span>
                  <span className="text-[10px] text-slate-400 tabular-nums">
                    Rs. {prop.demandPKR.toLocaleString('en-PK')}
                  </span>
                </td>

                {/* Deal Nature */}
                <td className="py-3.5 px-4 whitespace-nowrap text-[11px]">
                  {getDealTypeLabel(prop.dealType)}
                  {prop.dealType !== 'sale_only' && prop.exchangePreferences.lookingForCity.length > 0 && (
                    <div className="text-[10px] text-slate-400 truncate max-w-[130px]">
                      Wants: {prop.exchangePreferences.lookingForCity.join(', ')}
                    </div>
                  )}
                </td>

                {/* Customer Details */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="font-semibold text-slate-900 block">
                    {prop.customer.fullName}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {prop.customer.phone}
                  </span>
                </td>

                {/* Status selector */}
                <td className="py-3.5 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <select
                    value={prop.status}
                    onChange={(e) => onStatusChange(prop.id, e.target.value as PropertyRecord['status'])}
                    className="text-xs py-1 px-2 rounded-lg border border-slate-200 bg-white font-medium focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="available">Available (دستیاب)</option>
                    <option value="in_exchange">In Exchange (زیرِ تبادلہ)</option>
                    <option value="exchanged">Exchanged (تبادلہ شدہ)</option>
                    <option value="sold">Sold (فروخت شدہ)</option>
                    <option value="reserved">Reserved (بک شدہ)</option>
                  </select>
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1.5">
                    
                    {/* Print Certificate button */}
                    <button
                      onClick={() => onOpenPrint(prop)}
                      title="Print Certificate / Agreement"
                      className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Printer className="w-4 h-4" />
                    </button>

                    {/* Exchange Match button */}
                    {prop.dealType !== 'sale_only' && (
                      <button
                        onClick={() => onOpenExchange(prop)}
                        title="Find Exchange Matches in Pakistan"
                        className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <ArrowLeftRight className="w-4 h-4" />
                      </button>
                    )}

                    {/* Edit button */}
                    <button
                      onClick={() => onEdit(prop)}
                      title="Edit Record"
                      className="p-1.5 text-slate-600 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete property file ${prop.fileNumber}?`)) {
                          onDelete(prop.id);
                        }
                      }}
                      title="Delete Record"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
