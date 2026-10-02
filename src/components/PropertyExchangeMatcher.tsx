import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  MapPin, 
  Building2, 
  User, 
  Phone, 
  MessageSquare, 
  Printer, 
  Sparkles, 
  Check, 
  DollarSign,
  TrendingUp,
  FileText
} from 'lucide-react';
import { PropertyRecord, ExchangeMatch } from '../types/property';
import { formatPKR, formatPKRFull, formatPKRWordsUrdu } from '../utils/formatters';

interface PropertyExchangeMatcherProps {
  properties: PropertyRecord[];
  onOpenPrint: (prop: PropertyRecord) => void;
  onOpenDetails: (prop: PropertyRecord) => void;
}

export const PropertyExchangeMatcher: React.FC<PropertyExchangeMatcherProps> = ({
  properties,
  onOpenPrint,
  onOpenDetails
}) => {
  // Select active source property to match against
  const exchangeEligible = properties.filter(p => p.dealType !== 'sale_only');
  const [selectedPropId, setSelectedPropId] = useState<string>(
    exchangeEligible.length > 0 ? exchangeEligible[0].id : (properties[0]?.id || '')
  );

  const selectedProperty = properties.find(p => p.id === selectedPropId);

  // Match calculation algorithm
  const calculateMatches = (base: PropertyRecord): ExchangeMatch[] => {
    const candidates = properties.filter(p => p.id !== base.id && p.dealType !== 'sale_only');
    
    return candidates.map(candidate => {
      let score = 50; // base score
      const reasons: string[] = [];

      // 1. City cross-matching
      const baseWantsCandidateCity = base.exchangePreferences.lookingForCity.some(
        c => c.toLowerCase() === candidate.city.toLowerCase()
      );
      const candidateWantsBaseCity = candidate.exchangePreferences.lookingForCity.some(
        c => c.toLowerCase() === base.city.toLowerCase()
      );

      if (baseWantsCandidateCity && candidateWantsBaseCity) {
        score += 35;
        reasons.push(`Perfect Mutual City Match: ${base.city} ⇄ ${candidate.city}`);
      } else if (baseWantsCandidateCity) {
        score += 20;
        reasons.push(`Target City Available: Located in ${candidate.city}`);
      } else if (candidateWantsBaseCity) {
        score += 15;
        reasons.push(`Candidate owner specifically wants property in ${base.city}`);
      }

      // 2. Valuation proximity
      const diff = base.demandPKR - candidate.demandPKR;
      const absDiff = Math.abs(diff);
      const ratio = absDiff / Math.max(base.demandPKR, candidate.demandPKR);

      if (ratio <= 0.15) {
        score += 20;
        reasons.push(`Close Budget Match: Under 15% price delta`);
      } else if (ratio <= 0.35) {
        score += 10;
        reasons.push(`Manageable Cash Difference of ${formatPKR(absDiff)}`);
      }

      // 3. Property Type matching
      const baseWantsType = base.exchangePreferences.lookingForPropertyType.some(
        t => candidate.propertyType.includes(t.split(' ')[0])
      );
      if (baseWantsType) {
        score += 10;
        reasons.push(`Property type matches desired criteria`);
      }

      const cappedScore = Math.min(Math.round(score), 98);

      let direction: 'current_pays' | 'candidate_pays' | 'even_trade' = 'even_trade';
      if (diff > 0) {
        direction = 'candidate_pays';
      } else if (diff < 0) {
        direction = 'current_pays';
      }

      return {
        candidateProperty: candidate,
        matchScore: cappedScore,
        reasons,
        cashDifference: absDiff,
        direction
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  };

  const matches = selectedProperty ? calculateMatches(selectedProperty) : [];

  return (
    <div className="space-y-6">
      
      {/* Banner / Introduction */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-2xl p-6 text-white border border-emerald-900/40 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <ArrowLeftRight className="w-4 h-4" />
            <span>Exchange Intelligence Engine (تبادلہ میچنگ سسٹم)</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Smart Property Exchange Matcher
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 leading-relaxed">
            Select any registered property in Pakistan to instantly calculate matching exchange opportunities, evaluate price delta adjustments (بقیہ رقم), and generate bilateral legal deeds for your clients.
          </p>
        </div>
      </div>

      {/* Selector & Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Select Base Property (4 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Select Property to Match (تبادلہ کیلئے جائیداد منتخب کریں)
            </label>
            <select
              value={selectedPropId}
              onChange={(e) => setSelectedPropId(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none mb-4"
            >
              {properties.map(p => (
                <option key={p.id} value={p.id}>
                  {p.fileNumber} · {p.city} - {p.title.slice(0, 38)}... ({formatPKR(p.demandPKR)})
                </option>
              ))}
            </select>

            {/* Selected Property Spotlight Card */}
            {selectedProperty && (
              <div className="border border-emerald-200 bg-emerald-50/40 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    {selectedProperty.fileNumber}
                  </span>
                  <span className="text-xs font-bold text-slate-900 tabular-nums">
                    {formatPKR(selectedProperty.demandPKR)}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900">{selectedProperty.title}</h4>
                  <div className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>{selectedProperty.society}, {selectedProperty.city}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-semibold">{selectedProperty.size} {selectedProperty.unit}</span>
                  </div>
                </div>

                {/* Owner info */}
                <div className="pt-2 border-t border-emerald-200/70 text-xs flex items-center justify-between text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span className="font-semibold">{selectedProperty.customer.fullName}</span>
                  </div>
                  <a
                    href={`https://wa.me/92${selectedProperty.customer.phone.replace(/\D/g, '').replace(/^0/, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                {/* Exchange Wants */}
                <div className="pt-2 border-t border-emerald-200/70 text-xs space-y-1">
                  <span className="text-[11px] text-slate-500 font-semibold uppercase block">
                    Client's Exchange Requirement (مطلوبہ تبادلہ):
                  </span>
                  <div className="flex flex-wrap gap-1 text-[11px]">
                    <span className="bg-white border border-slate-200 px-2 py-0.5 rounded font-medium text-slate-800">
                      City: {selectedProperty.exchangePreferences.lookingForCity.join(', ') || 'Any'}
                    </span>
                    <span className="bg-white border border-slate-200 px-2 py-0.5 rounded font-medium text-slate-800">
                      Size: {selectedProperty.exchangePreferences.lookingForSize}
                    </span>
                  </div>
                  <div className="text-[11px] text-amber-800 font-medium">
                    Cash Adjustment: {selectedProperty.exchangePreferences.cashDifferenceOption.replace(/_/g, ' ')}
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => onOpenDetails(selectedProperty)}
                    className="flex-1 py-1.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    View Record Details
                  </button>
                  <button
                    onClick={() => onOpenPrint(selectedProperty)}
                    className="py-1.5 px-3 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Computed Matches across Pakistan (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>Potential Exchange Matches Across Pakistan</span>
              <span className="px-2 py-0.5 bg-slate-200 text-slate-800 rounded-full text-xs font-semibold tabular-nums">
                {matches.length} Candidates
              </span>
            </h3>
            <span className="text-xs text-slate-500">Sorted by compatibility</span>
          </div>

          {matches.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-500">
              <Building2 className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-700">No other exchange listings available</p>
              <p className="text-xs text-slate-400 mt-1">Register more properties in different cities to generate automated matches.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {matches.map((match) => {
                const candidate = match.candidateProperty;
                const isHighMatch = match.matchScore >= 80;

                return (
                  <div
                    key={candidate.id}
                    className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-4 transition-all shadow-xs space-y-3"
                  >
                    {/* Top Row: Score & Basic Info */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-700">
                            {candidate.fileNumber}
                          </span>
                          <span className="text-slate-400">·</span>
                          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                            {candidate.city}
                          </span>
                          <span className="text-xs text-slate-500">
                            {candidate.size} {candidate.unit} {candidate.propertyType.split(' ')[0]}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 mt-1">
                          {candidate.title}
                        </h4>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {candidate.society} · Owner: <strong>{candidate.customer.fullName}</strong>
                        </div>
                      </div>

                      {/* Compatibility Badge */}
                      <div className="text-right shrink-0">
                        <div className={`text-base font-black tabular-nums ${
                          isHighMatch ? 'text-emerald-600' : 'text-amber-600'
                        }`}>
                          {match.matchScore}%
                        </div>
                        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          Match Score
                        </div>
                      </div>
                    </div>

                    {/* Reasons & Price Delta Bar */}
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 space-y-2 text-xs">
                      {/* Reason items */}
                      <div className="flex flex-wrap gap-1.5">
                        {match.reasons.map((r, i) => (
                          <span key={i} className="text-[11px] bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>{r}</span>
                          </span>
                        ))}
                      </div>

                      {/* Cash Adjustment Calculation */}
                      <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                        <div className="text-slate-600">
                          <span>Demand: </span>
                          <span className="font-bold text-slate-900 tabular-nums">{formatPKR(candidate.demandPKR)}</span>
                          <span className="text-slate-400 mx-1">vs</span>
                          <span className="font-bold text-slate-900 tabular-nums">{formatPKR(selectedProperty?.demandPKR || 0)}</span>
                        </div>

                        <div className="font-semibold">
                          {match.direction === 'even_trade' ? (
                            <span className="text-emerald-700">✓ Equal Value Exchange (برابر سودا)</span>
                          ) : match.direction === 'candidate_pays' ? (
                            <span className="text-amber-800">
                              Second Party Pays: <strong>{formatPKR(match.cashDifference)}</strong> (بقیہ رقم)
                            </span>
                          ) : (
                            <span className="text-sky-800">
                              First Party Pays: <strong>{formatPKR(match.cashDifference)}</strong> (بقیہ رقم)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${candidate.customer.phone}`}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3 text-slate-500" />
                          <span>Call Owner</span>
                        </a>
                        <a
                          href={`https://wa.me/92${candidate.customer.phone.replace(/\D/g, '').replace(/^0/, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg font-medium transition-colors flex items-center gap-1 border border-emerald-200"
                        >
                          <MessageSquare className="w-3 h-3 text-emerald-600" />
                          <span>WhatsApp Deal</span>
                        </a>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onOpenDetails(candidate)}
                          className="px-2.5 py-1.5 text-slate-600 hover:text-slate-900 font-medium transition-colors cursor-pointer"
                        >
                          Inspect Details
                        </button>
                        <button
                          onClick={() => onOpenPrint(selectedProperty!)}
                          className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-amber-400" />
                          <span>Generate Exchange Agreement Deed</span>
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
