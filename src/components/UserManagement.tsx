import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  ShieldCheck,
  KeyRound,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  X,
  Phone,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  Shield,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserAccount, UserRole } from '../types';

export const UserManagement: React.FC = () => {
  const { users, currentUser, addUser, updateUser, deleteUser, deleteAllOtherUsers } = useApp();

  const isAdmin = currentUser?.role === 'ADMIN';

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [targetPasswordUser, setTargetPasswordUser] = useState<UserAccount | null>(null);

  // Form states for New User
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('CASHIER');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [actionNotification, setActionNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Form states for Change Password
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordModalError, setPasswordModalError] = useState('');
  const [passwordModalSuccess, setPasswordModalSuccess] = useState('');

  // Handle Create New User
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    const cleanUsername = username.trim().toLowerCase();

    if (cleanUsername.length < 3) {
      setFormError('Username must be at least 3 characters long.');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match. Please verify.');
      return;
    }

    const res = addUser({
      username: cleanUsername,
      password,
      fullName: fullName.trim(),
      role,
      phone: phone.trim() || undefined,
      status: 'ACTIVE',
    });

    if (!res.success) {
      setFormError(res.error || 'Failed to create user account.');
      return;
    }

    setFormSuccess(`User account "${cleanUsername}" created successfully!`);
    setTimeout(() => {
      setIsAddModalOpen(false);
      resetAddForm();
    }, 1200);
  };

  const resetAddForm = () => {
    setFullName('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setRole('CASHIER');
    setPhone('');
    setFormError('');
    setFormSuccess('');
    setShowPassword(false);
  };

  // Handle Edit User
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    updateUser(editingUser.id, {
      fullName: editingUser.fullName,
      phone: editingUser.phone,
      role: editingUser.role,
      status: editingUser.status,
    });

    setEditingUser(null);
  };

  // Handle Password Reset
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordModalError('');
    setPasswordModalSuccess('');

    if (!targetPasswordUser) return;

    if (newPassword.length < 6) {
      setPasswordModalError('Password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordModalError('Passwords do not match.');
      return;
    }

    updateUser(targetPasswordUser.id, { password: newPassword });
    setPasswordModalSuccess('Password updated successfully!');

    setTimeout(() => {
      setIsPasswordModalOpen(false);
      setTargetPasswordUser(null);
      setNewPassword('');
      setConfirmNewPassword('');
      setPasswordModalSuccess('');
    }, 1200);
  };

  const getRoleBadge = (roleName: UserRole) => {
    switch (roleName) {
      case 'ADMIN':
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-cyan-400" />
            <span>ADMIN / PROPRIETOR</span>
          </span>
        );
      case 'ACCOUNTANT':
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <UserCheck className="w-3 h-3 text-emerald-400" />
            <span>ACCOUNTANT</span>
          </span>
        );
      case 'CASHIER':
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
            <Users className="w-3 h-3 text-amber-400" />
            <span>CASHIER / POS</span>
          </span>
        );
      case 'LAB_TECH':
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>LAB TECHNICIAN</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4.5 rounded-2xl">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <span>User Accounts &amp; Access Control</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Create new operators, define passwords, assign roles (Admin, Accountant, Cashier, Lab Tech).
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {isAdmin && (
            <button
              onClick={() => setIsDeleteAllModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/40 font-bold text-xs shadow-md transition-all cursor-pointer"
              title="Admin Can Delete All Users"
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>Delete All Users (سوائے ایڈمن)</span>
            </button>
          )}

          <button
            onClick={() => {
              if (!isAdmin) {
                setActionNotification({
                  type: 'error',
                  message: 'Only Administrator can create new users (صرف ایڈمن نیا یوزر بنا سکتا ہے).',
                });
                return;
              }
              resetAddForm();
              setIsAddModalOpen(true);
            }}
            disabled={!isAdmin}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all ${
              isAdmin
                ? 'bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 cursor-pointer shadow-cyan-500/20'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Create New User</span>
          </button>
        </div>
      </div>

      {actionNotification && (
        <div
          className={`p-3.5 rounded-2xl flex items-center justify-between text-xs animate-in fade-in ${
            actionNotification.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : actionNotification.type === 'error'
              ? 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
              : 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-300'
          }`}
        >
          <div className="flex items-center gap-2 font-medium">
            {actionNotification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{actionNotification.message}</span>
          </div>
          <button
            onClick={() => setActionNotification(null)}
            className="text-slate-400 hover:text-white px-2 py-0.5 rounded cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {!isAdmin && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>
            <b>Admin Permission Restricted:</b> User creation and password changes are strictly limited to Administrator only (صرف ایڈمن نیا یوزر بنا سکتا ہے اور پاسورڈ تبدیل کر سکتا ہے).
          </span>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <div className="text-xs text-slate-400">Total System Users</div>
          <div className="mt-1 text-2xl font-black text-white font-mono">{users.length}</div>
          <div className="text-[10px] text-slate-500 mt-1">Authorized ERP logins</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <div className="text-xs text-slate-400">Administrators</div>
          <div className="mt-1 text-2xl font-black text-cyan-400 font-mono">
            {users.filter((u) => u.role === 'ADMIN').length}
          </div>
          <div className="text-[10px] text-cyan-400/80 mt-1">Full master permissions</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <div className="text-xs text-slate-400">Cashiers &amp; Accounts</div>
          <div className="mt-1 text-2xl font-black text-emerald-400 font-mono">
            {users.filter((u) => u.role === 'CASHIER' || u.role === 'ACCOUNTANT').length}
          </div>
          <div className="text-[10px] text-emerald-400/80 mt-1">POS &amp; billing operators</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <div className="text-xs text-slate-400">Active Operators</div>
          <div className="mt-1 text-2xl font-black text-blue-400 font-mono">
            {users.filter((u) => u.status === 'ACTIVE').length}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Enabled credentials</div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Authorized Operators Directory</span>
          </div>
          <span className="text-xs text-slate-500 font-mono">{users.length} registered</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 font-semibold border-b border-slate-800 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Operator Name</th>
                <th className="py-3 px-4">Username</th>
                <th className="py-3 px-4">Access Role</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.map((u) => {
                const isCurrent = currentUser?.id === u.id;

                return (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white font-bold text-xs uppercase shadow-sm">
                          {u.fullName.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{u.fullName}</span>
                            {isCurrent && (
                              <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                                Current You
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">ID: {u.id}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono text-cyan-300 font-bold bg-slate-950 px-2 py-1 rounded border border-slate-800">
                        {u.username}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">{getRoleBadge(u.role)}</td>

                    <td className="py-3.5 px-4 text-slate-300 font-mono">
                      {u.phone || <span className="text-slate-600 italic">None</span>}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${
                          u.status === 'ACTIVE'
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {u.lastLogin || <span className="text-slate-600">Never</span>}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {isAdmin ? (
                          <button
                            onClick={() => {
                              setTargetPasswordUser(u);
                              setNewPassword('');
                              setConfirmNewPassword('');
                              setPasswordModalError('');
                              setPasswordModalSuccess('');
                              setIsPasswordModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="Admin: Reset / Change Password"
                          >
                            <KeyRound className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="p-1.5 text-slate-600 opacity-40" title="Password change restricted to Admin">
                            <Lock className="w-3.5 h-3.5" />
                          </span>
                        )}

                        <button
                          onClick={() => setEditingUser({ ...u })}
                          className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="Edit User Profile"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (isCurrent) {
                              setActionNotification({
                                type: 'error',
                                message: 'You cannot delete your own logged-in account (اپنا ایکٹو لاگ ان اکاؤنٹ ڈیلیٹ نہیں کر سکتے).',
                              });
                              return;
                            }
                            if (users.length <= 1) {
                              setActionNotification({
                                type: 'error',
                                message: 'Cannot delete the last remaining operator in the system.',
                              });
                              return;
                            }
                            deleteUser(u.id);
                            setActionNotification({
                              type: 'success',
                              message: `User "${u.fullName}" (${u.username}) removed successfully.`,
                            });
                          }}
                          disabled={isCurrent}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                          title={isCurrent ? 'Cannot delete active account' : 'Delete User'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Permissions Reference */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span>Role Permissions Matrix</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
            <div className="font-bold text-cyan-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin / Proprietor</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Unrestricted control: company settings, add/delete users, password resets, stock adjustments, full P&amp;L reports, data backups.
            </p>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
            <div className="font-bold text-emerald-400 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Accountant</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Sales invoices, supplier purchases, payment &amp; receipt vouchers, bank accounts, ledgers, and profit &amp; loss analysis.
            </p>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
            <div className="font-bold text-amber-400 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>Cashier / POS</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Fast counter billing, customer receipt printing, cash drawer deposits, and customer invoice tracking.
            </p>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
            <div className="font-bold text-indigo-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Lab Technician</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Chip-level parts catalog, lab equipment registry, repair parts consumption, and service invoices.
            </p>
          </div>
        </div>
      </div>

      {/* Modal: Create New User */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative space-y-5">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Create New ERP User</h2>
                <p className="text-xs text-slate-400">Add an authorized staff member to Fareed Electronics</p>
              </div>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kamran Akram"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Username *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. kamran_cashier"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Password *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Min 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono placeholder-slate-500 focus:border-cyan-500 focus:outline-none pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Confirm Password *</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">System Role *</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-semibold focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="CASHIER">Cashier (Front Desk &amp; POS)</option>
                    <option value="ACCOUNTANT">Accountant (Invoices &amp; Banking)</option>
                    <option value="LAB_TECH">Lab Technician (Diagnostics &amp; Stock)</option>
                    <option value="ADMIN">Admin (Full Access &amp; Config)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone Number (Optional)</label>
                  <input
                    type="text"
                    placeholder="+92 300 1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20 cursor-pointer"
                >
                  Save New Operator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Change Password */}
      {isPasswordModalOpen && targetPasswordUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setIsPasswordModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Reset User Password</h2>
                <p className="text-xs text-slate-400">
                  Updating credentials for <span className="text-cyan-400 font-mono font-bold">{targetPasswordUser.username}</span>
                </p>
              </div>
            </div>

            {passwordModalError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{passwordModalError}</span>
              </div>
            )}

            {passwordModalSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{passwordModalSuccess}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">New Secret Password</label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Repeat New Password</label>
                <input
                  type="password"
                  required
                  placeholder="Confirm password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit User */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setEditingUser(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Edit2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Edit Operator Profile</h2>
                <p className="text-xs text-slate-400">
                  Update role or details for <span className="font-mono text-cyan-400">{editingUser.username}</span>
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingUser.fullName}
                  onChange={(e) => setEditingUser({ ...editingUser, fullName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editingUser.phone || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Role</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, role: e.target.value as UserRole })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-semibold focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="CASHIER">Cashier</option>
                    <option value="ACCOUNTANT">Accountant</option>
                    <option value="LAB_TECH">Lab Tech</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Status</label>
                  <select
                    value={editingUser.status}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        status: e.target.value as 'ACTIVE' | 'INACTIVE',
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-semibold focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-500/20 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete All Users Confirmation Modal (Admin Can Delete All User Option) */}
      {isDeleteAllModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/50 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Delete All Operator Accounts?</h3>
                <p className="text-xs text-rose-300">تمام اضافی یوزرز اور آپریٹرز کو حذف کریں</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              This action will permanently delete all cashier, accountant, and technician user accounts from the database.
              <br /><br />
              <b className="text-cyan-300">Security Safeguard:</b> The active logged-in Administrator and Master Owner account (<span className="font-mono text-cyan-200">bhattijee695@gmail.com</span>) will be safely preserved.
            </p>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsDeleteAllModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel (منسوخ)
              </button>
              <button
                type="button"
                onClick={() => {
                  const res = deleteAllOtherUsers();
                  setIsDeleteAllModalOpen(false);
                  setActionNotification({
                    type: 'success',
                    message: `Successfully removed ${res.deletedCount} user accounts. Active admin account preserved.`,
                  });
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 cursor-pointer"
              >
                Yes, Delete All Users (ہاں، تمام حذف کریں)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
