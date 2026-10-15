/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginScreen } from './components/LoginScreen';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { StockManagement } from './components/StockManagement';
import { StockReports } from './components/StockReports';
import { CustomerInvoices } from './components/CustomerInvoices';
import { PurchaseInvoices } from './components/PurchaseInvoices';
import { BankingModule } from './components/BankingModule';
import { PartiesModule } from './components/PartiesModule';
import { FinancialReports } from './components/FinancialReports';
import { SettingsModule } from './components/SettingsModule';
import { VouchersLedger } from './components/VouchersLedger';
import { UserManagement } from './components/UserManagement';
import { BackupRestoreModule } from './components/BackupRestoreModule';
import { ReceivePaymentModal } from './components/ReceivePaymentModal';
import { PayableVoucherModal } from './components/PayableVoucherModal';
import { PrintInvoiceModal } from './components/PrintInvoiceModal';
import { PrintVoucherModal } from './components/PrintVoucherModal';
import { ImageViewerModal } from './components/ImageViewerModal';
import { NewCustomerModal } from './components/NewCustomerModal';
import { KeyboardShortcutsManager } from './components/KeyboardShortcutsManager';
import { WhatsAppInvoiceModal } from './components/WhatsAppInvoiceModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { ChequeSearchModal } from './components/ChequeSearchModal';
import { ClearDemoDataModal } from './components/ClearDemoDataModal';
import { JournalVoucherModal } from './components/JournalVoucherModal';
import { BankEntryModal } from './components/BankEntryModal';
import { NewProductModal } from './components/NewProductModal';
import { BiltyUpdateModal } from './components/BiltyUpdateModal';
import { AccountInformationModal } from './components/AccountInformationModal';
import { EmployeesPayrollModule } from './components/EmployeesPayrollModule';
import { PrintSalarySlipModal } from './components/PrintSalarySlipModal';
import { DayBookModule } from './components/DayBookModule';
import { PriceListManagement } from './components/PriceListManagement';
import { UserActivityLogReport } from './components/UserActivityLogReport';
import { CustomerSupplierLedger } from './components/CustomerSupplierLedger';
import { AccountInformationPage } from './components/AccountInformationPage';
import { PendingChequesWarningBanner } from './components/PendingChequesWarningBanner';
import { SaleReturnModal } from './components/SaleReturnModal';
import { CustomerLedgerModal } from './components/CustomerLedgerModal';
import { TagPrintingModal } from './components/TagPrintingModal';
import { StockAdjustmentModal } from './components/StockAdjustmentModal';
import { PrintPreviewModal } from './components/PrintPreviewModal';
import { StartupSplashScreen } from './components/StartupSplashScreen';
import { AIAgentGuideModal, FloatingAIGuideButton } from './components/AIAgentGuideModal';
import { CustomerManagement } from './components/CustomerManagement';

const AppContent: React.FC = () => {
  const {
    currentUser,
    activeTab,
    setActiveTab,
    theme,
    selectedCustomerForLedger,
    setSelectedCustomerForLedger,
    isStartupSplashVisible,
    setIsStartupSplashVisible,
  } = useApp();

  // 10-Second Startup GIF-Style Logo Animation when opening software
  if (isStartupSplashVisible) {
    return <StartupSplashScreen onComplete={() => setIsStartupSplashVisible(false)} durationSeconds={10} />;
  }

  // If no user is logged in, show software opening Login Screen
  if (!currentUser) {
    return <LoginScreen />;
  }

  const isPeacock = theme === 'peacock-blue';

  return (
    <div
      className={`min-h-screen text-slate-100 flex flex-col font-sans transition-colors ${
        isPeacock ? 'bg-[#041a24]' : 'bg-slate-950'
      }`}
    >
      {/* Top Navigation & Action Header */}
      <Header
        onQuickSale={() => setActiveTab('customer-invoices')}
        onQuickPurchase={() => setActiveTab('purchase-invoices')}
        onQuickBanking={() => setActiveTab('banking')}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Viewport Content */}
        <main
          className={`flex-1 overflow-y-auto p-4 md:p-6 transition-colors ${
            isPeacock
              ? 'bg-gradient-to-b from-[#051f2b] via-[#072836] to-[#041620]'
              : 'bg-gradient-to-b from-slate-950 to-[#070b14]'
          }`}
        >
          <div className="max-w-7xl mx-auto pb-12 space-y-5">
            {/* Continuous All Time Pending Cheque Warning & Audio Reminder */}
            <PendingChequesWarningBanner />

            {activeTab === 'dashboard' && (
              <Dashboard
                onNewSale={() => setActiveTab('customer-invoices')}
                onNewPurchase={() => setActiveTab('purchase-invoices')}
                onNewBanking={() => setActiveTab('banking')}
                onNewProduct={() => setActiveTab('stock')}
              />
            )}

            {activeTab === 'day-book' && <DayBookModule />}
            {activeTab === 'chart-of-accounts' && <AccountInformationPage />}
            {activeTab === 'stock' && <StockManagement />}
            {activeTab === 'price-list' && <PriceListManagement />}
            {activeTab === 'stock-reports' && <StockReports />}
            {activeTab === 'customer-invoices' && <CustomerInvoices />}
            {activeTab === 'customers' && <CustomerManagement />}
            {activeTab === 'purchase-invoices' && <PurchaseInvoices />}
            {activeTab === 'vouchers' && <VouchersLedger />}
            {activeTab === 'banking' && <BankingModule />}
            {activeTab === 'employees' && <EmployeesPayrollModule />}
            {activeTab === 'parties' && <CustomerSupplierLedger />}
            {activeTab === 'financial-reports' && <FinancialReports />}
            {activeTab === 'audit-log' && <UserActivityLogReport />}
            {activeTab === 'users' && <UserManagement />}
            {activeTab === 'backup' && <BackupRestoreModule />}
            {activeTab === 'settings' && <SettingsModule />}
          </div>
        </main>
      </div>

      {/* Modals & Overlays */}
      <NewCustomerModal />
      <ReceivePaymentModal />
      <PayableVoucherModal />
      <JournalVoucherModal />
      <BankEntryModal />
      <NewProductModal />
      <BiltyUpdateModal />
      <AccountInformationModal />
      <PrintSalarySlipModal />
      <PrintInvoiceModal />
      <PrintVoucherModal />
      <ImageViewerModal />
      <WhatsAppInvoiceModal />
      <GlobalSearchModal />
      <ChequeSearchModal />
      <ClearDemoDataModal />
      <SaleReturnModal />
      <TagPrintingModal />
      <StockAdjustmentModal />
      <PrintPreviewModal />
      <AIAgentGuideModal />
      <CustomerLedgerModal
        customer={selectedCustomerForLedger}
        onClose={() => setSelectedCustomerForLedger(null)}
      />

      {/* Floating AI Guide Assistant Copilot */}
      <FloatingAIGuideButton />

      {/* Keyboard Shortcuts Global Listener & Floating Bar */}
      <KeyboardShortcutsManager />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
