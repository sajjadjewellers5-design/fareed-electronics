import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Receipt,
  Printer,
  DollarSign,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Building2,
  Phone,
  CreditCard,
  Calendar,
  Layers,
  Search,
  Eye,
  Camera,
  ArrowDownLeft,
  ArrowUpRight,
} from 'lucide-react';
import { Employee, SalarySlip } from '../types';
import { useApp } from '../context/AppContext';

export const EmployeesPayrollModule: React.FC = () => {
  const {
    employees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    giveEmployeeAdvance,
    salarySlips,
    generateSalarySlip,
    paySalarySlip,
    deleteSalarySlip,
    setSelectedSalarySlipForPrint,
    bankAccounts,
    formatCurrency,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'EMPLOYEES' | 'SALARY_SLIPS' | 'ADVANCES'>('EMPLOYEES');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isAdvanceModalOpen, setIsAdvanceModalOpen] = useState(false);
  const [selectedEmpForAdvance, setSelectedEmpForAdvance] = useState<Employee | null>(null);
  const [isGenerateSlipOpen, setIsGenerateSlipOpen] = useState(false);
  const [isPaySlipOpen, setIsPaySlipOpen] = useState(false);
  const [targetSlipToPay, setTargetSlipToPay] = useState<SalarySlip | null>(null);

  // Add/Edit Employee Form
  const [empCode, setEmpCode] = useState('');
  const [empName, setEmpName] = useState('');
  const [empDesignation, setEmpDesignation] = useState('');
  const [empPhone, setEmpPhone] = useState('');
  const [empCnic, setEmpCnic] = useState('');
  const [empJoiningDate, setEmpJoiningDate] = useState(new Date().toISOString().split('T')[0]);
  const [empBasicSalary, setEmpBasicSalary] = useState('');
  const [empAllowance, setEmpAllowance] = useState('0');
  const [empPhoto, setEmpPhoto] = useState('');

  // Advance Form
  const [advAmount, setAdvAmount] = useState('');
  const [advBankAccountId, setAdvBankAccountId] = useState(bankAccounts[0]?.id || '');
  const [advNotes, setAdvNotes] = useState('');

  // Salary Slip Form
  const [slipEmpId, setSlipEmpId] = useState(employees[0]?.id || '');
  const [slipMonth, setSlipMonth] = useState(
    `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
  );
  const [slipDate, setSlipDate] = useState(new Date().toISOString().split('T')[0]);
  const [slipBasic, setSlipBasic] = useState('0');
  const [slipBonus, setSlipBonus] = useState('0');
  const [slipAllowances, setSlipAllowances] = useState('0');
  const [slipDeductions, setSlipDeductions] = useState('0');
  const [slipAdvDeduction, setSlipAdvDeduction] = useState('0');
  const [slipNotes, setSlipNotes] = useState('');

  // Pay Slip Modal Form
  const [payMethod, setPayMethod] = useState<'CASH' | 'BANK'>('CASH');
  const [payBankAccountId, setPayBankAccountId] = useState(bankAccounts[0]?.id || '');

  // KPIs
  const totalEmployees = employees.length;
  const totalMonthlyPayroll = employees.reduce(
    (sum, e) => sum + (e.basicSalary + e.allowance),
    0
  );
  const totalAdvancesReceivable = employees.reduce(
    (sum, e) => sum + (e.advanceBalance || 0),
    0
  );

  const handleOpenAddEmployee = () => {
    setEditingEmployee(null);
    setEmpCode(`EMP-0${employees.length + 1}`);
    setEmpName('');
    setEmpDesignation('Lab Diagnostics Tech');
    setEmpPhone('');
    setEmpCnic('');
    setEmpJoiningDate(new Date().toISOString().split('T')[0]);
    setEmpBasicSalary('45000');
    setEmpAllowance('5000');
    setEmpPhoto('');
    setIsAddEmployeeOpen(true);
  };

  const handleOpenEditEmployee = (emp: Employee) => {
    setEditingEmployee(emp);
    setEmpCode(emp.employeeCode);
    setEmpName(emp.name);
    setEmpDesignation(emp.designation);
    setEmpPhone(emp.phone);
    setEmpCnic(emp.cnic);
    setEmpJoiningDate(emp.joiningDate);
    setEmpBasicSalary(String(emp.basicSalary));
    setEmpAllowance(String(emp.allowance));
    setEmpPhoto(emp.photo || '');
    setIsAddEmployeeOpen(true);
  };

  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName || !empBasicSalary) {
      alert('Please enter employee name and basic salary.');
      return;
    }

    if (editingEmployee) {
      updateEmployee(editingEmployee.id, {
        employeeCode: empCode,
        name: empName.trim(),
        designation: empDesignation.trim(),
        phone: empPhone.trim(),
        cnic: empCnic.trim(),
        joiningDate: empJoiningDate,
        basicSalary: Number(empBasicSalary) || 0,
        allowance: Number(empAllowance) || 0,
        photo: empPhoto || undefined,
      });
    } else {
      addEmployee({
        employeeCode: empCode || `EMP-0${employees.length + 1}`,
        name: empName.trim(),
        designation: empDesignation.trim(),
        phone: empPhone.trim(),
        cnic: empCnic.trim(),
        joiningDate: empJoiningDate,
        basicSalary: Number(empBasicSalary) || 0,
        allowance: Number(empAllowance) || 0,
        advanceBalance: 0,
        status: 'ACTIVE',
        photo: empPhoto || undefined,
      });
    }

    setIsAddEmployeeOpen(false);
  };

  const handleOpenAdvance = (emp: Employee) => {
    setSelectedEmpForAdvance(emp);
    setAdvAmount('');
    setAdvNotes('');
    setAdvBankAccountId(bankAccounts[0]?.id || '');
    setIsAdvanceModalOpen(true);
  };

  const handleSaveAdvance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmpForAdvance || Number(advAmount) <= 0) {
      alert('Please enter a valid advance amount.');
      return;
    }

    giveEmployeeAdvance(
      selectedEmpForAdvance.id,
      Number(advAmount),
      advBankAccountId,
      advNotes
    );

    setIsAdvanceModalOpen(false);
  };

  const handleOpenGenerateSlip = (presetEmp?: Employee) => {
    const target = presetEmp || employees[0];
    if (target) {
      setSlipEmpId(target.id);
      setSlipBasic(String(target.basicSalary));
      setSlipAllowances(String(target.allowance));
      setSlipBonus('0');
      setSlipDeductions('0');
      setSlipAdvDeduction(target.advanceBalance > 0 ? String(Math.min(target.advanceBalance, 5000)) : '0');
    }
    setIsGenerateSlipOpen(true);
  };

  const handleSlipEmployeeSelect = (id: string) => {
    setSlipEmpId(id);
    const found = employees.find((e) => e.id === id);
    if (found) {
      setSlipBasic(String(found.basicSalary));
      setSlipAllowances(String(found.allowance));
      setSlipAdvDeduction(found.advanceBalance > 0 ? String(Math.min(found.advanceBalance, 5000)) : '0');
    }
  };

  const calculatedNetSalary =
    (Number(slipBasic) || 0) +
    (Number(slipAllowances) || 0) +
    (Number(slipBonus) || 0) -
    (Number(slipDeductions) || 0) -
    (Number(slipAdvDeduction) || 0);

  const handleSaveSalarySlip = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((e) => e.id === slipEmpId);
    if (!emp) return;

    generateSalarySlip({
      employeeId: emp.id,
      employeeName: emp.name,
      designation: emp.designation,
      month: slipMonth,
      date: slipDate,
      basicSalary: Number(slipBasic) || 0,
      bonus: Number(slipBonus) || 0,
      allowances: Number(slipAllowances) || 0,
      deductions: Number(slipDeductions) || 0,
      advanceDeduction: Number(slipAdvDeduction) || 0,
      netSalary: Math.max(0, calculatedNetSalary),
      paymentStatus: 'PENDING',
      paymentMethod: 'CASH',
      notes: slipNotes || undefined,
    });

    setIsGenerateSlipOpen(false);
    setActiveTab('SALARY_SLIPS');
  };

  const handleConfirmPaySlip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetSlipToPay) return;

    paySalarySlip(targetSlipToPay.id, payMethod, payBankAccountId);
    setIsPaySlipOpen(false);
    setTargetSlipToPay(null);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner & KPI Cards */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#072836] border border-[#0d556e]/80 p-5 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-wide flex items-center gap-2">
              <span>Employee Records &amp; Salary Slip System (ملازمین و پے رول)</span>
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              اسٹاف ریکارڈ، ماہانہ تنخواہ سلپ جنریٹر، ایڈوانس کھاتہ و ادائیگی کی رسیدیں
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenAddEmployee}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-md cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add Employee (نیا ملازم)</span>
          </button>
          <button
            onClick={() => handleOpenGenerateSlip()}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-md cursor-pointer"
          >
            <Receipt className="w-4 h-4" />
            <span>Generate Salary Slip (تنخواہ سلپ)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#072836]/90 border border-[#0d556e]/70 rounded-2xl p-4 shadow-sm">
          <div className="text-xs text-slate-400 font-semibold">Total Active Staff (کل ملازمین)</div>
          <div className="text-2xl font-black text-white font-mono mt-1">
            {totalEmployees} Members
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Hardware Techs, Invoicing Officers &amp; Storekeepers
          </div>
        </div>

        <div className="bg-[#072836]/90 border border-[#0d556e]/70 rounded-2xl p-4 shadow-sm">
          <div className="text-xs text-slate-400 font-semibold">Monthly Payroll Cost (ماہانہ تنخواہیں)</div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
            {formatCurrency(totalMonthlyPayroll)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Basic salaries + fixed food/travel allowances
          </div>
        </div>

        <div className="bg-[#072836]/90 border border-[#0d556e]/70 rounded-2xl p-4 shadow-sm">
          <div className="text-xs text-slate-400 font-semibold">Employee Advances / Receivable (ایڈوانس رقم)</div>
          <div className="text-2xl font-black text-rose-400 font-mono mt-1">
            {formatCurrency(totalAdvancesReceivable)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Recoverable via monthly salary deductions
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('EMPLOYEES')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'EMPLOYEES'
              ? 'bg-cyan-500 text-slate-950 shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          Staff Directory (ملازمین فہرست) ({employees.length})
        </button>
        <button
          onClick={() => setActiveTab('SALARY_SLIPS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'SALARY_SLIPS'
              ? 'bg-cyan-500 text-slate-950 shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          Salary Slips &amp; Payroll (تنخواہوں کی سلپس) ({salarySlips.length})
        </button>
        <button
          onClick={() => setActiveTab('ADVANCES')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'ADVANCES'
              ? 'bg-cyan-500 text-slate-950 shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          Employee Advances Ledger (ایڈوانس کھاتہ)
        </button>
      </div>

      {/* Tab 1: Staff Directory */}
      {activeTab === 'EMPLOYEES' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="relative w-full max-w-sm">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search staff by name, code or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {employees
              .filter(
                (emp) =>
                  emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  emp.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  emp.designation.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((emp) => (
                <div
                  key={emp.id}
                  className="bg-[#072836]/90 border border-[#0d556e]/80 rounded-2xl p-4.5 hover:border-cyan-500/50 transition-all shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          {emp.employeeCode}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {emp.status}
                        </span>
                      </div>
                      <h3 className="text-sm font-black text-white mt-1.5">{emp.name}</h3>
                      <p className="text-xs text-slate-300 font-medium">{emp.designation}</p>
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 shrink-0 font-bold">
                      {emp.name.charAt(0)}
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-slate-300 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/80">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Phone:</span>
                      <span className="font-mono text-white">{emp.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">CNIC:</span>
                      <span className="font-mono text-white">{emp.cnic}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Basic Salary:</span>
                      <span className="font-mono font-bold text-white">
                        {formatCurrency(emp.basicSalary)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Allowance:</span>
                      <span className="font-mono text-slate-300">
                        {formatCurrency(emp.allowance)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-slate-800 pt-1 mt-1 font-bold">
                      <span className="text-rose-400">Advance Balance:</span>
                      <span className="font-mono text-rose-400">
                        {formatCurrency(emp.advanceBalance)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => handleOpenAdvance(emp)}
                      className="px-2.5 py-1.5 text-[11px] font-bold rounded-lg bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/30 transition-colors cursor-pointer"
                    >
                      + Give Advance
                    </button>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenGenerateSlip(emp)}
                        className="px-2.5 py-1.5 text-[11px] font-bold rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/30 transition-colors cursor-pointer"
                      >
                        Salary Slip
                      </button>
                      <button
                        onClick={() => handleOpenEditEmployee(emp)}
                        className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                        title="Edit Employee"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {employees.length > 1 && (
                        <button
                          onClick={() => {
                            if (confirm(`Delete employee ${emp.name}?`)) {
                              deleteEmployee(emp.id);
                            }
                          }}
                          className="p-1.5 text-rose-400 hover:text-rose-300 bg-rose-950/40 rounded-lg hover:bg-rose-900/60 transition-colors cursor-pointer"
                          title="Delete Employee"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Tab 2: Salary Slips Table */}
      {activeTab === 'SALARY_SLIPS' && (
        <div className="space-y-4">
          <div className="bg-[#072836] border border-[#0d556e]/80 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-black text-white">Issued Salary Slips Register</h3>
              <button
                onClick={() => handleOpenGenerateSlip()}
                className="px-3 py-1.5 text-xs font-bold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors cursor-pointer"
              >
                + New Salary Slip
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/60 text-slate-400 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Slip #</th>
                    <th className="p-3.5">Employee Name</th>
                    <th className="p-3.5">Month</th>
                    <th className="p-3.5 text-right">Basic</th>
                    <th className="p-3.5 text-right">Allowances</th>
                    <th className="p-3.5 text-right">Deductions</th>
                    <th className="p-3.5 text-right">Advance Cut</th>
                    <th className="p-3.5 text-right font-black text-white">Net Salary</th>
                    <th className="p-3.5 text-center">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {salarySlips.map((slip) => (
                    <tr key={slip.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-cyan-400">
                        {slip.slipNumber}
                      </td>
                      <td className="p-3.5 font-semibold text-white">
                        <div>{slip.employeeName}</div>
                        <div className="text-[11px] text-slate-400">{slip.designation}</div>
                      </td>
                      <td className="p-3.5 font-mono">{slip.month}</td>
                      <td className="p-3.5 font-mono text-right">{formatCurrency(slip.basicSalary)}</td>
                      <td className="p-3.5 font-mono text-right text-emerald-400">
                        +{formatCurrency(slip.allowances + slip.bonus)}
                      </td>
                      <td className="p-3.5 font-mono text-right text-rose-400">
                        -{formatCurrency(slip.deductions)}
                      </td>
                      <td className="p-3.5 font-mono text-right text-rose-400">
                        -{formatCurrency(slip.advanceDeduction)}
                      </td>
                      <td className="p-3.5 font-mono font-black text-right text-white text-sm">
                        {formatCurrency(slip.netSalary)}
                      </td>
                      <td className="p-3.5 text-center">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            slip.paymentStatus === 'PAID'
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                          }`}
                        >
                          {slip.paymentStatus}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {slip.paymentStatus === 'PENDING' && (
                            <button
                              onClick={() => {
                                setTargetSlipToPay(slip);
                                setIsPaySlipOpen(true);
                              }}
                              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
                            >
                              Pay Now
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedSalarySlipForPrint(slip)}
                            className="p-1.5 text-cyan-400 hover:text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                            title="Print Salary Slip"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete salary slip ${slip.slipNumber}?`)) {
                                deleteSalarySlip(slip.id);
                              }
                            }}
                            className="p-1.5 text-rose-400 hover:text-rose-300 bg-rose-950/40 rounded-lg hover:bg-rose-900/60 transition-colors cursor-pointer"
                            title="Delete Slip"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Advances Ledger */}
      {activeTab === 'ADVANCES' && (
        <div className="bg-[#072836] border border-[#0d556e]/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white">Employee Advances &amp; Loans Summary</h3>
            <span className="text-xs font-mono font-bold text-rose-400">
              Total Outstanding: {formatCurrency(totalAdvancesReceivable)}
            </span>
          </div>

          <div className="divide-y divide-slate-800">
            {employees.map((emp) => (
              <div key={emp.id} className="py-3.5 flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-white text-xs">{emp.name} ({emp.employeeCode})</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Designation: {emp.designation} · Phone: {emp.phone}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-400">Outstanding Balance</div>
                    <div className="text-sm font-mono font-black text-rose-400">
                      {formatCurrency(emp.advanceBalance)}
                    </div>
                  </div>
                  <button
                    onClick={() => handleOpenAdvance(emp)}
                    className="px-3 py-1.5 text-xs font-bold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors cursor-pointer"
                  >
                    + Issue Advance
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal 1: Add/Edit Employee Modal */}
      {isAddEmployeeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-lg bg-[#072836] border border-[#0d556e] rounded-3xl p-6 shadow-2xl space-y-4 my-auto">
            <h3 className="text-base font-black text-white">
              {editingEmployee ? 'Edit Employee Record' : 'Register New Employee (نیا ملازم)'}
            </h3>

            <form onSubmit={handleSaveEmployee} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Employee Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={empCode}
                    onChange={(e) => setEmpCode(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={empName}
                    onChange={(e) => setEmpName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Designation (عہدہ) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Chip-Level Tech"
                    value={empDesignation}
                    onChange={(e) => setEmpDesignation(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Mobile Phone *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+92 300 ..."
                    value={empPhone}
                    onChange={(e) => setEmpPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    CNIC Number
                  </label>
                  <input
                    type="text"
                    placeholder="35201-..."
                    value={empCnic}
                    onChange={(e) => setEmpCnic(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Joining Date
                  </label>
                  <input
                    type="date"
                    value={empJoiningDate}
                    onChange={(e) => setEmpJoiningDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Basic Salary (Rs.) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={empBasicSalary}
                    onChange={(e) => setEmpBasicSalary(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Fixed Allowance (Rs.)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={empAllowance}
                    onChange={(e) => setEmpAllowance(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddEmployeeOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 cursor-pointer"
                >
                  Save Employee (محفوظ کریں)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Issue Advance Modal */}
      {isAdvanceModalOpen && selectedEmpForAdvance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#072836] border border-[#0d556e] rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-black text-white">
              Issue Salary Advance to {selectedEmpForAdvance.name}
            </h3>

            <form onSubmit={handleSaveAdvance} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Advance Amount (رقم ایڈوانس - Rs.) *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="e.g. 10000"
                  value={advAmount}
                  onChange={(e) => setAdvAmount(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white font-mono font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Disburse From Bank / Cash Account *
                </label>
                <select
                  value={advBankAccountId}
                  onChange={(e) => setAdvBankAccountId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white font-medium"
                >
                  {bankAccounts.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.accountName} ({formatCurrency(b.currentBalance)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Notes / Reason
                </label>
                <input
                  type="text"
                  placeholder="e.g. Medical emergency advance"
                  value={advNotes}
                  onChange={(e) => setAdvNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAdvanceModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 cursor-pointer"
                >
                  Confirm &amp; Disburse Advance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Generate Salary Slip Modal */}
      {isGenerateSlipOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-lg bg-[#072836] border border-[#0d556e] rounded-3xl p-6 shadow-2xl space-y-4 my-auto">
            <h3 className="text-base font-black text-white">
              Generate Monthly Salary Slip (ماہانہ تنخواہ سلپ)
            </h3>

            <form onSubmit={handleSaveSalarySlip} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Select Employee *
                  </label>
                  <select
                    value={slipEmpId}
                    onChange={(e) => handleSlipEmployeeSelect(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white font-medium"
                  >
                    {employees.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name} ({e.employeeCode})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Salary Month (مہینہ) *
                  </label>
                  <input
                    type="month"
                    required
                    value={slipMonth}
                    onChange={(e) => setSlipMonth(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Basic Salary (Rs.) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={slipBasic}
                    onChange={(e) => setSlipBasic(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Allowances (الاؤنسز)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={slipAllowances}
                    onChange={(e) => setSlipAllowances(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Performance Bonus (بونس)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={slipBonus}
                    onChange={(e) => setSlipBonus(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    General Deductions (کٹوتیاں)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={slipDeductions}
                    onChange={(e) => setSlipDeductions(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Advance Deduction (ایڈوانس کٹوتی)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={slipAdvDeduction}
                    onChange={(e) => setSlipAdvDeduction(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-rose-400 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Net Take-Home Salary:
                  </label>
                  <div className="px-3 py-2 rounded-xl bg-slate-950 border border-cyan-500/50 text-cyan-400 font-mono font-black text-sm">
                    {formatCurrency(Math.max(0, calculatedNetSalary))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsGenerateSlipOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                >
                  Generate &amp; Save Slip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Confirm Pay Slip Modal */}
      {isPaySlipOpen && targetSlipToPay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#072836] border border-[#0d556e] rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-black text-white">
              Disburse Salary — {targetSlipToPay.slipNumber}
            </h3>
            <p className="text-xs text-slate-300">
              Employee: <span className="font-bold text-white">{targetSlipToPay.employeeName}</span> · Net Payable:{' '}
              <span className="font-bold text-cyan-400 font-mono">{formatCurrency(targetSlipToPay.netSalary)}</span>
            </p>

            <form onSubmit={handleConfirmPaySlip} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Payment Method
                </label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as 'CASH' | 'BANK')}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white"
                >
                  <option value="CASH">Counter Cash</option>
                  <option value="BANK">Bank Account / IBFT Transfer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Pay From Account
                </label>
                <select
                  value={payBankAccountId}
                  onChange={(e) => setPayBankAccountId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white font-medium"
                >
                  {bankAccounts.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.accountName} ({formatCurrency(b.currentBalance)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPaySlipOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                >
                  Confirm &amp; Disburse Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
