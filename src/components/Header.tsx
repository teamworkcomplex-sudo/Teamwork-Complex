import React, { useRef } from 'react';
import { 
  Building2, 
  ArrowLeftRight, 
  Plus, 
  FileText, 
  Users, 
  Download, 
  Upload, 
  RotateCcw,
  Printer
} from 'lucide-react';
import { PropertyRecord } from '../types/property';

interface HeaderProps {
  activeTab: 'properties' | 'exchange' | 'customers' | 'print-center';
  setActiveTab: (tab: 'properties' | 'exchange' | 'customers' | 'print-center') => void;
  onOpenRegister: () => void;
  properties: PropertyRecord[];
  onImportData: (data: PropertyRecord[]) => void;
  onResetData: () => void;
  selectedPropertyForPrint: PropertyRecord | null;
  onOpenPrint: (prop: PropertyRecord) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenRegister,
  properties,
  onImportData,
  onResetData,
  selectedPropertyForPrint,
  onOpenPrint
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(properties, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `teamwork-complex-properties-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            onImportData(parsed);
          } else {
            alert('Invalid backup file format');
          }
        } catch {
          alert('Error parsing JSON backup file');
        }
      };
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      {/* Main Bar complying with Top Bar Contract: Zone 1 (Brand) - Zone 2 (4-5 Nav Links) - Zone 3 (Actions) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark with brand styling */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-inner border border-emerald-400/30 text-white font-bold text-lg tracking-wider">
            TWC
          </div>
          <div className="flex flex-col">
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); setActiveTab('properties'); }}
              className="text-lg font-bold tracking-tight text-white hover:text-emerald-400 transition-colors whitespace-nowrap"
            >
              Team Work Complex
            </a>
            <span className="text-[11px] text-emerald-400 font-medium tracking-wide">
              Property Exchange Network · Pakistan
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Clean single-line text links with active indicator) */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => setActiveTab('properties')}
            className={`px-3 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'properties'
                ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>Property Registry ({properties.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('exchange')}
            className={`px-3 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'exchange'
                ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ArrowLeftRight className="w-4 h-4 text-amber-400" />
            <span>Exchange Matcher (تبادلہ)</span>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`px-3 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'customers'
                ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-4 h-4 text-sky-400" />
            <span>Customer Dossier (گاہک)</span>
          </button>

          <button
            onClick={() => {
              if (selectedPropertyForPrint) {
                onOpenPrint(selectedPropertyForPrint);
              } else if (properties.length > 0) {
                onOpenPrint(properties[0]);
              } else {
                setActiveTab('print-center');
              }
            }}
            className={`px-3 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'print-center'
                ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Print Certificates (پرنٹ)</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2">
          {/* Data Backup Dropdown / Actions */}
          <div className="hidden sm:flex items-center gap-1 border-r border-slate-800 pr-2 mr-1">
            <button
              onClick={handleExportJSON}
              title="Download Data Backup (.json)"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".json"
              onChange={handleFileChange}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Restore / Import Backup (.json)"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
            >
              <Upload className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (window.confirm('Reset properties database to initial default listings?')) {
                  onResetData();
                }
              }}
              title="Reset Sample Records"
              className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-md transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Primary Action: Add Property */}
          <button
            onClick={onOpenRegister}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap cursor-pointer active:scale-98"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Register Property (نیا اندراج)</span>
          </button>
        </div>

      </div>

      {/* Mobile Sub-Navigation */}
      <div className="md:hidden border-t border-slate-800 px-4 py-2 flex items-center justify-between overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('properties')}
          className={`px-2.5 py-1.5 rounded font-medium whitespace-nowrap ${
            activeTab === 'properties' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'
          }`}
        >
          Properties ({properties.length})
        </button>
        <button
          onClick={() => setActiveTab('exchange')}
          className={`px-2.5 py-1.5 rounded font-medium whitespace-nowrap ${
            activeTab === 'exchange' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'
          }`}
        >
          Exchange Matcher
        </button>
        <button
          onClick={() => setActiveTab('customers')}
          className={`px-2.5 py-1.5 rounded font-medium whitespace-nowrap ${
            activeTab === 'customers' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'
          }`}
        >
          Customers
        </button>
        <button
          onClick={() => {
            if (properties.length > 0) onOpenPrint(selectedPropertyForPrint || properties[0]);
          }}
          className="px-2.5 py-1.5 rounded font-medium whitespace-nowrap text-slate-400"
        >
          Print Slip
        </button>
      </div>
    </header>
  );
};
