import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, 
  ArrowLeftRight, 
  Plus, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  Printer, 
  Download, 
  Upload, 
  RotateCcw,
  Sparkles,
  MapPin,
  ShieldCheck,
  PhoneCall,
  Mail,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { PropertyRecord } from './types/property';
import { INITIAL_PROPERTIES } from './data/initialProperties';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { PropertyTableView } from './components/PropertyTableView';
import { PropertyGridView } from './components/PropertyGridView';
import { PropertyExchangeMatcher } from './components/PropertyExchangeMatcher';
import { CustomerDirectory } from './components/CustomerDirectory';
import { RegistrationModal } from './components/RegistrationModal';
import { PrintCertificateModal } from './components/PrintCertificateModal';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { PAKISTAN_CITIES } from './utils/formatters';

const STORAGE_KEY = 'twc_pakistan_properties_db_v1';

export default function App() {
  // Load data from localStorage or fallback to realistic initial Pakistani properties
  const [properties, setProperties] = useState<PropertyRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load local storage:', e);
    }
    return INITIAL_PROPERTIES;
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
    } catch (e) {
      console.error('Failed to save to local storage:', e);
    }
  }, [properties]);

  // Main Navigation Tab
  const [activeTab, setActiveTab] = useState<'properties' | 'exchange' | 'customers' | 'print-center'>('properties');
  
  // View mode for Properties list
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedDealType, setSelectedDealType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price_high' | 'price_low' | 'size'>('newest');

  // Modal states
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<PropertyRecord | null>(null);
  const [detailProperty, setDetailProperty] = useState<PropertyRecord | null>(null);
  const [printProperty, setPrintProperty] = useState<PropertyRecord | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // CRUD Operations
  const handleSaveProperty = (prop: PropertyRecord) => {
    setProperties(prev => {
      const index = prev.findIndex(p => p.id === prop.id);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = prop;
        return updated;
      } else {
        return [prop, ...prev];
      }
    });
    setEditingProperty(null);
  };

  const handleDeleteProperty = (id: string) => {
    setProperties(prev => prev.filter(p => p.id !== id));
    if (detailProperty?.id === id) setDetailProperty(null);
    if (printProperty?.id === id) setPrintProperty(null);
  };

  const handleStatusChange = (id: string, newStatus: PropertyRecord['status']) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };

  const handleImportData = (newData: PropertyRecord[]) => {
    setProperties(newData);
    alert(`Successfully loaded ${newData.length} records!`);
  };

  const handleResetData = () => {
    setProperties(INITIAL_PROPERTIES);
  };

  // Filtered and sorted properties
  const filteredProperties = useMemo(() => {
    return properties.filter(prop => {
      // Search
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        prop.fileNumber.toLowerCase().includes(q) ||
        prop.title.toLowerCase().includes(q) ||
        prop.city.toLowerCase().includes(q) ||
        prop.society.toLowerCase().includes(q) ||
        prop.customer.fullName.toLowerCase().includes(q) ||
        (prop.customer.cnic && prop.customer.cnic.includes(q)) ||
        prop.customer.phone.includes(q)
      );

      // City
      const matchesCity = selectedCity === 'All' || prop.city === selectedCity;

      // Deal Type
      const matchesDealType = 
        selectedDealType === 'all' ||
        (selectedDealType === 'exchange' && prop.dealType !== 'sale_only') ||
        prop.dealType === selectedDealType;

      // Status
      const matchesStatus = selectedStatus === 'all' || prop.status === selectedStatus;

      return matchesSearch && matchesCity && matchesDealType && matchesStatus;
    }).sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime();
      if (sortBy === 'price_high') return b.demandPKR - a.demandPKR;
      if (sortBy === 'price_low') return a.demandPKR - b.demandPKR;
      if (sortBy === 'size') return b.size - a.size;
      return 0;
    });
  }, [properties, searchQuery, selectedCity, selectedDealType, selectedStatus, sortBy]);

  // Quick Action Handlers
  const handleOpenRegister = () => {
    setEditingProperty(null);
    setIsRegisterOpen(true);
  };

  const handleOpenEdit = (prop: PropertyRecord) => {
    setEditingProperty(prop);
    setIsRegisterOpen(true);
  };

  const handleOpenPrint = (prop: PropertyRecord) => {
    setPrintProperty(prop);
    setIsPrintModalOpen(true);
  };

  const handleOpenExchange = (prop: PropertyRecord) => {
    setActiveTab('exchange');
  };

  const handleOpenDetails = (prop: PropertyRecord) => {
    setDetailProperty(prop);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenRegister={handleOpenRegister}
        properties={properties}
        onImportData={handleImportData}
        onResetData={handleResetData}
        selectedPropertyForPrint={printProperty || properties[0] || null}
        onOpenPrint={handleOpenPrint}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Top Metric Cards */}
        <StatsCards
          properties={properties}
          onFilterByStatus={(st) => setSelectedStatus(st)}
          onFilterByDealType={(dt) => setSelectedDealType(dt)}
        />

        {/* TAB 1: PROPERTY REGISTRY */}
        {activeTab === 'properties' && (
          <div className="space-y-4">
            
            {/* Control & Filter Strip */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              
              {/* Search Box */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search File #, Owner Name, CNIC, Phone, Society..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-emerald-500 focus:outline-none"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                {/* City Filter */}
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="All">All Pakistan Cities</option>
                  {PAKISTAN_CITIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                {/* Deal Nature Filter */}
                <select
                  value={selectedDealType}
                  onChange={(e) => setSelectedDealType(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="all">All Deal Types</option>
                  <option value="exchange">Exchange Pool (تبادلہ)</option>
                  <option value="sale_or_exchange">Sale or Exchange</option>
                  <option value="exchange_only">Exchange Only</option>
                  <option value="sale_only">Direct Cash Sale</option>
                </select>

                {/* Status Filter */}
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="available">Available (دستیاب)</option>
                  <option value="in_exchange">In Exchange Process</option>
                  <option value="exchanged">Exchanged</option>
                  <option value="sold">Sold</option>
                  <option value="reserved">Reserved</option>
                </select>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="newest">Sort: Newest First</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="size">Area Size</option>
                </select>

                {/* Grid / Table Toggle */}
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  <button
                    onClick={() => setViewMode('table')}
                    title="High-Density Table View"
                    className={`p-1.5 rounded-md transition-colors ${
                      viewMode === 'table' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    title="Card Grid View"
                    className={`p-1.5 rounded-md transition-colors ${
                      viewMode === 'grid' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>

            {/* List or Table */}
            {filteredProperties.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
                <Building2 className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <h3 className="text-base font-bold text-slate-800">No properties found</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  No records match your active search or filters. Try adjusting city or deal type, or register a new property.
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCity('All');
                      setSelectedDealType('all');
                      setSelectedStatus('all');
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Clear Filters
                  </button>
                  <button
                    onClick={handleOpenRegister}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors cursor-pointer"
                  >
                    + Register New Property
                  </button>
                </div>
              </div>
            ) : viewMode === 'table' ? (
              <PropertyTableView
                properties={filteredProperties}
                onOpenDetails={handleOpenDetails}
                onEdit={handleOpenEdit}
                onOpenPrint={handleOpenPrint}
                onOpenExchange={handleOpenExchange}
                onDelete={handleDeleteProperty}
                onStatusChange={handleStatusChange}
              />
            ) : (
              <PropertyGridView
                properties={filteredProperties}
                onOpenDetails={handleOpenDetails}
                onEdit={handleOpenEdit}
                onOpenPrint={handleOpenPrint}
                onOpenExchange={handleOpenExchange}
                onDelete={handleDeleteProperty}
              />
            )}

          </div>
        )}

        {/* TAB 2: EXCHANGE MATCHER */}
        {activeTab === 'exchange' && (
          <PropertyExchangeMatcher
            properties={properties}
            onOpenPrint={handleOpenPrint}
            onOpenDetails={handleOpenDetails}
          />
        )}

        {/* TAB 3: CUSTOMER DIRECTORY */}
        {activeTab === 'customers' && (
          <CustomerDirectory
            properties={properties}
            onSelectProperty={handleOpenDetails}
            onOpenPrint={handleOpenPrint}
          />
        )}

        {/* TAB 4: PRINT CENTER SELECTOR */}
        {activeTab === 'print-center' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Printer className="w-5 h-5 text-emerald-700" />
                  <span>Official Document Printing Hub (سرکاری پرنٹ سنٹر)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Select any registered property file to generate and print legal certificates, exchange deeds, or bayana token slips.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {properties.map(p => (
                <div
                  key={p.id}
                  onClick={() => handleOpenPrint(p)}
                  className="p-4 bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 rounded-xl transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-mono font-bold text-emerald-800">{p.fileNumber}</span>
                      <span className="text-slate-500">{p.city}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{p.title}</h4>
                    <p className="text-xs text-slate-600 mt-1">Owner: {p.customer.fullName} · {p.customer.phone}</p>
                  </div>

                  <div className="mt-4 pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-emerald-700 font-bold">Print Certificate / Deed →</span>
                    <Printer className="w-4 h-4 text-emerald-700" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="no-print mt-auto border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Team Work Complex</span>
            <span aria-hidden="true">·</span>
            <span>Property Exchange Network Across Pakistan</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Head Office Support: +92 300 8451293</span>
            <span aria-hidden="true">·</span>
            <span>teamworkcomplex@gmail.com</span>
            <span aria-hidden="true">·</span>
            <span>Desktop Real Estate Suite</span>
          </div>
        </div>
      </footer>

      {/* MODAL 1: Registration / Edit Modal */}
      <RegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => {
          setIsRegisterOpen(false);
          setEditingProperty(null);
        }}
        onSave={handleSaveProperty}
        initialData={editingProperty}
        existingCount={properties.length}
      />

      {/* MODAL 2: Property Detail Modal */}
      <PropertyDetailModal
        isOpen={!!detailProperty}
        onClose={() => setDetailProperty(null)}
        property={detailProperty}
        onEdit={(prop) => {
          setDetailProperty(null);
          handleOpenEdit(prop);
        }}
        onOpenPrint={(prop) => {
          setDetailProperty(null);
          handleOpenPrint(prop);
        }}
        onOpenExchange={(prop) => {
          setDetailProperty(null);
          handleOpenExchange(prop);
        }}
      />

      {/* MODAL 3: Print Certificate / Deed Modal */}
      <PrintCertificateModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        property={printProperty}
        allProperties={properties}
      />

    </div>
  );
}
