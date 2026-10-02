import React from 'react';
import { Building2, ArrowLeftRight, Coins, Users, ShieldCheck, MapPin } from 'lucide-react';
import { PropertyRecord } from '../types/property';
import { formatPKR } from '../utils/formatters';

interface StatsCardsProps {
  properties: PropertyRecord[];
  onFilterByStatus?: (status: string) => void;
  onFilterByDealType?: (dealType: string) => void;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  properties,
  onFilterByStatus,
  onFilterByDealType
}) => {
  const totalProperties = properties.length;
  const exchangeDeals = properties.filter(p => p.dealType === 'exchange_only' || p.dealType === 'sale_or_exchange').length;
  const directSales = properties.filter(p => p.dealType === 'sale_only').length;
  const totalValuation = properties.reduce((acc, p) => acc + (p.demandPKR || 0), 0);
  
  // Unique customers based on CNIC or Phone
  const uniqueCustomers = new Set(properties.map(p => p.customer.cnic || p.customer.phone)).size;
  
  // Unique cities
  const uniqueCities = new Set(properties.map(p => p.city)).size;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-6">
      
      {/* Total Registered */}
      <div 
        onClick={() => onFilterByStatus && onFilterByStatus('all')}
        className="bg-white border border-slate-200/90 rounded-xl p-3.5 hover:border-slate-300 transition-all cursor-pointer shadow-xs"
      >
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Total Listings</span>
          <Building2 className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
          {totalProperties}
        </div>
        <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
          <span>{uniqueCities} Major Cities</span>
          <span aria-hidden="true">·</span>
          <span>پوری پاکستان</span>
        </div>
      </div>

      {/* Exchange Deals */}
      <div 
        onClick={() => onFilterByDealType && onFilterByDealType('exchange')}
        className="bg-white border border-slate-200/90 rounded-xl p-3.5 hover:border-amber-300 transition-all cursor-pointer shadow-xs"
      >
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Exchange Pool</span>
          <ArrowLeftRight className="w-4 h-4 text-amber-600" />
        </div>
        <div className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
          {exchangeDeals}
        </div>
        <div className="text-[11px] text-amber-700 font-medium mt-1">
          تبادلہ کیلئے دستیاب (Direct & Cash Diff)
        </div>
      </div>

      {/* Direct Sale */}
      <div 
        onClick={() => onFilterByDealType && onFilterByDealType('sale_only')}
        className="bg-white border border-slate-200/90 rounded-xl p-3.5 hover:border-sky-300 transition-all cursor-pointer shadow-xs"
      >
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Cash Sale</span>
          <Coins className="w-4 h-4 text-sky-600" />
        </div>
        <div className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
          {directSales}
        </div>
        <div className="text-[11px] text-slate-500 mt-1">
          صرف نقد فروخت / فوری کیش
        </div>
      </div>

      {/* Total Valuation */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-xs">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Portfolio Value</span>
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="text-xl font-bold tracking-tight text-emerald-700 tabular-nums truncate">
          {formatPKR(totalValuation)}
        </div>
        <div className="text-[11px] text-slate-500 mt-1">
          مجموعی مالیت جائیداد
        </div>
      </div>

      {/* Active Clients */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-xs col-span-2 md:col-span-1">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Client Base</span>
          <Users className="w-4 h-4 text-indigo-600" />
        </div>
        <div className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
          {uniqueCustomers}
        </div>
        <div className="text-[11px] text-slate-500 mt-1">
          رجسٹرڈ گاہک و مالکان (CNIC Verified)
        </div>
      </div>

    </div>
  );
};
