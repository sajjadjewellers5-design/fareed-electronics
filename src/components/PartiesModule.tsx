import React, { useState } from 'react';
import {
  Users2,
  Plus,
  Search,
  UserCheck,
  Building,
  Phone,
  Mail,
  MapPin,
  ArrowDownLeft,
  ArrowUpRight,
  DollarSign,
  X,
  CreditCard,
} from 'lucide-react';
import { Customer, Supplier } from '../types';
import { useApp } from '../context/AppContext';

export const PartiesModule: React.FC = () => {
  const {
    customers,
    suppliers,
    addCustomer,
    updateCustomer,
    addSupplier,
    updateSupplier,
    formatCurrency,
    invoices,
    purchaseInvoices,
    setActiveTab,
  } = useApp();

  const [activeTab, setActivePartyTab] = useState<'CUSTOMERS' | 'SUPPLIERS'>('CUSTOMERS');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);

  // Customer Form
  const [custForm, setCustForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });

  // Supplier Form
  const [suppForm, setSuppForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    contactPerson: '',
  });

  const totalReceivables = customers.reduce((acc, c) => acc + c.currentBalance, 0);
  const totalPayables = suppliers.reduce((acc, s) => acc + s.currentBalance, 0);

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custForm.name || !custForm.phone) return;

    addCustomer(custForm);
    setIsAddCustomerOpen(false);
    setCustForm({ name: '', phone: '', email: '', address: '' });
  };

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suppForm.name) return;

    addSupplier(suppForm);
    setIsAddSupplierOpen(false);
    setSuppForm({ name: '', phone: '', email: '', address: '', contactPerson: '' });
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      (c.address && c.address.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery) ||
      (s.contactPerson && s.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4.5 rounded-2xl">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Users2 className="w-5 h-5 text-purple-400" />
            <span>Customers &amp; Suppliers Directory (Khata)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage customer accounts, supplier ledgers, and track receivables and payables balances.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'CUSTOMERS' ? (
            <button
              onClick={() => setIsAddCustomerOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-md shadow-purple-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Customer</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAddSupplierOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-md shadow-amber-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Supplier</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Total Customer Receivables (Due to Us)</span>
            <div className="text-2xl font-black text-rose-400 font-mono mt-1">
              {formatCurrency(totalReceivables)}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Across {customers.length} registered customer accounts
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <ArrowDownLeft className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Total Supplier Payables (We Owe)</span>
            <div className="text-2xl font-black text-amber-400 font-mono mt-1">
              {formatCurrency(totalPayables)}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Across {suppliers.length} component vendors &amp; distributors
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => setActivePartyTab('CUSTOMERS')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'CUSTOMERS'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Customers ({customers.length})
          </button>
          <button
            onClick={() => setActivePartyTab('SUPPLIERS')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'SUPPLIERS'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Suppliers ({suppliers.length})
          </button>
        </div>

        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab.toLowerCase()} by name, phone, or location...`}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Customer Directory Table */}
      {activeTab === 'CUSTOMERS' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-3">Contact Number</th>
                  <th className="py-3 px-3">Location / Address</th>
                  <th className="py-3 px-3 text-right">Lifetime Sales</th>
                  <th className="py-3 px-4 text-right">Receivable Balance</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500 text-xs">
                      No customer accounts found matching search.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((cust) => (
                    <tr
                      key={cust.id}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="font-bold text-white text-xs">{cust.name}</div>
                        {cust.email && (
                          <div className="text-[11px] text-slate-500 mt-0.5">{cust.email}</div>
                        )}
                      </td>

                      <td className="py-3 px-3 font-mono text-slate-300">
                        {cust.phone}
                      </td>

                      <td className="py-3 px-3 text-slate-400">
                        {cust.address || '—'}
                      </td>

                      <td className="py-3 px-3 text-right font-mono text-slate-300">
                        {formatCurrency(cust.totalPurchased)}
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-bold text-xs">
                        {cust.currentBalance > 0 ? (
                          <span className="text-rose-400">
                            {formatCurrency(cust.currentBalance)}
                          </span>
                        ) : (
                          <span className="text-emerald-400">Cleared (₨0)</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setActiveTab('customer-invoices')}
                          className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition-colors cursor-pointer"
                        >
                          View Invoices
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Supplier Directory Table */}
      {activeTab === 'SUPPLIERS' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Supplier Company</th>
                  <th className="py-3 px-3">Contact Person</th>
                  <th className="py-3 px-3">Phone &amp; Location</th>
                  <th className="py-3 px-3 text-right">Total Supplied</th>
                  <th className="py-3 px-4 text-right">Payable Balance</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredSuppliers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500 text-xs">
                      No supplier accounts found matching search.
                    </td>
                  </tr>
                ) : (
                  filteredSuppliers.map((supp) => (
                    <tr
                      key={supp.id}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="font-bold text-white text-xs">{supp.name}</div>
                        {supp.email && (
                          <div className="text-[11px] text-slate-500 mt-0.5">{supp.email}</div>
                        )}
                      </td>

                      <td className="py-3 px-3 text-slate-300">
                        {supp.contactPerson || 'Vendor Representative'}
                      </td>

                      <td className="py-3 px-3 text-slate-400">
                        <div className="font-mono text-xs text-slate-300">{supp.phone}</div>
                        <div className="text-[11px] text-slate-500">{supp.address || '—'}</div>
                      </td>

                      <td className="py-3 px-3 text-right font-mono text-slate-300">
                        {formatCurrency(supp.totalSupplied)}
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-bold text-xs">
                        {supp.currentBalance > 0 ? (
                          <span className="text-amber-400">
                            {formatCurrency(supp.currentBalance)}
                          </span>
                        ) : (
                          <span className="text-emerald-400">Paid in Full (₨0)</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setActiveTab('purchase-invoices')}
                          className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition-colors cursor-pointer"
                        >
                          View Bills
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD CUSTOMER MODAL */}
      {isAddCustomerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <UserCheck className="w-5 h-5 text-purple-400" />
                <span>Register New Customer</span>
              </div>
              <button
                onClick={() => setIsAddCustomerOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Customer / Lab Client Name *
                </label>
                <input
                  type="text"
                  required
                  value={custForm.name}
                  onChange={(e) => setCustForm({ ...custForm, name: e.target.value })}
                  placeholder="e.g. Imran Tech Service"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={custForm.phone}
                  onChange={(e) => setCustForm({ ...custForm, phone: e.target.value })}
                  placeholder="+92 300 1234567"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  value={custForm.email}
                  onChange={(e) => setCustForm({ ...custForm, email: e.target.value })}
                  placeholder="client@gmail.com"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Shop / City Address</label>
                <input
                  type="text"
                  value={custForm.address}
                  onChange={(e) => setCustForm({ ...custForm, address: e.target.value })}
                  placeholder="Shop #, Plaza, City"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddCustomerOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-md cursor-pointer"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD SUPPLIER MODAL */}
      {isAddSupplierOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <Building className="w-5 h-5 text-amber-400" />
                <span>Register New Supplier</span>
              </div>
              <button
                onClick={() => setIsAddSupplierOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSupplier} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Supplier / Vendor Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={suppForm.name}
                  onChange={(e) => setSuppForm({ ...suppForm, name: e.target.value })}
                  placeholder="e.g. Shenzhen Micro Components Co."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Contact Person / Representative
                </label>
                <input
                  type="text"
                  value={suppForm.contactPerson}
                  onChange={(e) =>
                    setSuppForm({ ...suppForm, contactPerson: e.target.value })
                  }
                  placeholder="e.g. Mr. David / Malik Aslam"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Phone</label>
                  <input
                    type="text"
                    value={suppForm.phone}
                    onChange={(e) => setSuppForm({ ...suppForm, phone: e.target.value })}
                    placeholder="+86 / +92 ..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={suppForm.email}
                    onChange={(e) => setSuppForm({ ...suppForm, email: e.target.value })}
                    placeholder="sales@vendor.com"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Address / Hub</label>
                <input
                  type="text"
                  value={suppForm.address}
                  onChange={(e) => setSuppForm({ ...suppForm, address: e.target.value })}
                  placeholder="City, Market or Logistics Warehouse"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddSupplierOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-md cursor-pointer"
                >
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
