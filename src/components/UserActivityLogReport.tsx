import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  Printer,
  Clock,
  UserCheck,
  LogIn,
  LogOut,
  Receipt,
  Truck,
  Boxes,
  Database,
  FileCheck,
  Calendar,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserActivityLog } from '../types';

export const UserActivityLogReport: React.FC = () => {
  const { activityLogs, companyProfile } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('ALL');

  const filteredLogs = activityLogs.filter((log) => {
    const matchesAction = selectedAction === 'ALL' || log.action === selectedAction;
    const matchesSearch =
      log.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userFullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesAction && matchesSearch;
  });

  const getActionBadge = (action: UserActivityLog['action']) => {
    switch (action) {
      case 'LOGIN':
        return {
          label: 'User Log In',
          color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
          icon: LogIn,
        };
      case 'LOGOUT':
        return {
          label: 'User Log Out',
          color: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
          icon: LogOut,
        };
      case 'SALE_INVOICE':
        return {
          label: 'Sale Invoice',
          color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
          icon: Receipt,
        };
      case 'PURCHASE_BILL':
        return {
          label: 'Purchase Bill',
          color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
          icon: Truck,
        };
      case 'STOCK_ADD':
      case 'STOCK_UPDATE':
        return {
          label: 'Stock Action',
          color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
          icon: Boxes,
        };
      case 'PRICE_ADJUSTMENT':
        return {
          label: 'Price Adjusted',
          color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
          icon: Clock,
        };
      case 'BILTY_UPDATE':
        return {
          label: 'Bilty Update',
          color: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
          icon: Truck,
        };
      case 'BACKUP':
        return {
          label: 'Auto Backup',
          color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          icon: Database,
        };
      default:
        return {
          label: action,
          color: 'bg-slate-800 text-slate-300 border-slate-700',
          icon: FileCheck,
        };
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#072836] border border-[#0d556e]/80 p-5 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-wide flex items-center gap-2">
              <span>User Activity Log Report (لاگ ان و آؤٹ رپورٹ و سرگرمیاں)</span>
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              یوزرز کا لاگ ان اور آؤٹ ٹائم، سیلز بل، اسٹاک ردوبدل، بلٹی اپڈیٹس اور مکمل آڈٹ ٹریل
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-md cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Audit Log (پرنٹ لاگ)</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="no-print bg-[#072836]/90 border border-[#0d556e]/80 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search activity by user, description or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 font-semibold">Action Filter:</span>
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL">All Activities (تمام ریکارڈز)</option>
            <option value="LOGIN">User Log In (لاگ ان)</option>
            <option value="LOGOUT">User Log Out (لاگ آؤٹ)</option>
            <option value="SALE_INVOICE">Sale Invoices (سیلز بل)</option>
            <option value="PURCHASE_BILL">Purchase Bills (خریداری)</option>
            <option value="PRICE_ADJUSTMENT">Price Adjustments (قیمت ردوبدل)</option>
            <option value="BILTY_UPDATE">Bilty Updates (بلٹی اپڈیٹ)</option>
            <option value="VOUCHER">Vouchers (واؤچرز)</option>
            <option value="BACKUP">Auto Backup (بیک اپ)</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-[#072836] border border-[#0d556e]/80 rounded-2xl overflow-hidden shadow-sm" id="audit-log-print">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-black text-white">System Security &amp; Activity Audit Register</h3>
          <span className="text-xs font-mono font-bold text-cyan-400">
            {filteredLogs.length} Records Logged
          </span>
        </div>

        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-800 sticky top-0">
              <tr>
                <th className="p-3">Timestamp / وقت و تاریخ</th>
                <th className="p-3">User Operator</th>
                <th className="p-3">Role</th>
                <th className="p-3">Activity Type</th>
                <th className="p-3">Description &amp; Action Details</th>
                <th className="p-3">Session / Workstation Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredLogs.map((log) => {
                const badge = getActionBadge(log.action);
                const Icon = badge.icon;

                return (
                  <tr key={log.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-3 font-mono text-slate-400 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="p-3 font-semibold text-white">
                      <div>{log.userFullName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">@{log.username}</div>
                    </td>
                    <td className="p-3">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {log.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${badge.color}`}>
                        <Icon className="w-3 h-3" />
                        <span>{badge.label}</span>
                      </span>
                    </td>
                    <td className="p-3 text-slate-200 font-medium">
                      {log.description}
                    </td>
                    <td className="p-3 text-[11px] font-mono text-slate-400">
                      {log.details || '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
