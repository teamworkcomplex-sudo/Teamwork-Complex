import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Phone, 
  MessageSquare, 
  Building2, 
  MapPin, 
  FileText, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { PropertyRecord, Customer } from '../types/property';
import { formatPKR, formatCNIC } from '../utils/formatters';

interface CustomerDirectoryProps {
  properties: PropertyRecord[];
  onSelectProperty: (prop: PropertyRecord) => void;
  onOpenPrint: (prop: PropertyRecord) => void;
}

interface CustomerGroup {
  customer: Customer;
  properties: PropertyRecord[];
  totalValuation: number;
}

export const CustomerDirectory: React.FC<CustomerDirectoryProps> = ({
  properties,
  onSelectProperty,
  onOpenPrint
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');

  // Aggregate by CNIC or Phone
  const customerMap = new Map<string, CustomerGroup>();

  properties.forEach(prop => {
    const key = prop.customer.cnic || prop.customer.phone || prop.customer.fullName;
    if (!customerMap.has(key)) {
      customerMap.set(key, {
        customer: prop.customer,
        properties: [prop],
        totalValuation: prop.demandPKR || 0
      });
    } else {
      const existing = customerMap.get(key)!;
      existing.properties.push(prop);
      existing.totalValuation += (prop.demandPKR || 0);
    }
  });

  const customerList = Array.from(customerMap.values());

  const filteredCustomers = customerList.filter(group => {
    const c = group.customer;
    const query = searchQuery.toLowerCase();
    const matchesQuery = 
      c.fullName.toLowerCase().includes(query) ||
      (c.fatherName && c.fatherName.toLowerCase().includes(query)) ||
      (c.cnic && c.cnic.includes(query)) ||
      c.phone.includes(query) ||
      (c.city && c.city.toLowerCase().includes(query));

    const matchesCity = selectedCity === 'All' || c.city === selectedCity;

    return matchesQuery && matchesCity;
  });

  return (
    <div className="space-y-6">
      
      {/* Title & Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-sky-600" />
            <span>Customer & Property Owner Directory (کسٹمر ڈائریکٹری)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified CNIC client files, registered real estate portfolios, and direct communication logs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Name, CNIC, Phone..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-sky-500 focus:outline-none"
            />
          </div>

          {/* City Filter */}
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-sky-500 focus:outline-none"
          >
            <option value="All">All Resident Cities</option>
            <option value="Lahore">Lahore</option>
            <option value="Islamabad">Islamabad</option>
            <option value="Rawalpindi">Rawalpindi</option>
            <option value="Karachi">Karachi</option>
            <option value="Faisalabad">Faisalabad</option>
            <option value="Multan">Multan</option>
          </select>
        </div>
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map(group => {
          const c = group.customer;
          const cleanPhone = c.phone.replace(/\D/g, '').replace(/^0/, '');
          
          return (
            <div 
              key={c.cnic || c.phone} 
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{c.fullName}</h3>
                    {c.fatherName && (
                      <p className="text-xs text-slate-500 font-medium">S/O {c.fatherName}</p>
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                    {c.clientType}
                  </span>
                </div>

                {/* Identity details */}
                <div className="mt-3.5 space-y-1.5 text-xs text-slate-600 bg-slate-50/70 p-3 rounded-xl border border-slate-200/80">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">CNIC:</span>
                    <span className="font-mono font-semibold text-slate-900">{c.cnic || 'Not Specified'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Mobile:</span>
                    <span className="font-mono font-semibold text-slate-900">{c.phone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">City / Location:</span>
                    <span className="font-medium text-slate-800">{c.city}</span>
                  </div>
                  <div className="pt-1 text-[11px] text-slate-500 truncate">
                    {c.address}
                  </div>
                </div>

                {/* Registered Properties under this customer */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Properties Registered ({group.properties.length})</span>
                    </span>
                    <span className="text-emerald-700 font-bold tabular-nums">
                      {formatPKR(group.totalValuation)}
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-32 overflow-y-auto">
                    {group.properties.map(p => (
                      <div 
                        key={p.id}
                        onClick={() => onSelectProperty(p)}
                        className="p-2 bg-slate-50 hover:bg-emerald-50/60 rounded-lg text-xs cursor-pointer border border-slate-100 transition-colors flex items-center justify-between"
                      >
                        <div className="truncate mr-2">
                          <span className="font-mono font-bold text-[10px] text-slate-500 mr-1.5">{p.fileNumber}</span>
                          <span className="font-medium text-slate-800">{p.title}</span>
                        </div>
                        <span className="text-emerald-800 font-bold shrink-0 text-[11px] tabular-nums">
                          {formatPKR(p.demandPKR)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <a
                  href={`tel:${c.phone}`}
                  className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>Call</span>
                </a>

                <a
                  href={`https://wa.me/92${cleanPhone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>

                <button
                  onClick={() => onOpenPrint(group.properties[0])}
                  title="Print Customer Dossier Slip"
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
