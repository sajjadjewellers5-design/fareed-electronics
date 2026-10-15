import React, { useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Phone,
  MapPin,
  Receipt,
  ArrowDownLeft,
  FileSpreadsheet,
  Printer,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  Building,
  Edit2,
  X,
  Save,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Customer } from '../types';

export const CustomerManagement: React.FC = () => {
  const {
    customers,
    invoices,
    formatCurrency,
    setIsNewCustomerModalOpen,
    setSelectedCustomerForLedger,
    setIsReceivePaymentModalOpen,
    setIsCreateInvoiceModalOpen,
    setActiveTab,
    language,
    updateCustomer,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterBalance, setFilterBalance] = useState<'ALL' | 'DUE' | 'ZERO'>('ALL');
  const [sortBy, setSortBy] = useState<'NAME' | 'BALANCE_DESC' | 'TOTAL_DESC'>('BALANCE_DESC');
  
  // Quick Edit Modal state
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editAddress, setEditAddress] = useState('');

  // Calculate live customer statistics
  const totalCustomers = customers.length;
  const totalReceivables = customers.reduce((sum, c) => sum + (c.totalBalance || 0), 0);
  const dueCustomersCount = customers.filter((c) => (c.totalBalance || 0) > 0).length;
  const zeroBalanceCount = customers.filter((c) => (c.totalBalance || 0) <= 0).length;
  const totalSalesToCustomers = customers.reduce((sum, c) => sum + (c.totalPurchased || 0), 0);

  // Filter & sort customers
  const filteredCustomers = useMemo(() => {
    return customers
      .filter((c) => {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !q ||
          c.name.toLowerCase().includes(q) ||
          (c.phone && c.phone.toLowerCase().includes(q)) ||
          (c.address && c.address.toLowerCase().includes(q)) ||
          (c.email && c.email.toLowerCase().includes(q));

        if (!matchesQuery) return false;

        const balance = c.totalBalance || 0;
        if (filterBalance === 'DUE') return balance > 0;
        if (filterBalance === 'ZERO') return balance <= 0;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'NAME') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'BALANCE_DESC') {
          return (b.totalBalance || 0) - (a.totalBalance || 0);
        }
        if (sortBy === 'TOTAL_DESC') {
          return (b.totalPurchased || 0) - (a.totalPurchased || 0);
        }
        return 0;
      });
  }, [customers, searchQuery, filterBalance, sortBy]);

  // Open Quick Edit
  const handleOpenEdit = (c: Customer) => {
    setEditingCustomer(c);
    setEditName(c.name);
    setEditPhone(c.phone || '');
    setEditEmail(c.email || '');
    setEditAddress(c.address || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;
    if (updateCustomer) {
      updateCustomer(editingCustomer.id, {
        name: editName.trim(),
        phone: editPhone.trim(),
        email: editEmail.trim() || undefined,
        address: editAddress.trim() || undefined,
      });
    }
    setEditingCustomer(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>{language === 'ur' ? 'گاہکوں کی فہرست و کھاتہ جات' : 'Customer List & Accounts'}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold">
                  {customers.length} Customers
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'ur'
                  ? 'تمام رجسٹرڈ گاہک، مارکیٹ میں واجب الوصول رقم، اور تفصیلی کسٹمر لیجر'
                  : 'Manage client directory, track market receivables, balances, and view customer ledgers'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setIsNewCustomerModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
            title="F1: Register New Customer"
          >
            <UserPlus className="w-4 h-4" />
            <span>{language === 'ur' ? '+ نیا گاہک درج کریں' : '+ Add New Customer'}</span>
            <kbd className="px-1.5 py-0.2 rounded bg-slate-950/30 font-mono text-[9px] font-bold text-slate-950">
              F1
            </kbd>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors cursor-pointer"
            title="Print Customer List"
          >
            <Printer className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">{language === 'ur' ? 'پرنٹ لسٹ' : 'Print List'}</span>
          </button>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Registered */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-md">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            {language === 'ur' ? 'کل رجسٹرڈ گاہک' : 'Total Customers'}
          </div>
          <div className="text-xl sm:text-2xl font-black text-white flex items-center justify-between">
            <span>{totalCustomers}</span>
            <Users className="w-5 h-5 text-cyan-400 opacity-60" />
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            {dueCustomersCount} with outstanding balance
          </div>
        </div>

        {/* Total Accounts Receivable (Market Due) */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30 shadow-md">
          <div className="text-[11px] font-bold uppercase tracking-wider text-rose-300 mb-1">
            {language === 'ur' ? 'مارکیٹ واجب الوصول رقم' : 'Accounts Receivable'}
          </div>
          <div className="text-xl sm:text-2xl font-black text-rose-400 flex items-center justify-between">
            <span>{formatCurrency(totalReceivables)}</span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          </div>
          <div className="text-[10px] text-rose-300/70 mt-1 font-mono">
            Across {dueCustomersCount} pending customer ledgers
          </div>
        </div>

        {/* Total Lifetime Sales */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-md">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            {language === 'ur' ? 'کل کسٹمر سیلز' : 'Total Customer Sales'}
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400 flex items-center justify-between">
            <span>{formatCurrency(totalSalesToCustomers)}</span>
            <Receipt className="w-5 h-5 text-emerald-400 opacity-60" />
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            {invoices.length} invoices generated
          </div>
        </div>

        {/* Clear Zero Balance Customers */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-md">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            {language === 'ur' ? 'کلیئر کھاتے (0 بقایا)' : 'Settled Customers'}
          </div>
          <div className="text-xl sm:text-2xl font-black text-cyan-300 flex items-center justify-between">
            <span>{zeroBalanceCount}</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400 opacity-60" />
          </div>
          <div className="text-[10px] text-emerald-400/80 mt-1 font-mono">
            Zero outstanding balance
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px] w-full sm:w-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'ur'
                ? 'نام، فون نمبر، شہر یا ایڈریس سے تلاش کریں...'
                : 'Search customers by name, phone, city, address...'
            }
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-end">
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setFilterBalance('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterBalance === 'ALL'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'ur' ? 'تمام' : 'All'} ({customers.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterBalance('DUE')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterBalance === 'DUE'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-rose-400 hover:text-white'
              }`}
            >
              {language === 'ur' ? 'بقایا دار' : 'With Balance'} ({dueCustomersCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterBalance('ZERO')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterBalance === 'ZERO'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-emerald-400 hover:text-white'
              }`}
            >
              {language === 'ur' ? 'صفر بقایا' : 'Settled'} ({zeroBalanceCount})
            </button>
          </div>

          {/* Sort By Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="BALANCE_DESC">Highest Balance First</option>
            <option value="TOTAL_DESC">Highest Sales First</option>
            <option value="NAME">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Customer Name &amp; ID</th>
                <th className="py-3.5 px-4">Phone / WhatsApp</th>
                <th className="py-3.5 px-4">Address / City</th>
                <th className="py-3.5 px-4 text-center">Invoices</th>
                <th className="py-3.5 px-4 text-right">Total Purchased</th>
                <th className="py-3.5 px-4 text-right">Current Balance</th>
                <th className="py-3.5 px-4 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 space-y-2">
                    <Users className="w-10 h-10 mx-auto opacity-40 text-slate-400" />
                    <p className="text-sm font-semibold">No customers match your criteria.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setFilterBalance('ALL');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold cursor-pointer"
                    >
                      Clear Search Filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => {
                  const custInvoicesCount = invoices.filter(
                    (inv) =>
                      (inv.customerId && inv.customerId === cust.id) ||
                      (inv.customerName &&
                        inv.customerName.trim().toLowerCase() === cust.name.trim().toLowerCase())
                  ).length;
                  const balance = cust.totalBalance || 0;

                  return (
                    <tr
                      key={cust.id}
                      className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                      onClick={() => setSelectedCustomerForLedger(cust)}
                    >
                      {/* Name & ID */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                          <span>{cust.name}</span>
                          {balance > 0 && (
                            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse shrink-0" />
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          ID: {cust.id}
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-4 font-mono" onClick={(e) => e.stopPropagation()}>
                        {cust.phone ? (
                          <div className="flex items-center gap-2">
                            <span className="text-slate-200">{cust.phone}</span>
                            <a
                              href={`https://wa.me/${cust.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-400 hover:text-emerald-300 p-1 rounded hover:bg-emerald-950/40"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        ) : (
                          <span className="text-slate-500">None</span>
                        )}
                      </td>

                      {/* Address */}
                      <td className="py-3.5 px-4 text-slate-300">
                        {cust.address ? (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <span className="truncate max-w-[200px]" title={cust.address}>
                              {cust.address}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </td>

                      {/* Invoices Count */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono text-[11px] font-bold">
                          {custInvoicesCount}
                        </span>
                      </td>

                      {/* Total Purchased */}
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-200">
                        {formatCurrency(cust.totalPurchased || 0)}
                      </td>

                      {/* Current Balance */}
                      <td className="py-3.5 px-4 text-right">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-lg font-mono font-bold text-xs ${
                            balance > 0
                              ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                              : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {balance > 0 ? formatCurrency(balance) : '0.00 (Cleared)'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {/* View Ledger */}
                          <button
                            type="button"
                            onClick={() => setSelectedCustomerForLedger(cust)}
                            className="px-2.5 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-[11px] font-bold transition-colors cursor-pointer"
                            title="View Complete Customer Khata Ledger"
                          >
                            Ledger
                          </button>

                          {/* + Sale Invoice */}
                          <button
                            type="button"
                            onClick={() => {
                              setActiveTab('customer-invoices');
                              setIsCreateInvoiceModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold transition-colors cursor-pointer"
                            title="Create Sale Invoice for this customer"
                          >
                            + Sale
                          </button>

                          {/* + Receive Payment if balance > 0 */}
                          {balance > 0 && (
                            <button
                              type="button"
                              onClick={() => setIsReceivePaymentModalOpen(true)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold transition-colors cursor-pointer"
                              title="Receive Payment from this customer"
                            >
                              + Pay
                            </button>
                          )}

                          {/* Quick Edit button */}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(cust)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                            title="Edit Customer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Customer Modal */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setEditingCustomer(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Edit2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Edit Customer Details</h3>
                <p className="text-xs text-slate-400">Update phone, address or contact info</p>
              </div>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email (Optional)</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Address / Location</label>
                <input
                  type="text"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCustomer(null)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Update Customer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
