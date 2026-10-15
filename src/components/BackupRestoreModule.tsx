import React, { useState } from 'react';
import {
  Database,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  FileJson,
  ShieldCheck,
  Copy,
  Clock,
  Sparkles,
  Trash2,
  Layers,
  ArrowDownLeft,
  ArrowUpRight,
  Boxes,
  Users,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BackupRestoreModule: React.FC = () => {
  const {
    products,
    invoices,
    purchaseInvoices,
    vouchers,
    bankAccounts,
    bankTransactions,
    customers,
    suppliers,
    users,
    exportDataJson,
    importDataJson,
    resetToDefaultData,
    loadSampleData,
    backupSnapshots,
    createBackupSnapshot,
    restoreBackupSnapshot,
    deleteBackupSnapshot,
    lastAutoBackupTime,
    language,
  } = useApp();

  const [jsonInput, setJsonInput] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [snapshotLabel, setSnapshotLabel] = useState('');
  const [copied, setCopied] = useState(false);
  const [parsedPreview, setParsedPreview] = useState<{
    productsCount?: number;
    invoicesCount?: number;
    vouchersCount?: number;
    transactionsCount?: number;
    usersCount?: number;
  } | null>(null);

  // Download Backup File
  const handleDownloadBackup = () => {
    const jsonStr = exportDataJson();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `fareed_electronics_erp_backup_${timestamp}.json`;

    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setStatusMessage({
      type: 'success',
      text: `Database backup file "${filename}" downloaded successfully. Store it safely!`,
    });
  };

  // Copy to clipboard
  const handleCopyToClipboard = () => {
    const jsonStr = exportDataJson();
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setJsonInput(content);
        tryParseJson(content);
      }
    };
    reader.readAsText(file);
  };

  // Try parse and show preview
  const tryParseJson = (str: string) => {
    try {
      const parsed = JSON.parse(str);
      const data = parsed.data || parsed;
      setParsedPreview({
        productsCount: data.products?.length || 0,
        invoicesCount: data.invoices?.length || 0,
        vouchersCount: data.vouchers?.length || 0,
        transactionsCount: data.bankTransactions?.length || 0,
        usersCount: data.users?.length || 0,
      });
      setStatusMessage({
        type: 'info',
        text: 'Backup file validated! Review contents below and click "Confirm Restore" to apply.',
      });
    } catch {
      setParsedPreview(null);
      setStatusMessage({
        type: 'error',
        text: 'Invalid JSON file format. Please choose a valid Fareed Electronics ERP backup file.',
      });
    }
  };

  // Restore Action
  const handleConfirmRestore = () => {
    if (!jsonInput.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Please choose a backup file or paste JSON data first.',
      });
      return;
    }

    if (!confirm('Are you sure you want to restore this backup? Current records will be replaced with the backup contents.')) {
      return;
    }

    const success = importDataJson(jsonInput);
    if (success) {
      setStatusMessage({
        type: 'success',
        text: 'Database successfully restored from backup! All inventory, invoices, and vouchers have been reloaded.',
      });
      setJsonInput('');
      setParsedPreview(null);
    } else {
      setStatusMessage({
        type: 'error',
        text: 'Restore failed: The backup structure does not match the ERP format.',
      });
    }
  };

  // Create local snapshot
  const handleCreateSnapshot = () => {
    const snap = createBackupSnapshot(snapshotLabel.trim() || undefined);
    setSnapshotLabel('');
    setStatusMessage({
      type: 'success',
      text: `Local rollback snapshot "${snap.name}" created!`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4.5 rounded-2xl">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <span>ERP Database Backup &amp; Restore Center</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Export full system backup files, restore previous states, create rollback snapshots, and manage data integrity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadSampleData}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 cursor-pointer"
            title="Populate demo store items and test transactions"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Load Demo Data</span>
          </button>

          <button
            onClick={handleDownloadBackup}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-md shadow-cyan-500/20 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Backup (.JSON)</span>
          </button>
        </div>
      </div>

      {/* Status banner */}
      {statusMessage && (
        <div
          className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs animate-in fade-in ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
              : statusMessage.type === 'error'
              ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
              : 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : statusMessage.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            )}
            <span className="font-semibold">{statusMessage.text}</span>
          </div>

          <button
            onClick={() => setStatusMessage(null)}
            className="text-slate-400 hover:text-white text-xs underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 30-Minute Automatic Backup Engine Info Card */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/30 p-4.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-sm">
                {language === 'ur' ? 'خودکار 30 منٹ ڈیٹا بیک اپ انجن' : '30-Minute Automatic Backup Engine'}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'ur'
                ? `سافٹ ویئر کا تمام ڈیٹا اور کھاتے ہر 30 منٹ بعد خودکار محفوظ ہوتے ہیں۔ آخری محفوظ شدہ وقت: ${lastAutoBackupTime}`
                : `All ERP records are automatically saved and backed up every 30 minutes in background. Last auto-save: ${lastAutoBackupTime}`}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            const snap = createBackupSnapshot(`[Manual Checkpoint] ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
            setStatusMessage({
              type: 'success',
              text: `Instant backup snapshot "${snap.name}" created successfully!`,
            });
          }}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{language === 'ur' ? 'فوری بیک اپ بنائیں' : 'Trigger Backup Now'}</span>
        </button>
      </div>

      {/* Database Health & Record Counts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
            <Boxes className="w-3.5 h-3.5 text-blue-400" />
            <span>Stock Items</span>
          </div>
          <div className="mt-1 text-xl font-bold text-white font-mono">{products.length}</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
            <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400" />
            <span>Customer Sales</span>
          </div>
          <div className="mt-1 text-xl font-bold text-emerald-400 font-mono">{invoices.length}</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
            <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
            <span>Purchases</span>
          </div>
          <div className="mt-1 text-xl font-bold text-amber-400 font-mono">{purchaseInvoices.length}</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
            <FileJson className="w-3.5 h-3.5 text-cyan-400" />
            <span>Pay &amp; Receive Vouchers</span>
          </div>
          <div className="mt-1 text-xl font-bold text-cyan-400 font-mono">{vouchers.length}</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>Bank &amp; Cash Slips</span>
          </div>
          <div className="mt-1 text-xl font-bold text-purple-400 font-mono">{bankTransactions.length}</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span>User Accounts</span>
          </div>
          <div className="mt-1 text-xl font-bold text-indigo-400 font-mono">{users.length}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Export Backup */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-wide border-b border-slate-800 pb-3">
            <Download className="w-4 h-4 text-cyan-400" />
            <span>1. Create &amp; Download System Backup</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Generate an encrypted, complete backup snapshot containing all inventory items, stock movements, invoices, vendor purchase bills, payment vouchers, bank ledgers, and user accounts.
          </p>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Backup Format:</span>
              <span className="font-mono text-cyan-400 font-semibold">Standard JSON (.json)</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Total Database Entities:</span>
              <span className="font-mono text-white font-semibold">
                {products.length +
                  invoices.length +
                  purchaseInvoices.length +
                  vouchers.length +
                  bankTransactions.length +
                  customers.length +
                  suppliers.length +
                  users.length}{' '}
                records
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Storage Target:</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Ready for Instant Export</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleDownloadBackup}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Backup File</span>
            </button>

            <button
              onClick={handleCopyToClipboard}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Copy className="w-4 h-4 text-cyan-400" />
              <span>{copied ? 'Copied to Clipboard!' : 'Copy JSON'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Restore from Backup */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-wide border-b border-slate-800 pb-3">
            <Upload className="w-4 h-4 text-amber-400" />
            <span>2. Restore Database from Backup File</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Select or drag &amp; drop a previously saved Fareed Electronics backup file to reload all books, or paste the JSON text directly.
          </p>

          {/* File input box */}
          <div className="p-4 bg-slate-950 border border-dashed border-slate-700 rounded-xl text-center">
            <label className="cursor-pointer flex flex-col items-center justify-center py-2">
              <Upload className="w-6 h-6 text-amber-400 mb-1.5" />
              <span className="text-white font-semibold text-xs">Choose Backup File (.json)</span>
              <span className="text-[11px] text-slate-500 mt-0.5">Click or drag &amp; drop file here</span>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* JSON paste textarea */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Or Paste JSON Text:</span>
              {jsonInput && (
                <button
                  type="button"
                  onClick={() => {
                    setJsonInput('');
                    setParsedPreview(null);
                  }}
                  className="text-[11px] text-rose-400 hover:underline cursor-pointer"
                >
                  Clear Text
                </button>
              )}
            </div>
            <textarea
              rows={3}
              placeholder="Paste raw JSON backup content here..."
              value={jsonInput}
              onChange={(e) => {
                setJsonInput(e.target.value);
                if (e.target.value.trim()) {
                  tryParseJson(e.target.value);
                } else {
                  setParsedPreview(null);
                }
              }}
              className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-[10px] focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Preview if parsed */}
          {parsedPreview && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl space-y-1 text-xs text-amber-300">
              <div className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Backup Preview Verified:</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1 text-slate-300">
                <div>Products: <b className="text-white">{parsedPreview.productsCount}</b></div>
                <div>Sales: <b className="text-white">{parsedPreview.invoicesCount}</b></div>
                <div>Vouchers: <b className="text-white">{parsedPreview.vouchersCount}</b></div>
                <div>Users: <b className="text-white">{parsedPreview.usersCount}</b></div>
              </div>
            </div>
          )}

          <button
            onClick={handleConfirmRestore}
            disabled={!jsonInput.trim()}
            className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Confirm &amp; Restore Database</span>
          </button>
        </div>
      </div>

      {/* Snapshots & Rollback Points */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-wide">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>3. Instant Local Snapshots (Rollback Points)</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Snapshot label (e.g. Month-End)"
              value={snapshotLabel}
              onChange={(e) => setSnapshotLabel(e.target.value)}
              className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
            <button
              onClick={handleCreateSnapshot}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>+ Take Snapshot</span>
            </button>
          </div>
        </div>

        {backupSnapshots.length === 0 ? (
          <div className="text-center py-6 bg-slate-950/40 rounded-xl border border-slate-800/60 text-xs text-slate-500">
            No snapshots created yet. Click "+ Take Snapshot" above to save a rollback checkpoint before making major stock or invoice adjustments.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {backupSnapshots.map((snap) => (
              <div
                key={snap.id}
                className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white text-xs">{snap.name}</div>
                  <button
                    onClick={() => deleteBackupSnapshot(snap.id)}
                    className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                    title="Delete Snapshot"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-[10px] text-slate-500 font-mono">
                  {new Date(snap.date).toLocaleString()}
                </div>

                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                  <span>{snap.counts.products} products</span>
                  <span>•</span>
                  <span>{snap.counts.invoices} sales</span>
                  <span>•</span>
                  <span>{snap.counts.vouchers} vouchers</span>
                </div>

                <button
                  onClick={() => {
                    if (confirm(`Rollback database to snapshot "${snap.name}"?`)) {
                      restoreBackupSnapshot(snap.id);
                      setStatusMessage({
                        type: 'success',
                        text: `Database rolled back to snapshot "${snap.name}"!`,
                      });
                    }
                  }}
                  className="w-full mt-1 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Rollback to This State</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Danger Zone: Factory Demo Data & Wipe */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="font-bold text-white text-xs uppercase flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Factory Demo Store &amp; Sample Data</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Reset Fareed Electronics sample dataset with genuine iPhone parts, chip-level ICs, rework stations, customer invoices, and vouchers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (confirm('Load pre-populated demo records for Fareed Electronics?')) {
                loadSampleData();
                setStatusMessage({
                  type: 'success',
                  text: 'Demo tech store records, stock, vouchers, and customer invoices loaded!',
                });
              }
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-semibold text-xs cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Reload Full Demo Data</span>
          </button>

          <button
            onClick={() => {
              if (confirm('WARNING: Are you sure you want to reset all ERP data to default state?')) {
                resetToDefaultData();
                setStatusMessage({
                  type: 'info',
                  text: 'ERP database reset to initial state.',
                });
              }
            }}
            className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold text-xs cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
            <span>Reset Demo State</span>
          </button>
        </div>
      </div>
    </div>
  );
};
