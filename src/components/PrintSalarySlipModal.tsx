import React from 'react';
import { Printer, X, Download, Landmark, CheckCircle2, Building2 } from 'lucide-react';
import { SalarySlip } from '../types';
import { useApp } from '../context/AppContext';
import { LogoWatermark } from './BrandLogo';

export const PrintSalarySlipModal: React.FC = () => {
  const {
    selectedSalarySlipForPrint,
    setSelectedSalarySlipForPrint,
    companyProfile,
    employees,
    formatCurrency,
  } = useApp();

  if (!selectedSalarySlipForPrint) return null;

  const slip = selectedSalarySlipForPrint;
  const emp = employees.find((e) => e.id === slip.employeeId);

  const handlePrint = () => {
    window.print();
  };

  const grossEarnings = (slip.basicSalary || 0) + (slip.allowances || 0) + (slip.bonus || 0);
  const totalDeductions = (slip.deductions || 0) + (slip.advanceDeduction || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto print:p-0 print:m-0 print:bg-white print:static print:overflow-visible">
      <div className="relative w-full max-w-2xl bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150 print:border-none print:shadow-none print:w-full print:max-w-full print:rounded-none">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="no-print px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-cyan-400">
              Salary Pay Slip Preview — {slip.slipNumber}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip (پرنٹ کریں)</span>
            </button>
            <button
              onClick={() => setSelectedSalarySlipForPrint(null)}
              className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div className="p-8 space-y-6 bg-white relative overflow-hidden" id="salary-slip-print">
          {/* Logo Watermark on Printed Salary Slip */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05] overflow-hidden -z-0">
            <LogoWatermark
              customLogoUrl={companyProfile.logoUrl}
              className="scale-[2.2] text-slate-900"
            />
          </div>

          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5">
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase">
                {companyProfile.name}
              </h1>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">
                {companyProfile.subtitle}
              </p>
              <p className="text-[11px] text-slate-500 max-w-xs mt-1">
                {companyProfile.address}
              </p>
              <p className="text-[11px] font-mono text-slate-500">
                Phone: {companyProfile.phone} · NTN: {companyProfile.ntn}
              </p>
            </div>
            <div className="text-right">
              <div className="inline-block px-3 py-1 bg-slate-900 text-white text-xs font-black rounded-lg uppercase tracking-wider mb-2">
                SALARY PAY SLIP (تنخواہ کی سلپ)
              </div>
              <div className="text-xs font-mono font-bold text-slate-800">
                Slip No: {slip.slipNumber}
              </div>
              <div className="text-xs text-slate-600">
                Month: <span className="font-bold text-slate-900">{slip.month}</span>
              </div>
              <div className="text-xs text-slate-600">
                Issue Date: {slip.date}
              </div>
            </div>
          </div>

          {/* Employee Information Grid */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <div className="text-slate-500 font-semibold">Employee Name / ملازم کا نام:</div>
              <div className="font-black text-slate-900 text-sm mt-0.5">
                {slip.employeeName}
              </div>
              <div className="text-slate-500 mt-2 font-semibold">Designation / عہدہ:</div>
              <div className="font-bold text-slate-800 mt-0.5">
                {slip.designation}
              </div>
            </div>
            <div>
              <div className="text-slate-500 font-semibold">Employee Code / کوڈ:</div>
              <div className="font-mono font-bold text-slate-900 mt-0.5">
                {emp?.employeeCode || 'EMP-N/A'}
              </div>
              <div className="text-slate-500 mt-2 font-semibold">CNIC / شناختی کارڈ:</div>
              <div className="font-mono font-bold text-slate-800 mt-0.5">
                {emp?.cnic || '35201-XXXXXXX-X'}
              </div>
            </div>
          </div>

          {/* Salary Breakdown: Earnings vs Deductions */}
          <div className="grid grid-cols-2 gap-4">
            {/* Earnings Column */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-100 px-3.5 py-2 text-xs font-black text-slate-800 border-b border-slate-200 flex justify-between">
                <span>EARNINGS (آمدنی)</span>
                <span>AMOUNT</span>
              </div>
              <div className="p-3.5 space-y-2 text-xs">
                <div className="flex justify-between text-slate-700">
                  <span>Basic Salary (بنیادی تنخواہ):</span>
                  <span className="font-mono font-bold">{formatCurrency(slip.basicSalary)}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Allowances (الاؤنسز):</span>
                  <span className="font-mono font-bold">{formatCurrency(slip.allowances)}</span>
                </div>
                {slip.bonus > 0 && (
                  <div className="flex justify-between text-slate-700">
                    <span>Performance Bonus (بونس):</span>
                    <span className="font-mono font-bold">{formatCurrency(slip.bonus)}</span>
                  </div>
                )}
                <div className="border-t border-slate-200 pt-2 flex justify-between font-black text-slate-900">
                  <span>Gross Earnings:</span>
                  <span className="font-mono">{formatCurrency(grossEarnings)}</span>
                </div>
              </div>
            </div>

            {/* Deductions Column */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-100 px-3.5 py-2 text-xs font-black text-slate-800 border-b border-slate-200 flex justify-between">
                <span>DEDUCTIONS (کٹوتیاں)</span>
                <span>AMOUNT</span>
              </div>
              <div className="p-3.5 space-y-2 text-xs">
                <div className="flex justify-between text-slate-700">
                  <span>General Deductions:</span>
                  <span className="font-mono font-bold">{formatCurrency(slip.deductions)}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Advance Deduction (ایڈوانس کٹوتی):</span>
                  <span className="font-mono font-bold text-rose-600">{formatCurrency(slip.advanceDeduction)}</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between font-black text-slate-900">
                  <span>Total Deductions:</span>
                  <span className="font-mono">{formatCurrency(totalDeductions)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Salary Paid Box */}
          <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-300 font-bold">
                NET TAKE-HOME SALARY (خالص ادا شدہ رقم)
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Payment Mode: {slip.paymentMethod} {slip.bankAccountName ? `(${slip.bankAccountName})` : ''} · Status: {slip.paymentStatus}
              </div>
            </div>
            <div className="text-2xl font-black font-mono text-cyan-400">
              {formatCurrency(slip.netSalary)}
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200 text-center text-xs">
            <div>
              <div className="border-b border-slate-400 pb-1 mb-1 w-44 mx-auto"></div>
              <div className="font-bold text-slate-800">Employee Signature</div>
              <div className="text-[10px] text-slate-500">دستخط ملازم</div>
            </div>
            <div>
              <div className="border-b border-slate-400 pb-1 mb-1 w-44 mx-auto"></div>
              <div className="font-bold text-slate-800">Authorized Director / Stamp</div>
              <div className="text-[10px] text-slate-500">دستخط مجاز و مہر ادارہ</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
